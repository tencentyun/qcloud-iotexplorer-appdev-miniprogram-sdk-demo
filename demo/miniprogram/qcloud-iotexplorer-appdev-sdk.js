(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/miniprogram-api-typings/index.d.ts":
/*!*********************************************************!*\
  !*** ./node_modules/miniprogram-api-typings/index.d.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/// <reference path="./types/index.d.ts" />


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}


/***/ }),

/***/ "./src/IotWebsocket.ts":
/*!*****************************!*\
  !*** ./src/IotWebsocket.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var event_emmiter_1 = tslib_1.__importDefault(__webpack_require__(/*! ./libs/event-emmiter */ "./src/libs/event-emmiter.ts"));
var shortid_1 = tslib_1.__importDefault(__webpack_require__(/*! ./vendor/shortid */ "./src/vendor/shortid/index.js"));
var utillib_1 = __webpack_require__(/*! ./libs/utillib */ "./src/libs/utillib.ts");
var websocket_1 = __webpack_require__(/*! ./libs/websocket */ "./src/libs/websocket.ts");
var logger_1 = tslib_1.__importDefault(__webpack_require__(/*! ./logger */ "./src/logger.ts"));
var errorHelper_1 = __webpack_require__(/*! ./errorHelper */ "./src/errorHelper.ts");
var defaultOptions = {
    url: 'wss://iot.cloud.tencent.com/ws/explorer',
    heartbeatInterval: 60 * 1000,
};
var IotWebsocket = /** @class */ (function (_super) {
    tslib_1.__extends(IotWebsocket, _super);
    function IotWebsocket(sdk, options) {
        var _this = _super.call(this) || this;
        _this.sdk = sdk;
        _this.requestHandlerMap = {};
        _this.options = Object.assign({}, defaultOptions, options);
        _this._connected = false;
        _this._subscribeDeviceIdList = [];
        _this._heartBeatTimer = null;
        return _this;
    }
    IotWebsocket.prototype.isConnected = function () {
        return !!this._connected;
    };
    IotWebsocket.prototype.doConnectWs = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this._doConnectWsPromise || (this._doConnectWsPromise = new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var onError, url;
                        var _this = this;
                        return tslib_1.__generator(this, function (_a) {
                            onError = function (error) {
                                reject(error);
                                _this.emit('error', error);
                                _this.disconnect();
                            };
                            try {
                                url = this.options.url;
                                this.ws = new websocket_1.WebSocket(utillib_1.appendParams(url, {
                                    uin: this.sdk.loginManager.userId,
                                }));
                                // 1: 建立连接
                                this.ws.onOpen(function () {
                                    logger_1.default.debug('websocket connected');
                                    _this._connected = true;
                                    _this.emit('connect');
                                    resolve();
                                });
                                this.ws.onError(onError);
                                this.ws.onMessage(function (_a) {
                                    var data = _a.data;
                                    _this.emit('message', data);
                                    try {
                                        data = JSON.parse(data);
                                    }
                                    catch (e) {
                                        logger_1.default.warn("onMessage parse event.data error: " + data);
                                        return;
                                    }
                                    if (data.push) {
                                        _this.emit('push', data);
                                    }
                                    else if (typeof data.reqId !== 'undefined' && _this.requestHandlerMap[data.reqId]) {
                                        _this.requestHandlerMap[data.reqId](null, data);
                                    }
                                });
                                this.ws.onClose(function (event) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                    return tslib_1.__generator(this, function (_a) {
                                        logger_1.default.debug('websocket closed');
                                        this.disconnect();
                                        this.emit('close', event);
                                        return [2 /*return*/];
                                    });
                                }); });
                            }
                            catch (err) {
                                onError(err);
                            }
                            return [2 /*return*/];
                        });
                    }); }))];
            });
        });
    };
    IotWebsocket.prototype.connect = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sdk.loginManager.checkLogin()];
                    case 1:
                        _a.sent();
                        if (!!this.isConnected()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.doConnectWs()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, this.activePush()];
                }
            });
        });
    };
    IotWebsocket.prototype.subscribe = function (deviceIdList) {
        return this.activePush(deviceIdList);
    };
    IotWebsocket.prototype.disconnect = function () {
        if (this.ws) {
            var closeReason = {};
            this.ws.close(closeReason);
            this._connected = false;
            this._doConnectWsPromise = null;
            this.ws = null;
            clearInterval(this._heartBeatTimer);
            this._heartBeatTimer = null;
        }
    };
    IotWebsocket.prototype.send = function (action, params, _a) {
        if (params === void 0) { params = {}; }
        var reqId = (_a === void 0 ? {} : _a).reqId;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!reqId) {
                            reqId = shortid_1.default();
                        }
                        if (!this.ws) return [3 /*break*/, 5];
                        this.ws.send({
                            data: JSON.stringify({
                                action: action,
                                reqId: reqId,
                                params: params,
                            }),
                        });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, Promise.race([
                                new Promise(function (resolve, reject) {
                                    _this.requestHandlerMap[reqId] = function (err, data) {
                                        if (err) {
                                            reject(err);
                                        }
                                        else {
                                            if (!data.data && (data.error || data.error_message)) {
                                                return reject({ code: data.error, msg: data.error_message });
                                            }
                                            return resolve(data.data);
                                        }
                                    };
                                }),
                                new Promise(function (resolve, reject) {
                                    setTimeout(function () {
                                        reject({ code: 'TIMEOUT' });
                                    }, 20 * 1000);
                                }),
                            ])];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        delete this.requestHandlerMap[reqId];
                        return [7 /*endfinally*/];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        logger_1.default.warn('Try send ws message but no ws instance', action, params);
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    IotWebsocket.prototype.callYunApi = function (Action, ActionParams, _a) {
        if (ActionParams === void 0) { ActionParams = {}; }
        var doNotRetry = (_a === void 0 ? {} : _a).doNotRetry;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var reqId, _b, accessToken, appKey, requestOpts, resp, Response, Error_1, error, error_message, err_1, reLoginError_1;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        reqId = shortid_1.default();
                        _b = this.sdk.loginManager, accessToken = _b.accessToken, appKey = _b.appKey;
                        // 添加公共参数
                        ActionParams = Object.assign({}, ActionParams, {
                            RequestId: reqId,
                        });
                        ActionParams.AccessToken = accessToken;
                        requestOpts = {
                            Action: Action,
                            ActionParams: ActionParams,
                        };
                        if (this.options.apiPlatform) {
                            requestOpts.Platform = this.options.apiPlatform;
                        }
                        else {
                            requestOpts.AppKey = appKey;
                        }
                        logger_1.default.debug("yunapi start(" + reqId + ") => ", requestOpts);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 11]);
                        return [4 /*yield*/, this.send('YunApi', requestOpts, { reqId: reqId })];
                    case 2:
                        resp = _c.sent();
                        // 不可靠的数据结构，多几步处理增强健壮性
                        if (!resp) {
                            logger_1.default.error('empty response', requestOpts);
                            throw { msg: '连接服务器失败，请稍后重试' };
                        }
                        Response = resp.Response;
                        if (!Response) {
                            logger_1.default.error('empty response', requestOpts, Response);
                            throw { msg: '连接服务器失败，请稍后重试' };
                        }
                        Error_1 = Response.Error, error = Response.error, error_message = Response.error_message;
                        if (Error_1) {
                            throw { code: Error_1.Code, msg: Error_1.Message };
                        }
                        if (error) {
                            throw { code: error, msg: error_message };
                        }
                        logger_1.default.debug("yunapi success(" + reqId + ") => ", requestOpts, Response);
                        return [2 /*return*/, Response];
                    case 3:
                        err_1 = _c.sent();
                        logger_1.default.error("yunapi fail(" + reqId + ") => ", err_1);
                        if (!errorHelper_1.isVerifyLoginError(err_1)) return [3 /*break*/, 10];
                        if (!!doNotRetry) return [3 /*break*/, 8];
                        _c.label = 4;
                    case 4:
                        _c.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.sdk.loginManager.reLogin()];
                    case 5:
                        _c.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        reLoginError_1 = _c.sent();
                        logger_1.default.error('reLogin fail', reLoginError_1);
                        return [2 /*return*/, Promise.reject(errorHelper_1.genVerifyLoginFailError(err_1))];
                    case 7: return [2 /*return*/, this.callYunApi(Action, ActionParams, { doNotRetry: true })];
                    case 8: return [4 /*yield*/, this.sdk.loginManager.logout()];
                    case 9:
                        _c.sent();
                        return [2 /*return*/, errorHelper_1.genVerifyLoginFailError(err_1)];
                    case 10:
                        if (utillib_1.isPlainObject(err_1)) {
                            err_1.reqId = reqId;
                        }
                        return [2 /*return*/, Promise.reject(err_1)];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    // 向后台发送心跳包，告诉它我们需要这些设备的数据
    // 长度为0就不需要发了
    IotWebsocket.prototype.sendWsHeatBeat = function () {
        if (this._subscribeDeviceIdList && this._subscribeDeviceIdList.length) {
            return this.callYunApi('AppDeviceTraceHeartBeat', { DeviceIds: this._subscribeDeviceIdList });
        }
    };
    // activePush是个幂等操作，多次调用也没事。
    IotWebsocket.prototype.activePush = function (deviceList) {
        var _this = this;
        if (deviceList) {
            this._subscribeDeviceIdList = deviceList;
        }
        var _a = this.sdk.loginManager, isLogin = _a.isLogin, accessToken = _a.accessToken, appKey = _a.appKey;
        if (isLogin && accessToken && this._subscribeDeviceIdList) {
            this.send('ActivePush', {
                DeviceIds: this._subscribeDeviceIdList,
                AccessToken: accessToken,
                AppKey: appKey,
            });
            this.sendWsHeatBeat();
            clearInterval(this._heartBeatTimer);
            this._heartBeatTimer = setInterval(function () { return _this.sendWsHeatBeat(); }, this.options.heartbeatInterval);
        }
    };
    return IotWebsocket;
}(event_emmiter_1.default));
exports.IotWebsocket = IotWebsocket;


