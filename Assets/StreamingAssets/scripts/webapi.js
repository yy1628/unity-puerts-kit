/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/addons/webapi/animationframe.ts":
/*!*********************************************!*\
  !*** ./src/addons/webapi/animationframe.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let global_action_id = 0;
let current = /* @__PURE__ */ new Map();
let next = /* @__PURE__ */ new Map();
function cancelAnimationFrame(handle) {
  next.delete(handle);
}
function requestAnimationFrame(callback) {
  next.set(++global_action_id, callback);
  return global_action_id;
}
function tick(now) {
  let temp = current;
  current = next;
  next = temp;
  next.clear();
  for (const [_, action] of current) {
    action(now);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  tick,
  exports: {
    requestAnimationFrame,
    cancelAnimationFrame
  }
});


/***/ }),

/***/ "./src/addons/webapi/console.unity.ts":
/*!********************************************!*\
  !*** ./src/addons/webapi/console.unity.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! csharp */ "csharp");
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(csharp__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var puerts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! puerts */ "puerts");
/* harmony import */ var puerts__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(puerts__WEBPACK_IMPORTED_MODULE_1__);


const LogType = {
  "error": 0,
  "assert": 1,
  "warn": 2,
  "log": 3,
  "exception": 4
};
const scriptResources = /* @__PURE__ */ new Map();
const emptyResources = new csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Object();
const isUnityEditor = csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Application.isEditor;
function print(type, showStack, ...args) {
  let message = "";
  for (let i = 0; i < args.length; i++) {
    const element = args[i];
    if (typeof element === "object" && console.LOG_OBJECT_TO_JSON) {
      if (element instanceof Error) {
        message += element.message;
      } else {
        message += JSON.stringify(element, void 0, "  ");
      }
    } else {
      message += element;
    }
    if (i < args.length - 1) {
      message += " ";
    }
  }
  let unityLogTarget = null;
  if (showStack || csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Application.isEditor) {
    var stacks = new Error().stack.split("\n");
    for (let i = 3; i < stacks.length; i++) {
      let line = stacks[i];
      message += "\n";
      if (isUnityEditor) {
        const matches = line.match(/at\s.*?\s\((.*?)\:(\d+)/);
        if (matches && matches.length >= 3) {
          let file = matches[1].replace(/\\/g, "/");
          if (console.STACK_REMAP) {
            file = console.STACK_REMAP(file);
          }
          const lineNumber = matches[2];
          line = line.replace(/\s\(/, ` (<a href="${file}" line="${lineNumber}">`);
          line = line.replace(/\)$/, " </a>)");
          line = line.replace(matches[1], file);
          if (!unityLogTarget) {
            if (!scriptResources.has(file)) {
              scriptResources.set(file, csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEditor.AssetDatabase.LoadAssetAtPath(file, (0,puerts__WEBPACK_IMPORTED_MODULE_1__.$typeof)(csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Object)));
            }
            unityLogTarget = scriptResources.get(file);
          }
        }
      }
      message += line;
    }
  }
  message = message.replace(/{/gm, "{{");
  message = message.replace(/}/gm, "}}");
  csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Debug.LogFormat(LogType[type], csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.LogOption.NoStacktrace, unityLogTarget || emptyResources, message);
}
const globalConsole = globalThis["console"];
if (typeof globalConsole === "undefined") {
  Object.defineProperty(globalThis, "console", {
    value: {
      log: (...args) => print("log", false, ...args),
      info: (...args) => print("log", true, ...args),
      trace: (...args) => print("log", true, ...args),
      warn: (...args) => print("warn", true, ...args),
      error: (...args) => print("error", true, ...args),
      LOG_OBJECT_TO_JSON: false
    },
    enumerable: true,
    configurable: true,
    writable: false
  });
} else {
  for (const key in LogType) {
    const func = globalConsole[key];
    if (typeof func === "function") {
      globalConsole[key] = function() {
        func.apply(globalConsole, arguments);
        print(key, key != "log", ...arguments);
      };
    }
  }
}


/***/ }),

/***/ "./src/addons/webapi/event.ts":
/*!************************************!*\
  !*** ./src/addons/webapi/event.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Event": () => (/* binding */ Event),
/* harmony export */   "EventTarget": () => (/* binding */ EventTarget),
/* harmony export */   "Phase": () => (/* binding */ Phase),
/* harmony export */   "ProgressEvent": () => (/* binding */ ProgressEvent),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var Phase = /* @__PURE__ */ ((Phase2) => {
  Phase2[Phase2["NONE"] = 0] = "NONE";
  Phase2[Phase2["CAPTURING_PHASE"] = 1] = "CAPTURING_PHASE";
  Phase2[Phase2["AT_TARGET"] = 2] = "AT_TARGET";
  Phase2[Phase2["BUBBLING_PHASE"] = 3] = "BUBBLING_PHASE";
  return Phase2;
})(Phase || {});
class Event {
  constructor(type, eventInitDict) {
    this._type = type;
    if (eventInitDict) {
      this._bubbles = eventInitDict.bubbles;
      this._cancelable = eventInitDict.cancelable;
      this._composed = eventInitDict.composed;
    }
  }
  get bubbles() {
    return this._bubbles;
  }
  get cancelable() {
    return this._cancelable;
  }
  get composed() {
    return this._composed;
  }
  get currentTarget() {
    return this._currentTarget;
  }
  get defaultPrevented() {
    return this._defaultPrevented;
  }
  get eventPhase() {
    return this._eventPhase;
  }
  get isTrusted() {
    return this._isTrusted;
  }
  get target() {
    return this._target;
  }
  get timeStamp() {
    return this._timeStamp;
  }
  get type() {
    return this._type;
  }
  composedPath() {
    return [];
  }
  initEvent(type, bubbles, cancelable) {
    this._type = type;
    this._bubbles = bubbles;
    this._cancelable = cancelable;
  }
  preventDefault() {
    if (this.cancelable) {
      this._defaultPrevented = true;
    }
  }
  stopImmediatePropagation() {
    this._defaultPrevented = true;
    this.cancelBubble = false;
  }
  stopPropagation() {
    if (this._bubbles) {
      this.cancelBubble = true;
    }
  }
}
class ProgressEvent extends Event {
  constructor(type, eventInitDict) {
    super(type, eventInitDict);
    if (eventInitDict) {
      this._lengthComputable = eventInitDict.lengthComputable;
      this._loaded = eventInitDict.loaded;
      this._total = eventInitDict.total;
    }
  }
  get lengthComputable() {
    return this._lengthComputable;
  }
  get loaded() {
    return this._loaded;
  }
  get total() {
    return this._total;
  }
}
class EventTarget {
  constructor() {
    this._listeners = {};
  }
  addEventListener(type, listener, options) {
    if (!listener)
      return;
    if (!(type in this._listeners)) {
      this._listeners[type] = [];
    }
    let recorder = { listener };
    if (typeof options === "boolean") {
      recorder.capture = options;
    } else if (typeof options === "object") {
      recorder = __spreadProps(__spreadValues({}, options), { listener });
    }
    this._listeners[type].push(recorder);
  }
  dispatchEvent(event) {
    if (!event || typeof event.type != "string")
      return true;
    const origin_recorders = this._listeners[event.type];
    if (!origin_recorders)
      return true;
    const recorders = origin_recorders.slice();
    if (!recorders.length)
      return !event.defaultPrevented;
    event["_target"] = this;
    let once_listeners = [];
    for (const recorder of recorders) {
      let listener = null;
      if (recorder.listener.handleEvent) {
        listener = recorder.listener.handleEvent;
      } else {
        listener = recorder.listener;
      }
      if (typeof listener === "function") {
        listener.call(this, event);
      }
      if (recorder.once) {
        once_listeners.push(recorder);
      }
      if (event.defaultPrevented)
        break;
    }
    for (let i = 0; i < once_listeners.length; i++) {
      origin_recorders.splice(origin_recorders.indexOf(once_listeners[i]), 1);
    }
    return !event.defaultPrevented;
  }
  removeEventListener(type, listener, options) {
    if (!listener || !(type in this._listeners))
      return;
    const recorders = this._listeners[type];
    for (let i = 0; i < recorders.length; i++) {
      const recorder = recorders[i];
      if (recorder.listener === listener) {
        let sameOptions = true;
        if (typeof options === "boolean") {
          sameOptions = recorder.capture == options;
        } else if (typeof options === "object") {
          sameOptions = recorder.capture == options.capture;
        }
        if (sameOptions) {
          recorders.splice(i, 1);
          break;
        }
      }
    }
  }
  clearEventListeners(type) {
    if (typeof type === "string") {
      this._listeners[type] = void 0;
    } else if (typeof type === "undefined") {
      this._listeners = {};
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  exports: {
    Phase,
    Event,
    ProgressEvent,
    EventTarget
  }
});


/***/ }),

