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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  apiUrl: '/speech-tree'
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {
	"name": "speech-tree",
	"description": "An events tree which lets you define a sequence of voice commands.",
	"version": "0.0.2",
	"repository": {
		"type": "git",
		"url": "https://DAB0mB@github.com/DAB0mB/speech-tree.git"
	},
	"scripts": {
		"prepublish": "npm run build",
		"build": "npm run build:client && npm run build:server",
		"build:client": "webpack --config ./webpack_configs/client.js",
		"build:server": "webpack --config ./webpack_configs/server.js",
		"test": "jest"
	},
	"dependencies": {
		"boom": "^4.3.1",
		"express": "^4.15.2"
	},
	"devDependencies": {
		"babel-loader": "^7.0.0",
		"babel-preset-es2015": "^6.24.1",
		"detect-port": "^1.1.1",
		"express": "^4.15.2",
		"hapi": "^16.1.1",
		"jest-cli": "^20.0.0",
		"nock": "^9.0.13",
		"node-fetch": "^1.6.3",
		"unminified-webpack-plugin": "^1.2.0",
		"webpack": "^2.5.0",
		"webpack-node-externals": "^1.5.4"
	},
	"jest": {
		"setupTestFrameworkScriptFile": "./test_setup.js"
	},
	"keywords": [
		"natural-language-processing",
		"speech",
		"speech-recognition",
		"voice-commands",
		"voice-control",
		"voice-recognition",
		"webspeech-api"
	]
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("boom");

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.settings = exports.speechTreeApi = undefined;

var _boom = __webpack_require__(2);

var _boom2 = _interopRequireDefault(_boom);

var _package = __webpack_require__(1);

var _package2 = _interopRequireDefault(_package);

var _settings = __webpack_require__(0);

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

speechTreeApi.attributes = {
  name: _package2.default.name,
  version: _package2.default.version
};

// Returns hapi plug-in which will register a route endpoint for handling
// labels classifications for incoming sentences
//
// Options:
//
//   - speechClassifier (Function): A sentence-to-label mapping function
//
async function speechTreeApi(server, options, next) {
  if (!options.speechClassifier) {
    return next(TypeError('speech classifier must be specified'));
  }

  if (typeof options.speechClassifier != 'function') {
    return next(TypeError('speech classifier must be a function'));
  }

  var apiUrl = '/' + _settings2.default.apiUrl.split('/').pop();

  server.route({
    method: ['GET'],
    path: apiUrl + '/label',
    handler: async function handler(request, reply) {
      var sentence = request.query.sentence;

      if (!sentence) {
        var error = _boom2.default.badRequest('sentence must be provided');
        return reply(error);
      }

      var label = options.speechClassifier(sentence);

      if (!label) {
        var _error = _boom2.default.notFound('label not found');
        return reply(_error);
      }

      if (typeof label.then == 'function' && typeof label.catch == 'function') {
        label = await label;
      }

      if (typeof label != 'string') {
        throw TypeError('label must be a string');
      }

      reply({ label: label });
    }
  });

  next();
}

exports.speechTreeApi = speechTreeApi;
exports.settings = _settings2.default;

/***/ })
/******/ ]);