/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var EventTypes;
(function (EventTypes) {
    EventTypes["Ready"] = "ready";
    EventTypes["Error"] = "error";
    EventTypes["WsError"] = "ws_error";
    EventTypes["WsClose"] = "ws_close";
    EventTypes["WsPush"] = "wsPush";
    EventTypes["WsReport"] = "wsReport";
    EventTypes["WsControl"] = "wsControl";
    EventTypes["WsStatusChange"] = "wsStatusChange";
})(EventTypes = exports.EventTypes || (exports.EventTypes = {}));
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["WX_API_NEED_AUTH"] = "WX_API_NEED_AUTH";
    ErrorCode["GET_USERINFO_NEED_AUTH"] = "GET_USERINFO_NEED_AUTH";
    ErrorCode["WX_API_FAIL"] = "WX_API_FAIL";
    ErrorCode["VERIFY_LOGIN_FAIL"] = "VERIFY_LOGIN_FAIL";
    ErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
var ConnectDeviceErrorCode;
(function (ConnectDeviceErrorCode) {
    ConnectDeviceErrorCode["UDP_NOT_RESPONSED"] = "UDP_NOT_RESPONSED";
    ConnectDeviceErrorCode["SSID_NOT_MATCH"] = "SSID_NOT_MATCH";
    ConnectDeviceErrorCode["CONNECT_SOFTAP_FAIL"] = "CONNECT_SOFTAP_FAIL";
    ConnectDeviceErrorCode["CONNECT_TARGET_WIFI_FAIL"] = "CONNECT_TARGET_WIFI_FAIL";
    ConnectDeviceErrorCode["UDP_ERROR"] = "UDP_ERROR";
    ConnectDeviceErrorCode["DEVICE_ERROR"] = "DEVICE_ERROR";
    ConnectDeviceErrorCode["INVALID_UDP_RESPONSE"] = "INVALID_UDP_RESPONSE";
    ConnectDeviceErrorCode["DEVICE_CONNECT_MQTT_FAIL"] = "DEVICE_CONNECT_MQTT_FAIL";
    ConnectDeviceErrorCode["DEVICE_CONNECT_WIFI_FAIL"] = "DEVICE_CONNECT_WIFI_FAIL";
    ConnectDeviceErrorCode["ADD_DEVICE_FAIL"] = "ADD_DEVICE_FAIL";
    ConnectDeviceErrorCode["SEND_UDP_MSG_FAIL"] = "SEND_UDP_MSG_FAIL";
})(ConnectDeviceErrorCode = exports.ConnectDeviceErrorCode || (exports.ConnectDeviceErrorCode = {}));
exports.SoftApErrorMsg = (_a = {},
    _a[ConnectDeviceErrorCode.UDP_NOT_RESPONSED] = '超时未收到设备响应',
    _a[ConnectDeviceErrorCode.CONNECT_SOFTAP_FAIL] = '手机连接设备热点失败',
    _a[ConnectDeviceErrorCode.CONNECT_TARGET_WIFI_FAIL] = '手机连接WiFi路由器失败',
    _a[ConnectDeviceErrorCode.UDP_ERROR] = '连接设备失败',
    _a[ConnectDeviceErrorCode.DEVICE_ERROR] = '设备配网异常',
    _a[ConnectDeviceErrorCode.INVALID_UDP_RESPONSE] = '设备响应报文格式错误',
    _a[ConnectDeviceErrorCode.DEVICE_CONNECT_MQTT_FAIL] = '连接云端失败',
    _a[ConnectDeviceErrorCode.DEVICE_CONNECT_WIFI_FAIL] = '设备连接WiFi路由器失败',
    _a[ConnectDeviceErrorCode.ADD_DEVICE_FAIL] = '添加设备失败',
    _a[ConnectDeviceErrorCode.SEND_UDP_MSG_FAIL] = '发送配网消息失败',
    _a);
var ConnectDeviceStepCode;
(function (ConnectDeviceStepCode) {
    // 开始配网
    ConnectDeviceStepCode["CONNECT_DEVICE_START"] = "CONNECT_DEVICE_START";
    // 开始连接设备热点
    ConnectDeviceStepCode["CONNECT_SOFTAP_START"] = "CONNECT_SOFTAP_START";
    // 连接设备热点成功
    ConnectDeviceStepCode["CONNECT_SOFTAP_SUCCESS"] = "CONNECT_SOFTAP_SUCCESS";
    ConnectDeviceStepCode["CREATE_UDP_CONNECTION_START"] = "CREATE_UDP_CONNECTION_START";
    ConnectDeviceStepCode["CREATE_UDP_CONNECTION_SUCCESS"] = "CREATE_UDP_CONNECTION_SUCCESS";
    ConnectDeviceStepCode["SEND_TARGET_WIFIINFO_START"] = "SEND_TARGET_WIFIINFO_START";
    ConnectDeviceStepCode["SEND_TARGET_WIFIINFO_SUCCESS"] = "SEND_TARGET_WIFIINFO_SUCCESS";
    ConnectDeviceStepCode["GET_DEVICE_SIGNATURE_START"] = "GET_DEVICE_SIGNATURE_START";
    ConnectDeviceStepCode["GET_DEVICE_SIGNATURE_SUCCESS"] = "GET_DEVICE_SIGNATURE_SUCCESS";
    ConnectDeviceStepCode["CONNECT_TARGET_WIFI_START"] = "RECONNECT_TARGET_WIFI_START";
    ConnectDeviceStepCode["CONNECT_TARGET_WIFI_SUCCESS"] = "RECONNECT_TARGET_WIFI_SUCCESS";
    ConnectDeviceStepCode["ADD_DEVICE_START"] = "ADD_DEVICE_START";
    ConnectDeviceStepCode["ADD_DEVICE_SUCCESS"] = "ADD_DEVICE_SUCCESS";
    ConnectDeviceStepCode["CONNECT_DEVICE_SUCCESS"] = "CONNECT_DEVICE_SUCCESS";
})(ConnectDeviceStepCode = exports.ConnectDeviceStepCode || (exports.ConnectDeviceStepCode = {}));
exports.SoftApStepMsg = (_b = {},
    _b[ConnectDeviceStepCode.CONNECT_DEVICE_START] = '开始配网',
    _b[ConnectDeviceStepCode.CONNECT_SOFTAP_START] = '开始连接设备热点',
    _b[ConnectDeviceStepCode.CONNECT_SOFTAP_SUCCESS] = '连接设备热点成功',
    _b[ConnectDeviceStepCode.CREATE_UDP_CONNECTION_START] = '开始与设备建立UDP连接',
    _b[ConnectDeviceStepCode.CREATE_UDP_CONNECTION_SUCCESS] = '与设备建立UDP连接成功',
    _b[ConnectDeviceStepCode.SEND_TARGET_WIFIINFO_START] = '开始发送目标WiFi信息至设备',
    _b[ConnectDeviceStepCode.SEND_TARGET_WIFIINFO_SUCCESS] = '发送目标WiFi信息至设备成功',
    _b[ConnectDeviceStepCode.GET_DEVICE_SIGNATURE_START] = '开始获取设备签名',
    _b[ConnectDeviceStepCode.GET_DEVICE_SIGNATURE_SUCCESS] = '获取设备签名成功',
    _b[ConnectDeviceStepCode.CONNECT_TARGET_WIFI_START] = '手机开始连接目标WiFi',
    _b[ConnectDeviceStepCode.CONNECT_TARGET_WIFI_SUCCESS] = '手机连接目标WiFi成功',
    _b[ConnectDeviceStepCode.ADD_DEVICE_START] = '开始添加设备',
    _b[ConnectDeviceStepCode.ADD_DEVICE_SUCCESS] = '添加设备成功',
    _b[ConnectDeviceStepCode.CONNECT_DEVICE_SUCCESS] = '配网成功',
    _b);


/***/ }),

/***/ "./src/errorHelper.ts":
/*!****************************!*\
  !*** ./src/errorHelper.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var utillib_1 = __webpack_require__(/*! ./libs/utillib */ "./src/libs/utillib.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./src/constants.ts");
/**
 * 标准化错误输出，分为三个类型：
 * 1. 小程序 api 报错：{ errMsg }
 * 2. cgi 报错： { code, msg }
 * 3. Error 对象
 *
 * 标准化输出为： { code, msg, ...detail }
 * @param error
 */
