<template>
  <div class="vue-recyclist">
    <div class="vue-recyclist-items">
      <div class="vue-recyclist-item vue-recyclist-tomb" v-for="t in tombs" v-if="tombstone">
        <slot name="tombstone"></slot>
      </div>
      <div class="vue-recyclist-item" v-for="(item, index) in items">
        <slot name="item" :data="item" :index="index"></slot>
      </div>
      <div class="vue-recyclist-item vue-recyclist-tomb" v-for="t in tombs" v-if="tombstone">
        <slot name="tombstone"></slot>
      </div>
    </div>

    <div class="vue-recyclist-loading" v-show="loading && !nomore">
      <slot name="loading">
        <div class="vue-recyclist-loading-content">
          <div class="cssloading-circle spinner"></div>
        </div>
      </slot>
    </div>

    <div class="vue-recyclist-nomore" v-show="nomore && !loading">
      <slot name="nomore">
        <div>End of list</div>
      </slot>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        name: 'VueRecyclist'
      }
    },
    props: {
      items: {
        type: Array,
        default: () => []
      },
      tombstone: {
        type: Boolean,
        default: false // Whether to show tombstones.
      },
      tombs: {
        type: Number,
        default: 10 // Number of tombstones beyond current view in both scroll directions.
      },
      duration: {
        type: Number,
        default: 200 // The animation interval (in ms) for fading in content from tombstones.
      },
      offset: {
        type: Number,
        default: 500 // The number of pixels of additional length to allow scrolling to.
      },
      loadmore: {
        type: Function
      },
      loading: {
        type: Boolean,
        default: true // Whether to show loading status bar.
      },
      nomore: {
        type: Boolean,
        default: false // Whether to show end of list status bar.
      }
    },
    computed: {

    },
    mounted () {
      this.$el.addEventListener('scroll', this.onScroll.bind(this))
      window.addEventListener('resize', this.onResize.bind(this))
    },
    methods: {
      onScroll () {
        const top = this.$el.scrollTop
        const ch = this.$el.offsetHeight
        const sh = this.$el.scrollHeight
        if (top + ch > sh - this.offset && !this.loading) {
          this.loadmore()
        }
      },
      onResize () {
        console.log(this.$el.scrollTop)
      }
    },
    destroyed () {
      this.$el.removeEventListener('scroll', this.onScroll.bind(this))
      window.removeEventListener('resize', this.onResize.bind(this))
    }
  }
</script>
<style src="./cssloading.css"></style>
<style lang="scss" scoped>
  .vue-recyclist {
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .vue-recyclist-items {
      position: relative;
      margin: 0;
      padding: 0;
      .vue-recyclist-item {
        position: absolute;
      }
    }
    .vue-recyclist-loading {
      overflow: hidden;
      .vue-recyclist-loading-content {
        width: 100%;
        text-align: center;
        .spinner {
          margin: 10px auto;
          width: 20px;
          height: 20px;
        }
      }
    }
    .vue-recyclist-nomore {
      overflow: hidden;
      margin: 10px auto;
      height: 20px;
      text-align: center;
    }
  }
</style>