<template>
  <div id="app">
    <header>
      <h1>VueRecyclist</h1>
      <h2>Infinite scroll list for Vue.js with DOM recycling. <a href="https://github.com/xtongs/vue-recyclist">Github</a></h2>
      <a @click="tombstone = !tombstone">{{ tombstone ? 'hide' : 'show'}} tombstones</a>
    </header>
    <vue-recyclist class="list" :list="list" :tombstone="tombstone" :size="size" :offset="offset"       :loadmore="loadItems" :spinner="spinner" :nomore="nomore">
      <template slot="tombstone" scope="props">
        <div class="item tombstone">
          <img class="avatar" src="./images/unknown.svg" />
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

      <template slot="item" scope="props">
        <div class="item" @click="itemClicked(props)">
          <img class="avatar" :src="props.data.avatar" />
          <div class="bubble">
            <p>{{ props.data.msg }}</p>
            <div class="meta">
              <time class="posted-date">{{ props.data.time }}</time>
            </div>
          </div>
        </div>
      </template>

      <!--<div slot="spinner">Loading Data</div>-->
      <!--<div slot="nomore">No More Data</div>-->
      </vue-recyclist>
      <p class="info">Inspired by <a href="https://developers.google.com/web/updates/2016/07/infinite-scroller">Complexities of an Infinite Scroller</a></p>
  </div>
</template>

<script>
  import Data from './data'
  import VueRecyclist from '../src/index'
  export default {
    name: 'app',
    data() {
      return {
        // data
        initTime: new Date().getTime(),
        id: 0,
        num: 10,
        // list
        list: [],
        tombstone: !!+localStorage['tombstone'],
        size: this.num,
        offset: 0,
        spinner: true,
        nomore: false
      }
    },
    components: {
      'vue-recyclist': VueRecyclist
    },
    watch: {
      tombstone(val) {
        localStorage['tombstone'] = +val
        this.id = 0
        this.list = []
        this.loadItems()
      }
    },
    methods: {
      getItem(id) {
        const avatar = Math.floor(Math.random() * Data.avatars)
        const msg = Data.messages[Math.floor(Math.random() * Data.messages.length)]
        return {
          id: 10000 + id,
          avatar: './images/avatar' + avatar + '.svg',
          msg: msg,
          time: new Date(Math.floor(this.initTime + id * this.num * 1000 + Math.random() * this.num * 1000)).toString(),
        }
      },
      loadItems() {
        let items = []
        setTimeout(() => {
          for (let i = 0; i < this.num; i++) {
            items.push(this.getItem(this.id++))
          }
          this.list = this.list.concat(items)
        }, 1000)
      },
      itemClicked(props) {
        console.log('Item:' + props.index, props.data)
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
        h1,
        h2 {
          font-weight: normal;
          margin: 0;
        }
        h1 {
          font-size: 24px;
        }
        h2 {
          font-size: 14px;
          a {
            color: inherit;
          }
        }
        a {
          font-size: 12px;
          text-decoration: underline;
          margin-top: 10px;
        }
      }
      .info {
        font-size: 12px;
        color: #999;
        a {
          font-style: italic;
          color: inherit;
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
    list-style-type: none;
    text-align: center;
    background: #eee;
    .item {
      display: flex;
      padding: 10px 0;
      width: 100%;
      text-align: left;
      .avatar {
        border-radius: 500px;
        margin-left: 15px;
        margin-right: 6px;
        min-width: 48px;
        width: 48px;
        height: 48px;
        background-color: #ddd;
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
        box-shadow: 0 3px 2px rgba(0, 0, 0, 0.1);
        position: relative;
        max-width: 420px;
        min-width: 80px;
        margin: 0 20px 0 5px;
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