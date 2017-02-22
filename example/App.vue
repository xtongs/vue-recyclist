<template>
  <div id="app">
    <h1>Infinite scroll component for Vue.js with DOM recycling.</h1>
    <vue-recyclist></vue-recyclist>
  </div>
</template>

<script>
import VueRecyclist from '../src/index'
export default {
  name: 'app',
  data () {
    return {

    }
  },
  components: {
    'vue-recyclist': VueRecyclist
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
