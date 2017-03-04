<template>
  <div class="vue-recyclist">
    <div ref="list" class="vue-recyclist-items" :style="{height: height + 'px'}">
      <!--Fix iOS scrolling touch problem caused by transform-->
      <div class="vue-recyclist-fix"></div>

      <div v-for="(item, index) in items" v-if="index >= start - size && index < start + size"
        class="vue-recyclist-item" :class="{'vue-recyclist-transition': tombstone && !item.tomb}"
        :style="{transform: 'translate3d(0,' + item.top + 'px,0)'}">
        <slot v-if="!item.tomb" name="item" :data="item.data" :index="index"></slot>
        <slot v-else-if="tombstone" name="tombstone"></slot>
      </div>

      <div :ref="'item'+index" v-for="(item, index) in items" v-if="!item.tomb && !item.height"
        class="vue-recyclist-item vue-recyclist-invisible">
        <slot name="item" :data="item.data"></slot>
      </div>
      <!--get tombstone and item heights from these invisible doms-->
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
        acturalHeight: 0, // Full list actural height
        loading: false, // Loading status
        start: 0, // Visible items start index
        startOffset: 0 // Start item scroll top offset
      }
    },
    computed: {
      containerHeight() {
        return this.$el && this.$el.offsetHeight || 0
      },
      tombHeight() {
        return this.tombstone ? this.$refs.tomb && this.$refs.tomb.offsetHeight : 0
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
        default: false // Whether to show nomore status.
      }
    },
    watch: {
      list(arr) {
        if (arr.length) {
          this.loading = false
          this.loadItems()
        } else {
          this.init()
        }
      },
      items(arr) {
        if (arr.length > this.list.length) {
          this.loading = true
          this.loadmore()
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
        // init
        this.reset()
        this.load()
      },
      reset() {
        // reset list
        this.items = []
        this.height = this.top = this.start = 0
        this.$el.scrollTop = 0
        this.updateItemTop()
      },
      load() {
        if (this.tombstone) {
          this.items.length += this.size
          this.loadItems()
        } else {
          this.loading = true
          this.loadmore()
        }
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
          // update full list height and newly added items position
          loads.push(this.$nextTick().then(() => {
            this.updateItemHeight(i)
          }))
        }

        // fill list
        Promise.all(loads).then(() => {
          this.updateItemTop()
        })
      },
      setItem(index, data) {
        this.$set(this.items, index, {
          data: data ? data : null,
          height: 0,
          top: this.top + this.height,
          tomb: !data,
          loaded: !!data
        })
      },
      updateItemHeight(index) {
        // update item height
        let cur = this.items[index]
        let dom = this.$refs['item' + index]
        if (dom && dom[0]) {
          // set current item height and top
          cur.height = dom[0].offsetHeight
        } else {
          // item is tombstone
          cur.height = this.tombHeight
        }
      },
      updateItemTop() {
        // loop all items to update item top and list height
        this.height = this.acturalHeight = 0
        for (let i = 0; i < this.items.length; i++) {
          let pre = this.items[i - 1]
          this.items[i].top = pre ? pre.top + pre.height : 0
          this.height += this.items[i].height
          this.acturalHeight += this.items[i].tomb ? 0 : this.items[i].height
        }
        if (this.startOffset) {
          this.$el.scrollTop = this.items[this.start].top - this.startOffset
        }
      },
      updateIndex() {
        // update visible items start index
        let top = this.$el.scrollTop
        let s = this.start
        if (this.items[s]) {
          if (this.items[s].top < top) {
            for (let i = s + 1; i < this.items.length; i++) {
              if (this.items[i] && this.items[i].top <= top) {
                this.start++
              }
            }
          } else {
            for (let i = s; i > 0; i--) {
              if (this.items[i].top > top) {
                this.start--
              }
            }
          }
        }
      },
      onScroll() {
        this.startOffset = 0
        if (this.$el.scrollTop + this.$el.offsetHeight > this.height - this.offset) {
          if (this.tombstone) {
            this.items.length += this.size
            this.loadItems()
          } else {
            this.loading = true
            this.loadmore()
          }
        }
        this.updateIndex()
      },
      onResize() {
        this.startOffset = this.items[this.start].top - this.$el.scrollTop
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
      .vue-recyclist-fix {
        height: 1px;
        margin-top: -1px;
        overflow: hidden;
      }
      .vue-recyclist-item {
        position: absolute;
        z-index: 1;
        &.vue-recyclist-transition {
          transition-property: all;
          transition-duration: $duration;
        }
        &.vue-recyclist-invisible {
          transform: translate3d(0, -10000px, 0);
          visibility: hidden;
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