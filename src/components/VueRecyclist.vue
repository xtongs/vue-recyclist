<template>
  <div class="vue-recyclist">
    <div ref="list" class="vue-recyclist-items">
      <div class="vue-recyclist-item vue-recyclist-tomb" v-for="t in size" v-if="tombstone">
        <slot name="tombstone"></slot>
      </div>
      <div ref="item" class="vue-recyclist-item" :style="{top: item.top + 'px'}" v-for="(item, index) in items" v-if="index >= start - size && index < start + size">
        <slot name="item" :data="item.data" :index="index"></slot>
      </div>
      <div class="vue-recyclist-item vue-recyclist-tomb" v-for="t in size" v-if="tombstone">
        <slot name="tombstone"></slot>
      </div>
      <div :ref="'item'+index" class="vue-recyclist-item" :style="{top: '-10000px'}" v-for="(item, index) in items" v-if="!item.height && !item.top">
        <slot name="item" :data="item.data"></slot>
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
    data() {
      return {
        name: 'VueRecyclist',
        items: [], // Wrapped full list items
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
        default: 500 // The number of pixels of additional length to allow scrolling to.
      },
      duration: {
        type: Number,
        default: 200 // The animation interval (in ms) for fading in content from tombstones.
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
        }
      }
    },
    mounted() {
      this.$el.addEventListener('scroll', this.onScroll.bind(this))
      window.addEventListener('resize', this.onResize.bind(this))
      this.loadinit()
    },
    methods: {
      fillList() {
        // fullfill list if current list height is less than container height
        if (this.height < this.$el.offsetHeight) {
          this.loadmore()
        }
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
          this.$refs.list.style.height = this.height + 'px'
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
        let top = this.$el.scrollTop
        let ch = this.$el.offsetHeight
        let sh = this.$el.scrollHeight
        if (top + ch > sh - this.offset && !this.loading) {
          this.loadmore()
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
        opacity: 1;
        z-index: 1;
        &.vue-recyclist-tomb {
          opacity: 1;
          z-index: 0;
          top: -10000px;
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