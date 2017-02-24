<template>
  <div class="vue-recyclist">
    <div class="vue-recyclist-items">
      <div class="vue-recyclist-item vue-recyclist-tomb" v-for="t in tombs">
        <slot name="tombstone"></slot>
      </div>
      <div class="vue-recyclist-item" v-for="(item, index) in items">
        <slot name="item" :data="item" :index="index"></slot>
      </div>
      <div class="vue-recyclist-item vue-recyclist-tomb" v-for="t in tombs">
        <slot name="tombstone"></slot>
      </div>
    </div>

    <div ref="loading" class="vue-recyclist-loading" v-show="loading && showLoading">
      <slot name="loading">
        <div class="vue-recyclist-loading-content">
          <div class="cssloading-circle spinner"></div>
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        name: 'VueRecyclist',
        showLoading: true
      }
    },
    props: {
      tombstone: {
        type: Boolean,
        default: true // Whether to show tombstones.
      },
      tombs: {
        type: Number,
        default: 10 // Number of tombstones beyond current view in both scroll directions.
      },
      offset: {
        type: Number,
        default: 2000 // The number of pixels of additional length to allow scrolling to.
      },
      duration: {
        type: Number,
        default: 200 // The animation interval (in ms) for fading in content from tombstones.
      },
      loading: {
        type: Boolean,
        default: true // Whether to show loading status bar.
      },
      items: {
        type: Array,
        default: () => []
      }
    },
    computed: {

    },
    mounted () {

    },
    methods: {

    },
    destroyed () {

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
      margin: 0;
      padding: 0;
    }
    .vue-recyclist-loading {
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
  }
</style>