<template>
  <div ref="list" class="vue-recyclist">
    <div ref="items" class="vue-recyclist-items">
      <div class="vue-recyclist-item vue-recyclist-tomb" v-for="t in tombs" v-if="tombstone">
        <slot name="tombstone"></slot>
      </div>
      <div ref="item" class="vue-recyclist-item" v-for="(item, index) in items">
        <slot name="item" :data="item.data" :index="index"></slot>
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
        name: 'VueRecyclist',
        items: [], // Full list items
        height: 0, // Full list height
        top: 0, // Full list scrollTop
        loaded: 0, // Loaded items index
        some: 0
      }
    },
    props: {
      list: {
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
    watch: {
      list () {
        for (let i = this.loaded; i < this.list.length; i++) {
          this.items.push({
            data: this.list[i],
            node: null,
            height: 0,
            top: 0
          })
          this.top = this.$refs.list.scrollTop
          this.$nextTick(() => {
            const d = this.items[i]
            d.node = this.$refs.item[i]
            d.height = d.node.offsetHeight
            d.top = this.height
            this.height = d.top + d.height
            this.$refs.items.style.height = this.height + 'px'
            this.$refs.list.scrollTop = this.top
            this.$refs.item[i].style.opacity = 1
            this.$refs.item[i].style.transform = 'translate3d(0,' + d.top + 'px,0)'
          })
        }
        this.loaded = this.list.length
      }
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
        console.log('resize')
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
        opacity: 0;
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