exports.normalizeError = function (error) {
    if (error) {
        if (utillib_1.isPlainObject(error)) {
            // 小程序 api 报错
            if (error.errMsg) {
                if (['auth deny', 'scope unauthorized'].some(function (msg) { return String(error.errMsg).indexOf(msg) > -1; })) {
                    if (error.errMsg.indexOf('getUserInfo') === 0) {
                        Object.assign(error, {
                            code: constants_1.ErrorCode.GET_USERINFO_NEED_AUTH,
                            msg: '尚未开启微信基本信息授权，请授权后使用',
                        });
                    }
                    else {
                        var _a = tslib_1.__read(error.errMsg.split(':'), 1), apiName = _a[0];
                        Object.assign(error, {
                            code: constants_1.ErrorCode.WX_API_NEED_AUTH,
                            msg: "\u5C0F\u7A0B\u5E8F\u63A5\u53E3\uFF08" + apiName + "\uFF09\u9700\u8981\u7528\u6237\u6388\u6743\uFF0C\u8BF7\u6388\u6743\u540E\u4F7F\u7528",
                        });
                    }
                }
                else {
                    Object.assign(error, {
                        code: constants_1.ErrorCode.WX_API_FAIL,
                        msg: '小程序接口调用失败，请稍后再试',
                    });
                }
            }
            else if (exports.isVerifyLoginError(error)) {
                error = exports.genVerifyLoginFailError(error);
            }
        }
        else if (error instanceof Error) {
            error = {
                code: constants_1.ErrorCode.INTERNAL_ERROR,
                msg: error.message,
                stack: error.stack,
                error: error,
            };
        }
    }
    return error;
};
exports.genVerifyLoginFailError = function (error) {
    if (!error) {
        error = {};
    }
    var code = error.code, msg = error.msg, others = tslib_1.__rest(error, ["code", "msg"]);
    return tslib_1.__assign({ code: constants_1.ErrorCode.VERIFY_LOGIN_FAIL, msg: '登录态验证失败，请重新登录' }, others);
};
exports.isVerifyLoginError = function (error) {
    return error && String(error.code || '').indexOf('InvalidAccessToken') > -1;
};
exports.handleVerifyLoginError = function (error) {
    if (exports.isVerifyLoginError(error)) {
        throw exports.genVerifyLoginFailError(error);
    }
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
tslib_1.__exportStar(__webpack_require__(/*! ./constants */ "./src/constants.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./sdk */ "./src/sdk.ts"), exports);


/***/ }),

/***/ "./src/libs/envDetect.ts":
/*!*******************************!*\
  !*** ./src/libs/envDetect.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMiniProgram = (function () {
    // 通过关键 api 是否存在来判断小程序环境
    try {
        return !!(wx && wx.request && wx.connectSocket);
    }
    catch (e) {
        return false;
    }
})();
exports.isBrowser = (function () {
    try {
        return typeof window !== 'undefined' && typeof window.document !== 'undefined';
    }
    catch (e) {
        return false;
    }
})();
exports.isNode = (function () {
    try {
        return !!process.versions.node;
    }
    catch (e) {
        return false;
    }
})();
exports.isRN = (function () {
    try {
        return navigator.product === 'ReactNative';
    }
    catch (e) {
        return false;
    }
})();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/libs/event-emmiter.ts":
/*!***********************************!*\
  !*** ./src/libs/event-emmiter.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Modified from https://www.npmjs.com/package/event-emitter
 */
var defineProperty = Object.defineProperty, create = Object.create;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var descriptor = { configurable: true, enumerable: false, writable: true, value: null };
var namespace = '__ee__';
function callable(fn) {
    if (typeof fn !== 'function')
        throw new TypeError(fn + " is not a function");
    return fn;
}
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
    }
    EventEmitter.prototype.on = function (type, listener) {
        var data;
        callable(listener);
        if (!hasOwnProperty.call(this, namespace)) {
            data = descriptor.value = create(null);
            defineProperty(this, namespace, descriptor);
            descriptor.value = null;
        }
        else {
            data = this[namespace];
        }
        if (!data[type])
            data[type] = [listener];
        else
            data[type].push(listener);
        return this;
    };
    EventEmitter.prototype.once = function (type, listener) {
        var _this = this;
        var once, self;
        callable(listener);
        this.on.call(this, type, once = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.off.call(self, type, once);
            listener.apply(_this, args);
        });
        return this;
    };
    EventEmitter.prototype.off = function (type, listener) {
        if (!hasOwnProperty.call(this, namespace))
            return this;
        var data = this[namespace];
        if (!data[type])
            return this;
        if (!listener) {
            data[type].length = 0;
        }
        else {
            var listeners = data[type] || [];
            var listenerIndex = listeners.indexOf(listener);
            if (listenerIndex > -1) {
                listeners.splice(listenerIndex, 1);
            }
        }
        return this;
    };
    EventEmitter.prototype.emit = function (type) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!hasOwnProperty.call(this, namespace))
            return;
        var listeners = this[namespace][type];
        if (!listeners || !listeners.length)
            return;
        listeners.forEach(function (listener) { return listener.apply(_this, args); });
    };
    return EventEmitter;
}());
exports.default = EventEmitter;


/***/ }),

/***/ "./src/libs/pify.ts":
/*!**************************!*\
  !*** ./src/libs/pify.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
exports.pify = function (api, context) {
    if (context === void 0) { context = wx; }
    return function (params) {
        var others = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            others[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            // 不支持的api，默认弹modal提示版本低，然后会reject 一个undefined
            if (!api) {
                wx.showModal({
                    title: '提示',
                    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试',
                    complete: function () { return reject(); },
                    confirmColor: '#006eff',
                    showCancel: false,
                });
            }
            else {
                api.call.apply(api, tslib_1.__spread([context, tslib_1.__assign(tslib_1.__assign({}, params), { success: resolve, fail: reject })], others));
            }
        });
    };
};


/***/ }),

/***/ "./src/libs/request/adapter.ts":
/*!*************************************!*\
  !*** ./src/libs/request/adapter.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var shortid_1 = tslib_1.__importDefault(__webpack_require__(/*! ../../vendor/shortid */ "./src/vendor/shortid/index.js"));
var utillib_1 = __webpack_require__(/*! ../utillib */ "./src/libs/utillib.ts");
var request_1 = __webpack_require__(/*! ./request */ "./src/libs/request/request.ts");
var defaultUrl = 'https://iot.cloud.tencent.com/api/exploreropen/tokenapi';
exports.requestTokenApi = function (Action, _a, _b) {
    if (_a === void 0) { _a = {}; }
    if (_b === void 0) { _b = {}; }
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var reqOptions, reqId, query, url, response, code, msg, _c, data;
        var uin = _a.uin, AccessToken = _a.AccessToken, payload = tslib_1.__rest(_a, ["uin", "AccessToken"]);
        var _d = _b.method, method = _d === void 0 ? 'POST' : _d, opts = tslib_1.__rest(_b, ["method"]);
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    reqId = shortid_1.default();
                    query = {
                        uin: uin,
                        cmd: Action,
                    };
                    // 添加公共参数
                    payload = Object.assign({}, payload, {
                        Action: Action,
                        RequestId: reqId,
                        AccessToken: AccessToken,
                    });
                    url = utillib_1.appendParams(opts.url || defaultUrl, query);
                    reqOptions = tslib_1.__assign({ url: url, data: payload, method: method }, opts);
                    return [4 /*yield*/, request_1.request(reqOptions)];
                case 1:
                    response = (_e.sent()).data;
                    code = response.code, msg = response.msg, _c = response.data, data = _c === void 0 ? {} : _c;
                    if (code) {
                        if (data && data.Error) {
                            throw { code: data.Error.Code, msg: data.Error.Message, reqId: reqId };
                        }
                        throw { code: code, msg: msg, reqId: reqId };
                    }
                    return [2 /*return*/, data];
            }
        });
    });
};


/***/ }),

/***/ "./src/libs/request/index.ts":
/*!***********************************!*\
  !*** ./src/libs/request/index.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
tslib_1.__exportStar(__webpack_require__(/*! ./request */ "./src/libs/request/request.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./adapter */ "./src/libs/request/adapter.ts"), exports);


/***/ }),

/***/ "./src/libs/request/request-manager.ts":
/*!*********************************************!*\
  !*** ./src/libs/request/request-manager.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * 请求调度管理，处理请求阻塞，主动取消等逻辑
 */
Object.defineProperty(exports, "__esModule", { value: true });
var store = {};
var blockingList = [];
var startBlocking = function () {
    var resolve;
    var promise = new Promise(function (_resolve) {
        resolve = _resolve;
    });
    blockingList.push({ promise: promise, resolve: resolve });
    return promise;
};
var resolveFirstBlock = function () {
    if (blockingList.length) {
        blockingList[0].resolve();
        blockingList.shift();
    }
};
exports.default = {
    resolveFirstBlock: resolveFirstBlock,
    startBlocking: startBlocking,
};


/***/ }),

/***/ "./src/libs/request/request.ts":
/*!*************************************!*\
  !*** ./src/libs/request/request.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var request_manager_1 = tslib_1.__importDefault(__webpack_require__(/*! ./request-manager */ "./src/libs/request/request-manager.ts"));
var pify_1 = __webpack_require__(/*! ../pify */ "./src/libs/pify.ts");
var maxConcurrentNum = 10;
var currentRequestingNum = 0;
exports.request = function (_a) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var err_1;
    var url = _a.url, data = _a.data, _b = _a.header, header = _b === void 0 ? {} : _b, _c = _a.method, method = _c === void 0 ? 'get' : _c, dataType = _a.dataType, responseType = _a.responseType, params = tslib_1.__rest(_a, ["url", "data", "header", "method", "dataType", "responseType"]);
    return tslib_1.__generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, 6, 7]);
                _d.label = 1;
            case 1:
                if (!(currentRequestingNum >= maxConcurrentNum)) return [3 /*break*/, 3];
                return [4 /*yield*/, request_manager_1.default.startBlocking()];
            case 2:
                _d.sent();
                return [3 /*break*/, 1];
            case 3:
                currentRequestingNum++;
                return [4 /*yield*/, pify_1.pify(wx.request)(tslib_1.__assign({ url: url,
                        data: data,
                        header: header,
                        method: method,
                        dataType: dataType,
                        responseType: responseType }, params))];
            case 4: return [2 /*return*/, _d.sent()];
            case 5:
                err_1 = _d.sent();
                return [2 /*return*/, Promise.reject(err_1)];
            case 6:
                currentRequestingNum--;
                // 释放第一个promise
                request_manager_1.default.resolveFirstBlock();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); };


/***/ }),

/***/ "./src/libs/storage.ts":
/*!*****************************!*\
  !*** ./src/libs/storage.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var pify_1 = __webpack_require__(/*! ./pify */ "./src/libs/pify.ts");
