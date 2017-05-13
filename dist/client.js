module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// This is a special event emitter which invokes a handler whenever there was a match
// with the emitted sentence. The match can be done based on a string,
// regular expression or a custom handler. The handler can return a promise as well,
// making the matching process asynchronous and not necessarily synchronous
var SpeechEmitter = function () {
  function SpeechEmitter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, SpeechEmitter);

    this._events = new Map();
    this._handlers = new Map();
  }

  // Register a permanent event until being disposed manually


  _createClass(SpeechEmitter, [{
    key: 'on',
    value: function on(test, handler) {
      if (test == null) {
        throw TypeError('test must be provided');
      }

      if (!(test instanceof RegExp) && typeof test != 'string' && typeof test != 'function') {
        throw TypeError('test must be a regular expression, a string or a function');
      }

      if (handler == null) {
        throw TypeError('handler must be provided');
      }

      if (typeof handler != 'function') {
        throw TypeError('handler must be a function');
      }

      var handlers = this._events.get(test);

      if (handlers == null) {
        handlers = new Map();
        this._events.set(test, handlers);
      }

      handlers.set(handler, handler);
    }

    // Register a one time event

  }, {
    key: 'once',
    value: function once(test, handler) {
      var _this = this;

      if (test == null) {
        throw TypeError('test must be provided');
      }

      if (!(test instanceof RegExp) && typeof test != 'string' && typeof test != 'function') {
        throw TypeError('test must be a regular expression, a string or a function');
      }

      if (handler == null) {
        throw TypeError('handler must be provided');
      }

      if (typeof handler != 'function') {
        throw TypeError('handler must be a function');
      }

      var wrappedHandler = function wrappedHandler() {
        _this.off(test, handler);
        handler.apply(undefined, arguments);
      };

      var handlers = this._events.get(test);

      if (handlers == null) {
        handlers = new Map();
        this._events.set(test, handlers);
      }

      handlers.set(handler, wrappedHandler);
    }

    // Dispose event

  }, {
    key: 'off',
    value: function off(test, handler) {
      // If non was provided, dispose all events
      if (test == null && handler == null) {
        this._events = new Map();
        return;
      }

      // If handler wasn't provided, dispose all handlers matching the provided test
      if (handler == null) {
        this._events.delete(test);
        return;
      }

      // Else, cancel the specifically provided handler
      var handlers = this._events.get(test);

      if (handlers != null) {
        handlers.delete(handler);
      }
    }

    // Emit an event. The rest of the arguments will be forwarded to the test handlers

  }, {
    key: 'emit',
    value: function emit(sentence) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (sentence == null) {
        throw TypeError('sentence must be provided');
      }

      if (typeof sentence != 'string') {
        throw TypeError('sentence must be a string');
      }

      this._events.forEach(function (handlers, test) {
        var result = void 0;

        if (typeof test == 'function') {
          result = test.apply(undefined, [sentence].concat(args));
        } else if (test instanceof RegExp) {
          result = sentence.match(new RegExp(test, 'i'));
        } else if (test.toLowerCase() === sentence.toLowerCase()) {
          result = sentence;
        }

        if (result == null) return;

        if (typeof result.then != 'function' || typeof result.catch != 'function') {
          result = Promise.resolve(result);
        }

        result.then(function (args) {
          if (args == null) return;

          args = [].concat(args);

          handlers.forEach(function (handler) {
            handler.apply(undefined, _toConsumableArray(args));
          });
        }).catch(function (error) {
          console.error(error);
        });
      });
    }
  }]);

  return SpeechEmitter;
}();

exports.default = SpeechEmitter;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  apiUrl: '/speech-tree'
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _settings = __webpack_require__(1);

Object.defineProperty(exports, 'settings', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_settings).default;
  }
});

var _label_matcher = __webpack_require__(3);

Object.defineProperty(exports, 'createLabelMatcher', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_label_matcher).default;
  }
});

var _speech_listener = __webpack_require__(5);

Object.defineProperty(exports, 'SpeechEmitter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_speech_listener).default;
  }
});
Object.defineProperty(exports, 'SpeechListener', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_speech_listener).default;
  }
});

var _speech_node = __webpack_require__(6);

Object.defineProperty(exports, 'SpeechNode', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_speech_node).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _settings = __webpack_require__(1);