/***/ "./src/addons/webapi/index.common.ts":
/*!*******************************************!*\
  !*** ./src/addons/webapi/index.common.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "finalize": () => (/* binding */ finalize),
/* harmony export */   "initialize": () => (/* binding */ initialize),
/* harmony export */   "tick": () => (/* binding */ tick)
/* harmony export */ });
let registered_modules = [];
function initialize(modules) {
  Object.defineProperty(globalThis, "window", { value: globalThis });
  for (const m of modules) {
    if (m.initialize)
      m.initialize();
    if (!m.exports)
      continue;
    for (const key in m.exports) {
      Object.defineProperty(window, key, { value: m.exports[key] });
    }
  }
  registered_modules = modules;
}
function finalize() {
  for (const m of registered_modules) {
    if (m.uninitialize)
      m.uninitialize();
  }
}
function tick() {
  for (const m of registered_modules) {
    if (m.tick && WebAPI.getHighResTimeStamp) {
      m.tick(WebAPI.getHighResTimeStamp());
    }
  }
}
Object.defineProperty(globalThis, "WebAPI", { value: {
  tick,
  finalize,
  getHighResTimeStamp: Date.now
} });


/***/ }),

/***/ "./src/addons/webapi/misc.unity.ts":
/*!*****************************************!*\
  !*** ./src/addons/webapi/misc.unity.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! csharp */ "csharp");
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(csharp__WEBPACK_IMPORTED_MODULE_0__);

function btoa(text) {
  return csharp__WEBPACK_IMPORTED_MODULE_0__.System.Convert.ToBase64String(csharp__WEBPACK_IMPORTED_MODULE_0__.System.Text.Encoding.UTF8.GetBytes(text));
}
function atob(base64) {
  let data = csharp__WEBPACK_IMPORTED_MODULE_0__.System.Convert.FromBase64String(base64);
  let base64Decoded = csharp__WEBPACK_IMPORTED_MODULE_0__.System.Text.Encoding.ASCII.GetString(data);
  return base64Decoded;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  initialize: function() {
    Object.setPrototypeOf(csharp__WEBPACK_IMPORTED_MODULE_0__.System.Text.Encoding.ASCII, csharp__WEBPACK_IMPORTED_MODULE_0__.System.Text.Encoding.prototype);
    Object.setPrototypeOf(csharp__WEBPACK_IMPORTED_MODULE_0__.System.Text.Encoding.UTF8, csharp__WEBPACK_IMPORTED_MODULE_0__.System.Text.Encoding.prototype);
  },
  exports: {
    atob,
    btoa
  }
});


/***/ }),

/***/ "./src/addons/webapi/performance.ts":
/*!******************************************!*\
  !*** ./src/addons/webapi/performance.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./event */ "./src/addons/webapi/event.ts");

class PerformanceEntry {
  constructor(name, startTime, entryType, duration = 0) {
    this.startTime = startTime;
    this.name = name;
    this.entryType = entryType;
    this.duration = duration;
  }
  toJSON() {
    return {
      duration: this.duration,
      entryType: this.entryType,
      name: this.name,
      startTime: this.startTime
    };
  }
}
class PerformanceMark extends PerformanceEntry {
}
class PerformanceMeasure extends PerformanceEntry {
}
const MARK_TYPE = "mark";
const MEASURE_TYPE = "measure";
class Performance extends _event__WEBPACK_IMPORTED_MODULE_0__.EventTarget {
  constructor() {
    super();
    this._entries = /* @__PURE__ */ new Map();
    this.timeOrigin = Date.now();
  }
  now() {
    return Date.now() - this.timeOrigin;
  }
  getEntries() {
    let ret = [];
    for (const [type, list] of this._entries) {
      ret = ret.concat(list);
    }
    return ret;
  }
  getEntriesByName(name, type) {
    let ret = [];
    for (const [entryType, list] of this._entries) {
      if (type && type != entryType)
        continue;
      list.map((e) => {
        if (e.name == name) {
          ret.push(e);
        }
      });
    }
    return ret;
  }
  getEntriesByType(type) {
    return this._entries.get(type);
  }
  mark(markName) {
    const mark = new PerformanceMark(markName, this.now(), MARK_TYPE);
    let marks = this._entries.get(MARK_TYPE);
    if (!marks) {
      marks = [mark];
      this._entries.set(MARK_TYPE, marks);
    } else {
      marks.push(mark);
    }
    return mark;
  }
  measure(measureName, startMark, endMark) {
    let starts = this.getEntriesByName(startMark, MARK_TYPE);
    if (starts.length == 0)
      throw new Error(`The mark '${startMark}' does not exist.`);
    let ends = this.getEntriesByName(endMark, MARK_TYPE);
    if (ends.length == 0)
      throw new Error(`The mark '${endMark}' does not exist.`);
    const start = starts[starts.length - 1];
    const end = ends[ends.length - 1];
    const measure = new PerformanceMeasure(measureName, start.startTime, MEASURE_TYPE, end.startTime - start.startTime);
    let measures = this._entries.get(MEASURE_TYPE);
    if (!measures) {
      measures = [measure];
      this._entries.set(MEASURE_TYPE, measures);
    } else {
      measures.push(measure);
    }
    return measure;
  }
  clearMarks(markName) {
    let marks = this._entries.get(MARK_TYPE);
    if (marks) {
      marks = marks.filter((m) => m.name === markName);
      this._entries.set(MARK_TYPE, marks);
    }
  }
  clearMeasures(measureName) {
    let measures = this._entries.get(MARK_TYPE);
    if (measures) {
      measures = measures.filter((m) => m.name === measureName);
      this._entries.set(MEASURE_TYPE, measures);
    }
  }
  toJSON() {
    return {
      timeOrigin: this.timeOrigin
    };
  }
}
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  exports: {
    Performance,
    PerformanceEntry,
    PerformanceMark,
    PerformanceMeasure,
    performance: new Performance()
  }
});


/***/ }),