exports.default = {
    getItem: function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pify_1.pify(wx.getStorage)({ key: key })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    setItem: function (key, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var err_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pify_1.pify(wx.setStorage)({ key: key, data: data })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        console.error('setStorage error', err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    removeItem: function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var err_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pify_1.pify(wx.removeStorage)({ key: key })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        console.error('removeStorage error', err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
};


/***/ }),

/***/ "./src/libs/utillib.ts":
/*!*****************************!*\
  !*** ./src/libs/utillib.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.appendParams = function (url, data) {
    if (data === void 0) { data = {}; }
    var paramArr = [];
    Object.keys(data).forEach(function (key) {
        var value = data[key];
        if (typeof value !== 'undefined') {
            if (exports.isPlainObject(value)) {
                try {
                    value = JSON.stringify(value);
                }
                catch (err) { }
            }
            paramArr.push(key + "=" + encodeURIComponent(value));
        }
    });
    if (!paramArr.length)
        return url;
    return (url.indexOf('?') > -1 ? url + "&" : url + "?") + paramArr.join('&');
};
exports.delay = function (duration) { return new Promise(function (resolve) { return setTimeout(resolve, duration); }); };
function genPromise() {
    var resolve;
    var reject;
    var promise = new Promise(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });
    return { promise: promise, resolve: resolve, reject: reject };
}
exports.genPromise = genPromise;
exports.noop = function () {
};
exports.getErrorMsg = function (err) {
    if (!err)
        return;
    var message = '';
    if (typeof err === 'string')
        return err;
    message = err.msg || err.Message || err.message || err.errMsg || '连接服务器失败，请稍后再试';
    if (err.reqId) {
        message += "(" + err.reqId + ")";
    }
    if (!message) {
        message = '连接服务器失败，请稍后再试';
    }
    return message;
};
exports.isPlainObject = function (obj) {
    if ((typeof obj === 'undefined' ? 'undefined' : typeof obj) !== 'object' || obj === null)
        return false;
    var proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(obj) === proto;
};


/***/ }),

/***/ "./src/libs/websocket.ts":
/*!*******************************!*\
  !*** ./src/libs/websocket.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var envDetect = tslib_1.__importStar(__webpack_require__(/*! ./envDetect */ "./src/libs/envDetect.ts"));
var WebSocket = /** @class */ (function () {
    function WebSocket(url) {
        this.url = url;
        this.ws = null;
        this.initWs();
    }
    WebSocket.prototype.initWs = function () {
        if (envDetect.isMiniProgram) {
            this.ws = wx.connectSocket({
                url: this.url,
            });
        }
        else {
            this.ws = new WebSocket(this.url);
        }
    };
    WebSocket.prototype.send = function (_a) {
        var data = _a.data;
        if (envDetect.isMiniProgram) {
            this.ws.send({ data: data });
        }
        else {
            this.ws.send(data);
        }
    };
    WebSocket.prototype.close = function (_a) {
        var _b = _a === void 0 ? {} : _a, code = _b.code, reason = _b.reason;
        if (envDetect.isMiniProgram) {
            this.ws.close({
                code: code,
                reason: reason,
            });
        }
        else {
            this.ws.close(code, reason);
        }
    };
    WebSocket.prototype.onOpen = function (callback) {
        if (envDetect.isMiniProgram) {
            this.ws.onOpen(callback);
        }
        else {
            this.ws.addEventListener('open', callback);
        }
    };
    WebSocket.prototype.onClose = function (callback) {
        if (envDetect.isMiniProgram) {
            this.ws.onClose(callback);
        }
        else {
            this.ws.addEventListener('close', callback);
        }
    };
    WebSocket.prototype.onMessage = function (callback) {
        if (envDetect.isMiniProgram) {
            this.ws.onMessage(callback);
        }
        else {
            this.ws.addEventListener('message', callback);
        }
    };
    WebSocket.prototype.onError = function (callback) {
        if (envDetect.isMiniProgram) {
            this.ws.onError(callback);
        }
        else {
            this.ws.addEventListener('error', callback);
        }
    };
    return WebSocket;
}());
exports.WebSocket = WebSocket;


/***/ }),

/***/ "./src/logger.ts":
/*!***********************!*\
  !*** ./src/logger.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var utillib_1 = __webpack_require__(/*! ./libs/utillib */ "./src/libs/utillib.ts");