var _settings2 = _interopRequireDefault(_settings);

var _speech_emitter = __webpack_require__(0);

var _speech_emitter2 = _interopRequireDefault(_speech_emitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This module can generate tester functions which will validate incoming sentences
// against a label which can be fetched from the server using the provided plug-ins.
// This is useful because it implements a complicated logic in an efficient way, and it
// makes the classification process much easier to hook up with the client.
//
// Example:
//
//   const matchLabel = createLabelMatcher(listener);
//
//   speech.on(matchLabel('print')).invoke((sentence) => {
//     console.log(sentence);
//   });
//

// This will start listening for incoming sentences and will fetch labels from the server
// each time a speech was recognized. It will return a factory function which will
// generate an event handler for testing sentences against fetched labels
function createLabelMatcher(speechEmitter) {
  if (speechEmitter == null) {
    throw TypeError('speech emitter must be provided');
  }

  if (!(speechEmitter instanceof _speech_emitter2.default)) {
    throw TypeError('first argument must be a speech emitter');
  }

  // This will be used to register events for fetched labels
  var labelEmitter = new _speech_emitter2.default();
  var sentencePattern = /.*/;

  // This will fetch labels and emit them whenever there is an incoming sentence
  var fetchHandler = function fetchHandler(sentence) {
    // e.g. ' ' (space) will be replaced with '%20'
    var encodedSentence = encodeURIComponent(sentence);
    var labelQueryUrl = _settings2.default.apiUrl + '/label?sentence=' + encodedSentence;
    var request = new Request(labelQueryUrl);

    fetch(request).then(function (response) {
      return response.json();
    }).then(function (_ref) {
      var label = _ref.label;

      labelEmitter.emit(label, sentence);

      // Re-register event listener after it (could have been) zeroed by the speech node.
      // Here we wait run the registration in the next event loop to ensure all promises
      // have been resolved
      setTimeout(function () {
        speechEmitter.once(sentencePattern, fetchHandler);
      });
    }).catch(function (error) {
      console.error(error);
    });
  };

  // Here we use the once() method and not the on() method we re-register the event
  // listener once a fetch has been done
  speechEmitter.once(sentencePattern, fetchHandler);

  // A factory function which will generate an event handler for matching sentences
  // against fetched labels. Be sure to call the dispose() method once you don't need
  // the labels logic anymore! Otherwise requests will keep being made to the server
  // in the background
  var matchLabel = function matchLabel(label) {
    if (label == null) {
      throw TypeError('label must be provided');
    }

    if (typeof label != 'string') {
      throw TypeError('label must be a string');
    }

    // An async event handler which returns a promise
    return function () {
      return new Promise(function (resolve) {
        // The promise will resolve itself whenever an emitted label matches the
        // expected label
        var labelTest = function labelTest(actualLabel, sentence) {
          // This makes it a one-time test
          labelEmitter.off(labelTest);

          if (actualLabel == label) {
            // These are the arguments with whom the event handler will be invoked with
            return [sentence, label];
          }
        };

        labelEmitter.on(labelTest, resolve);
      });
    };
  };

  // The disposal methods disposes all the registered label events and it stops the
  // auto-fetching to the server whenever there is an incoming sentence
  matchLabel.dispose = function () {
    speechEmitter.off(sentencePattern, fetchHandler);
    labelEmitter.off();
  };

  return matchLabel;
}

exports.default = createLabelMatcher;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// A simple wrapped around the native speech recognition class which if our browser
// runs webkit or not, and will give us the right class accordingly. If the current
// version of the browser doesn't support speech recognition (natively), an error
// will be thrown
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  throw Error("browser doesn't support web speech API");
}

exports.default = SpeechRecognition;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _speech_recognition = __webpack_require__(4);

var _speech_recognition2 = _interopRequireDefault(_speech_recognition);

var _speech_emitter = __webpack_require__(0);