/***/ "./src/addons/webapi/storage.ts":
/*!**************************************!*\
  !*** ./src/addons/webapi/storage.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Storage": () => (/* binding */ Storage),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Storage {
  constructor() {
    this._items = [];
  }
  get length() {
    return this._items.length;
  }
  clear() {
    this._items = [];
    this.flush();
  }
  getItem(key) {
    for (const item of this._items) {
      if (item.key === key)
        return item.value;
    }
    return null;
  }
  key(index) {
    for (let i = 0; i < this._items.length; i++) {
      if (i === index)
        return this._items[i].key;
    }
    return null;
  }
  removeItem(key) {
    let idx = -1;
    for (let i = 0; i < this._items.length; i++) {
      if (this._items[i].key === key) {
        idx = i;
        break;
      }
    }
    if (idx != -1) {
      this._items.splice(idx, 1);
      this.flush();
    }
  }
  setItem(key, value) {
    let idx = -1;
    for (let i = 0; i < this._items.length; i++) {
      if (this._items[i].key === key) {
        idx = i;
        break;
      }
    }
    if (idx != -1) {
      if (this._items[idx].value != value) {
        this._items[idx].value = value;
        this.flush();
      }
    } else {
      this._items.push({ key, value });
      this.flush();
    }
  }
  flush() {
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  exports: {
    Storage,
    sessionStorage: new Storage()
  }
});


/***/ }),

/***/ "./src/addons/webapi/storage.unity.ts":
/*!********************************************!*\
  !*** ./src/addons/webapi/storage.unity.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! csharp */ "csharp");
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(csharp__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./storage */ "./src/addons/webapi/storage.ts");


class LocalStorage extends _storage__WEBPACK_IMPORTED_MODULE_1__.Storage {
  constructor(file = `${csharp__WEBPACK_IMPORTED_MODULE_0__.UnityEngine.Application.persistentDataPath}/webapi/localStorage.json`) {
    super();
    this.$file = file;
    this.$directory = csharp__WEBPACK_IMPORTED_MODULE_0__.System.IO.Path.GetDirectoryName(this.$file);
    if (csharp__WEBPACK_IMPORTED_MODULE_0__.System.IO.File.Exists(file)) {
      try {
        const stream = new csharp__WEBPACK_IMPORTED_MODULE_0__.System.IO.StreamReader(file);
        const text = stream.ReadToEnd();
        stream.Close();
        stream.Dispose();
        this._items = JSON.parse(text);
      } catch (error) {
        throw new Error("Cannot open storage file " + file);
      }
    }
  }
  flush() {
    if (!csharp__WEBPACK_IMPORTED_MODULE_0__.System.IO.File.Exists(this.$directory)) {
      csharp__WEBPACK_IMPORTED_MODULE_0__.System.IO.Directory.CreateDirectory(this.$directory);
    }
    const stream = new csharp__WEBPACK_IMPORTED_MODULE_0__.System.IO.StreamWriter(this.$file);
    if (stream) {
      let text = JSON.stringify(this._items, void 0, "	");
      stream.Write(text);
      stream.Flush();
      stream.Dispose();
    } else {
      throw new Error("Cannot open storage file " + this.$file);
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  exports: {
    Storage: _storage__WEBPACK_IMPORTED_MODULE_1__.Storage,
    sessionStorage: new _storage__WEBPACK_IMPORTED_MODULE_1__.Storage(),
    localStorage: new LocalStorage()
  }
});


/***/ }),

/***/ "./src/addons/webapi/timer.ts":
/*!************************************!*\
  !*** ./src/addons/webapi/timer.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let global_timer_id = 0;
const pending_timers = /* @__PURE__ */ new Map();
const processing_timers = /* @__PURE__ */ new Map();
const removing_timers = /* @__PURE__ */ new Set();
function timer_loop() {
  const now = WebAPI.getHighResTimeStamp();
  for (const [id, timer] of pending_timers) {
    processing_timers.set(id, timer);
  }
  pending_timers.clear();
  for (const id of removing_timers) {
    processing_timers.delete(id);
  }
  removing_timers.clear();
  for (const [id, timer] of processing_timers) {
    if (timer.next_time <= now) {
      try {
        if (timer.handler)
          timer.handler.apply(null, timer.args);
      } catch (error) {
        console.error(`Error in timer handler: ${error.message}
${error.stack}`);
      }
      if (timer.oneshot) {
        removing_timers.add(id);
      } else {
        timer.next_time = now + timer.timeout;
      }
    }
  }
  timer_loop_id = requestAnimationFrame(timer_loop);
}
function make_timer(handler, timeout, ...args) {
  return {
    handler,
    timeout,
    next_time: WebAPI.getHighResTimeStamp() + (timeout || 0),
    args
  };
}
function pend_timer(timer) {
  pending_timers.set(++global_timer_id, timer);
  return global_timer_id;
}
function setTimeout(handler, timeout, ...args) {
  const timer = make_timer(handler, timeout, ...args);
  timer.oneshot = true;
  return pend_timer(timer);
}
function clearTimeout(handle) {
  removing_timers.add(handle);
}
function setInterval(handler, timeout, ...args) {
  return pend_timer(make_timer(handler, timeout, ...args));
}
function clearInterval(handle) {
  removing_timers.add(handle);
}
let timer_loop_id = 0;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  initialize() {
    timer_loop_id = requestAnimationFrame(timer_loop);
  },
  uninitialize() {
    cancelAnimationFrame(timer_loop_id);
  },
  exports: {
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
  }
});


/***/ }),

/***/ "./src/addons/webapi/xhr/thirdpart/mimetype/mime-type.js":
/*!***************************************************************!*\
  !*** ./src/addons/webapi/xhr/thirdpart/mimetype/mime-type.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MIMEType)
/* harmony export */ });
/* harmony import */ var _parser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parser.js */ "./src/addons/webapi/xhr/thirdpart/mimetype/parser.js");
/* harmony import */ var _serializer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./serializer.js */ "./src/addons/webapi/xhr/thirdpart/mimetype/serializer.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./src/addons/webapi/xhr/thirdpart/mimetype/utils.js");



class MIMEType {
  constructor(string) {
    string = String(string);
    const result = (0,_parser_js__WEBPACK_IMPORTED_MODULE_0__["default"])(string);
    if (result === null) {
      throw new Error(`Could not parse MIME type string "${string}"`);
    }
    this._type = result.type;
    this._subtype = result.subtype;
    this._parameters = new MIMETypeParameters(result.parameters);
  }
  static parse(string) {
    try {
      return new this(string);
    } catch (e) {
      return null;
    }
  }
  get essence() {
    return `${this.type}/${this.subtype}`;
  }
  get type() {
    return this._type;
  }
  set type(value) {
    value = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.asciiLowercase)(String(value));
    if (value.length === 0) {
      throw new Error("Invalid type: must be a non-empty string");
    }
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.solelyContainsHTTPTokenCodePoints)(value)) {
      throw new Error(`Invalid type ${value}: must contain only HTTP token code points`);
    }
    this._type = value;
  }
  get subtype() {
    return this._subtype;
  }
  set subtype(value) {
    value = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.asciiLowercase)(String(value));
    if (value.length === 0) {
      throw new Error("Invalid subtype: must be a non-empty string");
    }
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.solelyContainsHTTPTokenCodePoints)(value)) {
      throw new Error(`Invalid subtype ${value}: must contain only HTTP token code points`);
    }
    this._subtype = value;
  }
  get parameters() {
    return this._parameters;
  }
  toString() {
    return (0,_serializer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this);
  }
  isJavaScript({
    allowParameters = false
  } = {}) {
    switch (this._type) {
      case "text": {
        switch (this._subtype) {
          case "ecmascript":
          case "javascript":
          case "javascript1.0":
          case "javascript1.1":
          case "javascript1.2":
          case "javascript1.3":
          case "javascript1.4":
          case "javascript1.5":
          case "jscript":
          case "livescript":
          case "x-ecmascript":
          case "x-javascript": {
            return allowParameters || this._parameters.size === 0;
          }
          default: {
            return false;
          }
        }
      }
      case "application": {
        switch (this._subtype) {
          case "ecmascript":
          case "javascript":
          case "x-ecmascript":
          case "x-javascript": {
            return allowParameters || this._parameters.size === 0;
          }
          default: {
            return false;
          }
        }
      }
      default: {
        return false;
      }
    }
  }
  isXML() {
    return this._subtype === "xml" && (this._type === "text" || this._type === "application") || this._subtype.endsWith("+xml");
  }
  isHTML() {
    return this._subtype === "html" && this._type === "text";
  }
}
;
class MIMETypeParameters {
  constructor(map) {
    this._map = map;
  }
  get size() {
    return this._map.size;
  }
  get(name) {
    name = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.asciiLowercase)(String(name));
    return this._map.get(name);
  }
  has(name) {
    name = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.asciiLowercase)(String(name));
    return this._map.has(name);
  }
  set(name, value) {
    name = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.asciiLowercase)(String(name));
    value = String(value);
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.solelyContainsHTTPTokenCodePoints)(name)) {
      throw new Error(`Invalid MIME type parameter name "${name}": only HTTP token code points are valid.`);
    }
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.soleyContainsHTTPQuotedStringTokenCodePoints)(value)) {
      throw new Error(`Invalid MIME type parameter value "${value}": only HTTP quoted-string token code points are valid.`);
    }
    return this._map.set(name, value);
  }
  clear() {
    this._map.clear();
  }
  delete(name) {
    name = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.asciiLowercase)(String(name));
    return this._map.delete(name);
  }
  forEach(callbackFn, thisArg) {
    this._map.forEach(callbackFn, thisArg);
  }
  keys() {
    return this._map.keys();
  }
  values() {
    return this._map.values();
  }
  entries() {
    return this._map.entries();
  }
  [Symbol.iterator]() {
    return this._map[Symbol.iterator]();
  }
}