var LogLevel;
(function (LogLevel) {
    LogLevel["Debug"] = "Debug";
    LogLevel["Info"] = "Info";
    LogLevel["Warn"] = "Warn";
    LogLevel["Error"] = "Error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var logger = (_a = {},
    _a[LogLevel.Debug] = console.log,
    _a[LogLevel.Info] = console.info,
    _a[LogLevel.Warn] = console.warn,
    _a[LogLevel.Error] = console.error,
    _a);
var Logger = /** @class */ (function () {
    function Logger() {
        this.options = {
            debug: false,
        };
    }
    Logger.prototype._getLogger = function (level) {
        if (!(level in LogLevel)) {
            level = LogLevel.Debug;
        }
        if (this.options.debug) {
            return logger[level].bind(console, "[" + level + "]");
        }
        else {
            return utillib_1.noop;
        }
    };
    Logger.prototype.config = function (options) {
        Object.assign(this.options, options);
    };
    Object.defineProperty(Logger.prototype, "info", {
        get: function () {
            return this._getLogger(LogLevel.Info);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Logger.prototype, "debug", {
        get: function () {
            return this._getLogger(LogLevel.Debug);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Logger.prototype, "warn", {
        get: function () {
            return this._getLogger(LogLevel.Warn);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Logger.prototype, "error", {
        get: function () {
            return this._getLogger(LogLevel.Error);
        },
        enumerable: true,
        configurable: true
    });
    return Logger;
}());
exports.default = new Logger();


/***/ }),

/***/ "./src/loginManager.ts":
/*!*****************************!*\
  !*** ./src/loginManager.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/**
 * 通过 token 初始化用户登录态，并在登录态过期后销毁
 */
var event_emmiter_1 = tslib_1.__importDefault(__webpack_require__(/*! ./libs/event-emmiter */ "./src/libs/event-emmiter.ts"));
var request_1 = __webpack_require__(/*! ./libs/request */ "./src/libs/request/index.ts");
var storage_1 = tslib_1.__importDefault(__webpack_require__(/*! ./libs/storage */ "./src/libs/storage.ts"));
var errorHelper_1 = __webpack_require__(/*! ./errorHelper */ "./src/errorHelper.ts");
var logger_1 = tslib_1.__importDefault(__webpack_require__(/*! ./logger */ "./src/logger.ts"));
var accessTokenStorageKey = '__qcloud-iotexplorer-appdev-sdk-accessToken';
var LoginManager = /** @class */ (function (_super) {
    tslib_1.__extends(LoginManager, _super);
    function LoginManager(sdk, _a) {
        var getAccessToken = _a.getAccessToken, appKey = _a.appKey;
        var _this = _super.call(this) || this;
        _this.accessToken = '';
        _this.appKey = '';
        _this.isLogin = false;
        _this.userInfo = null;
        _this.sdk = sdk;
        _this.getAccessToken = getAccessToken;
        _this.appKey = appKey;
        return _this;
    }
    LoginManager.prototype.login = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var usingCacheToken, accessToken, Token, Data, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        usingCacheToken = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 10]);
                        return [4 /*yield*/, storage_1.default.getItem(accessTokenStorageKey)];
                    case 2:
                        accessToken = _a.sent();
                        if (!!accessToken) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getAccessToken()];
                    case 3:
                        Token = (_a.sent()).Token;
                        accessToken = Token;
                        return [3 /*break*/, 5];
                    case 4:
                        usingCacheToken = true;
                        _a.label = 5;
                    case 5: return [4 /*yield*/, request_1.requestTokenApi('AppGetUser', { AccessToken: accessToken })];
                    case 6:
                        Data = (_a.sent()).Data;
                        storage_1.default.setItem(accessTokenStorageKey, accessToken);
                        this.accessToken = accessToken;
                        this.userInfo = Data;
                        this.isLogin = true;
                        return [3 /*break*/, 10];
                    case 7:
                        err_1 = _a.sent();
                        if (!errorHelper_1.isVerifyLoginError(err_1)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.logout()];
                    case 8:
                        _a.sent();
                        if (usingCacheToken) {
                            logger_1.default.debug('Cached Token expired, retrying...');
                            return [2 /*return*/, this.login()];
                        }
                        _a.label = 9;
                    case 9: return [2 /*return*/, Promise.reject(err_1)];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(LoginManager.prototype, "userId", {
        get: function () {
            return this.userInfo ? this.userInfo.UserID : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginManager.prototype, "nickName", {
        get: function () {
            return this.userInfo ? this.userInfo.NickName : '';
        },
        enumerable: true,
        configurable: true
    });
    LoginManager.prototype.checkLogin = function () {
        if (!this.isLogin) {
            throw errorHelper_1.genVerifyLoginFailError();
        }
    };
    LoginManager.prototype.logout = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.default.removeItem(accessTokenStorageKey)];
                    case 1:
                        _a.sent();
                        this.accessToken = '';
                        this.isLogin = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginManager.prototype.reLogin = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.logout()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.login()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return LoginManager;
}(event_emmiter_1.default));
exports.LoginManager = LoginManager;


/***/ }),

/***/ "./src/sdk.ts":
/*!********************!*\
  !*** ./src/sdk.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
__webpack_require__(/*! miniprogram-api-typings */ "./node_modules/miniprogram-api-typings/index.d.ts");
var loginManager_1 = __webpack_require__(/*! ./loginManager */ "./src/loginManager.ts");
var event_emmiter_1 = tslib_1.__importDefault(__webpack_require__(/*! ./libs/event-emmiter */ "./src/libs/event-emmiter.ts"));
var IotWebsocket_1 = __webpack_require__(/*! ./IotWebsocket */ "./src/IotWebsocket.ts");
var logger_1 = tslib_1.__importDefault(__webpack_require__(/*! ./logger */ "./src/logger.ts"));
var base64_1 = __webpack_require__(/*! ./vendor/base64 */ "./src/vendor/base64.js");
var constants_1 = __webpack_require__(/*! ./constants */ "./src/constants.ts");
var utillib_1 = __webpack_require__(/*! ./libs/utillib */ "./src/libs/utillib.ts");
var request_1 = __webpack_require__(/*! ./libs/request */ "./src/libs/request/index.ts");
var errorHelper_1 = __webpack_require__(/*! ./errorHelper */ "./src/errorHelper.ts");
var softap_1 = __webpack_require__(/*! ./softap */ "./src/softap.ts");
var QcloudIotExplorerAppDevSdk = /** @class */ (function (_super) {
    tslib_1.__extends(QcloudIotExplorerAppDevSdk, _super);
    function QcloudIotExplorerAppDevSdk(_a) {
        var getAccessToken = _a.getAccessToken, _b = _a.appKey, appKey = _b === void 0 ? '' : _b, _c = _a.apiPlatform, apiPlatform = _c === void 0 ? '' : _c, _d = _a.debug, debug = _d === void 0 ? false : _d, _e = _a.wsConfig, _f = _e === void 0 ? {} : _e, _g = _f.autoReconnect, autoReconnect = _g === void 0 ? true : _g, _h = _f.disconnectWhenAppHide, disconnectWhenAppHide = _h === void 0 ? true : _h, _j = _f.connectWhenAppShow, connectWhenAppShow = _j === void 0 ? true : _j, wsConfig = tslib_1.__rest(_f, ["autoReconnect", "disconnectWhenAppHide", "connectWhenAppShow"]);
        var _this = _super.call(this) || this;
        _this.isManuallyClose = false;
        _this._defaultFamilyIdPromise = null;
        logger_1.default.config({ debug: debug });
        _this.ws = new IotWebsocket_1.IotWebsocket(_this, tslib_1.__assign(tslib_1.__assign({}, wsConfig), { apiPlatform: apiPlatform }));
        _this.loginManager = new loginManager_1.LoginManager(_this, {
            getAccessToken: getAccessToken,
            appKey: appKey,
        });
        _this._apiPlatform = apiPlatform;
        _this.ws.on('error', function (error) {
            logger_1.default.debug('websocket error', error);
            _this.emit(constants_1.EventTypes.WsError, error);
            if (autoReconnect) {
                _this._reconnectWs();
            }
        });
        _this.ws.on('close', function (_a) {
            var _b = _a === void 0 ? {} : _a, code = _b.code, reason = _b.reason;
            logger_1.default.debug('websocket close', { code: code, reason: reason });
            _this.emit(constants_1.EventTypes.WsClose, { code: code, reason: reason });
            if (autoReconnect) {
                _this._onWebsocketClose();
            }
        });
        _this.ws.on('push', function (pushEvent) { return _this._handlePushEvent(pushEvent); });
        wx.onAppHide(function () {
            if (disconnectWhenAppHide) {
                _this.isManuallyClose = true;
                _this.ws.disconnect();
            }
        });
        wx.onAppShow(function () {
            if (connectWhenAppShow && _this.isLogin) {
                _this.ws.connect();
            }
        });
        return _this;
    }
    Object.defineProperty(QcloudIotExplorerAppDevSdk.prototype, "userInfo", {
        get: function () {
            return this.loginManager.userInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QcloudIotExplorerAppDevSdk.prototype, "isLogin", {
        get: function () {
            return this.loginManager.isLogin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QcloudIotExplorerAppDevSdk.prototype, "userId", {
        get: function () {
            return this.loginManager.userId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QcloudIotExplorerAppDevSdk.prototype, "nickName", {
        get: function () {
            return this.loginManager.nickName;
        },
        enumerable: true,
        configurable: true
    });
    QcloudIotExplorerAppDevSdk.prototype.init = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                if (!options)
                    options = {};
                if (options.reload) {
                    this._initPromise = null;
                }
                return [2 /*return*/, this._initPromise || (this._initPromise = new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var err_1;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, this.loginManager.login()];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, this.ws.connect()];
                                case 2:
                                    _a.sent();
                                    resolve();
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _a.sent();
                                    reject(errorHelper_1.normalizeError(err_1));
                                    this._initPromise = null;
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }))];
            });
        });
    };
    QcloudIotExplorerAppDevSdk.prototype.getDefaultFamilyId = function () {
        var _this = this;
        return this._defaultFamilyIdPromise || (this._defaultFamilyIdPromise = new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, FamilyList, Total, FamilyId, err_2;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.requestApi('AppGetFamilyList', { Offset: 0, Limit: 100 })];
                    case 1:
                        _a = _b.sent(), FamilyList = _a.FamilyList, Total = _a.Total;
                        if (!!Total) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.requestApi('AppCreateFamily', {
                                Name: this.loginManager.nickName,
                            })];
                    case 2:
                        FamilyId = (_b.sent()).Data.FamilyId;
                        return [2 /*return*/, resolve(FamilyId)];
                    case 3:
                        resolve(FamilyList[0].FamilyId);
                        return [3 /*break*/, 5];
                    case 4:
                        err_2 = _b.sent();
                        reject(err_2);
                        this._defaultFamilyIdPromise = null;
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); }));
    };
    QcloudIotExplorerAppDevSdk.prototype.sendWebsocketMessage = function (action, params) {
        if (params === void 0) { params = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.ws.send(action, params)];
                }
            });
        });
    };
    QcloudIotExplorerAppDevSdk.prototype.connectWebsocket = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.ws.connect()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    QcloudIotExplorerAppDevSdk.prototype.disconnectWebsocket = function () {
        this.ws.disconnect();
    };
    QcloudIotExplorerAppDevSdk.prototype.subscribeDevices = function (deviceList) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.ws.subscribe((deviceList || []).map(function (item) {
                    if (typeof item === 'string') {
                        return item;
                    }
                    else if (item && item.DeviceId) {
                        return item.DeviceId;
                    }
                }).filter(Boolean));
                return [2 /*return*/];
            });
        });
    };
    QcloudIotExplorerAppDevSdk.prototype.requestApi = function (Action, payload, _a) {
        if (payload === void 0) { payload = {}; }
        if (_a === void 0) { _a = {}; }
        var _b = _a.doNotRetry, doNotRetry = _b === void 0 ? false : _b, _c = _a.needLogin, needLogin = _c === void 0 ? true : _c, opts = tslib_1.__rest(_a, ["doNotRetry", "needLogin"]);
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _d, accessToken, userId, _e, params, err_3, reLoginError_1;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 6, , 13]);
                        if (!needLogin) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loginManager.checkLogin()];
                    case 1:
                        _f.sent();
                        _f.label = 2;
                    case 2:
                        _d = this.loginManager, accessToken = _d.accessToken, userId = _d.userId;
                        if (!(payload && payload.FamilyId === 'default')) return [3 /*break*/, 4];
                        _e = payload;
                        return [4 /*yield*/, this.getDefaultFamilyId()];
                    case 3:
                        _e.FamilyId = _f.sent();
                        _f.label = 4;
                    case 4:
                        params = tslib_1.__assign({ uin: userId }, payload);
                        if (accessToken) {
                            params.AccessToken = 'fuckyou';
                        }
                        if (this._apiPlatform) {
                            params.Platform = this._apiPlatform;
                        }
                        return [4 /*yield*/, request_1.requestTokenApi(Action, params, opts)];
                    case 5: return [2 /*return*/, _f.sent()];
                    case 6:
                        err_3 = _f.sent();
                        logger_1.default.debug('requestApi fail', err_3);
                        if (!errorHelper_1.isVerifyLoginError(err_3)) return [3 /*break*/, 12];
                        if (!!doNotRetry) return [3 /*break*/, 11];
                        _f.label = 7;
                    case 7:
                        _f.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, this.loginManager.reLogin()];
                    case 8:
                        _f.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        reLoginError_1 = _f.sent();
                        logger_1.default.error('reLogin fail', reLoginError_1);
                        return [2 /*return*/, Promise.reject(errorHelper_1.genVerifyLoginFailError(err_3))];
                    case 10: return [2 /*return*/, this.requestApi(Action, payload, tslib_1.__assign({ doNotRetry: true }, opts))];
                    case 11: return [2 /*return*/, Promise.reject(errorHelper_1.genVerifyLoginFailError(err_3))];
                    case 12: return [2 /*return*/, Promise.reject(errorHelper_1.normalizeError(err_3))];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    QcloudIotExplorerAppDevSdk.prototype.connectDevice = function (options) {
        return softap_1.connectDevice(this, options);
    };
    QcloudIotExplorerAppDevSdk.prototype._handlePushEvent = function (pushEvent) {
        if (!pushEvent)
            pushEvent = {};
        this.emit(constants_1.EventTypes.WsPush, pushEvent);
        var action = pushEvent.action, params = pushEvent.params;
        if (!params)
            params = {};
        logger_1.default.debug('actions updateDeviceDataByPush', pushEvent);
        var DeviceId = params.DeviceId, Type = params.Type, SubType = params.SubType, Payload = params.Payload, Time = params.Time;
        var updateTime = new Date(Time).getTime();
        // 不知道后续还有多少类型，用switch实现
        // action
        switch (action) {
            case 'DeviceChange': {
                // Type
                switch (Type) {
                    case 'Property':
                    case 'Shadow':
                    case 'Template': {
                        // SubType
                        switch (SubType) {
                            case 'Report': {
                                var deviceData = {};
                                try {
                                    var payload = JSON.parse(base64_1.decodeBase64(Payload));
                                    logger_1.default.debug('actions updateDeviceData payload', payload);
                                    if (payload) {
                                        var type = payload.type, state = payload.state, method = payload.method, deviceDataParams = payload.params;
                                        // 老协议兼容
                                        if (type) {
                                            if (type === 'update' && state && state.reported) {
                                                method = 'report';
                                                deviceDataParams = state.reported;
                                            }
                                        }
                                        if (!deviceDataParams)
                                            deviceDataParams = {};
                                        if (method === 'report') {
                                            for (var key in deviceDataParams) {
                                                deviceData[key] = {
                                                    Value: deviceDataParams[key],
                                                    lastUpdate: updateTime,
                                                };
                                            }
                                        }
                                    }
                                }
                                catch (err) {
                                    logger_1.default.error('handle report event error', err);
                                }
                                this.emit(constants_1.EventTypes.WsReport, {
                                    deviceId: DeviceId,
                                    deviceData: deviceData,
                                });
                                break;
                            }
                            // 收到控制参数推送
                            case 'Push': {
                                var deviceData = {};
                                try {
                                    if (Payload) {
                                        var type = Payload.type, payload = Payload.payload, method = Payload.method, deviceDataParams = Payload.params;
                                        // 老协议兼容
                                        if (type) {
                                            if (type === 'delta' && payload && payload.state) {
                                                method = 'control';
                                                deviceDataParams = payload.state;
                                            }
                                        }
                                        if (method === 'control' && deviceDataParams) {
                                            for (var key in deviceDataParams) {
                                                deviceData[key] = {
                                                    Value: deviceDataParams[key],
                                                    LastUpdate: updateTime,
                                                };
                                            }
                                            this.emit(constants_1.EventTypes.WsControl, {
                                                deviceId: DeviceId,
                                                deviceData: deviceData,
                                            });
                                        }
                                    }
                                }
                                catch (err) {
                                    logger_1.default.error(err);
                                }
                                break;
                            }
                        }
                        break;
                    }
                    case 'StatusChange': {
                        var DeviceStatus = SubType === 'Online' ? 1 : 0;
                        this.emit(constants_1.EventTypes.WsStatusChange, {
                            deviceId: DeviceId,
                            deviceStatus: DeviceStatus,
                        });
                    }
                }
                break;
            }
        }
    };
    QcloudIotExplorerAppDevSdk.prototype._onWebsocketClose = function () {
        if (this.isManuallyClose) {
            this.isManuallyClose = false;
            return;
        }
        return this._reconnectWs();
    };
    QcloudIotExplorerAppDevSdk.prototype._reconnectWs = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var err_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        logger_1.default.debug('websocket reconnecting in 2 seconds');
                        return [4 /*yield*/, utillib_1.delay(2000)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.ws.connect()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        logger_1.default.error('error when reconnect ws', err_4);
                        return [2 /*return*/, Promise.reject(err_4)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return QcloudIotExplorerAppDevSdk;
}(event_emmiter_1.default));
exports.QcloudIotExplorerAppDevSdk = QcloudIotExplorerAppDevSdk;


