<template>
  <div class="vue-recyclist">
    <div ref="list" class="vue-recyclist-items" :style="{height: height + 'px'}">
      <!--Fix iOS scrolling touch problem caused by transform-->
      <div class="vue-recyclist-fix"></div>

      <div v-for="(item, index) in items" v-if="index >= start - size * 2 && index < start + size * 2"
        class="vue-recyclist-item" :class="{'vue-recyclist-transition': tombstone && !item.tomb}"
        :style="{transform: 'translate3d(0,' + item.top + 'px,0)'}">
        <slot v-if="!item.tomb" name="item" :data="item.data" :index="index"></slot>
        <slot v-else-if="tombstone" name="tombstone"></slot>
      </div>

      <!--get tombstone and item heights from these invisible doms-->
      <div ref="tomb" class="vue-recyclist-item vue-recyclist-invisible">
        <slot name="tombstone"></slot>
      </div>
      <div :ref="'item'+index" v-for="(item, index) in items" v-if="!item.tomb && !item.height"
        class="vue-recyclist-item vue-recyclist-invisible">
        <slot name="item" :data="item.data"></slot>
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
        top: 0, // Full list scrollTop
        start: 0 // Visible items start index
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
      loading: {
        type: Boolean, // Loading status
        default: false
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
      list(val) {
        if (val.length) {
          this.load()
        } else {
          this.init()
        }
      },
      start() {
        // this.loadItems()
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
        this.updateHeight()
      },
      load() {
        for (let i = this.start; i < this.start + this.size; i++) {
          if (!this.list[i]) {
            this.loadmore()
            break
          }
        }

        let loads = []
        for (let i = this.start; i < this.start + this.size; i++) {
          this.setItem(i, this.list[i] || null)
          // update full list height and newly added items position
          loads.push(this.$nextTick().then(() => {
            this.updateItem(i)
          }))
        }

        // fill list
        Promise.all(loads).then(() => {
          this.updateHeight()
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
        this.updateItem(index)
      },
      updateItem(index) {
        let cur = this.items[index]
        let pre = this.items[index - 1]
        let dom = this.$refs['item' + index]
        if (dom && dom[0]) {
          // set current item height and top
          cur.height = dom[0].offsetHeight
        } else {
          // item is tombstone
          cur.height = this.tombHeight
        }
        cur.top = pre ? pre.top + pre.height : 0
      },
      updateHeight() {
        // loop all items to update list height
        this.height = 0
        this.acturalHeight = 0
        for (let i = 0; i < this.items.length; i++) {
          this.height += this.items[i].height
          this.acturalHeight += this.items[i].tomb ? 0 : this.items[i].height
        }
        if (this.acturalHeight < this.$el.offsetHeight) {
          // this.load()
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
        if (this.$el.scrollTop + this.$el.offsetHeight > this.height - this.offset) {
          if (this.tombstone) {
            this.load()
          } else if (!this.loading) {
            this.loadmore()
          }
        }
        this.updateIndex()
      },
      onResize() {
        // remember last scrolltop, index and top of anchor item
        let top = this.$el.scrollTop
        let offset, index
        this.items.forEach((item, i) => {
          if (item.top > top && offset === undefined) {
            offset = item.top - top
            index = i
          }
          // reset item height and top
          item.height = item.top = 0
          this.$nextTick(() => {
            // recaculate item height and top then restore list scrolltop
            this.updateItem(i)
            this.$el.scrollTop = this.items[index].top - offset
          })
        })
        this.updateHeight()
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