/***/ }),

/***/ "./src/addons/webapi/xhr/thirdpart/mimetype/parser.js":
/*!************************************************************!*\
  !*** ./src/addons/webapi/xhr/thirdpart/mimetype/parser.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/addons/webapi/xhr/thirdpart/mimetype/utils.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((input) => {
  input = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.removeLeadingAndTrailingHTTPWhitespace)(input);
  let position = 0;
  let type = "";
  while (position < input.length && input[position] !== "/") {
    type += input[position];
    ++position;
  }
  if (type.length === 0 || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.solelyContainsHTTPTokenCodePoints)(type)) {
    return null;
  }
  if (position >= input.length) {
    return null;
  }
  ++position;
  let subtype = "";
  while (position < input.length && input[position] !== ";") {
    subtype += input[position];
    ++position;
  }
  subtype = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.removeTrailingHTTPWhitespace)(subtype);
  if (subtype.length === 0 || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.solelyContainsHTTPTokenCodePoints)(subtype)) {
    return null;
  }
  const mimeType = {
    type: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.asciiLowercase)(type),
    subtype: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.asciiLowercase)(subtype),
    parameters: /* @__PURE__ */ new Map()
  };
  while (position < input.length) {
    ++position;
    while ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isHTTPWhitespaceChar)(input[position])) {
      ++position;
    }
    let parameterName = "";
    while (position < input.length && input[position] !== ";" && input[position] !== "=") {
      parameterName += input[position];
      ++position;
    }
    parameterName = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.asciiLowercase)(parameterName);
    if (position < input.length) {
      if (input[position] === ";") {
        continue;
      }
      ++position;
    }
    let parameterValue = null;
    if (input[position] === '"') {
      [parameterValue, position] = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.collectAnHTTPQuotedString)(input, position);
      while (position < input.length && input[position] !== ";") {
        ++position;
      }
    } else {
      parameterValue = "";
      while (position < input.length && input[position] !== ";") {
        parameterValue += input[position];
        ++position;
      }
      parameterValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.removeTrailingHTTPWhitespace)(parameterValue);
      if (parameterValue === "") {
        continue;
      }
    }
    if (parameterName.length > 0 && (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.solelyContainsHTTPTokenCodePoints)(parameterName) && (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.soleyContainsHTTPQuotedStringTokenCodePoints)(parameterValue) && !mimeType.parameters.has(parameterName)) {
      mimeType.parameters.set(parameterName, parameterValue);
    }
  }
  return mimeType;
});


/***/ }),

/***/ "./src/addons/webapi/xhr/thirdpart/mimetype/serializer.js":
/*!****************************************************************!*\
  !*** ./src/addons/webapi/xhr/thirdpart/mimetype/serializer.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/addons/webapi/xhr/thirdpart/mimetype/utils.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((mimeType) => {
  let serialization = `${mimeType.type}/${mimeType.subtype}`;
  if (mimeType.parameters.size === 0) {
    return serialization;
  }
  for (let [name, value] of mimeType.parameters) {
    serialization += ";";
    serialization += name;
    serialization += "=";
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.solelyContainsHTTPTokenCodePoints)(value) || value.length === 0) {
      value = value.replace(/(["\\])/g, "\\$1");
      value = `"${value}"`;
    }
    serialization += value;
  }
  return serialization;
});


/***/ }),

/***/ "./src/addons/webapi/xhr/thirdpart/mimetype/utils.js":
/*!***********************************************************!*\
  !*** ./src/addons/webapi/xhr/thirdpart/mimetype/utils.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "asciiLowercase": () => (/* binding */ asciiLowercase),
/* harmony export */   "collectAnHTTPQuotedString": () => (/* binding */ collectAnHTTPQuotedString),
/* harmony export */   "isHTTPWhitespaceChar": () => (/* binding */ isHTTPWhitespaceChar),
/* harmony export */   "removeLeadingAndTrailingHTTPWhitespace": () => (/* binding */ removeLeadingAndTrailingHTTPWhitespace),
/* harmony export */   "removeTrailingHTTPWhitespace": () => (/* binding */ removeTrailingHTTPWhitespace),
/* harmony export */   "solelyContainsHTTPTokenCodePoints": () => (/* binding */ solelyContainsHTTPTokenCodePoints),
/* harmony export */   "soleyContainsHTTPQuotedStringTokenCodePoints": () => (/* binding */ soleyContainsHTTPQuotedStringTokenCodePoints)
/* harmony export */ });
const removeLeadingAndTrailingHTTPWhitespace = (string) => {
  return string.replace(/^[ \t\n\r]+/, "").replace(/[ \t\n\r]+$/, "");
};
const removeTrailingHTTPWhitespace = (string) => {
  return string.replace(/[ \t\n\r]+$/, "");
};
const isHTTPWhitespaceChar = (char) => {
  return char === " " || char === "	" || char === "\n" || char === "\r";
};
const solelyContainsHTTPTokenCodePoints = (string) => {
  return /^[-!#$%&'*+.^_`|~A-Za-z0-9]*$/.test(string);
};
const soleyContainsHTTPQuotedStringTokenCodePoints = (string) => {
  return /^[\t\u0020-\u007E\u0080-\u00FF]*$/.test(string);
};
const asciiLowercase = (string) => {
  return string.replace(/[A-Z]/g, (l) => l.toLowerCase());
};
const collectAnHTTPQuotedString = (input, position) => {
  let value = "";
  position++;
  while (true) {
    while (position < input.length && input[position] !== '"' && input[position] !== "\\") {
      value += input[position];
      ++position;
    }
    if (position >= input.length) {
      break;
    }
    const quoteOrBackslash = input[position];
    ++position;
    if (quoteOrBackslash === "\\") {
      if (position >= input.length) {
        value += "\\";
        break;
      }
      value += input[position];
      ++position;
    } else {
      break;
    }
  }
  return [value, position];
};


/***/ }),

