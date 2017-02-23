<template>
  <div id="app">
    <header>
      <h1>VueRecyclist</h1>
      <h2>Infinite scroll list for Vue.js with DOM recycling.</h2>
    </header>
    <vue-recyclist class="list" :items="list">
      <div slot="tombstone">tombstone</div>

      <template slot="item" scope="props">
        <div class="li" @click="itemClicked(props)">{{ props.index }} - {{props.data}}</div>
      </template>

      <div slot="spinner">spinner</div>
    </vue-recyclist>
  </div>
</template>

<script>
import VueRecyclist from '../src/index'
export default {
  name: 'app',
  data () {
    return {
      list: new Array(100).join(0).split('')
    }
  },
  components: {
    'vue-recyclist': VueRecyclist
  },
  mounted () {

  },
  methods: {
    itemClicked (props) {
      console.log(props)
    }
  }
}
</script>

<style lang="scss">
  html {
    height: 100%;
  }
  body {
    margin: 0;
    padding: 0;
    height: 100%;
    #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      overflow: hidden;
      padding: 100px 20px 50px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      background: #f3f4f5;
      header {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100px;
        padding: 10px 0;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        h1, h2 {
          font-weight: normal;
          margin: 0;
        }
        h1 {
          font-size: 24px;
        }
        h2 {
          font-size: 14px;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  .list {
    width: 375px;
    max-width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 0;
    border: 1px solid #eee;
    background: #fff;
    list-style-type: none;
    text-align: center;
    .li {
      display: block;
      height: 50px;
      line-height: 50px;
      padding: 0 10px;
      text-align: left;
      & + .li {
        border-top: 1px solid #eee;
      }
    }
  }
</style>