/***/ }),

/***/ "./src/softap.ts":
/*!***********************!*\
  !*** ./src/softap.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var utillib_1 = __webpack_require__(/*! ./libs/utillib */ "./src/libs/utillib.ts");
var pify_1 = __webpack_require__(/*! ./libs/pify */ "./src/libs/pify.ts");
var shortid_1 = tslib_1.__importDefault(__webpack_require__(/*! ./vendor/shortid */ "./src/vendor/shortid/index.js"));
var logger_1 = tslib_1.__importDefault(__webpack_require__(/*! ./logger */ "./src/logger.ts"));
var constants_1 = __webpack_require__(/*! ./constants */ "./src/constants.ts");
var errorHelper_1 = __webpack_require__(/*! ./errorHelper */ "./src/errorHelper.ts");
var decodeUdpMsg = function (message) {
    var unit8Arr = new Uint8Array(message);
    var encodedString = String.fromCharCode.apply(null, unit8Arr);
    return decodeURIComponent(escape((encodedString))); // 没有这一步中文会乱码
};
var confirm = function (title, content, opts) {
    if (content === void 0) { content = ''; }
    if (opts === void 0) { opts = {}; }
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var isConfirm;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wx.hideToast();
                    return [4 /*yield*/, pify_1.pify(wx.showModal)(tslib_1.__assign({ title: title,
                            content: content }, opts)).then(function (_a) {
                            var confirm = _a.confirm;
                            return !!confirm;
                        })
                            .catch(function () { return false; })];
                case 1:
                    isConfirm = _a.sent();
                    return [2 /*return*/, isConfirm];
            }
        });
    });
};
function connectDevice(sdk, _a) {
    var targetWifiInfo = _a.targetWifiInfo, softApInfo = _a.softApInfo, _b = _a.familyId, familyId = _b === void 0 ? 'default' : _b, _c = _a.udpAddress, udpAddress = _c === void 0 ? '192.168.4.1' : _c, _d = _a.udpPort, udpPort = _d === void 0 ? 8266 : _d, _e = _a.waitUdpResponseDuration, waitUdpResponseDuration = _e === void 0 ? 2000 : _e, _f = _a.udpCommunicationRetryTime, udpCommunicationRetryTime = _f === void 0 ? 5 : _f, _g = _a.stepGap, stepGap = _g === void 0 ? 3000 : _g, _h = _a.onProgress, onProgress = _h === void 0 ? utillib_1.noop : _h, _j = _a.onError, onError = _j === void 0 ? utillib_1.noop : _j, _k = _a.onComplete, onComplete = _k === void 0 ? utillib_1.noop : _k, handleAddDevice = _a.handleAddDevice;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var connectionId, udpInstance_1, udpResponseHandler_1, setProgress_1, sendUdpMsg_1, sendMsg_1, connectWifi_1, connect, err_1, error, error_1;
        var _this = this;
        return tslib_1.__generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    connectionId = shortid_1.default();
                    _l.label = 1;
                case 1:
                    _l.trys.push([1, 8, , 9]);
                    udpResponseHandler_1 = function (message) {
                        logger_1.default.debug('softap-receive-unhandled-msg', {
                            data: { message: message },
                        });
                    };
                    setProgress_1 = function (stepCode, detail) {
                        try {
                            logger_1.default.debug("STEP => " + stepCode + ", detail => " + JSON.stringify(detail));
                        }
                        catch (e) {
                        }
                        onProgress(tslib_1.__assign({ code: stepCode, msg: constants_1.SoftApStepMsg[stepCode] }, detail));
                    };
                    sendUdpMsg_1 = function (message) {
                        if (typeof message !== 'string') {
                            message = JSON.stringify(message);
                        }
                        udpInstance_1.send({
                            address: udpAddress,
                            port: udpPort,
                            message: message,
                        });
                    };
                    sendMsg_1 = function (msg) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return tslib_1.__generator(this, function (_a) {
                            return [2 /*return*/, new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                    var promisePending_1, retryCount_1, doSend, err_2;
                                    return tslib_1.__generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 4, , 5]);
                                                promisePending_1 = true;
                                                retryCount_1 = 0;
                                                udpResponseHandler_1 = function (message) {
                                                    try {
                                                        promisePending_1 = false;
                                                        resolve(message);
                                                    }
                                                    catch (err) {
                                                        reject(err);
                                                    }
                                                };
                                                doSend = function () {
                                                    retryCount_1++;
                                                    logger_1.default.debug('softap-udp-send-msg', {
                                                        data: {
                                                            msg: msg,
                                                            retryCount: retryCount_1,
                                                        },
                                                    });
                                                    sendUdpMsg_1(msg);
                                                };
                                                doSend();
                                                _a.label = 1;
                                            case 1:
                                                if (!(promisePending_1 && retryCount_1 <= udpCommunicationRetryTime)) return [3 /*break*/, 3];
                                                return [4 /*yield*/, utillib_1.delay(waitUdpResponseDuration)];
                                            case 2:
                                                _a.sent();
                                                if (promisePending_1) {
                                                    doSend();
                                                }
                                                else {
                                                    return [2 /*return*/];
                                                }
                                                return [3 /*break*/, 1];
                                            case 3:
                                                reject({ code: constants_1.ConnectDeviceErrorCode.UDP_NOT_RESPONSED });
                                                return [3 /*break*/, 5];
                                            case 4:
                                                err_2 = _a.sent();
                                                err_2 = errorHelper_1.normalizeError(err_2);
                                                err_2.code = constants_1.ConnectDeviceErrorCode.SEND_UDP_MSG_FAIL;
                                                reject(err_2);
                                                return [3 /*break*/, 5];
                                            case 5: return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        });
                    }); };
                    connectWifi_1 = function (_a) {
                        var SSID = _a.SSID, password = _a.password;
                        return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var wifi;
                            return tslib_1.__generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, pify_1.pify(wx.connectWifi)({
                                            SSID: SSID,
                                            password: password,
                                        })];
                                    case 1:
                                        _b.sent();
                                        return [4 /*yield*/, pify_1.pify(wx.getConnectedWifi)()];
                                    case 2:
                                        wifi = (_b.sent()).wifi;
                                        if (wifi.SSID !== SSID) {
                                            throw { code: constants_1.ConnectDeviceErrorCode.SSID_NOT_MATCH };
                                        }
                                        logger_1.default.debug('softap-connect-wifi-success');
                                        return [2 /*return*/];
                                }
                            });
                        });
                    };
                    connect = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var connectAborted, onErrorPromise_1, onClosePromise, onProgressErrorPromise_1, doConnect, error_2;
                        var _this = this;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    connectAborted = false;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    setProgress_1(constants_1.ConnectDeviceStepCode.CREATE_UDP_CONNECTION_START);
                                    // 1. 建立连接
                                    udpInstance_1 = wx.createUDPSocket();
                                    udpInstance_1.bind();
                                    onErrorPromise_1 = utillib_1.genPromise();
                                    onClosePromise = utillib_1.genPromise();
                                    onProgressErrorPromise_1 = utillib_1.genPromise();
                                    udpInstance_1.onError(function (errMsg) { return onErrorPromise_1.reject({
                                        code: constants_1.ConnectDeviceErrorCode.UDP_ERROR,
                                        errMsg: errMsg,
                                    }); });
                                    udpInstance_1.onMessage(function (resp) {
                                        try {
                                            var message = JSON.parse(decodeUdpMsg(resp.message));
                                            logger_1.default.debug('softap-udp-on-message', {
                                                data: { message: message },
                                            });
                                            // 模组回包肯定cmdType==2，其他的信息不需要关注可能不是模组回的
                                            if (+message.cmdType === 2) {
                                                // 模组回异常，直接中断过程报错
                                                if (message.deviceReply === 'Current_Error') {
                                                    onProgressErrorPromise_1.reject({
                                                        code: constants_1.ConnectDeviceErrorCode.DEVICE_ERROR,
                                                        errMsg: message,
                                                    });
                                                }
                                                else if (message.deviceReply === 'Previous_Error') { // 上一次连接过程中发生的，还未来得及发出去的错误信息，直接上报，不产生副作用
                                                    logger_1.default.debug('softap-receive-prev-error', {
                                                        data: { message: message },
                                                    });
                                                }
                                                else { // 每个步骤自行注册回调，来判断自己的步骤是否有收到期望的回包
                                                    udpResponseHandler_1(message);
                                                }
                                            }
                                        }
                                        catch (error) {
                                            logger_1.default.debug('softap-udp-parse-message-error', {
                                                error: error,
                                            });
                                        }
                                    });
                                    doConnect = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        var stepCheck, start, response, _a, mqttState, wifiState, signInfo, userSkipReconnectWifi, err_3, isConfirm, error, doAddDevice, addDeviceResp;
                                        var _this = this;
                                        return tslib_1.__generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    stepCheck = function (duration) {
                                                        if (duration === void 0) { duration = stepGap; }
                                                        return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                            return tslib_1.__generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, utillib_1.delay(duration)];
                                                                    case 1:
                                                                        _a.sent();
                                                                        if (connectAborted) {
                                                                            logger_1.default.debug('connection aborted');
                                                                            throw null;
                                                                        }
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        });
                                                    };
                                                    start = Date.now();
                                                    console.log('step check', start);
                                                    return [4 /*yield*/, stepCheck()];
                                                case 1:
                                                    _b.sent();
                                                    console.log('after step check', Date.now() - start);
                                                    setProgress_1(constants_1.ConnectDeviceStepCode.CREATE_UDP_CONNECTION_SUCCESS);
                                                    setProgress_1(constants_1.ConnectDeviceStepCode.SEND_TARGET_WIFIINFO_START);
                                                    return [4 /*yield*/, sendMsg_1({
                                                            cmdType: 1,
                                                            ssid: targetWifiInfo.SSID,
                                                            password: targetWifiInfo.password,
                                                        })];
                                                case 2:
                                                    response = _b.sent();
                                                    if (response.deviceReply !== 'dataRecived') {
                                                        throw { code: constants_1.ConnectDeviceErrorCode.INVALID_UDP_RESPONSE, response: response };
                                                    }
                                                    return [4 /*yield*/, stepCheck(5000)];
                                                case 3:
                                                    _b.sent();
                                                    setProgress_1(constants_1.ConnectDeviceStepCode.SEND_TARGET_WIFIINFO_SUCCESS, { response: response });
                                                    setProgress_1(constants_1.ConnectDeviceStepCode.GET_DEVICE_SIGNATURE_START);
                                                    return [4 /*yield*/, sendMsg_1({
                                                            cmdType: 0,
                                                            timestamp: parseInt(String(Date.now() / 1000)),
                                                        })];
                                                case 4:
                                                    _a = _b.sent(), mqttState = _a.mqttState, wifiState = _a.wifiState, signInfo = tslib_1.__rest(_a, ["mqttState", "wifiState"]);
                                                    if (mqttState !== 'connected') {
                                                        throw {
                                                            code: constants_1.ConnectDeviceErrorCode.DEVICE_CONNECT_MQTT_FAIL,
                                                        };
                                                    }
                                                    if (wifiState !== 'connected') {
                                                        throw {
                                                            code: constants_1.ConnectDeviceErrorCode.DEVICE_CONNECT_WIFI_FAIL,
                                                        };
                                                    }
                                                    return [4 /*yield*/, stepCheck()];
                                                case 5:
                                                    _b.sent();
                                                    setProgress_1(constants_1.ConnectDeviceStepCode.GET_DEVICE_SIGNATURE_SUCCESS, { signature: signInfo });
                                                    udpInstance_1.close();
                                                    if (!(typeof handleAddDevice === 'function')) return [3 /*break*/, 7];
                                                    return [4 /*yield*/, handleAddDevice({
                                                            Signature: signInfo.signature,
                                                            DeviceTimestamp: signInfo.timestamp,
                                                            ProductId: signInfo.productId,
                                                            DeviceName: signInfo.deviceName,
                                                            ConnId: signInfo.connId,
                                                        })];
                                                case 6: return [2 /*return*/, _b.sent()];
                                                case 7:
                                                    userSkipReconnectWifi = false;
                                                    _b.label = 8;
                                                case 8:
                                                    _b.trys.push([8, 10, , 12]);
                                                    setProgress_1(constants_1.ConnectDeviceStepCode.CONNECT_TARGET_WIFI_START);
                                                    return [4 /*yield*/, connectWifi_1(targetWifiInfo)];
                                                case 9:
                                                    _b.sent();
                                                    return [3 /*break*/, 12];
                                                case 10:
                                                    err_3 = _b.sent();
                                                    return [4 /*yield*/, confirm('手机连接路由Wi-Fi失败，请将手机手动切换到能够正常访问的网络环境后继续配网操作', '', {
                                                            confirmText: '继续',
                                                            confirmColor: '#0052d9',
                                                            cancelText: '取消',
                                                            cancelColor: '#ff584c',
                                                        })];
                                                case 11:
                                                    isConfirm = _b.sent();
                                                    if (!isConfirm) {
                                                        error = { code: constants_1.ConnectDeviceErrorCode.CONNECT_TARGET_WIFI_FAIL };
                                                        if (err_3 && err_3.errMsg) {
                                                            error.errMsg = err_3.errMsg;
                                                        }
                                                        throw error;
                                                    }
                                                    userSkipReconnectWifi = true;
                                                    return [3 /*break*/, 12];
                                                case 12:
                                                    setProgress_1(constants_1.ConnectDeviceStepCode.CONNECT_TARGET_WIFI_SUCCESS, { userSkipReconnectWifi: userSkipReconnectWifi });
                                                    return [4 /*yield*/, stepCheck()];
                                                case 13:
                                                    _b.sent();
                                                    doAddDevice = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                        var err_4, isConfirm, isConfirm;
                                                        return tslib_1.__generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    _a.trys.push([0, 2, , 7]);
                                                                    return [4 /*yield*/, sdk.requestApi('AppSigBindDeviceInFamily', {
                                                                            Signature: signInfo.signature,
                                                                            DeviceTimestamp: signInfo.timestamp,
                                                                            ProductId: signInfo.productId,
                                                                            DeviceName: signInfo.deviceName,
                                                                            ConnId: signInfo.connId,
                                                                            FamilyId: familyId || 'default',
                                                                        })];
                                                                case 1: return [2 /*return*/, _a.sent()];
                                                                case 2:
                                                                    err_4 = _a.sent();
                                                                    if (!err_4) return [3 /*break*/, 6];
                                                                    if (!(err_4.errMsg && /request:fail/.test(err_4.errMsg))) return [3 /*break*/, 4];
                                                                    return [4 /*yield*/, confirm('手机切换到该网络环境后依然无法正常上网访问，请继续切换网络重试或取消配网操作', '', {
                                                                            confirmText: '重试',
                                                                            confirmColor: '#0052d9',
                                                                            cancelText: '取消',
                                                                            cancelColor: '#ff584c',
                                                                        })];
                                                                case 3:
                                                                    isConfirm = _a.sent();
                                                                    if (isConfirm) {
                                                                        return [2 /*return*/, doAddDevice()];
                                                                    }
                                                                    else {
                                                                        return [2 /*return*/, Promise.reject({
                                                                                code: constants_1.ConnectDeviceErrorCode.ADD_DEVICE_FAIL,
                                                                                errMsg: err_4.errMsg,
                                                                            })];
                                                                    }
                                                                    return [3 /*break*/, 6];
                                                                case 4: return [4 /*yield*/, confirm(utillib_1.getErrorMsg(err_4), '', {
                                                                        confirmText: '重试',
                                                                        confirmColor: '#0052d9',
                                                                        cancelText: '取消',
                                                                        cancelColor: '#ff584c',
                                                                    })];
                                                                case 5:
                                                                    isConfirm = _a.sent();
                                                                    if (isConfirm) {
                                                                        return [2 /*return*/, doAddDevice()];
                                                                    }
                                                                    else {
                                                                        err_4 = errorHelper_1.normalizeError(err_4);
                                                                        err_4.code = constants_1.ConnectDeviceErrorCode.ADD_DEVICE_FAIL;
                                                                        return [2 /*return*/, Promise.reject(err_4)];
                                                                    }
                                                                    _a.label = 6;
                                                                case 6: return [2 /*return*/, Promise.reject(err_4)];
                                                                case 7: return [2 /*return*/];
                                                            }
                                                        });
                                                    }); };
                                                    setProgress_1(constants_1.ConnectDeviceStepCode.ADD_DEVICE_START, {
                                                        params: {
                                                            Signature: signInfo.signature,
                                                            DeviceTimestamp: signInfo.timestamp,
                                                            ProductId: signInfo.productId,
                                                            DeviceName: signInfo.deviceName,
                                                            ConnId: signInfo.connId,
                                                        },
                                                    });
                                                    return [4 /*yield*/, doAddDevice()];
                                                case 14:
                                                    addDeviceResp = _b.sent();
                                                    setProgress_1(constants_1.ConnectDeviceStepCode.ADD_DEVICE_SUCCESS, { response: addDeviceResp });
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); };
                                    return [4 /*yield*/, Promise.race([
                                            doConnect(),
                                            onErrorPromise_1.promise,
                                            onClosePromise.promise,
                                            onProgressErrorPromise_1.promise,
                                        ])];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_2 = _a.sent();
                                    connectAborted = true;
                                    logger_1.default.debug('softap-connect-fail', { error: error_2 });
                                    return [2 /*return*/, Promise.reject(error_2)];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); };
                    setProgress_1(constants_1.ConnectDeviceStepCode.CONNECT_DEVICE_START);
                    // 逻辑 start
                    return [4 /*yield*/, pify_1.pify(wx.startWifi)()];
                case 2:
                    // 逻辑 start
                    _l.sent();
                    if (!softApInfo) return [3 /*break*/, 6];
                    _l.label = 3;
                case 3:
                    _l.trys.push([3, 5, , 6]);
                    setProgress_1(constants_1.ConnectDeviceStepCode.CONNECT_SOFTAP_START);
                    return [4 /*yield*/, connectWifi_1(softApInfo)];
                case 4:
                    _l.sent();
                    setProgress_1(constants_1.ConnectDeviceStepCode.CONNECT_SOFTAP_SUCCESS);
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _l.sent();
                    error = { code: constants_1.ConnectDeviceErrorCode.CONNECT_SOFTAP_FAIL };
                    if (err_1 && err_1.errMsg) {
                        error.errMsg = err_1.errMsg;
                    }
                    throw error;
                case 6: return [4 /*yield*/, connect()];
                case 7:
                    _l.sent();
                    setProgress_1(constants_1.ConnectDeviceStepCode.CONNECT_DEVICE_SUCCESS);
                    onComplete();
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _l.sent();
                    if (error_1 && error_1.code in constants_1.ConnectDeviceErrorCode) {
                        error_1.msg = constants_1.SoftApErrorMsg[error_1.code];
                    }
                    onError(error_1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.connectDevice = connectDevice;


/***/ }),