/***/ "./src/addons/webapi/xhr/thirdpart/url-parser/querystringify.js":
/*!**********************************************************************!*\
  !*** ./src/addons/webapi/xhr/thirdpart/url-parser/querystringify.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parse": () => (/* binding */ parse),
/* harmony export */   "stringify": () => (/* binding */ stringify)
/* harmony export */ });
const has = Object.prototype.hasOwnProperty;
const undef = void 0;
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, " "));
  } catch (e) {
    return null;
  }
}
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}
function querystring(query) {
  let parser = /([^=?#&]+)=?([^&]*)/g, result = {}, part;
  while (part = parser.exec(query)) {
    let key = decode(part[1]), value = decode(part[2]);
    if (key === null || value === null || key in result)
      continue;
    result[key] = value;
  }
  return result;
}
function querystringify(obj, prefix) {
  prefix = prefix || "";
  let pairs = [], value, key;
  if ("string" !== typeof prefix)
    prefix = "?";
  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = "";
      }
      key = encode(key);
      value = encode(value);
      if (key === null || value === null)
        continue;
      pairs.push(key + "=" + value);
    }
  }
  return pairs.length ? prefix + pairs.join("&") : "";
}
const stringify = querystringify;
const parse = querystring;


/***/ }),

/***/ "./src/addons/webapi/xhr/thirdpart/url-parser/url-parser.js":
/*!******************************************************************!*\
  !*** ./src/addons/webapi/xhr/thirdpart/url-parser/url-parser.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var requires_port__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! requires-port */ "./node_modules/requires-port/index.js");
/* harmony import */ var requires_port__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(requires_port__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _querystringify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./querystringify */ "./src/addons/webapi/xhr/thirdpart/url-parser/querystringify.js");


const slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//, protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i, whitespace = "[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]", left = new RegExp("^" + whitespace + "+");
function trimLeft(str) {
  return (str ? str : "").toString().replace(left, "");
}
let rules = [
  ["#", "hash"],
  ["?", "query"],
  function sanitize(address) {
    return address.replace("\\", "/");
  },
  ["/", "pathname"],
  ["@", "auth", 1],
  [NaN, "host", void 0, 1, 1],
  [/:(\d+)$/, "port", void 0, 1],
  [NaN, "hostname", void 0, 1, 1]
];
let ignore = { hash: 1, query: 1 };
function lolcation(loc) {
  let globalVar;
  if (typeof window !== "undefined")
    globalVar = window;
  else if (typeof __webpack_require__.g !== "undefined")
    globalVar = __webpack_require__.g;
  else if (typeof self !== "undefined")
    globalVar = self;
  else
    globalVar = {};
  let location = globalVar.location || {};
  loc = loc || location;
  let finaldestination = {}, type = typeof loc, key;
  if ("blob:" === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ("string" === type) {
    finaldestination = new Url(loc, {});
    for (key in ignore)
      delete finaldestination[key];
  } else if ("object" === type) {
    for (key in loc) {
      if (key in ignore)
        continue;
      finaldestination[key] = loc[key];
    }
    if (finaldestination.slashes === void 0) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }
  return finaldestination;
}
function extractProtocol(address) {
  address = trimLeft(address);
  let match = protocolre.exec(address);
  return {
    protocol: match[1] ? match[1].toLowerCase() : "",
    slashes: !!match[2],
    rest: match[3]
  };
}
function resolve(relative, base) {
  if (relative === "")
    return base;
  let path = (base || "/").split("/").slice(0, -1).concat(relative.split("/")), i = path.length, last = path[i - 1], unshift = false, up = 0;
  while (i--) {
    if (path[i] === ".") {
      path.splice(i, 1);
    } else if (path[i] === "..") {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0)
        unshift = true;
      path.splice(i, 1);
      up--;
    }
  }
  if (unshift)
    path.unshift("");
  if (last === "." || last === "..")
    path.push("");
  return path.join("/");
}
function Url(address, location, parser) {
  address = trimLeft(address);
  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }
  let relative, extracted, parse, instruction, index, key, instructions = rules.slice(), type = typeof location, url = this, i = 0;
  if ("object" !== type && "string" !== type) {
    parser = location;
    location = null;
  }
  if (parser && "function" !== typeof parser)
    parser = _querystringify__WEBPACK_IMPORTED_MODULE_1__.parse;
  location = lolcation(location);
  extracted = extractProtocol(address || "");
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || "";
  address = extracted.rest;
  if (!extracted.slashes)
    instructions[3] = [/(.*)/, "pathname"];
  for (; i < instructions.length; i++) {
    instruction = instructions[i];
    if (typeof instruction === "function") {
      address = instruction(address);
      continue;
    }
    parse = instruction[0];
    key = instruction[1];
    if (parse !== parse) {
      url[key] = address;
    } else if ("string" === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ("number" === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if (index = parse.exec(address)) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }
    url[key] = url[key] || (relative && instruction[3] ? location[key] || "" : "");
    if (instruction[4])
      url[key] = url[key].toLowerCase();
  }
  if (parser)
    url.query = parser(url.query);
  if (relative && location.slashes && url.pathname.charAt(0) !== "/" && (url.pathname !== "" || location.pathname !== "")) {
    url.pathname = resolve(url.pathname, location.pathname);
  }
  if (!requires_port__WEBPACK_IMPORTED_MODULE_0___default()(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = "";
  }
  url.username = url.password = "";
  if (url.auth) {
    instruction = url.auth.split(":");
    url.username = instruction[0] || "";
    url.password = instruction[1] || "";
  }
  url.origin = url.protocol && url.host && url.protocol !== "file:" ? url.protocol + "//" + url.host : "null";
  url.href = url.toString();
}
function set(part, value, fn) {
  let url = this;
  switch (part) {
    case "query":
      if ("string" === typeof value && value.length) {
        value = (fn || _querystringify__WEBPACK_IMPORTED_MODULE_1__.parse)(value);
      }
      url[part] = value;
      break;
    case "port":
      url[part] = value;
      if (!requires_port__WEBPACK_IMPORTED_MODULE_0___default()(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = "";
      } else if (value) {
        url.host = url.hostname + ":" + value;
      }
      break;
    case "hostname":
      url[part] = value;
      if (url.port)
        value += ":" + url.port;
      url.host = value;
      break;
    case "host":
      url[part] = value;
      if (/:\d+$/.test(value)) {
        value = value.split(":");
        url.port = value.pop();
        url.hostname = value.join(":");
      } else {
        url.hostname = value;
        url.port = "";
      }
      break;
    case "protocol":
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;
    case "pathname":
    case "hash":
      if (value) {
        let char = part === "pathname" ? "/" : "#";
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;
    default:
      url[part] = value;
  }
  for (let i = 0; i < rules.length; i++) {
    let ins = rules[i];
    if (ins[4])
      url[ins[1]] = url[ins[1]].toLowerCase();
  }
  url.origin = url.protocol && url.host && url.protocol !== "file:" ? url.protocol + "//" + url.host : "null";
  url.href = url.toString();
  return url;
}
function toString(stringify) {
  if (!stringify || "function" !== typeof stringify)
    stringify = _querystringify__WEBPACK_IMPORTED_MODULE_1__.stringify;
  let query, url = this, protocol = url.protocol;
  if (protocol && protocol.charAt(protocol.length - 1) !== ":")
    protocol += ":";
  let result = protocol + (url.slashes ? "//" : "");
  if (url.username) {
    result += url.username;
    if (url.password)
      result += ":" + url.password;
    result += "@";
  }
  result += url.host + url.pathname;
  query = "object" === typeof url.query ? stringify(url.query) : url.query;
  if (query)
    result += "?" !== query.charAt(0) ? "?" + query : query;
  if (url.hash)
    result += url.hash;
  return result;
}
Url.prototype = { set, toString };
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = _querystringify__WEBPACK_IMPORTED_MODULE_1__;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Url);


/***/ }),

