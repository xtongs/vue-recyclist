<template>
  <div class="vue-recyclist">
    <slot name="tombstone"></slot>
    <div class="vue-recyclist-items">
      <slot name="item" v-for="(item, index) in items" :data="item" :index="index"></slot>
    </div>
    <slot name="spinner"></slot>
  </div>
</template>
<script>
  export default {
    props: ['items'],
    data() {
      return {
        name: 'VueRecyclist'
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
<style lang="scss" scoped>
  .vue-recyclist {
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .vue-recyclist-items {
      margin: 0;
      padding: 0;
    }
  }
</style>