# vue-recyclist

> Infinite scroll list for Vue.js (v2.1+) with DOM recycling.

## [Demo](https://xtongs.github.io/vue-recyclist/)

## Installation

###

``` bash
npm install -D vue-recyclist
```

## Import

``` javascript
import VueRecyclist from 'vue-recyclist'

export default {
  ...
  components: {
    VueRecyclist,
  },
  ...
}
```

or

``` html
<script src="/path/to/vue-recyclist/dist/vue-recyclist.js"></script>
```

## Usage
``` html
<template>
  <div>
    ...
    <vue-recyclist
      :list = "list"
      :tombstone = "tombstone"
      :size = "size"
      :offset = "offset"
      :loadmore = "loadmore"
      :spinner = "spinner"
      :nomore = "nomore">
      <!-- tombstone slot -->
      <template slot="tombstone" scope="props">
        ...
      </template>
      <!-- item slot -->
      <template slot="item" scope="props">
        ...
      </template>
      <!-- loading spinner -->
      <div slot="spinner">Loading...</div>
      <!-- end of list -->
      <div slot="nomore">No More Data</div>
    </vue-recyclist>
    ...
  </div>
</template>

<script>
import VueRecyclist from 'vue-recyclist'
export default {
  data() {
    ...
  },
  components: {
    'vue-recyclist': VueRecyclist
  },
  methods: {
    loadmore() {
      // Fetch more items
      ...
    }
  }
}
</script>
```

## Options

| Directive | Type     | Default  |                                                                 |
| --------- | ---------| -------- | --------------------------------------------------------------- |
| list      | Array    | required | List of items                                                   |
| tombstone | Boolean  | false    | Whether to show tombstones                                      |
| size      | Number   | 10       | The number of items added each time                             |
| offset    | Number   | 200      | The number of pixels of additional length to allow scrolling to |
| loadmore  | Function | required | The function of loading more items                              |
| spinner   | Boolean  | true     | Whether to show loading spinner                                 |
| nomore    | Boolean  | false    | Whether to show 'no more data' status bar                       |

## Development

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