var _speech_emitter2 = _interopRequireDefault(_speech_emitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// SpeechListener wraps the native speech recognition web API and will emit an event
// whenever there is an incoming sentence
var SpeechListener = function (_SpeechEmitter) {
  _inherits(SpeechListener, _SpeechEmitter);

  _createClass(SpeechListener, [{
    key: 'listening',
    get: function get() {
      return this._listening;
    }
  }]);

  function SpeechListener() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, SpeechListener);

    var _this = _possibleConstructorReturn(this, (SpeechListener.__proto__ || Object.getPrototypeOf(SpeechListener)).call(this));

    _this._listening = false;
    _this._speechRecognition = new _speech_recognition2.default();
    _this._speechRecognition.continuous = options.continuous;
    _this._speechRecognition.onresult = _this._handleSpeechResult.bind(_this);
    return _this;
  }

  _createClass(SpeechListener, [{
    key: 'start',
    value: function start() {
      this._speechRecognition.start();
      this._listening = true;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this._speechRecognition.stop();
      this._listening = false;
    }
  }, {
    key: '_handleSpeechResult',
    value: function _handleSpeechResult(e) {
      var sentence = e.results[e.results.length - 1][0].transcript.trim();
      this.emit(sentence);
    }
  }]);

  return SpeechListener;
}(_speech_emitter2.default);

exports.default = SpeechListener;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _speech_emitter = __webpack_require__(0);

var _speech_emitter2 = _interopRequireDefault(_speech_emitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// An instance of the SpeechNode class represents a single node in an entire tree where
// we can register events to voice commands in sequence.
//
// Example:
//
//   - "Show me a list of all my expenses throughout the entire year"
//   - "Please sort the list"
//
var SpeechNode = function () {
  function SpeechNode(speechEmitter, parentNode) {
    _classCallCheck(this, SpeechNode);

    if (speechEmitter == null) {
      throw TypeError('speech emitter must be provided');
    }

    if (!(speechEmitter instanceof _speech_emitter2.default)) {
      throw TypeError('first argument must be a speech emitter');
    }

    if (parentNode && !(parentNode instanceof SpeechNode)) {
      throw TypeError('second argument must be a speech node');
    }

    this.speechEmitter = speechEmitter;
    this.parentNode = parentNode;
    // We can register multiple tests for a single handler. This array is used to
    // accumulate tests until their handler is being specified, in which case this array
    // pipes itself to the global tests array
    this.testsBatch = [];
    // A test-handler pairs array which will be used to register itself after the speech
    // commands map has been zeroed
    this.tests = [];
  }

  _createClass(SpeechNode, [{
    key: 'on',
    value: function on(test) {
      if (test == null) {
        throw TypeError('test must be provided');
      }

      if (!(test instanceof RegExp) && typeof test != 'string' && typeof test != 'function') {
        throw TypeError('test must be a regular expression, a string or a function');
      }

      // Accumulate test for the current session
      this.testsBatch.push(test);

      return this;
    }
  }, {
    key: 'invoke',
    value: function invoke(handler) {
      var _this = this,
          _tests;

      if (handler == null) {
        throw TypeError('test handler must be provided');
      }

      if (typeof handler != 'function') {
        throw TypeError('test handler must be a function');
      }

      var wrappedHandler = function wrappedHandler() {
        // Re-register all tests of the current node and above, discarding all events
        // of child nodes
        _this.speechEmitter.off();

        _this.getTestsRecursively().forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              test = _ref2[0],
              handler = _ref2[1];

          _this.speechEmitter.on(test, handler);
        });

        // If the handler returns a function it means that the user would like to keep
        // building the speech tree
        var speechNodeRequest = handler.apply(undefined, arguments);

        if (typeof speechNodeRequest != 'function') return;

        speechNodeRequest(new SpeechNode(_this.speechEmitter, _this));
      };

      this.testsBatch.forEach(function (test) {
        _this.speechEmitter.on(test, wrappedHandler);
      });

      // Compose test-handler pairs
      var testsBatch = this.testsBatch.map(function (test) {
        return [test, wrappedHandler];
      });

      // Pipe tests for current session
      (_tests = this.tests).push.apply(_tests, _toConsumableArray(testsBatch));
      this.testsBatch = [];

      return this;
    }

    // Gets tests of the current node and all its parents

  }, {
    key: 'getTestsRecursively',
    value: function getTestsRecursively() {
      var parentTests = void 0;

      if (this.parentNode) {
        parentTests = this.parentNode.getTestsRecursively();
      } else {
        parentTests = [];
      }

      return this.tests.concat(parentTests);
    }
  }]);

  return SpeechNode;
}();

exports.default = SpeechNode;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ })
/******/ ]);