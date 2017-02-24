<template>
  <div id="app">
    <header>
      <h1>VueRecyclist</h1>
      <h2>Infinite scroll list for Vue.js with DOM recycling.</h2>
    </header>
    <vue-recyclist class="list" :items="list">
      <div slot="tombstone" class="item tombstone">
        <img class="avatar" src="./images/unknown.jpg"/>
        <div class="bubble">
          <p></p>
          <p></p>
          <p></p>
          <div class="meta">
            <time class="posted-date"></time>
          </div>
        </div>
      </div>

      <template slot="item" scope="props">
        <div class="item" @click="itemClicked(props)">
          <img class="avatar" src="./images/unknown.jpg"/>
          <div class="bubble">
            <p></p>
            <p></p>
            <p></p>
            <div class="meta">
              <time class="posted-date"></time>
            </div>
          </div>
        </div>
      </template>

      <!--<div slot="loading">spinner</div>-->
    </vue-recyclist>
  </div>
</template>

<script>
import Data from './data'
import VueRecyclist from '../src/index'
export default {
  name: 'app',
  data () {
    return {
      list: new Array(10).join(0).split(''),
      data: Data
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
      background: #fff;
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
      .cssloading-circle {
        background: #eee;
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
    border: 1px solid #ddd;
    background: #fff;
    list-style-type: none;
    text-align: center;
    background: #eee;
    .item {
      display: flex;
      padding: 10px 0;
      width: 100%;
      will-change: transform;
      .avatar {
        border-radius: 500px;
        margin-left: 20px;
        margin-right: 6px;
        min-width: 48px;
        width: 48px;
        height: 48px;
      }
      p {
        margin: 0;
        word-wrap: break-word;
        font-size: 14px;
      }
      &.tombstone {
        p {
          width: 100%;
          height: 0.5em;
          background-color: #ccc;
          margin: 0.5em 0;
        }
      }
      .bubble {
        padding: 7px 10px;
        color: #333;
        background: #fff;
        box-shadow: 0 3px 2px rgba(0,0,0,0.1);
        position: relative;
        max-width: 420px;
        min-width: 80px;
        margin: 0 5px;
        &:before {
          content: '';
          border-style: solid;
          border-width: 0 10px 10px 0;
          border-color: transparent #fff transparent transparent;
          position: absolute;
          top: 0;
          left: -10px;
        }
      }
      .meta {
        font-size: 0.8rem;
        color: #999;
        margin-top: 3px;
      }
    }
  }
</style>