/***/ "./src/addons/webapi/xhr/url.ts":
/*!**************************************!*\
  !*** ./src/addons/webapi/xhr/url.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parse_url": () => (/* binding */ parse_url)
/* harmony export */ });
/* harmony import */ var _thirdpart_url_parser_url_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./thirdpart/url-parser/url-parser */ "./src/addons/webapi/xhr/thirdpart/url-parser/url-parser.js");

function parse_url(url) {
  const u = new _thirdpart_url_parser_url_parser__WEBPACK_IMPORTED_MODULE_0__["default"](url);
  u.url = url;
  return u;
}


/***/ }),

/***/ "./src/addons/webapi/xhr/xhr.common.ts":
/*!*********************************************!*\
  !*** ./src/addons/webapi/xhr/xhr.common.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HttpStatusCode": () => (/* binding */ HttpStatusCode),
/* harmony export */   "XMLHttpRequestBase": () => (/* binding */ XMLHttpRequestBase),
/* harmony export */   "XMLHttpRequestEventTarget": () => (/* binding */ XMLHttpRequestEventTarget),
/* harmony export */   "XMLHttpRequestReadyState": () => (/* binding */ XMLHttpRequestReadyState),
/* harmony export */   "XMLHttpRequestUpload": () => (/* binding */ XMLHttpRequestUpload)
/* harmony export */ });
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../event */ "./src/addons/webapi/event.ts");

var HttpStatusCode = /* @__PURE__ */ ((HttpStatusCode2) => {
  HttpStatusCode2[HttpStatusCode2["Continue"] = 100] = "Continue";
  HttpStatusCode2[HttpStatusCode2["SwitchingProtocols"] = 101] = "SwitchingProtocols";
  HttpStatusCode2[HttpStatusCode2["OK"] = 200] = "OK";
  HttpStatusCode2[HttpStatusCode2["Created"] = 201] = "Created";
  HttpStatusCode2[HttpStatusCode2["Accepted"] = 202] = "Accepted";
  HttpStatusCode2[HttpStatusCode2["NonAuthoritativeInformation"] = 203] = "NonAuthoritativeInformation";
  HttpStatusCode2[HttpStatusCode2["NoContent"] = 204] = "NoContent";
  HttpStatusCode2[HttpStatusCode2["ResetContent"] = 205] = "ResetContent";
  HttpStatusCode2[HttpStatusCode2["PartialContent"] = 206] = "PartialContent";
  HttpStatusCode2[HttpStatusCode2["MultipleChoices"] = 300] = "MultipleChoices";
  HttpStatusCode2[HttpStatusCode2["Ambiguous"] = 300] = "Ambiguous";
  HttpStatusCode2[HttpStatusCode2["MovedPermanently"] = 301] = "MovedPermanently";
  HttpStatusCode2[HttpStatusCode2["Moved"] = 301] = "Moved";
  HttpStatusCode2[HttpStatusCode2["Found"] = 302] = "Found";
  HttpStatusCode2[HttpStatusCode2["Redirect"] = 302] = "Redirect";
  HttpStatusCode2[HttpStatusCode2["SeeOther"] = 303] = "SeeOther";
  HttpStatusCode2[HttpStatusCode2["RedirectMethod"] = 303] = "RedirectMethod";
  HttpStatusCode2[HttpStatusCode2["NotModified"] = 304] = "NotModified";
  HttpStatusCode2[HttpStatusCode2["UseProxy"] = 305] = "UseProxy";
  HttpStatusCode2[HttpStatusCode2["Unused"] = 306] = "Unused";
  HttpStatusCode2[HttpStatusCode2["TemporaryRedirect"] = 307] = "TemporaryRedirect";
  HttpStatusCode2[HttpStatusCode2["RedirectKeepVerb"] = 307] = "RedirectKeepVerb";
  HttpStatusCode2[HttpStatusCode2["BadRequest"] = 400] = "BadRequest";
  HttpStatusCode2[HttpStatusCode2["Unauthorized"] = 401] = "Unauthorized";
  HttpStatusCode2[HttpStatusCode2["PaymentRequired"] = 402] = "PaymentRequired";
  HttpStatusCode2[HttpStatusCode2["Forbidden"] = 403] = "Forbidden";
  HttpStatusCode2[HttpStatusCode2["NotFound"] = 404] = "NotFound";
  HttpStatusCode2[HttpStatusCode2["MethodNotAllowed"] = 405] = "MethodNotAllowed";
  HttpStatusCode2[HttpStatusCode2["NotAcceptable"] = 406] = "NotAcceptable";
  HttpStatusCode2[HttpStatusCode2["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
  HttpStatusCode2[HttpStatusCode2["RequestTimeout"] = 408] = "RequestTimeout";
  HttpStatusCode2[HttpStatusCode2["Conflict"] = 409] = "Conflict";
  HttpStatusCode2[HttpStatusCode2["Gone"] = 410] = "Gone";
  HttpStatusCode2[HttpStatusCode2["LengthRequired"] = 411] = "LengthRequired";
  HttpStatusCode2[HttpStatusCode2["PreconditionFailed"] = 412] = "PreconditionFailed";
  HttpStatusCode2[HttpStatusCode2["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
  HttpStatusCode2[HttpStatusCode2["RequestUriTooLong"] = 414] = "RequestUriTooLong";
  HttpStatusCode2[HttpStatusCode2["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
  HttpStatusCode2[HttpStatusCode2["RequestedRangeNotSatisfiable"] = 416] = "RequestedRangeNotSatisfiable";
  HttpStatusCode2[HttpStatusCode2["ExpectationFailed"] = 417] = "ExpectationFailed";
  HttpStatusCode2[HttpStatusCode2["UpgradeRequired"] = 426] = "UpgradeRequired";
  HttpStatusCode2[HttpStatusCode2["InternalServerError"] = 500] = "InternalServerError";
  HttpStatusCode2[HttpStatusCode2["NotImplemented"] = 501] = "NotImplemented";
  HttpStatusCode2[HttpStatusCode2["BadGateway"] = 502] = "BadGateway";
  HttpStatusCode2[HttpStatusCode2["ServiceUnavailable"] = 503] = "ServiceUnavailable";
  HttpStatusCode2[HttpStatusCode2["GatewayTimeout"] = 504] = "GatewayTimeout";
  HttpStatusCode2[HttpStatusCode2["HttpVersionNotSupported"] = 505] = "HttpVersionNotSupported";
  return HttpStatusCode2;
})(HttpStatusCode || {});
class XMLHttpRequestEventTarget extends _event__WEBPACK_IMPORTED_MODULE_0__.EventTarget {
  addEventListener(type, listener, options) {
    super.addEventListener(type, listener, options);
  }
  removeEventListener(type, listener, options) {
    super.addEventListener(type, listener, options);
  }
}
class XMLHttpRequestUpload extends XMLHttpRequestEventTarget {
}
var XMLHttpRequestReadyState = /* @__PURE__ */ ((XMLHttpRequestReadyState2) => {
  XMLHttpRequestReadyState2[XMLHttpRequestReadyState2["UNSENT"] = 0] = "UNSENT";
  XMLHttpRequestReadyState2[XMLHttpRequestReadyState2["OPENED"] = 1] = "OPENED";
  XMLHttpRequestReadyState2[XMLHttpRequestReadyState2["HEADERS_RECEIVED"] = 2] = "HEADERS_RECEIVED";
  XMLHttpRequestReadyState2[XMLHttpRequestReadyState2["LOADING"] = 3] = "LOADING";
  XMLHttpRequestReadyState2[XMLHttpRequestReadyState2["DONE"] = 4] = "DONE";
  return XMLHttpRequestReadyState2;
})(XMLHttpRequestReadyState || {});
class XMLHttpRequestBase extends XMLHttpRequestEventTarget {
  constructor() {
    super(...arguments);
    this._request_headers = {};
    this._poll_task_id = -1;
  }
  get url() {
    return this._url;
  }
  get readyState() {
    return this._readyState;
  }
  set readyState(value) {
    if (value != this._readyState) {
      this._readyState = value;
      if (this.onreadystatechange) {
        let event = new _event__WEBPACK_IMPORTED_MODULE_0__.Event("readystatechange");
        this.onreadystatechange.call(this, event);
        this.dispatchEvent(event);
      }
    }
  }
  get response() {
    return this._response;
  }
  get responseText() {
    return null;
  }
  get responseURL() {
    return null;
  }
  get responseXML() {
    return null;
  }
  get status() {
    return 0;
  }
  get upload() {
    return this._upload;
  }
  abort() {
  }
  getAllResponseHeaders() {
    return "";
  }
  getResponseHeader(name) {
    return null;
  }
  open(method, url, async, username, password) {
  }
  overrideMimeType(mime) {
    this._overrided_mime = mime;
  }
  send(body) {
  }
  setRequestHeader(name, value) {
    this._request_headers[name.toLowerCase()] = value;
  }
  addEventListener(type, listener, options) {
    super.addEventListener(type, listener, options);
  }
  removeEventListener(type, listener, options) {
    super.removeEventListener(type, listener, options);
  }
  $start_poll() {
    this.$stop_poll();
    const tick = this.$tick.bind(this);
    const tickLoop = () => {
      this._poll_task_id = requestAnimationFrame(tickLoop);
      tick();
    };
    this._poll_task_id = requestAnimationFrame(tickLoop);
  }
  $stop_poll() {
    if (this._poll_task_id != -1) {
      cancelAnimationFrame(this._poll_task_id);
      this._poll_task_id = -1;
    }
  }
  $get_progress() {
    return {};
  }
  $dispatch_event(type) {
    let event = void 0;
    if (type === "progress") {
      let evt = new _event__WEBPACK_IMPORTED_MODULE_0__.ProgressEvent("progress", this.$get_progress());
      event = evt;
    } else {
      event = new _event__WEBPACK_IMPORTED_MODULE_0__.Event(type);
    }
    switch (type) {
      case "load":
        if (this.onload)
          this.onload.call(this, event);
        break;
      case "loadend":
        if (this.onloadend)
          this.onloadend.call(this, event);
        break;
      case "loadstart":
        if (this.onloadstart)
          this.onloadstart.call(this, event);
        break;
      case "progress":
        if (this.onprogress)
          this.onprogress.call(this, event);
        break;
      case "timeout":
        if (this.ontimeout)
          this.ontimeout.call(this, event);
        break;
      case "abort":
        if (this.onabort)
          this.onabort.call(this, event);
        break;
      case "error":
        if (this.onerror)
          this.onerror.call(this, event);
        break;
      default:
        break;
    }
    this.dispatchEvent(event);
  }
  $tick() {
  }
}


/***/ }),

/***/ "./src/addons/webapi/xhr/xhr.unity.ts":
/*!********************************************!*\
  !*** ./src/addons/webapi/xhr/xhr.unity.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./url */ "./src/addons/webapi/xhr/url.ts");
/* harmony import */ var _thirdpart_mimetype_mime_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./thirdpart/mimetype/mime-type */ "./src/addons/webapi/xhr/thirdpart/mimetype/mime-type.js");
/* harmony import */ var _xhr_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xhr.common */ "./src/addons/webapi/xhr/xhr.common.ts");
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! csharp */ "csharp");
/* harmony import */ var csharp__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(csharp__WEBPACK_IMPORTED_MODULE_3__);




