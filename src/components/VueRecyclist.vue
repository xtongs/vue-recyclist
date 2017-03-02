<template>
  <div class="vue-recyclist">
    <div ref="list" class="vue-recyclist-items">
      <!--Fix iOS scrolling touch problem caused by transform-->
      <div class="vue-recyclist-fix"></div>
      <div ref="tomb" class="vue-recyclist-item vue-recyclist-tomb" v-for="t in size * 2" v-if="tombstone" :style="tombStyle(t-1)">
        <slot name="tombstone"></slot>
      </div>
      <div ref="item" class="vue-recyclist-item" :style="{transform: 'translate3d(0,' + item.top + 'px,0)', opacity: +!!item.height}"
        v-for="(item, index) in items" v-if="index >= start - size && index < start + size">
        <slot name="item" :data="item.data" :index="index"></slot>
    </div>
    <div :ref="'item'+index" class="vue-recyclist-item" :style="{transform: 'translate3d(0,-10000px,0)'}" v-for="(item, index) in items"
      v-if="!item.height && !item.top">
      <slot name="item" :data="item.data"></slot>
  </div>
  </div>

  <div class="vue-recyclist-loading" v-show="loading && !nomore && !tombstone">
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
    data() {
      return {
        name: 'VueRecyclist',
        items: [], // Wrapped full list items
        tombHeight: 0, // Tombstone height
        height: 0, // Full list height
        top: 0, // Full list scrollTop
        start: 0 // Visible items start index
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
        default: 10 // The number of items on one page.
      },
      offset: {
        type: Number,
        default: 200 // The number of pixels of additional length to allow scrolling to.
      },
      loadinit: {
        type: Function, // The function of loading init items.
        required: true
      },
      loadmore: {
        type: Function, // The function of loading more items.
        required: true
      },
      loading: {
        type: Boolean,
        default: true // Whether to show loading status.
      },
      nomore: {
        type: Boolean,
        default: false // Whether to show nomore status.
      }
    },
    watch: {
      list(val) {
        if (val.length > this.items.length) {
          let loads = []
          // only push newly added items
          for (let i = this.items.length; i < this.list.length; i++) {
            this.items.push({
              data: this.list[i],
              height: 0,
              top: 0
            })
            // remember last scrolltop
            this.top = this.$el.scrollTop
            // update full list height and newly added items position
            loads.push(this.$nextTick().then(() => {
              this.updateItem(i)
              // restore list scrolltop
              this.$el.scrollTop = this.top
            }))
          }
          // fill list
          Promise.all(loads).then(() => {
            this.fillList()
          })
        } else {
          // when removing items from list, reset list
          this.items = []
          this.height = this.top = this.start = 0
          this.$el.scrollTop = 0
          this.updateHeight()
        }
      }
    },
    mounted() {
      this.$el.addEventListener('scroll', this.onScroll.bind(this))
      window.addEventListener('resize', this.onResize.bind(this))
      this.loadinit()
      this.fillTomb()
    },
    methods: {
      fillTomb() {
        // add tombs on empty page
        if (this.tombstone) {
          this.$nextTick(() => {
            this.tombHeight = this.$refs.tomb[0] && this.$refs.tomb[0].offsetHeight
          })
        }
      },
      fillList() {
        // fullfill list if current list height is less than container height
        if (this.height < this.$el.offsetHeight) {
          this.loadmore()
        }
      },
      tombStyle(index) {
        // get tombs style
        let lastItem = this.items.length ? this.items[this.items.length - 1] : null
        let itemsHeight = lastItem ? lastItem.top + lastItem.height : 0
        return {
          transform: 'translate3d(0,' + (Math.min(this.height, itemsHeight) + index * this.tombHeight) + 'px,0)'
        }
      },
      updateHeight() {
        // update list height
        this.$refs.list.style.height = this.height + 'px'
      },
      updateItem(index) {
        if (this.$refs['item' + index][0]) {
          // set current item height and top
          this.items[index].height = this.$refs['item' + index][0].offsetHeight
          // loop all items to update list height
          this.height = 0
          for (let i = 0; i < this.items.length; i++) {
            if (i < index) {
              this.items[index].top += this.items[i].height
            }
            this.height += this.items[i].height
          }
          // update list height
          this.updateHeight()
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
            this.height = this.height + this.tombHeight * this.size
            this.updateHeight()
            this.loadmore()
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
        opacity: 0;
        overflow: hidden;
      }
      .vue-recyclist-item {
        position: absolute;
        opacity: 0;
        z-index: 1;
        transition-property: opacity;
        transition-duration: $duration;
        &.vue-recyclist-tomb {
          opacity: 1;
          z-index: 0;
          transition-duration: 0ms;
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