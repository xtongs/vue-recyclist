(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VueRecyclist"] = factory();
	else
		root["VueRecyclist"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./example/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(10)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = { css: css, media: media, sourceMap: sourceMap }
    if (!newStyles[id]) {
      part.id = parentId + ':0'
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      part.id = parentId + ':' + newStyles[id].parts.length
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')
  var hasSSR = styleElement != null

  // if in production mode and style is already provided by SSR,
  // simply do nothing.
  if (hasSSR && isProduction) {
    return noop
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = styleElement || createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (!hasSSR) {
    update(obj)
  }

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(9)
__webpack_require__(8)

var Component = __webpack_require__(3)(
  /* script */
  __webpack_require__(4),
  /* template */
  __webpack_require__(7),
  /* scopeId */
  "data-v-ff0640b8",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = options.computed || (options.computed = {})
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = {
  data: function data() {
    return {
      name: 'VueRecyclist',
      items: [], // Wrapped full list items
      height: 0, // Full list height
      loadings: [], // Loading status queue
      start: 0, // Visible items start index
      startOffset: 0 // Start item offset
    };
  },

  computed: {
    visibleItems: function visibleItems() {
      return this.items.slice(Math.max(0, this.start - this.size), Math.min(this.items.length, this.start + this.size));
    },
    containerHeight: function containerHeight() {
      return this.$el && this.$el.offsetHeight || 0;
    },
    tombHeight: function tombHeight() {
      return this.tombstone ? this.$refs.tomb && this.$refs.tomb.offsetHeight : 0;
    },
    loading: function loading() {
      return this.loadings.length;
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
      default: 20 // The number of items added each time.
    },
    offset: {
      type: Number,
      default: 200 // The number of pixels of additional length to allow scrolling to.
    },
    loadmore: {
      type: Function,
      required: true // The function of loading more items.
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
    list: function list(arr) {
      if (arr.length) {
        this.loadings.pop();
        if (!this.loading) {
          this.loadItems();
        }
      } else {
        this.init();
      }
    },
    items: function items(arr) {
      if (arr.length > this.list.length) {
        this.getItems();
      }
    }
  },
  mounted: function mounted() {
    this.$el.addEventListener('scroll', this.onScroll.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
    this.init();
  },

  methods: {
    init: function init() {
      this.reset();
      this.load();
    },
    reset: function reset() {
      this.items = [];
      this.height = this.top = this.start = 0;
      this.$el.scrollTop = 0;
    },
    load: function load() {
      if (this.tombstone) {
        this.items.length += this.size;
        this.loadItems();
      } else if (!this.loading) {
        this.getItems();
      }
    },
    getItems: function getItems() {
      this.loadings.push(1);
      this.loadmore();
    },
    loadItems: function loadItems() {
      var _this = this;

      var loads = [];
      var start = 0;
      var end = this.tombstone ? this.items.length : this.list.length;

      var _loop = function _loop(i) {
        if (_this.items[i] && _this.items[i].loaded) {
          return 'continue';
        }
        _this.setItem(i, _this.list[i] || null);
        // update newly added items position
        loads.push(_this.$nextTick().then(function () {
          _this.updateItemHeight(i);
        }));
      };

      for (var i = start; i < end; i++) {
        var _ret = _loop(i);

        if (_ret === 'continue') continue;
      }
      // update items top and full list height
      Promise.all(loads).then(function () {
        _this.updateItemTop();
      });
    },
    setItem: function setItem(index, data) {
      this.$set(this.items, index, {
        data: data ? data : {},
        height: 0,
        top: -1000,
        tomb: !data,
        loaded: !!data
      });
    },
    updateItemHeight: function updateItemHeight(index) {
      // update item height
      var cur = this.items[index];
      var dom = this.$refs['item' + index];
      if (dom && dom[0]) {
        cur.height = dom[0].offsetHeight;
      } else {
        // item is tombstone
        cur.height = this.tombHeight;
      }
    },
    updateItemTop: function updateItemTop() {
      // loop all items to update item top and list height
      this.height = 0;
      for (var i = 0; i < this.items.length; i++) {
        var pre = this.items[i - 1];
        this.items[i].top = pre ? pre.top + pre.height : 0;
        this.height += this.items[i].height;
      }
      // update scroll top when needed
      if (this.startOffset) {
        this.setScrollTop();
      }
      this.updateIndex();
      this.makeScrollable();
    },
    updateIndex: function updateIndex() {
      // update visible items start index
      var top = this.$el.scrollTop;
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].top > top) {
          this.start = Math.max(0, i - 1);
          break;
        }
      }
      // scrolling does not need recalculate scrolltop
      // this.getStartItemOffset()
    },
    getStartItemOffset: function getStartItemOffset() {
      if (this.items[this.start]) {
        this.startOffset = this.items[this.start].top - this.$el.scrollTop;
      }
    },
    setScrollTop: function setScrollTop() {
      if (this.items[this.start]) {
        this.$el.scrollTop = this.items[this.start].top - this.startOffset;
        // reset start item offset
        this.startOffset = 0;
      }
    },
    makeScrollable: function makeScrollable() {
      // make ios -webkit-overflow-scrolling scrollable
      this.$el.classList.add('vue-recyclist-scrollable');
    },
    onScroll: function onScroll() {
      if (this.$el.scrollTop + this.$el.offsetHeight > this.height - this.offset) {
        this.load();
      }
      this.updateIndex();
    },
    onResize: function onResize() {
      this.getStartItemOffset();
      this.items.forEach(function (item) {
        item.loaded = false;
      });
      this.loadItems();
    }
  },
  destroyed: function destroyed() {
    this.$el.removeEventListener('scroll', this.onScroll.bind(this));
    window.removeEventListener('resize', this.onResize.bind(this));
  }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".vue-recyclist[data-v-ff0640b8]{overflow-x:hidden;overflow-y:auto}.vue-recyclist.vue-recyclist-scrollable[data-v-ff0640b8]{-webkit-overflow-scrolling:touch}.vue-recyclist .vue-recyclist-items[data-v-ff0640b8]{position:relative;margin:0;padding:0}.vue-recyclist .vue-recyclist-items .vue-recyclist-invisible[data-v-ff0640b8]{top:-1000px;visibility:hidden}.vue-recyclist .vue-recyclist-items .vue-recyclist-item[data-v-ff0640b8]{position:absolute;width:100%}.vue-recyclist .vue-recyclist-items .vue-recyclist-item .vue-recyclist-transition[data-v-ff0640b8]{position:absolute;opacity:0;transition-property:opacity;transition-duration:.5s}.vue-recyclist .vue-recyclist-loading[data-v-ff0640b8]{overflow:hidden}.vue-recyclist .vue-recyclist-loading .vue-recyclist-loading-content[data-v-ff0640b8]{width:100%;text-align:center}.vue-recyclist .vue-recyclist-loading .vue-recyclist-loading-content .spinner[data-v-ff0640b8]{margin:10px auto;width:20px;height:20px}.vue-recyclist .vue-recyclist-nomore[data-v-ff0640b8]{overflow:hidden;margin:10px auto;height:20px;text-align:center}", ""]);

// exports


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "@-webkit-keyframes csl-rotate{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes csl-rotate{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.cssloading-circle{box-sizing:border-box;display:block;position:relative;width:30px;height:30px;font-size:2px;color:#87cefa;background:#fff;border-radius:50%;overflow:hidden;-webkit-animation:csl-rotate 1s infinite linear;animation:csl-rotate 1s infinite linear}.cssloading-circle:after,.cssloading-circle:before{content:\"\";display:block;position:absolute}.cssloading-circle:before{top:0;right:0;bottom:0;left:0;font-size:100em;border:.01em solid currentColor;border-radius:50%}.cssloading-circle:after{top:0;left:50%;width:50%;height:50%;-webkit-transform:translate3d(0,100%,0) skew(20deg,20deg) rotate(0deg);transform:translate3d(0,100%,0) skew(20deg,20deg) rotate(0deg);-webkit-transform-origin:left top;transform-origin:left top;background-color:inherit}", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "vue-recyclist"
  }, [_c('div', {
    ref: "list",
    staticClass: "vue-recyclist-items",
    style: ({
      height: _vm.height + 'px'
    })
  }, [_vm._l((_vm.visibleItems), function(item, index) {
    return _c('div', {
      staticClass: "vue-recyclist-item",
      style: ({
        transform: 'translate3d(0,' + item.top + 'px,0)'
      })
    }, [_c('div', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (_vm.tombstone),
        expression: "tombstone"
      }],
      class: {
        'vue-recyclist-transition': _vm.tombstone
      },
      style: ({
        opacity: +!item.loaded
      })
    }, [_vm._t("tombstone")], 2), _vm._v(" "), _c('div', {
      class: {
        'vue-recyclist-transition': _vm.tombstone
      },
      style: ({
        opacity: +item.loaded
      })
    }, [_vm._t("item", null, {
      data: item.data,
      index: index
    })], 2)])
  }), _vm._v(" "), _c('div', {
    staticClass: "vue-recyclist-pool"
  }, [_vm._l((_vm.items), function(item, index) {
    return (!item.tomb && !item.height) ? _c('div', {
      ref: 'item' + index,
      refInFor: true,
      staticClass: "vue-recyclist-item vue-recyclist-invisible"
    }, [_vm._t("item", null, {
      data: item.data
    })], 2) : _vm._e()
  }), _vm._v(" "), _c('div', {
    ref: "tomb",
    staticClass: "vue-recyclist-item vue-recyclist-invisible"
  }, [_vm._t("tombstone")], 2)], 2)], 2), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.spinner && !_vm.nomore && !_vm.tombstone),
      expression: "spinner && !nomore && !tombstone"
    }],
    staticClass: "vue-recyclist-loading",
    style: ({
      visibility: _vm.loading ? 'visible' : 'hidden'
    })
  }, [_vm._t("spinner", [_vm._m(0)])], 2), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.nomore && !_vm.loading),
      expression: "nomore && !loading"
    }],
    staticClass: "vue-recyclist-nomore"
  }, [_vm._t("nomore", [_c('div', [_vm._v("End of list")])])], 2)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "vue-recyclist-loading-content"
  }, [_c('div', {
    staticClass: "cssloading-circle spinner"
  })])
}]}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("84178ef4", content, true);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-ff0640b8&scoped=true!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./VueRecyclist.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-ff0640b8&scoped=true!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./VueRecyclist.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("32418388", content, true);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?minimize!../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-ff0640b8!./cssloading.css", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?minimize!../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-ff0640b8!./cssloading.css");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_VueRecyclist_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_VueRecyclist_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_VueRecyclist_vue__);


/* harmony default export */ __webpack_exports__["default"] = __WEBPACK_IMPORTED_MODULE_0__components_VueRecyclist_vue___default.a;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('vue-recyclist', __WEBPACK_IMPORTED_MODULE_0__components_VueRecyclist_vue___default.a);
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=vue-recyclist.js.map