class UnityXMLHttpRequest extends _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestBase {
  constructor() {
    super();
  }
  get url() {
    return this._url;
  }
  get status() {
    return this._status;
  }
  get responseURL() {
    if (this.url)
      return this.url.url;
    return null;
  }
  get responseXML() {
    return this.responseText;
  }
  get responseText() {
    if (this._request && this._request.downloadHandler) {
      return this._request.downloadHandler.text;
    }
    return void 0;
  }
  getAllResponseHeaders() {
    let text = "";
    if (this._internal_respons_headers) {
      let enumerator = this._internal_respons_headers.GetEnumerator();
      while (enumerator.MoveNext()) {
        text += `${enumerator.Current.Key}: ${enumerator.Current.Value}\r
`;
      }
    }
    return text;
  }
  getResponseHeader(name) {
    if (this._internal_respons_headers) {
      if (this._internal_respons_headers.ContainsKey(name)) {
        return this._internal_respons_headers.get_Item(name);
      }
    }
    return "";
  }
  open(method, url, async, username, password) {
    this._url = (0,_url__WEBPACK_IMPORTED_MODULE_0__.parse_url)(url);
    if (!this.url.port) {
      this._url.port = this.url.protocal === "https" ? 443 : 80;
    }
    this._method = method;
    this._readyState = _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestReadyState.UNSENT;
    this._connect_start_time = Date.now();
  }
  send(body) {
    if (typeof body === "object") {
      this.setRequestHeader(
        "Content-Type",
        "application/json; charset=utf-8"
      );
      body = JSON.stringify(body);
    } else if (body === "string") {
      if (!("Content-Type" in this._request_headers)) {
        this.setRequestHeader("Content-Type", "text/plain");
      }
    }
    this._request_body = body;
    switch (this._method) {
      case "PUT":
        this._request = csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.Put(
          this._url.url,
          this._request_body
        );
        break;
      case "POST":
        this._request = csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.Put(
          this._url.url,
          this._request_body
        );
        this._request.method = this._method;
        break;
      case "GET":
        this._request = csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.Get(
          this._url.url
        );
        break;
      case "DELETE":
        this._request = csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.Delete(
          this._url.url
        );
        break;
      default:
        this._request = new csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest(
          this._url.url,
          this._method
        );
        break;
    }
    if (csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.certificateHandler) {
      this._request.disposeCertificateHandlerOnDispose = false;
      this._request.certificateHandler = csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.certificateHandler;
    }
    for (let key of Object.getOwnPropertyNames(this._request_headers)) {
      const value = this._request_headers[key];
      this._request.SetRequestHeader(key, value);
    }
    this._internal_request = this._request.SendWebRequest();
    if (typeof this.timeout === "number") {
      this._timeout_until = Date.now() + this.timeout;
    }
    this.$dispatch_event("loadstart");
    this.$start_poll();
  }
  abort() {
    if (this._request) {
      this._request.Abort();
      this.$dispatch_event("abort");
      this.$stop_poll();
    }
  }
  $get_progress() {
    return {
      lengthComputable: this._progress !== void 0,
      loaded: this._progress,
      total: 1
    };
  }
  $tick() {
    if (this._request) {
      this._status = Number(this._request.responseCode);
      if (this._status) {
        this.readyState = _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestReadyState.OPENED;
      }
      const now = Date.now();
      if (this._timeout_until && now > this._timeout_until) {
        this._request.Abort();
        this.$dispatch_event("timeout");
        this.$finished_load();
        this._status = _xhr_common__WEBPACK_IMPORTED_MODULE_2__.HttpStatusCode.RequestTimeout;
        return;
      }
      this._status = Number(this._request.responseCode) || _xhr_common__WEBPACK_IMPORTED_MODULE_2__.HttpStatusCode.Continue;
      if (this.readyState === _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestReadyState.OPENED) {
        this._internal_respons_headers = this._request.GetResponseHeaders();
        if (this._internal_respons_headers && this._internal_respons_headers.Count) {
          this.readyState = _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestReadyState.HEADERS_RECEIVED;
        }
      }
      if (this.readyState === _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestReadyState.HEADERS_RECEIVED && this._status == _xhr_common__WEBPACK_IMPORTED_MODULE_2__.HttpStatusCode.OK) {
        this.readyState = _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestReadyState.LOADING;
      }
      if (this._request.result == csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.Result.ConnectionError || this._request.result == csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.Result.ProtocolError || this._request.isDone) {
        this.$finished_load();
      } else if (this._internal_request) {
        if (this._progress !== this._internal_request.progress) {
          this._progress = this._internal_request.progress;
          this.$dispatch_event("progress");
        }
      }
    }
  }
  $finished_load() {
    this.readyState = _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestReadyState.DONE;
    if (this._request.isDone || this._request.result == csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.Result.ProtocolError) {
      this._internal_respons_headers = this._request.GetResponseHeaders();
      this.$process_response();
    }
    if (this._request.result == csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.Result.ConnectionError || this._request.result == csharp__WEBPACK_IMPORTED_MODULE_3__.UnityEngine.Networking.UnityWebRequest.Result.ProtocolError) {
      this.$dispatch_event("error");
    } else {
      this._progress = 1;
      this.$dispatch_event("progress");
      this.$dispatch_event("load");
    }
    this.$dispatch_event("loadend");
    this.$stop_poll();
  }
  $process_response() {
    if (this.responseType === void 0) {
      const mime = new _thirdpart_mimetype_mime_type__WEBPACK_IMPORTED_MODULE_1__["default"](
        this._overrided_mime || this.getResponseHeader("Content-Type") || "text/plain"
      );
      if (mime.type === "application" && mime.subtype === "json") {
        this.responseType = "json";
      } else if (mime.type === "text") {
        this.responseType = "text";
      } else if (mime.isXML() || mime.isHTML() || mime.isJavaScript()) {
        this.responseType = "text";
      } else {
        this.responseType = "arraybuffer";
      }
    }
    switch (this.responseType) {
      case "":
      case "document":
      case "text":
        this._response = this.responseText;
        break;
      case "json":
        const text = this.responseText;
        if (text) {
          this._response = JSON.parse(text);
        } else {
          this._response = null;
        }
        break;
      default:
        this._response = this._request.downloadHandler ? this._request.downloadHandler.data : null;
        break;
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  exports: {
    XMLHttpRequestEventTarget: _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestEventTarget,
    XMLHttpRequestReadyState: _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestReadyState,
    XMLHttpRequestUpload: _xhr_common__WEBPACK_IMPORTED_MODULE_2__.XMLHttpRequestUpload,
    XMLHttpRequest: UnityXMLHttpRequest
  }
});


/***/ }),