/***/ "./src/vendor/base64.js":
/*!******************************!*\
  !*** ./src/vendor/base64.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

// From https://github.com/ziyan/javascript-rsa

const base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

exports.encodeBase64 = ($input) => {
	if (!$input) {
		return false;
	}
	// $input = UTF8.encode($input);
	let $output = '';
	let $chr1,
		$chr2,
		$chr3;
	let $enc1,
		$enc2,
		$enc3,
		$enc4;
	let $i = 0;
	do {
		$chr1 = $input.charCodeAt($i++);
		$chr2 = $input.charCodeAt($i++);
		$chr3 = $input.charCodeAt($i++);
		$enc1 = $chr1 >> 2;
		$enc2 = (($chr1 & 3) << 4) | ($chr2 >> 4);
		$enc3 = (($chr2 & 15) << 2) | ($chr3 >> 6);
		$enc4 = $chr3 & 63;
		if (isNaN($chr2)) $enc3 = $enc4 = 64;
		else if (isNaN($chr3)) $enc4 = 64;
		$output += base64.charAt($enc1) + base64.charAt($enc2) + base64.charAt($enc3) + base64.charAt($enc4);
	} while ($i < $input.length);
	return $output;
};

exports.decodeBase64 = ($input) => {
	if (!$input) return false;
	$input = $input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
	let $output = '';
	let $enc1,
		$enc2,
		$enc3,
		$enc4;
	let $i = 0;
	do {
		$enc1 = base64.indexOf($input.charAt($i++));
		$enc2 = base64.indexOf($input.charAt($i++));
		$enc3 = base64.indexOf($input.charAt($i++));
		$enc4 = base64.indexOf($input.charAt($i++));
		$output += String.fromCharCode(($enc1 << 2) | ($enc2 >> 4));
		if ($enc3 != 64) $output += String.fromCharCode((($enc2 & 15) << 4) | ($enc3 >> 2));
		if ($enc4 != 64) $output += String.fromCharCode((($enc3 & 3) << 6) | $enc4);
	} while ($i < $input.length);
	return $output; // UTF8.decode($output);
};


/***/ }),

