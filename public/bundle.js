/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	var raf = __webpack_require__(1)
	var sync = __webpack_require__(2)
	var offset = 0

	sync((location.protocol === 'https:' ? 'wss:' : 'ws:') +
	    '//' + location.host, function(err, result) {
	  if (err) {
	    document.body.className = 'err'
	  } else {
	    offset = result
	    document.body.className = 'ok'
	    update()
	  }
	}, function(result) {
	  offset = result
	  update()
	})

	function update() {
	  document.querySelector('#offset').innerHTML = offset + 'ms'
	}

	raf(frame)

	function frame() {
	  var insecond = ((Date.now() + offset) % 1000) / 1000
	  var opacity = Math.pow(1 - insecond, 2)
	  document.querySelector('#beat').style.opacity = opacity
	  raf(frame)
	}



/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var now = __webpack_require__(3)
	  , global = typeof window === 'undefined' ? {} : window
	  , vendors = ['moz', 'webkit']
	  , suffix = 'AnimationFrame'
	  , raf = global['request' + suffix]
	  , caf = global['cancel' + suffix] || global['cancelRequest' + suffix]
	  , isNative = true

	for(var i = 0; i < vendors.length && !raf; i++) {
	  raf = global[vendors[i] + 'Request' + suffix]
	  caf = global[vendors[i] + 'Cancel' + suffix]
	      || global[vendors[i] + 'CancelRequest' + suffix]
	}

	// Some versions of FF have rAF but not cAF
	if(!raf || !caf) {
	  isNative = false

	  var last = 0
	    , id = 0
	    , queue = []
	    , frameDuration = 1000 / 60

	  raf = function(callback) {
	    if(queue.length === 0) {
	      var _now = now()
	        , next = Math.max(0, frameDuration - (_now - last))
	      last = next + _now
	      setTimeout(function() {
	        var cp = queue.slice(0)
	        // Clear queue here to prevent
	        // callbacks from appending listeners
	        // to the current frame's queue
	        queue.length = 0
	        for(var i = 0; i < cp.length; i++) {
	          if(!cp[i].cancelled) {
	            try{
	              cp[i].callback(last)
	            } catch(e) {
	              setTimeout(function() { throw e }, 0)
	            }
	          }
	        }
	      }, Math.round(next))
	    }
	    queue.push({
	      handle: ++id,
	      callback: callback,
	      cancelled: false
	    })
	    return id
	  }

	  caf = function(handle) {
	    for(var i = 0; i < queue.length; i++) {
	      if(queue[i].handle === handle) {
	        queue[i].cancelled = true
	      }
	    }
	  }
	}

	module.exports = function(fn) {
	  // Wrap in a new function to prevent
	  // `cancel` potentially being assigned
	  // to the native rAF function
	  if(!isNative) {
	    return raf.call(global, fn)
	  }
	  return raf.call(global, function() {
	    try{
	      fn.apply(this, arguments)
	    } catch(e) {
	      setTimeout(function() { throw e }, 0)
	    }
	  })
	}
	module.exports.cancel = function() {
	  caf.apply(global, arguments)
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {
	var timesync = __webpack_require__(4)
	module.exports = sync

	function sync(url, callback, callback2) {
	  var ws = new WebSocket(url)
	  var clocks = []
	  ws.onmessage = function(e) {
	    if (e.data == 'k') {
	      emit()
	    }
	    if (e.data.indexOf(',') >= 0) {
	      process(e.data)
	      emit()
	    }
	  }
	  ws.onclose = function() {
	    if (clocks.length < 1) return callback(new Error('no offset received'))
	    return callback(null, timesync.offset(clocks))
	  }
	  function emit() {
	    ws.send('' + new Date().getTime())
	  }
	  function process(text) {
	    var fields = text.split(',')
	    var a = +fields[0]
	    var b = +fields[1]
	    var c = new Date().getTime()
	    if (a <= c) clocks.push(timesync.convert([a, b, b, c]))
	    if (clocks.length >= 8) {
	      if (callback2) callback2(timesync.offset(clocks))
	    }
	  }
	}



	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.6.3
	(function() {
	  var getNanoSeconds, hrtime, loadTime;

	  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
	    module.exports = function() {
	      return performance.now();
	    };
	  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
	    module.exports = function() {
	      return (getNanoSeconds() - loadTime) / 1e6;
	    };
	    hrtime = process.hrtime;
	    getNanoSeconds = function() {
	      var hr;
	      hr = hrtime();
	      return hr[0] * 1e9 + hr[1];
	    };
	    loadTime = getNanoSeconds();
	  } else if (Date.now) {
	    module.exports = function() {
	      return Date.now() - loadTime;
	    };
	    loadTime = Date.now();
	  } else {
	    module.exports = function() {
	      return new Date().getTime() - loadTime;
	    };
	    loadTime = new Date().getTime();
	  }

	}).call(this);

	/*
	//@ sourceMappingURL=performance-now.map
	*/

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	
	exports.convert = function convert(array) {
	  var t1 = array[0]
	  var t2 = array[1]
	  var t3 = array[2]
	  var t4 = array[3]
	  return {
	    offset: ((t2 - t1) + (t3 - t4)) / 2,
	    delay:  (t4 - t1) - (t3 - t2)
	  }
	}

	exports.offset = function offset(clocks) {
	  clocks = clocks.slice()
	  clocks.sort(function(a, b) {
	    return a.offset - b.offset
	  })
	  clocks = clocks.slice(1, clocks.length - 1)
	  clocks.sort(function(a, b) {
	    return a.delay - b.delay
	  })
	  var sum = 0, count = 0
	  var hp = Math.ceil(clocks.length / 8)
	  for (var i = 0; i < clocks.length; i++) {
	    if (clocks[i].delay > clocks[0].delay) hp--
	    if (hp === 0) break
	    sum += clocks[i].offset
	    count += 1
	  }
	  return sum / count
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    draining = true;
	    var currentQueue;
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        var i = -1;
	        while (++i < len) {
	            currentQueue[i]();
	        }
	        len = queue.length;
	    }
	    draining = false;
	}
	process.nextTick = function (fun) {
	    queue.push(fun);
	    if (!draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }
/******/ ]);