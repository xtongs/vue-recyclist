<template>
  <div class="vue-recyclist">
    <div ref="list" class="vue-recyclist-items" :style="{height: height + 'px'}">
      <div v-for="(item, index) in items" v-if="index >= start - size && index < start + size"
        class="vue-recyclist-item"
        :style="{top: item.top + 'px'}">
        <div v-show="tombstone" :class="{'vue-recyclist-transition': tombstone}" :style="{opacity: +!item.loaded}">
          <slot name="tombstone"></slot>
        </div>
        <div :class="{'vue-recyclist-transition': tombstone}" :style="{opacity: +item.loaded}">
          <slot name="item" :data="item.data" :index="index"></slot>
        </div>
      </div>

      <!--get tombstone and item heights from these invisible doms-->
      <div :ref="'item'+index" v-for="(item, index) in items" v-if="!item.tomb && !item.height"
        class="vue-recyclist-item vue-recyclist-invisible">
        <slot name="item" :data="item.data"></slot>
      </div>
      <div ref="tomb" class="vue-recyclist-item vue-recyclist-invisible">
        <slot name="tombstone"></slot>
      </div>
    </div>

    <div v-show="spinner && !nomore && !tombstone"
      class="vue-recyclist-loading"
      :style="{visibility: loading ? 'visible' : 'hidden'}">
      <slot name="spinner">
        <div class="vue-recyclist-loading-content">
          <div class="cssloading-circle spinner"></div>
        </div>
      </slot>
    </div>

    <div v-show="nomore && !loading"
      class="vue-recyclist-nomore">
      <slot name="nomore">
        <div>End of list</div>
      </slot>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        name: 'VueRecyclist',
        items: [], // Wrapped full list items
        height: 0, // Full list height
        loadings: [], // Loading status queue
        start: 0, // Visible items start index
        startOffset: 0 // Start item offset
      }
    },
    computed: {
      containerHeight() {
        return this.$el && this.$el.offsetHeight || 0
      },
      tombHeight() {
        return this.tombstone ? this.$refs.tomb && this.$refs.tomb.offsetHeight : 0
      },
      loading() {
        return this.loadings.length
      }
    },
    props: {
      list: {
        type: Array,
        required: true
      },
      tombstone: {
        type: Boolean,
        default: false // Whether to show tombstones.
      },
      size: {
        type: Number,
        default: 10 // The number of items added each time.
      },
      offset: {
        type: Number,
        default: 200 // The number of pixels of additional length to allow scrolling to.
      },
      loadmore: {
        type: Function, // The function of loading more items.
        required: true
      },
      spinner: {
        type: Boolean,
        default: true // Whether to show loading spinner.
      },
      nomore: {
        type: Boolean,
        default: false // Whether to show 'no more data' status bar
      }
    },
    watch: {
      list(arr) {
        if (arr.length) {
          this.loadings.pop()
          if (!this.loading) {
            this.loadItems()
          }
        } else {
          this.init()
        }
      },
      items(arr) {
        if (arr.length > this.list.length) {
          this.getItems()
        }
      }
    },
    mounted() {
      this.$el.addEventListener('scroll', this.onScroll.bind(this))
      window.addEventListener('resize', this.onResize.bind(this))
      this.init()
    },
    methods: {
      init() {
        this.reset()
        this.load()
      },
      reset() {
        this.items = []
        this.height = this.top = this.start = 0
        this.$el.scrollTop = 0
      },
      load() {
        if (this.tombstone) {
          this.items.length += this.size
          this.loadItems()
        } else if (!this.loading) {
          this.getItems()
        }
      },
      getItems() {
        this.loadings.push(1)
        this.loadmore()
      },
      loadItems() {
        let loads = []
        let start = 0
        let end = this.tombstone ? this.items.length : this.list.length
        for (let i = start; i < end; i++) {
          if (this.items[i] && this.items[i].loaded) {
            continue
          }
          this.setItem(i, this.list[i] || null)
          // update newly added items position
          loads.push(this.$nextTick().then(() => {
            this.updateItemHeight(i)
          }))
        }
        // update items top and full list height
        Promise.all(loads).then(() => {
          this.updateItemTop()
        })
      },
      setItem(index, data) {
        this.$set(this.items, index, {
          data: data ? data : {},
          height: 0,
          top: 0,
          tomb: !data,
          loaded: !!data
        })
      },
      updateItemHeight(index) {
        // update item height
        let cur = this.items[index]
        let dom = this.$refs['item' + index]
        if (dom && dom[0]) {
          cur.height = dom[0].offsetHeight
        } else {
          // item is tombstone
          cur.height = this.tombHeight
        }
      },
      updateItemTop() {
        // loop all items to update item top and list height
        this.height = 0
        for (let i = 0; i < this.items.length; i++) {
          let pre = this.items[i - 1]
          this.items[i].top = pre ? pre.top + pre.height : 0
          this.height += this.items[i].height
        }
        // update scroll top when needed
        if (this.startOffset) {
          this.setScrollTop()
        }
        this.updateIndex()
      },
      updateIndex() {
        // update visible items start index
        let top = this.$el.scrollTop
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].top > top) {
            this.start = Math.max(0, i - 1)
            break
          }
        }
        this.getStartItemOffset()
      },
      getStartItemOffset() {
        this.startOffset = this.items[this.start].top - this.$el.scrollTop
      },
      setScrollTop() {
        this.$el.scrollTop = this.items[this.start].top - this.startOffset
      },
      onScroll() {
        if (this.$el.scrollTop + this.$el.offsetHeight > this.height - this.offset) {
          this.load()
        }
        this.updateIndex()
      },
      onResize() {
        this.getStartItemOffset()
        this.items.forEach((item) => {
          item.loaded = false
        })
        this.loadItems()
      }
    },
    destroyed() {
      this.$el.removeEventListener('scroll', this.onScroll.bind(this))
      window.removeEventListener('resize', this.onResize.bind(this))
    }
  }

</script>
<style src="./cssloading.css"></style>
<style lang="scss" scoped>
  $duration: 500ms;
  .vue-recyclist {
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .vue-recyclist-items {
      position: relative;
      margin: 0;
      padding: 0;
      .vue-recyclist-invisible {
        top: -100px;
        visibility: hidden;
      }
      .vue-recyclist-item {
        position: absolute;
        width: 100%;
        .vue-recyclist-transition {
          position: absolute;
          opacity: 0;
          transition-property: opacity;
          transition-duration: $duration;
        }
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