/***/ "./src/vendor/shortid/alphabet.js":
/*!****************************************!*\
  !*** ./src/vendor/shortid/alphabet.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var randomFromSeed = __webpack_require__(/*! ./random/random-from-seed */ "./src/vendor/shortid/random/random-from-seed.js");

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

function get () {
  return alphabet || ORIGINAL;
}

module.exports = {
    get: get,
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};


/***/ }),

/***/ "./src/vendor/shortid/build.js":
/*!*************************************!*\
  !*** ./src/vendor/shortid/build.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var generate = __webpack_require__(/*! ./generate */ "./src/vendor/shortid/generate.js");
var alphabet = __webpack_require__(/*! ./alphabet */ "./src/vendor/shortid/alphabet.js");

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {
    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + generate(version);
    str = str + generate(clusterWorkerId);
    if (counter > 0) {
        str = str + generate(counter);
    }
    str = str + generate(seconds);
    return str;
}

module.exports = build;


/***/ }),

/***/ "./src/vendor/shortid/generate.js":
/*!****************************************!*\
  !*** ./src/vendor/shortid/generate.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(/*! ./alphabet */ "./src/vendor/shortid/alphabet.js");
var random = __webpack_require__(/*! ./random/random-byte */ "./src/vendor/shortid/random/random-byte.js");
var format = __webpack_require__(/*! ./nanoid-format */ "./src/vendor/shortid/nanoid-format.js");

function generate(number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + format(random, alphabet.get(), 1);
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = generate;


/***/ }),

/***/ "./src/vendor/shortid/index.js":
/*!*************************************!*\
  !*** ./src/vendor/shortid/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = __webpack_require__(/*! ./alphabet */ "./src/vendor/shortid/alphabet.js");
var build = __webpack_require__(/*! ./build */ "./src/vendor/shortid/build.js");
var isValid = __webpack_require__(/*! ./is-valid */ "./src/vendor/shortid/is-valid.js");

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = __webpack_require__(/*! ./util/cluster-worker-id */ "./src/vendor/shortid/util/cluster-worker-id.js") || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.isValid = isValid;


/***/ }),

/***/ "./src/vendor/shortid/is-valid.js":
/*!****************************************!*\
  !*** ./src/vendor/shortid/is-valid.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var alphabet = __webpack_require__(/*! ./alphabet */ "./src/vendor/shortid/alphabet.js");

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var nonAlphabetic = new RegExp('[^' +
      alphabet.get().replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&') +
    ']');
    return !nonAlphabetic.test(id);
}

module.exports = isShortId;


/***/ }),

/***/ "./src/vendor/shortid/nanoid-format.js":
/*!*********************************************!*\
  !*** ./src/vendor/shortid/nanoid-format.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Secure random string generator with custom alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @param {generator} random The random bytes generator.
 * @param {string} alphabet Symbols to be used in new random string.
 * @param {size} size The number of symbols in new random string.
 *
 * @return {string} Random string.
 *
 * @example
 * const format = require('nanoid/format')
 *
 * function random (size) {
 *   const result = []
 *   for (let i = 0; i < size; i++) {
 *     result.push(randomByte())
 *   }
 *   return result
 * }
 *
 * format(random, "abcdef", 5) //=> "fbaef"
 *
 * @name format
 * @function
 */
module.exports = function (random, alphabet, size) {
	var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1
	var step = Math.ceil(1.6 * mask * size / alphabet.length)

	var id = ''
	while (true) {
		var bytes = random(step)
		for (var i = 0; i < step; i++) {
			var byte = bytes[i] & mask
			if (alphabet[byte]) {
				id += alphabet[byte]
				if (id.length === size) return id
			}
		}
	}
}

/**
 * @callback generator
 * @param {number} bytes The number of bytes to generate.
 * @return {number[]} Random bytes.
 */


/***/ }),

/***/ "./src/vendor/shortid/random/random-byte.js":
/*!**************************************************!*\
  !*** ./src/vendor/shortid/random/random-byte.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

var randomByte;

if (!crypto || !crypto.getRandomValues) {
	randomByte = function(size) {
		var bytes = [];
		for (var i = 0; i < size; i++) {
			bytes.push(Math.floor(Math.random() * 256));
		}
		return bytes;
	};
} else {
	randomByte = function(size) {
		return crypto.getRandomValues(new Uint8Array(size));
	};
}

module.exports = randomByte;


/***/ }),

/***/ "./src/vendor/shortid/random/random-from-seed.js":
/*!*******************************************************!*\
  !*** ./src/vendor/shortid/random/random-from-seed.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};


/***/ }),

/***/ "./src/vendor/shortid/util/cluster-worker-id.js":
/*!******************************************************!*\
  !*** ./src/vendor/shortid/util/cluster-worker-id.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = 0;


/***/ })

/******/ });
});
//# sourceMappingURL=qcloud-iotexplorer-appdev-sdk.js.map