/***/ "./node_modules/requires-port/index.js":
/*!*********************************************!*\
  !*** ./node_modules/requires-port/index.js ***!
  \*********************************************/
/***/ ((module) => {



/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};


/***/ }),

/***/ "csharp":
/*!*************************!*\
  !*** external "csharp" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("csharp");

/***/ }),

/***/ "puerts":
/*!*************************!*\
  !*** external "puerts" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("puerts");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************************!*\
  !*** ./src/addons/webapi/index.unity.ts ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _console_unity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./console.unity */ "./src/addons/webapi/console.unity.ts");
/* harmony import */ var _animationframe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./animationframe */ "./src/addons/webapi/animationframe.ts");
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./event */ "./src/addons/webapi/event.ts");
/* harmony import */ var _timer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./timer */ "./src/addons/webapi/timer.ts");
/* harmony import */ var _performance__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./performance */ "./src/addons/webapi/performance.ts");
/* harmony import */ var _misc_unity__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./misc.unity */ "./src/addons/webapi/misc.unity.ts");
/* harmony import */ var _storage_unity__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./storage.unity */ "./src/addons/webapi/storage.unity.ts");
/* harmony import */ var _xhr_xhr_unity__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./xhr/xhr.unity */ "./src/addons/webapi/xhr/xhr.unity.ts");
/* harmony import */ var _index_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./index.common */ "./src/addons/webapi/index.common.ts");









(0,_index_common__WEBPACK_IMPORTED_MODULE_8__.initialize)([
  _animationframe__WEBPACK_IMPORTED_MODULE_1__["default"],
  _event__WEBPACK_IMPORTED_MODULE_2__["default"],
  _timer__WEBPACK_IMPORTED_MODULE_3__["default"],
  _performance__WEBPACK_IMPORTED_MODULE_4__["default"],
  _misc_unity__WEBPACK_IMPORTED_MODULE_5__["default"],
  _storage_unity__WEBPACK_IMPORTED_MODULE_6__["default"],
  _xhr_xhr_unity__WEBPACK_IMPORTED_MODULE_7__["default"]
]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (window);

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2FkZG9ucy93ZWJhcGkvYW5pbWF0aW9uZnJhbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkZG9ucy93ZWJhcGkvY29uc29sZS51bml0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRkb25zL3dlYmFwaS9ldmVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRkb25zL3dlYmFwaS9pbmRleC5jb21tb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkZG9ucy93ZWJhcGkvbWlzYy51bml0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRkb25zL3dlYmFwaS9wZXJmb3JtYW5jZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRkb25zL3dlYmFwaS9zdG9yYWdlLnRzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL3N0b3JhZ2UudW5pdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkZG9ucy93ZWJhcGkvdGltZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkZG9ucy93ZWJhcGkveGhyL3RoaXJkcGFydC9taW1ldHlwZS9taW1lLXR5cGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkZG9ucy93ZWJhcGkveGhyL3RoaXJkcGFydC9taW1ldHlwZS9wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkZG9ucy93ZWJhcGkveGhyL3RoaXJkcGFydC9taW1ldHlwZS9zZXJpYWxpemVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL3hoci90aGlyZHBhcnQvbWltZXR5cGUvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkZG9ucy93ZWJhcGkveGhyL3RoaXJkcGFydC91cmwtcGFyc2VyL3F1ZXJ5c3RyaW5naWZ5LmpzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL3hoci90aGlyZHBhcnQvdXJsLXBhcnNlci91cmwtcGFyc2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9hZGRvbnMvd2ViYXBpL3hoci91cmwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkZG9ucy93ZWJhcGkveGhyL3hoci5jb21tb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkZG9ucy93ZWJhcGkveGhyL3hoci51bml0eS50cyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVxdWlyZXMtcG9ydC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgY29tbW9uanMgXCJjc2hhcnBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgY29tbW9uanMgXCJwdWVydHNcIiIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FkZG9ucy93ZWJhcGkvaW5kZXgudW5pdHkudHMiXSwibmFtZXMiOlsiUGhhc2UiLCJIdHRwU3RhdHVzQ29kZSIsIlhNTEh0dHBSZXF1ZXN0UmVhZHlTdGF0ZSJdLCJzb3VyY2VSb290IjoiIn0=