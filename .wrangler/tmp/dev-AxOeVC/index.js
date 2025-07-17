var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn2, res) => function __init() {
  return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn2 = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn2, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      static {
        __name(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
      static {
        __name(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance = class {
      static {
        __name(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e3) => e3.name !== markName) : this._entries.filter((e3) => e3.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e3) => e3.name !== measureName) : this._entries.filter((e3) => e3.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e3) => e3.entryType !== "resource" || e3.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e3) => e3.name === name && (!type || e3.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e3) => e3.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver = class {
      static {
        __name(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn2) {
        return fn2;
      }
      runInAsyncScope(fn2, thisArg, ...args) {
        return fn2.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// node_modules/.pnpm/@cloudflare+unenv-preset@2.3.3_unenv@2.0.0-rc.17_workerd@1.20250709.0/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "node_modules/.pnpm/@cloudflare+unenv-preset@2.3.3_unenv@2.0.0-rc.17_workerd@1.20250709.0/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// node_modules/.pnpm/@cloudflare+unenv-preset@2.3.3_unenv@2.0.0-rc.17_workerd@1.20250709.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "node_modules/.pnpm/@cloudflare+unenv-preset@2.3.3_unenv@2.0.0-rc.17_workerd@1.20250709.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// node_modules/.pnpm/wrangler@4.24.3_@cloudflare+workers-types@4.20250715.0/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "node_modules/.pnpm/wrangler@4.24.3_@cloudflare+workers-types@4.20250715.0/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream;
var init_write_stream = __esm({
  "node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class {
      static {
        __name(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x3, y3, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});

// node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream;
var init_read_stream = __esm({
  "node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class {
      static {
        __name(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});

// node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION;
var init_node_version = __esm({
  "node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION = "22.14.0";
  }
});

// node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "node_modules/.pnpm/unenv@2.0.0-rc.17/node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process = class _Process extends EventEmitter {
      static {
        __name(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION}`;
      }
      get versions() {
        return { node: NODE_VERSION };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      ref() {
      }
      unref() {
      }
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
      mainModule = void 0;
      domain = void 0;
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});

// node_modules/.pnpm/@cloudflare+unenv-preset@2.3.3_unenv@2.0.0-rc.17_workerd@1.20250709.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, exit, platform, nextTick, unenvProcess, abort, addListener, allowedNodeEnvironmentFlags, hasUncaughtExceptionCaptureCallback, setUncaughtExceptionCaptureCallback, loadEnvFile, sourceMapsEnabled, arch, argv, argv0, chdir, config, connected, constrainedMemory, availableMemory, cpuUsage, cwd, debugPort, dlopen, disconnect, emit, emitWarning, env, eventNames, execArgv, execPath, finalization, features, getActiveResourcesInfo, getMaxListeners, hrtime3, kill, listeners, listenerCount, memoryUsage, on, off, once, pid, ppid, prependListener, prependOnceListener, rawListeners, release, removeAllListeners, removeListener, report, resourceUsage, setMaxListeners, setSourceMapsEnabled, stderr, stdin, stdout, title, throwDeprecation, traceDeprecation, umask, uptime, version, versions, domain, initgroups, moduleLoadList, reallyExit, openStdin, assert2, binding, send, exitCode, channel, getegid, geteuid, getgid, getgroups, getuid, setegid, seteuid, setgid, setgroups, setuid, permission, mainModule, _events, _eventsCount, _exiting, _maxListeners, _debugEnd, _debugProcess, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, _disconnect, _handleQueue, _pendingMessage, _channel, _send, _linkedBinding, _process, process_default;
var init_process2 = __esm({
  "node_modules/.pnpm/@cloudflare+unenv-preset@2.3.3_unenv@2.0.0-rc.17_workerd@1.20250709.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    ({ exit, platform, nextTick } = getBuiltinModule(
      "node:process"
    ));
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      nextTick
    });
    ({
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      finalization,
      features,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      on,
      off,
      once,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// node_modules/.pnpm/wrangler@4.24.3_@cloudflare+workers-types@4.20250715.0/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "node_modules/.pnpm/wrangler@4.24.3_@cloudflare+workers-types@4.20250715.0/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});

// node_modules/.pnpm/wrangler@4.24.3_@cloudflare+workers-types@4.20250715.0/node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/.pnpm/wrangler@4.24.3_@cloudflare+workers-types@4.20250715.0/node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/.pnpm/@cloudflare+unenv-preset@2.3.3_unenv@2.0.0-rc.17_workerd@1.20250709.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/async_hooks.mjs
var workerdAsyncHooks, AsyncLocalStorage2, AsyncResource;
var init_async_hooks = __esm({
  "node_modules/.pnpm/@cloudflare+unenv-preset@2.3.3_unenv@2.0.0-rc.17_workerd@1.20250709.0/node_modules/@cloudflare/unenv-preset/dist/runtime/node/async_hooks.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    workerdAsyncHooks = process.getBuiltinModule("node:async_hooks");
    ({ AsyncLocalStorage: AsyncLocalStorage2, AsyncResource } = workerdAsyncHooks);
  }
});

// .output/server/chunks/_/fs.mjs
var fs_exports = {};
__export(fs_exports, {
  F_OK: () => u,
  R_OK: () => h,
  W_OK: () => W,
  X_OK: () => X,
  constants: () => A,
  promises: () => w
});
import "cloudflare:workers";
import "node:events";
import "node:buffer";
import "node:timers";
var e, s, O, I, t, r, S, F, i, o, R, f, n, E, N, l, m, a, C, d, L, T, c, p, U, D, V, K, P, Y, k, u, h, W, X, A, w;
var init_fs = __esm({
  ".output/server/chunks/_/fs.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_nitro();
    e = notImplemented2("fs.access");
    s = notImplemented2("fs.copyFile");
    O = notImplemented2("fs.cp");
    I = notImplemented2("fs.open");
    t = notImplemented2("fs.opendir");
    r = notImplemented2("fs.rename");
    S = notImplemented2("fs.truncate");
    F = notImplemented2("fs.rm");
    i = notImplemented2("fs.rmdir");
    o = notImplemented2("fs.mkdir");
    R = notImplemented2("fs.readdir");
    f = notImplemented2("fs.readlink");
    n = notImplemented2("fs.symlink");
    E = notImplemented2("fs.lstat");
    N = notImplemented2("fs.stat");
    l = notImplemented2("fs.link");
    m = notImplemented2("fs.unlink");
    a = notImplemented2("fs.chmod");
    C = notImplemented2("fs.lchmod");
    d = notImplemented2("fs.lchown");
    L = notImplemented2("fs.chown");
    T = notImplemented2("fs.utimes");
    c = notImplemented2("fs.lutimes");
    p = notImplemented2("fs.realpath");
    U = notImplemented2("fs.mkdtemp");
    D = notImplemented2("fs.writeFile");
    V = notImplemented2("fs.appendFile");
    K = notImplemented2("fs.readFile");
    P = notImplemented2("fs.watch");
    Y = notImplemented2("fs.statfs");
    k = notImplemented2("fs.glob");
    u = 0;
    h = 4;
    W = 2;
    X = 1;
    A = Object.freeze(Object.defineProperty({ __proto__: null, COPYFILE_EXCL: 1, COPYFILE_FICLONE: 2, COPYFILE_FICLONE_FORCE: 4, EXTENSIONLESS_FORMAT_JAVASCRIPT: 0, EXTENSIONLESS_FORMAT_WASM: 1, F_OK: 0, O_APPEND: 1024, O_CREAT: 64, O_DIRECT: 16384, O_DIRECTORY: 65536, O_DSYNC: 4096, O_EXCL: 128, O_NOATIME: 262144, O_NOCTTY: 256, O_NOFOLLOW: 131072, O_NONBLOCK: 2048, O_RDONLY: 0, O_RDWR: 2, O_SYNC: 1052672, O_TRUNC: 512, O_WRONLY: 1, R_OK: 4, S_IFBLK: 24576, S_IFCHR: 8192, S_IFDIR: 16384, S_IFIFO: 4096, S_IFLNK: 40960, S_IFMT: 61440, S_IFREG: 32768, S_IFSOCK: 49152, S_IRGRP: 32, S_IROTH: 4, S_IRUSR: 256, S_IRWXG: 56, S_IRWXO: 7, S_IRWXU: 448, S_IWGRP: 16, S_IWOTH: 2, S_IWUSR: 128, S_IXGRP: 8, S_IXOTH: 1, S_IXUSR: 64, UV_DIRENT_BLOCK: 7, UV_DIRENT_CHAR: 6, UV_DIRENT_DIR: 2, UV_DIRENT_FIFO: 4, UV_DIRENT_FILE: 1, UV_DIRENT_LINK: 3, UV_DIRENT_SOCKET: 5, UV_DIRENT_UNKNOWN: 0, UV_FS_COPYFILE_EXCL: 1, UV_FS_COPYFILE_FICLONE: 2, UV_FS_COPYFILE_FICLONE_FORCE: 4, UV_FS_O_FILEMAP: 0, UV_FS_SYMLINK_DIR: 1, UV_FS_SYMLINK_JUNCTION: 2, W_OK: 2, X_OK: 1 }, Symbol.toStringTag, { value: "Module" }));
    w = { constants: A, access: e, appendFile: V, chmod: a, chown: L, copyFile: s, cp: O, glob: k, lchmod: C, lchown: d, link: l, lstat: E, lutimes: c, mkdir: o, mkdtemp: U, open: I, opendir: t, readFile: K, readdir: R, readlink: f, realpath: p, rename: r, rm: F, rmdir: i, stat: N, statfs: Y, symlink: n, truncate: S, unlink: m, utimes: T, watch: P, writeFile: D };
  }
});

// .output/server/chunks/_/_tanstack-start-manifest_v-D0-i9UH_.mjs
var tanstack_start_manifest_v_D0_i9UH_exports = {};
__export(tanstack_start_manifest_v_D0_i9UH_exports, {
  tsrStartManifest: () => tsrStartManifest
});
var tsrStartManifest;
var init_tanstack_start_manifest_v_D0_i9UH = __esm({
  ".output/server/chunks/_/_tanstack-start-manifest_v-D0-i9UH_.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    tsrStartManifest = /* @__PURE__ */ __name(() => ({ routes: { __root__: { filePath: "/Users/kregenrek/projects/codefetchUI/src/routes/__root.tsx", children: ["/"], preloads: ["/assets/main-CQQcyaBi.js"], assets: [] }, "/": { filePath: "/Users/kregenrek/projects/codefetchUI/src/routes/index.tsx", assets: [], preloads: ["/assets/index-yCcNlDWb.js"] } }, clientEntry: "/assets/main-CQQcyaBi.js" }), "tsrStartManifest");
  }
});

// .output/server/chunks/_/theme-CMeYqxNb.mjs
var theme_CMeYqxNb_exports = {};
__export(theme_CMeYqxNb_exports, {
  getTheme_createServerFn_handler: () => m2,
  setTheme_createServerFn_handler: () => a2
});
import "cloudflare:workers";
import "node:events";
import "node:buffer";
import "node:timers";
import "node:stream";
import "node:stream/web";
var o2, m2, a2, n2, i2;
var init_theme_CMeYqxNb = __esm({
  ".output/server/chunks/_/theme-CMeYqxNb.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_ssr();
    init_nitro();
    init_async_hooks();
    o2 = "vite-ui-theme";
    m2 = createServerRpc("src_lib_theme_ts--getTheme_createServerFn_handler", "/_serverFn", (e3, r4) => n2.__executeServer(e3, r4));
    a2 = createServerRpc("src_lib_theme_ts--setTheme_createServerFn_handler", "/_serverFn", (e3, r4) => i2.__executeServer(e3, r4));
    n2 = createServerFn().handler(m2, async () => {
      const e3 = Bi(o2);
      return "light" === e3 || "dark" === e3 || "system" === e3 ? e3 : "system";
    });
    i2 = createServerFn({ method: "POST" }).validator((e3) => {
      if ("light" !== e3 && "dark" !== e3 && "system" !== e3) throw new Error("theme must be light | dark | system");
      return e3;
    }).handler(a2, async ({ data: e3 }) => {
      Hi(o2, e3, { path: "/", maxAge: 31536e3 });
    });
  }
});

// .output/server/chunks/_/_tanstack-start-server-fn-manifest_v-DSuGt3oC.mjs
var tanstack_start_server_fn_manifest_v_DSuGt3oC_exports = {};
__export(tanstack_start_server_fn_manifest_v_DSuGt3oC_exports, {
  default: () => e2
});
var e2;
var init_tanstack_start_server_fn_manifest_v_DSuGt3oC = __esm({
  ".output/server/chunks/_/_tanstack-start-server-fn-manifest_v-DSuGt3oC.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    e2 = { "src_lib_theme_ts--getTheme_createServerFn_handler": { functionName: "getTheme_createServerFn_handler", importer: /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_theme_CMeYqxNb(), theme_CMeYqxNb_exports)), "importer") }, "src_lib_theme_ts--setTheme_createServerFn_handler": { functionName: "setTheme_createServerFn_handler", importer: /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_theme_CMeYqxNb(), theme_CMeYqxNb_exports)), "importer") } };
  }
});

// .output/server/chunks/_/index-DEtW6s6k.mjs
var index_DEtW6s6k_exports = {};
__export(index_DEtW6s6k_exports, {
  component: () => SplitComponent
});
import "cloudflare:workers";
import "node:events";
import "node:buffer";
import "node:timers";
import "node:stream";
import "node:stream/web";
var SplitComponent;
var init_index_DEtW6s6k = __esm({
  ".output/server/chunks/_/index-DEtW6s6k.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_ssr();
    init_nitro();
    init_async_hooks();
    SplitComponent = /* @__PURE__ */ __name(function() {
      const [s4, t3] = W2.useState(null), [o5, n3] = W2.useState(false), [i5, c4] = W2.useState(null);
      return c2.jsxDEV("div", { style: { padding: "2rem", fontFamily: "system-ui", maxWidth: "800px", margin: "0 auto" }, children: [c2.jsxDEV("h1", { children: "Test Route with API Integration \u{1F389}" }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/index.tsx?tsr-split=component", lineNumber: 35, columnNumber: 7 }, this), c2.jsxDEV("p", { children: "This page demonstrates calling a minimal API endpoint" }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/index.tsx?tsr-split=component", lineNumber: 36, columnNumber: 7 }, this), c2.jsxDEV("div", { style: { marginTop: "2rem" }, children: c2.jsxDEV("button", { onClick: /* @__PURE__ */ __name(async () => {
        n3(true), c4(null);
        try {
          const e3 = await fetch("/api/test");
          if (!e3.ok) throw new Error(`HTTP error! status: ${e3.status}`);
          const r4 = await e3.json();
          t3(r4);
        } catch (e3) {
          c4(e3 instanceof Error ? e3.message : "An error occurred");
        } finally {
          n3(false);
        }
      }, "onClick"), style: { padding: "0.5rem 1rem", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" }, disabled: o5, children: o5 ? "Loading..." : "Refresh API Data" }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/index.tsx?tsr-split=component", lineNumber: 41, columnNumber: 9 }, this) }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/index.tsx?tsr-split=component", lineNumber: 38, columnNumber: 7 }, this), c2.jsxDEV("div", { style: { marginTop: "2rem" }, children: [c2.jsxDEV("h2", { children: "API Response:" }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/index.tsx?tsr-split=component", lineNumber: 57, columnNumber: 9 }, this), o5 && c2.jsxDEV("p", { children: "Loading..." }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/index.tsx?tsr-split=component", lineNumber: 58, columnNumber: 21 }, this), i5 && c2.jsxDEV("p", { style: { color: "red" }, children: ["Error: ", i5] }, void 0, true, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/index.tsx?tsr-split=component", lineNumber: 59, columnNumber: 19 }, this), s4 && c2.jsxDEV("pre", { style: { backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "4px", overflow: "auto" }, children: JSON.stringify(s4, null, 2) }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/index.tsx?tsr-split=component", lineNumber: 62, columnNumber: 21 }, this)] }, void 0, true, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/index.tsx?tsr-split=component", lineNumber: 54, columnNumber: 7 }, this), c2.jsxDEV("div", { style: { marginTop: "2rem", fontSize: "0.9em", color: "#666" }, children: [c2.jsxDEV("strong", { children: "Current time:" }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/index.tsx?tsr-split=component", lineNumber: 77, columnNumber: 9 }, this), " ", (/* @__PURE__ */ new Date()).toLocaleString()] }, void 0, true, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/index.tsx?tsr-split=component", lineNumber: 72, columnNumber: 7 }, this)] }, void 0, true, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/index.tsx?tsr-split=component", lineNumber: 29, columnNumber: 10 }, this);
    }, "SplitComponent");
  }
});

// .output/server/chunks/_/ssr.mjs
var ssr_exports = {};
__export(ssr_exports, {
  a: () => createServerFn,
  b: () => pl,
  c: () => createServerRpc,
  g: () => Bi,
  j: () => c2,
  r: () => W2,
  s: () => Hi
});
import { Buffer as r2 } from "node:buffer";
import { Readable as s2, PassThrough as o3 } from "node:stream";
import { ReadableStream as a3 } from "node:stream/web";
function getDefaultExportFromCjs(e3) {
  return e3 && e3.__esModule && Object.prototype.hasOwnProperty.call(e3, "default") ? e3.default : e3;
}
function noop$6() {
}
function resolveStaleTime(e3, t3) {
  return "function" == typeof e3 ? e3(t3) : e3;
}
function matchQuery(e3, t3) {
  const { type: r4 = "all", exact: n3, fetchStatus: s4, predicate: o5, queryKey: a5, stale: i5 } = e3;
  if (a5) {
    if (n3) {
      if (t3.queryHash !== hashQueryKeyByOptions(a5, t3.options)) return false;
    } else if (!partialMatchKey(t3.queryKey, a5)) return false;
  }
  if ("all" !== r4) {
    const e4 = t3.isActive();
    if ("active" === r4 && !e4) return false;
    if ("inactive" === r4 && e4) return false;
  }
  return ("boolean" != typeof i5 || t3.isStale() === i5) && ((!s4 || s4 === t3.state.fetchStatus) && !(o5 && !o5(t3)));
}
function matchMutation(e3, t3) {
  const { exact: r4, status: n3, predicate: s4, mutationKey: o5 } = e3;
  if (o5) {
    if (!t3.options.mutationKey) return false;
    if (r4) {
      if (hashKey(t3.options.mutationKey) !== hashKey(o5)) return false;
    } else if (!partialMatchKey(t3.options.mutationKey, o5)) return false;
  }
  return (!n3 || t3.state.status === n3) && !(s4 && !s4(t3));
}
function hashQueryKeyByOptions(e3, t3) {
  return (t3?.queryKeyHashFn || hashKey)(e3);
}
function hashKey(e3) {
  return JSON.stringify(e3, (e4, t3) => isPlainObject$2(t3) ? Object.keys(t3).sort().reduce((e5, r4) => (e5[r4] = t3[r4], e5), {}) : t3);
}
function partialMatchKey(e3, t3) {
  return e3 === t3 || typeof e3 == typeof t3 && (!(!e3 || !t3 || "object" != typeof e3 || "object" != typeof t3) && Object.keys(t3).every((r4) => partialMatchKey(e3[r4], t3[r4])));
}
function replaceEqualDeep$1(e3, t3) {
  if (e3 === t3) return e3;
  const r4 = isPlainArray$1(e3) && isPlainArray$1(t3);
  if (r4 || isPlainObject$2(e3) && isPlainObject$2(t3)) {
    const n3 = r4 ? e3 : Object.keys(e3), s4 = n3.length, o5 = r4 ? t3 : Object.keys(t3), a5 = o5.length, i5 = r4 ? [] : {}, l4 = new Set(n3);
    let u4 = 0;
    for (let n4 = 0; n4 < a5; n4++) {
      const s5 = r4 ? n4 : o5[n4];
      (!r4 && l4.has(s5) || r4) && void 0 === e3[s5] && void 0 === t3[s5] ? (i5[s5] = void 0, u4++) : (i5[s5] = replaceEqualDeep$1(e3[s5], t3[s5]), i5[s5] === e3[s5] && void 0 !== e3[s5] && u4++);
    }
    return s4 === a5 && u4 === s4 ? e3 : i5;
  }
  return t3;
}
function isPlainArray$1(e3) {
  return Array.isArray(e3) && e3.length === Object.keys(e3).length;
}
function isPlainObject$2(e3) {
  if (!hasObjectPrototype$2(e3)) return false;
  const t3 = e3.constructor;
  if (void 0 === t3) return true;
  const r4 = t3.prototype;
  return !!hasObjectPrototype$2(r4) && (!!r4.hasOwnProperty("isPrototypeOf") && Object.getPrototypeOf(e3) === Object.prototype);
}
function hasObjectPrototype$2(e3) {
  return "[object Object]" === Object.prototype.toString.call(e3);
}
function replaceData(e3, t3, r4) {
  return "function" == typeof r4.structuralSharing ? r4.structuralSharing(e3, t3) : false !== r4.structuralSharing ? replaceEqualDeep$1(e3, t3) : t3;
}
function addToEnd(e3, t3, r4 = 0) {
  const n3 = [...e3, t3];
  return r4 && n3.length > r4 ? n3.slice(1) : n3;
}
function addToStart(e3, t3, r4 = 0) {
  const n3 = [t3, ...e3];
  return r4 && n3.length > r4 ? n3.slice(0, -1) : n3;
}
function ensureQueryFn(e3, t3) {
  return !e3.queryFn && t3?.initialPromise ? () => t3.initialPromise : e3.queryFn && e3.queryFn !== h2 ? e3.queryFn : () => Promise.reject(new Error(`Missing queryFn: '${e3.queryHash}'`));
}
function defaultRetryDelay(e3) {
  return Math.min(1e3 * 2 ** e3, 3e4);
}
function canFetch(e3) {
  return "online" !== (e3 ?? "online") || f2.isOnline();
}
function isCancelledError(e3) {
  return e3 instanceof m3;
}
function createRetryer(e3) {
  let t3, r4 = false, n3 = 0, s4 = false;
  const o5 = function() {
    let e4, t4;
    const r5 = new Promise((r6, n4) => {
      e4 = r6, t4 = n4;
    });
    function finalize(e5) {
      Object.assign(r5, e5), delete r5.resolve, delete r5.reject;
    }
    __name(finalize, "finalize");
    return r5.status = "pending", r5.catch(() => {
    }), r5.resolve = (t5) => {
      finalize({ status: "fulfilled", value: t5 }), e4(t5);
    }, r5.reject = (e5) => {
      finalize({ status: "rejected", reason: e5 }), t4(e5);
    }, r5;
  }(), canContinue = /* @__PURE__ */ __name(() => p2.isFocused() && ("always" === e3.networkMode || f2.isOnline()) && e3.canRun(), "canContinue"), canStart = /* @__PURE__ */ __name(() => canFetch(e3.networkMode) && e3.canRun(), "canStart"), resolve = /* @__PURE__ */ __name((r5) => {
    s4 || (s4 = true, e3.onSuccess?.(r5), t3?.(), o5.resolve(r5));
  }, "resolve"), reject = /* @__PURE__ */ __name((r5) => {
    s4 || (s4 = true, e3.onError?.(r5), t3?.(), o5.reject(r5));
  }, "reject"), pause = /* @__PURE__ */ __name(() => new Promise((r5) => {
    t3 = /* @__PURE__ */ __name((e4) => {
      (s4 || canContinue()) && r5(e4);
    }, "t"), e3.onPause?.();
  }).then(() => {
    t3 = void 0, s4 || e3.onContinue?.();
  }), "pause"), run = /* @__PURE__ */ __name(() => {
    if (s4) return;
    let t4;
    const o6 = 0 === n3 ? e3.initialPromise : void 0;
    try {
      t4 = o6 ?? e3.fn();
    } catch (e4) {
      t4 = Promise.reject(e4);
    }
    Promise.resolve(t4).then(resolve).catch((t5) => {
      if (s4) return;
      const o7 = e3.retry ?? 0, a5 = e3.retryDelay ?? defaultRetryDelay, i5 = "function" == typeof a5 ? a5(n3, t5) : a5, l4 = true === o7 || "number" == typeof o7 && n3 < o7 || "function" == typeof o7 && o7(n3, t5);
      var u4;
      !r4 && l4 ? (n3++, e3.onFail?.(n3, t5), (u4 = i5, new Promise((e4) => {
        setTimeout(e4, u4);
      })).then(() => canContinue() ? void 0 : pause()).then(() => {
        r4 ? reject(t5) : run();
      })) : reject(t5);
    });
  }, "run");
  return { promise: o5, cancel: /* @__PURE__ */ __name((t4) => {
    s4 || (reject(new m3(t4)), e3.abort?.());
  }, "cancel"), continue: /* @__PURE__ */ __name(() => (t3?.(), o5), "continue"), cancelRetry: /* @__PURE__ */ __name(() => {
    r4 = true;
  }, "cancelRetry"), continueRetry: /* @__PURE__ */ __name(() => {
    r4 = false;
  }, "continueRetry"), canStart, start: /* @__PURE__ */ __name(() => (canStart() ? run() : pause().then(run), o5), "start") };
}
function scopeFor(e3) {
  return e3.options.scope?.id;
}
function infiniteQueryBehavior(e3) {
  return { onFetch: /* @__PURE__ */ __name((t3, r4) => {
    const n3 = t3.options, s4 = t3.fetchOptions?.meta?.fetchMore?.direction, o5 = t3.state.data?.pages || [], a5 = t3.state.data?.pageParams || [];
    let i5 = { pages: [], pageParams: [] }, l4 = 0;
    const fetchFn = /* @__PURE__ */ __name(async () => {
      let r5 = false;
      const u4 = ensureQueryFn(t3.options, t3.fetchOptions), fetchPage = /* @__PURE__ */ __name(async (e4, n4, s5) => {
        if (r5) return Promise.reject();
        if (null == n4 && e4.pages.length) return Promise.resolve(e4);
        const o6 = (() => {
          const e5 = { client: t3.client, queryKey: t3.queryKey, pageParam: n4, direction: s5 ? "backward" : "forward", meta: t3.options.meta };
          var o7;
          return o7 = e5, Object.defineProperty(o7, "signal", { enumerable: true, get: /* @__PURE__ */ __name(() => (t3.signal.aborted ? r5 = true : t3.signal.addEventListener("abort", () => {
            r5 = true;
          }), t3.signal), "get") }), e5;
        })(), a6 = await u4(o6), { maxPages: i6 } = t3.options, l5 = s5 ? addToStart : addToEnd;
        return { pages: l5(e4.pages, a6, i6), pageParams: l5(e4.pageParams, n4, i6) };
      }, "fetchPage");
      if (s4 && o5.length) {
        const e4 = "backward" === s4, t4 = { pages: o5, pageParams: a5 }, r6 = (e4 ? getPreviousPageParam : getNextPageParam)(n3, t4);
        i5 = await fetchPage(t4, r6, e4);
      } else {
        const t4 = e3 ?? o5.length;
        do {
          const e4 = 0 === l4 ? a5[0] ?? n3.initialPageParam : getNextPageParam(n3, i5);
          if (l4 > 0 && null == e4) break;
          i5 = await fetchPage(i5, e4), l4++;
        } while (l4 < t4);
      }
      return i5;
    }, "fetchFn");
    t3.options.persister ? t3.fetchFn = () => t3.options.persister?.(fetchFn, { client: t3.client, queryKey: t3.queryKey, meta: t3.options.meta, signal: t3.signal }, r4) : t3.fetchFn = fetchFn;
  }, "onFetch") };
}
function getNextPageParam(e3, { pages: t3, pageParams: r4 }) {
  const n3 = t3.length - 1;
  return t3.length > 0 ? e3.getNextPageParam(t3[n3], t3, r4[n3], r4) : void 0;
}
function getPreviousPageParam(e3, { pages: t3, pageParams: r4 }) {
  return t3.length > 0 ? e3.getPreviousPageParam?.(t3[0], t3, r4[0], r4) : void 0;
}
function defaultTransformerFn(e3) {
  return e3;
}
function dehydrateMutation(e3) {
  return { mutationKey: e3.options.mutationKey, state: e3.state, ...e3.options.scope && { scope: e3.options.scope }, ...e3.meta && { meta: e3.meta } };
}
function dehydrateQuery(e3, t3, r4) {
  return { dehydratedAt: Date.now(), state: { ...e3.state, ...void 0 !== e3.state.data && { data: t3(e3.state.data) } }, queryKey: e3.queryKey, queryHash: e3.queryHash, ..."pending" === e3.state.status && { promise: e3.promise?.then(t3).catch((e4) => r4(e4) ? Promise.reject(new Error("redacted")) : Promise.reject(e4)) }, ...e3.meta && { meta: e3.meta } };
}
function defaultShouldDehydrateMutation(e3) {
  return e3.state.isPaused;
}
function defaultShouldDehydrateQuery(e3) {
  return "success" === e3.state.status;
}
function defaultShouldRedactErrors(e3) {
  return true;
}
function dehydrate(e3, t3 = {}) {
  const r4 = t3.shouldDehydrateMutation ?? e3.getDefaultOptions().dehydrate?.shouldDehydrateMutation ?? defaultShouldDehydrateMutation, n3 = e3.getMutationCache().getAll().flatMap((e4) => r4(e4) ? [dehydrateMutation(e4)] : []), s4 = t3.shouldDehydrateQuery ?? e3.getDefaultOptions().dehydrate?.shouldDehydrateQuery ?? defaultShouldDehydrateQuery, o5 = t3.shouldRedactErrors ?? e3.getDefaultOptions().dehydrate?.shouldRedactErrors ?? defaultShouldRedactErrors, a5 = t3.serializeData ?? e3.getDefaultOptions().dehydrate?.serializeData ?? defaultTransformerFn;
  return { mutations: n3, queries: e3.getQueryCache().getAll().flatMap((e4) => s4(e4) ? [dehydrateQuery(e4, a5, o5)] : []) };
}
function hydrate(e3, t3, r4) {
  if ("object" != typeof t3 || null === t3) return;
  const n3 = e3.getMutationCache(), s4 = e3.getQueryCache(), o5 = e3.getDefaultOptions().hydrate?.deserializeData ?? defaultTransformerFn, a5 = t3.mutations || [], i5 = t3.queries || [];
  a5.forEach(({ state: t4, ...s5 }) => {
    n3.build(e3, { ...e3.getDefaultOptions().hydrate?.mutations, ...r4?.defaultOptions?.mutations, ...s5 }, t4);
  }), i5.forEach(({ queryKey: t4, state: n4, queryHash: a6, meta: i6, promise: l4, dehydratedAt: u4 }) => {
    const c4 = l4 ? function(e4) {
      let t5;
      if (e4.then((e5) => (t5 = e5, e5), noop$6)?.catch(noop$6), void 0 !== t5) return { data: t5 };
    }(l4) : void 0, d4 = void 0 === n4.data ? c4?.data : n4.data, h4 = void 0 === d4 ? d4 : o5(d4);
    let p4 = s4.get(a6);
    const f4 = "pending" === p4?.state.status, m5 = "fetching" === p4?.state.fetchStatus;
    if (p4) {
      const e4 = c4 && void 0 !== u4 && u4 > p4.state.dataUpdatedAt;
      if (n4.dataUpdatedAt > p4.state.dataUpdatedAt || e4) {
        const { fetchStatus: e5, ...t5 } = n4;
        p4.setState({ ...t5, data: h4 });
      }
    } else p4 = s4.build(e3, { ...e3.getDefaultOptions().hydrate?.queries, ...r4?.defaultOptions?.queries, queryKey: t4, queryHash: a6, meta: i6 }, { ...n4, data: h4, fetchStatus: "idle", status: void 0 !== h4 ? "success" : n4.status });
    l4 && !f4 && !m5 && (void 0 === u4 || u4 > p4.state.dataUpdatedAt) && p4.fetch(void 0, { initialPromise: Promise.resolve(l4).then(o5) });
  });
}
function Component(e3, t3, r4) {
  this.props = e3, this.context = t3, this.refs = D2, this.updater = r4 || j;
}
function ComponentDummy() {
}
function PureComponent(e3, t3, r4) {
  this.props = e3, this.context = t3, this.refs = D2, this.updater = r4 || j;
}
function ReactElement(e3, t3, r4, n3, s4, o5) {
  return r4 = o5.ref, { $$typeof: P2, type: e3, key: t3, ref: void 0 !== r4 ? r4 : null, props: o5 };
}
function isValidElement(e3) {
  return "object" == typeof e3 && null !== e3 && e3.$$typeof === P2;
}
function getElementKey(e3, t3) {
  return "object" == typeof e3 && null !== e3 && null != e3.key ? (r4 = "" + e3.key, n3 = { "=": "=0", ":": "=2" }, "$" + r4.replace(/[=:]/g, function(e4) {
    return n3[e4];
  })) : t3.toString(36);
  var r4, n3;
}
function noop$1$2() {
}
function mapIntoArray(e3, t3, r4, n3, s4) {
  var o5 = typeof e3;
  "undefined" !== o5 && "boolean" !== o5 || (e3 = null);
  var a5, i5, l4 = false;
  if (null === e3) l4 = true;
  else switch (o5) {
    case "bigint":
    case "string":
    case "number":
      l4 = true;
      break;
    case "object":
      switch (e3.$$typeof) {
        case P2:
        case R2:
          l4 = true;
          break;
        case O2:
          return mapIntoArray((l4 = e3._init)(e3._payload), t3, r4, n3, s4);
      }
  }
  if (l4) return s4 = s4(e3), l4 = "" === n3 ? "." + getElementKey(e3, 0) : n3, H(s4) ? (r4 = "", null != l4 && (r4 = l4.replace(U2, "$&/") + "/"), mapIntoArray(s4, t3, r4, "", function(e4) {
    return e4;
  })) : null != s4 && (isValidElement(s4) && (a5 = s4, i5 = r4 + (null == s4.key || e3 && e3.key === s4.key ? "" : ("" + s4.key).replace(U2, "$&/") + "/") + l4, s4 = ReactElement(a5.type, i5, void 0, 0, 0, a5.props)), t3.push(s4)), 1;
  l4 = 0;
  var u4, c4 = "" === n3 ? "." : n3 + ":";
  if (H(e3)) for (var d4 = 0; d4 < e3.length; d4++) l4 += mapIntoArray(n3 = e3[d4], t3, r4, o5 = c4 + getElementKey(n3, d4), s4);
  else if ("function" == typeof (d4 = null === (u4 = e3) || "object" != typeof u4 ? null : "function" == typeof (u4 = N2 && u4[N2] || u4["@@iterator"]) ? u4 : null)) for (e3 = d4.call(e3), d4 = 0; !(n3 = e3.next()).done; ) l4 += mapIntoArray(n3 = n3.value, t3, r4, o5 = c4 + getElementKey(n3, d4++), s4);
  else if ("object" === o5) {
    if ("function" == typeof e3.then) return mapIntoArray(function(e4) {
      switch (e4.status) {
        case "fulfilled":
          return e4.value;
        case "rejected":
          throw e4.reason;
        default:
          switch ("string" == typeof e4.status ? e4.then(noop$1$2, noop$1$2) : (e4.status = "pending", e4.then(function(t4) {
            "pending" === e4.status && (e4.status = "fulfilled", e4.value = t4);
          }, function(t4) {
            "pending" === e4.status && (e4.status = "rejected", e4.reason = t4);
          })), e4.status) {
            case "fulfilled":
              return e4.value;
            case "rejected":
              throw e4.reason;
          }
      }
      throw e4;
    }(e3), t3, r4, n3, s4);
    throw t3 = String(e3), Error("Objects are not valid as a React child (found: " + ("[object Object]" === t3 ? "object with keys {" + Object.keys(e3).join(", ") + "}" : t3) + "). If you meant to render a collection of children, use an array instead.");
  }
  return l4;
}
function mapChildren(e3, t3, r4) {
  if (null == e3) return e3;
  var n3 = [], s4 = 0;
  return mapIntoArray(e3, n3, "", "", function(e4) {
    return t3.call(r4, e4, s4++);
  }), n3;
}
function lazyInitializer(e3) {
  if (-1 === e3._status) {
    var t3 = e3._result;
    (t3 = t3()).then(function(t4) {
      0 !== e3._status && -1 !== e3._status || (e3._status = 1, e3._result = t4);
    }, function(t4) {
      0 !== e3._status && -1 !== e3._status || (e3._status = 2, e3._result = t4);
    }), -1 === e3._status && (e3._status = 0, e3._result = t3);
  }
  if (1 === e3._status) return e3._result.default;
  throw e3._result;
}
function noop$5() {
}
function jsxProd(e3, t3, r4) {
  var n3 = null;
  if (void 0 !== r4 && (n3 = "" + r4), void 0 !== t3.key && (n3 = "" + t3.key), "key" in t3) for (var s4 in r4 = {}, t3) "key" !== s4 && (r4[s4] = t3[s4]);
  else r4 = t3;
  return t3 = r4.ref, { $$typeof: J, type: e3, key: n3, ref: void 0 !== t3 ? t3 : null, props: r4 };
}
function invariant$1(e3, t3) {
  if (!e3) throw new Error("Invariant failed");
}
function __flush_internals(e3) {
  const t3 = Array.from(e3).sort((e4, t4) => e4 instanceof Derived && e4.options.deps.includes(t4) ? 1 : t4 instanceof Derived && t4.options.deps.includes(e4) ? -1 : 0);
  for (const e4 of t3) {
    if (ne.current.includes(e4)) continue;
    ne.current.push(e4), e4.recompute();
    const t4 = re.get(e4);
    if (t4) for (const e5 of t4) {
      const t5 = te.get(e5);
      t5 && __flush_internals(t5);
    }
  }
}
function __notifyListeners(e3) {
  e3.listeners.forEach((t3) => t3({ prevVal: e3.prevState, currentVal: e3.state }));
}
function __notifyDerivedListeners(e3) {
  e3.listeners.forEach((t3) => t3({ prevVal: e3.prevState, currentVal: e3.state }));
}
function __flush(e3) {
  if (oe > 0 && !ie.has(e3) && ie.set(e3, e3.prevState), ae.add(e3), !(oe > 0 || se)) try {
    for (se = true; ae.size > 0; ) {
      const e4 = Array.from(ae);
      ae.clear();
      for (const t3 of e4) {
        const e5 = ie.get(t3) ?? t3.prevState;
        t3.prevState = e5, __notifyListeners(t3);
      }
      for (const t3 of e4) {
        const e5 = te.get(t3);
        e5 && (ne.current.push(t3), __flush_internals(e5));
      }
      for (const t3 of e4) {
        const e5 = te.get(t3);
        if (e5) for (const t4 of e5) __notifyDerivedListeners(t4);
      }
    }
  } finally {
    se = false, ne.current = [], ie.clear();
  }
}
function batch(e3) {
  oe++;
  try {
    e3();
  } finally {
    if (oe--, 0 === oe) {
      const e4 = Array.from(ae)[0];
      e4 && __flush(e4);
    }
  }
}
function createHistory$1(e3) {
  let t3 = e3.getLocation();
  const r4 = /* @__PURE__ */ new Set(), notify = /* @__PURE__ */ __name((n3) => {
    t3 = e3.getLocation(), r4.forEach((e4) => e4({ location: t3, action: n3 }));
  }, "notify"), handleIndexChange = /* @__PURE__ */ __name((r5) => {
    e3.notifyOnIndexChange ?? 1 ? notify(r5) : t3 = e3.getLocation();
  }, "handleIndexChange"), tryNavigation = /* @__PURE__ */ __name(async ({ task: r5, navigateOpts: n3, ...s4 }) => {
    var o5, a5;
    if ((null == n3 ? void 0 : n3.ignoreBlocker) ?? false) return void r5();
    const i5 = (null == (o5 = e3.getBlockers) ? void 0 : o5.call(e3)) ?? [], l4 = "PUSH" === s4.type || "REPLACE" === s4.type;
    if ("undefined" != typeof document && i5.length && l4) for (const r6 of i5) {
      const n4 = parseHref$1(s4.path, s4.state);
      if (await r6.blockerFn({ currentLocation: t3, nextLocation: n4, action: s4.type })) return void (null == (a5 = e3.onBlocked) || a5.call(e3));
    }
    r5();
  }, "tryNavigation");
  return { get location() {
    return t3;
  }, get length() {
    return e3.getLength();
  }, subscribers: r4, subscribe: /* @__PURE__ */ __name((e4) => (r4.add(e4), () => {
    r4.delete(e4);
  }), "subscribe"), push: /* @__PURE__ */ __name((r5, n3, s4) => {
    const o5 = t3.state[le];
    n3 = assignKeyAndIndex$1(o5 + 1, n3), tryNavigation({ task: /* @__PURE__ */ __name(() => {
      e3.pushState(r5, n3), notify({ type: "PUSH" });
    }, "task"), navigateOpts: s4, type: "PUSH", path: r5, state: n3 });
  }, "push"), replace: /* @__PURE__ */ __name((r5, n3, s4) => {
    const o5 = t3.state[le];
    n3 = assignKeyAndIndex$1(o5, n3), tryNavigation({ task: /* @__PURE__ */ __name(() => {
      e3.replaceState(r5, n3), notify({ type: "REPLACE" });
    }, "task"), navigateOpts: s4, type: "REPLACE", path: r5, state: n3 });
  }, "replace"), go: /* @__PURE__ */ __name((t4, r5) => {
    tryNavigation({ task: /* @__PURE__ */ __name(() => {
      e3.go(t4), handleIndexChange({ type: "GO", index: t4 });
    }, "task"), navigateOpts: r5, type: "GO" });
  }, "go"), back: /* @__PURE__ */ __name((t4) => {
    tryNavigation({ task: /* @__PURE__ */ __name(() => {
      e3.back((null == t4 ? void 0 : t4.ignoreBlocker) ?? false), handleIndexChange({ type: "BACK" });
    }, "task"), navigateOpts: t4, type: "BACK" });
  }, "back"), forward: /* @__PURE__ */ __name((t4) => {
    tryNavigation({ task: /* @__PURE__ */ __name(() => {
      e3.forward((null == t4 ? void 0 : t4.ignoreBlocker) ?? false), handleIndexChange({ type: "FORWARD" });
    }, "task"), navigateOpts: t4, type: "FORWARD" });
  }, "forward"), canGoBack: /* @__PURE__ */ __name(() => 0 !== t3.state[le], "canGoBack"), createHref: /* @__PURE__ */ __name((t4) => e3.createHref(t4), "createHref"), block: /* @__PURE__ */ __name((t4) => {
    var r5;
    if (!e3.setBlockers) return () => {
    };
    const n3 = (null == (r5 = e3.getBlockers) ? void 0 : r5.call(e3)) ?? [];
    return e3.setBlockers([...n3, t4]), () => {
      var r6, n4;
      const s4 = (null == (r6 = e3.getBlockers) ? void 0 : r6.call(e3)) ?? [];
      null == (n4 = e3.setBlockers) || n4.call(e3, s4.filter((e4) => e4 !== t4));
    };
  }, "block"), flush: /* @__PURE__ */ __name(() => {
    var t4;
    return null == (t4 = e3.flush) ? void 0 : t4.call(e3);
  }, "flush"), destroy: /* @__PURE__ */ __name(() => {
    var t4;
    return null == (t4 = e3.destroy) ? void 0 : t4.call(e3);
  }, "destroy"), notify };
}
function assignKeyAndIndex$1(e3, t3) {
  t3 || (t3 = {});
  const r4 = createRandomKey$1();
  return { ...t3, key: r4, __TSR_key: r4, [le]: e3 };
}
function parseHref$1(e3, t3) {
  const r4 = e3.indexOf("#"), n3 = e3.indexOf("?"), s4 = createRandomKey$1();
  return { href: e3, pathname: e3.substring(0, r4 > 0 ? n3 > 0 ? Math.min(r4, n3) : r4 : n3 > 0 ? n3 : e3.length), hash: r4 > -1 ? e3.substring(r4) : "", search: n3 > -1 ? e3.slice(n3, -1 === r4 ? void 0 : r4) : "", state: t3 || { [le]: 0, key: s4, __TSR_key: s4 } };
}
function createRandomKey$1() {
  return (Math.random() + 1).toString(36).substring(7);
}
function last(e3) {
  return e3[e3.length - 1];
}
function functionalUpdate(e3, t3) {
  return "function" == typeof e3 ? e3(t3) : e3;
}
function pick(e3, t3) {
  return t3.reduce((t4, r4) => (t4[r4] = e3[r4], t4), {});
}
function replaceEqualDeep(e3, t3) {
  if (e3 === t3) return e3;
  const r4 = t3, n3 = isPlainArray(e3) && isPlainArray(r4);
  if (n3 || isSimplePlainObject(e3) && isSimplePlainObject(r4)) {
    const t4 = n3 ? e3 : Object.keys(e3).concat(Object.getOwnPropertySymbols(e3)), s4 = t4.length, o5 = n3 ? r4 : Object.keys(r4).concat(Object.getOwnPropertySymbols(r4)), a5 = o5.length, i5 = n3 ? [] : {};
    let l4 = 0;
    for (let s5 = 0; s5 < a5; s5++) {
      const a6 = n3 ? s5 : o5[s5];
      (!n3 && t4.includes(a6) || n3) && void 0 === e3[a6] && void 0 === r4[a6] ? (i5[a6] = void 0, l4++) : (i5[a6] = replaceEqualDeep(e3[a6], r4[a6]), i5[a6] === e3[a6] && void 0 !== e3[a6] && l4++);
    }
    return s4 === a5 && l4 === s4 ? e3 : i5;
  }
  return r4;
}
function isSimplePlainObject(e3) {
  return isPlainObject$1(e3) && Object.getOwnPropertyNames(e3).length === Object.keys(e3).length;
}
function isPlainObject$1(e3) {
  if (!hasObjectPrototype$1(e3)) return false;
  const t3 = e3.constructor;
  if (void 0 === t3) return true;
  const r4 = t3.prototype;
  return !!hasObjectPrototype$1(r4) && !!r4.hasOwnProperty("isPrototypeOf");
}
function hasObjectPrototype$1(e3) {
  return "[object Object]" === Object.prototype.toString.call(e3);
}
function isPlainArray(e3) {
  return Array.isArray(e3) && e3.length === Object.keys(e3).length;
}
function getObjectKeys(e3, t3) {
  let r4 = Object.keys(e3);
  return t3 && (r4 = r4.filter((t4) => void 0 !== e3[t4])), r4;
}
function deepEqual(e3, t3, r4) {
  if (e3 === t3) return true;
  if (typeof e3 != typeof t3) return false;
  if (isPlainObject$1(e3) && isPlainObject$1(t3)) {
    const n3 = (null == r4 ? void 0 : r4.ignoreUndefined) ?? true, s4 = getObjectKeys(e3, n3), o5 = getObjectKeys(t3, n3);
    return !(!(null == r4 ? void 0 : r4.partial) && s4.length !== o5.length) && o5.every((n4) => deepEqual(e3[n4], t3[n4], r4));
  }
  return !(!Array.isArray(e3) || !Array.isArray(t3)) && (e3.length === t3.length && !e3.some((e4, n3) => !deepEqual(e4, t3[n3], r4)));
}
function createControlledPromise$1(e3) {
  let t3, r4;
  const n3 = new Promise((e4, n4) => {
    t3 = e4, r4 = n4;
  });
  return n3.status = "pending", n3.resolve = (r5) => {
    n3.status = "resolved", n3.value = r5, t3(r5), null == e3 || e3(r5);
  }, n3.reject = (e4) => {
    n3.status = "rejected", r4(e4);
  }, n3;
}
function joinPaths$1(e3) {
  return cleanPath$1(e3.filter((e4) => void 0 !== e4).join("/"));
}
function cleanPath$1(e3) {
  return e3.replace(/\/{2,}/g, "/");
}
function trimPathLeft$1(e3) {
  return "/" === e3 ? e3 : e3.replace(/^\/{1,}/, "");
}
function trimPathRight$1(e3) {
  return "/" === e3 ? e3 : e3.replace(/\/{1,}$/, "");
}
function trimPath$1(e3) {
  return trimPathRight$1(trimPathLeft$1(e3));
}
function removeTrailingSlash(e3, t3) {
  return (null == e3 ? void 0 : e3.endsWith("/")) && "/" !== e3 && e3 !== `${t3}/` ? e3.slice(0, -1) : e3;
}
function parsePathname$1(e3) {
  if (!e3) return [];
  const t3 = [];
  if ("/" === (e3 = cleanPath$1(e3)).slice(0, 1) && (e3 = e3.substring(1), t3.push({ type: "pathname", value: "/" })), !e3) return t3;
  const r4 = e3.split("/").filter(Boolean);
  return t3.push(...r4.map((e4) => {
    const t4 = e4.match(fe);
    if (t4) {
      return { type: "wildcard", value: "$", prefixSegment: t4[1] || void 0, suffixSegment: t4[2] || void 0 };
    }
    const r5 = e4.match(he);
    if (r5) {
      const e5 = r5[1];
      return { type: "param", value: "" + r5[2], prefixSegment: e5 || void 0, suffixSegment: r5[3] || void 0 };
    }
    if (de.test(e4)) {
      return { type: "param", value: "$" + e4.substring(1), prefixSegment: void 0, suffixSegment: void 0 };
    }
    return pe.test(e4) ? { type: "wildcard", value: "$", prefixSegment: void 0, suffixSegment: void 0 } : { type: "pathname", value: e4.includes("%25") ? e4.split("%25").map((e5) => decodeURI(e5)).join("%25") : decodeURI(e4) };
  })), "/" === e3.slice(-1) && (e3 = e3.substring(1), t3.push({ type: "pathname", value: "/" })), t3;
}
function interpolatePath({ path: e3, params: t3, leaveWildcards: r4, leaveParams: n3, decodeCharMap: s4 }) {
  const o5 = parsePathname$1(e3);
  function encodeParam(e4) {
    const r5 = t3[e4], n4 = "string" == typeof r5;
    return ["*", "_splat"].includes(e4) ? n4 ? encodeURI(r5) : r5 : n4 ? function(e5, t4) {
      let r6 = encodeURIComponent(e5);
      if (t4) for (const [e6, n5] of t4) r6 = r6.replaceAll(e6, n5);
      return r6;
    }(r5, s4) : r5;
  }
  __name(encodeParam, "encodeParam");
  let a5 = false;
  const i5 = {}, l4 = joinPaths$1(o5.map((e4) => {
    if ("wildcard" === e4.type) {
      i5._splat = t3._splat;
      const n4 = e4.prefixSegment || "", s5 = e4.suffixSegment || "";
      if (!("_splat" in t3)) return a5 = true, r4 ? `${n4}${e4.value}${s5}` : n4 || s5 ? `${n4}${s5}` : void 0;
      const o6 = encodeParam("_splat");
      return r4 ? `${n4}${e4.value}${o6 ?? ""}${s5}` : `${n4}${o6}${s5}`;
    }
    if ("param" === e4.type) {
      const r5 = e4.value.substring(1);
      a5 || r5 in t3 || (a5 = true), i5[r5] = t3[r5];
      const s5 = e4.prefixSegment || "", o6 = e4.suffixSegment || "";
      if (n3) {
        const t4 = encodeParam(e4.value);
        return `${s5}${e4.value}${t4 ?? ""}${o6}`;
      }
      return `${s5}${encodeParam(r5) ?? "undefined"}${o6}`;
    }
    return e4.value;
  }));
  return { usedParams: i5, interpolatedPath: l4, isMissingParams: a5 };
}
function matchPathname$1(e3, t3, r4) {
  const n3 = function(e4, t4, r5) {
    if ("/" !== e4 && !t4.startsWith(e4)) return;
    t4 = removeBasepath$1(e4, t4, r5.caseSensitive);
    const n4 = removeBasepath$1(e4, `${r5.to ?? "$"}`, r5.caseSensitive), s4 = parsePathname$1(t4), o5 = parsePathname$1(n4);
    t4.startsWith("/") || s4.unshift({ type: "pathname", value: "/" });
    n4.startsWith("/") || o5.unshift({ type: "pathname", value: "/" });
    const a5 = {}, i5 = (() => {
      var e5;
      for (let t5 = 0; t5 < Math.max(s4.length, o5.length); t5++) {
        const n5 = s4[t5], i6 = o5[t5], l4 = t5 >= s4.length - 1, u4 = t5 >= o5.length - 1;
        if (i6) {
          if ("wildcard" === i6.type) {
            const r6 = s4.slice(t5);
            let o6;
            if (i6.prefixSegment || i6.suffixSegment) {
              if (!n5) return false;
              const t6 = i6.prefixSegment || "", a6 = i6.suffixSegment || "", l5 = n5.value;
              if ("prefixSegment" in i6 && !l5.startsWith(t6)) return false;
              if ("suffixSegment" in i6 && !(null == (e5 = s4[s4.length - 1]) ? void 0 : e5.value.endsWith(a6))) return false;
              let u5 = decodeURI(joinPaths$1(r6.map((e6) => e6.value)));
              t6 && u5.startsWith(t6) && (u5 = u5.slice(t6.length)), a6 && u5.endsWith(a6) && (u5 = u5.slice(0, u5.length - a6.length)), o6 = u5;
            } else o6 = decodeURI(joinPaths$1(r6.map((e6) => e6.value)));
            return a5["*"] = o6, a5._splat = o6, true;
          }
          if ("pathname" === i6.type) {
            if ("/" === i6.value && !(null == n5 ? void 0 : n5.value)) return true;
            if (n5) {
              if (r5.caseSensitive) {
                if (i6.value !== n5.value) return false;
              } else if (i6.value.toLowerCase() !== n5.value.toLowerCase()) return false;
            }
          }
          if (!n5) return false;
          if ("param" === i6.type) {
            if ("/" === n5.value) return false;
            let e6;
            if (i6.prefixSegment || i6.suffixSegment) {
              const t6 = i6.prefixSegment || "", r6 = i6.suffixSegment || "", s5 = n5.value;
              if (t6 && !s5.startsWith(t6)) return false;
              if (r6 && !s5.endsWith(r6)) return false;
              let o6 = s5;
              t6 && o6.startsWith(t6) && (o6 = o6.slice(t6.length)), r6 && o6.endsWith(r6) && (o6 = o6.slice(0, o6.length - r6.length)), e6 = decodeURIComponent(o6);
            } else e6 = decodeURIComponent(n5.value);
            a5[i6.value.substring(1)] = e6;
          }
        }
        if (!l4 && u4) return a5["**"] = joinPaths$1(s4.slice(t5 + 1).map((e6) => e6.value)), !!r5.fuzzy && "/" !== (null == i6 ? void 0 : i6.value);
      }
      return true;
    })();
    return i5 ? a5 : void 0;
  }(e3, t3, r4);
  if (!r4.to || n3) return n3 ?? {};
}
function removeBasepath$1(e3, t3, r4 = false) {
  const n3 = r4 ? e3 : e3.toLowerCase(), s4 = r4 ? t3 : t3.toLowerCase();
  switch (true) {
    case "/" === n3:
      return t3;
    case s4 === n3:
      return "";
    case t3.length < e3.length:
    case "/" !== s4[n3.length]:
      return t3;
    case s4.startsWith(n3):
      return t3.slice(e3.length);
    default:
      return t3;
  }
}
function isNotFound$1(e3) {
  return !!(null == e3 ? void 0 : e3.isNotFound);
}
function restoreScroll(e3, t3, r4, n3, s4) {
  var o5;
  let a5;
  try {
    a5 = JSON.parse(sessionStorage.getItem(e3) || "{}");
  } catch (e4) {
    return void console.error(e4);
  }
  const i5 = a5[t3 || (null == (o5 = window.history.state) ? void 0 : o5.key)];
  ye = true, (() => {
    if (n3 && i5) {
      for (const e5 in i5) {
        const t4 = i5[e5];
        if ("window" === e5) window.scrollTo({ top: t4.scrollY, left: t4.scrollX, behavior: r4 });
        else if (e5) {
          const r5 = document.querySelector(e5);
          r5 && (r5.scrollLeft = t4.scrollX, r5.scrollTop = t4.scrollY);
        }
      }
      return;
    }
    const e4 = window.location.hash.split("#")[1];
    if (e4) {
      const t4 = (window.history.state || {}).__hashScrollIntoViewOptions ?? true;
      if (t4) {
        const r5 = document.getElementById(e4);
        r5 && r5.scrollIntoView(t4);
      }
      return;
    }
    ["window", ...(null == s4 ? void 0 : s4.filter((e5) => "window" !== e5)) ?? []].forEach((e5) => {
      const t4 = "window" === e5 ? window : "function" == typeof e5 ? e5() : document.querySelector(e5);
      t4 && t4.scrollTo({ top: 0, left: 0, behavior: r4 });
    });
  })(), ye = false;
}
function setupScrollRestoration(e3, t3) {
  if (void 0 === ge) return;
  if ((e3.options.scrollRestoration ?? false) && (e3.isScrollRestoring = true), "undefined" == typeof document || e3.isScrollRestorationSetup) return;
  e3.isScrollRestorationSetup = true, ye = false;
  const r4 = e3.options.getScrollRestorationKey || defaultGetScrollRestorationKey;
  window.history.scrollRestoration = "manual";
  const onScroll = /* @__PURE__ */ __name((t4) => {
    if (ye || !e3.isScrollRestoring) return;
    let n3 = "";
    if (t4.target === document || t4.target === window) n3 = "window";
    else {
      const e4 = t4.target.getAttribute("data-scroll-restoration-id");
      n3 = e4 ? `[data-scroll-restoration-id="${e4}"]` : function(e5) {
        const t5 = [];
        let r5;
        for (; r5 = e5.parentNode; ) t5.unshift(`${e5.tagName}:nth-child(${[].indexOf.call(r5.children, e5) + 1})`), e5 = r5;
        return `${t5.join(" > ")}`.toLowerCase();
      }(t4.target);
    }
    const s4 = r4(e3.state.location);
    ge.set((e4) => {
      const t5 = e4[s4] = e4[s4] || {}, r5 = t5[n3] = t5[n3] || {};
      if ("window" === n3) r5.scrollX = window.scrollX || 0, r5.scrollY = window.scrollY || 0;
      else if (n3) {
        const e5 = document.querySelector(n3);
        e5 && (r5.scrollX = e5.scrollLeft || 0, r5.scrollY = e5.scrollTop || 0);
      }
      return e4;
    });
  }, "onScroll");
  "undefined" != typeof document && document.addEventListener("scroll", /* @__PURE__ */ ((e4, t4) => {
    let r5;
    return (...n3) => {
      r5 || (r5 = setTimeout(() => {
        e4(...n3), r5 = null;
      }, t4));
    };
  })(onScroll, 100), true), e3.subscribe("onRendered", (t4) => {
    const n3 = r4(t4.toLocation);
    e3.resetNextScroll ? (restoreScroll(me, n3, e3.options.scrollRestorationBehavior || void 0, e3.isScrollRestoring || void 0, e3.options.scrollToTopSelectors || void 0), e3.isScrollRestoring && ge.set((e4) => (e4[n3] = e4[n3] || {}, e4))) : e3.resetNextScroll = true;
  });
}
function toValue(e3) {
  return e3 ? "false" !== e3 && ("true" === e3 || (0 * +e3 == 0 && +e3 + "" === e3 ? +e3 : e3)) : "";
}
function isRedirect$1(e3) {
  return e3 instanceof Response && !!e3.options;
}
function getLocationChangeInfo(e3) {
  const t3 = e3.resolvedLocation, r4 = e3.location;
  return { fromLocation: t3, toLocation: r4, pathChanged: (null == t3 ? void 0 : t3.pathname) !== r4.pathname, hrefChanged: (null == t3 ? void 0 : t3.href) !== r4.href, hashChanged: (null == t3 ? void 0 : t3.hash) !== r4.hash };
}
function validateSearch(e3, t3) {
  if (null == e3) return {};
  if ("~standard" in e3) {
    const r4 = e3["~standard"].validate(t3);
    if (r4 instanceof Promise) throw new SearchParamError("Async validation not supported");
    if (r4.issues) throw new SearchParamError(JSON.stringify(r4.issues, void 0, 2), { cause: r4 });
    return r4.value;
  }
  return "parse" in e3 ? e3.parse(t3) : "function" == typeof e3 ? e3(t3) : {};
}
function routeNeedsPreload(e3) {
  var t3;
  for (const r4 of we) if (null == (t3 = e3.options[r4]) ? void 0 : t3.preload) return true;
  return false;
}
function CatchBoundary(e3) {
  const t3 = e3.errorComponent ?? ErrorComponent;
  return X2.jsx(CatchBoundaryImpl, { getResetKey: e3.getResetKey, onCatch: e3.onCatch, children: /* @__PURE__ */ __name(({ error: r4, reset: n3 }) => r4 ? W2.createElement(t3, { error: r4, reset: n3 }) : e3.children, "children") });
}
function ErrorComponent({ error: e3 }) {
  const [t3, r4] = W2.useState(false);
  return X2.jsxs("div", { style: { padding: ".5rem", maxWidth: "100%" }, children: [X2.jsxs("div", { style: { display: "flex", alignItems: "center", gap: ".5rem" }, children: [X2.jsx("strong", { style: { fontSize: "1rem" }, children: "Something went wrong!" }), X2.jsx("button", { style: { appearance: "none", fontSize: ".6em", border: "1px solid currentColor", padding: ".1rem .2rem", fontWeight: "bold", borderRadius: ".25rem" }, onClick: /* @__PURE__ */ __name(() => r4((e4) => !e4), "onClick"), children: t3 ? "Hide Error" : "Show Error" })] }), X2.jsx("div", { style: { height: ".25rem" } }), t3 ? X2.jsx("div", { children: X2.jsx("pre", { style: { fontSize: ".7em", border: "1px solid red", borderRadius: ".25rem", padding: ".3rem", color: "red", overflow: "auto" }, children: e3.message ? X2.jsx("code", { children: e3.message }) : null }) }) : null] });
}
function ClientOnly({ children: e3, fallback: t3 = null }) {
  return K2.useSyncExternalStore(subscribe, () => true, () => false) ? X2.jsx(K2.Fragment, { children: e3 }) : X2.jsx(K2.Fragment, { children: t3 });
}
function subscribe() {
  return () => {
  };
}
function shallow(e3, t3) {
  if (Object.is(e3, t3)) return true;
  if ("object" != typeof e3 || null === e3 || "object" != typeof t3 || null === t3) return false;
  if (e3 instanceof Map && t3 instanceof Map) {
    if (e3.size !== t3.size) return false;
    for (const [r5, n3] of e3) if (!t3.has(r5) || !Object.is(n3, t3.get(r5))) return false;
    return true;
  }
  if (e3 instanceof Set && t3 instanceof Set) {
    if (e3.size !== t3.size) return false;
    for (const r5 of e3) if (!t3.has(r5)) return false;
    return true;
  }
  if (e3 instanceof Date && t3 instanceof Date) return e3.getTime() === t3.getTime();
  const r4 = Object.keys(e3);
  if (r4.length !== Object.keys(t3).length) return false;
  for (let n3 = 0; n3 < r4.length; n3++) if (!Object.prototype.hasOwnProperty.call(t3, r4[n3]) || !Object.is(e3[r4[n3]], t3[r4[n3]])) return false;
  return true;
}
function getRouterContext() {
  return "undefined" == typeof document ? Le : window.__TSR_ROUTER_CONTEXT__ ? window.__TSR_ROUTER_CONTEXT__ : (window.__TSR_ROUTER_CONTEXT__ = Le, Le);
}
function useRouter(e3) {
  const t3 = W2.useContext(getRouterContext());
  return ee(!(((null == e3 ? void 0 : e3.warn) ?? 1) && !t3), "useRouter must be used inside a <RouterProvider> component!"), t3;
}
function useRouterState(e3) {
  const t3 = useRouter({ warn: void 0 === (null == e3 ? void 0 : e3.router) }), r4 = (null == e3 ? void 0 : e3.router) || t3, n3 = W2.useRef(void 0);
  return function(e4, t4 = (e5) => e5) {
    return je.useSyncExternalStoreWithSelector(e4.subscribe, () => e4.state, () => e4.state, t4, shallow);
  }(r4.__store, (t4) => {
    if (null == e3 ? void 0 : e3.select) {
      if (e3.structuralSharing ?? r4.options.defaultStructuralSharing) {
        const r5 = replaceEqualDeep(n3.current, e3.select(t4));
        return n3.current = r5, r5;
      }
      return e3.select(t4);
    }
    return t4;
  });
}
function useMatch(e3) {
  const t3 = W2.useContext(e3.from ? Be : De);
  return useRouterState({ select: /* @__PURE__ */ __name((r4) => {
    const n3 = r4.matches.find((r5) => e3.from ? e3.from === r5.routeId : r5.id === t3);
    if (invariant$1(!((e3.shouldThrow ?? 1) && !n3), e3.from && e3.from), void 0 !== n3) return e3.select ? e3.select(n3) : n3;
  }, "select"), structuralSharing: e3.structuralSharing });
}
function useLoaderData(e3) {
  return useMatch({ from: e3.from, strict: e3.strict, structuralSharing: e3.structuralSharing, select: /* @__PURE__ */ __name((t3) => e3.select ? e3.select(t3.loaderData) : t3.loaderData, "select") });
}
function useLoaderDeps(e3) {
  const { select: t3, ...r4 } = e3;
  return useMatch({ ...r4, select: /* @__PURE__ */ __name((e4) => t3 ? t3(e4.loaderDeps) : e4.loaderDeps, "select") });
}
function useParams(e3) {
  return useMatch({ from: e3.from, strict: e3.strict, shouldThrow: e3.shouldThrow, structuralSharing: e3.structuralSharing, select: /* @__PURE__ */ __name((t3) => e3.select ? e3.select(t3.params) : t3.params, "select") });
}
function useSearch(e3) {
  return useMatch({ from: e3.from, strict: e3.strict, shouldThrow: e3.shouldThrow, structuralSharing: e3.structuralSharing, select: /* @__PURE__ */ __name((t3) => e3.select ? e3.select(t3.search) : t3.search, "select") });
}
function useNavigate(e3) {
  const { navigate: t3, state: r4 } = useRouter(), n3 = useMatch({ strict: false, select: /* @__PURE__ */ __name((e4) => e4.index, "select") });
  return W2.useCallback((s4) => {
    const o5 = s4.from ?? (null == e3 ? void 0 : e3.from) ?? r4.matches[n3].fullPath;
    return t3({ ...s4, from: o5 });
  }, [null == e3 ? void 0 : e3.from, t3]);
}
function formatProdErrorMessage$1(e3) {
  var t3 = "https://react.dev/errors/" + e3;
  if (1 < arguments.length) {
    t3 += "?args[]=" + encodeURIComponent(arguments[1]);
    for (var r4 = 2; r4 < arguments.length; r4++) t3 += "&args[]=" + encodeURIComponent(arguments[r4]);
  }
  return "Minified React error #" + e3 + "; visit " + t3 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
function noop$4() {
}
function getCrossOriginStringAs(e3, t3) {
  return "font" === e3 ? "" : "string" == typeof t3 ? "use-credentials" === t3 ? t3 : "" : void 0;
}
function usePrevious(e3) {
  const t3 = W2.useRef({ value: e3, prev: null }), r4 = t3.current.value;
  return e3 !== r4 && (t3.current = { value: e3, prev: r4 }), t3.current.prev;
}
function useLinkProps(e3, t3) {
  const r4 = useRouter(), [n3, s4] = W2.useState(false), o5 = W2.useRef(false), a5 = function(e4) {
    const t4 = W2.useRef(null);
    return W2.useImperativeHandle(e4, () => t4.current, []), t4;
  }(t3), { activeProps: i5 = /* @__PURE__ */ __name(() => ({ className: "active" }), "i"), inactiveProps: l4 = /* @__PURE__ */ __name(() => ({}), "l"), activeOptions: u4, to: c4, preload: d4, preloadDelay: h4, hashScrollIntoView: p4, replace: f4, startTransition: m5, resetScroll: g3, viewTransition: y3, children: v3, target: b3, disabled: S4, style: k4, className: w4, onClick: C4, onFocus: x3, onMouseEnter: P4, onMouseLeave: R4, onTouchStart: T4, ignoreBlocker: $3, ...E4 } = e3, { params: F4, search: I4, hash: A4, state: _3, mask: M3, reloadDocument: O4, unsafeRelative: N4, ...j3 } = E4, L4 = W2.useMemo(() => {
    try {
      return new URL(`${c4}`), "external";
    } catch {
    }
    return "internal";
  }, [c4]), D4 = useRouterState({ select: /* @__PURE__ */ __name((e4) => e4.location.search, "select"), structuralSharing: true }), B3 = useMatch({ strict: false, select: /* @__PURE__ */ __name((e4) => e4.fullPath, "select") }), H3 = e3.from ?? B3;
  e3 = { ...e3, from: H3 };
  const z3 = W2.useMemo(() => r4.buildLocation(e3), [r4, e3, D4]), q3 = W2.useMemo(() => !e3.reloadDocument && (d4 ?? r4.options.defaultPreload), [r4.options.defaultPreload, d4, e3.reloadDocument]), U4 = h4 ?? r4.options.defaultPreloadDelay ?? 0, V4 = useRouterState({ select: /* @__PURE__ */ __name((e4) => {
    if (null == u4 ? void 0 : u4.exact) {
      if (!(t4 = e4.location.pathname, n4 = z3.pathname, s5 = r4.basepath, removeTrailingSlash(t4, s5) === removeTrailingSlash(n4, s5))) return false;
    } else {
      const t5 = removeTrailingSlash(e4.location.pathname, r4.basepath).split("/");
      if (!removeTrailingSlash(z3.pathname, r4.basepath).split("/").every((e5, r5) => e5 === t5[r5])) return false;
    }
    var t4, n4, s5;
    if ((null == u4 ? void 0 : u4.includeSearch) ?? 1) {
      if (!deepEqual(e4.location.search, z3.search, { partial: !(null == u4 ? void 0 : u4.exact), ignoreUndefined: !(null == u4 ? void 0 : u4.explicitUndefined) })) return false;
    }
    return !(null == u4 ? void 0 : u4.includeHash) || e4.location.hash === z3.hash;
  }, "select") }), K4 = W2.useCallback(() => {
    r4.preloadRoute(e3).catch((e4) => {
      console.warn(e4), console.warn("Error preloading route! \u261D\uFE0F");
    });
  }, [e3, r4]);
  if (function(e4, t4, r5 = {}, n4 = {}) {
    const s5 = W2.useRef("function" == typeof IntersectionObserver), o6 = W2.useRef(null);
    W2.useEffect(() => {
      if (e4.current && s5.current && !n4.disabled) return o6.current = new IntersectionObserver(([e5]) => {
        t4(e5);
      }, r5), o6.current.observe(e4.current), () => {
        var e5;
        null == (e5 = o6.current) || e5.disconnect();
      };
    }, [t4, r5, n4.disabled, e4]), o6.current;
  }(a5, W2.useCallback((e4) => {
    (null == e4 ? void 0 : e4.isIntersecting) && K4();
  }, [K4]), { rootMargin: "100px" }, { disabled: !(!S4 && "viewport" === q3) }), Ge(() => {
    o5.current || S4 || "render" !== q3 || (K4(), o5.current = true);
  }, [S4, K4, q3]), "external" === L4) return { ...j3, ref: a5, type: L4, href: c4, ...v3 && { children: v3 }, ...b3 && { target: b3 }, ...S4 && { disabled: S4 }, ...k4 && { style: k4 }, ...w4 && { className: w4 }, ...C4 && { onClick: C4 }, ...x3 && { onFocus: x3 }, ...P4 && { onMouseEnter: P4 }, ...R4 && { onMouseLeave: R4 }, ...T4 && { onTouchStart: T4 } };
  const handleFocus = /* @__PURE__ */ __name((e4) => {
    S4 || q3 && K4();
  }, "handleFocus"), Q3 = handleFocus, composeHandlers = /* @__PURE__ */ __name((e4) => (t4) => {
    var r5;
    null == (r5 = t4.persist) || r5.call(t4), e4.filter(Boolean).forEach((e5) => {
      t4.defaultPrevented || e5(t4);
    });
  }, "composeHandlers"), G3 = V4 ? functionalUpdate(i5, {}) ?? {} : {}, J3 = V4 ? {} : functionalUpdate(l4, {}), Y4 = [w4, G3.className, J3.className].filter(Boolean).join(" "), X4 = { ...k4, ...G3.style, ...J3.style };
  return { ...j3, ...G3, ...J3, href: S4 ? void 0 : z3.maskedLocation ? r4.history.createHref(z3.maskedLocation.href) : r4.history.createHref(z3.href), ref: a5, onClick: composeHandlers([C4, (t4) => {
    if (!(S4 || function(e4) {
      return !!(e4.metaKey || e4.altKey || e4.ctrlKey || e4.shiftKey);
    }(t4) || t4.defaultPrevented || b3 && "_self" !== b3 || 0 !== t4.button)) {
      t4.preventDefault(), Ke.flushSync(() => {
        s4(true);
      });
      const n4 = r4.subscribe("onResolved", () => {
        n4(), s4(false);
      });
      return r4.navigate({ ...e3, replace: f4, resetScroll: g3, hashScrollIntoView: p4, startTransition: m5, viewTransition: y3, ignoreBlocker: $3 });
    }
  }]), onFocus: composeHandlers([x3, handleFocus]), onMouseEnter: composeHandlers([P4, (e4) => {
    if (S4) return;
    const t4 = e4.target || {};
    if (q3) {
      if (t4.preloadTimeout) return;
      U4 ? t4.preloadTimeout = setTimeout(() => {
        t4.preloadTimeout = null, K4();
      }, U4) : K4();
    }
  }]), onMouseLeave: composeHandlers([R4, (e4) => {
    if (S4) return;
    const t4 = e4.target || {};
    t4.preloadTimeout && (clearTimeout(t4.preloadTimeout), t4.preloadTimeout = null);
  }]), onTouchStart: composeHandlers([T4, Q3]), disabled: !!S4, target: b3, ...Object.keys(X4).length && { style: X4 }, ...Y4 && { className: Y4 }, ...S4 && { role: "link", "aria-disabled": true }, ...V4 && { "data-status": "active", "aria-current": "page" }, ...n3 && { "data-transitioning": "transitioning" } };
}
function createFileRoute(e3) {
  return "object" == typeof e3 ? new FileRoute(e3, { silent: true }).createRoute(e3) : new FileRoute(e3, { silent: true }).createRoute;
}
function Transitioner() {
  const e3 = useRouter(), t3 = W2.useRef({ router: e3, mounted: false }), [r4, n3] = W2.useState(false), { hasPendingMatches: s4, isLoading: o5 } = useRouterState({ select: /* @__PURE__ */ __name((e4) => ({ isLoading: e4.isLoading, hasPendingMatches: e4.matches.some((e5) => "pending" === e5.status) }), "select"), structuralSharing: true }), a5 = usePrevious(o5), i5 = o5 || r4 || s4, l4 = usePrevious(i5), u4 = o5 || s4, c4 = usePrevious(u4);
  return e3.startTransition = (e4) => {
    n3(true), W2.startTransition(() => {
      e4(), n3(false);
    });
  }, W2.useEffect(() => {
    const t4 = e3.history.subscribe(e3.load), r5 = e3.buildLocation({ to: e3.latestLocation.pathname, search: true, params: true, hash: true, state: true, _includeValidateSearch: true });
    return trimPathRight$1(e3.latestLocation.href) !== trimPathRight$1(r5.href) && e3.commitLocation({ ...r5, replace: true }), () => {
      t4();
    };
  }, [e3, e3.history]), Ge(() => {
    if (t3.current.router === e3 && t3.current.mounted) return;
    t3.current = { router: e3, mounted: true };
    (async () => {
      try {
        await e3.load();
      } catch (e4) {
        console.error(e4);
      }
    })();
  }, [e3]), Ge(() => {
    a5 && !o5 && e3.emit({ type: "onLoad", ...getLocationChangeInfo(e3.state) });
  }, [a5, e3, o5]), Ge(() => {
    c4 && !u4 && e3.emit({ type: "onBeforeRouteMount", ...getLocationChangeInfo(e3.state) });
  }, [u4, c4, e3]), Ge(() => {
    l4 && !i5 && (e3.emit({ type: "onResolved", ...getLocationChangeInfo(e3.state) }), e3.__store.setState((e4) => ({ ...e4, status: "idle", resolvedLocation: e4.location })), function(e4) {
      if ("undefined" != typeof document && document.querySelector) {
        const t4 = e4.state.location.state.__hashScrollIntoViewOptions ?? true;
        if (t4 && "" !== e4.state.location.hash) {
          const r5 = document.getElementById(e4.state.location.hash);
          r5 && r5.scrollIntoView(t4);
        }
      }
    }(e3));
  }, [i5, l4, e3]), null;
}
function CatchNotFound(e3) {
  const t3 = useRouterState({ select: /* @__PURE__ */ __name((e4) => `not-found-${e4.location.pathname}-${e4.status}`, "select") });
  return X2.jsx(CatchBoundary, { getResetKey: /* @__PURE__ */ __name(() => t3, "getResetKey"), onCatch: /* @__PURE__ */ __name((t4, r4) => {
    var n3;
    if (!isNotFound$1(t4)) throw t4;
    null == (n3 = e3.onCatch) || n3.call(e3, t4, r4);
  }, "onCatch"), errorComponent: /* @__PURE__ */ __name(({ error: t4 }) => {
    var r4;
    if (isNotFound$1(t4)) return null == (r4 = e3.fallback) ? void 0 : r4.call(e3, t4);
    throw t4;
  }, "errorComponent"), children: e3.children });
}
function DefaultGlobalNotFound() {
  return X2.jsx("p", { children: "Not Found" });
}
function SafeFragment(e3) {
  return X2.jsx(X2.Fragment, { children: e3.children });
}
function renderRouteNotFound(e3, t3, r4) {
  return t3.options.notFoundComponent ? X2.jsx(t3.options.notFoundComponent, { data: r4 }) : e3.options.defaultNotFoundComponent ? X2.jsx(e3.options.defaultNotFoundComponent, { data: r4 }) : X2.jsx(DefaultGlobalNotFound, {});
}
function ScriptOnce({ children: e3 }) {
  return "undefined" != typeof document ? null : X2.jsx("script", { className: "$tsr", dangerouslySetInnerHTML: { __html: [e3].filter(Boolean).join("\n") } });
}
function ScrollRestoration() {
  const e3 = useRouter(), t3 = (e3.options.getScrollRestorationKey || defaultGetScrollRestorationKey)(e3.latestLocation), r4 = t3 !== defaultGetScrollRestorationKey(e3.latestLocation) ? t3 : null;
  return e3.isScrollRestoring && e3.isServer ? X2.jsx(ScriptOnce, { children: `(${restoreScroll.toString()})(${JSON.stringify(me)},${JSON.stringify(r4)}, undefined, true)` }) : null;
}
function OnRendered() {
  const e3 = useRouter(), t3 = W2.useRef(void 0);
  return X2.jsx("script", { suppressHydrationWarning: true, ref: /* @__PURE__ */ __name((r4) => {
    !r4 || void 0 !== t3.current && t3.current.href === e3.latestLocation.href || (e3.emit({ type: "onRendered", ...getLocationChangeInfo(e3.state) }), t3.current = e3.latestLocation);
  }, "ref") }, e3.latestLocation.state.__TSR_key);
}
function Matches() {
  const e3 = useRouter(), t3 = e3.options.defaultPendingComponent ? X2.jsx(e3.options.defaultPendingComponent, {}) : null, r4 = e3.isServer || "undefined" != typeof document && e3.ssr ? SafeFragment : W2.Suspense, n3 = X2.jsxs(r4, { fallback: t3, children: [!e3.isServer && X2.jsx(Transitioner, {}), X2.jsx(MatchesInner, {})] });
  return e3.options.InnerWrap ? X2.jsx(e3.options.InnerWrap, { children: n3 }) : n3;
}
function MatchesInner() {
  const e3 = useRouterState({ select: /* @__PURE__ */ __name((e4) => {
    var t4;
    return null == (t4 = e4.matches[0]) ? void 0 : t4.id;
  }, "select") }), t3 = useRouterState({ select: /* @__PURE__ */ __name((e4) => e4.loadedAt, "select") });
  return X2.jsx(De.Provider, { value: e3, children: X2.jsx(CatchBoundary, { getResetKey: /* @__PURE__ */ __name(() => t3, "getResetKey"), errorComponent: ErrorComponent, onCatch: /* @__PURE__ */ __name((e4) => {
    ee(false, "The following error wasn't caught by any route! At the very least, consider setting an 'errorComponent' in your RootRoute!"), ee(false, e4.message || e4.toString());
  }, "onCatch"), children: e3 ? X2.jsx(Xe, { matchId: e3 }) : null }) });
}
function RouterContextProvider({ router: e3, children: t3, ...r4 }) {
  Object.keys(r4).length > 0 && e3.update({ ...e3.options, ...r4, context: { ...e3.options.context, ...r4.context } });
  const n3 = getRouterContext(), s4 = X2.jsx(n3.Provider, { value: e3, children: t3 });
  return e3.options.Wrap ? X2.jsx(e3.options.Wrap, { children: s4 }) : s4;
}
function RouterProvider({ router: e3, ...t3 }) {
  return X2.jsx(RouterContextProvider, { router: e3, ...t3, children: X2.jsx(Matches, {}) });
}
function Asset({ tag: e3, attrs: t3, children: r4 }) {
  switch (e3) {
    case "title":
      return X2.jsx("title", { ...t3, suppressHydrationWarning: true, children: r4 });
    case "meta":
      return X2.jsx("meta", { ...t3, suppressHydrationWarning: true });
    case "link":
      return X2.jsx("link", { ...t3, suppressHydrationWarning: true });
    case "style":
      return X2.jsx("style", { ...t3, dangerouslySetInnerHTML: { __html: r4 } });
    case "script":
      return X2.jsx(Script, { attrs: t3, children: r4 });
    default:
      return null;
  }
}
function Script({ attrs: e3, children: t3 }) {
  return W2.useEffect(() => {
    if (null == e3 ? void 0 : e3.src) {
      const t4 = document.createElement("script");
      for (const [r4, n3] of Object.entries(e3)) "suppressHydrationWarning" !== r4 && void 0 !== n3 && false !== n3 && t4.setAttribute(r4, "boolean" == typeof n3 ? "" : String(n3));
      return document.head.appendChild(t4), () => {
        t4.parentNode && t4.parentNode.removeChild(t4);
      };
    }
    if ("string" == typeof t3) {
      const r4 = document.createElement("script");
      if (r4.textContent = t3, e3) for (const [t4, n3] of Object.entries(e3)) "suppressHydrationWarning" !== t4 && void 0 !== n3 && false !== n3 && r4.setAttribute(t4, "boolean" == typeof n3 ? "" : String(n3));
      return document.head.appendChild(r4), () => {
        r4.parentNode && r4.parentNode.removeChild(r4);
      };
    }
  }, [e3, t3]), (null == e3 ? void 0 : e3.src) && "string" == typeof e3.src ? X2.jsx("script", { ...e3, suppressHydrationWarning: true }) : "string" == typeof t3 ? X2.jsx("script", { ...e3, dangerouslySetInnerHTML: { __html: t3 }, suppressHydrationWarning: true }) : null;
}
function HeadContent() {
  return useTags().map((e3) => W2.createElement(Asset, { ...e3, key: `tsr-meta-${JSON.stringify(e3)}` }));
}
function routerWithQueryClient(e3, t3, r4) {
  const n3 = e3.options;
  if (e3.options = { ...e3.options, context: { ...n3.context, queryClient: t3 }, Wrap: /* @__PURE__ */ __name(({ children: e4 }) => {
    const r5 = W2.Fragment, s4 = n3.Wrap || W2.Fragment;
    return X2.jsx(r5, { children: X2.jsx(QueryClientProvider, { client: t3, children: X2.jsx(s4, { children: e4 }) }) });
  }, "Wrap") }, e3.isServer) {
    const r5 = function() {
      let e4;
      const t4 = new ReadableStream({ start(t5) {
        e4 = t5;
      } });
      let r6 = false;
      return { stream: t4, enqueue: /* @__PURE__ */ __name((t5) => e4.enqueue(t5), "enqueue"), close: /* @__PURE__ */ __name(() => {
        e4.close(), r6 = true;
      }, "close"), isClosed: /* @__PURE__ */ __name(() => r6, "isClosed"), error: /* @__PURE__ */ __name((t5) => e4.error(t5), "error") };
    }();
    e3.options.dehydrate = async () => {
      var s5;
      const o5 = await (null == (s5 = n3.dehydrate) ? void 0 : s5.call(n3)), a5 = dehydrate(t3);
      e3.serverSsr.onRenderFinished(() => r5.close());
      return { ...o5, dehydratedQueryClient: a5, queryStream: r5.stream };
    };
    const s4 = t3.getDefaultOptions();
    t3.setDefaultOptions({ ...s4, dehydrate: { shouldDehydrateQuery: /* @__PURE__ */ __name(() => true, "shouldDehydrateQuery"), ...s4.dehydrate } }), t3.getQueryCache().subscribe((n4) => {
      if ("added" === n4.type) {
        if (!e3.serverSsr.isDehydrated()) return;
        if (r5.isClosed()) return void console.warn(`tried to stream query ${n4.query.queryHash} after stream was already closed`);
        r5.enqueue(dehydrate(t3, { shouldDehydrateQuery: /* @__PURE__ */ __name((e4) => {
          var t4, r6;
          return e4.queryHash === n4.query.queryHash && ((null == (r6 = null == (t4 = s4.dehydrate) ? void 0 : t4.shouldDehydrateQuery) ? void 0 : r6.call(t4, e4)) ?? true);
        }, "shouldDehydrateQuery") }));
      }
    });
  } else {
    e3.options.hydrate = async (e4) => {
      var r5;
      await (null == (r5 = n3.hydrate) ? void 0 : r5.call(n3, e4)), hydrate(t3, e4.dehydratedQueryClient);
      const s4 = e4.queryStream.getReader();
      s4.read().then(/* @__PURE__ */ __name(async function handle({ done: e5, value: r6 }) {
        if (hydrate(t3, r6), e5) return;
        return handle(await s4.read());
      }, "handle")).catch((e5) => {
        console.error("Error reading query stream:", e5);
      });
    };
    {
      const r5 = t3.getMutationCache().config;
      t3.getMutationCache().config = { ...r5, onError: /* @__PURE__ */ __name((t4, n5, s4, o5) => {
        var a5;
        return isRedirect$1(t4) ? (t4.options._fromLocation = e3.state.location, e3.navigate(e3.resolveRedirect(t4).options)) : null == (a5 = r5.onError) ? void 0 : a5.call(r5, t4, n5, s4, o5);
      }, "onError") };
      const n4 = t3.getQueryCache().config;
      t3.getQueryCache().config = { ...n4, onError: /* @__PURE__ */ __name((t4, r6) => {
        var s4;
        return isRedirect$1(t4) ? (t4.options._fromLocation = e3.state.location, e3.navigate(e3.resolveRedirect(t4).options)) : null == (s4 = n4.onError) ? void 0 : s4.call(n4, t4, r6);
      }, "onError") };
    }
  }
  return e3;
}
function isAction(e3) {
  return void 0 !== e3.label;
}
function cn(...e3) {
  return e3.filter(Boolean).join(" ");
}
function getDocumentDirection() {
  return "ltr";
}
function assignOffset(e3, t3) {
  const r4 = {};
  return [e3, t3].forEach((e4, t4) => {
    const n3 = 1 === t4, s4 = n3 ? "--mobile-offset" : "--offset", o5 = n3 ? "16px" : "24px";
    function assignAll(e5) {
      ["top", "right", "bottom", "left"].forEach((t5) => {
        r4[`${s4}-${t5}`] = "number" == typeof e5 ? `${e5}px` : e5;
      });
    }
    __name(assignAll, "assignAll");
    "number" == typeof e4 || "string" == typeof e4 ? assignAll(e4) : "object" == typeof e4 ? ["top", "right", "bottom", "left"].forEach((t5) => {
      void 0 === e4[t5] ? r4[`${s4}-${t5}`] = o5 : r4[`${s4}-${t5}`] = "number" == typeof e4[t5] ? `${e4[t5]}px` : e4[t5];
    }) : assignAll(o5);
  }), r4;
}
function transformStreamWithRouter(e3, t3) {
  const r4 = function() {
    let e4;
    const t4 = new TextEncoder(), r5 = { stream: new a3({ start(t5) {
      e4 = t5;
    } }), write: /* @__PURE__ */ __name((r6) => {
      e4.enqueue(t4.encode(r6));
    }, "write"), end: /* @__PURE__ */ __name((n4) => {
      n4 && e4.enqueue(t4.encode(n4)), e4.close(), r5.destroyed = true;
    }, "end"), destroy: /* @__PURE__ */ __name((t5) => {
      e4.error(t5);
    }, "destroy"), destroyed: false };
    return r5;
  }();
  let n3 = true, s4 = "", o5 = "", i5 = false, l4 = false, u4 = "", c4 = "";
  function getBufferedRouterStream() {
    const e4 = s4;
    return s4 = "", e4;
  }
  __name(getBufferedRouterStream, "getBufferedRouterStream");
  const d4 = createControlledPromise$1();
  let h4 = 0;
  e3.serverSsr.injectedHtml.forEach((e4) => {
    handleInjectedHtml(e4);
  });
  const p4 = e3.subscribe("onInjectedHtml", (e4) => {
    handleInjectedHtml(e4.promise);
  });
  function handleInjectedHtml(e4) {
    h4++, e4.then((e5) => {
      i5 ? r4.write(e5) : s4 += e5;
    }).catch(d4.reject).finally(() => {
      h4--, n3 || 0 !== h4 || (p4(), d4.resolve());
    });
  }
  __name(handleInjectedHtml, "handleInjectedHtml");
  return d4.then(() => {
    const e4 = c4 + getBufferedRouterStream() + o5;
    r4.end(e4);
  }).catch((e4) => {
    console.error("Error reading routerStream:", e4), r4.destroy(e4);
  }), async function(e4, t4) {
    var r5, n4, s5;
    try {
      const s6 = e4.getReader();
      let o6;
      for (; !(o6 = await s6.read()).done; ) null == (r5 = t4.onData) || r5.call(t4, o6);
      null == (n4 = t4.onEnd) || n4.call(t4);
    } catch (e5) {
      null == (s5 = t4.onError) || s5.call(t4, e5);
    }
  }(t3, { onData: /* @__PURE__ */ __name((e4) => {
    const t4 = function(e5) {
      return e5 instanceof Uint8Array ? yt.decode(e5) : String(e5);
    }(e4.value);
    let n4 = u4 + t4;
    const s5 = n4.match(pt), a5 = n4.match(ft);
    if (!i5) {
      n4.match(ht) && (i5 = true);
    }
    if (!l4) {
      const e5 = n4.match(mt);
      if (e5) {
        l4 = true;
        const t5 = e5.index, s6 = e5[0], o6 = n4.slice(t5 + s6.length);
        r4.write(n4.slice(0, t5) + s6 + getBufferedRouterStream()), n4 = o6;
      }
    }
    if (!i5) return r4.write(n4), void (u4 = "");
    if (s5 && a5 && s5.index < a5.index) {
      const e5 = s5.index;
      return o5 = n4.slice(e5), r4.write(n4.slice(0, e5) + getBufferedRouterStream()), void (u4 = "");
    }
    let d5, h5 = 0;
    for (; null !== (d5 = gt.exec(n4)); ) h5 = d5.index + d5[0].length;
    if (h5 > 0) {
      const e5 = n4.slice(0, h5) + getBufferedRouterStream() + c4;
      r4.write(e5), u4 = n4.slice(h5);
    } else u4 = n4, c4 += getBufferedRouterStream();
  }, "onData"), onEnd: /* @__PURE__ */ __name(() => {
    n3 = false, e3.serverSsr.setRenderFinished(), 0 === h4 && d4.resolve();
  }, "onEnd"), onError: /* @__PURE__ */ __name((e4) => {
    console.error("Error reading appStream:", e4), r4.destroy(e4);
  }, "onError") }), r4.stream;
}
function murmurhash3_32_gc$1(e3, t3) {
  var r4 = 3 & e3.length, n3 = e3.length - r4, s4 = t3;
  for (t3 = 0; t3 < n3; ) {
    var o5 = 255 & e3.charCodeAt(t3) | (255 & e3.charCodeAt(++t3)) << 8 | (255 & e3.charCodeAt(++t3)) << 16 | (255 & e3.charCodeAt(++t3)) << 24;
    ++t3, s4 = 27492 + (65535 & (s4 = 5 * (65535 & (s4 = (s4 ^= o5 = 461845907 * (65535 & (o5 = (o5 = 3432918353 * (65535 & o5) + ((3432918353 * (o5 >>> 16) & 65535) << 16) & 4294967295) << 15 | o5 >>> 17)) + ((461845907 * (o5 >>> 16) & 65535) << 16) & 4294967295) << 13 | s4 >>> 19)) + ((5 * (s4 >>> 16) & 65535) << 16) & 4294967295)) + (((s4 >>> 16) + 58964 & 65535) << 16);
  }
  switch (o5 = 0, r4) {
    case 3:
      o5 ^= (255 & e3.charCodeAt(t3 + 2)) << 16;
    case 2:
      o5 ^= (255 & e3.charCodeAt(t3 + 1)) << 8;
    case 1:
      s4 ^= 461845907 * (65535 & (o5 = (o5 = 3432918353 * (65535 & (o5 ^= 255 & e3.charCodeAt(t3))) + ((3432918353 * (o5 >>> 16) & 65535) << 16) & 4294967295) << 15 | o5 >>> 17)) + ((461845907 * (o5 >>> 16) & 65535) << 16) & 4294967295;
  }
  return s4 ^= e3.length, s4 = 2246822507 * (65535 & (s4 ^= s4 >>> 16)) + ((2246822507 * (s4 >>> 16) & 65535) << 16) & 4294967295, ((s4 = 3266489909 * (65535 & (s4 ^= s4 >>> 13)) + ((3266489909 * (s4 >>> 16) & 65535) << 16) & 4294967295) ^ s4 >>> 16) >>> 0;
}
function handleErrorInNextTick(e3) {
  setTimeout(function() {
    throw e3;
  });
}
function writeChunk(e3, t3) {
  if (0 !== t3.byteLength) if (2048 < t3.byteLength) 0 < Vt && (e3.enqueue(new Uint8Array(Ut.buffer, 0, Vt)), Ut = new Uint8Array(2048), Vt = 0), e3.enqueue(t3);
  else {
    var r4 = Ut.length - Vt;
    r4 < t3.byteLength && (0 === r4 ? e3.enqueue(Ut) : (Ut.set(t3.subarray(0, r4), Vt), e3.enqueue(Ut), t3 = t3.subarray(r4)), Ut = new Uint8Array(2048), Vt = 0), Ut.set(t3, Vt), Vt += t3.byteLength;
  }
}
function writeChunkAndReturn(e3, t3) {
  return writeChunk(e3, t3), true;
}
function completeWriting(e3) {
  Ut && 0 < Vt && (e3.enqueue(new Uint8Array(Ut.buffer, 0, Vt)), Ut = null, Vt = 0);
}
function stringToChunk(e3) {
  return Wt.encode(e3);
}
function stringToPrecomputedChunk(e3) {
  return Wt.encode(e3);
}
function closeWithError(e3, t3) {
  "function" == typeof e3.error ? e3.error(t3) : e3.close();
}
function isAttributeNameSafe$1(e3) {
  return !!Qt.call(Yt, e3) || !Qt.call(Jt, e3) && (Gt.test(e3) ? Yt[e3] = true : (Jt[e3] = true, false));
}
function escapeTextForBrowser$1(e3) {
  if ("boolean" == typeof e3 || "number" == typeof e3 || "bigint" == typeof e3) return "" + e3;
  e3 = "" + e3;
  var t3 = er.exec(e3);
  if (t3) {
    var r4, n3 = "", s4 = 0;
    for (r4 = t3.index; r4 < e3.length; r4++) {
      switch (e3.charCodeAt(r4)) {
        case 34:
          t3 = "&quot;";
          break;
        case 38:
          t3 = "&amp;";
          break;
        case 39:
          t3 = "&#x27;";
          break;
        case 60:
          t3 = "&lt;";
          break;
        case 62:
          t3 = "&gt;";
          break;
        default:
          continue;
      }
      s4 !== r4 && (n3 += e3.slice(s4, r4)), s4 = r4 + 1, n3 += t3;
    }
    e3 = s4 !== r4 ? n3 + e3.slice(s4, r4) : n3;
  }
  return e3;
}
function sanitizeURL$1(e3) {
  return nr.test("" + e3) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e3;
}
function scriptReplacer$1(e3, t3, r4, n3) {
  return t3 + ("s" === r4 ? "\\u0073" : "\\u0053") + n3;
}
function createRenderState$1(e3, t3, r4, n3, s4, o5) {
  var a5 = void 0 === t3 ? ur : stringToPrecomputedChunk('<script nonce="' + escapeTextForBrowser$1(t3) + '">'), i5 = e3.idPrefix;
  r4 = [];
  var l4 = e3.bootstrapScriptContent, u4 = e3.bootstrapScripts, c4 = e3.bootstrapModules;
  if (void 0 !== l4 && r4.push(a5, stringToChunk(("" + l4).replace(yr, scriptReplacer$1)), cr), l4 = [], void 0 !== n3 && (l4.push(vr), l4.push(stringToChunk(("" + JSON.stringify(n3)).replace(yr, scriptReplacer$1))), l4.push(br)), n3 = s4 ? { preconnects: "", fontPreloads: "", highImagePreloads: "", remainingCapacity: 2 + ("number" == typeof o5 ? o5 : 2e3) } : null, s4 = { placeholderPrefix: stringToPrecomputedChunk(i5 + "P:"), segmentPrefix: stringToPrecomputedChunk(i5 + "S:"), boundaryPrefix: stringToPrecomputedChunk(i5 + "B:"), startInlineScript: a5, preamble: { htmlChunks: null, headChunks: null, bodyChunks: null, contribution: 0 }, externalRuntimeScript: null, bootstrapChunks: r4, importMapChunks: l4, onHeaders: s4, headers: n3, resets: { font: {}, dns: {}, connect: { default: {}, anonymous: {}, credentials: {} }, image: {}, style: {} }, charsetChunks: [], viewportChunks: [], hoistableChunks: [], preconnects: /* @__PURE__ */ new Set(), fontPreloads: /* @__PURE__ */ new Set(), highImagePreloads: /* @__PURE__ */ new Set(), styles: /* @__PURE__ */ new Map(), bootstrapScripts: /* @__PURE__ */ new Set(), scripts: /* @__PURE__ */ new Set(), bulkPreloads: /* @__PURE__ */ new Set(), preloads: { images: /* @__PURE__ */ new Map(), stylesheets: /* @__PURE__ */ new Map(), scripts: /* @__PURE__ */ new Map(), moduleScripts: /* @__PURE__ */ new Map() }, nonce: t3, hoistableState: null, stylesToHoist: false }, void 0 !== u4) for (n3 = 0; n3 < u4.length; n3++) {
    var d4 = u4[n3];
    i5 = a5 = void 0, l4 = { rel: "preload", as: "script", fetchPriority: "low", nonce: t3 }, "string" == typeof d4 ? l4.href = o5 = d4 : (l4.href = o5 = d4.src, l4.integrity = i5 = "string" == typeof d4.integrity ? d4.integrity : void 0, l4.crossOrigin = a5 = "string" == typeof d4 || null == d4.crossOrigin ? void 0 : "use-credentials" === d4.crossOrigin ? "use-credentials" : "");
    var h4 = o5;
    (d4 = e3).scriptResources[h4] = null, d4.moduleScriptResources[h4] = null, pushLinkImpl$1(d4 = [], l4), s4.bootstrapScripts.add(d4), r4.push(dr, stringToChunk(escapeTextForBrowser$1(o5))), t3 && r4.push(pr, stringToChunk(escapeTextForBrowser$1(t3))), "string" == typeof i5 && r4.push(fr, stringToChunk(escapeTextForBrowser$1(i5))), "string" == typeof a5 && r4.push(mr, stringToChunk(escapeTextForBrowser$1(a5))), r4.push(gr);
  }
  if (void 0 !== c4) for (u4 = 0; u4 < c4.length; u4++) a5 = o5 = void 0, i5 = { rel: "modulepreload", fetchPriority: "low", nonce: t3 }, "string" == typeof (l4 = c4[u4]) ? i5.href = n3 = l4 : (i5.href = n3 = l4.src, i5.integrity = a5 = "string" == typeof l4.integrity ? l4.integrity : void 0, i5.crossOrigin = o5 = "string" == typeof l4 || null == l4.crossOrigin ? void 0 : "use-credentials" === l4.crossOrigin ? "use-credentials" : ""), d4 = n3, (l4 = e3).scriptResources[d4] = null, l4.moduleScriptResources[d4] = null, pushLinkImpl$1(l4 = [], i5), s4.bootstrapScripts.add(l4), r4.push(hr, stringToChunk(escapeTextForBrowser$1(n3))), t3 && r4.push(pr, stringToChunk(escapeTextForBrowser$1(t3))), "string" == typeof a5 && r4.push(fr, stringToChunk(escapeTextForBrowser$1(a5))), "string" == typeof o5 && r4.push(mr, stringToChunk(escapeTextForBrowser$1(o5))), r4.push(gr);
  return s4;
}
function createResumableState$1(e3, t3, r4, n3, s4) {
  return { idPrefix: void 0 === e3 ? "" : e3, nextFormID: 0, streamingFormat: 0, bootstrapScriptContent: r4, bootstrapScripts: n3, bootstrapModules: s4, instructions: 0, hasBody: false, hasHtml: false, unknownResources: {}, dnsResources: {}, connectResources: { default: {}, anonymous: {}, credentials: {} }, imageResources: {}, styleResources: {}, scriptResources: {}, moduleUnknownResources: {}, moduleScriptResources: {} };
}
function createPreambleState$1() {
  return { htmlChunks: null, headChunks: null, bodyChunks: null, contribution: 0 };
}
function createFormatContext$1(e3, t3, r4) {
  return { insertionMode: e3, selectedValue: t3, tagScope: r4 };
}
function createRootFormatContext(e3) {
  return createFormatContext$1("http://www.w3.org/2000/svg" === e3 ? 4 : "http://www.w3.org/1998/Math/MathML" === e3 ? 5 : 0, null, 0);
}
function getChildFormatContext$1(e3, t3, r4) {
  switch (t3) {
    case "noscript":
      return createFormatContext$1(2, null, 1 | e3.tagScope);
    case "select":
      return createFormatContext$1(2, null != r4.value ? r4.value : r4.defaultValue, e3.tagScope);
    case "svg":
      return createFormatContext$1(4, null, e3.tagScope);
    case "picture":
      return createFormatContext$1(2, null, 2 | e3.tagScope);
    case "math":
      return createFormatContext$1(5, null, e3.tagScope);
    case "foreignObject":
      return createFormatContext$1(2, null, e3.tagScope);
    case "table":
      return createFormatContext$1(6, null, e3.tagScope);
    case "thead":
    case "tbody":
    case "tfoot":
      return createFormatContext$1(7, null, e3.tagScope);
    case "colgroup":
      return createFormatContext$1(9, null, e3.tagScope);
    case "tr":
      return createFormatContext$1(8, null, e3.tagScope);
    case "head":
      if (2 > e3.insertionMode) return createFormatContext$1(3, null, e3.tagScope);
      break;
    case "html":
      if (0 === e3.insertionMode) return createFormatContext$1(1, null, e3.tagScope);
  }
  return 6 <= e3.insertionMode || 2 > e3.insertionMode ? createFormatContext$1(2, null, e3.tagScope) : e3;
}
function pushTextInstance$1(e3, t3, r4, n3) {
  return "" === t3 ? n3 : (n3 && e3.push(Sr), e3.push(stringToChunk(escapeTextForBrowser$1(t3))), true);
}
function pushStyleAttribute$1(e3, t3) {
  if ("object" != typeof t3) throw Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
  var r4, n3 = true;
  for (r4 in t3) if (Qt.call(t3, r4)) {
    var s4 = t3[r4];
    if (null != s4 && "boolean" != typeof s4 && "" !== s4) {
      if (0 === r4.indexOf("--")) {
        var o5 = stringToChunk(escapeTextForBrowser$1(r4));
        s4 = stringToChunk(escapeTextForBrowser$1(("" + s4).trim()));
      } else void 0 === (o5 = kr.get(r4)) && (o5 = stringToPrecomputedChunk(escapeTextForBrowser$1(r4.replace(tr, "-$1").toLowerCase().replace(rr, "-ms-"))), kr.set(r4, o5)), s4 = "number" == typeof s4 ? 0 === s4 || Xt.has(r4) ? stringToChunk("" + s4) : stringToChunk(s4 + "px") : stringToChunk(escapeTextForBrowser$1(("" + s4).trim()));
      n3 ? (n3 = false, e3.push(wr, o5, Cr, s4)) : e3.push(xr, o5, Cr, s4);
    }
  }
  n3 || e3.push(Tr);
}
function pushBooleanAttribute$1(e3, t3, r4) {
  r4 && "function" != typeof r4 && "symbol" != typeof r4 && e3.push(Pr, stringToChunk(t3), $r);
}
function pushStringAttribute$1(e3, t3, r4) {
  "function" != typeof r4 && "symbol" != typeof r4 && "boolean" != typeof r4 && e3.push(Pr, stringToChunk(t3), Rr, stringToChunk(escapeTextForBrowser$1(r4)), Tr);
}
function pushAdditionalFormField$1(e3, t3) {
  this.push(Fr), validateAdditionalFormField$1(e3), pushStringAttribute$1(this, "name", t3), pushStringAttribute$1(this, "value", e3), this.push(Ar);
}
function validateAdditionalFormField$1(e3) {
  if ("string" != typeof e3) throw Error("File/Blob fields are not yet supported in progressive forms. Will fallback to client hydration.");
}
function getCustomFormFields$1(e3, t3) {
  if ("function" == typeof t3.$$FORM_ACTION) {
    var r4 = e3.nextFormID++;
    e3 = e3.idPrefix + r4;
    try {
      var n3 = t3.$$FORM_ACTION(e3);
      if (n3) {
        var s4 = n3.data;
        null != s4 && s4.forEach(validateAdditionalFormField$1);
      }
      return n3;
    } catch (e4) {
      if ("object" == typeof e4 && null !== e4 && "function" == typeof e4.then) throw e4;
    }
  }
  return null;
}
function pushFormActionAttribute$1(e3, t3, r4, n3, s4, o5, a5, i5) {
  var l4 = null;
  if ("function" == typeof n3) {
    var u4 = getCustomFormFields$1(t3, n3);
    null !== u4 ? (i5 = u4.name, n3 = u4.action || "", s4 = u4.encType, o5 = u4.method, a5 = u4.target, l4 = u4.data) : (e3.push(Pr, stringToChunk("formAction"), Rr, Er, Tr), a5 = o5 = s4 = n3 = i5 = null, injectFormReplayingRuntime$1(t3, r4));
  }
  return null != i5 && pushAttribute$1(e3, "name", i5), null != n3 && pushAttribute$1(e3, "formAction", n3), null != s4 && pushAttribute$1(e3, "formEncType", s4), null != o5 && pushAttribute$1(e3, "formMethod", o5), null != a5 && pushAttribute$1(e3, "formTarget", a5), l4;
}
function pushAttribute$1(e3, t3, r4) {
  switch (t3) {
    case "className":
      pushStringAttribute$1(e3, "class", r4);
      break;
    case "tabIndex":
      pushStringAttribute$1(e3, "tabindex", r4);
      break;
    case "dir":
    case "role":
    case "viewBox":
    case "width":
    case "height":
      pushStringAttribute$1(e3, t3, r4);
      break;
    case "style":
      pushStyleAttribute$1(e3, r4);
      break;
    case "src":
    case "href":
      if ("" === r4) break;
    case "action":
    case "formAction":
      if (null == r4 || "function" == typeof r4 || "symbol" == typeof r4 || "boolean" == typeof r4) break;
      r4 = sanitizeURL$1("" + r4), e3.push(Pr, stringToChunk(t3), Rr, stringToChunk(escapeTextForBrowser$1(r4)), Tr);
      break;
    case "defaultValue":
    case "defaultChecked":
    case "innerHTML":
    case "suppressContentEditableWarning":
    case "suppressHydrationWarning":
    case "ref":
      break;
    case "autoFocus":
    case "multiple":
    case "muted":
      pushBooleanAttribute$1(e3, t3.toLowerCase(), r4);
      break;
    case "xlinkHref":
      if ("function" == typeof r4 || "symbol" == typeof r4 || "boolean" == typeof r4) break;
      r4 = sanitizeURL$1("" + r4), e3.push(Pr, stringToChunk("xlink:href"), Rr, stringToChunk(escapeTextForBrowser$1(r4)), Tr);
      break;
    case "contentEditable":
    case "spellCheck":
    case "draggable":
    case "value":
    case "autoReverse":
    case "externalResourcesRequired":
    case "focusable":
    case "preserveAlpha":
      "function" != typeof r4 && "symbol" != typeof r4 && e3.push(Pr, stringToChunk(t3), Rr, stringToChunk(escapeTextForBrowser$1(r4)), Tr);
      break;
    case "inert":
    case "allowFullScreen":
    case "async":
    case "autoPlay":
    case "controls":
    case "default":
    case "defer":
    case "disabled":
    case "disablePictureInPicture":
    case "disableRemotePlayback":
    case "formNoValidate":
    case "hidden":
    case "loop":
    case "noModule":
    case "noValidate":
    case "open":
    case "playsInline":
    case "readOnly":
    case "required":
    case "reversed":
    case "scoped":
    case "seamless":
    case "itemScope":
      r4 && "function" != typeof r4 && "symbol" != typeof r4 && e3.push(Pr, stringToChunk(t3), $r);
      break;
    case "capture":
    case "download":
      true === r4 ? e3.push(Pr, stringToChunk(t3), $r) : false !== r4 && "function" != typeof r4 && "symbol" != typeof r4 && e3.push(Pr, stringToChunk(t3), Rr, stringToChunk(escapeTextForBrowser$1(r4)), Tr);
      break;
    case "cols":
    case "rows":
    case "size":
    case "span":
      "function" != typeof r4 && "symbol" != typeof r4 && !isNaN(r4) && 1 <= r4 && e3.push(Pr, stringToChunk(t3), Rr, stringToChunk(escapeTextForBrowser$1(r4)), Tr);
      break;
    case "rowSpan":
    case "start":
      "function" == typeof r4 || "symbol" == typeof r4 || isNaN(r4) || e3.push(Pr, stringToChunk(t3), Rr, stringToChunk(escapeTextForBrowser$1(r4)), Tr);
      break;
    case "xlinkActuate":
      pushStringAttribute$1(e3, "xlink:actuate", r4);
      break;
    case "xlinkArcrole":
      pushStringAttribute$1(e3, "xlink:arcrole", r4);
      break;
    case "xlinkRole":
      pushStringAttribute$1(e3, "xlink:role", r4);
      break;
    case "xlinkShow":
      pushStringAttribute$1(e3, "xlink:show", r4);
      break;
    case "xlinkTitle":
      pushStringAttribute$1(e3, "xlink:title", r4);
      break;
    case "xlinkType":
      pushStringAttribute$1(e3, "xlink:type", r4);
      break;
    case "xmlBase":
      pushStringAttribute$1(e3, "xml:base", r4);
      break;
    case "xmlLang":
      pushStringAttribute$1(e3, "xml:lang", r4);
      break;
    case "xmlSpace":
      pushStringAttribute$1(e3, "xml:space", r4);
      break;
    default:
      if ((!(2 < t3.length) || "o" !== t3[0] && "O" !== t3[0] || "n" !== t3[1] && "N" !== t3[1]) && isAttributeNameSafe$1(t3 = Zt.get(t3) || t3)) {
        switch (typeof r4) {
          case "function":
          case "symbol":
            return;
          case "boolean":
            var n3 = t3.toLowerCase().slice(0, 5);
            if ("data-" !== n3 && "aria-" !== n3) return;
        }
        e3.push(Pr, stringToChunk(t3), Rr, stringToChunk(escapeTextForBrowser$1(r4)), Tr);
      }
  }
}
function pushInnerHTML$1(e3, t3, r4) {
  if (null != t3) {
    if (null != r4) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
    if ("object" != typeof t3 || !("__html" in t3)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information.");
    null != (t3 = t3.__html) && e3.push(stringToChunk("" + t3));
  }
}
function injectFormReplayingRuntime$1(e3, t3) {
  !(16 & e3.instructions) && (e3.instructions |= 16, t3.bootstrapChunks.unshift(t3.startInlineScript, Mr, cr));
}
function pushLinkImpl$1(e3, t3) {
  for (var r4 in e3.push(startChunkForTag$1("link")), t3) if (Qt.call(t3, r4)) {
    var n3 = t3[r4];
    if (null != n3) switch (r4) {
      case "children":
      case "dangerouslySetInnerHTML":
        throw Error("link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
      default:
        pushAttribute$1(e3, r4, n3);
    }
  }
  return e3.push(Ar), null;
}
function styleReplacer$1(e3, t3, r4, n3) {
  return t3 + ("s" === r4 ? "\\73 " : "\\53 ") + n3;
}
function pushSelfClosing$1(e3, t3, r4) {
  for (var n3 in e3.push(startChunkForTag$1(r4)), t3) if (Qt.call(t3, n3)) {
    var s4 = t3[n3];
    if (null != s4) switch (n3) {
      case "children":
      case "dangerouslySetInnerHTML":
        throw Error(r4 + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
      default:
        pushAttribute$1(e3, n3, s4);
    }
  }
  return e3.push(Ar), null;
}
function pushTitleImpl$1(e3, t3) {
  e3.push(startChunkForTag$1("title"));
  var r4, n3 = null, s4 = null;
  for (r4 in t3) if (Qt.call(t3, r4)) {
    var o5 = t3[r4];
    if (null != o5) switch (r4) {
      case "children":
        n3 = o5;
        break;
      case "dangerouslySetInnerHTML":
        s4 = o5;
        break;
      default:
        pushAttribute$1(e3, r4, o5);
    }
  }
  return e3.push(Ir), "function" != typeof (t3 = Array.isArray(n3) ? 2 > n3.length ? n3[0] : null : n3) && "symbol" != typeof t3 && null != t3 && e3.push(stringToChunk(escapeTextForBrowser$1("" + t3))), pushInnerHTML$1(e3, s4, n3), e3.push(endChunkForTag$1("title")), null;
}
function pushScriptImpl$1(e3, t3) {
  e3.push(startChunkForTag$1("script"));
  var r4, n3 = null, s4 = null;
  for (r4 in t3) if (Qt.call(t3, r4)) {
    var o5 = t3[r4];
    if (null != o5) switch (r4) {
      case "children":
        n3 = o5;
        break;
      case "dangerouslySetInnerHTML":
        s4 = o5;
        break;
      default:
        pushAttribute$1(e3, r4, o5);
    }
  }
  return e3.push(Ir), pushInnerHTML$1(e3, s4, n3), "string" == typeof n3 && e3.push(stringToChunk(("" + n3).replace(yr, scriptReplacer$1))), e3.push(endChunkForTag$1("script")), null;
}
function pushStartSingletonElement$1(e3, t3, r4) {
  e3.push(startChunkForTag$1(r4));
  var n3, s4 = r4 = null;
  for (n3 in t3) if (Qt.call(t3, n3)) {
    var o5 = t3[n3];
    if (null != o5) switch (n3) {
      case "children":
        r4 = o5;
        break;
      case "dangerouslySetInnerHTML":
        s4 = o5;
        break;
      default:
        pushAttribute$1(e3, n3, o5);
    }
  }
  return e3.push(Ir), pushInnerHTML$1(e3, s4, r4), r4;
}
function pushStartGenericElement$1(e3, t3, r4) {
  e3.push(startChunkForTag$1(r4));
  var n3, s4 = r4 = null;
  for (n3 in t3) if (Qt.call(t3, n3)) {
    var o5 = t3[n3];
    if (null != o5) switch (n3) {
      case "children":
        r4 = o5;
        break;
      case "dangerouslySetInnerHTML":
        s4 = o5;
        break;
      default:
        pushAttribute$1(e3, n3, o5);
    }
  }
  return e3.push(Ir), pushInnerHTML$1(e3, s4, r4), "string" == typeof r4 ? (e3.push(stringToChunk(escapeTextForBrowser$1(r4))), null) : r4;
}
function startChunkForTag$1(e3) {
  var t3 = Br.get(e3);
  if (void 0 === t3) {
    if (!Dr.test(e3)) throw Error("Invalid tag: " + e3);
    t3 = stringToPrecomputedChunk("<" + e3), Br.set(e3, t3);
  }
  return t3;
}
function pushStartInstance$1(e3, t3, r4, n3, s4, o5, a5, i5, l4, u4) {
  switch (t3) {
    case "div":
    case "span":
    case "svg":
    case "path":
    case "g":
    case "p":
    case "li":
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      break;
    case "a":
      e3.push(startChunkForTag$1("a"));
      var c4, d4 = null, h4 = null;
      for (c4 in r4) if (Qt.call(r4, c4)) {
        var p4 = r4[c4];
        if (null != p4) switch (c4) {
          case "children":
            d4 = p4;
            break;
          case "dangerouslySetInnerHTML":
            h4 = p4;
            break;
          case "href":
            "" === p4 ? pushStringAttribute$1(e3, "href", "") : pushAttribute$1(e3, c4, p4);
            break;
          default:
            pushAttribute$1(e3, c4, p4);
        }
      }
      if (e3.push(Ir), pushInnerHTML$1(e3, h4, d4), "string" == typeof d4) {
        e3.push(stringToChunk(escapeTextForBrowser$1(d4)));
        var f4 = null;
      } else f4 = d4;
      return f4;
    case "select":
      e3.push(startChunkForTag$1("select"));
      var m5, g3 = null, y3 = null;
      for (m5 in r4) if (Qt.call(r4, m5)) {
        var v3 = r4[m5];
        if (null != v3) switch (m5) {
          case "children":
            g3 = v3;
            break;
          case "dangerouslySetInnerHTML":
            y3 = v3;
            break;
          case "defaultValue":
          case "value":
            break;
          default:
            pushAttribute$1(e3, m5, v3);
        }
      }
      return e3.push(Ir), pushInnerHTML$1(e3, y3, g3), g3;
    case "option":
      var b3 = i5.selectedValue;
      e3.push(startChunkForTag$1("option"));
      var S4, k4 = null, w4 = null, C4 = null, x3 = null;
      for (S4 in r4) if (Qt.call(r4, S4)) {
        var P4 = r4[S4];
        if (null != P4) switch (S4) {
          case "children":
            k4 = P4;
            break;
          case "selected":
            C4 = P4;
            break;
          case "dangerouslySetInnerHTML":
            x3 = P4;
            break;
          case "value":
            w4 = P4;
          default:
            pushAttribute$1(e3, S4, P4);
        }
      }
      if (null != b3) {
        var R4 = null !== w4 ? "" + w4 : function(e4) {
          var t4 = "";
          return St.Children.forEach(e4, function(e5) {
            null != e5 && (t4 += e5);
          }), t4;
        }(k4);
        if (Ht(b3)) {
          for (var T4 = 0; T4 < b3.length; T4++) if ("" + b3[T4] === R4) {
            e3.push(_r);
            break;
          }
        } else "" + b3 === R4 && e3.push(_r);
      } else C4 && e3.push(_r);
      return e3.push(Ir), pushInnerHTML$1(e3, x3, k4), k4;
    case "textarea":
      e3.push(startChunkForTag$1("textarea"));
      var $3, E4 = null, F4 = null, I4 = null;
      for ($3 in r4) if (Qt.call(r4, $3)) {
        var A4 = r4[$3];
        if (null != A4) switch ($3) {
          case "children":
            I4 = A4;
            break;
          case "value":
            E4 = A4;
            break;
          case "defaultValue":
            F4 = A4;
            break;
          case "dangerouslySetInnerHTML":
            throw Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
          default:
            pushAttribute$1(e3, $3, A4);
        }
      }
      if (null === E4 && null !== F4 && (E4 = F4), e3.push(Ir), null != I4) {
        if (null != E4) throw Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
        if (Ht(I4)) {
          if (1 < I4.length) throw Error("<textarea> can only have at most one child.");
          E4 = "" + I4[0];
        }
        E4 = "" + I4;
      }
      return "string" == typeof E4 && "\n" === E4[0] && e3.push(Lr), null !== E4 && e3.push(stringToChunk(escapeTextForBrowser$1("" + E4))), null;
    case "input":
      e3.push(startChunkForTag$1("input"));
      var _3, M3 = null, O4 = null, N4 = null, j3 = null, L4 = null, D4 = null, B3 = null, H3 = null, z3 = null;
      for (_3 in r4) if (Qt.call(r4, _3)) {
        var q3 = r4[_3];
        if (null != q3) switch (_3) {
          case "children":
          case "dangerouslySetInnerHTML":
            throw Error("input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
          case "name":
            M3 = q3;
            break;
          case "formAction":
            O4 = q3;
            break;
          case "formEncType":
            N4 = q3;
            break;
          case "formMethod":
            j3 = q3;
            break;
          case "formTarget":
            L4 = q3;
            break;
          case "defaultChecked":
            z3 = q3;
            break;
          case "defaultValue":
            B3 = q3;
            break;
          case "checked":
            H3 = q3;
            break;
          case "value":
            D4 = q3;
            break;
          default:
            pushAttribute$1(e3, _3, q3);
        }
      }
      var U4 = pushFormActionAttribute$1(e3, n3, s4, O4, N4, j3, L4, M3);
      return null !== H3 ? pushBooleanAttribute$1(e3, "checked", H3) : null !== z3 && pushBooleanAttribute$1(e3, "checked", z3), null !== D4 ? pushAttribute$1(e3, "value", D4) : null !== B3 && pushAttribute$1(e3, "value", B3), e3.push(Ar), null != U4 && U4.forEach(pushAdditionalFormField$1, e3), null;
    case "button":
      e3.push(startChunkForTag$1("button"));
      var V4, W4 = null, K4 = null, Q3 = null, G3 = null, J3 = null, Y4 = null, X4 = null;
      for (V4 in r4) if (Qt.call(r4, V4)) {
        var Z3 = r4[V4];
        if (null != Z3) switch (V4) {
          case "children":
            W4 = Z3;
            break;
          case "dangerouslySetInnerHTML":
            K4 = Z3;
            break;
          case "name":
            Q3 = Z3;
            break;
          case "formAction":
            G3 = Z3;
            break;
          case "formEncType":
            J3 = Z3;
            break;
          case "formMethod":
            Y4 = Z3;
            break;
          case "formTarget":
            X4 = Z3;
            break;
          default:
            pushAttribute$1(e3, V4, Z3);
        }
      }
      var ee3 = pushFormActionAttribute$1(e3, n3, s4, G3, J3, Y4, X4, Q3);
      if (e3.push(Ir), null != ee3 && ee3.forEach(pushAdditionalFormField$1, e3), pushInnerHTML$1(e3, K4, W4), "string" == typeof W4) {
        e3.push(stringToChunk(escapeTextForBrowser$1(W4)));
        var te3 = null;
      } else te3 = W4;
      return te3;
    case "form":
      e3.push(startChunkForTag$1("form"));
      var re3, ne3 = null, se3 = null, oe3 = null, ae3 = null, ie3 = null, le3 = null;
      for (re3 in r4) if (Qt.call(r4, re3)) {
        var ue3 = r4[re3];
        if (null != ue3) switch (re3) {
          case "children":
            ne3 = ue3;
            break;
          case "dangerouslySetInnerHTML":
            se3 = ue3;
            break;
          case "action":
            oe3 = ue3;
            break;
          case "encType":
            ae3 = ue3;
            break;
          case "method":
            ie3 = ue3;
            break;
          case "target":
            le3 = ue3;
            break;
          default:
            pushAttribute$1(e3, re3, ue3);
        }
      }
      var ce3 = null, de3 = null;
      if ("function" == typeof oe3) {
        var he3 = getCustomFormFields$1(n3, oe3);
        null !== he3 ? (oe3 = he3.action || "", ae3 = he3.encType, ie3 = he3.method, le3 = he3.target, ce3 = he3.data, de3 = he3.name) : (e3.push(Pr, stringToChunk("action"), Rr, Er, Tr), le3 = ie3 = ae3 = oe3 = null, injectFormReplayingRuntime$1(n3, s4));
      }
      if (null != oe3 && pushAttribute$1(e3, "action", oe3), null != ae3 && pushAttribute$1(e3, "encType", ae3), null != ie3 && pushAttribute$1(e3, "method", ie3), null != le3 && pushAttribute$1(e3, "target", le3), e3.push(Ir), null !== de3 && (e3.push(Fr), pushStringAttribute$1(e3, "name", de3), e3.push(Ar), null != ce3 && ce3.forEach(pushAdditionalFormField$1, e3)), pushInnerHTML$1(e3, se3, ne3), "string" == typeof ne3) {
        e3.push(stringToChunk(escapeTextForBrowser$1(ne3)));
        var pe3 = null;
      } else pe3 = ne3;
      return pe3;
    case "menuitem":
      for (var fe3 in e3.push(startChunkForTag$1("menuitem")), r4) if (Qt.call(r4, fe3)) {
        var me3 = r4[fe3];
        if (null != me3) switch (fe3) {
          case "children":
          case "dangerouslySetInnerHTML":
            throw Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
          default:
            pushAttribute$1(e3, fe3, me3);
        }
      }
      return e3.push(Ir), null;
    case "object":
      e3.push(startChunkForTag$1("object"));
      var ge3, ye3 = null, ve3 = null;
      for (ge3 in r4) if (Qt.call(r4, ge3)) {
        var be3 = r4[ge3];
        if (null != be3) switch (ge3) {
          case "children":
            ye3 = be3;
            break;
          case "dangerouslySetInnerHTML":
            ve3 = be3;
            break;
          case "data":
            var Se3 = sanitizeURL$1("" + be3);
            if ("" === Se3) break;
            e3.push(Pr, stringToChunk("data"), Rr, stringToChunk(escapeTextForBrowser$1(Se3)), Tr);
            break;
          default:
            pushAttribute$1(e3, ge3, be3);
        }
      }
      if (e3.push(Ir), pushInnerHTML$1(e3, ve3, ye3), "string" == typeof ye3) {
        e3.push(stringToChunk(escapeTextForBrowser$1(ye3)));
        var ke3 = null;
      } else ke3 = ye3;
      return ke3;
    case "title":
      if (4 === i5.insertionMode || 1 & i5.tagScope || null != r4.itemProp) var we3 = pushTitleImpl$1(e3, r4);
      else u4 ? we3 = null : (pushTitleImpl$1(s4.hoistableChunks, r4), we3 = void 0);
      return we3;
    case "link":
      var Ce3 = r4.rel, xe3 = r4.href, Pe3 = r4.precedence;
      if (4 === i5.insertionMode || 1 & i5.tagScope || null != r4.itemProp || "string" != typeof Ce3 || "string" != typeof xe3 || "" === xe3) {
        pushLinkImpl$1(e3, r4);
        var Re3 = null;
      } else if ("stylesheet" === r4.rel) if ("string" != typeof Pe3 || null != r4.disabled || r4.onLoad || r4.onError) Re3 = pushLinkImpl$1(e3, r4);
      else {
        var Te3 = s4.styles.get(Pe3), $e3 = n3.styleResources.hasOwnProperty(xe3) ? n3.styleResources[xe3] : void 0;
        if (null !== $e3) {
          n3.styleResources[xe3] = null, Te3 || (Te3 = { precedence: stringToChunk(escapeTextForBrowser$1(Pe3)), rules: [], hrefs: [], sheets: /* @__PURE__ */ new Map() }, s4.styles.set(Pe3, Te3));
          var Ee3 = { state: 0, props: Kt({}, r4, { "data-precedence": r4.precedence, precedence: null }) };
          if ($e3) {
            2 === $e3.length && adoptPreloadCredentials$1(Ee3.props, $e3);
            var Fe3 = s4.preloads.stylesheets.get(xe3);
            Fe3 && 0 < Fe3.length ? Fe3.length = 0 : Ee3.state = 1;
          }
          Te3.sheets.set(xe3, Ee3), a5 && a5.stylesheets.add(Ee3);
        } else if (Te3) {
          var Ie3 = Te3.sheets.get(xe3);
          Ie3 && a5 && a5.stylesheets.add(Ie3);
        }
        l4 && e3.push(Sr), Re3 = null;
      }
      else r4.onLoad || r4.onError ? Re3 = pushLinkImpl$1(e3, r4) : (l4 && e3.push(Sr), Re3 = u4 ? null : pushLinkImpl$1(s4.hoistableChunks, r4));
      return Re3;
    case "script":
      var Ae3 = r4.async;
      if ("string" != typeof r4.src || !r4.src || !Ae3 || "function" == typeof Ae3 || "symbol" == typeof Ae3 || r4.onLoad || r4.onError || 4 === i5.insertionMode || 1 & i5.tagScope || null != r4.itemProp) var _e3 = pushScriptImpl$1(e3, r4);
      else {
        var Me3 = r4.src;
        if ("module" === r4.type) var Oe3 = n3.moduleScriptResources, Ne3 = s4.preloads.moduleScripts;
        else Oe3 = n3.scriptResources, Ne3 = s4.preloads.scripts;
        var je3 = Oe3.hasOwnProperty(Me3) ? Oe3[Me3] : void 0;
        if (null !== je3) {
          Oe3[Me3] = null;
          var Le3 = r4;
          if (je3) {
            2 === je3.length && adoptPreloadCredentials$1(Le3 = Kt({}, r4), je3);
            var De3 = Ne3.get(Me3);
            De3 && (De3.length = 0);
          }
          var Be3 = [];
          s4.scripts.add(Be3), pushScriptImpl$1(Be3, Le3);
        }
        l4 && e3.push(Sr), _e3 = null;
      }
      return _e3;
    case "style":
      var He3 = r4.precedence, ze3 = r4.href;
      if (4 === i5.insertionMode || 1 & i5.tagScope || null != r4.itemProp || "string" != typeof He3 || "string" != typeof ze3 || "" === ze3) {
        e3.push(startChunkForTag$1("style"));
        var qe3, Ue3 = null, Ve3 = null;
        for (qe3 in r4) if (Qt.call(r4, qe3)) {
          var We3 = r4[qe3];
          if (null != We3) switch (qe3) {
            case "children":
              Ue3 = We3;
              break;
            case "dangerouslySetInnerHTML":
              Ve3 = We3;
              break;
            default:
              pushAttribute$1(e3, qe3, We3);
          }
        }
        e3.push(Ir);
        var Ke3 = Array.isArray(Ue3) ? 2 > Ue3.length ? Ue3[0] : null : Ue3;
        "function" != typeof Ke3 && "symbol" != typeof Ke3 && null != Ke3 && e3.push(stringToChunk(("" + Ke3).replace(jr, styleReplacer$1))), pushInnerHTML$1(e3, Ve3, Ue3), e3.push(endChunkForTag$1("style"));
        var Qe3 = null;
      } else {
        var Ge3 = s4.styles.get(He3);
        if (null !== (n3.styleResources.hasOwnProperty(ze3) ? n3.styleResources[ze3] : void 0)) {
          n3.styleResources[ze3] = null, Ge3 ? Ge3.hrefs.push(stringToChunk(escapeTextForBrowser$1(ze3))) : (Ge3 = { precedence: stringToChunk(escapeTextForBrowser$1(He3)), rules: [], hrefs: [stringToChunk(escapeTextForBrowser$1(ze3))], sheets: /* @__PURE__ */ new Map() }, s4.styles.set(He3, Ge3));
          var Je3, Ye3 = Ge3.rules, Xe3 = null, Ze3 = null;
          for (Je3 in r4) if (Qt.call(r4, Je3)) {
            var et3 = r4[Je3];
            if (null != et3) switch (Je3) {
              case "children":
                Xe3 = et3;
                break;
              case "dangerouslySetInnerHTML":
                Ze3 = et3;
            }
          }
          var tt3 = Array.isArray(Xe3) ? 2 > Xe3.length ? Xe3[0] : null : Xe3;
          "function" != typeof tt3 && "symbol" != typeof tt3 && null != tt3 && Ye3.push(stringToChunk(("" + tt3).replace(jr, styleReplacer$1))), pushInnerHTML$1(Ye3, Ze3, Xe3);
        }
        Ge3 && a5 && a5.styles.add(Ge3), l4 && e3.push(Sr), Qe3 = void 0;
      }
      return Qe3;
    case "meta":
      if (4 === i5.insertionMode || 1 & i5.tagScope || null != r4.itemProp) var rt3 = pushSelfClosing$1(e3, r4, "meta");
      else l4 && e3.push(Sr), rt3 = u4 ? null : "string" == typeof r4.charSet ? pushSelfClosing$1(s4.charsetChunks, r4, "meta") : "viewport" === r4.name ? pushSelfClosing$1(s4.viewportChunks, r4, "meta") : pushSelfClosing$1(s4.hoistableChunks, r4, "meta");
      return rt3;
    case "listing":
    case "pre":
      e3.push(startChunkForTag$1(t3));
      var nt3, st3 = null, ot3 = null;
      for (nt3 in r4) if (Qt.call(r4, nt3)) {
        var at3 = r4[nt3];
        if (null != at3) switch (nt3) {
          case "children":
            st3 = at3;
            break;
          case "dangerouslySetInnerHTML":
            ot3 = at3;
            break;
          default:
            pushAttribute$1(e3, nt3, at3);
        }
      }
      if (e3.push(Ir), null != ot3) {
        if (null != st3) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
        if ("object" != typeof ot3 || !("__html" in ot3)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information.");
        var it3 = ot3.__html;
        null != it3 && ("string" == typeof it3 && 0 < it3.length && "\n" === it3[0] ? e3.push(Lr, stringToChunk(it3)) : e3.push(stringToChunk("" + it3)));
      }
      return "string" == typeof st3 && "\n" === st3[0] && e3.push(Lr), st3;
    case "img":
      var lt3 = r4.src, ut3 = r4.srcSet;
      if (!("lazy" === r4.loading || !lt3 && !ut3 || "string" != typeof lt3 && null != lt3 || "string" != typeof ut3 && null != ut3) && "low" !== r4.fetchPriority && false == !!(3 & i5.tagScope) && ("string" != typeof lt3 || ":" !== lt3[4] || "d" !== lt3[0] && "D" !== lt3[0] || "a" !== lt3[1] && "A" !== lt3[1] || "t" !== lt3[2] && "T" !== lt3[2] || "a" !== lt3[3] && "A" !== lt3[3]) && ("string" != typeof ut3 || ":" !== ut3[4] || "d" !== ut3[0] && "D" !== ut3[0] || "a" !== ut3[1] && "A" !== ut3[1] || "t" !== ut3[2] && "T" !== ut3[2] || "a" !== ut3[3] && "A" !== ut3[3])) {
        var ct3 = "string" == typeof r4.sizes ? r4.sizes : void 0, dt3 = ut3 ? ut3 + "\n" + (ct3 || "") : lt3, ht3 = s4.preloads.images, pt3 = ht3.get(dt3);
        if (pt3) ("high" === r4.fetchPriority || 10 > s4.highImagePreloads.size) && (ht3.delete(dt3), s4.highImagePreloads.add(pt3));
        else if (!n3.imageResources.hasOwnProperty(dt3)) {
          n3.imageResources[dt3] = lr;
          var ft3, mt3 = r4.crossOrigin, gt3 = "string" == typeof mt3 ? "use-credentials" === mt3 ? mt3 : "" : void 0, yt3 = s4.headers;
          yt3 && 0 < yt3.remainingCapacity && "string" != typeof r4.srcSet && ("high" === r4.fetchPriority || 500 > yt3.highImagePreloads.length) && (ft3 = getPreloadAsHeader$1(lt3, "image", { imageSrcSet: r4.srcSet, imageSizes: r4.sizes, crossOrigin: gt3, integrity: r4.integrity, nonce: r4.nonce, type: r4.type, fetchPriority: r4.fetchPriority, referrerPolicy: r4.refererPolicy }), 0 <= (yt3.remainingCapacity -= ft3.length + 2)) ? (s4.resets.image[dt3] = lr, yt3.highImagePreloads && (yt3.highImagePreloads += ", "), yt3.highImagePreloads += ft3) : (pushLinkImpl$1(pt3 = [], { rel: "preload", as: "image", href: ut3 ? void 0 : lt3, imageSrcSet: ut3, imageSizes: ct3, crossOrigin: gt3, integrity: r4.integrity, type: r4.type, fetchPriority: r4.fetchPriority, referrerPolicy: r4.referrerPolicy }), "high" === r4.fetchPriority || 10 > s4.highImagePreloads.size ? s4.highImagePreloads.add(pt3) : (s4.bulkPreloads.add(pt3), ht3.set(dt3, pt3)));
        }
      }
      return pushSelfClosing$1(e3, r4, "img");
    case "base":
    case "area":
    case "br":
    case "col":
    case "embed":
    case "hr":
    case "keygen":
    case "param":
    case "source":
    case "track":
    case "wbr":
      return pushSelfClosing$1(e3, r4, t3);
    case "head":
      if (2 > i5.insertionMode) {
        var vt3 = o5 || s4.preamble;
        if (vt3.headChunks) throw Error("The `<head>` tag may only be rendered once.");
        vt3.headChunks = [];
        var bt3 = pushStartSingletonElement$1(vt3.headChunks, r4, "head");
      } else bt3 = pushStartGenericElement$1(e3, r4, "head");
      return bt3;
    case "body":
      if (2 > i5.insertionMode) {
        var kt3 = o5 || s4.preamble;
        if (kt3.bodyChunks) throw Error("The `<body>` tag may only be rendered once.");
        kt3.bodyChunks = [];
        var wt3 = pushStartSingletonElement$1(kt3.bodyChunks, r4, "body");
      } else wt3 = pushStartGenericElement$1(e3, r4, "body");
      return wt3;
    case "html":
      if (0 === i5.insertionMode) {
        var Ct3 = o5 || s4.preamble;
        if (Ct3.htmlChunks) throw Error("The `<html>` tag may only be rendered once.");
        Ct3.htmlChunks = [Hr];
        var xt3 = pushStartSingletonElement$1(Ct3.htmlChunks, r4, "html");
      } else xt3 = pushStartGenericElement$1(e3, r4, "html");
      return xt3;
    default:
      if (-1 !== t3.indexOf("-")) {
        e3.push(startChunkForTag$1(t3));
        var Pt3, Rt3 = null, Tt3 = null;
        for (Pt3 in r4) if (Qt.call(r4, Pt3)) {
          var $t3 = r4[Pt3];
          if (null != $t3) {
            var Et3 = Pt3;
            switch (Pt3) {
              case "children":
                Rt3 = $t3;
                break;
              case "dangerouslySetInnerHTML":
                Tt3 = $t3;
                break;
              case "style":
                pushStyleAttribute$1(e3, $t3);
                break;
              case "suppressContentEditableWarning":
              case "suppressHydrationWarning":
              case "ref":
                break;
              case "className":
                Et3 = "class";
              default:
                if (isAttributeNameSafe$1(Pt3) && "function" != typeof $t3 && "symbol" != typeof $t3 && false !== $t3) {
                  if (true === $t3) $t3 = "";
                  else if ("object" == typeof $t3) continue;
                  e3.push(Pr, stringToChunk(Et3), Rr, stringToChunk(escapeTextForBrowser$1($t3)), Tr);
                }
            }
          }
        }
        return e3.push(Ir), pushInnerHTML$1(e3, Tt3, Rt3), Rt3;
      }
  }
  return pushStartGenericElement$1(e3, r4, t3);
}
function endChunkForTag$1(e3) {
  var t3 = zr.get(e3);
  return void 0 === t3 && (t3 = stringToPrecomputedChunk("</" + e3 + ">"), zr.set(e3, t3)), t3;
}
function hoistPreambleState$1(e3, t3) {
  null === (e3 = e3.preamble).htmlChunks && t3.htmlChunks && (e3.htmlChunks = t3.htmlChunks, t3.contribution |= 1), null === e3.headChunks && t3.headChunks && (e3.headChunks = t3.headChunks, t3.contribution |= 4), null === e3.bodyChunks && t3.bodyChunks && (e3.bodyChunks = t3.bodyChunks, t3.contribution |= 2);
}
function writeBootstrap$1(e3, t3) {
  t3 = t3.bootstrapChunks;
  for (var r4 = 0; r4 < t3.length - 1; r4++) writeChunk(e3, t3[r4]);
  return !(r4 < t3.length) || (r4 = t3[r4], t3.length = 0, writeChunkAndReturn(e3, r4));
}
function writeStartPendingSuspenseBoundary$1(e3, t3, r4) {
  if (writeChunk(e3, Wr), null === r4) throw Error("An ID must have been assigned before we can complete the boundary.");
  return writeChunk(e3, t3.boundaryPrefix), writeChunk(e3, stringToChunk(r4.toString(16))), writeChunkAndReturn(e3, Kr);
}
function writePreambleContribution$1(e3, t3) {
  0 !== (t3 = t3.contribution) && (writeChunk(e3, en), writeChunk(e3, stringToChunk("" + t3)), writeChunk(e3, tn));
}
function escapeJSStringsForInstructionScripts$1(e3) {
  return JSON.stringify(e3).replace(qn, function(e4) {
    switch (e4) {
      case "<":
        return "\\u003c";
      case "\u2028":
        return "\\u2028";
      case "\u2029":
        return "\\u2029";
      default:
        throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
    }
  });
}
function escapeJSObjectForInstructionScripts$1(e3) {
  return JSON.stringify(e3).replace(Un, function(e4) {
    switch (e4) {
      case "&":
        return "\\u0026";
      case ">":
        return "\\u003e";
      case "<":
        return "\\u003c";
      case "\u2028":
        return "\\u2028";
      case "\u2029":
        return "\\u2029";
      default:
        throw Error("escapeJSObjectForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
    }
  });
}
function flushStyleTagsLateForBoundary$1(e3) {
  var t3 = e3.rules, r4 = e3.hrefs, n3 = 0;
  if (r4.length) {
    for (writeChunk(this, Vn), writeChunk(this, e3.precedence), writeChunk(this, Wn); n3 < r4.length - 1; n3++) writeChunk(this, r4[n3]), writeChunk(this, es);
    for (writeChunk(this, r4[n3]), writeChunk(this, Kn), n3 = 0; n3 < t3.length; n3++) writeChunk(this, t3[n3]);
    Jn = writeChunkAndReturn(this, Qn), Gn = true, t3.length = 0, r4.length = 0;
  }
}
function hasStylesToHoist$1(e3) {
  return 2 !== e3.state && (Gn = true);
}
function writeHoistablesForBoundary$1(e3, t3, r4) {
  return Gn = false, Jn = true, t3.styles.forEach(flushStyleTagsLateForBoundary$1, e3), t3.stylesheets.forEach(hasStylesToHoist$1), Gn && (r4.stylesToHoist = true), Jn;
}
function flushResource$1(e3) {
  for (var t3 = 0; t3 < e3.length; t3++) writeChunk(this, e3[t3]);
  e3.length = 0;
}
function flushStyleInPreamble$1(e3) {
  pushLinkImpl$1(Yn, e3.props);
  for (var t3 = 0; t3 < Yn.length; t3++) writeChunk(this, Yn[t3]);
  Yn.length = 0, e3.state = 2;
}
function flushStylesInPreamble$1(e3) {
  var t3 = 0 < e3.sheets.size;
  e3.sheets.forEach(flushStyleInPreamble$1, this), e3.sheets.clear();
  var r4 = e3.rules, n3 = e3.hrefs;
  if (!t3 || n3.length) {
    if (writeChunk(this, Xn), writeChunk(this, e3.precedence), e3 = 0, n3.length) {
      for (writeChunk(this, Zn); e3 < n3.length - 1; e3++) writeChunk(this, n3[e3]), writeChunk(this, es);
      writeChunk(this, n3[e3]);
    }
    for (writeChunk(this, ts), e3 = 0; e3 < r4.length; e3++) writeChunk(this, r4[e3]);
    writeChunk(this, rs), r4.length = 0, n3.length = 0;
  }
}
function preloadLateStyle$1(e3) {
  if (0 === e3.state) {
    e3.state = 1;
    var t3 = e3.props;
    for (pushLinkImpl$1(Yn, { rel: "preload", as: "style", href: e3.props.href, crossOrigin: t3.crossOrigin, fetchPriority: t3.fetchPriority, integrity: t3.integrity, media: t3.media, hrefLang: t3.hrefLang, referrerPolicy: t3.referrerPolicy }), e3 = 0; e3 < Yn.length; e3++) writeChunk(this, Yn[e3]);
    Yn.length = 0;
  }
}
function preloadLateStyles$1(e3) {
  e3.sheets.forEach(preloadLateStyle$1, this), e3.sheets.clear();
}
function writeStyleResourceAttributeInJS$1(e3, t3, r4) {
  var n3 = t3.toLowerCase();
  switch (typeof r4) {
    case "function":
    case "symbol":
      return;
  }
  switch (t3) {
    case "innerHTML":
    case "dangerouslySetInnerHTML":
    case "suppressContentEditableWarning":
    case "suppressHydrationWarning":
    case "style":
    case "ref":
      return;
    case "className":
      n3 = "class", t3 = "" + r4;
      break;
    case "hidden":
      if (false === r4) return;
      t3 = "";
      break;
    case "src":
    case "href":
      t3 = "" + (r4 = sanitizeURL$1(r4));
      break;
    default:
      if (2 < t3.length && ("o" === t3[0] || "O" === t3[0]) && ("n" === t3[1] || "N" === t3[1]) || !isAttributeNameSafe$1(t3)) return;
      t3 = "" + r4;
  }
  writeChunk(e3, os), writeChunk(e3, stringToChunk(escapeJSObjectForInstructionScripts$1(n3))), writeChunk(e3, os), writeChunk(e3, stringToChunk(escapeJSObjectForInstructionScripts$1(t3)));
}
function createHoistableState$1() {
  return { styles: /* @__PURE__ */ new Set(), stylesheets: /* @__PURE__ */ new Set() };
}
function adoptPreloadCredentials$1(e3, t3) {
  null == e3.crossOrigin && (e3.crossOrigin = t3[0]), null == e3.integrity && (e3.integrity = t3[1]);
}
function getPreloadAsHeader$1(e3, t3, r4) {
  for (var n3 in t3 = "<" + (e3 = ("" + e3).replace(is, escapeHrefForLinkHeaderURLContextReplacer$1)) + '>; rel=preload; as="' + (t3 = ("" + t3).replace(ls, escapeStringForLinkHeaderQuotedParamValueContextReplacer$1)) + '"', r4) Qt.call(r4, n3) && ("string" == typeof (e3 = r4[n3]) && (t3 += "; " + n3.toLowerCase() + '="' + ("" + e3).replace(ls, escapeStringForLinkHeaderQuotedParamValueContextReplacer$1) + '"'));
  return t3;
}
function escapeHrefForLinkHeaderURLContextReplacer$1(e3) {
  switch (e3) {
    case "<":
      return "%3C";
    case ">":
      return "%3E";
    case "\n":
      return "%0A";
    case "\r":
      return "%0D";
    default:
      throw Error("escapeLinkHrefForHeaderContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
  }
}
function escapeStringForLinkHeaderQuotedParamValueContextReplacer$1(e3) {
  switch (e3) {
    case '"':
      return "%22";
    case "'":
      return "%27";
    case ";":
      return "%3B";
    case ",":
      return "%2C";
    case "\n":
      return "%0A";
    case "\r":
      return "%0D";
    default:
      throw Error("escapeStringForLinkHeaderQuotedParamValueContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
  }
}
function hoistStyleQueueDependency$1(e3) {
  this.styles.add(e3);
}
function hoistStylesheetDependency$1(e3) {
  this.stylesheets.add(e3);
}
function getComponentNameFromType$1(e3) {
  if (null == e3) return null;
  if ("function" == typeof e3) return e3.$$typeof === hs ? null : e3.displayName || e3.name || null;
  if ("string" == typeof e3) return e3;
  switch (e3) {
    case xt:
      return "Fragment";
    case Rt:
      return "Profiler";
    case Pt:
      return "StrictMode";
    case It:
      return "Suspense";
    case At:
      return "SuspenseList";
    case Nt:
      return "Activity";
  }
  if ("object" == typeof e3) switch (e3.$$typeof) {
    case Ct:
      return "Portal";
    case Et:
      return (e3.displayName || "Context") + ".Provider";
    case $t:
      return (e3._context.displayName || "Context") + ".Consumer";
    case Ft:
      var t3 = e3.render;
      return (e3 = e3.displayName) || (e3 = "" !== (e3 = t3.displayName || t3.name || "") ? "ForwardRef(" + e3 + ")" : "ForwardRef"), e3;
    case _t:
      return null !== (t3 = e3.displayName || null) ? t3 : getComponentNameFromType$1(e3.type) || "Memo";
    case Mt:
      t3 = e3._payload, e3 = e3._init;
      try {
        return getComponentNameFromType$1(e3(t3));
      } catch (e4) {
      }
  }
  return null;
}
function popToNearestCommonAncestor$1(e3, t3) {
  if (e3 !== t3) {
    e3.context._currentValue = e3.parentValue, e3 = e3.parent;
    var r4 = t3.parent;
    if (null === e3) {
      if (null !== r4) throw Error("The stacks must reach the root at the same time. This is a bug in React.");
    } else {
      if (null === r4) throw Error("The stacks must reach the root at the same time. This is a bug in React.");
      popToNearestCommonAncestor$1(e3, r4);
    }
    t3.context._currentValue = t3.value;
  }
}
function popAllPrevious$1(e3) {
  e3.context._currentValue = e3.parentValue, null !== (e3 = e3.parent) && popAllPrevious$1(e3);
}
function pushAllNext$1(e3) {
  var t3 = e3.parent;
  null !== t3 && pushAllNext$1(t3), e3.context._currentValue = e3.value;
}
function popPreviousToCommonLevel$1(e3, t3) {
  if (e3.context._currentValue = e3.parentValue, null === (e3 = e3.parent)) throw Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
  e3.depth === t3.depth ? popToNearestCommonAncestor$1(e3, t3) : popPreviousToCommonLevel$1(e3, t3);
}
function popNextToCommonLevel$1(e3, t3) {
  var r4 = t3.parent;
  if (null === r4) throw Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
  e3.depth === r4.depth ? popToNearestCommonAncestor$1(e3, r4) : popNextToCommonLevel$1(e3, r4), t3.context._currentValue = t3.value;
}
function switchContext$1(e3) {
  var t3 = fs;
  t3 !== e3 && (null === t3 ? pushAllNext$1(e3) : null === e3 ? popAllPrevious$1(t3) : t3.depth === e3.depth ? popToNearestCommonAncestor$1(t3, e3) : t3.depth > e3.depth ? popPreviousToCommonLevel$1(t3, e3) : popNextToCommonLevel$1(t3, e3), fs = e3);
}
function pushTreeContext$1(e3, t3, r4) {
  var n3 = e3.id;
  e3 = e3.overflow;
  var s4 = 32 - ys(n3) - 1;
  n3 &= ~(1 << s4), r4 += 1;
  var o5 = 32 - ys(t3) + s4;
  if (30 < o5) {
    var a5 = s4 - s4 % 5;
    return o5 = (n3 & (1 << a5) - 1).toString(32), n3 >>= a5, s4 -= a5, { id: 1 << 32 - ys(t3) + s4 | r4 << s4 | n3, overflow: o5 + e3 };
  }
  return { id: 1 << o5 | r4 << s4 | n3, overflow: e3 };
}
function noop$2$1() {
}
function getSuspendedThenable$1() {
  if (null === ks) throw Error("Expected a suspended thenable. This is a bug in React. Please file an issue.");
  var e3 = ks;
  return ks = null, e3;
}
function resolveCurrentlyRenderingComponent$1() {
  if (null === Cs) throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.");
  return Cs;
}
function createHook$1() {
  if (0 < js) throw Error("Rendered more hooks than during the previous render");
  return { memoizedState: null, queue: null, next: null };
}
function createWorkInProgressHook$1() {
  return null === $s ? null === Ts ? (Es = false, Ts = $s = createHook$1()) : (Es = true, $s = Ts) : null === $s.next ? (Es = false, $s = $s.next = createHook$1()) : (Es = true, $s = $s.next), $s;
}
function getThenableStateAfterSuspending$1() {
  var e3 = Os;
  return Os = null, e3;
}
function resetHooksState$1() {
  Rs = Ps = xs = Cs = null, Fs = false, Ts = null, js = 0, $s = Ns = null;
}
function basicStateReducer$1(e3, t3) {
  return "function" == typeof t3 ? t3(e3) : t3;
}
function useReducer$1(e3, t3, r4) {
  if (Cs = resolveCurrentlyRenderingComponent$1(), $s = createWorkInProgressHook$1(), Es) {
    var n3 = $s.queue;
    if (t3 = n3.dispatch, null !== Ns && void 0 !== (r4 = Ns.get(n3))) {
      Ns.delete(n3), n3 = $s.memoizedState;
      do {
        n3 = e3(n3, r4.action), r4 = r4.next;
      } while (null !== r4);
      return $s.memoizedState = n3, [n3, t3];
    }
    return [$s.memoizedState, t3];
  }
  return e3 = e3 === basicStateReducer$1 ? "function" == typeof t3 ? t3() : t3 : void 0 !== r4 ? r4(t3) : t3, $s.memoizedState = e3, e3 = (e3 = $s.queue = { last: null, dispatch: null }).dispatch = dispatchAction$1.bind(null, Cs, e3), [$s.memoizedState, e3];
}
function useMemo$1(e3, t3) {
  if (Cs = resolveCurrentlyRenderingComponent$1(), t3 = void 0 === t3 ? null : t3, null !== ($s = createWorkInProgressHook$1())) {
    var r4 = $s.memoizedState;
    if (null !== r4 && null !== t3) {
      var n3 = r4[1];
      e: if (null === n3) n3 = false;
      else {
        for (var s4 = 0; s4 < n3.length && s4 < t3.length; s4++) if (!ws(t3[s4], n3[s4])) {
          n3 = false;
          break e;
        }
        n3 = true;
      }
      if (n3) return r4[0];
    }
  }
  return e3 = e3(), $s.memoizedState = [e3, t3], e3;
}
function dispatchAction$1(e3, t3, r4) {
  if (25 <= js) throw Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
  if (e3 === Cs) if (Fs = true, e3 = { action: r4, next: null }, null === Ns && (Ns = /* @__PURE__ */ new Map()), void 0 === (r4 = Ns.get(t3))) Ns.set(t3, e3);
  else {
    for (t3 = r4; null !== t3.next; ) t3 = t3.next;
    t3.next = e3;
  }
}
function unsupportedStartTransition$1() {
  throw Error("startTransition cannot be called during server rendering.");
}
function unsupportedSetOptimisticState$1() {
  throw Error("Cannot update optimistic state while rendering.");
}
function useActionState$1(e3, t3, r4) {
  resolveCurrentlyRenderingComponent$1();
  var n3 = As++, s4 = Ps;
  if ("function" == typeof e3.$$FORM_ACTION) {
    var o5 = null, a5 = Rs;
    s4 = s4.formState;
    var i5 = e3.$$IS_SIGNATURE_EQUAL;
    if (null !== s4 && "function" == typeof i5) {
      var l4 = s4[1];
      i5.call(e3, s4[2], s4[3]) && (l4 === (o5 = void 0 !== r4 ? "p" + r4 : "k" + murmurhash3_32_gc$1(JSON.stringify([a5, null, n3]), 0)) && (_s = n3, t3 = s4[0]));
    }
    var u4 = e3.bind(null, t3);
    return e3 = /* @__PURE__ */ __name(function(e4) {
      u4(e4);
    }, "e"), "function" == typeof u4.$$FORM_ACTION && (e3.$$FORM_ACTION = function(e4) {
      e4 = u4.$$FORM_ACTION(e4), void 0 !== r4 && (r4 += "", e4.action = r4);
      var t4 = e4.data;
      return t4 && (null === o5 && (o5 = void 0 !== r4 ? "p" + r4 : "k" + murmurhash3_32_gc$1(JSON.stringify([a5, null, n3]), 0)), t4.append("$ACTION_KEY", o5)), e4;
    }), [t3, e3, false];
  }
  var c4 = e3.bind(null, t3);
  return [t3, function(e4) {
    c4(e4);
  }, false];
}
function unwrapThenable$1(e3) {
  var t3 = Ms;
  return Ms += 1, null === Os && (Os = []), function(e4, t4, r4) {
    switch (void 0 === (r4 = e4[r4]) ? e4.push(t4) : r4 !== t4 && (t4.then(noop$2$1, noop$2$1), t4 = r4), t4.status) {
      case "fulfilled":
        return t4.value;
      case "rejected":
        throw t4.reason;
      default:
        switch ("string" == typeof t4.status ? t4.then(noop$2$1, noop$2$1) : ((e4 = t4).status = "pending", e4.then(function(e5) {
          if ("pending" === t4.status) {
            var r5 = t4;
            r5.status = "fulfilled", r5.value = e5;
          }
        }, function(e5) {
          if ("pending" === t4.status) {
            var r5 = t4;
            r5.status = "rejected", r5.reason = e5;
          }
        })), t4.status) {
          case "fulfilled":
            return t4.value;
          case "rejected":
            throw t4.reason;
        }
        throw ks = t4, Ss;
    }
  }(Os, e3, t3);
}
function unsupportedRefresh$1() {
  throw Error("Cache cannot be refreshed during server rendering.");
}
function noop$1$1() {
}
function prepareStackTrace(e3, t3) {
  e3 = (e3.name || "Error") + ": " + (e3.message || "");
  for (var r4 = 0; r4 < t3.length; r4++) e3 += "\n    at " + t3[r4].toString();
  return e3;
}
function describeBuiltInComponentFrame$1(e3) {
  if (void 0 === Ls) try {
    throw Error();
  } catch (e4) {
    var t3 = e4.stack.trim().match(/\n( *(at )?)/);
    Ls = t3 && t3[1] || "", Ds = -1 < e4.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e4.stack.indexOf("@") ? "@unknown:0:0" : "";
  }
  return "\n" + Ls + e3 + Ds;
}
function describeNativeComponentFrame$1(e3, t3) {
  if (!e3 || qs) return "";
  qs = true;
  var r4 = Error.prepareStackTrace;
  Error.prepareStackTrace = prepareStackTrace;
  try {
    var n3 = { DetermineComponentFrameRoot: /* @__PURE__ */ __name(function() {
      try {
        if (t3) {
          var Fake = /* @__PURE__ */ __name(function() {
            throw Error();
          }, "Fake");
          if (Object.defineProperty(Fake.prototype, "props", { set: /* @__PURE__ */ __name(function() {
            throw Error();
          }, "set") }), "object" == typeof Reflect && Reflect.construct) {
            try {
              Reflect.construct(Fake, []);
            } catch (e4) {
              var r5 = e4;
            }
            Reflect.construct(e3, [], Fake);
          } else {
            try {
              Fake.call();
            } catch (e4) {
              r5 = e4;
            }
            e3.call(Fake.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (e4) {
            r5 = e4;
          }
          (Fake = e3()) && "function" == typeof Fake.catch && Fake.catch(function() {
          });
        }
      } catch (e4) {
        if (e4 && r5 && "string" == typeof e4.stack) return [e4.stack, r5.stack];
      }
      return [null, null];
    }, "DetermineComponentFrameRoot") };
    n3.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
    var s4 = Object.getOwnPropertyDescriptor(n3.DetermineComponentFrameRoot, "name");
    s4 && s4.configurable && Object.defineProperty(n3.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
    var o5 = n3.DetermineComponentFrameRoot(), a5 = o5[0], i5 = o5[1];
    if (a5 && i5) {
      var l4 = a5.split("\n"), u4 = i5.split("\n");
      for (s4 = n3 = 0; n3 < l4.length && !l4[n3].includes("DetermineComponentFrameRoot"); ) n3++;
      for (; s4 < u4.length && !u4[s4].includes("DetermineComponentFrameRoot"); ) s4++;
      if (n3 === l4.length || s4 === u4.length) for (n3 = l4.length - 1, s4 = u4.length - 1; 1 <= n3 && 0 <= s4 && l4[n3] !== u4[s4]; ) s4--;
      for (; 1 <= n3 && 0 <= s4; n3--, s4--) if (l4[n3] !== u4[s4]) {
        if (1 !== n3 || 1 !== s4) do {
          if (n3--, 0 > --s4 || l4[n3] !== u4[s4]) {
            var c4 = "\n" + l4[n3].replace(" at new ", " at ");
            return e3.displayName && c4.includes("<anonymous>") && (c4 = c4.replace("<anonymous>", e3.displayName)), c4;
          }
        } while (1 <= n3 && 0 <= s4);
        break;
      }
    }
  } finally {
    qs = false, Error.prepareStackTrace = r4;
  }
  return (r4 = e3 ? e3.displayName || e3.name : "") ? describeBuiltInComponentFrame$1(r4) : "";
}
function describeComponentStackByType$1(e3) {
  if ("string" == typeof e3) return describeBuiltInComponentFrame$1(e3);
  if ("function" == typeof e3) return e3.prototype && e3.prototype.isReactComponent ? describeNativeComponentFrame$1(e3, true) : describeNativeComponentFrame$1(e3, false);
  if ("object" == typeof e3 && null !== e3) {
    switch (e3.$$typeof) {
      case Ft:
        return describeNativeComponentFrame$1(e3.render, false);
      case _t:
        return describeNativeComponentFrame$1(e3.type, false);
      case Mt:
        var t3 = e3, r4 = t3._payload;
        t3 = t3._init;
        try {
          e3 = t3(r4);
        } catch (e4) {
          return describeBuiltInComponentFrame$1("Lazy");
        }
        return describeComponentStackByType$1(e3);
    }
    if ("string" == typeof e3.name) return r4 = e3.env, describeBuiltInComponentFrame$1(e3.name + (r4 ? " [" + r4 + "]" : ""));
  }
  switch (e3) {
    case At:
      return describeBuiltInComponentFrame$1("SuspenseList");
    case It:
      return describeBuiltInComponentFrame$1("Suspense");
  }
  return "";
}
function defaultErrorHandler$1(e3) {
  if ("object" == typeof e3 && null !== e3 && "string" == typeof e3.environmentName) {
    var t3 = e3.environmentName;
    "string" == typeof (e3 = [e3].slice(0))[0] ? e3.splice(0, 1, "\x1B[0m\x1B[7m%c%s\x1B[0m%c " + e3[0], "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px", " " + t3 + " ", "") : e3.splice(0, 0, "\x1B[0m\x1B[7m%c%s\x1B[0m%c ", "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px", " " + t3 + " ", ""), e3.unshift(console), (t3 = us.apply(console.error, e3))();
  } else console.error(e3);
  return null;
}
function noop$3() {
}
function RequestInstance$1(e3, t3, r4, n3, s4, o5, a5, i5, l4, u4, c4) {
  var d4 = /* @__PURE__ */ new Set();
  this.destination = null, this.flushScheduled = false, this.resumableState = e3, this.renderState = t3, this.rootFormatContext = r4, this.progressiveChunkSize = void 0 === n3 ? 12800 : n3, this.status = 10, this.fatalError = null, this.pendingRootTasks = this.allPendingTasks = this.nextSegmentId = 0, this.completedPreambleSegments = this.completedRootSegment = null, this.abortableTasks = d4, this.pingedTasks = [], this.clientRenderedBoundaries = [], this.completedBoundaries = [], this.partialBoundaries = [], this.trackedPostpones = null, this.onError = void 0 === s4 ? defaultErrorHandler$1 : s4, this.onPostpone = void 0 === u4 ? noop$3 : u4, this.onAllReady = void 0 === o5 ? noop$3 : o5, this.onShellReady = void 0 === a5 ? noop$3 : a5, this.onShellError = void 0 === i5 ? noop$3 : i5, this.onFatalError = void 0 === l4 ? noop$3 : l4, this.formState = void 0 === c4 ? null : c4;
}
function createRequest$1(e3, t3, r4, n3, s4, o5, a5, i5, l4, u4, c4, d4) {
  return (r4 = createPendingSegment$1(t3 = new RequestInstance$1(t3, r4, n3, s4, o5, a5, i5, l4, u4, c4, d4), 0, null, n3, false, false)).parentFlushed = true, pushComponentStack$1(e3 = createRenderTask$1(t3, null, e3, -1, null, r4, null, null, t3.abortableTasks, null, n3, null, gs, null, false)), t3.pingedTasks.push(e3), t3;
}
function resolveRequest() {
  if (Us) return Us;
  if (cs) {
    var e3 = ds.getStore();
    if (e3) return e3;
  }
  return null;
}
function pingTask$1(e3, t3) {
  e3.pingedTasks.push(t3), 1 === e3.pingedTasks.length && (e3.flushScheduled = null !== e3.destination, null !== e3.trackedPostpones || 10 === e3.status ? qt(function() {
    return performWork$1(e3);
  }) : setTimeout(function() {
    return performWork$1(e3);
  }, 0));
}
function createSuspenseBoundary$1(e3, t3, r4, n3) {
  return { status: 0, rootSegmentID: -1, parentFlushed: false, pendingTasks: 0, completedSegments: [], byteSize: 0, fallbackAbortableTasks: t3, errorDigest: null, contentState: createHoistableState$1(), fallbackState: createHoistableState$1(), contentPreamble: r4, fallbackPreamble: n3, trackedContentKeyPath: null, trackedFallbackNode: null };
}
function createRenderTask$1(e3, t3, r4, n3, s4, o5, a5, i5, l4, u4, c4, d4, h4, p4, f4) {
  e3.allPendingTasks++, null === s4 ? e3.pendingRootTasks++ : s4.pendingTasks++;
  var m5 = { replay: null, node: r4, childIndex: n3, ping: /* @__PURE__ */ __name(function() {
    return pingTask$1(e3, m5);
  }, "ping"), blockedBoundary: s4, blockedSegment: o5, blockedPreamble: a5, hoistableState: i5, abortSet: l4, keyPath: u4, formatContext: c4, context: d4, treeContext: h4, componentStack: p4, thenableState: t3, isFallback: f4 };
  return l4.add(m5), m5;
}
function createReplayTask$1(e3, t3, r4, n3, s4, o5, a5, i5, l4, u4, c4, d4, h4, p4) {
  e3.allPendingTasks++, null === o5 ? e3.pendingRootTasks++ : o5.pendingTasks++, r4.pendingTasks++;
  var f4 = { replay: r4, node: n3, childIndex: s4, ping: /* @__PURE__ */ __name(function() {
    return pingTask$1(e3, f4);
  }, "ping"), blockedBoundary: o5, blockedSegment: null, blockedPreamble: null, hoistableState: a5, abortSet: i5, keyPath: l4, formatContext: u4, context: c4, treeContext: d4, componentStack: h4, thenableState: t3, isFallback: p4 };
  return i5.add(f4), f4;
}
function createPendingSegment$1(e3, t3, r4, n3, s4, o5) {
  return { status: 0, parentFlushed: false, id: -1, index: t3, chunks: [], children: [], preambleChildren: [], parentFormatContext: n3, boundary: r4, lastPushedText: s4, textEmbedded: o5 };
}
function pushComponentStack$1(e3) {
  var t3 = e3.node;
  if ("object" == typeof t3 && null !== t3 && t3.$$typeof === wt) e3.componentStack = { parent: e3.componentStack, type: t3.type };
}
function getThrownInfo$1(e3) {
  var t3 = {};
  return e3 && Object.defineProperty(t3, "componentStack", { configurable: true, enumerable: true, get: /* @__PURE__ */ __name(function() {
    try {
      var r4 = "", n3 = e3;
      do {
        r4 += describeComponentStackByType$1(n3.type), n3 = n3.parent;
      } while (n3);
      var s4 = r4;
    } catch (e4) {
      s4 = "\nError generating stack: " + e4.message + "\n" + e4.stack;
    }
    return Object.defineProperty(t3, "componentStack", { value: s4 }), s4;
  }, "get") }), t3;
}
function logRecoverableError$1(e3, t3, r4) {
  if (null == (t3 = (e3 = e3.onError)(t3, r4)) || "string" == typeof t3) return t3;
}
function fatalError$1(e3, t3) {
  var r4 = e3.onShellError, n3 = e3.onFatalError;
  r4(t3), n3(t3), null !== e3.destination ? (e3.status = 14, closeWithError(e3.destination, t3)) : (e3.status = 13, e3.fatalError = t3);
}
function renderWithHooks$1(e3, t3, r4, n3, s4, o5) {
  var a5 = t3.thenableState;
  for (t3.thenableState = null, Cs = {}, xs = t3, Ps = e3, Rs = r4, As = Is = 0, _s = -1, Ms = 0, Os = a5, e3 = n3(s4, o5); Fs; ) Fs = false, As = Is = 0, _s = -1, Ms = 0, js += 1, $s = null, e3 = n3(s4, o5);
  return resetHooksState$1(), e3;
}
function finishFunctionComponent$1(e3, t3, r4, n3, s4, o5, a5) {
  var i5 = false;
  if (0 !== o5 && null !== e3.formState) {
    var l4 = t3.blockedSegment;
    if (null !== l4) {
      i5 = true, l4 = l4.chunks;
      for (var u4 = 0; u4 < o5; u4++) u4 === a5 ? l4.push(Or) : l4.push(Nr);
    }
  }
  o5 = t3.keyPath, t3.keyPath = r4, s4 ? (r4 = t3.treeContext, t3.treeContext = pushTreeContext$1(r4, 1, 0), renderNode$1(e3, t3, n3, -1), t3.treeContext = r4) : i5 ? renderNode$1(e3, t3, n3, -1) : renderNodeDestructive$1(e3, t3, n3, -1), t3.keyPath = o5;
}
function renderElement$1(e3, t3, r4, n3, s4, o5) {
  if ("function" == typeof n3) if (n3.prototype && n3.prototype.isReactComponent) {
    var a5 = s4;
    if ("ref" in s4) for (var i5 in a5 = {}, s4) "ref" !== i5 && (a5[i5] = s4[i5]);
    var l4 = n3.defaultProps;
    if (l4) for (var u4 in a5 === s4 && (a5 = Kt({}, a5, s4)), l4) void 0 === a5[u4] && (a5[u4] = l4[u4]);
    s4 = a5, a5 = ps, "object" == typeof (l4 = n3.contextType) && null !== l4 && (a5 = l4._currentValue);
    var c4 = void 0 !== (a5 = new n3(s4, a5)).state ? a5.state : null;
    if (a5.updater = ms, a5.props = s4, a5.state = c4, l4 = { queue: [], replace: false }, a5._reactInternals = l4, o5 = n3.contextType, a5.context = "object" == typeof o5 && null !== o5 ? o5._currentValue : ps, "function" == typeof (o5 = n3.getDerivedStateFromProps) && (c4 = null == (o5 = o5(s4, c4)) ? c4 : Kt({}, c4, o5), a5.state = c4), "function" != typeof n3.getDerivedStateFromProps && "function" != typeof a5.getSnapshotBeforeUpdate && ("function" == typeof a5.UNSAFE_componentWillMount || "function" == typeof a5.componentWillMount)) if (n3 = a5.state, "function" == typeof a5.componentWillMount && a5.componentWillMount(), "function" == typeof a5.UNSAFE_componentWillMount && a5.UNSAFE_componentWillMount(), n3 !== a5.state && ms.enqueueReplaceState(a5, a5.state, null), null !== l4.queue && 0 < l4.queue.length) if (n3 = l4.queue, o5 = l4.replace, l4.queue = null, l4.replace = false, o5 && 1 === n3.length) a5.state = n3[0];
    else {
      for (l4 = o5 ? n3[0] : a5.state, c4 = true, o5 = o5 ? 1 : 0; o5 < n3.length; o5++) null != (u4 = "function" == typeof (u4 = n3[o5]) ? u4.call(a5, l4, s4, void 0) : u4) && (c4 ? (c4 = false, l4 = Kt({}, l4, u4)) : Kt(l4, u4));
      a5.state = l4;
    }
    else l4.queue = null;
    if (n3 = a5.render(), 12 === e3.status) throw null;
    s4 = t3.keyPath, t3.keyPath = r4, renderNodeDestructive$1(e3, t3, n3, -1), t3.keyPath = s4;
  } else {
    if (n3 = renderWithHooks$1(e3, t3, r4, n3, s4, void 0), 12 === e3.status) throw null;
    finishFunctionComponent$1(e3, t3, r4, n3, 0 !== Is, As, _s);
  }
  else {
    if ("string" != typeof n3) {
      switch (n3) {
        case jt:
        case Pt:
        case Rt:
        case xt:
          return n3 = t3.keyPath, t3.keyPath = r4, renderNodeDestructive$1(e3, t3, s4.children, -1), void (t3.keyPath = n3);
        case Nt:
          return void ("hidden" !== s4.mode && (n3 = t3.keyPath, t3.keyPath = r4, renderNodeDestructive$1(e3, t3, s4.children, -1), t3.keyPath = n3));
        case At:
          return n3 = t3.keyPath, t3.keyPath = r4, renderNodeDestructive$1(e3, t3, s4.children, -1), void (t3.keyPath = n3);
        case Dt:
        case Ot:
          throw Error("ReactDOMServer does not yet support scope components.");
        case It:
          e: if (null !== t3.replay) {
            n3 = t3.keyPath, t3.keyPath = r4, r4 = s4.children;
            try {
              renderNode$1(e3, t3, r4, -1);
            } finally {
              t3.keyPath = n3;
            }
          } else {
            n3 = t3.keyPath;
            var d4 = t3.blockedBoundary;
            o5 = t3.blockedPreamble;
            var h4 = t3.hoistableState;
            u4 = t3.blockedSegment, i5 = s4.fallback, s4 = s4.children;
            var p4 = /* @__PURE__ */ new Set(), f4 = 2 > t3.formatContext.insertionMode ? createSuspenseBoundary$1(0, p4, { htmlChunks: null, headChunks: null, bodyChunks: null, contribution: 0 }, { htmlChunks: null, headChunks: null, bodyChunks: null, contribution: 0 }) : createSuspenseBoundary$1(0, p4, null, null);
            null !== e3.trackedPostpones && (f4.trackedContentKeyPath = r4);
            var m5 = createPendingSegment$1(0, u4.chunks.length, f4, t3.formatContext, false, false);
            u4.children.push(m5), u4.lastPushedText = false;
            var g3 = createPendingSegment$1(0, 0, null, t3.formatContext, false, false);
            if (g3.parentFlushed = true, null !== e3.trackedPostpones) {
              l4 = [(a5 = [r4[0], "Suspense Fallback", r4[2]])[1], a5[2], [], null], e3.trackedPostpones.workingMap.set(a5, l4), f4.trackedFallbackNode = l4, t3.blockedSegment = m5, t3.blockedPreamble = f4.fallbackPreamble, t3.keyPath = a5, m5.status = 6;
              try {
                renderNode$1(e3, t3, i5, -1), m5.lastPushedText && m5.textEmbedded && m5.chunks.push(Sr), m5.status = 1;
              } catch (t4) {
                throw m5.status = 12 === e3.status ? 3 : 4, t4;
              } finally {
                t3.blockedSegment = u4, t3.blockedPreamble = o5, t3.keyPath = n3;
              }
              pushComponentStack$1(t3 = createRenderTask$1(e3, null, s4, -1, f4, g3, f4.contentPreamble, f4.contentState, t3.abortSet, r4, t3.formatContext, t3.context, t3.treeContext, t3.componentStack, t3.isFallback)), e3.pingedTasks.push(t3);
            } else {
              t3.blockedBoundary = f4, t3.blockedPreamble = f4.contentPreamble, t3.hoistableState = f4.contentState, t3.blockedSegment = g3, t3.keyPath = r4, g3.status = 6;
              try {
                if (renderNode$1(e3, t3, s4, -1), g3.lastPushedText && g3.textEmbedded && g3.chunks.push(Sr), g3.status = 1, queueCompletedSegment$1(f4, g3), 0 === f4.pendingTasks && 0 === f4.status) {
                  f4.status = 1, 0 === e3.pendingRootTasks && t3.blockedPreamble && preparePreamble$1(e3);
                  break e;
                }
              } catch (r5) {
                f4.status = 4, 12 === e3.status ? (g3.status = 3, a5 = e3.fatalError) : (g3.status = 4, a5 = r5), c4 = logRecoverableError$1(e3, a5, l4 = getThrownInfo$1(t3.componentStack)), f4.errorDigest = c4, untrackBoundary$1(e3, f4);
              } finally {
                t3.blockedBoundary = d4, t3.blockedPreamble = o5, t3.hoistableState = h4, t3.blockedSegment = u4, t3.keyPath = n3;
              }
              pushComponentStack$1(t3 = createRenderTask$1(e3, null, i5, -1, d4, m5, f4.fallbackPreamble, f4.fallbackState, p4, [r4[0], "Suspense Fallback", r4[2]], t3.formatContext, t3.context, t3.treeContext, t3.componentStack, true)), e3.pingedTasks.push(t3);
            }
          }
          return;
      }
      if ("object" == typeof n3 && null !== n3) switch (n3.$$typeof) {
        case Ft:
          if ("ref" in s4) for (f4 in a5 = {}, s4) "ref" !== f4 && (a5[f4] = s4[f4]);
          else a5 = s4;
          return void finishFunctionComponent$1(e3, t3, r4, n3 = renderWithHooks$1(e3, t3, r4, n3.render, a5, o5), 0 !== Is, As, _s);
        case _t:
          return void renderElement$1(e3, t3, r4, n3.type, s4, o5);
        case Tt:
        case Et:
          if (l4 = s4.children, a5 = t3.keyPath, s4 = s4.value, c4 = n3._currentValue, n3._currentValue = s4, fs = n3 = { parent: o5 = fs, depth: null === o5 ? 0 : o5.depth + 1, context: n3, parentValue: c4, value: s4 }, t3.context = n3, t3.keyPath = r4, renderNodeDestructive$1(e3, t3, l4, -1), null === (e3 = fs)) throw Error("Tried to pop a Context at the root of the app. This is a bug in React.");
          return e3.context._currentValue = e3.parentValue, e3 = fs = e3.parent, t3.context = e3, void (t3.keyPath = a5);
        case $t:
          return n3 = (s4 = s4.children)(n3._context._currentValue), s4 = t3.keyPath, t3.keyPath = r4, renderNodeDestructive$1(e3, t3, n3, -1), void (t3.keyPath = s4);
        case Mt:
          if (n3 = (a5 = n3._init)(n3._payload), 12 === e3.status) throw null;
          return void renderElement$1(e3, t3, r4, n3, s4, o5);
      }
      throw Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + (null == n3 ? n3 : typeof n3) + ".");
    }
    if (null === (a5 = t3.blockedSegment)) a5 = s4.children, l4 = t3.formatContext, c4 = t3.keyPath, t3.formatContext = getChildFormatContext$1(l4, n3, s4), t3.keyPath = r4, renderNode$1(e3, t3, a5, -1), t3.formatContext = l4, t3.keyPath = c4;
    else {
      o5 = pushStartInstance$1(a5.chunks, n3, s4, e3.resumableState, e3.renderState, t3.blockedPreamble, t3.hoistableState, t3.formatContext, a5.lastPushedText, t3.isFallback), a5.lastPushedText = false, l4 = t3.formatContext, c4 = t3.keyPath, t3.keyPath = r4, 3 === (t3.formatContext = getChildFormatContext$1(l4, n3, s4)).insertionMode ? (r4 = createPendingSegment$1(0, 0, null, t3.formatContext, false, false), a5.preambleChildren.push(r4), pushComponentStack$1(r4 = createRenderTask$1(e3, null, o5, -1, t3.blockedBoundary, r4, t3.blockedPreamble, t3.hoistableState, e3.abortableTasks, t3.keyPath, t3.formatContext, t3.context, t3.treeContext, t3.componentStack, t3.isFallback)), e3.pingedTasks.push(r4)) : renderNode$1(e3, t3, o5, -1), t3.formatContext = l4, t3.keyPath = c4;
      e: {
        switch (t3 = a5.chunks, e3 = e3.resumableState, n3) {
          case "title":
          case "style":
          case "script":
          case "area":
          case "base":
          case "br":
          case "col":
          case "embed":
          case "hr":
          case "img":
          case "input":
          case "keygen":
          case "link":
          case "meta":
          case "param":
          case "source":
          case "track":
          case "wbr":
            break e;
          case "body":
            if (1 >= l4.insertionMode) {
              e3.hasBody = true;
              break e;
            }
            break;
          case "html":
            if (0 === l4.insertionMode) {
              e3.hasHtml = true;
              break e;
            }
            break;
          case "head":
            if (1 >= l4.insertionMode) break e;
        }
        t3.push(endChunkForTag$1(n3));
      }
      a5.lastPushedText = false;
    }
  }
}
function resumeNode$1(e3, t3, r4, n3, s4) {
  var o5 = t3.replay, a5 = t3.blockedBoundary, i5 = createPendingSegment$1(0, 0, null, t3.formatContext, false, false);
  i5.id = r4, i5.parentFlushed = true;
  try {
    t3.replay = null, t3.blockedSegment = i5, renderNode$1(e3, t3, n3, s4), i5.status = 1, null === a5 ? e3.completedRootSegment = i5 : (queueCompletedSegment$1(a5, i5), a5.parentFlushed && e3.partialBoundaries.push(a5));
  } finally {
    t3.replay = o5, t3.blockedSegment = null;
  }
}
function renderNodeDestructive$1(e3, t3, r4, n3) {
  null !== t3.replay && "number" == typeof t3.replay.slots ? resumeNode$1(e3, t3, t3.replay.slots, r4, n3) : (t3.node = r4, t3.childIndex = n3, r4 = t3.componentStack, pushComponentStack$1(t3), retryNode$1(e3, t3), t3.componentStack = r4);
}
function retryNode$1(e3, t3) {
  var r4 = t3.node, n3 = t3.childIndex;
  if (null !== r4) {
    if ("object" == typeof r4) {
      switch (r4.$$typeof) {
        case wt:
          var s4 = r4.type, o5 = r4.key, a5 = r4.props, i5 = void 0 !== (r4 = a5.ref) ? r4 : null, l4 = getComponentNameFromType$1(s4), u4 = null == o5 ? -1 === n3 ? 0 : n3 : o5;
          if (o5 = [t3.keyPath, l4, u4], null !== t3.replay) e: {
            var c4 = t3.replay;
            for (n3 = c4.nodes, r4 = 0; r4 < n3.length; r4++) {
              var d4 = n3[r4];
              if (u4 === d4[1]) {
                if (4 === d4.length) {
                  if (null !== l4 && l4 !== d4[0]) throw Error("Expected the resume to render <" + d4[0] + "> in this slot but instead it rendered <" + l4 + ">. The tree doesn't match so React will fallback to client rendering.");
                  var h4 = d4[2];
                  l4 = d4[3], u4 = t3.node, t3.replay = { nodes: h4, slots: l4, pendingTasks: 1 };
                  try {
                    if (renderElement$1(e3, t3, o5, s4, a5, i5), 1 === t3.replay.pendingTasks && 0 < t3.replay.nodes.length) throw Error("Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.");
                    t3.replay.pendingTasks--;
                  } catch (r5) {
                    if ("object" == typeof r5 && null !== r5 && (r5 === Ss || "function" == typeof r5.then)) throw t3.node === u4 && (t3.replay = c4), r5;
                    t3.replay.pendingTasks--, a5 = getThrownInfo$1(t3.componentStack), abortRemainingReplayNodes$1(e3, o5 = t3.blockedBoundary, h4, l4, s4 = r5, a5 = logRecoverableError$1(e3, s4, a5));
                  }
                  t3.replay = c4;
                } else {
                  if (s4 !== It) throw Error("Expected the resume to render <Suspense> in this slot but instead it rendered <" + (getComponentNameFromType$1(s4) || "Unknown") + ">. The tree doesn't match so React will fallback to client rendering.");
                  t: {
                    c4 = void 0, s4 = d4[5], i5 = d4[2], l4 = d4[3], u4 = null === d4[4] ? [] : d4[4][2], d4 = null === d4[4] ? null : d4[4][3];
                    var p4 = t3.keyPath, f4 = t3.replay, m5 = t3.blockedBoundary, g3 = t3.hoistableState, y3 = a5.children, v3 = a5.fallback, b3 = /* @__PURE__ */ new Set();
                    (a5 = 2 > t3.formatContext.insertionMode ? createSuspenseBoundary$1(0, b3, createPreambleState$1(), createPreambleState$1()) : createSuspenseBoundary$1(0, b3, null, null)).parentFlushed = true, a5.rootSegmentID = s4, t3.blockedBoundary = a5, t3.hoistableState = a5.contentState, t3.keyPath = o5, t3.replay = { nodes: i5, slots: l4, pendingTasks: 1 };
                    try {
                      if (renderNode$1(e3, t3, y3, -1), 1 === t3.replay.pendingTasks && 0 < t3.replay.nodes.length) throw Error("Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.");
                      if (t3.replay.pendingTasks--, 0 === a5.pendingTasks && 0 === a5.status) {
                        a5.status = 1, e3.completedBoundaries.push(a5);
                        break t;
                      }
                    } catch (r5) {
                      a5.status = 4, c4 = logRecoverableError$1(e3, r5, h4 = getThrownInfo$1(t3.componentStack)), a5.errorDigest = c4, t3.replay.pendingTasks--, e3.clientRenderedBoundaries.push(a5);
                    } finally {
                      t3.blockedBoundary = m5, t3.hoistableState = g3, t3.replay = f4, t3.keyPath = p4;
                    }
                    pushComponentStack$1(t3 = createReplayTask$1(e3, null, { nodes: u4, slots: d4, pendingTasks: 0 }, v3, -1, m5, a5.fallbackState, b3, [o5[0], "Suspense Fallback", o5[2]], t3.formatContext, t3.context, t3.treeContext, t3.componentStack, true)), e3.pingedTasks.push(t3);
                  }
                }
                n3.splice(r4, 1);
                break e;
              }
            }
          }
          else renderElement$1(e3, t3, o5, s4, a5, i5);
          return;
        case Ct:
          throw Error("Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.");
        case Mt:
          if (r4 = (h4 = r4._init)(r4._payload), 12 === e3.status) throw null;
          return void renderNodeDestructive$1(e3, t3, r4, n3);
      }
      if (Ht(r4)) return void renderChildrenArray$1(e3, t3, r4, n3);
      if (null === r4 || "object" != typeof r4 ? h4 = null : h4 = "function" == typeof (h4 = Bt && r4[Bt] || r4["@@iterator"]) ? h4 : null, h4 && (h4 = h4.call(r4))) {
        if (!(r4 = h4.next()).done) {
          a5 = [];
          do {
            a5.push(r4.value), r4 = h4.next();
          } while (!r4.done);
          renderChildrenArray$1(e3, t3, a5, n3);
        }
        return;
      }
      if ("function" == typeof r4.then) return t3.thenableState = null, renderNodeDestructive$1(e3, t3, unwrapThenable$1(r4), n3);
      if (r4.$$typeof === Et) return renderNodeDestructive$1(e3, t3, r4._currentValue, n3);
      throw n3 = Object.prototype.toString.call(r4), Error("Objects are not valid as a React child (found: " + ("[object Object]" === n3 ? "object with keys {" + Object.keys(r4).join(", ") + "}" : n3) + "). If you meant to render a collection of children, use an array instead.");
    }
    "string" == typeof r4 ? null !== (n3 = t3.blockedSegment) && (n3.lastPushedText = pushTextInstance$1(n3.chunks, r4, e3.renderState, n3.lastPushedText)) : "number" != typeof r4 && "bigint" != typeof r4 || null !== (n3 = t3.blockedSegment) && (n3.lastPushedText = pushTextInstance$1(n3.chunks, "" + r4, e3.renderState, n3.lastPushedText));
  }
}
function renderChildrenArray$1(e3, t3, r4, n3) {
  var s4 = t3.keyPath;
  if (-1 === n3 || (t3.keyPath = [t3.keyPath, "Fragment", n3], null === t3.replay)) {
    if (o5 = t3.treeContext, a5 = r4.length, null !== t3.replay && (null !== (i5 = t3.replay.slots) && "object" == typeof i5)) {
      for (n3 = 0; n3 < a5; n3++) l4 = r4[n3], t3.treeContext = pushTreeContext$1(o5, a5, n3), "number" == typeof (u4 = i5[n3]) ? (resumeNode$1(e3, t3, u4, l4, n3), delete i5[n3]) : renderNode$1(e3, t3, l4, n3);
      return t3.treeContext = o5, void (t3.keyPath = s4);
    }
    for (i5 = 0; i5 < a5; i5++) n3 = r4[i5], t3.treeContext = pushTreeContext$1(o5, a5, i5), renderNode$1(e3, t3, n3, i5);
    t3.treeContext = o5, t3.keyPath = s4;
  } else {
    for (var o5 = t3.replay, a5 = o5.nodes, i5 = 0; i5 < a5.length; i5++) {
      var l4 = a5[i5];
      if (l4[1] === n3) {
        n3 = l4[2], l4 = l4[3], t3.replay = { nodes: n3, slots: l4, pendingTasks: 1 };
        try {
          if (renderChildrenArray$1(e3, t3, r4, -1), 1 === t3.replay.pendingTasks && 0 < t3.replay.nodes.length) throw Error("Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.");
          t3.replay.pendingTasks--;
        } catch (s5) {
          if ("object" == typeof s5 && null !== s5 && (s5 === Ss || "function" == typeof s5.then)) throw s5;
          t3.replay.pendingTasks--, r4 = getThrownInfo$1(t3.componentStack);
          var u4 = t3.blockedBoundary;
          abortRemainingReplayNodes$1(e3, u4, n3, l4, s5, r4 = logRecoverableError$1(e3, s5, r4));
        }
        t3.replay = o5, a5.splice(i5, 1);
        break;
      }
    }
    t3.keyPath = s4;
  }
}
function untrackBoundary$1(e3, t3) {
  null !== (e3 = e3.trackedPostpones) && (null !== (t3 = t3.trackedContentKeyPath) && (void 0 !== (t3 = e3.workingMap.get(t3)) && (t3.length = 4, t3[2] = [], t3[3] = null)));
}
function spawnNewSuspendedReplayTask$1(e3, t3, r4) {
  return createReplayTask$1(e3, r4, t3.replay, t3.node, t3.childIndex, t3.blockedBoundary, t3.hoistableState, t3.abortSet, t3.keyPath, t3.formatContext, t3.context, t3.treeContext, t3.componentStack, t3.isFallback);
}
function spawnNewSuspendedRenderTask$1(e3, t3, r4) {
  var n3 = t3.blockedSegment, s4 = createPendingSegment$1(0, n3.chunks.length, null, t3.formatContext, n3.lastPushedText, true);
  return n3.children.push(s4), n3.lastPushedText = false, createRenderTask$1(e3, r4, t3.node, t3.childIndex, t3.blockedBoundary, s4, t3.blockedPreamble, t3.hoistableState, t3.abortSet, t3.keyPath, t3.formatContext, t3.context, t3.treeContext, t3.componentStack, t3.isFallback);
}
function renderNode$1(e3, t3, r4, n3) {
  var s4 = t3.formatContext, o5 = t3.context, a5 = t3.keyPath, i5 = t3.treeContext, l4 = t3.componentStack, u4 = t3.blockedSegment;
  if (null === u4) try {
    return renderNodeDestructive$1(e3, t3, r4, n3);
  } catch (u5) {
    if (resetHooksState$1(), "object" == typeof (r4 = u5 === Ss ? getSuspendedThenable$1() : u5) && null !== r4) {
      if ("function" == typeof r4.then) return e3 = spawnNewSuspendedReplayTask$1(e3, t3, n3 = getThenableStateAfterSuspending$1()).ping, r4.then(e3, e3), t3.formatContext = s4, t3.context = o5, t3.keyPath = a5, t3.treeContext = i5, t3.componentStack = l4, void switchContext$1(o5);
      if ("Maximum call stack size exceeded" === r4.message) return r4 = spawnNewSuspendedReplayTask$1(e3, t3, r4 = getThenableStateAfterSuspending$1()), e3.pingedTasks.push(r4), t3.formatContext = s4, t3.context = o5, t3.keyPath = a5, t3.treeContext = i5, t3.componentStack = l4, void switchContext$1(o5);
    }
  }
  else {
    var c4 = u4.children.length, d4 = u4.chunks.length;
    try {
      return renderNodeDestructive$1(e3, t3, r4, n3);
    } catch (h4) {
      if (resetHooksState$1(), u4.children.length = c4, u4.chunks.length = d4, "object" == typeof (r4 = h4 === Ss ? getSuspendedThenable$1() : h4) && null !== r4) {
        if ("function" == typeof r4.then) return e3 = spawnNewSuspendedRenderTask$1(e3, t3, n3 = getThenableStateAfterSuspending$1()).ping, r4.then(e3, e3), t3.formatContext = s4, t3.context = o5, t3.keyPath = a5, t3.treeContext = i5, t3.componentStack = l4, void switchContext$1(o5);
        if ("Maximum call stack size exceeded" === r4.message) return r4 = spawnNewSuspendedRenderTask$1(e3, t3, r4 = getThenableStateAfterSuspending$1()), e3.pingedTasks.push(r4), t3.formatContext = s4, t3.context = o5, t3.keyPath = a5, t3.treeContext = i5, t3.componentStack = l4, void switchContext$1(o5);
      }
    }
  }
  throw t3.formatContext = s4, t3.context = o5, t3.keyPath = a5, t3.treeContext = i5, switchContext$1(o5), r4;
}
function abortTaskSoft$1(e3) {
  var t3 = e3.blockedBoundary;
  null !== (e3 = e3.blockedSegment) && (e3.status = 3, finishedTask$1(this, t3, e3));
}
function abortRemainingReplayNodes$1(e3, t3, r4, n3, s4, o5) {
  for (var a5 = 0; a5 < r4.length; a5++) {
    var i5 = r4[a5];
    if (4 === i5.length) abortRemainingReplayNodes$1(e3, t3, i5[2], i5[3], s4, o5);
    else {
      i5 = i5[5];
      var l4 = e3, u4 = o5, c4 = createSuspenseBoundary$1(0, /* @__PURE__ */ new Set(), null, null);
      c4.parentFlushed = true, c4.rootSegmentID = i5, c4.status = 4, c4.errorDigest = u4, c4.parentFlushed && l4.clientRenderedBoundaries.push(c4);
    }
  }
  if (r4.length = 0, null !== n3) {
    if (null === t3) throw Error("We should not have any resumable nodes in the shell. This is a bug in React.");
    if (4 !== t3.status && (t3.status = 4, t3.errorDigest = o5, t3.parentFlushed && e3.clientRenderedBoundaries.push(t3)), "object" == typeof n3) for (var d4 in n3) delete n3[d4];
  }
}
function abortTask$1(e3, t3, r4) {
  var n3 = e3.blockedBoundary, s4 = e3.blockedSegment;
  if (null !== s4) {
    if (6 === s4.status) return;
    s4.status = 3;
  }
  if (s4 = getThrownInfo$1(e3.componentStack), null === n3) {
    if (13 !== t3.status && 14 !== t3.status) {
      if (null === (n3 = e3.replay)) return logRecoverableError$1(t3, r4, s4), void fatalError$1(t3, r4);
      n3.pendingTasks--, 0 === n3.pendingTasks && 0 < n3.nodes.length && (e3 = logRecoverableError$1(t3, r4, s4), abortRemainingReplayNodes$1(t3, null, n3.nodes, n3.slots, r4, e3)), t3.pendingRootTasks--, 0 === t3.pendingRootTasks && completeShell$1(t3);
    }
  } else n3.pendingTasks--, 4 !== n3.status && (n3.status = 4, e3 = logRecoverableError$1(t3, r4, s4), n3.status = 4, n3.errorDigest = e3, untrackBoundary$1(t3, n3), n3.parentFlushed && t3.clientRenderedBoundaries.push(n3)), n3.fallbackAbortableTasks.forEach(function(e4) {
    return abortTask$1(e4, t3, r4);
  }), n3.fallbackAbortableTasks.clear();
  t3.allPendingTasks--, 0 === t3.allPendingTasks && completeAll$1(t3);
}
function safelyEmitEarlyPreloads$1(e3, t3) {
  try {
    var r4 = e3.renderState, n3 = r4.onHeaders;
    if (n3) {
      var s4 = r4.headers;
      if (s4) {
        r4.headers = null;
        var o5 = s4.preconnects;
        if (s4.fontPreloads && (o5 && (o5 += ", "), o5 += s4.fontPreloads), s4.highImagePreloads && (o5 && (o5 += ", "), o5 += s4.highImagePreloads), !t3) {
          var a5 = r4.styles.values(), i5 = a5.next();
          e: for (; 0 < s4.remainingCapacity && !i5.done; i5 = a5.next()) for (var l4 = i5.value.sheets.values(), u4 = l4.next(); 0 < s4.remainingCapacity && !u4.done; u4 = l4.next()) {
            var c4 = u4.value, d4 = c4.props, h4 = d4.href, p4 = c4.props, f4 = getPreloadAsHeader$1(p4.href, "style", { crossOrigin: p4.crossOrigin, integrity: p4.integrity, nonce: p4.nonce, type: p4.type, fetchPriority: p4.fetchPriority, referrerPolicy: p4.referrerPolicy, media: p4.media });
            if (!(0 <= (s4.remainingCapacity -= f4.length + 2))) break e;
            r4.resets.style[h4] = lr, o5 && (o5 += ", "), o5 += f4, r4.resets.style[h4] = "string" == typeof d4.crossOrigin || "string" == typeof d4.integrity ? [d4.crossOrigin, d4.integrity] : lr;
          }
        }
        n3(o5 ? { Link: o5 } : {});
      }
    }
  } catch (t4) {
    logRecoverableError$1(e3, t4, {});
  }
}
function completeShell$1(e3) {
  null === e3.trackedPostpones && safelyEmitEarlyPreloads$1(e3, true), null === e3.trackedPostpones && preparePreamble$1(e3), e3.onShellError = noop$3, (e3 = e3.onShellReady)();
}
function completeAll$1(e3) {
  safelyEmitEarlyPreloads$1(e3, null === e3.trackedPostpones || (null === e3.completedRootSegment || 5 !== e3.completedRootSegment.status)), preparePreamble$1(e3), (e3 = e3.onAllReady)();
}
function queueCompletedSegment$1(e3, t3) {
  if (0 === t3.chunks.length && 1 === t3.children.length && null === t3.children[0].boundary && -1 === t3.children[0].id) {
    var r4 = t3.children[0];
    r4.id = t3.id, r4.parentFlushed = true, 1 === r4.status && queueCompletedSegment$1(e3, r4);
  } else e3.completedSegments.push(t3);
}
function finishedTask$1(e3, t3, r4) {
  if (null === t3) {
    if (null !== r4 && r4.parentFlushed) {
      if (null !== e3.completedRootSegment) throw Error("There can only be one root segment. This is a bug in React.");
      e3.completedRootSegment = r4;
    }
    e3.pendingRootTasks--, 0 === e3.pendingRootTasks && completeShell$1(e3);
  } else t3.pendingTasks--, 4 !== t3.status && (0 === t3.pendingTasks ? (0 === t3.status && (t3.status = 1), null !== r4 && r4.parentFlushed && 1 === r4.status && queueCompletedSegment$1(t3, r4), t3.parentFlushed && e3.completedBoundaries.push(t3), 1 === t3.status && (t3.fallbackAbortableTasks.forEach(abortTaskSoft$1, e3), t3.fallbackAbortableTasks.clear(), 0 === e3.pendingRootTasks && null === e3.trackedPostpones && null !== t3.contentPreamble && preparePreamble$1(e3))) : null !== r4 && r4.parentFlushed && 1 === r4.status && (queueCompletedSegment$1(t3, r4), 1 === t3.completedSegments.length && t3.parentFlushed && e3.partialBoundaries.push(t3)));
  e3.allPendingTasks--, 0 === e3.allPendingTasks && completeAll$1(e3);
}
function performWork$1(e3) {
  if (14 !== e3.status && 13 !== e3.status) {
    var t3 = fs, r4 = sr.H;
    sr.H = Bs;
    var n3 = sr.A;
    sr.A = zs;
    var s4 = Us;
    Us = e3;
    var o5 = Hs;
    Hs = e3.resumableState;
    try {
      var a5, i5 = e3.pingedTasks;
      for (a5 = 0; a5 < i5.length; a5++) {
        var l4 = i5[a5], u4 = e3, c4 = l4.blockedSegment;
        if (null === c4) {
          var d4 = u4;
          if (0 !== l4.replay.pendingTasks) {
            switchContext$1(l4.context);
            try {
              if ("number" == typeof l4.replay.slots ? resumeNode$1(d4, l4, l4.replay.slots, l4.node, l4.childIndex) : retryNode$1(d4, l4), 1 === l4.replay.pendingTasks && 0 < l4.replay.nodes.length) throw Error("Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.");
              l4.replay.pendingTasks--, l4.abortSet.delete(l4), finishedTask$1(d4, l4.blockedBoundary, null);
            } catch (e4) {
              resetHooksState$1();
              var h4 = e4 === Ss ? getSuspendedThenable$1() : e4;
              if ("object" == typeof h4 && null !== h4 && "function" == typeof h4.then) {
                var p4 = l4.ping;
                h4.then(p4, p4), l4.thenableState = getThenableStateAfterSuspending$1();
              } else {
                l4.replay.pendingTasks--, l4.abortSet.delete(l4);
                var f4 = getThrownInfo$1(l4.componentStack);
                u4 = void 0;
                var m5 = d4, g3 = l4.blockedBoundary, y3 = 12 === d4.status ? d4.fatalError : h4;
                abortRemainingReplayNodes$1(m5, g3, l4.replay.nodes, l4.replay.slots, y3, u4 = logRecoverableError$1(m5, y3, f4)), d4.pendingRootTasks--, 0 === d4.pendingRootTasks && completeShell$1(d4), d4.allPendingTasks--, 0 === d4.allPendingTasks && completeAll$1(d4);
              }
            }
          }
        } else if (d4 = void 0, 0 === (m5 = c4).status) {
          m5.status = 6, switchContext$1(l4.context);
          var v3 = m5.children.length, b3 = m5.chunks.length;
          try {
            retryNode$1(u4, l4), m5.lastPushedText && m5.textEmbedded && m5.chunks.push(Sr), l4.abortSet.delete(l4), m5.status = 1, finishedTask$1(u4, l4.blockedBoundary, m5);
          } catch (e4) {
            resetHooksState$1(), m5.children.length = v3, m5.chunks.length = b3;
            var S4 = e4 === Ss ? getSuspendedThenable$1() : 12 === u4.status ? u4.fatalError : e4;
            if ("object" == typeof S4 && null !== S4 && "function" == typeof S4.then) {
              m5.status = 0, l4.thenableState = getThenableStateAfterSuspending$1();
              var k4 = l4.ping;
              S4.then(k4, k4);
            } else {
              var w4 = getThrownInfo$1(l4.componentStack);
              l4.abortSet.delete(l4), m5.status = 4;
              var C4 = l4.blockedBoundary;
              d4 = logRecoverableError$1(u4, S4, w4), null === C4 ? fatalError$1(u4, S4) : (C4.pendingTasks--, 4 !== C4.status && (C4.status = 4, C4.errorDigest = d4, untrackBoundary$1(u4, C4), C4.parentFlushed && u4.clientRenderedBoundaries.push(C4), 0 === u4.pendingRootTasks && null === u4.trackedPostpones && null !== C4.contentPreamble && preparePreamble$1(u4))), u4.allPendingTasks--, 0 === u4.allPendingTasks && completeAll$1(u4);
            }
          }
        }
      }
      i5.splice(0, a5), null !== e3.destination && flushCompletedQueues$1(e3, e3.destination);
    } catch (t4) {
      logRecoverableError$1(e3, t4, {}), fatalError$1(e3, t4);
    } finally {
      Hs = o5, sr.H = r4, sr.A = n3, r4 === Bs && switchContext$1(t3), Us = s4;
    }
  }
}
function preparePreambleFromSubtree$1(e3, t3, r4) {
  t3.preambleChildren.length && r4.push(t3.preambleChildren);
  for (var n3 = false, s4 = 0; s4 < t3.children.length; s4++) n3 = preparePreambleFromSegment$1(e3, t3.children[s4], r4) || n3;
  return n3;
}
function preparePreambleFromSegment$1(e3, t3, r4) {
  var n3 = t3.boundary;
  if (null === n3) return preparePreambleFromSubtree$1(e3, t3, r4);
  var s4 = n3.contentPreamble, o5 = n3.fallbackPreamble;
  if (null === s4 || null === o5) return false;
  switch (n3.status) {
    case 1:
      if (hoistPreambleState$1(e3.renderState, s4), !(t3 = n3.completedSegments[0])) throw Error("A previously unvisited boundary must have exactly one root segment. This is a bug in React.");
      return preparePreambleFromSubtree$1(e3, t3, r4);
    case 5:
      if (null !== e3.trackedPostpones) return true;
    case 4:
      if (1 === t3.status) return hoistPreambleState$1(e3.renderState, o5), preparePreambleFromSubtree$1(e3, t3, r4);
    default:
      return true;
  }
}
function preparePreamble$1(e3) {
  if (e3.completedRootSegment && null === e3.completedPreambleSegments) {
    var t3 = [], r4 = preparePreambleFromSegment$1(e3, e3.completedRootSegment, t3), n3 = e3.renderState.preamble;
    (false === r4 || n3.headChunks && n3.bodyChunks) && (e3.completedPreambleSegments = t3);
  }
}
function flushSubtree$1(e3, t3, r4, n3) {
  switch (r4.parentFlushed = true, r4.status) {
    case 0:
      r4.id = e3.nextSegmentId++;
    case 5:
      return n3 = r4.id, r4.lastPushedText = false, r4.textEmbedded = false, e3 = e3.renderState, writeChunk(t3, qr), writeChunk(t3, e3.placeholderPrefix), writeChunk(t3, e3 = stringToChunk(n3.toString(16))), writeChunkAndReturn(t3, Ur);
    case 1:
      r4.status = 2;
      var s4 = true, o5 = r4.chunks, a5 = 0;
      r4 = r4.children;
      for (var i5 = 0; i5 < r4.length; i5++) {
        for (s4 = r4[i5]; a5 < s4.index; a5++) writeChunk(t3, o5[a5]);
        s4 = flushSegment$1(e3, t3, s4, n3);
      }
      for (; a5 < o5.length - 1; a5++) writeChunk(t3, o5[a5]);
      return a5 < o5.length && (s4 = writeChunkAndReturn(t3, o5[a5])), s4;
    default:
      throw Error("Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React.");
  }
}
function flushSegment$1(e3, t3, r4, n3) {
  var s4 = r4.boundary;
  if (null === s4) return flushSubtree$1(e3, t3, r4, n3);
  if (s4.parentFlushed = true, 4 === s4.status) {
    var o5 = s4.errorDigest;
    return writeChunkAndReturn(t3, Qr), writeChunk(t3, Jr), o5 && (writeChunk(t3, Xr), writeChunk(t3, stringToChunk(escapeTextForBrowser$1(o5))), writeChunk(t3, Yr)), writeChunkAndReturn(t3, Zr), flushSubtree$1(e3, t3, r4, n3), (e3 = s4.fallbackPreamble) && writePreambleContribution$1(t3, e3), writeChunkAndReturn(t3, Gr);
  }
  if (1 !== s4.status) return 0 === s4.status && (s4.rootSegmentID = e3.nextSegmentId++), 0 < s4.completedSegments.length && e3.partialBoundaries.push(s4), writeStartPendingSuspenseBoundary$1(t3, e3.renderState, s4.rootSegmentID), n3 && ((s4 = s4.fallbackState).styles.forEach(hoistStyleQueueDependency$1, n3), s4.stylesheets.forEach(hoistStylesheetDependency$1, n3)), flushSubtree$1(e3, t3, r4, n3), writeChunkAndReturn(t3, Gr);
  if (s4.byteSize > e3.progressiveChunkSize) return s4.rootSegmentID = e3.nextSegmentId++, e3.completedBoundaries.push(s4), writeStartPendingSuspenseBoundary$1(t3, e3.renderState, s4.rootSegmentID), flushSubtree$1(e3, t3, r4, n3), writeChunkAndReturn(t3, Gr);
  if (n3 && ((r4 = s4.contentState).styles.forEach(hoistStyleQueueDependency$1, n3), r4.stylesheets.forEach(hoistStylesheetDependency$1, n3)), writeChunkAndReturn(t3, Vr), 1 !== (r4 = s4.completedSegments).length) throw Error("A previously unvisited boundary must have exactly one root segment. This is a bug in React.");
  return flushSegment$1(e3, t3, r4[0], n3), (e3 = s4.contentPreamble) && writePreambleContribution$1(t3, e3), writeChunkAndReturn(t3, Gr);
}
function flushSegmentContainer$1(e3, t3, r4, n3) {
  return function(e4, t4, r5, n4) {
    switch (r5.insertionMode) {
      case 0:
      case 1:
      case 3:
      case 2:
        return writeChunk(e4, rn), writeChunk(e4, t4.segmentPrefix), writeChunk(e4, stringToChunk(n4.toString(16))), writeChunkAndReturn(e4, nn);
      case 4:
        return writeChunk(e4, on2), writeChunk(e4, t4.segmentPrefix), writeChunk(e4, stringToChunk(n4.toString(16))), writeChunkAndReturn(e4, an);
      case 5:
        return writeChunk(e4, un), writeChunk(e4, t4.segmentPrefix), writeChunk(e4, stringToChunk(n4.toString(16))), writeChunkAndReturn(e4, dn);
      case 6:
        return writeChunk(e4, pn), writeChunk(e4, t4.segmentPrefix), writeChunk(e4, stringToChunk(n4.toString(16))), writeChunkAndReturn(e4, fn);
      case 7:
        return writeChunk(e4, gn), writeChunk(e4, t4.segmentPrefix), writeChunk(e4, stringToChunk(n4.toString(16))), writeChunkAndReturn(e4, yn);
      case 8:
        return writeChunk(e4, bn), writeChunk(e4, t4.segmentPrefix), writeChunk(e4, stringToChunk(n4.toString(16))), writeChunkAndReturn(e4, Sn);
      case 9:
        return writeChunk(e4, wn), writeChunk(e4, t4.segmentPrefix), writeChunk(e4, stringToChunk(n4.toString(16))), writeChunkAndReturn(e4, Cn);
      default:
        throw Error("Unknown insertion mode. This is a bug in React.");
    }
  }(t3, e3.renderState, r4.parentFormatContext, r4.id), flushSegment$1(e3, t3, r4, n3), function(e4, t4) {
    switch (t4.insertionMode) {
      case 0:
      case 1:
      case 3:
      case 2:
        return writeChunkAndReturn(e4, sn);
      case 4:
        return writeChunkAndReturn(e4, ln);
      case 5:
        return writeChunkAndReturn(e4, hn);
      case 6:
        return writeChunkAndReturn(e4, mn);
      case 7:
        return writeChunkAndReturn(e4, vn);
      case 8:
        return writeChunkAndReturn(e4, kn);
      case 9:
        return writeChunkAndReturn(e4, xn);
      default:
        throw Error("Unknown insertion mode. This is a bug in React.");
    }
  }(t3, r4.parentFormatContext);
}
function flushCompletedBoundary$1(e3, t3, r4) {
  for (var n3 = r4.completedSegments, s4 = 0; s4 < n3.length; s4++) flushPartiallyCompletedSegment$1(e3, t3, r4, n3[s4]);
  n3.length = 0, writeHoistablesForBoundary$1(t3, r4.contentState, e3.renderState), n3 = e3.resumableState, e3 = e3.renderState, s4 = r4.rootSegmentID, r4 = r4.contentState;
  var o5 = e3.stylesToHoist;
  return e3.stylesToHoist = false, writeChunk(t3, e3.startInlineScript), o5 ? 2 & n3.instructions ? 8 & n3.instructions ? writeChunk(t3, _n) : (n3.instructions |= 8, writeChunk(t3, An)) : (n3.instructions |= 10, writeChunk(t3, In)) : 2 & n3.instructions ? writeChunk(t3, Fn) : (n3.instructions |= 2, writeChunk(t3, En)), n3 = stringToChunk(s4.toString(16)), writeChunk(t3, e3.boundaryPrefix), writeChunk(t3, n3), writeChunk(t3, Mn), writeChunk(t3, e3.segmentPrefix), writeChunk(t3, n3), o5 ? (writeChunk(t3, On), function(e4, t4) {
    writeChunk(e4, ns);
    var r5 = ns;
    t4.stylesheets.forEach(function(t5) {
      if (2 !== t5.state) if (3 === t5.state) writeChunk(e4, r5), writeChunk(e4, stringToChunk(escapeJSObjectForInstructionScripts$1("" + t5.props.href))), writeChunk(e4, as), r5 = ss;
      else {
        writeChunk(e4, r5);
        var n4 = t5.props["data-precedence"], s5 = t5.props, o6 = sanitizeURL$1("" + t5.props.href);
        for (var a5 in writeChunk(e4, stringToChunk(escapeJSObjectForInstructionScripts$1(o6))), n4 = "" + n4, writeChunk(e4, os), writeChunk(e4, stringToChunk(escapeJSObjectForInstructionScripts$1(n4))), s5) if (Qt.call(s5, a5) && null != (n4 = s5[a5])) switch (a5) {
          case "href":
          case "rel":
          case "precedence":
          case "data-precedence":
            break;
          case "children":
          case "dangerouslySetInnerHTML":
            throw Error("link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
          default:
            writeStyleResourceAttributeInJS$1(e4, a5, n4);
        }
        writeChunk(e4, as), r5 = ss, t5.state = 3;
      }
    }), writeChunk(e4, as);
  }(t3, r4)) : writeChunk(t3, Nn), r4 = writeChunkAndReturn(t3, jn), writeBootstrap$1(t3, e3) && r4;
}
function flushPartiallyCompletedSegment$1(e3, t3, r4, n3) {
  if (2 === n3.status) return true;
  var s4 = r4.contentState, o5 = n3.id;
  if (-1 === o5) {
    if (-1 === (n3.id = r4.rootSegmentID)) throw Error("A root segment ID must have been assigned by now. This is a bug in React.");
    return flushSegmentContainer$1(e3, t3, n3, s4);
  }
  return o5 === r4.rootSegmentID ? flushSegmentContainer$1(e3, t3, n3, s4) : (flushSegmentContainer$1(e3, t3, n3, s4), r4 = e3.resumableState, writeChunk(t3, (e3 = e3.renderState).startInlineScript), 1 & r4.instructions ? writeChunk(t3, Rn) : (r4.instructions |= 1, writeChunk(t3, Pn)), writeChunk(t3, e3.segmentPrefix), writeChunk(t3, o5 = stringToChunk(o5.toString(16))), writeChunk(t3, Tn), writeChunk(t3, e3.placeholderPrefix), writeChunk(t3, o5), t3 = writeChunkAndReturn(t3, $n));
}
function flushCompletedQueues$1(e3, t3) {
  Ut = new Uint8Array(2048), Vt = 0;
  try {
    if (!(0 < e3.pendingRootTasks)) {
      var r4, n3 = e3.completedRootSegment;
      if (null !== n3) {
        if (5 === n3.status) return;
        var s4 = e3.completedPreambleSegments;
        if (null === s4) return;
        var o5, a5 = e3.renderState, i5 = a5.preamble, l4 = i5.htmlChunks, u4 = i5.headChunks;
        if (l4) {
          for (o5 = 0; o5 < l4.length; o5++) writeChunk(t3, l4[o5]);
          if (u4) for (o5 = 0; o5 < u4.length; o5++) writeChunk(t3, u4[o5]);
          else writeChunk(t3, startChunkForTag$1("head")), writeChunk(t3, Ir);
        } else if (u4) for (o5 = 0; o5 < u4.length; o5++) writeChunk(t3, u4[o5]);
        var c4 = a5.charsetChunks;
        for (o5 = 0; o5 < c4.length; o5++) writeChunk(t3, c4[o5]);
        c4.length = 0, a5.preconnects.forEach(flushResource$1, t3), a5.preconnects.clear();
        var d4 = a5.viewportChunks;
        for (o5 = 0; o5 < d4.length; o5++) writeChunk(t3, d4[o5]);
        d4.length = 0, a5.fontPreloads.forEach(flushResource$1, t3), a5.fontPreloads.clear(), a5.highImagePreloads.forEach(flushResource$1, t3), a5.highImagePreloads.clear(), a5.styles.forEach(flushStylesInPreamble$1, t3);
        var h4 = a5.importMapChunks;
        for (o5 = 0; o5 < h4.length; o5++) writeChunk(t3, h4[o5]);
        h4.length = 0, a5.bootstrapScripts.forEach(flushResource$1, t3), a5.scripts.forEach(flushResource$1, t3), a5.scripts.clear(), a5.bulkPreloads.forEach(flushResource$1, t3), a5.bulkPreloads.clear();
        var p4 = a5.hoistableChunks;
        for (o5 = 0; o5 < p4.length; o5++) writeChunk(t3, p4[o5]);
        for (a5 = p4.length = 0; a5 < s4.length; a5++) {
          var f4 = s4[a5];
          for (i5 = 0; i5 < f4.length; i5++) flushSegment$1(e3, t3, f4[i5], null);
        }
        var m5 = e3.renderState.preamble, g3 = m5.headChunks;
        (m5.htmlChunks || g3) && writeChunk(t3, endChunkForTag$1("head"));
        var y3 = m5.bodyChunks;
        if (y3) for (s4 = 0; s4 < y3.length; s4++) writeChunk(t3, y3[s4]);
        flushSegment$1(e3, t3, n3, null), e3.completedRootSegment = null, writeBootstrap$1(t3, e3.renderState);
      }
      var v3 = e3.renderState;
      n3 = 0;
      var b3 = v3.viewportChunks;
      for (n3 = 0; n3 < b3.length; n3++) writeChunk(t3, b3[n3]);
      b3.length = 0, v3.preconnects.forEach(flushResource$1, t3), v3.preconnects.clear(), v3.fontPreloads.forEach(flushResource$1, t3), v3.fontPreloads.clear(), v3.highImagePreloads.forEach(flushResource$1, t3), v3.highImagePreloads.clear(), v3.styles.forEach(preloadLateStyles$1, t3), v3.scripts.forEach(flushResource$1, t3), v3.scripts.clear(), v3.bulkPreloads.forEach(flushResource$1, t3), v3.bulkPreloads.clear();
      var S4 = v3.hoistableChunks;
      for (n3 = 0; n3 < S4.length; n3++) writeChunk(t3, S4[n3]);
      S4.length = 0;
      var k4 = e3.clientRenderedBoundaries;
      for (r4 = 0; r4 < k4.length; r4++) {
        var w4 = k4[r4];
        v3 = t3;
        var C4 = e3.resumableState, x3 = e3.renderState, P4 = w4.rootSegmentID, R4 = w4.errorDigest;
        writeChunk(v3, x3.startInlineScript), 4 & C4.instructions ? writeChunk(v3, Dn) : (C4.instructions |= 4, writeChunk(v3, Ln)), writeChunk(v3, x3.boundaryPrefix), writeChunk(v3, stringToChunk(P4.toString(16))), writeChunk(v3, Bn), R4 && (writeChunk(v3, Hn), writeChunk(v3, stringToChunk(escapeJSStringsForInstructionScripts$1(R4 || ""))));
        var T4 = writeChunkAndReturn(v3, zn);
        if (!T4) return e3.destination = null, r4++, void k4.splice(0, r4);
      }
      k4.splice(0, r4);
      var $3 = e3.completedBoundaries;
      for (r4 = 0; r4 < $3.length; r4++) if (!flushCompletedBoundary$1(e3, t3, $3[r4])) return e3.destination = null, r4++, void $3.splice(0, r4);
      $3.splice(0, r4), completeWriting(t3), Ut = new Uint8Array(2048), Vt = 0;
      var E4 = e3.partialBoundaries;
      for (r4 = 0; r4 < E4.length; r4++) {
        var F4 = E4[r4];
        e: {
          k4 = e3, w4 = t3;
          var I4 = F4.completedSegments;
          for (T4 = 0; T4 < I4.length; T4++) if (!flushPartiallyCompletedSegment$1(k4, w4, F4, I4[T4])) {
            T4++, I4.splice(0, T4);
            var A4 = false;
            break e;
          }
          I4.splice(0, T4), A4 = writeHoistablesForBoundary$1(w4, F4.contentState, k4.renderState);
        }
        if (!A4) return e3.destination = null, r4++, void E4.splice(0, r4);
      }
      E4.splice(0, r4);
      var _3 = e3.completedBoundaries;
      for (r4 = 0; r4 < _3.length; r4++) if (!flushCompletedBoundary$1(e3, t3, _3[r4])) return e3.destination = null, r4++, void _3.splice(0, r4);
      _3.splice(0, r4);
    }
  } finally {
    0 === e3.allPendingTasks && 0 === e3.pingedTasks.length && 0 === e3.clientRenderedBoundaries.length && 0 === e3.completedBoundaries.length ? (e3.flushScheduled = false, (r4 = e3.resumableState).hasBody && writeChunk(t3, endChunkForTag$1("body")), r4.hasHtml && writeChunk(t3, endChunkForTag$1("html")), completeWriting(t3), e3.status = 14, t3.close(), e3.destination = null) : completeWriting(t3);
  }
}
function startWork(e3) {
  e3.flushScheduled = null !== e3.destination, qt(cs ? function() {
    return ds.run(e3, performWork$1, e3);
  } : function() {
    return performWork$1(e3);
  }), setTimeout(function() {
    10 === e3.status && (e3.status = 11), null === e3.trackedPostpones && (cs ? ds.run(e3, enqueueEarlyPreloadsAfterInitialWork, e3) : enqueueEarlyPreloadsAfterInitialWork(e3));
  }, 0);
}
function enqueueEarlyPreloadsAfterInitialWork(e3) {
  safelyEmitEarlyPreloads$1(e3, 0 === e3.pendingRootTasks);
}
function enqueueFlush$1(e3) {
  false === e3.flushScheduled && 0 === e3.pingedTasks.length && null !== e3.destination && (e3.flushScheduled = true, setTimeout(function() {
    var t3 = e3.destination;
    t3 ? flushCompletedQueues$1(e3, t3) : e3.flushScheduled = false;
  }, 0));
}
function startFlowing$1(e3, t3) {
  if (13 === e3.status) e3.status = 14, closeWithError(t3, e3.fatalError);
  else if (14 !== e3.status && null === e3.destination) {
    e3.destination = t3;
    try {
      flushCompletedQueues$1(e3, t3);
    } catch (t4) {
      logRecoverableError$1(e3, t4, {}), fatalError$1(e3, t4);
    }
  }
}
function abort$1(e3, t3) {
  11 !== e3.status && 10 !== e3.status || (e3.status = 12);
  try {
    var r4 = e3.abortableTasks;
    if (0 < r4.size) {
      var n3 = void 0 === t3 ? Error("The render was aborted by the server without a reason.") : "object" == typeof t3 && null !== t3 && "function" == typeof t3.then ? Error("The render was aborted by the server with a promise.") : t3;
      e3.fatalError = n3, r4.forEach(function(t4) {
        return abortTask$1(t4, e3, n3);
      }), r4.clear();
    }
    null !== e3.destination && flushCompletedQueues$1(e3, e3.destination);
  } catch (t4) {
    logRecoverableError$1(e3, t4, {}), fatalError$1(e3, t4);
  }
}
function ensureCorrectIsomorphicReactVersion() {
  var e3 = St.version;
  if ("19.1.0" !== e3) throw Error('Incompatible React versions: The "react" and "react-dom" packages must have the exact same version. Instead got:\n  - react:      ' + e3 + "\n  - react-dom:  19.1.0\nLearn more: https://react.dev/warnings/version-mismatch");
}
function formatProdErrorMessage(e3) {
  var t3 = "https://react.dev/errors/" + e3;
  if (1 < arguments.length) {
    t3 += "?args[]=" + encodeURIComponent(arguments[1]);
    for (var r4 = 2; r4 < arguments.length; r4++) t3 += "&args[]=" + encodeURIComponent(arguments[r4]);
  }
  return "Minified React error #" + e3 + "; visit " + t3 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
function murmurhash3_32_gc(e3, t3) {
  var r4 = 3 & e3.length, n3 = e3.length - r4, s4 = t3;
  for (t3 = 0; t3 < n3; ) {
    var o5 = 255 & e3.charCodeAt(t3) | (255 & e3.charCodeAt(++t3)) << 8 | (255 & e3.charCodeAt(++t3)) << 16 | (255 & e3.charCodeAt(++t3)) << 24;
    ++t3, s4 = 27492 + (65535 & (s4 = 5 * (65535 & (s4 = (s4 ^= o5 = 461845907 * (65535 & (o5 = (o5 = 3432918353 * (65535 & o5) + ((3432918353 * (o5 >>> 16) & 65535) << 16) & 4294967295) << 15 | o5 >>> 17)) + ((461845907 * (o5 >>> 16) & 65535) << 16) & 4294967295) << 13 | s4 >>> 19)) + ((5 * (s4 >>> 16) & 65535) << 16) & 4294967295)) + (((s4 >>> 16) + 58964 & 65535) << 16);
  }
  switch (o5 = 0, r4) {
    case 3:
      o5 ^= (255 & e3.charCodeAt(t3 + 2)) << 16;
    case 2:
      o5 ^= (255 & e3.charCodeAt(t3 + 1)) << 8;
    case 1:
      s4 ^= 461845907 * (65535 & (o5 = (o5 = 3432918353 * (65535 & (o5 ^= 255 & e3.charCodeAt(t3))) + ((3432918353 * (o5 >>> 16) & 65535) << 16) & 4294967295) << 15 | o5 >>> 17)) + ((461845907 * (o5 >>> 16) & 65535) << 16) & 4294967295;
  }
  return s4 ^= e3.length, s4 = 2246822507 * (65535 & (s4 ^= s4 >>> 16)) + ((2246822507 * (s4 >>> 16) & 65535) << 16) & 4294967295, ((s4 = 3266489909 * (65535 & (s4 ^= s4 >>> 13)) + ((3266489909 * (s4 >>> 16) & 65535) << 16) & 4294967295) ^ s4 >>> 16) >>> 0;
}
function isAttributeNameSafe(e3) {
  return !!go.call(bo, e3) || !go.call(vo, e3) && (yo.test(e3) ? bo[e3] = true : (vo[e3] = true, false));
}
function escapeTextForBrowser(e3) {
  if ("boolean" == typeof e3 || "number" == typeof e3 || "bigint" == typeof e3) return "" + e3;
  e3 = "" + e3;
  var t3 = wo.exec(e3);
  if (t3) {
    var r4, n3 = "", s4 = 0;
    for (r4 = t3.index; r4 < e3.length; r4++) {
      switch (e3.charCodeAt(r4)) {
        case 34:
          t3 = "&quot;";
          break;
        case 38:
          t3 = "&amp;";
          break;
        case 39:
          t3 = "&#x27;";
          break;
        case 60:
          t3 = "&lt;";
          break;
        case 62:
          t3 = "&gt;";
          break;
        default:
          continue;
      }
      s4 !== r4 && (n3 += e3.slice(s4, r4)), s4 = r4 + 1, n3 += t3;
    }
    e3 = s4 !== r4 ? n3 + e3.slice(s4, r4) : n3;
  }
  return e3;
}
function sanitizeURL(e3) {
  return Po.test("" + e3) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e3;
}
function scriptReplacer(e3, t3, r4, n3) {
  return t3 + ("s" === r4 ? "\\u0073" : "\\u0053") + n3;
}
function createPreambleState() {
  return { htmlChunks: null, headChunks: null, bodyChunks: null, contribution: 0 };
}
function createFormatContext(e3, t3, r4) {
  return { insertionMode: e3, selectedValue: t3, tagScope: r4 };
}
function getChildFormatContext(e3, t3, r4) {
  switch (t3) {
    case "noscript":
      return createFormatContext(2, null, 1 | e3.tagScope);
    case "select":
      return createFormatContext(2, null != r4.value ? r4.value : r4.defaultValue, e3.tagScope);
    case "svg":
      return createFormatContext(4, null, e3.tagScope);
    case "picture":
      return createFormatContext(2, null, 2 | e3.tagScope);
    case "math":
      return createFormatContext(5, null, e3.tagScope);
    case "foreignObject":
      return createFormatContext(2, null, e3.tagScope);
    case "table":
      return createFormatContext(6, null, e3.tagScope);
    case "thead":
    case "tbody":
    case "tfoot":
      return createFormatContext(7, null, e3.tagScope);
    case "colgroup":
      return createFormatContext(9, null, e3.tagScope);
    case "tr":
      return createFormatContext(8, null, e3.tagScope);
    case "head":
      if (2 > e3.insertionMode) return createFormatContext(3, null, e3.tagScope);
      break;
    case "html":
      if (0 === e3.insertionMode) return createFormatContext(1, null, e3.tagScope);
  }
  return 6 <= e3.insertionMode || 2 > e3.insertionMode ? createFormatContext(2, null, e3.tagScope) : e3;
}
function pushStyleAttribute(e3, t3) {
  if ("object" != typeof t3) throw Error(formatProdErrorMessage(62));
  var r4, n3 = true;
  for (r4 in t3) if (go.call(t3, r4)) {
    var s4 = t3[r4];
    if (null != s4 && "boolean" != typeof s4 && "" !== s4) {
      if (0 === r4.indexOf("--")) {
        var o5 = escapeTextForBrowser(r4);
        s4 = escapeTextForBrowser(("" + s4).trim());
      } else void 0 === (o5 = Ao.get(r4)) && (o5 = escapeTextForBrowser(r4.replace(Co, "-$1").toLowerCase().replace(xo, "-ms-")), Ao.set(r4, o5)), s4 = "number" == typeof s4 ? 0 === s4 || So.has(r4) ? "" + s4 : s4 + "px" : escapeTextForBrowser(("" + s4).trim());
      n3 ? (n3 = false, e3.push(' style="', o5, ":", s4)) : e3.push(";", o5, ":", s4);
    }
  }
  n3 || e3.push('"');
}
function pushBooleanAttribute(e3, t3, r4) {
  r4 && "function" != typeof r4 && "symbol" != typeof r4 && e3.push(" ", t3, '=""');
}
function pushStringAttribute(e3, t3, r4) {
  "function" != typeof r4 && "symbol" != typeof r4 && "boolean" != typeof r4 && e3.push(" ", t3, '="', escapeTextForBrowser(r4), '"');
}
function pushAdditionalFormField(e3, t3) {
  this.push('<input type="hidden"'), validateAdditionalFormField(e3), pushStringAttribute(this, "name", t3), pushStringAttribute(this, "value", e3), this.push("/>");
}
function validateAdditionalFormField(e3) {
  if ("string" != typeof e3) throw Error(formatProdErrorMessage(480));
}
function getCustomFormFields(e3, t3) {
  if ("function" == typeof t3.$$FORM_ACTION) {
    var r4 = e3.nextFormID++;
    e3 = e3.idPrefix + r4;
    try {
      var n3 = t3.$$FORM_ACTION(e3);
      if (n3) {
        var s4 = n3.data;
        null != s4 && s4.forEach(validateAdditionalFormField);
      }
      return n3;
    } catch (e4) {
      if ("object" == typeof e4 && null !== e4 && "function" == typeof e4.then) throw e4;
    }
  }
  return null;
}
function pushFormActionAttribute(e3, t3, r4, n3, s4, o5, a5, i5) {
  var l4 = null;
  if ("function" == typeof n3) {
    var u4 = getCustomFormFields(t3, n3);
    null !== u4 ? (i5 = u4.name, n3 = u4.action || "", s4 = u4.encType, o5 = u4.method, a5 = u4.target, l4 = u4.data) : (e3.push(" ", "formAction", '="', _o, '"'), a5 = o5 = s4 = n3 = i5 = null, injectFormReplayingRuntime(t3, r4));
  }
  return null != i5 && pushAttribute(e3, "name", i5), null != n3 && pushAttribute(e3, "formAction", n3), null != s4 && pushAttribute(e3, "formEncType", s4), null != o5 && pushAttribute(e3, "formMethod", o5), null != a5 && pushAttribute(e3, "formTarget", a5), l4;
}
function pushAttribute(e3, t3, r4) {
  switch (t3) {
    case "className":
      pushStringAttribute(e3, "class", r4);
      break;
    case "tabIndex":
      pushStringAttribute(e3, "tabindex", r4);
      break;
    case "dir":
    case "role":
    case "viewBox":
    case "width":
    case "height":
      pushStringAttribute(e3, t3, r4);
      break;
    case "style":
      pushStyleAttribute(e3, r4);
      break;
    case "src":
    case "href":
      if ("" === r4) break;
    case "action":
    case "formAction":
      if (null == r4 || "function" == typeof r4 || "symbol" == typeof r4 || "boolean" == typeof r4) break;
      r4 = sanitizeURL("" + r4), e3.push(" ", t3, '="', escapeTextForBrowser(r4), '"');
      break;
    case "defaultValue":
    case "defaultChecked":
    case "innerHTML":
    case "suppressContentEditableWarning":
    case "suppressHydrationWarning":
    case "ref":
      break;
    case "autoFocus":
    case "multiple":
    case "muted":
      pushBooleanAttribute(e3, t3.toLowerCase(), r4);
      break;
    case "xlinkHref":
      if ("function" == typeof r4 || "symbol" == typeof r4 || "boolean" == typeof r4) break;
      r4 = sanitizeURL("" + r4), e3.push(" ", "xlink:href", '="', escapeTextForBrowser(r4), '"');
      break;
    case "contentEditable":
    case "spellCheck":
    case "draggable":
    case "value":
    case "autoReverse":
    case "externalResourcesRequired":
    case "focusable":
    case "preserveAlpha":
      "function" != typeof r4 && "symbol" != typeof r4 && e3.push(" ", t3, '="', escapeTextForBrowser(r4), '"');
      break;
    case "inert":
    case "allowFullScreen":
    case "async":
    case "autoPlay":
    case "controls":
    case "default":
    case "defer":
    case "disabled":
    case "disablePictureInPicture":
    case "disableRemotePlayback":
    case "formNoValidate":
    case "hidden":
    case "loop":
    case "noModule":
    case "noValidate":
    case "open":
    case "playsInline":
    case "readOnly":
    case "required":
    case "reversed":
    case "scoped":
    case "seamless":
    case "itemScope":
      r4 && "function" != typeof r4 && "symbol" != typeof r4 && e3.push(" ", t3, '=""');
      break;
    case "capture":
    case "download":
      true === r4 ? e3.push(" ", t3, '=""') : false !== r4 && "function" != typeof r4 && "symbol" != typeof r4 && e3.push(" ", t3, '="', escapeTextForBrowser(r4), '"');
      break;
    case "cols":
    case "rows":
    case "size":
    case "span":
      "function" != typeof r4 && "symbol" != typeof r4 && !isNaN(r4) && 1 <= r4 && e3.push(" ", t3, '="', escapeTextForBrowser(r4), '"');
      break;
    case "rowSpan":
    case "start":
      "function" == typeof r4 || "symbol" == typeof r4 || isNaN(r4) || e3.push(" ", t3, '="', escapeTextForBrowser(r4), '"');
      break;
    case "xlinkActuate":
      pushStringAttribute(e3, "xlink:actuate", r4);
      break;
    case "xlinkArcrole":
      pushStringAttribute(e3, "xlink:arcrole", r4);
      break;
    case "xlinkRole":
      pushStringAttribute(e3, "xlink:role", r4);
      break;
    case "xlinkShow":
      pushStringAttribute(e3, "xlink:show", r4);
      break;
    case "xlinkTitle":
      pushStringAttribute(e3, "xlink:title", r4);
      break;
    case "xlinkType":
      pushStringAttribute(e3, "xlink:type", r4);
      break;
    case "xmlBase":
      pushStringAttribute(e3, "xml:base", r4);
      break;
    case "xmlLang":
      pushStringAttribute(e3, "xml:lang", r4);
      break;
    case "xmlSpace":
      pushStringAttribute(e3, "xml:space", r4);
      break;
    default:
      if ((!(2 < t3.length) || "o" !== t3[0] && "O" !== t3[0] || "n" !== t3[1] && "N" !== t3[1]) && isAttributeNameSafe(t3 = ko.get(t3) || t3)) {
        switch (typeof r4) {
          case "function":
          case "symbol":
            return;
          case "boolean":
            var n3 = t3.toLowerCase().slice(0, 5);
            if ("data-" !== n3 && "aria-" !== n3) return;
        }
        e3.push(" ", t3, '="', escapeTextForBrowser(r4), '"');
      }
  }
}
function pushInnerHTML(e3, t3, r4) {
  if (null != t3) {
    if (null != r4) throw Error(formatProdErrorMessage(60));
    if ("object" != typeof t3 || !("__html" in t3)) throw Error(formatProdErrorMessage(61));
    null != (t3 = t3.__html) && e3.push("" + t3);
  }
}
function injectFormReplayingRuntime(e3, t3) {
  !(16 & e3.instructions) && (e3.instructions |= 16, t3.bootstrapChunks.unshift(t3.startInlineScript, `addEventListener("submit",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute("formAction");null!=f&&(e=f,b=null)}"javascript:throw new Error('React form unexpectedly submitted.')"===e&&(a.preventDefault(),b?(a=document.createElement("input"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});`, "<\/script>"));
}
function pushLinkImpl(e3, t3) {
  for (var r4 in e3.push(startChunkForTag("link")), t3) if (go.call(t3, r4)) {
    var n3 = t3[r4];
    if (null != n3) switch (r4) {
      case "children":
      case "dangerouslySetInnerHTML":
        throw Error(formatProdErrorMessage(399, "link"));
      default:
        pushAttribute(e3, r4, n3);
    }
  }
  return e3.push("/>"), null;
}
function styleReplacer(e3, t3, r4, n3) {
  return t3 + ("s" === r4 ? "\\73 " : "\\53 ") + n3;
}
function pushSelfClosing(e3, t3, r4) {
  for (var n3 in e3.push(startChunkForTag(r4)), t3) if (go.call(t3, n3)) {
    var s4 = t3[n3];
    if (null != s4) switch (n3) {
      case "children":
      case "dangerouslySetInnerHTML":
        throw Error(formatProdErrorMessage(399, r4));
      default:
        pushAttribute(e3, n3, s4);
    }
  }
  return e3.push("/>"), null;
}
function pushTitleImpl(e3, t3) {
  e3.push(startChunkForTag("title"));
  var r4, n3 = null, s4 = null;
  for (r4 in t3) if (go.call(t3, r4)) {
    var o5 = t3[r4];
    if (null != o5) switch (r4) {
      case "children":
        n3 = o5;
        break;
      case "dangerouslySetInnerHTML":
        s4 = o5;
        break;
      default:
        pushAttribute(e3, r4, o5);
    }
  }
  return e3.push(">"), "function" != typeof (t3 = Array.isArray(n3) ? 2 > n3.length ? n3[0] : null : n3) && "symbol" != typeof t3 && null != t3 && e3.push(escapeTextForBrowser("" + t3)), pushInnerHTML(e3, s4, n3), e3.push(endChunkForTag("title")), null;
}
function pushScriptImpl(e3, t3) {
  e3.push(startChunkForTag("script"));
  var r4, n3 = null, s4 = null;
  for (r4 in t3) if (go.call(t3, r4)) {
    var o5 = t3[r4];
    if (null != o5) switch (r4) {
      case "children":
        n3 = o5;
        break;
      case "dangerouslySetInnerHTML":
        s4 = o5;
        break;
      default:
        pushAttribute(e3, r4, o5);
    }
  }
  return e3.push(">"), pushInnerHTML(e3, s4, n3), "string" == typeof n3 && e3.push(("" + n3).replace(Io, scriptReplacer)), e3.push(endChunkForTag("script")), null;
}
function pushStartSingletonElement(e3, t3, r4) {
  e3.push(startChunkForTag(r4));
  var n3, s4 = r4 = null;
  for (n3 in t3) if (go.call(t3, n3)) {
    var o5 = t3[n3];
    if (null != o5) switch (n3) {
      case "children":
        r4 = o5;
        break;
      case "dangerouslySetInnerHTML":
        s4 = o5;
        break;
      default:
        pushAttribute(e3, n3, o5);
    }
  }
  return e3.push(">"), pushInnerHTML(e3, s4, r4), r4;
}
function pushStartGenericElement(e3, t3, r4) {
  e3.push(startChunkForTag(r4));
  var n3, s4 = r4 = null;
  for (n3 in t3) if (go.call(t3, n3)) {
    var o5 = t3[n3];
    if (null != o5) switch (n3) {
      case "children":
        r4 = o5;
        break;
      case "dangerouslySetInnerHTML":
        s4 = o5;
        break;
      default:
        pushAttribute(e3, n3, o5);
    }
  }
  return e3.push(">"), pushInnerHTML(e3, s4, r4), "string" == typeof r4 ? (e3.push(escapeTextForBrowser(r4)), null) : r4;
}
function startChunkForTag(e3) {
  var t3 = No.get(e3);
  if (void 0 === t3) {
    if (!Oo.test(e3)) throw Error(formatProdErrorMessage(65, e3));
    t3 = "<" + e3, No.set(e3, t3);
  }
  return t3;
}
function pushStartInstance(e3, t3, r4, n3, s4, o5, a5, i5, l4, u4) {
  switch (t3) {
    case "div":
    case "span":
    case "svg":
    case "path":
    case "g":
    case "p":
    case "li":
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      break;
    case "a":
      e3.push(startChunkForTag("a"));
      var c4, d4 = null, h4 = null;
      for (c4 in r4) if (go.call(r4, c4)) {
        var p4 = r4[c4];
        if (null != p4) switch (c4) {
          case "children":
            d4 = p4;
            break;
          case "dangerouslySetInnerHTML":
            h4 = p4;
            break;
          case "href":
            "" === p4 ? pushStringAttribute(e3, "href", "") : pushAttribute(e3, c4, p4);
            break;
          default:
            pushAttribute(e3, c4, p4);
        }
      }
      if (e3.push(">"), pushInnerHTML(e3, h4, d4), "string" == typeof d4) {
        e3.push(escapeTextForBrowser(d4));
        var f4 = null;
      } else f4 = d4;
      return f4;
    case "select":
      e3.push(startChunkForTag("select"));
      var m5, g3 = null, y3 = null;
      for (m5 in r4) if (go.call(r4, m5)) {
        var v3 = r4[m5];
        if (null != v3) switch (m5) {
          case "children":
            g3 = v3;
            break;
          case "dangerouslySetInnerHTML":
            y3 = v3;
            break;
          case "defaultValue":
          case "value":
            break;
          default:
            pushAttribute(e3, m5, v3);
        }
      }
      return e3.push(">"), pushInnerHTML(e3, y3, g3), g3;
    case "option":
      var b3 = i5.selectedValue;
      e3.push(startChunkForTag("option"));
      var S4, k4 = null, w4 = null, C4 = null, x3 = null;
      for (S4 in r4) if (go.call(r4, S4)) {
        var P4 = r4[S4];
        if (null != P4) switch (S4) {
          case "children":
            k4 = P4;
            break;
          case "selected":
            C4 = P4;
            break;
          case "dangerouslySetInnerHTML":
            x3 = P4;
            break;
          case "value":
            w4 = P4;
          default:
            pushAttribute(e3, S4, P4);
        }
      }
      if (null != b3) {
        var R4 = null !== w4 ? "" + w4 : function(e4) {
          var t4 = "";
          return Ws.Children.forEach(e4, function(e5) {
            null != e5 && (t4 += e5);
          }), t4;
        }(k4);
        if (fo(b3)) {
          for (var T4 = 0; T4 < b3.length; T4++) if ("" + b3[T4] === R4) {
            e3.push(' selected=""');
            break;
          }
        } else "" + b3 === R4 && e3.push(' selected=""');
      } else C4 && e3.push(' selected=""');
      return e3.push(">"), pushInnerHTML(e3, x3, k4), k4;
    case "textarea":
      e3.push(startChunkForTag("textarea"));
      var $3, E4 = null, F4 = null, I4 = null;
      for ($3 in r4) if (go.call(r4, $3)) {
        var A4 = r4[$3];
        if (null != A4) switch ($3) {
          case "children":
            I4 = A4;
            break;
          case "value":
            E4 = A4;
            break;
          case "defaultValue":
            F4 = A4;
            break;
          case "dangerouslySetInnerHTML":
            throw Error(formatProdErrorMessage(91));
          default:
            pushAttribute(e3, $3, A4);
        }
      }
      if (null === E4 && null !== F4 && (E4 = F4), e3.push(">"), null != I4) {
        if (null != E4) throw Error(formatProdErrorMessage(92));
        if (fo(I4)) {
          if (1 < I4.length) throw Error(formatProdErrorMessage(93));
          E4 = "" + I4[0];
        }
        E4 = "" + I4;
      }
      return "string" == typeof E4 && "\n" === E4[0] && e3.push("\n"), null !== E4 && e3.push(escapeTextForBrowser("" + E4)), null;
    case "input":
      e3.push(startChunkForTag("input"));
      var _3, M3 = null, O4 = null, N4 = null, j3 = null, L4 = null, D4 = null, B3 = null, H3 = null, z3 = null;
      for (_3 in r4) if (go.call(r4, _3)) {
        var q3 = r4[_3];
        if (null != q3) switch (_3) {
          case "children":
          case "dangerouslySetInnerHTML":
            throw Error(formatProdErrorMessage(399, "input"));
          case "name":
            M3 = q3;
            break;
          case "formAction":
            O4 = q3;
            break;
          case "formEncType":
            N4 = q3;
            break;
          case "formMethod":
            j3 = q3;
            break;
          case "formTarget":
            L4 = q3;
            break;
          case "defaultChecked":
            z3 = q3;
            break;
          case "defaultValue":
            B3 = q3;
            break;
          case "checked":
            H3 = q3;
            break;
          case "value":
            D4 = q3;
            break;
          default:
            pushAttribute(e3, _3, q3);
        }
      }
      var U4 = pushFormActionAttribute(e3, n3, s4, O4, N4, j3, L4, M3);
      return null !== H3 ? pushBooleanAttribute(e3, "checked", H3) : null !== z3 && pushBooleanAttribute(e3, "checked", z3), null !== D4 ? pushAttribute(e3, "value", D4) : null !== B3 && pushAttribute(e3, "value", B3), e3.push("/>"), null != U4 && U4.forEach(pushAdditionalFormField, e3), null;
    case "button":
      e3.push(startChunkForTag("button"));
      var V4, W4 = null, K4 = null, Q3 = null, G3 = null, J3 = null, Y4 = null, X4 = null;
      for (V4 in r4) if (go.call(r4, V4)) {
        var Z3 = r4[V4];
        if (null != Z3) switch (V4) {
          case "children":
            W4 = Z3;
            break;
          case "dangerouslySetInnerHTML":
            K4 = Z3;
            break;
          case "name":
            Q3 = Z3;
            break;
          case "formAction":
            G3 = Z3;
            break;
          case "formEncType":
            J3 = Z3;
            break;
          case "formMethod":
            Y4 = Z3;
            break;
          case "formTarget":
            X4 = Z3;
            break;
          default:
            pushAttribute(e3, V4, Z3);
        }
      }
      var ee3 = pushFormActionAttribute(e3, n3, s4, G3, J3, Y4, X4, Q3);
      if (e3.push(">"), null != ee3 && ee3.forEach(pushAdditionalFormField, e3), pushInnerHTML(e3, K4, W4), "string" == typeof W4) {
        e3.push(escapeTextForBrowser(W4));
        var te3 = null;
      } else te3 = W4;
      return te3;
    case "form":
      e3.push(startChunkForTag("form"));
      var re3, ne3 = null, se3 = null, oe3 = null, ae3 = null, ie3 = null, le3 = null;
      for (re3 in r4) if (go.call(r4, re3)) {
        var ue3 = r4[re3];
        if (null != ue3) switch (re3) {
          case "children":
            ne3 = ue3;
            break;
          case "dangerouslySetInnerHTML":
            se3 = ue3;
            break;
          case "action":
            oe3 = ue3;
            break;
          case "encType":
            ae3 = ue3;
            break;
          case "method":
            ie3 = ue3;
            break;
          case "target":
            le3 = ue3;
            break;
          default:
            pushAttribute(e3, re3, ue3);
        }
      }
      var ce3 = null, de3 = null;
      if ("function" == typeof oe3) {
        var he3 = getCustomFormFields(n3, oe3);
        null !== he3 ? (oe3 = he3.action || "", ae3 = he3.encType, ie3 = he3.method, le3 = he3.target, ce3 = he3.data, de3 = he3.name) : (e3.push(" ", "action", '="', _o, '"'), le3 = ie3 = ae3 = oe3 = null, injectFormReplayingRuntime(n3, s4));
      }
      if (null != oe3 && pushAttribute(e3, "action", oe3), null != ae3 && pushAttribute(e3, "encType", ae3), null != ie3 && pushAttribute(e3, "method", ie3), null != le3 && pushAttribute(e3, "target", le3), e3.push(">"), null !== de3 && (e3.push('<input type="hidden"'), pushStringAttribute(e3, "name", de3), e3.push("/>"), null != ce3 && ce3.forEach(pushAdditionalFormField, e3)), pushInnerHTML(e3, se3, ne3), "string" == typeof ne3) {
        e3.push(escapeTextForBrowser(ne3));
        var pe3 = null;
      } else pe3 = ne3;
      return pe3;
    case "menuitem":
      for (var fe3 in e3.push(startChunkForTag("menuitem")), r4) if (go.call(r4, fe3)) {
        var me3 = r4[fe3];
        if (null != me3) switch (fe3) {
          case "children":
          case "dangerouslySetInnerHTML":
            throw Error(formatProdErrorMessage(400));
          default:
            pushAttribute(e3, fe3, me3);
        }
      }
      return e3.push(">"), null;
    case "object":
      e3.push(startChunkForTag("object"));
      var ge3, ye3 = null, ve3 = null;
      for (ge3 in r4) if (go.call(r4, ge3)) {
        var be3 = r4[ge3];
        if (null != be3) switch (ge3) {
          case "children":
            ye3 = be3;
            break;
          case "dangerouslySetInnerHTML":
            ve3 = be3;
            break;
          case "data":
            var Se3 = sanitizeURL("" + be3);
            if ("" === Se3) break;
            e3.push(" ", "data", '="', escapeTextForBrowser(Se3), '"');
            break;
          default:
            pushAttribute(e3, ge3, be3);
        }
      }
      if (e3.push(">"), pushInnerHTML(e3, ve3, ye3), "string" == typeof ye3) {
        e3.push(escapeTextForBrowser(ye3));
        var ke3 = null;
      } else ke3 = ye3;
      return ke3;
    case "title":
      if (4 === i5.insertionMode || 1 & i5.tagScope || null != r4.itemProp) var we3 = pushTitleImpl(e3, r4);
      else u4 ? we3 = null : (pushTitleImpl(s4.hoistableChunks, r4), we3 = void 0);
      return we3;
    case "link":
      var Ce3 = r4.rel, xe3 = r4.href, Pe3 = r4.precedence;
      if (4 === i5.insertionMode || 1 & i5.tagScope || null != r4.itemProp || "string" != typeof Ce3 || "string" != typeof xe3 || "" === xe3) {
        pushLinkImpl(e3, r4);
        var Re3 = null;
      } else if ("stylesheet" === r4.rel) if ("string" != typeof Pe3 || null != r4.disabled || r4.onLoad || r4.onError) Re3 = pushLinkImpl(e3, r4);
      else {
        var Te3 = s4.styles.get(Pe3), $e3 = n3.styleResources.hasOwnProperty(xe3) ? n3.styleResources[xe3] : void 0;
        if (null !== $e3) {
          n3.styleResources[xe3] = null, Te3 || (Te3 = { precedence: escapeTextForBrowser(Pe3), rules: [], hrefs: [], sheets: /* @__PURE__ */ new Map() }, s4.styles.set(Pe3, Te3));
          var Ee3 = { state: 0, props: mo({}, r4, { "data-precedence": r4.precedence, precedence: null }) };
          if ($e3) {
            2 === $e3.length && adoptPreloadCredentials(Ee3.props, $e3);
            var Fe3 = s4.preloads.stylesheets.get(xe3);
            Fe3 && 0 < Fe3.length ? Fe3.length = 0 : Ee3.state = 1;
          }
          Te3.sheets.set(xe3, Ee3), a5 && a5.stylesheets.add(Ee3);
        } else if (Te3) {
          var Ie3 = Te3.sheets.get(xe3);
          Ie3 && a5 && a5.stylesheets.add(Ie3);
        }
        l4 && e3.push("<!-- -->"), Re3 = null;
      }
      else r4.onLoad || r4.onError ? Re3 = pushLinkImpl(e3, r4) : (l4 && e3.push("<!-- -->"), Re3 = u4 ? null : pushLinkImpl(s4.hoistableChunks, r4));
      return Re3;
    case "script":
      var Ae3 = r4.async;
      if ("string" != typeof r4.src || !r4.src || !Ae3 || "function" == typeof Ae3 || "symbol" == typeof Ae3 || r4.onLoad || r4.onError || 4 === i5.insertionMode || 1 & i5.tagScope || null != r4.itemProp) var _e3 = pushScriptImpl(e3, r4);
      else {
        var Me3 = r4.src;
        if ("module" === r4.type) var Oe3 = n3.moduleScriptResources, Ne3 = s4.preloads.moduleScripts;
        else Oe3 = n3.scriptResources, Ne3 = s4.preloads.scripts;
        var je3 = Oe3.hasOwnProperty(Me3) ? Oe3[Me3] : void 0;
        if (null !== je3) {
          Oe3[Me3] = null;
          var Le3 = r4;
          if (je3) {
            2 === je3.length && adoptPreloadCredentials(Le3 = mo({}, r4), je3);
            var De3 = Ne3.get(Me3);
            De3 && (De3.length = 0);
          }
          var Be3 = [];
          s4.scripts.add(Be3), pushScriptImpl(Be3, Le3);
        }
        l4 && e3.push("<!-- -->"), _e3 = null;
      }
      return _e3;
    case "style":
      var He3 = r4.precedence, ze3 = r4.href;
      if (4 === i5.insertionMode || 1 & i5.tagScope || null != r4.itemProp || "string" != typeof He3 || "string" != typeof ze3 || "" === ze3) {
        e3.push(startChunkForTag("style"));
        var qe3, Ue3 = null, Ve3 = null;
        for (qe3 in r4) if (go.call(r4, qe3)) {
          var We3 = r4[qe3];
          if (null != We3) switch (qe3) {
            case "children":
              Ue3 = We3;
              break;
            case "dangerouslySetInnerHTML":
              Ve3 = We3;
              break;
            default:
              pushAttribute(e3, qe3, We3);
          }
        }
        e3.push(">");
        var Ke3 = Array.isArray(Ue3) ? 2 > Ue3.length ? Ue3[0] : null : Ue3;
        "function" != typeof Ke3 && "symbol" != typeof Ke3 && null != Ke3 && e3.push(("" + Ke3).replace(Mo, styleReplacer)), pushInnerHTML(e3, Ve3, Ue3), e3.push(endChunkForTag("style"));
        var Qe3 = null;
      } else {
        var Ge3 = s4.styles.get(He3);
        if (null !== (n3.styleResources.hasOwnProperty(ze3) ? n3.styleResources[ze3] : void 0)) {
          n3.styleResources[ze3] = null, Ge3 ? Ge3.hrefs.push(escapeTextForBrowser(ze3)) : (Ge3 = { precedence: escapeTextForBrowser(He3), rules: [], hrefs: [escapeTextForBrowser(ze3)], sheets: /* @__PURE__ */ new Map() }, s4.styles.set(He3, Ge3));
          var Je3, Ye3 = Ge3.rules, Xe3 = null, Ze3 = null;
          for (Je3 in r4) if (go.call(r4, Je3)) {
            var et3 = r4[Je3];
            if (null != et3) switch (Je3) {
              case "children":
                Xe3 = et3;
                break;
              case "dangerouslySetInnerHTML":
                Ze3 = et3;
            }
          }
          var tt3 = Array.isArray(Xe3) ? 2 > Xe3.length ? Xe3[0] : null : Xe3;
          "function" != typeof tt3 && "symbol" != typeof tt3 && null != tt3 && Ye3.push(("" + tt3).replace(Mo, styleReplacer)), pushInnerHTML(Ye3, Ze3, Xe3);
        }
        Ge3 && a5 && a5.styles.add(Ge3), l4 && e3.push("<!-- -->"), Qe3 = void 0;
      }
      return Qe3;
    case "meta":
      if (4 === i5.insertionMode || 1 & i5.tagScope || null != r4.itemProp) var rt3 = pushSelfClosing(e3, r4, "meta");
      else l4 && e3.push("<!-- -->"), rt3 = u4 ? null : "string" == typeof r4.charSet ? pushSelfClosing(s4.charsetChunks, r4, "meta") : "viewport" === r4.name ? pushSelfClosing(s4.viewportChunks, r4, "meta") : pushSelfClosing(s4.hoistableChunks, r4, "meta");
      return rt3;
    case "listing":
    case "pre":
      e3.push(startChunkForTag(t3));
      var nt3, st3 = null, ot3 = null;
      for (nt3 in r4) if (go.call(r4, nt3)) {
        var at3 = r4[nt3];
        if (null != at3) switch (nt3) {
          case "children":
            st3 = at3;
            break;
          case "dangerouslySetInnerHTML":
            ot3 = at3;
            break;
          default:
            pushAttribute(e3, nt3, at3);
        }
      }
      if (e3.push(">"), null != ot3) {
        if (null != st3) throw Error(formatProdErrorMessage(60));
        if ("object" != typeof ot3 || !("__html" in ot3)) throw Error(formatProdErrorMessage(61));
        var it3 = ot3.__html;
        null != it3 && ("string" == typeof it3 && 0 < it3.length && "\n" === it3[0] ? e3.push("\n", it3) : e3.push("" + it3));
      }
      return "string" == typeof st3 && "\n" === st3[0] && e3.push("\n"), st3;
    case "img":
      var lt3 = r4.src, ut3 = r4.srcSet;
      if (!("lazy" === r4.loading || !lt3 && !ut3 || "string" != typeof lt3 && null != lt3 || "string" != typeof ut3 && null != ut3) && "low" !== r4.fetchPriority && false == !!(3 & i5.tagScope) && ("string" != typeof lt3 || ":" !== lt3[4] || "d" !== lt3[0] && "D" !== lt3[0] || "a" !== lt3[1] && "A" !== lt3[1] || "t" !== lt3[2] && "T" !== lt3[2] || "a" !== lt3[3] && "A" !== lt3[3]) && ("string" != typeof ut3 || ":" !== ut3[4] || "d" !== ut3[0] && "D" !== ut3[0] || "a" !== ut3[1] && "A" !== ut3[1] || "t" !== ut3[2] && "T" !== ut3[2] || "a" !== ut3[3] && "A" !== ut3[3])) {
        var ct3 = "string" == typeof r4.sizes ? r4.sizes : void 0, dt3 = ut3 ? ut3 + "\n" + (ct3 || "") : lt3, ht3 = s4.preloads.images, pt3 = ht3.get(dt3);
        if (pt3) ("high" === r4.fetchPriority || 10 > s4.highImagePreloads.size) && (ht3.delete(dt3), s4.highImagePreloads.add(pt3));
        else if (!n3.imageResources.hasOwnProperty(dt3)) {
          n3.imageResources[dt3] = Fo;
          var ft3, mt3 = r4.crossOrigin, gt3 = "string" == typeof mt3 ? "use-credentials" === mt3 ? mt3 : "" : void 0, yt3 = s4.headers;
          yt3 && 0 < yt3.remainingCapacity && "string" != typeof r4.srcSet && ("high" === r4.fetchPriority || 500 > yt3.highImagePreloads.length) && (ft3 = getPreloadAsHeader(lt3, "image", { imageSrcSet: r4.srcSet, imageSizes: r4.sizes, crossOrigin: gt3, integrity: r4.integrity, nonce: r4.nonce, type: r4.type, fetchPriority: r4.fetchPriority, referrerPolicy: r4.refererPolicy }), 0 <= (yt3.remainingCapacity -= ft3.length + 2)) ? (s4.resets.image[dt3] = Fo, yt3.highImagePreloads && (yt3.highImagePreloads += ", "), yt3.highImagePreloads += ft3) : (pushLinkImpl(pt3 = [], { rel: "preload", as: "image", href: ut3 ? void 0 : lt3, imageSrcSet: ut3, imageSizes: ct3, crossOrigin: gt3, integrity: r4.integrity, type: r4.type, fetchPriority: r4.fetchPriority, referrerPolicy: r4.referrerPolicy }), "high" === r4.fetchPriority || 10 > s4.highImagePreloads.size ? s4.highImagePreloads.add(pt3) : (s4.bulkPreloads.add(pt3), ht3.set(dt3, pt3)));
        }
      }
      return pushSelfClosing(e3, r4, "img");
    case "base":
    case "area":
    case "br":
    case "col":
    case "embed":
    case "hr":
    case "keygen":
    case "param":
    case "source":
    case "track":
    case "wbr":
      return pushSelfClosing(e3, r4, t3);
    case "head":
      if (2 > i5.insertionMode) {
        var vt3 = o5 || s4.preamble;
        if (vt3.headChunks) throw Error(formatProdErrorMessage(545, "`<head>`"));
        vt3.headChunks = [];
        var bt3 = pushStartSingletonElement(vt3.headChunks, r4, "head");
      } else bt3 = pushStartGenericElement(e3, r4, "head");
      return bt3;
    case "body":
      if (2 > i5.insertionMode) {
        var St3 = o5 || s4.preamble;
        if (St3.bodyChunks) throw Error(formatProdErrorMessage(545, "`<body>`"));
        St3.bodyChunks = [];
        var kt3 = pushStartSingletonElement(St3.bodyChunks, r4, "body");
      } else kt3 = pushStartGenericElement(e3, r4, "body");
      return kt3;
    case "html":
      if (0 === i5.insertionMode) {
        var wt3 = o5 || s4.preamble;
        if (wt3.htmlChunks) throw Error(formatProdErrorMessage(545, "`<html>`"));
        wt3.htmlChunks = [""];
        var Ct3 = pushStartSingletonElement(wt3.htmlChunks, r4, "html");
      } else Ct3 = pushStartGenericElement(e3, r4, "html");
      return Ct3;
    default:
      if (-1 !== t3.indexOf("-")) {
        e3.push(startChunkForTag(t3));
        var xt3, Pt3 = null, Rt3 = null;
        for (xt3 in r4) if (go.call(r4, xt3)) {
          var Tt3 = r4[xt3];
          if (null != Tt3) {
            var $t3 = xt3;
            switch (xt3) {
              case "children":
                Pt3 = Tt3;
                break;
              case "dangerouslySetInnerHTML":
                Rt3 = Tt3;
                break;
              case "style":
                pushStyleAttribute(e3, Tt3);
                break;
              case "suppressContentEditableWarning":
              case "suppressHydrationWarning":
              case "ref":
                break;
              case "className":
                $t3 = "class";
              default:
                if (isAttributeNameSafe(xt3) && "function" != typeof Tt3 && "symbol" != typeof Tt3 && false !== Tt3) {
                  if (true === Tt3) Tt3 = "";
                  else if ("object" == typeof Tt3) continue;
                  e3.push(" ", $t3, '="', escapeTextForBrowser(Tt3), '"');
                }
            }
          }
        }
        return e3.push(">"), pushInnerHTML(e3, Rt3, Pt3), Pt3;
      }
  }
  return pushStartGenericElement(e3, r4, t3);
}
function endChunkForTag(e3) {
  var t3 = jo.get(e3);
  return void 0 === t3 && (t3 = "</" + e3 + ">", jo.set(e3, t3)), t3;
}
function hoistPreambleState(e3, t3) {
  null === (e3 = e3.preamble).htmlChunks && t3.htmlChunks && (e3.htmlChunks = t3.htmlChunks, t3.contribution |= 1), null === e3.headChunks && t3.headChunks && (e3.headChunks = t3.headChunks, t3.contribution |= 4), null === e3.bodyChunks && t3.bodyChunks && (e3.bodyChunks = t3.bodyChunks, t3.contribution |= 2);
}
function writeBootstrap(e3, t3) {
  t3 = t3.bootstrapChunks;
  for (var r4 = 0; r4 < t3.length - 1; r4++) e3.push(t3[r4]);
  return !(r4 < t3.length) || (r4 = t3[r4], t3.length = 0, e3.push(r4));
}
function writeStartPendingSuspenseBoundary(e3, t3, r4) {
  if (e3.push('<!--$?--><template id="'), null === r4) throw Error(formatProdErrorMessage(395));
  return e3.push(t3.boundaryPrefix), t3 = r4.toString(16), e3.push(t3), e3.push('"></template>');
}
function writePreambleContribution(e3, t3) {
  0 !== (t3 = t3.contribution) && (e3.push("<!--"), e3.push("" + t3), e3.push("-->"));
}
function escapeJSStringsForInstructionScripts(e3) {
  return JSON.stringify(e3).replace(Lo, function(e4) {
    switch (e4) {
      case "<":
        return "\\u003c";
      case "\u2028":
        return "\\u2028";
      case "\u2029":
        return "\\u2029";
      default:
        throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
    }
  });
}
function escapeJSObjectForInstructionScripts(e3) {
  return JSON.stringify(e3).replace(Do, function(e4) {
    switch (e4) {
      case "&":
        return "\\u0026";
      case ">":
        return "\\u003e";
      case "<":
        return "\\u003c";
      case "\u2028":
        return "\\u2028";
      case "\u2029":
        return "\\u2029";
      default:
        throw Error("escapeJSObjectForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
    }
  });
}
function flushStyleTagsLateForBoundary(e3) {
  var t3 = e3.rules, r4 = e3.hrefs, n3 = 0;
  if (r4.length) {
    for (this.push('<style media="not all" data-precedence="'), this.push(e3.precedence), this.push('" data-href="'); n3 < r4.length - 1; n3++) this.push(r4[n3]), this.push(" ");
    for (this.push(r4[n3]), this.push('">'), n3 = 0; n3 < t3.length; n3++) this.push(t3[n3]);
    Ho = this.push("</style>"), Bo = true, t3.length = 0, r4.length = 0;
  }
}
function hasStylesToHoist(e3) {
  return 2 !== e3.state && (Bo = true);
}
function writeHoistablesForBoundary(e3, t3, r4) {
  return Bo = false, Ho = true, t3.styles.forEach(flushStyleTagsLateForBoundary, e3), t3.stylesheets.forEach(hasStylesToHoist), Bo && (r4.stylesToHoist = true), Ho;
}
function flushResource(e3) {
  for (var t3 = 0; t3 < e3.length; t3++) this.push(e3[t3]);
  e3.length = 0;
}
function flushStyleInPreamble(e3) {
  pushLinkImpl(zo, e3.props);
  for (var t3 = 0; t3 < zo.length; t3++) this.push(zo[t3]);
  zo.length = 0, e3.state = 2;
}
function flushStylesInPreamble(e3) {
  var t3 = 0 < e3.sheets.size;
  e3.sheets.forEach(flushStyleInPreamble, this), e3.sheets.clear();
  var r4 = e3.rules, n3 = e3.hrefs;
  if (!t3 || n3.length) {
    if (this.push('<style data-precedence="'), this.push(e3.precedence), e3 = 0, n3.length) {
      for (this.push('" data-href="'); e3 < n3.length - 1; e3++) this.push(n3[e3]), this.push(" ");
      this.push(n3[e3]);
    }
    for (this.push('">'), e3 = 0; e3 < r4.length; e3++) this.push(r4[e3]);
    this.push("</style>"), r4.length = 0, n3.length = 0;
  }
}
function preloadLateStyle(e3) {
  if (0 === e3.state) {
    e3.state = 1;
    var t3 = e3.props;
    for (pushLinkImpl(zo, { rel: "preload", as: "style", href: e3.props.href, crossOrigin: t3.crossOrigin, fetchPriority: t3.fetchPriority, integrity: t3.integrity, media: t3.media, hrefLang: t3.hrefLang, referrerPolicy: t3.referrerPolicy }), e3 = 0; e3 < zo.length; e3++) this.push(zo[e3]);
    zo.length = 0;
  }
}
function preloadLateStyles(e3) {
  e3.sheets.forEach(preloadLateStyle, this), e3.sheets.clear();
}
function writeStyleResourceAttributeInJS(e3, t3, r4) {
  var n3 = t3.toLowerCase();
  switch (typeof r4) {
    case "function":
    case "symbol":
      return;
  }
  switch (t3) {
    case "innerHTML":
    case "dangerouslySetInnerHTML":
    case "suppressContentEditableWarning":
    case "suppressHydrationWarning":
    case "style":
    case "ref":
      return;
    case "className":
      n3 = "class", t3 = "" + r4;
      break;
    case "hidden":
      if (false === r4) return;
      t3 = "";
      break;
    case "src":
    case "href":
      t3 = "" + (r4 = sanitizeURL(r4));
      break;
    default:
      if (2 < t3.length && ("o" === t3[0] || "O" === t3[0]) && ("n" === t3[1] || "N" === t3[1]) || !isAttributeNameSafe(t3)) return;
      t3 = "" + r4;
  }
  e3.push(","), n3 = escapeJSObjectForInstructionScripts(n3), e3.push(n3), e3.push(","), n3 = escapeJSObjectForInstructionScripts(t3), e3.push(n3);
}
function createHoistableState() {
  return { styles: /* @__PURE__ */ new Set(), stylesheets: /* @__PURE__ */ new Set() };
}
function adoptPreloadCredentials(e3, t3) {
  null == e3.crossOrigin && (e3.crossOrigin = t3[0]), null == e3.integrity && (e3.integrity = t3[1]);
}
function getPreloadAsHeader(e3, t3, r4) {
  for (var n3 in t3 = "<" + (e3 = ("" + e3).replace(qo, escapeHrefForLinkHeaderURLContextReplacer)) + '>; rel=preload; as="' + (t3 = ("" + t3).replace(Uo, escapeStringForLinkHeaderQuotedParamValueContextReplacer)) + '"', r4) go.call(r4, n3) && ("string" == typeof (e3 = r4[n3]) && (t3 += "; " + n3.toLowerCase() + '="' + ("" + e3).replace(Uo, escapeStringForLinkHeaderQuotedParamValueContextReplacer) + '"'));
  return t3;
}
function escapeHrefForLinkHeaderURLContextReplacer(e3) {
  switch (e3) {
    case "<":
      return "%3C";
    case ">":
      return "%3E";
    case "\n":
      return "%0A";
    case "\r":
      return "%0D";
    default:
      throw Error("escapeLinkHrefForHeaderContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
  }
}
function escapeStringForLinkHeaderQuotedParamValueContextReplacer(e3) {
  switch (e3) {
    case '"':
      return "%22";
    case "'":
      return "%27";
    case ";":
      return "%3B";
    case ",":
      return "%2C";
    case "\n":
      return "%0A";
    case "\r":
      return "%0D";
    default:
      throw Error("escapeStringForLinkHeaderQuotedParamValueContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
  }
}
function hoistStyleQueueDependency(e3) {
  this.styles.add(e3);
}
function hoistStylesheetDependency(e3) {
  this.stylesheets.add(e3);
}
function pushTextInstance(e3, t3, r4, n3) {
  return r4.generateStaticMarkup ? (e3.push(escapeTextForBrowser(t3)), false) : ("" === t3 ? e3 = n3 : (n3 && e3.push("<!-- -->"), e3.push(escapeTextForBrowser(t3)), e3 = true), e3);
}
function pushSegmentFinale(e3, t3, r4, n3) {
  t3.generateStaticMarkup || r4 && n3 && e3.push("<!-- -->");
}
function getComponentNameFromType(e3) {
  if (null == e3) return null;
  if ("function" == typeof e3) return e3.$$typeof === Wo ? null : e3.displayName || e3.name || null;
  if ("string" == typeof e3) return e3;
  switch (e3) {
    case Js:
      return "Fragment";
    case Xs:
      return "Profiler";
    case Ys:
      return "StrictMode";
    case no:
      return "Suspense";
    case so:
      return "SuspenseList";
    case lo:
      return "Activity";
  }
  if ("object" == typeof e3) switch (e3.$$typeof) {
    case Gs:
      return "Portal";
    case to:
      return (e3.displayName || "Context") + ".Provider";
    case eo:
      return (e3._context.displayName || "Context") + ".Consumer";
    case ro:
      var t3 = e3.render;
      return (e3 = e3.displayName) || (e3 = "" !== (e3 = t3.displayName || t3.name || "") ? "ForwardRef(" + e3 + ")" : "ForwardRef"), e3;
    case oo:
      return null !== (t3 = e3.displayName || null) ? t3 : getComponentNameFromType(e3.type) || "Memo";
    case ao:
      t3 = e3._payload, e3 = e3._init;
      try {
        return getComponentNameFromType(e3(t3));
      } catch (e4) {
      }
  }
  return null;
}
function popToNearestCommonAncestor(e3, t3) {
  if (e3 !== t3) {
    e3.context._currentValue2 = e3.parentValue, e3 = e3.parent;
    var r4 = t3.parent;
    if (null === e3) {
      if (null !== r4) throw Error(formatProdErrorMessage(401));
    } else {
      if (null === r4) throw Error(formatProdErrorMessage(401));
      popToNearestCommonAncestor(e3, r4);
    }
    t3.context._currentValue2 = t3.value;
  }
}
function popAllPrevious(e3) {
  e3.context._currentValue2 = e3.parentValue, null !== (e3 = e3.parent) && popAllPrevious(e3);
}
function pushAllNext(e3) {
  var t3 = e3.parent;
  null !== t3 && pushAllNext(t3), e3.context._currentValue2 = e3.value;
}
function popPreviousToCommonLevel(e3, t3) {
  if (e3.context._currentValue2 = e3.parentValue, null === (e3 = e3.parent)) throw Error(formatProdErrorMessage(402));
  e3.depth === t3.depth ? popToNearestCommonAncestor(e3, t3) : popPreviousToCommonLevel(e3, t3);
}
function popNextToCommonLevel(e3, t3) {
  var r4 = t3.parent;
  if (null === r4) throw Error(formatProdErrorMessage(402));
  e3.depth === r4.depth ? popToNearestCommonAncestor(e3, r4) : popNextToCommonLevel(e3, r4), t3.context._currentValue2 = t3.value;
}
function switchContext(e3) {
  var t3 = Qo;
  t3 !== e3 && (null === t3 ? pushAllNext(e3) : null === e3 ? popAllPrevious(t3) : t3.depth === e3.depth ? popToNearestCommonAncestor(t3, e3) : t3.depth > e3.depth ? popPreviousToCommonLevel(t3, e3) : popNextToCommonLevel(t3, e3), Qo = e3);
}
function pushTreeContext(e3, t3, r4) {
  var n3 = e3.id;
  e3 = e3.overflow;
  var s4 = 32 - Yo(n3) - 1;
  n3 &= ~(1 << s4), r4 += 1;
  var o5 = 32 - Yo(t3) + s4;
  if (30 < o5) {
    var a5 = s4 - s4 % 5;
    return o5 = (n3 & (1 << a5) - 1).toString(32), n3 >>= a5, s4 -= a5, { id: 1 << 32 - Yo(t3) + s4 | r4 << s4 | n3, overflow: o5 + e3 };
  }
  return { id: 1 << o5 | r4 << s4 | n3, overflow: e3 };
}
function noop$2() {
}
function getSuspendedThenable() {
  if (null === ta) throw Error(formatProdErrorMessage(459));
  var e3 = ta;
  return ta = null, e3;
}
function resolveCurrentlyRenderingComponent() {
  if (null === na) throw Error(formatProdErrorMessage(321));
  return na;
}
function createHook() {
  if (0 < ya) throw Error(formatProdErrorMessage(312));
  return { memoizedState: null, queue: null, next: null };
}
function createWorkInProgressHook() {
  return null === la ? null === ia ? (ua = false, ia = la = createHook()) : (ua = true, la = ia) : null === la.next ? (ua = false, la = la.next = createHook()) : (ua = true, la = la.next), la;
}
function getThenableStateAfterSuspending() {
  var e3 = ma;
  return ma = null, e3;
}
function resetHooksState() {
  aa = oa = sa = na = null, ca = false, ia = null, ya = 0, la = ga = null;
}
function basicStateReducer(e3, t3) {
  return "function" == typeof t3 ? t3(e3) : t3;
}
function useReducer(e3, t3, r4) {
  if (na = resolveCurrentlyRenderingComponent(), la = createWorkInProgressHook(), ua) {
    var n3 = la.queue;
    if (t3 = n3.dispatch, null !== ga && void 0 !== (r4 = ga.get(n3))) {
      ga.delete(n3), n3 = la.memoizedState;
      do {
        n3 = e3(n3, r4.action), r4 = r4.next;
      } while (null !== r4);
      return la.memoizedState = n3, [n3, t3];
    }
    return [la.memoizedState, t3];
  }
  return e3 = e3 === basicStateReducer ? "function" == typeof t3 ? t3() : t3 : void 0 !== r4 ? r4(t3) : t3, la.memoizedState = e3, e3 = (e3 = la.queue = { last: null, dispatch: null }).dispatch = dispatchAction.bind(null, na, e3), [la.memoizedState, e3];
}
function useMemo(e3, t3) {
  if (na = resolveCurrentlyRenderingComponent(), t3 = void 0 === t3 ? null : t3, null !== (la = createWorkInProgressHook())) {
    var r4 = la.memoizedState;
    if (null !== r4 && null !== t3) {
      var n3 = r4[1];
      e: if (null === n3) n3 = false;
      else {
        for (var s4 = 0; s4 < n3.length && s4 < t3.length; s4++) if (!ra(t3[s4], n3[s4])) {
          n3 = false;
          break e;
        }
        n3 = true;
      }
      if (n3) return r4[0];
    }
  }
  return e3 = e3(), la.memoizedState = [e3, t3], e3;
}
function dispatchAction(e3, t3, r4) {
  if (25 <= ya) throw Error(formatProdErrorMessage(301));
  if (e3 === na) if (ca = true, e3 = { action: r4, next: null }, null === ga && (ga = /* @__PURE__ */ new Map()), void 0 === (r4 = ga.get(t3))) ga.set(t3, e3);
  else {
    for (t3 = r4; null !== t3.next; ) t3 = t3.next;
    t3.next = e3;
  }
}
function unsupportedStartTransition() {
  throw Error(formatProdErrorMessage(394));
}
function unsupportedSetOptimisticState() {
  throw Error(formatProdErrorMessage(479));
}
function useActionState(e3, t3, r4) {
  resolveCurrentlyRenderingComponent();
  var n3 = ha++, s4 = oa;
  if ("function" == typeof e3.$$FORM_ACTION) {
    var o5 = null, a5 = aa;
    s4 = s4.formState;
    var i5 = e3.$$IS_SIGNATURE_EQUAL;
    if (null !== s4 && "function" == typeof i5) {
      var l4 = s4[1];
      i5.call(e3, s4[2], s4[3]) && (l4 === (o5 = void 0 !== r4 ? "p" + r4 : "k" + murmurhash3_32_gc(JSON.stringify([a5, null, n3]), 0)) && (pa = n3, t3 = s4[0]));
    }
    var u4 = e3.bind(null, t3);
    return e3 = /* @__PURE__ */ __name(function(e4) {
      u4(e4);
    }, "e"), "function" == typeof u4.$$FORM_ACTION && (e3.$$FORM_ACTION = function(e4) {
      e4 = u4.$$FORM_ACTION(e4), void 0 !== r4 && (r4 += "", e4.action = r4);
      var t4 = e4.data;
      return t4 && (null === o5 && (o5 = void 0 !== r4 ? "p" + r4 : "k" + murmurhash3_32_gc(JSON.stringify([a5, null, n3]), 0)), t4.append("$ACTION_KEY", o5)), e4;
    }), [t3, e3, false];
  }
  var c4 = e3.bind(null, t3);
  return [t3, function(e4) {
    c4(e4);
  }, false];
}
function unwrapThenable(e3) {
  var t3 = fa;
  return fa += 1, null === ma && (ma = []), function(e4, t4, r4) {
    switch (void 0 === (r4 = e4[r4]) ? e4.push(t4) : r4 !== t4 && (t4.then(noop$2, noop$2), t4 = r4), t4.status) {
      case "fulfilled":
        return t4.value;
      case "rejected":
        throw t4.reason;
      default:
        switch ("string" == typeof t4.status ? t4.then(noop$2, noop$2) : ((e4 = t4).status = "pending", e4.then(function(e5) {
          if ("pending" === t4.status) {
            var r5 = t4;
            r5.status = "fulfilled", r5.value = e5;
          }
        }, function(e5) {
          if ("pending" === t4.status) {
            var r5 = t4;
            r5.status = "rejected", r5.reason = e5;
          }
        })), t4.status) {
          case "fulfilled":
            return t4.value;
          case "rejected":
            throw t4.reason;
        }
        throw ta = t4, ea;
    }
  }(ma, e3, t3);
}
function unsupportedRefresh() {
  throw Error(formatProdErrorMessage(393));
}
function noop$1() {
}
function describeBuiltInComponentFrame(e3) {
  if (void 0 === va) try {
    throw Error();
  } catch (e4) {
    var t3 = e4.stack.trim().match(/\n( *(at )?)/);
    va = t3 && t3[1] || "", ba = -1 < e4.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e4.stack.indexOf("@") ? "@unknown:0:0" : "";
  }
  return "\n" + va + e3 + ba;
}
function describeNativeComponentFrame(e3, t3) {
  if (!e3 || Ca) return "";
  Ca = true;
  var r4 = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    var n3 = { DetermineComponentFrameRoot: /* @__PURE__ */ __name(function() {
      try {
        if (t3) {
          var Fake = /* @__PURE__ */ __name(function() {
            throw Error();
          }, "Fake");
          if (Object.defineProperty(Fake.prototype, "props", { set: /* @__PURE__ */ __name(function() {
            throw Error();
          }, "set") }), "object" == typeof Reflect && Reflect.construct) {
            try {
              Reflect.construct(Fake, []);
            } catch (e4) {
              var r5 = e4;
            }
            Reflect.construct(e3, [], Fake);
          } else {
            try {
              Fake.call();
            } catch (e4) {
              r5 = e4;
            }
            e3.call(Fake.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (e4) {
            r5 = e4;
          }
          (Fake = e3()) && "function" == typeof Fake.catch && Fake.catch(function() {
          });
        }
      } catch (e4) {
        if (e4 && r5 && "string" == typeof e4.stack) return [e4.stack, r5.stack];
      }
      return [null, null];
    }, "DetermineComponentFrameRoot") };
    n3.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
    var s4 = Object.getOwnPropertyDescriptor(n3.DetermineComponentFrameRoot, "name");
    s4 && s4.configurable && Object.defineProperty(n3.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
    var o5 = n3.DetermineComponentFrameRoot(), a5 = o5[0], i5 = o5[1];
    if (a5 && i5) {
      var l4 = a5.split("\n"), u4 = i5.split("\n");
      for (s4 = n3 = 0; n3 < l4.length && !l4[n3].includes("DetermineComponentFrameRoot"); ) n3++;
      for (; s4 < u4.length && !u4[s4].includes("DetermineComponentFrameRoot"); ) s4++;
      if (n3 === l4.length || s4 === u4.length) for (n3 = l4.length - 1, s4 = u4.length - 1; 1 <= n3 && 0 <= s4 && l4[n3] !== u4[s4]; ) s4--;
      for (; 1 <= n3 && 0 <= s4; n3--, s4--) if (l4[n3] !== u4[s4]) {
        if (1 !== n3 || 1 !== s4) do {
          if (n3--, 0 > --s4 || l4[n3] !== u4[s4]) {
            var c4 = "\n" + l4[n3].replace(" at new ", " at ");
            return e3.displayName && c4.includes("<anonymous>") && (c4 = c4.replace("<anonymous>", e3.displayName)), c4;
          }
        } while (1 <= n3 && 0 <= s4);
        break;
      }
    }
  } finally {
    Ca = false, Error.prepareStackTrace = r4;
  }
  return (r4 = e3 ? e3.displayName || e3.name : "") ? describeBuiltInComponentFrame(r4) : "";
}
function describeComponentStackByType(e3) {
  if ("string" == typeof e3) return describeBuiltInComponentFrame(e3);
  if ("function" == typeof e3) return e3.prototype && e3.prototype.isReactComponent ? describeNativeComponentFrame(e3, true) : describeNativeComponentFrame(e3, false);
  if ("object" == typeof e3 && null !== e3) {
    switch (e3.$$typeof) {
      case ro:
        return describeNativeComponentFrame(e3.render, false);
      case oo:
        return describeNativeComponentFrame(e3.type, false);
      case ao:
        var t3 = e3, r4 = t3._payload;
        t3 = t3._init;
        try {
          e3 = t3(r4);
        } catch (e4) {
          return describeBuiltInComponentFrame("Lazy");
        }
        return describeComponentStackByType(e3);
    }
    if ("string" == typeof e3.name) return r4 = e3.env, describeBuiltInComponentFrame(e3.name + (r4 ? " [" + r4 + "]" : ""));
  }
  switch (e3) {
    case so:
      return describeBuiltInComponentFrame("SuspenseList");
    case no:
      return describeBuiltInComponentFrame("Suspense");
  }
  return "";
}
function defaultErrorHandler(e3) {
  if ("object" == typeof e3 && null !== e3 && "string" == typeof e3.environmentName) {
    var t3 = e3.environmentName;
    "string" == typeof (e3 = [e3].slice(0))[0] ? e3.splice(0, 1, "[%s] " + e3[0], " " + t3 + " ") : e3.splice(0, 0, "[%s] ", " " + t3 + " "), e3.unshift(console), (t3 = Vo.apply(console.error, e3))();
  } else console.error(e3);
  return null;
}
function noop() {
}
function RequestInstance(e3, t3, r4, n3, s4, o5, a5, i5, l4, u4, c4) {
  var d4 = /* @__PURE__ */ new Set();
  this.destination = null, this.flushScheduled = false, this.resumableState = e3, this.renderState = t3, this.rootFormatContext = r4, this.progressiveChunkSize = void 0 === n3 ? 12800 : n3, this.status = 10, this.fatalError = null, this.pendingRootTasks = this.allPendingTasks = this.nextSegmentId = 0, this.completedPreambleSegments = this.completedRootSegment = null, this.abortableTasks = d4, this.pingedTasks = [], this.clientRenderedBoundaries = [], this.completedBoundaries = [], this.partialBoundaries = [], this.trackedPostpones = null, this.onError = void 0 === s4 ? defaultErrorHandler : s4, this.onPostpone = void 0 === u4 ? noop : u4, this.onAllReady = void 0 === o5 ? noop : o5, this.onShellReady = void 0 === a5 ? noop : a5, this.onShellError = void 0 === i5 ? noop : i5, this.onFatalError = void 0 === l4 ? noop : l4, this.formState = void 0 === c4 ? null : c4;
}
function pingTask(e3, t3) {
  e3.pingedTasks.push(t3), 1 === e3.pingedTasks.length && (e3.flushScheduled = null !== e3.destination, performWork(e3));
}
function createSuspenseBoundary(e3, t3, r4, n3) {
  return { status: 0, rootSegmentID: -1, parentFlushed: false, pendingTasks: 0, completedSegments: [], byteSize: 0, fallbackAbortableTasks: t3, errorDigest: null, contentState: createHoistableState(), fallbackState: createHoistableState(), contentPreamble: r4, fallbackPreamble: n3, trackedContentKeyPath: null, trackedFallbackNode: null };
}
function createRenderTask(e3, t3, r4, n3, s4, o5, a5, i5, l4, u4, c4, d4, h4, p4, f4) {
  e3.allPendingTasks++, null === s4 ? e3.pendingRootTasks++ : s4.pendingTasks++;
  var m5 = { replay: null, node: r4, childIndex: n3, ping: /* @__PURE__ */ __name(function() {
    return pingTask(e3, m5);
  }, "ping"), blockedBoundary: s4, blockedSegment: o5, blockedPreamble: a5, hoistableState: i5, abortSet: l4, keyPath: u4, formatContext: c4, context: d4, treeContext: h4, componentStack: p4, thenableState: t3, isFallback: f4 };
  return l4.add(m5), m5;
}
function createReplayTask(e3, t3, r4, n3, s4, o5, a5, i5, l4, u4, c4, d4, h4, p4) {
  e3.allPendingTasks++, null === o5 ? e3.pendingRootTasks++ : o5.pendingTasks++, r4.pendingTasks++;
  var f4 = { replay: r4, node: n3, childIndex: s4, ping: /* @__PURE__ */ __name(function() {
    return pingTask(e3, f4);
  }, "ping"), blockedBoundary: o5, blockedSegment: null, blockedPreamble: null, hoistableState: a5, abortSet: i5, keyPath: l4, formatContext: u4, context: c4, treeContext: d4, componentStack: h4, thenableState: t3, isFallback: p4 };
  return i5.add(f4), f4;
}
function createPendingSegment(e3, t3, r4, n3, s4, o5) {
  return { status: 0, parentFlushed: false, id: -1, index: t3, chunks: [], children: [], preambleChildren: [], parentFormatContext: n3, boundary: r4, lastPushedText: s4, textEmbedded: o5 };
}
function pushComponentStack(e3) {
  var t3 = e3.node;
  if ("object" == typeof t3 && null !== t3 && t3.$$typeof === Qs) e3.componentStack = { parent: e3.componentStack, type: t3.type };
}
function getThrownInfo(e3) {
  var t3 = {};
  return e3 && Object.defineProperty(t3, "componentStack", { configurable: true, enumerable: true, get: /* @__PURE__ */ __name(function() {
    try {
      var r4 = "", n3 = e3;
      do {
        r4 += describeComponentStackByType(n3.type), n3 = n3.parent;
      } while (n3);
      var s4 = r4;
    } catch (e4) {
      s4 = "\nError generating stack: " + e4.message + "\n" + e4.stack;
    }
    return Object.defineProperty(t3, "componentStack", { value: s4 }), s4;
  }, "get") }), t3;
}
function logRecoverableError(e3, t3, r4) {
  if (null == (t3 = (e3 = e3.onError)(t3, r4)) || "string" == typeof t3) return t3;
}
function fatalError(e3, t3) {
  var r4 = e3.onShellError, n3 = e3.onFatalError;
  r4(t3), n3(t3), null !== e3.destination ? (e3.status = 14, e3.destination.destroy(t3)) : (e3.status = 13, e3.fatalError = t3);
}
function renderWithHooks(e3, t3, r4, n3, s4, o5) {
  var a5 = t3.thenableState;
  for (t3.thenableState = null, na = {}, sa = t3, oa = e3, aa = r4, ha = da = 0, pa = -1, fa = 0, ma = a5, e3 = n3(s4, o5); ca; ) ca = false, ha = da = 0, pa = -1, fa = 0, ya += 1, la = null, e3 = n3(s4, o5);
  return resetHooksState(), e3;
}
function finishFunctionComponent(e3, t3, r4, n3, s4, o5, a5) {
  var i5 = false;
  if (0 !== o5 && null !== e3.formState) {
    var l4 = t3.blockedSegment;
    if (null !== l4) {
      i5 = true, l4 = l4.chunks;
      for (var u4 = 0; u4 < o5; u4++) u4 === a5 ? l4.push("<!--F!-->") : l4.push("<!--F-->");
    }
  }
  o5 = t3.keyPath, t3.keyPath = r4, s4 ? (r4 = t3.treeContext, t3.treeContext = pushTreeContext(r4, 1, 0), renderNode(e3, t3, n3, -1), t3.treeContext = r4) : i5 ? renderNode(e3, t3, n3, -1) : renderNodeDestructive(e3, t3, n3, -1), t3.keyPath = o5;
}
function renderElement(e3, t3, r4, n3, s4, o5) {
  if ("function" == typeof n3) if (n3.prototype && n3.prototype.isReactComponent) {
    var a5 = s4;
    if ("ref" in s4) for (var i5 in a5 = {}, s4) "ref" !== i5 && (a5[i5] = s4[i5]);
    var l4 = n3.defaultProps;
    if (l4) for (var u4 in a5 === s4 && (a5 = mo({}, a5, s4)), l4) void 0 === a5[u4] && (a5[u4] = l4[u4]);
    s4 = a5, a5 = Ko, "object" == typeof (l4 = n3.contextType) && null !== l4 && (a5 = l4._currentValue2);
    var c4 = void 0 !== (a5 = new n3(s4, a5)).state ? a5.state : null;
    if (a5.updater = Go, a5.props = s4, a5.state = c4, l4 = { queue: [], replace: false }, a5._reactInternals = l4, o5 = n3.contextType, a5.context = "object" == typeof o5 && null !== o5 ? o5._currentValue2 : Ko, "function" == typeof (o5 = n3.getDerivedStateFromProps) && (c4 = null == (o5 = o5(s4, c4)) ? c4 : mo({}, c4, o5), a5.state = c4), "function" != typeof n3.getDerivedStateFromProps && "function" != typeof a5.getSnapshotBeforeUpdate && ("function" == typeof a5.UNSAFE_componentWillMount || "function" == typeof a5.componentWillMount)) if (n3 = a5.state, "function" == typeof a5.componentWillMount && a5.componentWillMount(), "function" == typeof a5.UNSAFE_componentWillMount && a5.UNSAFE_componentWillMount(), n3 !== a5.state && Go.enqueueReplaceState(a5, a5.state, null), null !== l4.queue && 0 < l4.queue.length) if (n3 = l4.queue, o5 = l4.replace, l4.queue = null, l4.replace = false, o5 && 1 === n3.length) a5.state = n3[0];
    else {
      for (l4 = o5 ? n3[0] : a5.state, c4 = true, o5 = o5 ? 1 : 0; o5 < n3.length; o5++) null != (u4 = "function" == typeof (u4 = n3[o5]) ? u4.call(a5, l4, s4, void 0) : u4) && (c4 ? (c4 = false, l4 = mo({}, l4, u4)) : mo(l4, u4));
      a5.state = l4;
    }
    else l4.queue = null;
    if (n3 = a5.render(), 12 === e3.status) throw null;
    s4 = t3.keyPath, t3.keyPath = r4, renderNodeDestructive(e3, t3, n3, -1), t3.keyPath = s4;
  } else {
    if (n3 = renderWithHooks(e3, t3, r4, n3, s4, void 0), 12 === e3.status) throw null;
    finishFunctionComponent(e3, t3, r4, n3, 0 !== da, ha, pa);
  }
  else {
    if ("string" != typeof n3) {
      switch (n3) {
        case uo:
        case Ys:
        case Xs:
        case Js:
          return n3 = t3.keyPath, t3.keyPath = r4, renderNodeDestructive(e3, t3, s4.children, -1), void (t3.keyPath = n3);
        case lo:
          return void ("hidden" !== s4.mode && (n3 = t3.keyPath, t3.keyPath = r4, renderNodeDestructive(e3, t3, s4.children, -1), t3.keyPath = n3));
        case so:
          return n3 = t3.keyPath, t3.keyPath = r4, renderNodeDestructive(e3, t3, s4.children, -1), void (t3.keyPath = n3);
        case ho:
        case io:
          throw Error(formatProdErrorMessage(343));
        case no:
          e: if (null !== t3.replay) {
            n3 = t3.keyPath, t3.keyPath = r4, r4 = s4.children;
            try {
              renderNode(e3, t3, r4, -1);
            } finally {
              t3.keyPath = n3;
            }
          } else {
            n3 = t3.keyPath;
            var d4 = t3.blockedBoundary;
            o5 = t3.blockedPreamble;
            var h4 = t3.hoistableState;
            u4 = t3.blockedSegment, i5 = s4.fallback, s4 = s4.children;
            var p4 = /* @__PURE__ */ new Set(), f4 = 2 > t3.formatContext.insertionMode ? createSuspenseBoundary(0, p4, { htmlChunks: null, headChunks: null, bodyChunks: null, contribution: 0 }, { htmlChunks: null, headChunks: null, bodyChunks: null, contribution: 0 }) : createSuspenseBoundary(0, p4, null, null);
            null !== e3.trackedPostpones && (f4.trackedContentKeyPath = r4);
            var m5 = createPendingSegment(0, u4.chunks.length, f4, t3.formatContext, false, false);
            u4.children.push(m5), u4.lastPushedText = false;
            var g3 = createPendingSegment(0, 0, null, t3.formatContext, false, false);
            if (g3.parentFlushed = true, null !== e3.trackedPostpones) {
              l4 = [(a5 = [r4[0], "Suspense Fallback", r4[2]])[1], a5[2], [], null], e3.trackedPostpones.workingMap.set(a5, l4), f4.trackedFallbackNode = l4, t3.blockedSegment = m5, t3.blockedPreamble = f4.fallbackPreamble, t3.keyPath = a5, m5.status = 6;
              try {
                renderNode(e3, t3, i5, -1), pushSegmentFinale(m5.chunks, e3.renderState, m5.lastPushedText, m5.textEmbedded), m5.status = 1;
              } catch (t4) {
                throw m5.status = 12 === e3.status ? 3 : 4, t4;
              } finally {
                t3.blockedSegment = u4, t3.blockedPreamble = o5, t3.keyPath = n3;
              }
              pushComponentStack(t3 = createRenderTask(e3, null, s4, -1, f4, g3, f4.contentPreamble, f4.contentState, t3.abortSet, r4, t3.formatContext, t3.context, t3.treeContext, t3.componentStack, t3.isFallback)), e3.pingedTasks.push(t3);
            } else {
              t3.blockedBoundary = f4, t3.blockedPreamble = f4.contentPreamble, t3.hoistableState = f4.contentState, t3.blockedSegment = g3, t3.keyPath = r4, g3.status = 6;
              try {
                if (renderNode(e3, t3, s4, -1), pushSegmentFinale(g3.chunks, e3.renderState, g3.lastPushedText, g3.textEmbedded), g3.status = 1, queueCompletedSegment(f4, g3), 0 === f4.pendingTasks && 0 === f4.status) {
                  f4.status = 1, 0 === e3.pendingRootTasks && t3.blockedPreamble && preparePreamble(e3);
                  break e;
                }
              } catch (r5) {
                f4.status = 4, 12 === e3.status ? (g3.status = 3, a5 = e3.fatalError) : (g3.status = 4, a5 = r5), c4 = logRecoverableError(e3, a5, l4 = getThrownInfo(t3.componentStack)), f4.errorDigest = c4, untrackBoundary(e3, f4);
              } finally {
                t3.blockedBoundary = d4, t3.blockedPreamble = o5, t3.hoistableState = h4, t3.blockedSegment = u4, t3.keyPath = n3;
              }
              pushComponentStack(t3 = createRenderTask(e3, null, i5, -1, d4, m5, f4.fallbackPreamble, f4.fallbackState, p4, [r4[0], "Suspense Fallback", r4[2]], t3.formatContext, t3.context, t3.treeContext, t3.componentStack, true)), e3.pingedTasks.push(t3);
            }
          }
          return;
      }
      if ("object" == typeof n3 && null !== n3) switch (n3.$$typeof) {
        case ro:
          if ("ref" in s4) for (f4 in a5 = {}, s4) "ref" !== f4 && (a5[f4] = s4[f4]);
          else a5 = s4;
          return void finishFunctionComponent(e3, t3, r4, n3 = renderWithHooks(e3, t3, r4, n3.render, a5, o5), 0 !== da, ha, pa);
        case oo:
          return void renderElement(e3, t3, r4, n3.type, s4, o5);
        case Zs:
        case to:
          if (l4 = s4.children, a5 = t3.keyPath, s4 = s4.value, c4 = n3._currentValue2, n3._currentValue2 = s4, Qo = n3 = { parent: o5 = Qo, depth: null === o5 ? 0 : o5.depth + 1, context: n3, parentValue: c4, value: s4 }, t3.context = n3, t3.keyPath = r4, renderNodeDestructive(e3, t3, l4, -1), null === (e3 = Qo)) throw Error(formatProdErrorMessage(403));
          return e3.context._currentValue2 = e3.parentValue, e3 = Qo = e3.parent, t3.context = e3, void (t3.keyPath = a5);
        case eo:
          return n3 = (s4 = s4.children)(n3._context._currentValue2), s4 = t3.keyPath, t3.keyPath = r4, renderNodeDestructive(e3, t3, n3, -1), void (t3.keyPath = s4);
        case ao:
          if (n3 = (a5 = n3._init)(n3._payload), 12 === e3.status) throw null;
          return void renderElement(e3, t3, r4, n3, s4, o5);
      }
      throw Error(formatProdErrorMessage(130, null == n3 ? n3 : typeof n3, ""));
    }
    if (null === (a5 = t3.blockedSegment)) a5 = s4.children, l4 = t3.formatContext, c4 = t3.keyPath, t3.formatContext = getChildFormatContext(l4, n3, s4), t3.keyPath = r4, renderNode(e3, t3, a5, -1), t3.formatContext = l4, t3.keyPath = c4;
    else {
      o5 = pushStartInstance(a5.chunks, n3, s4, e3.resumableState, e3.renderState, t3.blockedPreamble, t3.hoistableState, t3.formatContext, a5.lastPushedText, t3.isFallback), a5.lastPushedText = false, l4 = t3.formatContext, c4 = t3.keyPath, t3.keyPath = r4, 3 === (t3.formatContext = getChildFormatContext(l4, n3, s4)).insertionMode ? (r4 = createPendingSegment(0, 0, null, t3.formatContext, false, false), a5.preambleChildren.push(r4), pushComponentStack(r4 = createRenderTask(e3, null, o5, -1, t3.blockedBoundary, r4, t3.blockedPreamble, t3.hoistableState, e3.abortableTasks, t3.keyPath, t3.formatContext, t3.context, t3.treeContext, t3.componentStack, t3.isFallback)), e3.pingedTasks.push(r4)) : renderNode(e3, t3, o5, -1), t3.formatContext = l4, t3.keyPath = c4;
      e: {
        switch (t3 = a5.chunks, e3 = e3.resumableState, n3) {
          case "title":
          case "style":
          case "script":
          case "area":
          case "base":
          case "br":
          case "col":
          case "embed":
          case "hr":
          case "img":
          case "input":
          case "keygen":
          case "link":
          case "meta":
          case "param":
          case "source":
          case "track":
          case "wbr":
            break e;
          case "body":
            if (1 >= l4.insertionMode) {
              e3.hasBody = true;
              break e;
            }
            break;
          case "html":
            if (0 === l4.insertionMode) {
              e3.hasHtml = true;
              break e;
            }
            break;
          case "head":
            if (1 >= l4.insertionMode) break e;
        }
        t3.push(endChunkForTag(n3));
      }
      a5.lastPushedText = false;
    }
  }
}
function resumeNode(e3, t3, r4, n3, s4) {
  var o5 = t3.replay, a5 = t3.blockedBoundary, i5 = createPendingSegment(0, 0, null, t3.formatContext, false, false);
  i5.id = r4, i5.parentFlushed = true;
  try {
    t3.replay = null, t3.blockedSegment = i5, renderNode(e3, t3, n3, s4), i5.status = 1, null === a5 ? e3.completedRootSegment = i5 : (queueCompletedSegment(a5, i5), a5.parentFlushed && e3.partialBoundaries.push(a5));
  } finally {
    t3.replay = o5, t3.blockedSegment = null;
  }
}
function renderNodeDestructive(e3, t3, r4, n3) {
  null !== t3.replay && "number" == typeof t3.replay.slots ? resumeNode(e3, t3, t3.replay.slots, r4, n3) : (t3.node = r4, t3.childIndex = n3, r4 = t3.componentStack, pushComponentStack(t3), retryNode(e3, t3), t3.componentStack = r4);
}
function retryNode(e3, t3) {
  var r4 = t3.node, n3 = t3.childIndex;
  if (null !== r4) {
    if ("object" == typeof r4) {
      switch (r4.$$typeof) {
        case Qs:
          var s4 = r4.type, o5 = r4.key, a5 = r4.props, i5 = void 0 !== (r4 = a5.ref) ? r4 : null, l4 = getComponentNameFromType(s4), u4 = null == o5 ? -1 === n3 ? 0 : n3 : o5;
          if (o5 = [t3.keyPath, l4, u4], null !== t3.replay) e: {
            var c4 = t3.replay;
            for (n3 = c4.nodes, r4 = 0; r4 < n3.length; r4++) {
              var d4 = n3[r4];
              if (u4 === d4[1]) {
                if (4 === d4.length) {
                  if (null !== l4 && l4 !== d4[0]) throw Error(formatProdErrorMessage(490, d4[0], l4));
                  var h4 = d4[2];
                  l4 = d4[3], u4 = t3.node, t3.replay = { nodes: h4, slots: l4, pendingTasks: 1 };
                  try {
                    if (renderElement(e3, t3, o5, s4, a5, i5), 1 === t3.replay.pendingTasks && 0 < t3.replay.nodes.length) throw Error(formatProdErrorMessage(488));
                    t3.replay.pendingTasks--;
                  } catch (r5) {
                    if ("object" == typeof r5 && null !== r5 && (r5 === ea || "function" == typeof r5.then)) throw t3.node === u4 && (t3.replay = c4), r5;
                    t3.replay.pendingTasks--, a5 = getThrownInfo(t3.componentStack), abortRemainingReplayNodes(e3, o5 = t3.blockedBoundary, h4, l4, s4 = r5, a5 = logRecoverableError(e3, s4, a5));
                  }
                  t3.replay = c4;
                } else {
                  if (s4 !== no) throw Error(formatProdErrorMessage(490, "Suspense", getComponentNameFromType(s4) || "Unknown"));
                  t: {
                    c4 = void 0, s4 = d4[5], i5 = d4[2], l4 = d4[3], u4 = null === d4[4] ? [] : d4[4][2], d4 = null === d4[4] ? null : d4[4][3];
                    var p4 = t3.keyPath, f4 = t3.replay, m5 = t3.blockedBoundary, g3 = t3.hoistableState, y3 = a5.children, v3 = a5.fallback, b3 = /* @__PURE__ */ new Set();
                    (a5 = 2 > t3.formatContext.insertionMode ? createSuspenseBoundary(0, b3, createPreambleState(), createPreambleState()) : createSuspenseBoundary(0, b3, null, null)).parentFlushed = true, a5.rootSegmentID = s4, t3.blockedBoundary = a5, t3.hoistableState = a5.contentState, t3.keyPath = o5, t3.replay = { nodes: i5, slots: l4, pendingTasks: 1 };
                    try {
                      if (renderNode(e3, t3, y3, -1), 1 === t3.replay.pendingTasks && 0 < t3.replay.nodes.length) throw Error(formatProdErrorMessage(488));
                      if (t3.replay.pendingTasks--, 0 === a5.pendingTasks && 0 === a5.status) {
                        a5.status = 1, e3.completedBoundaries.push(a5);
                        break t;
                      }
                    } catch (r5) {
                      a5.status = 4, c4 = logRecoverableError(e3, r5, h4 = getThrownInfo(t3.componentStack)), a5.errorDigest = c4, t3.replay.pendingTasks--, e3.clientRenderedBoundaries.push(a5);
                    } finally {
                      t3.blockedBoundary = m5, t3.hoistableState = g3, t3.replay = f4, t3.keyPath = p4;
                    }
                    pushComponentStack(t3 = createReplayTask(e3, null, { nodes: u4, slots: d4, pendingTasks: 0 }, v3, -1, m5, a5.fallbackState, b3, [o5[0], "Suspense Fallback", o5[2]], t3.formatContext, t3.context, t3.treeContext, t3.componentStack, true)), e3.pingedTasks.push(t3);
                  }
                }
                n3.splice(r4, 1);
                break e;
              }
            }
          }
          else renderElement(e3, t3, o5, s4, a5, i5);
          return;
        case Gs:
          throw Error(formatProdErrorMessage(257));
        case ao:
          if (r4 = (h4 = r4._init)(r4._payload), 12 === e3.status) throw null;
          return void renderNodeDestructive(e3, t3, r4, n3);
      }
      if (fo(r4)) return void renderChildrenArray(e3, t3, r4, n3);
      if (null === r4 || "object" != typeof r4 ? h4 = null : h4 = "function" == typeof (h4 = po && r4[po] || r4["@@iterator"]) ? h4 : null, h4 && (h4 = h4.call(r4))) {
        if (!(r4 = h4.next()).done) {
          a5 = [];
          do {
            a5.push(r4.value), r4 = h4.next();
          } while (!r4.done);
          renderChildrenArray(e3, t3, a5, n3);
        }
        return;
      }
      if ("function" == typeof r4.then) return t3.thenableState = null, renderNodeDestructive(e3, t3, unwrapThenable(r4), n3);
      if (r4.$$typeof === to) return renderNodeDestructive(e3, t3, r4._currentValue2, n3);
      throw n3 = Object.prototype.toString.call(r4), Error(formatProdErrorMessage(31, "[object Object]" === n3 ? "object with keys {" + Object.keys(r4).join(", ") + "}" : n3));
    }
    "string" == typeof r4 ? null !== (n3 = t3.blockedSegment) && (n3.lastPushedText = pushTextInstance(n3.chunks, r4, e3.renderState, n3.lastPushedText)) : "number" != typeof r4 && "bigint" != typeof r4 || null !== (n3 = t3.blockedSegment) && (n3.lastPushedText = pushTextInstance(n3.chunks, "" + r4, e3.renderState, n3.lastPushedText));
  }
}
function renderChildrenArray(e3, t3, r4, n3) {
  var s4 = t3.keyPath;
  if (-1 === n3 || (t3.keyPath = [t3.keyPath, "Fragment", n3], null === t3.replay)) {
    if (o5 = t3.treeContext, a5 = r4.length, null !== t3.replay && (null !== (i5 = t3.replay.slots) && "object" == typeof i5)) {
      for (n3 = 0; n3 < a5; n3++) l4 = r4[n3], t3.treeContext = pushTreeContext(o5, a5, n3), "number" == typeof (u4 = i5[n3]) ? (resumeNode(e3, t3, u4, l4, n3), delete i5[n3]) : renderNode(e3, t3, l4, n3);
      return t3.treeContext = o5, void (t3.keyPath = s4);
    }
    for (i5 = 0; i5 < a5; i5++) n3 = r4[i5], t3.treeContext = pushTreeContext(o5, a5, i5), renderNode(e3, t3, n3, i5);
    t3.treeContext = o5, t3.keyPath = s4;
  } else {
    for (var o5 = t3.replay, a5 = o5.nodes, i5 = 0; i5 < a5.length; i5++) {
      var l4 = a5[i5];
      if (l4[1] === n3) {
        n3 = l4[2], l4 = l4[3], t3.replay = { nodes: n3, slots: l4, pendingTasks: 1 };
        try {
          if (renderChildrenArray(e3, t3, r4, -1), 1 === t3.replay.pendingTasks && 0 < t3.replay.nodes.length) throw Error(formatProdErrorMessage(488));
          t3.replay.pendingTasks--;
        } catch (s5) {
          if ("object" == typeof s5 && null !== s5 && (s5 === ea || "function" == typeof s5.then)) throw s5;
          t3.replay.pendingTasks--, r4 = getThrownInfo(t3.componentStack);
          var u4 = t3.blockedBoundary;
          abortRemainingReplayNodes(e3, u4, n3, l4, s5, r4 = logRecoverableError(e3, s5, r4));
        }
        t3.replay = o5, a5.splice(i5, 1);
        break;
      }
    }
    t3.keyPath = s4;
  }
}
function untrackBoundary(e3, t3) {
  null !== (e3 = e3.trackedPostpones) && (null !== (t3 = t3.trackedContentKeyPath) && (void 0 !== (t3 = e3.workingMap.get(t3)) && (t3.length = 4, t3[2] = [], t3[3] = null)));
}
function spawnNewSuspendedReplayTask(e3, t3, r4) {
  return createReplayTask(e3, r4, t3.replay, t3.node, t3.childIndex, t3.blockedBoundary, t3.hoistableState, t3.abortSet, t3.keyPath, t3.formatContext, t3.context, t3.treeContext, t3.componentStack, t3.isFallback);
}
function spawnNewSuspendedRenderTask(e3, t3, r4) {
  var n3 = t3.blockedSegment, s4 = createPendingSegment(0, n3.chunks.length, null, t3.formatContext, n3.lastPushedText, true);
  return n3.children.push(s4), n3.lastPushedText = false, createRenderTask(e3, r4, t3.node, t3.childIndex, t3.blockedBoundary, s4, t3.blockedPreamble, t3.hoistableState, t3.abortSet, t3.keyPath, t3.formatContext, t3.context, t3.treeContext, t3.componentStack, t3.isFallback);
}
function renderNode(e3, t3, r4, n3) {
  var s4 = t3.formatContext, o5 = t3.context, a5 = t3.keyPath, i5 = t3.treeContext, l4 = t3.componentStack, u4 = t3.blockedSegment;
  if (null === u4) try {
    return renderNodeDestructive(e3, t3, r4, n3);
  } catch (u5) {
    if (resetHooksState(), "object" == typeof (r4 = u5 === ea ? getSuspendedThenable() : u5) && null !== r4) {
      if ("function" == typeof r4.then) return e3 = spawnNewSuspendedReplayTask(e3, t3, n3 = getThenableStateAfterSuspending()).ping, r4.then(e3, e3), t3.formatContext = s4, t3.context = o5, t3.keyPath = a5, t3.treeContext = i5, t3.componentStack = l4, void switchContext(o5);
      if ("Maximum call stack size exceeded" === r4.message) return r4 = spawnNewSuspendedReplayTask(e3, t3, r4 = getThenableStateAfterSuspending()), e3.pingedTasks.push(r4), t3.formatContext = s4, t3.context = o5, t3.keyPath = a5, t3.treeContext = i5, t3.componentStack = l4, void switchContext(o5);
    }
  }
  else {
    var c4 = u4.children.length, d4 = u4.chunks.length;
    try {
      return renderNodeDestructive(e3, t3, r4, n3);
    } catch (h4) {
      if (resetHooksState(), u4.children.length = c4, u4.chunks.length = d4, "object" == typeof (r4 = h4 === ea ? getSuspendedThenable() : h4) && null !== r4) {
        if ("function" == typeof r4.then) return e3 = spawnNewSuspendedRenderTask(e3, t3, n3 = getThenableStateAfterSuspending()).ping, r4.then(e3, e3), t3.formatContext = s4, t3.context = o5, t3.keyPath = a5, t3.treeContext = i5, t3.componentStack = l4, void switchContext(o5);
        if ("Maximum call stack size exceeded" === r4.message) return r4 = spawnNewSuspendedRenderTask(e3, t3, r4 = getThenableStateAfterSuspending()), e3.pingedTasks.push(r4), t3.formatContext = s4, t3.context = o5, t3.keyPath = a5, t3.treeContext = i5, t3.componentStack = l4, void switchContext(o5);
      }
    }
  }
  throw t3.formatContext = s4, t3.context = o5, t3.keyPath = a5, t3.treeContext = i5, switchContext(o5), r4;
}
function abortTaskSoft(e3) {
  var t3 = e3.blockedBoundary;
  null !== (e3 = e3.blockedSegment) && (e3.status = 3, finishedTask(this, t3, e3));
}
function abortRemainingReplayNodes(e3, t3, r4, n3, s4, o5) {
  for (var a5 = 0; a5 < r4.length; a5++) {
    var i5 = r4[a5];
    if (4 === i5.length) abortRemainingReplayNodes(e3, t3, i5[2], i5[3], s4, o5);
    else {
      i5 = i5[5];
      var l4 = e3, u4 = o5, c4 = createSuspenseBoundary(0, /* @__PURE__ */ new Set(), null, null);
      c4.parentFlushed = true, c4.rootSegmentID = i5, c4.status = 4, c4.errorDigest = u4, c4.parentFlushed && l4.clientRenderedBoundaries.push(c4);
    }
  }
  if (r4.length = 0, null !== n3) {
    if (null === t3) throw Error(formatProdErrorMessage(487));
    if (4 !== t3.status && (t3.status = 4, t3.errorDigest = o5, t3.parentFlushed && e3.clientRenderedBoundaries.push(t3)), "object" == typeof n3) for (var d4 in n3) delete n3[d4];
  }
}
function abortTask(e3, t3, r4) {
  var n3 = e3.blockedBoundary, s4 = e3.blockedSegment;
  if (null !== s4) {
    if (6 === s4.status) return;
    s4.status = 3;
  }
  if (s4 = getThrownInfo(e3.componentStack), null === n3) {
    if (13 !== t3.status && 14 !== t3.status) {
      if (null === (n3 = e3.replay)) return logRecoverableError(t3, r4, s4), void fatalError(t3, r4);
      n3.pendingTasks--, 0 === n3.pendingTasks && 0 < n3.nodes.length && (e3 = logRecoverableError(t3, r4, s4), abortRemainingReplayNodes(t3, null, n3.nodes, n3.slots, r4, e3)), t3.pendingRootTasks--, 0 === t3.pendingRootTasks && completeShell(t3);
    }
  } else n3.pendingTasks--, 4 !== n3.status && (n3.status = 4, e3 = logRecoverableError(t3, r4, s4), n3.status = 4, n3.errorDigest = e3, untrackBoundary(t3, n3), n3.parentFlushed && t3.clientRenderedBoundaries.push(n3)), n3.fallbackAbortableTasks.forEach(function(e4) {
    return abortTask(e4, t3, r4);
  }), n3.fallbackAbortableTasks.clear();
  t3.allPendingTasks--, 0 === t3.allPendingTasks && completeAll(t3);
}
function safelyEmitEarlyPreloads(e3, t3) {
  try {
    var r4 = e3.renderState, n3 = r4.onHeaders;
    if (n3) {
      var s4 = r4.headers;
      if (s4) {
        r4.headers = null;
        var o5 = s4.preconnects;
        if (s4.fontPreloads && (o5 && (o5 += ", "), o5 += s4.fontPreloads), s4.highImagePreloads && (o5 && (o5 += ", "), o5 += s4.highImagePreloads), !t3) {
          var a5 = r4.styles.values(), i5 = a5.next();
          e: for (; 0 < s4.remainingCapacity && !i5.done; i5 = a5.next()) for (var l4 = i5.value.sheets.values(), u4 = l4.next(); 0 < s4.remainingCapacity && !u4.done; u4 = l4.next()) {
            var c4 = u4.value, d4 = c4.props, h4 = d4.href, p4 = c4.props, f4 = getPreloadAsHeader(p4.href, "style", { crossOrigin: p4.crossOrigin, integrity: p4.integrity, nonce: p4.nonce, type: p4.type, fetchPriority: p4.fetchPriority, referrerPolicy: p4.referrerPolicy, media: p4.media });
            if (!(0 <= (s4.remainingCapacity -= f4.length + 2))) break e;
            r4.resets.style[h4] = Fo, o5 && (o5 += ", "), o5 += f4, r4.resets.style[h4] = "string" == typeof d4.crossOrigin || "string" == typeof d4.integrity ? [d4.crossOrigin, d4.integrity] : Fo;
          }
        }
        n3(o5 ? { Link: o5 } : {});
      }
    }
  } catch (t4) {
    logRecoverableError(e3, t4, {});
  }
}
function completeShell(e3) {
  null === e3.trackedPostpones && safelyEmitEarlyPreloads(e3, true), null === e3.trackedPostpones && preparePreamble(e3), e3.onShellError = noop, (e3 = e3.onShellReady)();
}
function completeAll(e3) {
  safelyEmitEarlyPreloads(e3, null === e3.trackedPostpones || (null === e3.completedRootSegment || 5 !== e3.completedRootSegment.status)), preparePreamble(e3), (e3 = e3.onAllReady)();
}
function queueCompletedSegment(e3, t3) {
  if (0 === t3.chunks.length && 1 === t3.children.length && null === t3.children[0].boundary && -1 === t3.children[0].id) {
    var r4 = t3.children[0];
    r4.id = t3.id, r4.parentFlushed = true, 1 === r4.status && queueCompletedSegment(e3, r4);
  } else e3.completedSegments.push(t3);
}
function finishedTask(e3, t3, r4) {
  if (null === t3) {
    if (null !== r4 && r4.parentFlushed) {
      if (null !== e3.completedRootSegment) throw Error(formatProdErrorMessage(389));
      e3.completedRootSegment = r4;
    }
    e3.pendingRootTasks--, 0 === e3.pendingRootTasks && completeShell(e3);
  } else t3.pendingTasks--, 4 !== t3.status && (0 === t3.pendingTasks ? (0 === t3.status && (t3.status = 1), null !== r4 && r4.parentFlushed && 1 === r4.status && queueCompletedSegment(t3, r4), t3.parentFlushed && e3.completedBoundaries.push(t3), 1 === t3.status && (t3.fallbackAbortableTasks.forEach(abortTaskSoft, e3), t3.fallbackAbortableTasks.clear(), 0 === e3.pendingRootTasks && null === e3.trackedPostpones && null !== t3.contentPreamble && preparePreamble(e3))) : null !== r4 && r4.parentFlushed && 1 === r4.status && (queueCompletedSegment(t3, r4), 1 === t3.completedSegments.length && t3.parentFlushed && e3.partialBoundaries.push(t3)));
  e3.allPendingTasks--, 0 === e3.allPendingTasks && completeAll(e3);
}
function performWork(e3) {
  if (14 !== e3.status && 13 !== e3.status) {
    var t3 = Qo, r4 = Ro.H;
    Ro.H = Sa;
    var n3 = Ro.A;
    Ro.A = wa;
    var s4 = Ra;
    Ra = e3;
    var o5 = ka;
    ka = e3.resumableState;
    try {
      var a5, i5 = e3.pingedTasks;
      for (a5 = 0; a5 < i5.length; a5++) {
        var l4 = i5[a5], u4 = e3, c4 = l4.blockedSegment;
        if (null === c4) {
          var d4 = u4;
          if (0 !== l4.replay.pendingTasks) {
            switchContext(l4.context);
            try {
              if ("number" == typeof l4.replay.slots ? resumeNode(d4, l4, l4.replay.slots, l4.node, l4.childIndex) : retryNode(d4, l4), 1 === l4.replay.pendingTasks && 0 < l4.replay.nodes.length) throw Error(formatProdErrorMessage(488));
              l4.replay.pendingTasks--, l4.abortSet.delete(l4), finishedTask(d4, l4.blockedBoundary, null);
            } catch (e4) {
              resetHooksState();
              var h4 = e4 === ea ? getSuspendedThenable() : e4;
              if ("object" == typeof h4 && null !== h4 && "function" == typeof h4.then) {
                var p4 = l4.ping;
                h4.then(p4, p4), l4.thenableState = getThenableStateAfterSuspending();
              } else {
                l4.replay.pendingTasks--, l4.abortSet.delete(l4);
                var f4 = getThrownInfo(l4.componentStack);
                u4 = void 0;
                var m5 = d4, g3 = l4.blockedBoundary, y3 = 12 === d4.status ? d4.fatalError : h4;
                abortRemainingReplayNodes(m5, g3, l4.replay.nodes, l4.replay.slots, y3, u4 = logRecoverableError(m5, y3, f4)), d4.pendingRootTasks--, 0 === d4.pendingRootTasks && completeShell(d4), d4.allPendingTasks--, 0 === d4.allPendingTasks && completeAll(d4);
              }
            }
          }
        } else if (d4 = void 0, 0 === (m5 = c4).status) {
          m5.status = 6, switchContext(l4.context);
          var v3 = m5.children.length, b3 = m5.chunks.length;
          try {
            retryNode(u4, l4), pushSegmentFinale(m5.chunks, u4.renderState, m5.lastPushedText, m5.textEmbedded), l4.abortSet.delete(l4), m5.status = 1, finishedTask(u4, l4.blockedBoundary, m5);
          } catch (e4) {
            resetHooksState(), m5.children.length = v3, m5.chunks.length = b3;
            var S4 = e4 === ea ? getSuspendedThenable() : 12 === u4.status ? u4.fatalError : e4;
            if ("object" == typeof S4 && null !== S4 && "function" == typeof S4.then) {
              m5.status = 0, l4.thenableState = getThenableStateAfterSuspending();
              var k4 = l4.ping;
              S4.then(k4, k4);
            } else {
              var w4 = getThrownInfo(l4.componentStack);
              l4.abortSet.delete(l4), m5.status = 4;
              var C4 = l4.blockedBoundary;
              d4 = logRecoverableError(u4, S4, w4), null === C4 ? fatalError(u4, S4) : (C4.pendingTasks--, 4 !== C4.status && (C4.status = 4, C4.errorDigest = d4, untrackBoundary(u4, C4), C4.parentFlushed && u4.clientRenderedBoundaries.push(C4), 0 === u4.pendingRootTasks && null === u4.trackedPostpones && null !== C4.contentPreamble && preparePreamble(u4))), u4.allPendingTasks--, 0 === u4.allPendingTasks && completeAll(u4);
            }
          }
        }
      }
      i5.splice(0, a5), null !== e3.destination && flushCompletedQueues(e3, e3.destination);
    } catch (t4) {
      logRecoverableError(e3, t4, {}), fatalError(e3, t4);
    } finally {
      ka = o5, Ro.H = r4, Ro.A = n3, r4 === Sa && switchContext(t3), Ra = s4;
    }
  }
}
function preparePreambleFromSubtree(e3, t3, r4) {
  t3.preambleChildren.length && r4.push(t3.preambleChildren);
  for (var n3 = false, s4 = 0; s4 < t3.children.length; s4++) n3 = preparePreambleFromSegment(e3, t3.children[s4], r4) || n3;
  return n3;
}
function preparePreambleFromSegment(e3, t3, r4) {
  var n3 = t3.boundary;
  if (null === n3) return preparePreambleFromSubtree(e3, t3, r4);
  var s4 = n3.contentPreamble, o5 = n3.fallbackPreamble;
  if (null === s4 || null === o5) return false;
  switch (n3.status) {
    case 1:
      if (hoistPreambleState(e3.renderState, s4), !(t3 = n3.completedSegments[0])) throw Error(formatProdErrorMessage(391));
      return preparePreambleFromSubtree(e3, t3, r4);
    case 5:
      if (null !== e3.trackedPostpones) return true;
    case 4:
      if (1 === t3.status) return hoistPreambleState(e3.renderState, o5), preparePreambleFromSubtree(e3, t3, r4);
    default:
      return true;
  }
}
function preparePreamble(e3) {
  if (e3.completedRootSegment && null === e3.completedPreambleSegments) {
    var t3 = [], r4 = preparePreambleFromSegment(e3, e3.completedRootSegment, t3), n3 = e3.renderState.preamble;
    (false === r4 || n3.headChunks && n3.bodyChunks) && (e3.completedPreambleSegments = t3);
  }
}
function flushSubtree(e3, t3, r4, n3) {
  switch (r4.parentFlushed = true, r4.status) {
    case 0:
      r4.id = e3.nextSegmentId++;
    case 5:
      return n3 = r4.id, r4.lastPushedText = false, r4.textEmbedded = false, e3 = e3.renderState, t3.push('<template id="'), t3.push(e3.placeholderPrefix), e3 = n3.toString(16), t3.push(e3), t3.push('"></template>');
    case 1:
      r4.status = 2;
      var s4 = true, o5 = r4.chunks, a5 = 0;
      r4 = r4.children;
      for (var i5 = 0; i5 < r4.length; i5++) {
        for (s4 = r4[i5]; a5 < s4.index; a5++) t3.push(o5[a5]);
        s4 = flushSegment(e3, t3, s4, n3);
      }
      for (; a5 < o5.length - 1; a5++) t3.push(o5[a5]);
      return a5 < o5.length && (s4 = t3.push(o5[a5])), s4;
    default:
      throw Error(formatProdErrorMessage(390));
  }
}
function flushSegment(e3, t3, r4, n3) {
  var s4 = r4.boundary;
  if (null === s4) return flushSubtree(e3, t3, r4, n3);
  if (s4.parentFlushed = true, 4 === s4.status) {
    if (!e3.renderState.generateStaticMarkup) {
      var o5 = s4.errorDigest;
      t3.push("<!--$!-->"), t3.push("<template"), o5 && (t3.push(' data-dgst="'), o5 = escapeTextForBrowser(o5), t3.push(o5), t3.push('"')), t3.push("></template>");
    }
    return flushSubtree(e3, t3, r4, n3), e3.renderState.generateStaticMarkup ? t3 = true : ((e3 = s4.fallbackPreamble) && writePreambleContribution(t3, e3), t3 = t3.push("<!--/$-->")), t3;
  }
  if (1 !== s4.status) return 0 === s4.status && (s4.rootSegmentID = e3.nextSegmentId++), 0 < s4.completedSegments.length && e3.partialBoundaries.push(s4), writeStartPendingSuspenseBoundary(t3, e3.renderState, s4.rootSegmentID), n3 && ((s4 = s4.fallbackState).styles.forEach(hoistStyleQueueDependency, n3), s4.stylesheets.forEach(hoistStylesheetDependency, n3)), flushSubtree(e3, t3, r4, n3), t3.push("<!--/$-->");
  if (s4.byteSize > e3.progressiveChunkSize) return s4.rootSegmentID = e3.nextSegmentId++, e3.completedBoundaries.push(s4), writeStartPendingSuspenseBoundary(t3, e3.renderState, s4.rootSegmentID), flushSubtree(e3, t3, r4, n3), t3.push("<!--/$-->");
  if (n3 && ((r4 = s4.contentState).styles.forEach(hoistStyleQueueDependency, n3), r4.stylesheets.forEach(hoistStylesheetDependency, n3)), e3.renderState.generateStaticMarkup || t3.push("<!--$-->"), 1 !== (r4 = s4.completedSegments).length) throw Error(formatProdErrorMessage(391));
  return flushSegment(e3, t3, r4[0], n3), e3.renderState.generateStaticMarkup ? t3 = true : ((e3 = s4.contentPreamble) && writePreambleContribution(t3, e3), t3 = t3.push("<!--/$-->")), t3;
}
function flushSegmentContainer(e3, t3, r4, n3) {
  return function(e4, t4, r5, n4) {
    switch (r5.insertionMode) {
      case 0:
      case 1:
      case 3:
      case 2:
        return e4.push('<div hidden id="'), e4.push(t4.segmentPrefix), t4 = n4.toString(16), e4.push(t4), e4.push('">');
      case 4:
        return e4.push('<svg aria-hidden="true" style="display:none" id="'), e4.push(t4.segmentPrefix), t4 = n4.toString(16), e4.push(t4), e4.push('">');
      case 5:
        return e4.push('<math aria-hidden="true" style="display:none" id="'), e4.push(t4.segmentPrefix), t4 = n4.toString(16), e4.push(t4), e4.push('">');
      case 6:
        return e4.push('<table hidden id="'), e4.push(t4.segmentPrefix), t4 = n4.toString(16), e4.push(t4), e4.push('">');
      case 7:
        return e4.push('<table hidden><tbody id="'), e4.push(t4.segmentPrefix), t4 = n4.toString(16), e4.push(t4), e4.push('">');
      case 8:
        return e4.push('<table hidden><tr id="'), e4.push(t4.segmentPrefix), t4 = n4.toString(16), e4.push(t4), e4.push('">');
      case 9:
        return e4.push('<table hidden><colgroup id="'), e4.push(t4.segmentPrefix), t4 = n4.toString(16), e4.push(t4), e4.push('">');
      default:
        throw Error(formatProdErrorMessage(397));
    }
  }(t3, e3.renderState, r4.parentFormatContext, r4.id), flushSegment(e3, t3, r4, n3), function(e4, t4) {
    switch (t4.insertionMode) {
      case 0:
      case 1:
      case 3:
      case 2:
        return e4.push("</div>");
      case 4:
        return e4.push("</svg>");
      case 5:
        return e4.push("</math>");
      case 6:
        return e4.push("</table>");
      case 7:
        return e4.push("</tbody></table>");
      case 8:
        return e4.push("</tr></table>");
      case 9:
        return e4.push("</colgroup></table>");
      default:
        throw Error(formatProdErrorMessage(397));
    }
  }(t3, r4.parentFormatContext);
}
function flushCompletedBoundary(e3, t3, r4) {
  for (var n3 = r4.completedSegments, s4 = 0; s4 < n3.length; s4++) flushPartiallyCompletedSegment(e3, t3, r4, n3[s4]);
  n3.length = 0, writeHoistablesForBoundary(t3, r4.contentState, e3.renderState), n3 = e3.resumableState, e3 = e3.renderState, s4 = r4.rootSegmentID, r4 = r4.contentState;
  var o5 = e3.stylesToHoist;
  return e3.stylesToHoist = false, t3.push(e3.startInlineScript), o5 ? 2 & n3.instructions ? 8 & n3.instructions ? t3.push('$RR("') : (n3.instructions |= 8, t3.push('$RM=new Map;\n$RR=function(t,u,y){function v(n){this._p=null;n()}for(var w=$RC,p=$RM,q=new Map,r=document,g,b,h=r.querySelectorAll("link[data-precedence],style[data-precedence]"),x=[],k=0;b=h[k++];)"not all"===b.getAttribute("media")?x.push(b):("LINK"===b.tagName&&p.set(b.getAttribute("href"),b),q.set(b.dataset.precedence,g=b));b=0;h=[];var l,a;for(k=!0;;){if(k){var e=y[b++];if(!e){k=!1;b=0;continue}var c=!1,m=0;var d=e[m++];if(a=p.get(d)){var f=a._p;c=!0}else{a=r.createElement("link");a.href=\nd;a.rel="stylesheet";for(a.dataset.precedence=l=e[m++];f=e[m++];)a.setAttribute(f,e[m++]);f=a._p=new Promise(function(n,z){a.onload=v.bind(a,n);a.onerror=v.bind(a,z)});p.set(d,a)}d=a.getAttribute("media");!f||d&&!matchMedia(d).matches||h.push(f);if(c)continue}else{a=x[b++];if(!a)break;l=a.getAttribute("data-precedence");a.removeAttribute("media")}c=q.get(l)||g;c===g&&(g=a);q.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=r.head,c.insertBefore(a,c.firstChild))}Promise.all(h).then(w.bind(null,\nt,u,""),w.bind(null,t,u,"Resource failed to load"))};$RR("')) : (n3.instructions |= 10, t3.push('$RC=function(b,c,e){c=document.getElementById(c);c.parentNode.removeChild(c);var a=document.getElementById(b);if(a){b=a.previousSibling;if(e)b.data="$!",a.setAttribute("data-dgst",e);else{e=b.parentNode;a=b.nextSibling;var f=0;do{if(a&&8===a.nodeType){var d=a.data;if("/$"===d)if(0===f)break;else f--;else"$"!==d&&"$?"!==d&&"$!"!==d||f++}d=a.nextSibling;e.removeChild(a);a=d}while(a);for(;c.firstChild;)e.insertBefore(c.firstChild,a);b.data="$"}b._reactRetry&&b._reactRetry()}};$RM=new Map;\n$RR=function(t,u,y){function v(n){this._p=null;n()}for(var w=$RC,p=$RM,q=new Map,r=document,g,b,h=r.querySelectorAll("link[data-precedence],style[data-precedence]"),x=[],k=0;b=h[k++];)"not all"===b.getAttribute("media")?x.push(b):("LINK"===b.tagName&&p.set(b.getAttribute("href"),b),q.set(b.dataset.precedence,g=b));b=0;h=[];var l,a;for(k=!0;;){if(k){var e=y[b++];if(!e){k=!1;b=0;continue}var c=!1,m=0;var d=e[m++];if(a=p.get(d)){var f=a._p;c=!0}else{a=r.createElement("link");a.href=\nd;a.rel="stylesheet";for(a.dataset.precedence=l=e[m++];f=e[m++];)a.setAttribute(f,e[m++]);f=a._p=new Promise(function(n,z){a.onload=v.bind(a,n);a.onerror=v.bind(a,z)});p.set(d,a)}d=a.getAttribute("media");!f||d&&!matchMedia(d).matches||h.push(f);if(c)continue}else{a=x[b++];if(!a)break;l=a.getAttribute("data-precedence");a.removeAttribute("media")}c=q.get(l)||g;c===g&&(g=a);q.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=r.head,c.insertBefore(a,c.firstChild))}Promise.all(h).then(w.bind(null,\nt,u,""),w.bind(null,t,u,"Resource failed to load"))};$RR("')) : 2 & n3.instructions ? t3.push('$RC("') : (n3.instructions |= 2, t3.push('$RC=function(b,c,e){c=document.getElementById(c);c.parentNode.removeChild(c);var a=document.getElementById(b);if(a){b=a.previousSibling;if(e)b.data="$!",a.setAttribute("data-dgst",e);else{e=b.parentNode;a=b.nextSibling;var f=0;do{if(a&&8===a.nodeType){var d=a.data;if("/$"===d)if(0===f)break;else f--;else"$"!==d&&"$?"!==d&&"$!"!==d||f++}d=a.nextSibling;e.removeChild(a);a=d}while(a);for(;c.firstChild;)e.insertBefore(c.firstChild,a);b.data="$"}b._reactRetry&&b._reactRetry()}};$RC("')), n3 = s4.toString(16), t3.push(e3.boundaryPrefix), t3.push(n3), t3.push('","'), t3.push(e3.segmentPrefix), t3.push(n3), o5 ? (t3.push('",'), function(e4, t4) {
    e4.push("[");
    var r5 = "[";
    t4.stylesheets.forEach(function(t5) {
      if (2 !== t5.state) if (3 === t5.state) e4.push(r5), t5 = escapeJSObjectForInstructionScripts("" + t5.props.href), e4.push(t5), e4.push("]"), r5 = ",[";
      else {
        e4.push(r5);
        var n4 = t5.props["data-precedence"], s5 = t5.props, o6 = sanitizeURL("" + t5.props.href);
        for (var a5 in o6 = escapeJSObjectForInstructionScripts(o6), e4.push(o6), n4 = "" + n4, e4.push(","), n4 = escapeJSObjectForInstructionScripts(n4), e4.push(n4), s5) if (go.call(s5, a5) && null != (n4 = s5[a5])) switch (a5) {
          case "href":
          case "rel":
          case "precedence":
          case "data-precedence":
            break;
          case "children":
          case "dangerouslySetInnerHTML":
            throw Error(formatProdErrorMessage(399, "link"));
          default:
            writeStyleResourceAttributeInJS(e4, a5, n4);
        }
        e4.push("]"), r5 = ",[", t5.state = 3;
      }
    }), e4.push("]");
  }(t3, r4)) : t3.push('"'), r4 = t3.push(")<\/script>"), writeBootstrap(t3, e3) && r4;
}
function flushPartiallyCompletedSegment(e3, t3, r4, n3) {
  if (2 === n3.status) return true;
  var s4 = r4.contentState, o5 = n3.id;
  if (-1 === o5) {
    if (-1 === (n3.id = r4.rootSegmentID)) throw Error(formatProdErrorMessage(392));
    return flushSegmentContainer(e3, t3, n3, s4);
  }
  return o5 === r4.rootSegmentID ? flushSegmentContainer(e3, t3, n3, s4) : (flushSegmentContainer(e3, t3, n3, s4), r4 = e3.resumableState, e3 = e3.renderState, t3.push(e3.startInlineScript), 1 & r4.instructions ? t3.push('$RS("') : (r4.instructions |= 1, t3.push('$RS=function(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("')), t3.push(e3.segmentPrefix), o5 = o5.toString(16), t3.push(o5), t3.push('","'), t3.push(e3.placeholderPrefix), t3.push(o5), t3 = t3.push('")<\/script>'));
}
function flushCompletedQueues(e3, t3) {
  try {
    if (!(0 < e3.pendingRootTasks)) {
      var r4, n3 = e3.completedRootSegment;
      if (null !== n3) {
        if (5 === n3.status) return;
        var s4 = e3.completedPreambleSegments;
        if (null === s4) return;
        var o5, a5 = e3.renderState, i5 = a5.preamble, l4 = i5.htmlChunks, u4 = i5.headChunks;
        if (l4) {
          for (o5 = 0; o5 < l4.length; o5++) t3.push(l4[o5]);
          if (u4) for (o5 = 0; o5 < u4.length; o5++) t3.push(u4[o5]);
          else {
            var c4 = startChunkForTag("head");
            t3.push(c4), t3.push(">");
          }
        } else if (u4) for (o5 = 0; o5 < u4.length; o5++) t3.push(u4[o5]);
        var d4 = a5.charsetChunks;
        for (o5 = 0; o5 < d4.length; o5++) t3.push(d4[o5]);
        d4.length = 0, a5.preconnects.forEach(flushResource, t3), a5.preconnects.clear();
        var h4 = a5.viewportChunks;
        for (o5 = 0; o5 < h4.length; o5++) t3.push(h4[o5]);
        h4.length = 0, a5.fontPreloads.forEach(flushResource, t3), a5.fontPreloads.clear(), a5.highImagePreloads.forEach(flushResource, t3), a5.highImagePreloads.clear(), a5.styles.forEach(flushStylesInPreamble, t3);
        var p4 = a5.importMapChunks;
        for (o5 = 0; o5 < p4.length; o5++) t3.push(p4[o5]);
        p4.length = 0, a5.bootstrapScripts.forEach(flushResource, t3), a5.scripts.forEach(flushResource, t3), a5.scripts.clear(), a5.bulkPreloads.forEach(flushResource, t3), a5.bulkPreloads.clear();
        var f4 = a5.hoistableChunks;
        for (o5 = 0; o5 < f4.length; o5++) t3.push(f4[o5]);
        for (a5 = f4.length = 0; a5 < s4.length; a5++) {
          var m5 = s4[a5];
          for (i5 = 0; i5 < m5.length; i5++) flushSegment(e3, t3, m5[i5], null);
        }
        var g3 = e3.renderState.preamble, y3 = g3.headChunks;
        if (g3.htmlChunks || y3) {
          var v3 = endChunkForTag("head");
          t3.push(v3);
        }
        var b3 = g3.bodyChunks;
        if (b3) for (s4 = 0; s4 < b3.length; s4++) t3.push(b3[s4]);
        flushSegment(e3, t3, n3, null), e3.completedRootSegment = null, writeBootstrap(t3, e3.renderState);
      }
      var S4 = e3.renderState;
      n3 = 0;
      var k4 = S4.viewportChunks;
      for (n3 = 0; n3 < k4.length; n3++) t3.push(k4[n3]);
      k4.length = 0, S4.preconnects.forEach(flushResource, t3), S4.preconnects.clear(), S4.fontPreloads.forEach(flushResource, t3), S4.fontPreloads.clear(), S4.highImagePreloads.forEach(flushResource, t3), S4.highImagePreloads.clear(), S4.styles.forEach(preloadLateStyles, t3), S4.scripts.forEach(flushResource, t3), S4.scripts.clear(), S4.bulkPreloads.forEach(flushResource, t3), S4.bulkPreloads.clear();
      var w4 = S4.hoistableChunks;
      for (n3 = 0; n3 < w4.length; n3++) t3.push(w4[n3]);
      w4.length = 0;
      var C4 = e3.clientRenderedBoundaries;
      for (r4 = 0; r4 < C4.length; r4++) {
        var x3 = C4[r4];
        S4 = t3;
        var P4 = e3.resumableState, R4 = e3.renderState, T4 = x3.rootSegmentID, $3 = x3.errorDigest;
        S4.push(R4.startInlineScript), 4 & P4.instructions ? S4.push('$RX("') : (P4.instructions |= 4, S4.push('$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX("')), S4.push(R4.boundaryPrefix);
        var E4 = T4.toString(16);
        if (S4.push(E4), S4.push('"'), $3) {
          S4.push(",");
          var F4 = escapeJSStringsForInstructionScripts($3 || "");
          S4.push(F4);
        }
        var I4 = S4.push(")<\/script>");
        if (!I4) return e3.destination = null, r4++, void C4.splice(0, r4);
      }
      C4.splice(0, r4);
      var A4 = e3.completedBoundaries;
      for (r4 = 0; r4 < A4.length; r4++) if (!flushCompletedBoundary(e3, t3, A4[r4])) return e3.destination = null, r4++, void A4.splice(0, r4);
      A4.splice(0, r4);
      var _3 = e3.partialBoundaries;
      for (r4 = 0; r4 < _3.length; r4++) {
        var M3 = _3[r4];
        e: {
          C4 = e3, x3 = t3;
          var O4 = M3.completedSegments;
          for (I4 = 0; I4 < O4.length; I4++) if (!flushPartiallyCompletedSegment(C4, x3, M3, O4[I4])) {
            I4++, O4.splice(0, I4);
            var N4 = false;
            break e;
          }
          O4.splice(0, I4), N4 = writeHoistablesForBoundary(x3, M3.contentState, C4.renderState);
        }
        if (!N4) return e3.destination = null, r4++, void _3.splice(0, r4);
      }
      _3.splice(0, r4);
      var j3 = e3.completedBoundaries;
      for (r4 = 0; r4 < j3.length; r4++) if (!flushCompletedBoundary(e3, t3, j3[r4])) return e3.destination = null, r4++, void j3.splice(0, r4);
      j3.splice(0, r4);
    }
  } finally {
    0 === e3.allPendingTasks && 0 === e3.pingedTasks.length && 0 === e3.clientRenderedBoundaries.length && 0 === e3.completedBoundaries.length && (e3.flushScheduled = false, (r4 = e3.resumableState).hasBody && (_3 = endChunkForTag("body"), t3.push(_3)), r4.hasHtml && (r4 = endChunkForTag("html"), t3.push(r4)), e3.status = 14, t3.push(null), e3.destination = null);
  }
}
function enqueueFlush(e3) {
  if (false === e3.flushScheduled && 0 === e3.pingedTasks.length && null !== e3.destination) {
    e3.flushScheduled = true;
    var t3 = e3.destination;
    t3 ? flushCompletedQueues(e3, t3) : e3.flushScheduled = false;
  }
}
function startFlowing(e3, t3) {
  if (13 === e3.status) e3.status = 14, t3.destroy(e3.fatalError);
  else if (14 !== e3.status && null === e3.destination) {
    e3.destination = t3;
    try {
      flushCompletedQueues(e3, t3);
    } catch (t4) {
      logRecoverableError(e3, t4, {}), fatalError(e3, t4);
    }
  }
}
function abort2(e3, t3) {
  11 !== e3.status && 10 !== e3.status || (e3.status = 12);
  try {
    var r4 = e3.abortableTasks;
    if (0 < r4.size) {
      var n3 = void 0 === t3 ? Error(formatProdErrorMessage(432)) : "object" == typeof t3 && null !== t3 && "function" == typeof t3.then ? Error(formatProdErrorMessage(530)) : t3;
      e3.fatalError = n3, r4.forEach(function(t4) {
        return abortTask(t4, e3, n3);
      }), r4.clear();
    }
    null !== e3.destination && flushCompletedQueues(e3, e3.destination);
  } catch (t4) {
    logRecoverableError(e3, t4, {}), fatalError(e3, t4);
  }
}
function onError() {
}
function renderToStringImpl(e3, t3, r4, n3) {
  var s4, o5, a5, i5, l4 = false, u4 = null, c4 = "", d4 = false;
  if (e3 = function(e4, t4, r5, n4, s5, o6, a6, i6, l5, u5, c5, d5) {
    return (r5 = createPendingSegment(t4 = new RequestInstance(t4, r5, n4, s5, o6, a6, i6, l5, u5, c5, d5), 0, null, n4, false, false)).parentFlushed = true, pushComponentStack(e4 = createRenderTask(t4, null, e4, -1, null, r5, null, null, t4.abortableTasks, null, n4, null, Jo, null, false)), t4.pingedTasks.push(e4), t4;
  }(e3, t3 = { idPrefix: void 0 === (s4 = t3 ? t3.identifierPrefix : void 0) ? "" : s4, nextFormID: 0, streamingFormat: 0, bootstrapScriptContent: o5, bootstrapScripts: a5, bootstrapModules: i5, instructions: 0, hasBody: false, hasHtml: false, unknownResources: {}, dnsResources: {}, connectResources: { default: {}, anonymous: {}, credentials: {} }, imageResources: {}, styleResources: {}, scriptResources: {}, moduleUnknownResources: {}, moduleScriptResources: {} }, function(e4, t4) {
    var r5 = e4.idPrefix, n4 = [], s5 = e4.bootstrapScriptContent, o6 = e4.bootstrapScripts, a6 = e4.bootstrapModules;
    void 0 !== s5 && n4.push("<script>", ("" + s5).replace(Io, scriptReplacer), "<\/script>"), s5 = r5 + "P:";
    var i6 = r5 + "S:";
    r5 += "B:";
    var l5 = { htmlChunks: null, headChunks: null, bodyChunks: null, contribution: 0 }, u5 = /* @__PURE__ */ new Set(), c5 = /* @__PURE__ */ new Set(), d5 = /* @__PURE__ */ new Set(), h4 = /* @__PURE__ */ new Map(), p4 = /* @__PURE__ */ new Set(), f4 = /* @__PURE__ */ new Set(), m5 = /* @__PURE__ */ new Set(), g3 = { images: /* @__PURE__ */ new Map(), stylesheets: /* @__PURE__ */ new Map(), scripts: /* @__PURE__ */ new Map(), moduleScripts: /* @__PURE__ */ new Map() };
    if (void 0 !== o6) for (var y3 = 0; y3 < o6.length; y3++) {
      var v3, b3 = o6[y3], S4 = void 0, k4 = void 0, w4 = { rel: "preload", as: "script", fetchPriority: "low", nonce: void 0 };
      "string" == typeof b3 ? w4.href = v3 = b3 : (w4.href = v3 = b3.src, w4.integrity = k4 = "string" == typeof b3.integrity ? b3.integrity : void 0, w4.crossOrigin = S4 = "string" == typeof b3 || null == b3.crossOrigin ? void 0 : "use-credentials" === b3.crossOrigin ? "use-credentials" : "");
      var C4 = v3;
      (b3 = e4).scriptResources[C4] = null, b3.moduleScriptResources[C4] = null, pushLinkImpl(b3 = [], w4), p4.add(b3), n4.push('<script src="', escapeTextForBrowser(v3)), "string" == typeof k4 && n4.push('" integrity="', escapeTextForBrowser(k4)), "string" == typeof S4 && n4.push('" crossorigin="', escapeTextForBrowser(S4)), n4.push('" async=""><\/script>');
    }
    if (void 0 !== a6) for (o6 = 0; o6 < a6.length; o6++) S4 = v3 = void 0, k4 = { rel: "modulepreload", fetchPriority: "low", nonce: void 0 }, "string" == typeof (w4 = a6[o6]) ? k4.href = y3 = w4 : (k4.href = y3 = w4.src, k4.integrity = S4 = "string" == typeof w4.integrity ? w4.integrity : void 0, k4.crossOrigin = v3 = "string" == typeof w4 || null == w4.crossOrigin ? void 0 : "use-credentials" === w4.crossOrigin ? "use-credentials" : ""), b3 = y3, (w4 = e4).scriptResources[b3] = null, w4.moduleScriptResources[b3] = null, pushLinkImpl(w4 = [], k4), p4.add(w4), n4.push('<script type="module" src="', escapeTextForBrowser(y3)), "string" == typeof S4 && n4.push('" integrity="', escapeTextForBrowser(S4)), "string" == typeof v3 && n4.push('" crossorigin="', escapeTextForBrowser(v3)), n4.push('" async=""><\/script>');
    return { placeholderPrefix: s5, segmentPrefix: i6, boundaryPrefix: r5, startInlineScript: "<script>", preamble: l5, externalRuntimeScript: null, bootstrapChunks: n4, importMapChunks: [], onHeaders: void 0, headers: null, resets: { font: {}, dns: {}, connect: { default: {}, anonymous: {}, credentials: {} }, image: {}, style: {} }, charsetChunks: [], viewportChunks: [], hoistableChunks: [], preconnects: u5, fontPreloads: c5, highImagePreloads: d5, styles: h4, bootstrapScripts: p4, scripts: f4, bulkPreloads: m5, preloads: g3, stylesToHoist: false, generateStaticMarkup: t4 };
  }(t3, r4), createFormatContext(0, null, 0), 1 / 0, onError, void 0, function() {
    d4 = true;
  }, void 0, void 0, void 0), e3.flushScheduled = null !== e3.destination, performWork(e3), 10 === e3.status && (e3.status = 11), null === e3.trackedPostpones && safelyEmitEarlyPreloads(e3, 0 === e3.pendingRootTasks), abort2(e3, n3), startFlowing(e3, { push: /* @__PURE__ */ __name(function(e4) {
    return null !== e4 && (c4 += e4), true;
  }, "push"), destroy: /* @__PURE__ */ __name(function(e4) {
    l4 = true, u4 = e4;
  }, "destroy") }), l4 && u4 !== n3) throw u4;
  if (!d4) throw Error(formatProdErrorMessage(426));
  return c4;
}
function isbot(e3) {
  return Boolean(e3) && function() {
    if (Ta instanceof RegExp) return Ta;
    try {
      Ta = new RegExp(" daum[ /]| deusu/| yadirectfetcher|(?:^|[^g])news(?!sapphire)|(?<! (?:channel/|google/))google(?!(app|/google| pixel))|(?<! cu)bots?(?:\\b|_)|(?<!(?:lib))http|(?<![hg]m)score|(?<!cam)scan|@[a-z][\\w-]+\\.|\\(\\)|\\.com\\b|\\btime/|\\||^<|^[\\w \\.\\-\\(?:\\):%]+(?:/v?\\d+(?:\\.\\d+)?(?:\\.\\d{1,10})*?)?(?:,|$)|^[^ ]{50,}$|^\\d+\\b|^\\w*search\\b|^\\w+/[\\w\\(\\)]*$|^active|^ad muncher|^amaya|^avsdevicesdk/|^biglotron|^bot|^bw/|^clamav[ /]|^client/|^cobweb/|^custom|^ddg[_-]android|^discourse|^dispatch/\\d|^downcast/|^duckduckgo|^email|^facebook|^getright/|^gozilla/|^hobbit|^hotzonu|^hwcdn/|^igetter/|^jeode/|^jetty/|^jigsaw|^microsoft bits|^movabletype|^mozilla/\\d\\.\\d\\s[\\w\\.-]+$|^mozilla/\\d\\.\\d\\s\\(compatible;?(?:\\s\\w+\\/\\d+\\.\\d+)?\\)$|^navermailapp|^netsurf|^offline|^openai/|^owler|^php|^postman|^python|^rank|^read|^reed|^rest|^rss|^snapchat|^space bison|^svn|^swcd |^taringa|^thumbor/|^track|^w3c|^webbandit/|^webcopier|^wget|^whatsapp|^wordpress|^xenu link sleuth|^yahoo|^yandex|^zdm/\\d|^zoom marketplace/|^{{.*}}$|analyzer|archive|ask jeeves/teoma|audit|bit\\.ly/|bluecoat drtr|browsex|burpcollaborator|capture|catch|check\\b|checker|chrome-lighthouse|chromeframe|classifier|cloudflare|convertify|crawl|cypress/|dareboost|datanyze|dejaclick|detect|dmbrowser|download|evc-batch/|exaleadcloudview|feed|firephp|functionize|gomezagent|grab|headless|httrack|hubspot marketing grader|hydra|ibisbrowser|infrawatch|insight|inspect|iplabel|ips-agent|java(?!;)|library|linkcheck|mail\\.ru/|manager|measure|neustar wpm|node|nutch|offbyone|onetrust|optimize|pageburst|pagespeed|parser|perl|phantomjs|pingdom|powermarks|preview|proxy|ptst[ /]\\d|retriever|rexx;|rigor|rss\\b|scrape|server|sogou|sparkler/|speedcurve|spider|splash|statuscake|supercleaner|synapse|synthetic|tools|torrent|transcoder|url|validator|virtuoso|wappalyzer|webglance|webkit2png|whatcms/|xtate/", "i");
    } catch (e4) {
      Ta = $a;
    }
    return Ta;
  }().test(e3);
}
function StartServer(e3) {
  return X2.jsx(RouterProvider, { router: e3.router });
}
function assignKeyAndIndex(e3, t3) {
  t3 || (t3 = {});
  const r4 = createRandomKey();
  return { ...t3, key: r4, __TSR_key: r4, [Ea]: e3 };
}
function createMemoryHistory(e3 = { initialEntries: ["/"] }) {
  const t3 = e3.initialEntries;
  let r4 = e3.initialIndex ? Math.min(Math.max(e3.initialIndex, 0), t3.length - 1) : t3.length - 1;
  const n3 = t3.map((e4, t4) => assignKeyAndIndex(t4, void 0));
  return function(e4) {
    let t4 = e4.getLocation();
    const r5 = /* @__PURE__ */ new Set(), notify = /* @__PURE__ */ __name((n4) => {
      t4 = e4.getLocation(), r5.forEach((e5) => e5({ location: t4, action: n4 }));
    }, "notify"), handleIndexChange = /* @__PURE__ */ __name((r6) => {
      e4.notifyOnIndexChange ?? 1 ? notify(r6) : t4 = e4.getLocation();
    }, "handleIndexChange"), tryNavigation = /* @__PURE__ */ __name(async ({ task: r6, navigateOpts: n4, ...s4 }) => {
      var o5, a5;
      if (null == n4 ? void 0 : n4.ignoreBlocker) return void r6();
      const i5 = (null == (o5 = e4.getBlockers) ? void 0 : o5.call(e4)) ?? [], l4 = "PUSH" === s4.type || "REPLACE" === s4.type;
      if ("undefined" != typeof document && i5.length && l4) for (const r7 of i5) {
        const n5 = parseHref(s4.path, s4.state);
        if (await r7.blockerFn({ currentLocation: t4, nextLocation: n5, action: s4.type })) return void (null == (a5 = e4.onBlocked) || a5.call(e4));
      }
      r6();
    }, "tryNavigation");
    return { get location() {
      return t4;
    }, get length() {
      return e4.getLength();
    }, subscribers: r5, subscribe: /* @__PURE__ */ __name((e5) => (r5.add(e5), () => {
      r5.delete(e5);
    }), "subscribe"), push: /* @__PURE__ */ __name((r6, n4, s4) => {
      const o5 = t4.state[Ea];
      n4 = assignKeyAndIndex(o5 + 1, n4), tryNavigation({ task: /* @__PURE__ */ __name(() => {
        e4.pushState(r6, n4), notify({ type: "PUSH" });
      }, "task"), navigateOpts: s4, type: "PUSH", path: r6, state: n4 });
    }, "push"), replace: /* @__PURE__ */ __name((r6, n4, s4) => {
      const o5 = t4.state[Ea];
      n4 = assignKeyAndIndex(o5, n4), tryNavigation({ task: /* @__PURE__ */ __name(() => {
        e4.replaceState(r6, n4), notify({ type: "REPLACE" });
      }, "task"), navigateOpts: s4, type: "REPLACE", path: r6, state: n4 });
    }, "replace"), go: /* @__PURE__ */ __name((t5, r6) => {
      tryNavigation({ task: /* @__PURE__ */ __name(() => {
        e4.go(t5), handleIndexChange({ type: "GO", index: t5 });
      }, "task"), navigateOpts: r6, type: "GO" });
    }, "go"), back: /* @__PURE__ */ __name((t5) => {
      tryNavigation({ task: /* @__PURE__ */ __name(() => {
        e4.back((null == t5 ? void 0 : t5.ignoreBlocker) ?? false), handleIndexChange({ type: "BACK" });
      }, "task"), navigateOpts: t5, type: "BACK" });
    }, "back"), forward: /* @__PURE__ */ __name((t5) => {
      tryNavigation({ task: /* @__PURE__ */ __name(() => {
        e4.forward((null == t5 ? void 0 : t5.ignoreBlocker) ?? false), handleIndexChange({ type: "FORWARD" });
      }, "task"), navigateOpts: t5, type: "FORWARD" });
    }, "forward"), canGoBack: /* @__PURE__ */ __name(() => 0 !== t4.state[Ea], "canGoBack"), createHref: /* @__PURE__ */ __name((t5) => e4.createHref(t5), "createHref"), block: /* @__PURE__ */ __name((t5) => {
      var r6;
      if (!e4.setBlockers) return () => {
      };
      const n4 = (null == (r6 = e4.getBlockers) ? void 0 : r6.call(e4)) ?? [];
      return e4.setBlockers([...n4, t5]), () => {
        var r7, n5;
        const s4 = (null == (r7 = e4.getBlockers) ? void 0 : r7.call(e4)) ?? [];
        null == (n5 = e4.setBlockers) || n5.call(e4, s4.filter((e5) => e5 !== t5));
      };
    }, "block"), flush: /* @__PURE__ */ __name(() => {
      var t5;
      return null == (t5 = e4.flush) ? void 0 : t5.call(e4);
    }, "flush"), destroy: /* @__PURE__ */ __name(() => {
      var t5;
      return null == (t5 = e4.destroy) ? void 0 : t5.call(e4);
    }, "destroy"), notify };
  }({ getLocation: /* @__PURE__ */ __name(() => parseHref(t3[r4], n3[r4]), "getLocation"), getLength: /* @__PURE__ */ __name(() => t3.length, "getLength"), pushState: /* @__PURE__ */ __name((e4, s4) => {
    r4 < t3.length - 1 && (t3.splice(r4 + 1), n3.splice(r4 + 1)), n3.push(s4), t3.push(e4), r4 = Math.max(t3.length - 1, 0);
  }, "pushState"), replaceState: /* @__PURE__ */ __name((e4, s4) => {
    n3[r4] = s4, t3[r4] = e4;
  }, "replaceState"), back: /* @__PURE__ */ __name(() => {
    r4 = Math.max(r4 - 1, 0);
  }, "back"), forward: /* @__PURE__ */ __name(() => {
    r4 = Math.min(r4 + 1, t3.length - 1);
  }, "forward"), go: /* @__PURE__ */ __name((e4) => {
    r4 = Math.min(Math.max(r4 + e4, 0), t3.length - 1);
  }, "go"), createHref: /* @__PURE__ */ __name((e4) => e4, "createHref") });
}
function parseHref(e3, t3) {
  const r4 = e3.indexOf("#"), n3 = e3.indexOf("?"), s4 = createRandomKey();
  return { href: e3, pathname: e3.substring(0, r4 > 0 ? n3 > 0 ? Math.min(r4, n3) : r4 : n3 > 0 ? n3 : e3.length), hash: r4 > -1 ? e3.substring(r4) : "", search: n3 > -1 ? e3.slice(n3, -1 === r4 ? void 0 : r4) : "", state: t3 || { [Ea]: 0, key: s4, __TSR_key: s4 } };
}
function createRandomKey() {
  return (Math.random() + 1).toString(36).substring(7);
}
function parse(e3, t3) {
  if ("string" != typeof e3) throw new TypeError("argument str must be a string");
  const r4 = {}, n3 = {}, s4 = n3.decode || decode;
  let o5 = 0;
  for (; o5 < e3.length; ) {
    const t4 = e3.indexOf("=", o5);
    if (-1 === t4) break;
    let a5 = e3.indexOf(";", o5);
    if (-1 === a5) a5 = e3.length;
    else if (a5 < t4) {
      o5 = e3.lastIndexOf(";", t4 - 1) + 1;
      continue;
    }
    const i5 = e3.slice(o5, t4).trim();
    if (!n3?.filter || n3?.filter(i5)) {
      if (void 0 === r4[i5]) {
        let n4 = e3.slice(t4 + 1, a5).trim();
        34 === n4.codePointAt(0) && (n4 = n4.slice(1, -1)), r4[i5] = tryDecode(n4, s4);
      }
      o5 = a5 + 1;
    } else o5 = a5 + 1;
  }
  return r4;
}
function decode(e3) {
  return e3.includes("%") ? decodeURIComponent(e3) : e3;
}
function tryDecode(e3, t3) {
  try {
    return t3(e3);
  } catch {
    return e3;
  }
}
function serialize(e3, t3, r4) {
  const n3 = r4 || {}, s4 = n3.encode || encodeURIComponent;
  if ("function" != typeof s4) throw new TypeError("option encode is invalid");
  if (!Fa.test(e3)) throw new TypeError("argument name is invalid");
  const o5 = s4(t3);
  if (o5 && !Fa.test(o5)) throw new TypeError("argument val is invalid");
  let a5 = e3 + "=" + o5;
  if (void 0 !== n3.maxAge && null !== n3.maxAge) {
    const e4 = n3.maxAge - 0;
    if (Number.isNaN(e4) || !Number.isFinite(e4)) throw new TypeError("option maxAge is invalid");
    a5 += "; Max-Age=" + Math.floor(e4);
  }
  if (n3.domain) {
    if (!Fa.test(n3.domain)) throw new TypeError("option domain is invalid");
    a5 += "; Domain=" + n3.domain;
  }
  if (n3.path) {
    if (!Fa.test(n3.path)) throw new TypeError("option path is invalid");
    a5 += "; Path=" + n3.path;
  }
  if (n3.expires) {
    if (i5 = n3.expires, !("[object Date]" === Object.prototype.toString.call(i5) || i5 instanceof Date) || Number.isNaN(n3.expires.valueOf())) throw new TypeError("option expires is invalid");
    a5 += "; Expires=" + n3.expires.toUTCString();
  }
  var i5;
  if (n3.httpOnly && (a5 += "; HttpOnly"), n3.secure && (a5 += "; Secure"), n3.priority) {
    switch ("string" == typeof n3.priority ? n3.priority.toLowerCase() : n3.priority) {
      case "low":
        a5 += "; Priority=Low";
        break;
      case "medium":
        a5 += "; Priority=Medium";
        break;
      case "high":
        a5 += "; Priority=High";
        break;
      default:
        throw new TypeError("option priority is invalid");
    }
  }
  if (n3.sameSite) {
    switch ("string" == typeof n3.sameSite ? n3.sameSite.toLowerCase() : n3.sameSite) {
      case true:
        a5 += "; SameSite=Strict";
        break;
      case "lax":
        a5 += "; SameSite=Lax";
        break;
      case "strict":
        a5 += "; SameSite=Strict";
        break;
      case "none":
        a5 += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return n3.partitioned && (a5 += "; Partitioned"), a5;
}
function splitSetCookieString(e3) {
  if (Array.isArray(e3)) return e3.flatMap((e4) => splitSetCookieString(e4));
  if ("string" != typeof e3) return [];
  const t3 = [];
  let r4, n3, s4, o5, a5, i5 = 0;
  const skipWhitespace = /* @__PURE__ */ __name(() => {
    for (; i5 < e3.length && /\s/.test(e3.charAt(i5)); ) i5 += 1;
    return i5 < e3.length;
  }, "skipWhitespace"), notSpecialChar = /* @__PURE__ */ __name(() => (n3 = e3.charAt(i5), "=" !== n3 && ";" !== n3 && "," !== n3), "notSpecialChar");
  for (; i5 < e3.length; ) {
    for (r4 = i5, a5 = false; skipWhitespace(); ) if (n3 = e3.charAt(i5), "," === n3) {
      for (s4 = i5, i5 += 1, skipWhitespace(), o5 = i5; i5 < e3.length && notSpecialChar(); ) i5 += 1;
      i5 < e3.length && "=" === e3.charAt(i5) ? (a5 = true, i5 = o5, t3.push(e3.slice(r4, s4)), r4 = i5) : i5 = s4 + 1;
    } else i5 += 1;
    (!a5 || i5 >= e3.length) && t3.push(e3.slice(r4, e3.length));
  }
  return t3;
}
function mergeHeaders(...e3) {
  return e3.reduce((e4, t3) => {
    const r4 = (n3 = t3) instanceof Headers || Array.isArray(n3) || "object" == typeof n3 ? new Headers(n3) : new Headers();
    var n3;
    for (const [t4, n4] of r4.entries()) if ("set-cookie" === t4) {
      splitSetCookieString(n4).forEach((t5) => e4.append("set-cookie", t5));
    } else e4.set(t4, n4);
    return e4;
  }, new Headers());
}
function json(e3, t3) {
  return new Response(JSON.stringify(e3), { ...t3, headers: mergeHeaders({ "content-type": "application/json" }, null == t3 ? void 0 : t3.headers) });
}
function invariant(e3, t3) {
  if (!e3) throw new Error("Invariant failed");
}
function isPlainObject(e3) {
  if (!hasObjectPrototype(e3)) return false;
  const t3 = e3.constructor;
  if (void 0 === t3) return true;
  const r4 = t3.prototype;
  return !!hasObjectPrototype(r4) && !!r4.hasOwnProperty("isPrototypeOf");
}
function hasObjectPrototype(e3) {
  return "[object Object]" === Object.prototype.toString.call(e3);
}
function joinPaths(e3) {
  return cleanPath(e3.filter((e4) => void 0 !== e4).join("/"));
}
function cleanPath(e3) {
  return e3.replace(/\/{2,}/g, "/");
}
function trimPathLeft(e3) {
  return "/" === e3 ? e3 : e3.replace(/^\/{1,}/, "");
}
function trimPathRight(e3) {
  return "/" === e3 ? e3 : e3.replace(/\/{1,}$/, "");
}
function parsePathname(e3) {
  if (!e3) return [];
  const t3 = [];
  if ("/" === (e3 = cleanPath(e3)).slice(0, 1) && (e3 = e3.substring(1), t3.push({ type: "pathname", value: "/" })), !e3) return t3;
  const r4 = e3.split("/").filter(Boolean);
  return t3.push(...r4.map((e4) => {
    const t4 = e4.match(Ma);
    if (t4) {
      return { type: "wildcard", value: "$", prefixSegment: t4[1] || void 0, suffixSegment: t4[2] || void 0 };
    }
    const r5 = e4.match(Aa);
    if (r5) {
      const e5 = r5[1];
      return { type: "param", value: "" + r5[2], prefixSegment: e5 || void 0, suffixSegment: r5[3] || void 0 };
    }
    if (Ia.test(e4)) {
      return { type: "param", value: "$" + e4.substring(1), prefixSegment: void 0, suffixSegment: void 0 };
    }
    return _a.test(e4) ? { type: "wildcard", value: "$", prefixSegment: void 0, suffixSegment: void 0 } : { type: "pathname", value: e4.includes("%25") ? e4.split("%25").map((e5) => decodeURI(e5)).join("%25") : decodeURI(e4) };
  })), "/" === e3.slice(-1) && (e3 = e3.substring(1), t3.push({ type: "pathname", value: "/" })), t3;
}
function matchPathname(e3, t3, r4) {
  const n3 = function(e4, t4, r5) {
    if ("/" !== e4 && !t4.startsWith(e4)) return;
    t4 = removeBasepath(e4, t4, r5.caseSensitive);
    const n4 = removeBasepath(e4, `${r5.to ?? "$"}`, r5.caseSensitive), s4 = parsePathname(t4), o5 = parsePathname(n4);
    t4.startsWith("/") || s4.unshift({ type: "pathname", value: "/" });
    n4.startsWith("/") || o5.unshift({ type: "pathname", value: "/" });
    const a5 = {}, i5 = (() => {
      var e5;
      for (let t5 = 0; t5 < Math.max(s4.length, o5.length); t5++) {
        const n5 = s4[t5], i6 = o5[t5], l4 = t5 >= s4.length - 1, u4 = t5 >= o5.length - 1;
        if (i6) {
          if ("wildcard" === i6.type) {
            const r6 = s4.slice(t5);
            let o6;
            if (i6.prefixSegment || i6.suffixSegment) {
              if (!n5) return false;
              const t6 = i6.prefixSegment || "", a6 = i6.suffixSegment || "", l5 = n5.value;
              if ("prefixSegment" in i6 && !l5.startsWith(t6)) return false;
              if ("suffixSegment" in i6 && !(null == (e5 = s4[s4.length - 1]) ? void 0 : e5.value.endsWith(a6))) return false;
              let u5 = decodeURI(joinPaths(r6.map((e6) => e6.value)));
              t6 && u5.startsWith(t6) && (u5 = u5.slice(t6.length)), a6 && u5.endsWith(a6) && (u5 = u5.slice(0, u5.length - a6.length)), o6 = u5;
            } else o6 = decodeURI(joinPaths(r6.map((e6) => e6.value)));
            return a5["*"] = o6, a5._splat = o6, true;
          }
          if ("pathname" === i6.type) {
            if ("/" === i6.value && !(null == n5 ? void 0 : n5.value)) return true;
            if (n5) {
              if (r5.caseSensitive) {
                if (i6.value !== n5.value) return false;
              } else if (i6.value.toLowerCase() !== n5.value.toLowerCase()) return false;
            }
          }
          if (!n5) return false;
          if ("param" === i6.type) {
            if ("/" === n5.value) return false;
            let e6;
            if (i6.prefixSegment || i6.suffixSegment) {
              const t6 = i6.prefixSegment || "", r6 = i6.suffixSegment || "", s5 = n5.value;
              if (t6 && !s5.startsWith(t6)) return false;
              if (r6 && !s5.endsWith(r6)) return false;
              let o6 = s5;
              t6 && o6.startsWith(t6) && (o6 = o6.slice(t6.length)), r6 && o6.endsWith(r6) && (o6 = o6.slice(0, o6.length - r6.length)), e6 = decodeURIComponent(o6);
            } else e6 = decodeURIComponent(n5.value);
            a5[i6.value.substring(1)] = e6;
          }
        }
        if (!l4 && u4) return a5["**"] = joinPaths(s4.slice(t5 + 1).map((e6) => e6.value)), "/" !== (null == i6 ? void 0 : i6.value);
      }
      return true;
    })();
    return i5 ? a5 : void 0;
  }(e3, t3, r4);
  if (!r4.to || n3) return n3 ?? {};
}
function removeBasepath(e3, t3, r4 = false) {
  const n3 = r4 ? e3 : e3.toLowerCase(), s4 = r4 ? t3 : t3.toLowerCase();
  switch (true) {
    case "/" === n3:
      return t3;
    case s4 === n3:
      return "";
    case t3.length < e3.length:
    case "/" !== s4[n3.length]:
      return t3;
    case s4.startsWith(n3):
      return t3.slice(e3.length);
    default:
      return t3;
  }
}
function isNotFound(e3) {
  return !!(null == e3 ? void 0 : e3.isNotFound);
}
function isRedirect(e3) {
  return e3 instanceof Response && !!e3.options;
}
function createServerFn(e3, t3) {
  const r4 = t3 || e3 || {};
  return void 0 === r4.method && (r4.method = "GET"), { options: r4, middleware: /* @__PURE__ */ __name((e4) => createServerFn(void 0, Object.assign(r4, { middleware: e4 })), "middleware"), validator: /* @__PURE__ */ __name((e4) => createServerFn(void 0, Object.assign(r4, { validator: e4 })), "validator"), type: /* @__PURE__ */ __name((e4) => createServerFn(void 0, Object.assign(r4, { type: e4 })), "type"), handler: /* @__PURE__ */ __name((...e4) => {
    const [t4, n3] = e4;
    Object.assign(r4, { ...t4, extractedFn: t4, serverFn: n3 });
    const s4 = [...r4.middleware || [], serverFnBaseToMiddleware(r4)];
    return Object.assign(async (e5) => executeMiddleware$1(s4, "client", { ...t4, ...r4, data: null == e5 ? void 0 : e5.data, headers: null == e5 ? void 0 : e5.headers, signal: null == e5 ? void 0 : e5.signal, context: {} }).then((e6) => {
      if ("full" === r4.response) return e6;
      if (e6.error) throw e6.error;
      return e6.result;
    }), { ...t4, __executeServer: /* @__PURE__ */ __name(async (e5, n4) => {
      const o5 = e5 instanceof FormData ? function(e6) {
        const t5 = e6.get("__TSR_CONTEXT");
        if (e6.delete("__TSR_CONTEXT"), "string" != typeof t5) return { context: {}, data: e6 };
        try {
          return { context: Na.parse(t5), data: e6 };
        } catch {
          return { data: e6 };
        }
      }(e5) : e5;
      o5.type = "function" == typeof r4.type ? r4.type(o5) : r4.type;
      const a5 = { ...t4, ...o5, signal: n4 }, run = /* @__PURE__ */ __name(() => executeMiddleware$1(s4, "server", a5).then((e6) => ({ result: e6.result, error: e6.error, context: e6.sendContext })), "run");
      if ("static" === a5.type) {
        let e6;
        if ((null == Da ? void 0 : Da.getItem) && (e6 = await Da.getItem(a5)), e6 || (e6 = await run().then((e7) => ({ ctx: e7, error: null })).catch((e7) => ({ ctx: void 0, error: e7 })), (null == Da ? void 0 : Da.setItem) && await Da.setItem(a5, e6)), invariant(e6), e6.error) throw e6.error;
        return e6.ctx;
      }
      return run();
    }, "__executeServer") });
  }, "handler") };
}
async function executeMiddleware$1(e3, t3, r4) {
  const n3 = flattenMiddlewares([...La, ...e3]), next = /* @__PURE__ */ __name(async (e4) => {
    const r5 = n3.shift();
    if (!r5) return e4;
    r5.options.validator && ("client" !== t3 || r5.options.validateClient) && (e4.data = await function(e5, t4) {
      if (null == e5) return {};
      if ("~standard" in e5) {
        const r6 = e5["~standard"].validate(t4);
        if (r6 instanceof Promise) throw new Error("Async validation not supported");
        if (r6.issues) throw new Error(JSON.stringify(r6.issues, void 0, 2));
        return r6.value;
      }
      if ("parse" in e5) return e5.parse(t4);
      if ("function" == typeof e5) return e5(t4);
      throw new Error("Invalid validator type!");
    }(r5.options.validator, e4.data));
    const s4 = "client" === t3 ? r5.options.client : r5.options.server;
    return s4 ? applyMiddleware(s4, e4, async (e5) => next(e5).catch((t4) => {
      if (isRedirect(t4) || isNotFound(t4)) return { ...e5, error: t4 };
      throw t4;
    })) : next(e4);
  }, "next");
  return next({ ...r4, headers: r4.headers || {}, sendContext: r4.sendContext || {}, context: r4.context || {} });
}
function flattenMiddlewares(e3) {
  const t3 = /* @__PURE__ */ new Set(), r4 = [], recurse = /* @__PURE__ */ __name((e4) => {
    e4.forEach((e5) => {
      e5.options.middleware && recurse(e5.options.middleware), t3.has(e5) || (t3.add(e5), r4.push(e5));
    });
  }, "recurse");
  return recurse(e3), r4;
}
function serverFnBaseToMiddleware(e3) {
  return { _types: void 0, options: { validator: e3.validator, validateClient: e3.validateClient, client: /* @__PURE__ */ __name(async ({ next: t3, sendContext: r4, ...n3 }) => {
    var s4;
    const o5 = { ...n3, context: r4, type: "function" == typeof n3.type ? n3.type(n3) : n3.type };
    if ("static" === n3.type && "undefined" != typeof document) {
      invariant(Da);
      const e4 = await Da.fetchItem(o5);
      if (e4) {
        if (e4.error) throw e4.error;
        return t3(e4.ctx);
      }
      o5.functionId, JSON.stringify(o5.data);
    }
    return t3(await (null == (s4 = e3.extractedFn) ? void 0 : s4.call(e3, o5)));
  }, "client"), server: /* @__PURE__ */ __name(async ({ next: t3, ...r4 }) => {
    var n3;
    const s4 = await (null == (n3 = e3.serverFn) ? void 0 : n3.call(e3, r4));
    return t3({ ...r4, result: s4 });
  }, "server") } };
}
function serializeChar(e3) {
  switch (e3) {
    case '"':
      return '\\"';
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "\b":
      return "\\b";
    case "	":
      return "\\t";
    case "\f":
      return "\\f";
    case "<":
      return "\\x3C";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return;
  }
}
function serializeString(e3) {
  let t3, r4 = "", n3 = 0;
  for (let s4 = 0, o5 = e3.length; s4 < o5; s4++) t3 = serializeChar(e3[s4]), t3 && (r4 += e3.slice(n3, s4) + t3, n3 = s4 + 1);
  return 0 === n3 ? r4 = e3 : r4 += e3.slice(n3), r4;
}
function assert3(e3, t3) {
  if (!e3) throw t3;
}
function hasReferenceID(e3) {
  return qa.has(e3);
}
function createPlugin(e3) {
  return e3;
}
function dedupePlugins(e3, t3) {
  for (let r4 = 0, n3 = t3.length; r4 < n3; r4++) {
    const n4 = t3[r4];
    e3.has(n4) || (e3.add(n4), n4.extends && dedupePlugins(e3, n4.extends));
  }
}
function resolvePlugins(e3) {
  if (e3) {
    const t3 = /* @__PURE__ */ new Set();
    return dedupePlugins(t3, e3), [...t3];
  }
}
function createSerovalNode(e3, t3, r4, n3, s4, o5, a5, i5, l4, u4, c4, d4) {
  return { t: e3, i: t3, s: r4, l: n3, c: s4, m: o5, p: a5, e: i5, a: l4, f: u4, b: c4, o: d4 };
}
function createConstantNode(e3) {
  return createSerovalNode(2, Ga, e3, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga);
}
function getErrorConstructor(e3) {
  return e3 instanceof EvalError ? 1 : e3 instanceof RangeError ? 2 : e3 instanceof ReferenceError ? 3 : e3 instanceof SyntaxError ? 4 : e3 instanceof TypeError ? 5 : e3 instanceof URIError ? 6 : 0;
}
function getErrorOptions(e3, t3) {
  let r4 = function(e4) {
    const t4 = Qa[getErrorConstructor(e4)];
    return e4.name !== t4 ? { name: e4.name } : e4.constructor.name !== t4 ? { name: e4.constructor.name } : {};
  }(e3);
  const n3 = Object.getOwnPropertyNames(e3);
  for (let s4, o5 = 0, a5 = n3.length; o5 < a5; o5++) s4 = n3[o5], "name" !== s4 && "message" !== s4 && ("stack" === s4 ? 4 & t3 && (r4 = r4 || {}, r4[s4] = e3[s4]) : (r4 = r4 || {}, r4[s4] = e3[s4]));
  return r4;
}
function getObjectFlag(e3) {
  return Object.isFrozen(e3) ? 3 : Object.isSealed(e3) ? 2 : Object.isExtensible(e3) ? 0 : 1;
}
function createStringNode(e3) {
  return createSerovalNode(1, Ga, serializeString(e3), Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga);
}
function createReferenceNode(e3, t3) {
  return createSerovalNode(18, e3, serializeString((assert3(hasReferenceID(r4 = t3), new di(r4)), qa.get(r4))), Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga);
  var r4;
}
function createPluginNode(e3, t3, r4) {
  return createSerovalNode(25, e3, r4, Ga, serializeString(t3), Ga, Ga, Ga, Ga, Ga, Ga, Ga);
}
function createIteratorFactoryInstanceNode(e3, t3) {
  return createSerovalNode(28, Ga, Ga, Ga, Ga, Ga, Ga, Ga, [e3, t3], Ga, Ga, Ga);
}
function createAsyncIteratorFactoryInstanceNode(e3, t3) {
  return createSerovalNode(30, Ga, Ga, Ga, Ga, Ga, Ga, Ga, [e3, t3], Ga, Ga, Ga);
}
function createStreamConstructorNode(e3, t3, r4) {
  return createSerovalNode(31, e3, Ga, Ga, Ga, Ga, Ga, Ga, r4, t3, Ga, Ga);
}
function createFunction(e3, t3, r4) {
  if (2 & e3) {
    return (1 === t3.length ? t3[0] : "(" + t3.join(",") + ")") + "=>" + (r4.startsWith("{") ? "(" + r4 + ")" : r4);
  }
  return "function(" + t3.join(",") + "){return " + r4 + "}";
}
function createEffectfulFunction(e3, t3, r4) {
  if (2 & e3) {
    return (1 === t3.length ? t3[0] : "(" + t3.join(",") + ")") + "=>{" + r4 + "}";
  }
  return "function(" + t3.join(",") + "){" + r4 + "}";
}
function serializeSpecialReferenceValue(e3, t3) {
  switch (t3) {
    case 0:
      return "[]";
    case 1:
      return function(e4) {
        return createFunction(e4, ["r"], "(r.p=new Promise(" + createEffectfulFunction(e4, ["s", "f"], "r.s=s,r.f=f") + "))");
      }(e3);
    case 2:
      return function(e4) {
        return createEffectfulFunction(e4, ["r", "d"], "r.s(d),r.p.s=1,r.p.v=d");
      }(e3);
    case 3:
      return function(e4) {
        return createEffectfulFunction(e4, ["r", "d"], "r.f(d),r.p.s=2,r.p.v=d");
      }(e3);
    case 4:
      return function(e4) {
        return createFunction(e4, ["b", "a", "s", "l", "p", "f", "e", "n"], "(b=[],a=!0,s=!1,l=[],p=0,f=" + createEffectfulFunction(e4, ["v", "m", "x"], "for(x=0;x<p;x++)l[x]&&l[x][m](v)") + ",n=" + createEffectfulFunction(e4, ["o", "x", "z", "c"], 'for(x=0,z=b.length;x<z;x++)(c=b[x],(!a&&x===z-1)?o[s?"return":"throw"](c):o.next(c))') + ",e=" + createFunction(e4, ["o", "t"], "(a&&(l[t=p++]=o),n(o)," + createEffectfulFunction(e4, [], "a&&(l[t]=void 0)") + ")") + ",{__SEROVAL_STREAM__:!0,on:" + createFunction(e4, ["o"], "e(o)") + ",next:" + createEffectfulFunction(e4, ["v"], 'a&&(b.push(v),f(v,"next"))') + ",throw:" + createEffectfulFunction(e4, ["v"], 'a&&(b.push(v),f(v,"throw"),a=s=!1,l.length=0)') + ",return:" + createEffectfulFunction(e4, ["v"], 'a&&(b.push(v),f(v,"return"),a=!1,s=!0,l.length=0)') + "})");
      }(e3);
    default:
      return "";
  }
}
function createStream() {
  const e3 = /* @__PURE__ */ new Set(), t3 = [];
  let r4 = true, n3 = true;
  return { __SEROVAL_STREAM__: true, on(s4) {
    r4 && e3.add(s4);
    for (let e4 = 0, o5 = t3.length; e4 < o5; e4++) {
      const a5 = t3[e4];
      e4 !== o5 - 1 || r4 ? s4.next(a5) : n3 ? s4.return(a5) : s4.throw(a5);
    }
    return () => {
      r4 && e3.delete(s4);
    };
  }, next(n4) {
    r4 && (t3.push(n4), function(t4) {
      for (const r5 of e3.keys()) r5.next(t4);
    }(n4));
  }, throw(s4) {
    r4 && (t3.push(s4), function(t4) {
      for (const r5 of e3.keys()) r5.throw(t4);
    }(s4), r4 = false, n3 = false, e3.clear());
  }, return(s4) {
    r4 && (t3.push(s4), function(t4) {
      for (const r5 of e3.keys()) r5.return(t4);
    }(s4), r4 = false, n3 = true, e3.clear());
  } };
}
function iteratorToSequence(e3) {
  const t3 = [];
  let r4 = -1, n3 = -1;
  const s4 = e3[Symbol.iterator]();
  for (; ; ) try {
    const e4 = s4.next();
    if (t3.push(e4.value), e4.done) {
      n3 = t3.length - 1;
      break;
    }
  } catch (e4) {
    r4 = t3.length, t3.push(e4);
  }
  return { v: t3, t: r4, d: n3 };
}
function isValidIdentifier(e3) {
  const t3 = e3[0];
  return ("$" === t3 || "_" === t3 || t3 >= "A" && t3 <= "Z" || t3 >= "a" && t3 <= "z") && yi.test(e3);
}
function getAssignmentExpression(e3) {
  switch (e3.t) {
    case 0:
      return e3.s + "=" + e3.v;
    case 2:
      return e3.s + ".set(" + e3.k + "," + e3.v + ")";
    case 1:
      return e3.s + ".add(" + e3.v + ")";
    case 3:
      return e3.s + ".delete(" + e3.k + ")";
  }
}
function resolveAssignments(e3) {
  if (e3.length) {
    let t3 = "";
    const r4 = function(e4) {
      const t4 = [];
      let r5 = e4[0];
      for (let n3, s4 = 1, o5 = e4.length, a5 = r5; s4 < o5; s4++) n3 = e4[s4], 0 === n3.t && n3.v === a5.v ? r5 = { t: 0, s: n3.s, k: Ga, v: getAssignmentExpression(r5) } : 2 === n3.t && n3.s === a5.s ? r5 = { t: 2, s: getAssignmentExpression(r5), k: n3.k, v: n3.v } : 1 === n3.t && n3.s === a5.s ? r5 = { t: 1, s: getAssignmentExpression(r5), k: Ga, v: n3.v } : 3 === n3.t && n3.s === a5.s ? r5 = { t: 3, s: getAssignmentExpression(r5), k: n3.k, v: Ga } : (t4.push(r5), r5 = n3), a5 = n3;
      return t4.push(r5), t4;
    }(e3);
    for (let e4 = 0, n3 = r4.length; e4 < n3; e4++) t3 += getAssignmentExpression(r4[e4]) + ",";
    return t3;
  }
  return Ga;
}
function toStream(e3) {
  const t3 = createStream(), r4 = e3.getReader();
  return (/* @__PURE__ */ __name(async function push() {
    try {
      const e4 = await r4.read();
      e4.done ? t3.return(e4.value) : (t3.next(e4.value), await push());
    } catch (e4) {
      t3.throw(e4);
    }
  }, "push"))().catch(() => {
  }), t3;
}
function dehydrateMatch(e3) {
  const t3 = { i: e3.id, u: e3.updatedAt, s: e3.status }, r4 = [["__beforeLoadContext", "b"], ["loaderData", "l"], ["error", "e"], ["ssr", "ssr"]];
  for (const [n3, s4] of r4) void 0 !== e3[n3] && (t3[s4] = e3[n3]);
  return t3;
}
function attachRouterServerSsrUtils(e3, t3) {
  e3.ssr = { manifest: t3 };
  const r4 = /* @__PURE__ */ new Map();
  let n3 = false;
  const getInitialScript = /* @__PURE__ */ __name(() => n3 ? "" : (n3 = true, `(${za}=${za}||{})["${serializeString("tsr")}"]=[];self.$_TSR={c:()=>{document.querySelectorAll(".\\\\$tsr").forEach(e=>{e.remove()})}};
;`), "getInitialScript");
  let s4 = false;
  const o5 = [];
  e3.serverSsr = { injectedHtml: [], injectHtml: /* @__PURE__ */ __name((t4) => {
    const r5 = Promise.resolve().then(t4);
    return e3.serverSsr.injectedHtml.push(r5), e3.emit({ type: "onInjectedHtml", promise: r5 }), r5.then(() => {
    });
  }, "injectHtml"), injectScript: /* @__PURE__ */ __name((t4) => e3.serverSsr.injectHtml(async () => {
    const e4 = await t4();
    return `<script class='$tsr'>${getInitialScript()}${e4};if (typeof $_TSR !== 'undefined') $_TSR.c()<\/script>`;
  }), "injectScript"), dehydrate: /* @__PURE__ */ __name(async () => {
    var t4, n4, o6;
    invariant(!s4);
    let a5 = e3.state.matches;
    e3.isShell() && (a5 = a5.slice(0, 1));
    const i5 = a5.map(dehydrateMatch), l4 = { manifest: e3.ssr.manifest, matches: i5 }, u4 = null == (t4 = a5[a5.length - 1]) ? void 0 : t4.id;
    u4 && (l4.lastMatchId = u4), l4.dehydratedData = await (null == (o6 = (n4 = e3.options).dehydrate) ? void 0 : o6.call(n4)), s4 = true;
    const c4 = function() {
      let e4, t5;
      const r5 = new Promise((r6, n5) => {
        e4 = r6, t5 = n5;
      });
      return r5.status = "pending", r5.resolve = (t6) => {
        r5.status = "resolved", r5.value = t6, e4(t6);
      }, r5.reject = (e5) => {
        r5.status = "rejected", t5(e5);
      }, r5;
    }();
    !function(e4, t5) {
      const r5 = resolvePlugins(t5.plugins), n5 = new Ci({ plugins: r5, refs: t5.refs, disabledFeatures: t5.disabledFeatures, onParse(e5, s5) {
        const o7 = new Si({ plugins: r5, features: n5.features, scopeId: t5.scopeId, markedRefs: n5.marked });
        let a6;
        try {
          a6 = o7.serializeTop(e5);
        } catch (e6) {
          return void (t5.onError && t5.onError(e6));
        }
        t5.onSerialize(a6, s5);
      }, onError: t5.onError, onDone: t5.onDone });
      n5.start(e4), n5.destroy.bind(n5);
    }(l4, { refs: r4, plugins: [Pi, Ri], onSerialize: /* @__PURE__ */ __name((t5, r5) => {
      const n5 = r5 ? '$_TSR["router"]=' + t5 : t5;
      e3.serverSsr.injectScript(() => n5);
    }, "onSerialize"), scopeId: "tsr", onDone: /* @__PURE__ */ __name(() => c4.resolve(""), "onDone"), onError: /* @__PURE__ */ __name((e4) => c4.reject(e4), "onError") }), e3.serverSsr.injectHtml(() => c4);
  }, "dehydrate"), isDehydrated: /* @__PURE__ */ __name(() => s4, "isDehydrated"), onRenderFinished: /* @__PURE__ */ __name((e4) => o5.push(e4), "onRenderFinished"), setRenderFinished: /* @__PURE__ */ __name(() => {
    o5.forEach((e4) => e4());
  }, "setRenderFinished") };
}
function objectHash(e3, t3) {
  const r4 = createHasher(t3 = t3 ? { ...Ti, ...t3 } : Ti);
  return r4.dispatch(e3), r4.toString();
}
function createHasher(e3) {
  let t3 = "", n3 = /* @__PURE__ */ new Map();
  const write = /* @__PURE__ */ __name((e4) => {
    t3 += e4;
  }, "write");
  return { toString: /* @__PURE__ */ __name(() => t3, "toString"), getContext: /* @__PURE__ */ __name(() => n3, "getContext"), dispatch(t4) {
    e3.replacer && (t4 = e3.replacer(t4));
    return this[null === t4 ? "null" : typeof t4](t4);
  }, object(t4) {
    if (t4 && "function" == typeof t4.toJSON) return this.object(t4.toJSON());
    const s4 = Object.prototype.toString.call(t4);
    let o5 = "";
    const a5 = s4.length;
    o5 = a5 < 10 ? "unknown:[" + s4 + "]" : s4.slice(8, a5 - 1), o5 = o5.toLowerCase();
    let i5 = null;
    if (void 0 !== (i5 = n3.get(t4))) return this.dispatch("[CIRCULAR:" + i5 + "]");
    if (n3.set(t4, n3.size), void 0 !== r2 && r2.isBuffer && r2.isBuffer(t4)) return write("buffer:"), write(t4.toString("utf8"));
    if ("object" !== o5 && "function" !== o5 && "asyncfunction" !== o5) this[o5] ? this[o5](t4) : e3.ignoreUnknown || this.unkown(t4, o5);
    else {
      let r4 = Object.keys(t4);
      e3.unorderedObjects && (r4 = r4.sort());
      let n4 = [];
      false === e3.respectType || isNativeFunction(t4) || (n4 = $i), e3.excludeKeys && (r4 = r4.filter((t5) => !e3.excludeKeys(t5)), n4 = n4.filter((t5) => !e3.excludeKeys(t5))), write("object:" + (r4.length + n4.length) + ":");
      const dispatchForKey = /* @__PURE__ */ __name((r5) => {
        this.dispatch(r5), write(":"), e3.excludeValues || this.dispatch(t4[r5]), write(",");
      }, "dispatchForKey");
      for (const e4 of r4) dispatchForKey(e4);
      for (const e4 of n4) dispatchForKey(e4);
    }
  }, array(t4, r4) {
    if (r4 = void 0 === r4 ? false !== e3.unorderedArrays : r4, write("array:" + t4.length + ":"), !r4 || t4.length <= 1) {
      for (const e4 of t4) this.dispatch(e4);
      return;
    }
    const s4 = /* @__PURE__ */ new Map(), o5 = t4.map((t5) => {
      const r5 = createHasher(e3);
      r5.dispatch(t5);
      for (const [e4, t6] of r5.getContext()) s4.set(e4, t6);
      return r5.toString();
    });
    return n3 = s4, o5.sort(), this.array(o5, false);
  }, date: /* @__PURE__ */ __name((e4) => write("date:" + e4.toJSON()), "date"), symbol: /* @__PURE__ */ __name((e4) => write("symbol:" + e4.toString()), "symbol"), unkown(e4, t4) {
    if (write(t4), e4) return write(":"), e4 && "function" == typeof e4.entries ? this.array(Array.from(e4.entries()), true) : void 0;
  }, error: /* @__PURE__ */ __name((e4) => write("error:" + e4.toString()), "error"), boolean: /* @__PURE__ */ __name((e4) => write("bool:" + e4), "boolean"), string(e4) {
    write("string:" + e4.length + ":"), write(e4);
  }, function(t4) {
    write("fn:"), isNativeFunction(t4) ? this.dispatch("[native]") : this.dispatch(t4.toString()), false !== e3.respectFunctionNames && this.dispatch("function-name:" + String(t4.name)), e3.respectFunctionProperties && this.object(t4);
  }, number: /* @__PURE__ */ __name((e4) => write("number:" + e4), "number"), xml: /* @__PURE__ */ __name((e4) => write("xml:" + e4.toString()), "xml"), null: /* @__PURE__ */ __name(() => write("Null"), "null"), undefined: /* @__PURE__ */ __name(() => write("Undefined"), "undefined"), regexp: /* @__PURE__ */ __name((e4) => write("regex:" + e4.toString()), "regexp"), uint8array(e4) {
    return write("uint8array:"), this.dispatch(Array.prototype.slice.call(e4));
  }, uint8clampedarray(e4) {
    return write("uint8clampedarray:"), this.dispatch(Array.prototype.slice.call(e4));
  }, int8array(e4) {
    return write("int8array:"), this.dispatch(Array.prototype.slice.call(e4));
  }, uint16array(e4) {
    return write("uint16array:"), this.dispatch(Array.prototype.slice.call(e4));
  }, int16array(e4) {
    return write("int16array:"), this.dispatch(Array.prototype.slice.call(e4));
  }, uint32array(e4) {
    return write("uint32array:"), this.dispatch(Array.prototype.slice.call(e4));
  }, int32array(e4) {
    return write("int32array:"), this.dispatch(Array.prototype.slice.call(e4));
  }, float32array(e4) {
    return write("float32array:"), this.dispatch(Array.prototype.slice.call(e4));
  }, float64array(e4) {
    return write("float64array:"), this.dispatch(Array.prototype.slice.call(e4));
  }, arraybuffer(e4) {
    return write("arraybuffer:"), this.dispatch(new Uint8Array(e4));
  }, url: /* @__PURE__ */ __name((e4) => write("url:" + e4.toString()), "url"), map(t4) {
    write("map:");
    const r4 = [...t4];
    return this.array(r4, false !== e3.unorderedSets);
  }, set(t4) {
    write("set:");
    const r4 = [...t4];
    return this.array(r4, false !== e3.unorderedSets);
  }, file(e4) {
    return write("file:"), this.dispatch([e4.name, e4.size, e4.type, e4.lastModfied]);
  }, blob() {
    if (e3.ignoreUnknown) return write("[blob]");
    throw new Error('Hashing Blob objects is currently not supported\nUse "options.replacer" or "options.ignoreUnknown"\n');
  }, domwindow: /* @__PURE__ */ __name(() => write("domwindow"), "domwindow"), bigint: /* @__PURE__ */ __name((e4) => write("bigint:" + e4.toString()), "bigint"), process: /* @__PURE__ */ __name(() => write("process"), "process"), timer: /* @__PURE__ */ __name(() => write("timer"), "timer"), pipe: /* @__PURE__ */ __name(() => write("pipe"), "pipe"), tcp: /* @__PURE__ */ __name(() => write("tcp"), "tcp"), udp: /* @__PURE__ */ __name(() => write("udp"), "udp"), tty: /* @__PURE__ */ __name(() => write("tty"), "tty"), statwatcher: /* @__PURE__ */ __name(() => write("statwatcher"), "statwatcher"), securecontext: /* @__PURE__ */ __name(() => write("securecontext"), "securecontext"), connection: /* @__PURE__ */ __name(() => write("connection"), "connection"), zlib: /* @__PURE__ */ __name(() => write("zlib"), "zlib"), context: /* @__PURE__ */ __name(() => write("context"), "context"), nodescript: /* @__PURE__ */ __name(() => write("nodescript"), "nodescript"), httpparser: /* @__PURE__ */ __name(() => write("httpparser"), "httpparser"), dataview: /* @__PURE__ */ __name(() => write("dataview"), "dataview"), signal: /* @__PURE__ */ __name(() => write("signal"), "signal"), fsevent: /* @__PURE__ */ __name(() => write("fsevent"), "fsevent"), tlswrap: /* @__PURE__ */ __name(() => write("tlswrap"), "tlswrap") };
}
function isNativeFunction(e3) {
  return "function" == typeof e3 && Function.prototype.toString.call(e3).slice(-Fi) === Ei;
}
function hasProp(e3, t3) {
  try {
    return t3 in e3;
  } catch {
    return false;
  }
}
function assertMethod(e3, t3, r4) {
  if (!function(e4, t4) {
    if ("string" == typeof t4) {
      if (e4.method === t4) return true;
    } else if (t4.includes(e4.method)) return true;
    return false;
  }(e3, t3)) throw function(e4) {
    if ("string" == typeof e4) return new H3Error(e4);
    if (function(e5) {
      return true === e5?.constructor?.__h3_error__;
    }(e4)) return e4;
    const t4 = new H3Error(e4.message ?? e4.statusMessage ?? "", { cause: e4.cause || e4 });
    if (hasProp(e4, "stack")) try {
      Object.defineProperty(t4, "stack", { get: /* @__PURE__ */ __name(() => e4.stack, "get") });
    } catch {
      try {
        t4.stack = e4.stack;
      } catch {
      }
    }
    if (e4.data && (t4.data = e4.data), e4.statusCode ? t4.statusCode = sanitizeStatusCode(e4.statusCode, t4.statusCode) : e4.status && (t4.statusCode = sanitizeStatusCode(e4.status, t4.statusCode)), e4.statusMessage ? t4.statusMessage = e4.statusMessage : e4.statusText && (t4.statusMessage = e4.statusText), t4.statusMessage) {
      const e5 = t4.statusMessage;
      sanitizeStatusMessage(t4.statusMessage) !== e5 && console.warn("[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default.");
    }
    return void 0 !== e4.fatal && (t4.fatal = e4.fatal), void 0 !== e4.unhandled && (t4.unhandled = e4.unhandled), t4;
  }({ statusCode: 405, statusMessage: "HTTP method is not allowed." });
}
function toWebRequest(e3) {
  return e3.web?.request || new Request(function(e4, t3 = {}) {
    const r4 = function(e5, t4 = {}) {
      if (t4.xForwardedHost) {
        const t5 = e5.node.req.headers["x-forwarded-host"];
        if (t5) return t5;
      }
      return e5.node.req.headers.host || "localhost";
    }(e4, t3), n3 = function(e5, t4 = {}) {
      return false !== t4.xForwardedProto && "https" === e5.node.req.headers["x-forwarded-proto"] || e5.node.req.connection?.encrypted ? "https" : "http";
    }(e4, t3), s4 = (e4.node.req.originalUrl || e4.path).replace(/^[/\\]+/g, "/");
    return new URL(s4, `${n3}://${r4}`);
  }(e3), { duplex: "half", method: e3.method, headers: e3.headers, body: getRequestWebStream(e3) });
}
function getRequestWebStream(e3) {
  if (!_i.includes(e3.method)) return;
  const t3 = e3.web?.request?.body || e3._requestBody;
  if (t3) return t3;
  return Ai in e3.node.req || "rawBody" in e3.node.req || "body" in e3.node.req || "__unenv__" in e3.node.req ? new ReadableStream({ async start(t4) {
    const n3 = await function(e4, t5 = "utf8") {
      assertMethod(e4, _i);
      const n4 = e4._requestBody || e4.web?.request?.body || e4.node.req[Ai] || e4.node.req.rawBody || e4.node.req.body;
      if (n4) {
        const e5 = Promise.resolve(n4).then((e6) => r2.isBuffer(e6) ? e6 : "function" == typeof e6.pipeTo ? new Promise((t6, n5) => {
          const s5 = [];
          e6.pipeTo(new WritableStream({ write(e7) {
            s5.push(e7);
          }, close() {
            t6(r2.concat(s5));
          }, abort(e7) {
            n5(e7);
          } })).catch(n5);
        }) : "function" == typeof e6.pipe ? new Promise((t6, n5) => {
          const s5 = [];
          e6.on("data", (e7) => {
            s5.push(e7);
          }).on("end", () => {
            t6(r2.concat(s5));
          }).on("error", n5);
        }) : e6.constructor === Object ? r2.from(JSON.stringify(e6)) : e6 instanceof URLSearchParams ? r2.from(e6.toString()) : r2.from(e6));
        return t5 ? e5.then((e6) => e6.toString(t5)) : e5;
      }
      if (!Number.parseInt(e4.node.req.headers["content-length"] || "") && !String(e4.node.req.headers["transfer-encoding"] ?? "").split(",").map((e5) => e5.trim()).filter(Boolean).includes("chunked")) return Promise.resolve(void 0);
      const s4 = e4.node.req[Ai] = new Promise((t6, n5) => {
        const s5 = [];
        e4.node.req.on("error", (e5) => {
          n5(e5);
        }).on("data", (e5) => {
          s5.push(e5);
        }).on("end", () => {
          t6(r2.concat(s5));
        });
      });
      return t5 ? s4.then((e5) => e5.toString(t5)) : s4;
    }(e3, false);
    n3 && t4.enqueue(n3), t4.close();
  } }) : new ReadableStream({ start: /* @__PURE__ */ __name((t4) => {
    e3.node.req.on("data", (e4) => {
      t4.enqueue(e4);
    }), e3.node.req.on("end", () => {
      t4.close();
    }), e3.node.req.on("error", (e4) => {
      t4.error(e4);
    });
  }, "start") });
}
function sanitizeStatusMessage(e3 = "") {
  return e3.replace(Mi, "");
}
function sanitizeStatusCode(e3, t3 = 200) {
  return e3 ? ("string" == typeof e3 && (e3 = Number.parseInt(e3, 10)), e3 < 100 || e3 > 999 ? t3 : e3) : t3;
}
function splitCookiesString(e3) {
  if (Array.isArray(e3)) return e3.flatMap((e4) => splitCookiesString(e4));
  if ("string" != typeof e3) return [];
  const t3 = [];
  let r4, n3, s4, o5, a5, i5 = 0;
  const skipWhitespace = /* @__PURE__ */ __name(() => {
    for (; i5 < e3.length && /\s/.test(e3.charAt(i5)); ) i5 += 1;
    return i5 < e3.length;
  }, "skipWhitespace"), notSpecialChar = /* @__PURE__ */ __name(() => (n3 = e3.charAt(i5), "=" !== n3 && ";" !== n3 && "," !== n3), "notSpecialChar");
  for (; i5 < e3.length; ) {
    for (r4 = i5, a5 = false; skipWhitespace(); ) if (n3 = e3.charAt(i5), "," === n3) {
      for (s4 = i5, i5 += 1, skipWhitespace(), o5 = i5; i5 < e3.length && notSpecialChar(); ) i5 += 1;
      i5 < e3.length && "=" === e3.charAt(i5) ? (a5 = true, i5 = o5, t3.push(e3.slice(r4, s4)), r4 = i5) : i5 = s4 + 1;
    } else i5 += 1;
    (!a5 || i5 >= e3.length) && t3.push(e3.slice(r4));
  }
  return t3;
}
function sendWebResponse(e3, t3) {
  for (const [r4, n3] of t3.headers) "set-cookie" === r4 ? e3.node.res.appendHeader(r4, splitCookiesString(n3)) : e3.node.res.setHeader(r4, n3);
  if (t3.status && (e3.node.res.statusCode = sanitizeStatusCode(t3.status, e3.node.res.statusCode)), t3.statusText && (e3.node.res.statusMessage = sanitizeStatusMessage(t3.statusText)), t3.redirected && e3.node.res.setHeader("location", t3.url), t3.body) return function(e4, t4) {
    if (!t4 || "object" != typeof t4) throw new Error("[h3] Invalid stream provided.");
    if (e4.node.res._data = t4, !e4.node.res.socket) return e4._handled = true, Promise.resolve();
    if (hasProp(t4, "pipeTo") && "function" == typeof t4.pipeTo) return t4.pipeTo(new WritableStream({ write(t5) {
      e4.node.res.write(t5);
    } })).then(() => {
      e4.node.res.end();
    });
    if (hasProp(t4, "pipe") && "function" == typeof t4.pipe) return new Promise((r4, n3) => {
      t4.pipe(e4.node.res), t4.on && (t4.on("end", () => {
        e4.node.res.end(), r4();
      }), t4.on("error", (e5) => {
        n3(e5);
      })), e4.node.res.on("close", () => {
        t4.abort && t4.abort();
      });
    });
    throw new Error("[h3] Invalid or incompatible stream provided.");
  }(e3, t3.body);
  e3.node.res.end();
}
function _normalizeArray(e3) {
  return e3 ? Array.isArray(e3) ? e3 : [e3] : void 0;
}
function getEvent() {
  const e3 = Ni.getStore();
  if (!e3) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
  return e3;
}
function createWrapperFunction(e3) {
  return function(...t3) {
    const r4 = t3[0];
    var n3;
    return "object" == typeof (n3 = r4) && (n3 instanceof H3Event || (null == n3 ? void 0 : n3[ji]) instanceof H3Event || true === (null == n3 ? void 0 : n3.__is_event__)) ? t3[0] = r4 instanceof H3Event || r4.__is_event__ ? r4 : r4[ji] : t3.unshift(getEvent()), e3(...t3);
  };
}
async function loadVirtualModule(e3) {
  switch (e3) {
    case zi:
      return await Promise.resolve().then(() => ul);
    case qi:
      return await Promise.resolve().then(() => (init_tanstack_start_manifest_v_D0_i9UH(), tanstack_start_manifest_v_D0_i9UH_exports));
    case Ui:
      return await Promise.resolve().then(() => (init_tanstack_start_server_fn_manifest_v_DSuGt3oC(), tanstack_start_server_fn_manifest_v_DSuGt3oC_exports));
    default:
      throw new Error(`Unknown virtual module: ${e3}`);
  }
}
function isNotFoundResponse(e3) {
  const { headers: t3, ...r4 } = e3;
  return new Response(JSON.stringify(r4), { status: 200, headers: { "Content-Type": "application/json", ...t3 || {} } });
}
function handlerToMiddleware(e3) {
  return async ({ next: t3, ...r4 }) => {
    const n3 = await e3(r4);
    return n3 ? { response: n3 } : t3(r4);
  };
}
function handleCtxResult(e3) {
  return isSpecialResponse(e3) ? { response: e3 } : e3;
}
function isSpecialResponse(e3) {
  return e3 instanceof Response || isRedirect(e3);
}
function createServerRoute(e3, t3) {
  const r4 = t3 || {}, n3 = { isRoot: false, path: "", id: "", fullPath: "", to: "", options: r4, parentRoute: void 0, _types: {}, middleware: /* @__PURE__ */ __name((e4) => createServerRoute(void 0, { ...r4, middleware: e4 }), "middleware"), methods: /* @__PURE__ */ __name((e4) => {
    const r5 = "function" == typeof e4 ? e4(createMethodBuilder()) : e4;
    return createServerRoute(void 0, { ...t3, methods: r5 });
  }, "methods"), update: /* @__PURE__ */ __name((e4) => createServerRoute(void 0, { ...r4, ...e4 }), "update"), init: /* @__PURE__ */ __name((e4) => {
    var t4;
    r4.originalIndex = e4.originalIndex;
    const s4 = !r4.path && !r4.id;
    if (n3.parentRoute = null == (t4 = r4.getParentRoute) ? void 0 : t4.call(r4), s4) n3.path = Oa;
    else if (!n3.parentRoute) throw new Error("Child Route instances must pass a 'getParentRoute: () => ParentRoute' option that returns a ServerRoute instance.");
    let o5 = s4 ? Oa : r4.path;
    o5 && "/" !== o5 && (o5 = trimPathLeft(o5));
    const a5 = r4.id || o5;
    let i5 = s4 ? Oa : joinPaths([n3.parentRoute.id === Oa ? "" : n3.parentRoute.id, a5]);
    o5 === Oa && (o5 = "/"), i5 !== Oa && (i5 = joinPaths(["/", i5]));
    const l4 = i5 === Oa ? "/" : joinPaths([n3.parentRoute.fullPath, o5]);
    n3.path = o5, n3.id = i5, n3.fullPath = l4, n3.to = l4, n3.isRoot = s4;
  }, "init"), _addFileChildren: /* @__PURE__ */ __name((e4) => (Array.isArray(e4) && (n3.children = e4), "object" == typeof e4 && null !== e4 && (n3.children = Object.values(e4)), n3), "_addFileChildren"), _addFileTypes: /* @__PURE__ */ __name(() => n3, "_addFileTypes") };
  return n3;
}
function DefaultCatchBoundary({ error: e3 }) {
  const t3 = useRouter(), r4 = useMatch({ strict: false, select: /* @__PURE__ */ __name((e4) => e4.id === ke, "select") });
  return console.error("DefaultCatchBoundary Error:", e3), c2.jsxDEV("div", { className: "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4", children: [c2.jsxDEV(ErrorComponent, { error: e3 }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/components/DefaultCatchBoundary.tsx", lineNumber: 15, columnNumber: 13 }, this), c2.jsxDEV("div", { className: "flex flex-wrap items-center gap-2", children: [c2.jsxDEV("button", { onClick: /* @__PURE__ */ __name(() => {
    t3.invalidate();
  }, "onClick"), className: "rounded bg-gray-600 px-2 py-1 font-extrabold text-white uppercase dark:bg-gray-700", children: "Try Again" }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/components/DefaultCatchBoundary.tsx", lineNumber: 17, columnNumber: 17 }, this), r4 ? c2.jsxDEV(Je, { to: "/", className: "rounded bg-gray-600 px-2 py-1 font-extrabold text-white uppercase dark:bg-gray-700", children: "Home" }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/components/DefaultCatchBoundary.tsx", lineNumber: 28, columnNumber: 21 }, this) : c2.jsxDEV(Je, { to: "/", className: "rounded bg-gray-600 px-2 py-1 font-extrabold text-white uppercase dark:bg-gray-700", onClick: /* @__PURE__ */ __name((e4) => {
    e4.preventDefault(), window.history.back();
  }, "onClick"), children: "Go Back" }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/components/DefaultCatchBoundary.tsx", lineNumber: 37, columnNumber: 21 }, this)] }, void 0, true, { fileName: "/Users/kregenrek/projects/codefetchUI/src/components/DefaultCatchBoundary.tsx", lineNumber: 16, columnNumber: 13 }, this)] }, void 0, true, { fileName: "/Users/kregenrek/projects/codefetchUI/src/components/DefaultCatchBoundary.tsx", lineNumber: 14, columnNumber: 9 }, this);
}
function NotFound({ children: e3 }) {
  return c2.jsxDEV("div", { className: "space-y-2 p-2", children: [c2.jsxDEV("div", { className: "text-gray-600 dark:text-gray-400", children: e3 || c2.jsxDEV("p", { children: "The page you are looking for does not exist." }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/components/NotFound.tsx", lineNumber: 7, columnNumber: 30 }, this) }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/components/NotFound.tsx", lineNumber: 6, columnNumber: 13 }, this), c2.jsxDEV("p", { className: "flex flex-wrap items-center gap-2", children: [c2.jsxDEV("button", { onClick: /* @__PURE__ */ __name(() => window.history.back(), "onClick"), className: "rounded bg-emerald-500 px-2 py-1 font-black text-sm text-white uppercase", children: "Go back" }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/components/NotFound.tsx", lineNumber: 10, columnNumber: 17 }, this), c2.jsxDEV(Je, { to: "/", className: "rounded bg-cyan-600 px-2 py-1 font-black text-sm text-white uppercase", children: "Start Over" }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/components/NotFound.tsx", lineNumber: 16, columnNumber: 17 }, this)] }, void 0, true, { fileName: "/Users/kregenrek/projects/codefetchUI/src/components/NotFound.tsx", lineNumber: 9, columnNumber: 13 }, this)] }, void 0, true, { fileName: "/Users/kregenrek/projects/codefetchUI/src/components/NotFound.tsx", lineNumber: 5, columnNumber: 9 }, this);
}
function ThemeInitScript() {
  return c2.jsxDEV("script", { id: "theme-init", suppressHydrationWarning: true, children: `(() => {
    try {
      const COOKIE = "vite-ui-theme";
      // 1. Try localStorage first \u2013 instant client-side updates when the user toggles.
      // 2. Fallback to the cookie (updated on the next server round-trip).
      // This prevents a flicker where the cookie still contains the old value
      // between the client update and the (async) server response.
      let theme = null;

      try {
        theme = localStorage.getItem(COOKIE);
      } catch (_) {}

      if (!theme) {
        const match = document.cookie.match(new RegExp("(?:^|; )" + COOKIE + "=([^;]*)"));
        theme = match ? decodeURIComponent(match[1]) : null;
      }

      if (theme !== "light" && theme !== "dark") {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }

      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);

      let meta = document.querySelector('meta[name="color-scheme"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "color-scheme");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", "light dark");
    } catch (_) { /* never block page load */ }
  })();` }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/components/theme-init-script.tsx", lineNumber: 52, columnNumber: 3 }, this);
}
function sanitizeBase(e3) {
  return e3.replace(/^\/|\/$/g, "");
}
function ThemeProvider({ initial: e3, children: t3 }) {
  const [r4, n3] = W2.useState(e3);
  W2.useEffect(() => {
    const t4 = localStorage.getItem(Yi);
    t4 && t4 !== e3 && n3(t4);
  }, [e3]), W2.useLayoutEffect(() => {
    const e4 = document.documentElement;
    e4.classList.remove("light", "dark");
    const t4 = "system" === r4 ? matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : r4;
    e4.classList.add(t4), localStorage.setItem(Yi, r4);
  }, [r4]), W2.useEffect(() => {
    const handler = /* @__PURE__ */ __name((e4) => {
      if (e4.key === Yi && e4.newValue) {
        const t4 = e4.newValue;
        t4 !== r4 && n3(t4);
      }
    }, "handler");
    return window.addEventListener("storage", handler), () => window.removeEventListener("storage", handler);
  }, [r4]);
  return c2.jsxDEV(Xi.Provider, { value: { theme: r4, setTheme: /* @__PURE__ */ __name((e4) => {
    n3(e4), localStorage.setItem(Yi, e4), Ji({ data: e4 });
  }, "setTheme") }, children: t3 }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/components/theme-provider.tsx", lineNumber: 69, columnNumber: 3 }, this);
}
function RootDocument({ children: e3 }) {
  const t3 = Zi.useLoaderData();
  return c2.jsxDEV("html", { lang: "en", className: "system" === t3 ? "" : t3, suppressHydrationWarning: true, children: [c2.jsxDEV("head", { children: [c2.jsxDEV(ThemeInitScript, {}, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/__root.tsx", lineNumber: 94, columnNumber: 9 }, this), c2.jsxDEV(HeadContent, {}, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/__root.tsx", lineNumber: 95, columnNumber: 9 }, this)] }, void 0, true, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/__root.tsx", lineNumber: 92, columnNumber: 7 }, this), c2.jsxDEV("body", { className: "", children: [c2.jsxDEV(ThemeProvider, { initial: t3, children: [c2.jsxDEV("div", { className: "flex min-h-svh flex-col", children: e3 }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/__root.tsx", lineNumber: 107, columnNumber: 11 }, this), c2.jsxDEV(dt, {}, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/__root.tsx", lineNumber: 108, columnNumber: 11 }, this)] }, void 0, true, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/__root.tsx", lineNumber: 99, columnNumber: 9 }, this), c2.jsxDEV(Scripts, {}, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/__root.tsx", lineNumber: 112, columnNumber: 9 }, this)] }, void 0, true, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/__root.tsx", lineNumber: 97, columnNumber: 7 }, this)] }, void 0, true, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/__root.tsx", lineNumber: 91, columnNumber: 5 }, this);
}
var i3, l2, u2, c2, d2, h2, p2, f2, m3, defaultScheduler, g2, y, v, b, S2, k2, w2, C2, x, P2, R2, T2, $, E2, F2, I2, A2, _, M, O2, N2, j, L2, D2, B, H, z, q, U2, V2, W2, K2, Q, G, J, Y2, X2, Z, QueryClientProvider, ee, te, re, ne, se, oe, ae, ie, Store, Derived, le, ue, ce, de, he, pe, fe, me, ge, defaultGetScrollRestorationKey, ye, ve, be, Se, ke, RouterCore, SearchParamError, PathParamError, we, BaseRoute, BaseRootRoute, CatchBoundaryImpl, Ce, xe, Pe, Re, Te, shim$1, $e, Ee, Fe, Ie, Ae, _e, Me, Oe, Ne, je, Le, De, Be, He, ze, qe, Ue, Ve, We, Ke, Qe, Ge, Je, Ye, RootRoute, FileRoute, LazyRoute, Xe, Ze, et, Router, useTags, Scripts, tt, Loader, rt, nt, st, ot, at, it, lt, isHttpResponse, basicToast, ut, ct, Toast, dt, ht, pt, ft, mt, gt, yt, vt, bt, St, kt, wt, Ct, xt, Pt, Rt, Tt, $t, Et, Ft, It, At, _t, Mt, Ot, Nt, jt, Lt, Dt, Bt, Ht, zt, qt, Ut, Vt, Wt, Kt, Qt, Gt, Jt, Yt, Xt, Zt, er, tr, rr, nr, sr, or, ar2, ir, lr, ur, cr, dr, hr, pr, fr, mr, gr, yr, vr, br, Sr, kr, wr, Cr, xr, Pr, Rr, Tr, $r, Er, Fr, Ir, Ar, _r, Mr, Or, Nr, jr, Lr, Dr, Br, Hr, zr, qr, Ur, Vr, Wr, Kr, Qr, Gr, Jr, Yr, Xr, Zr, en, tn, rn, nn, sn, on2, an, ln, un, dn, hn, pn, fn, mn, gn, yn, vn, bn, Sn, kn, wn, Cn, xn, Pn, Rn, Tn, $n, En, Fn, In, An, _n, Mn, On, Nn, jn, Ln, Dn, Bn, Hn, zn, qn, Un, Vn, Wn, Kn, Qn, Gn, Jn, Yn, Xn, Zn, es, ts, rs, ns, ss, os, as, is, ls, us, cs, ds, hs, ps, fs, ms, gs, ys, vs, bs, Ss, ks, ws, Cs, xs, Ps, Rs, Ts, $s, Es, Fs, Is, As, _s, Ms, Os, Ns, js, Ls, Ds, Bs, Hs, zs, qs, Us, Vs, Ws, Ks, Qs, Gs, Js, Ys, Xs, Zs, eo, to, ro, no, so, oo, ao, io, lo, uo, co, ho, po, fo, mo, go, yo, vo, bo, So, ko, wo, Co, xo, Po, Ro, To, $o, Eo, Fo, Io, Ao, _o, Mo, Oo, No, jo, Lo, Do, Bo, Ho, zo, qo, Uo, Vo, Wo, Ko, Qo, Go, Jo, Yo, Xo, Zo, ea, ta, ra, na, sa, oa, aa, ia, la, ua, ca, da, ha, pa, fa, ma, ga, ya, va, ba, Sa, ka, wa, Ca, xa, Pa, Ra, Ta, $a, renderRouterToStream, defaultStreamHandler, Ea, Fa, Ia, Aa, _a, Ma, Oa, Na, createSerializer, ja, La, Da, applyMiddleware, Ba, Ha, za, qa, Ua, Va, Wa, Ka, Qa, Ga, Ja, Ya, Xa, Za, ei, ti, ri, ni, si, oi, ai, ii, li, ui, ci, di, hi, pi, fi, mi, gi, yi, vi, bi, Si, ki, wi, Ci, xi, Pi, Ri, Ti, $i, Ei, Fi, Ii, __publicField$2, H3Error, Ai, _i, Mi, Oi, __publicField, H3Event, Ni, ji, Li, Di, Bi, Hi, zi, qi, Ui, Vi, createMethodBuilder, createServerRpc, Wi, Ki, Qi, Gi, Ji, Yi, Xi, seo, Zi, el, tl, rl, nl, sl, ol, al, il, ll, ul, cl, dl, hl, pl;
var init_ssr = __esm({
  ".output/server/chunks/_/ssr.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_nitro();
    init_async_hooks();
    __name(getDefaultExportFromCjs, "getDefaultExportFromCjs");
    i3 = { exports: {} };
    l2 = {};
    u2 = Symbol.for("react.fragment");
    l2.Fragment = u2, l2.jsxDEV = void 0, i3.exports = l2;
    c2 = i3.exports;
    d2 = class {
      static {
        __name(this, "d");
      }
      constructor() {
        this.listeners = /* @__PURE__ */ new Set(), this.subscribe = this.subscribe.bind(this);
      }
      subscribe(e3) {
        return this.listeners.add(e3), this.onSubscribe(), () => {
          this.listeners.delete(e3), this.onUnsubscribe();
        };
      }
      hasListeners() {
        return this.listeners.size > 0;
      }
      onSubscribe() {
      }
      onUnsubscribe() {
      }
    };
    __name(noop$6, "noop$6");
    __name(resolveStaleTime, "resolveStaleTime");
    __name(matchQuery, "matchQuery");
    __name(matchMutation, "matchMutation");
    __name(hashQueryKeyByOptions, "hashQueryKeyByOptions");
    __name(hashKey, "hashKey");
    __name(partialMatchKey, "partialMatchKey");
    __name(replaceEqualDeep$1, "replaceEqualDeep$1");
    __name(isPlainArray$1, "isPlainArray$1");
    __name(isPlainObject$2, "isPlainObject$2");
    __name(hasObjectPrototype$2, "hasObjectPrototype$2");
    __name(replaceData, "replaceData");
    __name(addToEnd, "addToEnd");
    __name(addToStart, "addToStart");
    h2 = Symbol();
    __name(ensureQueryFn, "ensureQueryFn");
    p2 = new class extends d2 {
      #e;
      #t;
      #r;
      constructor() {
        super(), this.#r = (e3) => {
        };
      }
      onSubscribe() {
        this.#t || this.setEventListener(this.#r);
      }
      onUnsubscribe() {
        this.hasListeners() || (this.#t?.(), this.#t = void 0);
      }
      setEventListener(e3) {
        this.#r = e3, this.#t?.(), this.#t = e3((e4) => {
          "boolean" == typeof e4 ? this.setFocused(e4) : this.onFocus();
        });
      }
      setFocused(e3) {
        this.#e !== e3 && (this.#e = e3, this.onFocus());
      }
      onFocus() {
        const e3 = this.isFocused();
        this.listeners.forEach((t3) => {
          t3(e3);
        });
      }
      isFocused() {
        return "boolean" == typeof this.#e ? this.#e : "hidden" !== globalThis.document?.visibilityState;
      }
    }();
    f2 = new class extends d2 {
      #n = true;
      #t;
      #r;
      constructor() {
        super(), this.#r = (e3) => {
        };
      }
      onSubscribe() {
        this.#t || this.setEventListener(this.#r);
      }
      onUnsubscribe() {
        this.hasListeners() || (this.#t?.(), this.#t = void 0);
      }
      setEventListener(e3) {
        this.#r = e3, this.#t?.(), this.#t = e3(this.setOnline.bind(this));
      }
      setOnline(e3) {
        this.#n !== e3 && (this.#n = e3, this.listeners.forEach((t3) => {
          t3(e3);
        }));
      }
      isOnline() {
        return this.#n;
      }
    }();
    __name(defaultRetryDelay, "defaultRetryDelay");
    __name(canFetch, "canFetch");
    m3 = class extends Error {
      static {
        __name(this, "m");
      }
      constructor(e3) {
        super("CancelledError"), this.revert = e3?.revert, this.silent = e3?.silent;
      }
    };
    __name(isCancelledError, "isCancelledError");
    __name(createRetryer, "createRetryer");
    defaultScheduler = /* @__PURE__ */ __name((e3) => setTimeout(e3, 0), "defaultScheduler");
    g2 = /* @__PURE__ */ function() {
      let e3 = [], t3 = 0, notifyFn = /* @__PURE__ */ __name((e4) => {
        e4();
      }, "notifyFn"), batchNotifyFn = /* @__PURE__ */ __name((e4) => {
        e4();
      }, "batchNotifyFn"), r4 = defaultScheduler;
      const schedule = /* @__PURE__ */ __name((n3) => {
        t3 ? e3.push(n3) : r4(() => {
          notifyFn(n3);
        });
      }, "schedule");
      return { batch: /* @__PURE__ */ __name((n3) => {
        let s4;
        t3++;
        try {
          s4 = n3();
        } finally {
          t3--, t3 || (() => {
            const t4 = e3;
            e3 = [], t4.length && r4(() => {
              batchNotifyFn(() => {
                t4.forEach((e4) => {
                  notifyFn(e4);
                });
              });
            });
          })();
        }
        return s4;
      }, "batch"), batchCalls: /* @__PURE__ */ __name((e4) => (...t4) => {
        schedule(() => {
          e4(...t4);
        });
      }, "batchCalls"), schedule, setNotifyFunction: /* @__PURE__ */ __name((e4) => {
        notifyFn = e4;
      }, "setNotifyFunction"), setBatchNotifyFunction: /* @__PURE__ */ __name((e4) => {
        batchNotifyFn = e4;
      }, "setBatchNotifyFunction"), setScheduler: /* @__PURE__ */ __name((e4) => {
        r4 = e4;
      }, "setScheduler") };
    }();
    y = class {
      static {
        __name(this, "y");
      }
      #s;
      destroy() {
        this.clearGcTimeout();
      }
      scheduleGc() {
        var e3;
        this.clearGcTimeout(), "number" == typeof (e3 = this.gcTime) && e3 >= 0 && e3 !== 1 / 0 && (this.#s = setTimeout(() => {
          this.optionalRemove();
        }, this.gcTime));
      }
      updateGcTime(e3) {
        this.gcTime = Math.max(this.gcTime || 0, e3 ?? 1 / 0);
      }
      clearGcTimeout() {
        this.#s && (clearTimeout(this.#s), this.#s = void 0);
      }
    };
    v = class extends y {
      static {
        __name(this, "v");
      }
      #o;
      #a;
      #i;
      #l;
      #u;
      #c;
      #d;
      constructor(e3) {
        super(), this.#d = false, this.#c = e3.defaultOptions, this.setOptions(e3.options), this.observers = [], this.#l = e3.client, this.#i = this.#l.getQueryCache(), this.queryKey = e3.queryKey, this.queryHash = e3.queryHash, this.#o = function(e4) {
          const t3 = "function" == typeof e4.initialData ? e4.initialData() : e4.initialData, r4 = void 0 !== t3, n3 = r4 ? "function" == typeof e4.initialDataUpdatedAt ? e4.initialDataUpdatedAt() : e4.initialDataUpdatedAt : 0;
          return { data: t3, dataUpdateCount: 0, dataUpdatedAt: r4 ? n3 ?? Date.now() : 0, error: null, errorUpdateCount: 0, errorUpdatedAt: 0, fetchFailureCount: 0, fetchFailureReason: null, fetchMeta: null, isInvalidated: false, status: r4 ? "success" : "pending", fetchStatus: "idle" };
        }(this.options), this.state = e3.state ?? this.#o, this.scheduleGc();
      }
      get meta() {
        return this.options.meta;
      }
      get promise() {
        return this.#u?.promise;
      }
      setOptions(e3) {
        this.options = { ...this.#c, ...e3 }, this.updateGcTime(this.options.gcTime);
      }
      optionalRemove() {
        this.observers.length || "idle" !== this.state.fetchStatus || this.#i.remove(this);
      }
      setData(e3, t3) {
        const r4 = replaceData(this.state.data, e3, this.options);
        return this.#h({ data: r4, type: "success", dataUpdatedAt: t3?.updatedAt, manual: t3?.manual }), r4;
      }
      setState(e3, t3) {
        this.#h({ type: "setState", state: e3, setStateOptions: t3 });
      }
      cancel(e3) {
        const t3 = this.#u?.promise;
        return this.#u?.cancel(e3), t3 ? t3.then(noop$6).catch(noop$6) : Promise.resolve();
      }
      destroy() {
        super.destroy(), this.cancel({ silent: true });
      }
      reset() {
        this.destroy(), this.setState(this.#o);
      }
      isActive() {
        return this.observers.some((e3) => {
          return false !== (t3 = e3.options.enabled, r4 = this, "function" == typeof t3 ? t3(r4) : t3);
          var t3, r4;
        });
      }
      isDisabled() {
        return this.getObserversCount() > 0 ? !this.isActive() : this.options.queryFn === h2 || this.state.dataUpdateCount + this.state.errorUpdateCount === 0;
      }
      isStatic() {
        return this.getObserversCount() > 0 && this.observers.some((e3) => "static" === resolveStaleTime(e3.options.staleTime, this));
      }
      isStale() {
        return this.getObserversCount() > 0 ? this.observers.some((e3) => e3.getCurrentResult().isStale) : void 0 === this.state.data || this.state.isInvalidated;
      }
      isStaleByTime(e3 = 0) {
        return void 0 === this.state.data || "static" !== e3 && (!!this.state.isInvalidated || !function(e4, t3) {
          return Math.max(e4 + (t3 || 0) - Date.now(), 0);
        }(this.state.dataUpdatedAt, e3));
      }
      onFocus() {
        const e3 = this.observers.find((e4) => e4.shouldFetchOnWindowFocus());
        e3?.refetch({ cancelRefetch: false }), this.#u?.continue();
      }
      onOnline() {
        const e3 = this.observers.find((e4) => e4.shouldFetchOnReconnect());
        e3?.refetch({ cancelRefetch: false }), this.#u?.continue();
      }
      addObserver(e3) {
        this.observers.includes(e3) || (this.observers.push(e3), this.clearGcTimeout(), this.#i.notify({ type: "observerAdded", query: this, observer: e3 }));
      }
      removeObserver(e3) {
        this.observers.includes(e3) && (this.observers = this.observers.filter((t3) => t3 !== e3), this.observers.length || (this.#u && (this.#d ? this.#u.cancel({ revert: true }) : this.#u.cancelRetry()), this.scheduleGc()), this.#i.notify({ type: "observerRemoved", query: this, observer: e3 }));
      }
      getObserversCount() {
        return this.observers.length;
      }
      invalidate() {
        this.state.isInvalidated || this.#h({ type: "invalidate" });
      }
      fetch(e3, t3) {
        if ("idle" !== this.state.fetchStatus) {
          if (void 0 !== this.state.data && t3?.cancelRefetch) this.cancel({ silent: true });
          else if (this.#u) return this.#u.continueRetry(), this.#u.promise;
        }
        if (e3 && this.setOptions(e3), !this.options.queryFn) {
          const e4 = this.observers.find((e5) => e5.options.queryFn);
          e4 && this.setOptions(e4.options);
        }
        const r4 = new AbortController(), addSignalProperty = /* @__PURE__ */ __name((e4) => {
          Object.defineProperty(e4, "signal", { enumerable: true, get: /* @__PURE__ */ __name(() => (this.#d = true, r4.signal), "get") });
        }, "addSignalProperty"), fetchFn = /* @__PURE__ */ __name(() => {
          const e4 = ensureQueryFn(this.options, t3), r5 = (() => {
            const e5 = { client: this.#l, queryKey: this.queryKey, meta: this.meta };
            return addSignalProperty(e5), e5;
          })();
          return this.#d = false, this.options.persister ? this.options.persister(e4, r5, this) : e4(r5);
        }, "fetchFn"), n3 = (() => {
          const e4 = { fetchOptions: t3, options: this.options, queryKey: this.queryKey, client: this.#l, state: this.state, fetchFn };
          return addSignalProperty(e4), e4;
        })();
        this.options.behavior?.onFetch(n3, this), this.#a = this.state, "idle" !== this.state.fetchStatus && this.state.fetchMeta === n3.fetchOptions?.meta || this.#h({ type: "fetch", meta: n3.fetchOptions?.meta });
        const onError2 = /* @__PURE__ */ __name((e4) => {
          isCancelledError(e4) && e4.silent || this.#h({ type: "error", error: e4 }), isCancelledError(e4) || (this.#i.config.onError?.(e4, this), this.#i.config.onSettled?.(this.state.data, e4, this)), this.scheduleGc();
        }, "onError");
        return this.#u = createRetryer({ initialPromise: t3?.initialPromise, fn: n3.fetchFn, abort: r4.abort.bind(r4), onSuccess: /* @__PURE__ */ __name((e4) => {
          if (void 0 !== e4) {
            try {
              this.setData(e4);
            } catch (e5) {
              return void onError2(e5);
            }
            this.#i.config.onSuccess?.(e4, this), this.#i.config.onSettled?.(e4, this.state.error, this), this.scheduleGc();
          } else onError2(new Error(`${this.queryHash} data is undefined`));
        }, "onSuccess"), onError: onError2, onFail: /* @__PURE__ */ __name((e4, t4) => {
          this.#h({ type: "failed", failureCount: e4, error: t4 });
        }, "onFail"), onPause: /* @__PURE__ */ __name(() => {
          this.#h({ type: "pause" });
        }, "onPause"), onContinue: /* @__PURE__ */ __name(() => {
          this.#h({ type: "continue" });
        }, "onContinue"), retry: n3.options.retry, retryDelay: n3.options.retryDelay, networkMode: n3.options.networkMode, canRun: /* @__PURE__ */ __name(() => true, "canRun") }), this.#u.start();
      }
      #h(e3) {
        this.state = ((t3) => {
          switch (e3.type) {
            case "failed":
              return { ...t3, fetchFailureCount: e3.failureCount, fetchFailureReason: e3.error };
            case "pause":
              return { ...t3, fetchStatus: "paused" };
            case "continue":
              return { ...t3, fetchStatus: "fetching" };
            case "fetch":
              return { ...t3, ...(r4 = t3.data, n3 = this.options, { fetchFailureCount: 0, fetchFailureReason: null, fetchStatus: canFetch(n3.networkMode) ? "fetching" : "paused", ...void 0 === r4 && { error: null, status: "pending" } }), fetchMeta: e3.meta ?? null };
            case "success":
              return this.#a = void 0, { ...t3, data: e3.data, dataUpdateCount: t3.dataUpdateCount + 1, dataUpdatedAt: e3.dataUpdatedAt ?? Date.now(), error: null, isInvalidated: false, status: "success", ...!e3.manual && { fetchStatus: "idle", fetchFailureCount: 0, fetchFailureReason: null } };
            case "error":
              const s4 = e3.error;
              return isCancelledError(s4) && s4.revert && this.#a ? { ...this.#a, fetchStatus: "idle" } : { ...t3, error: s4, errorUpdateCount: t3.errorUpdateCount + 1, errorUpdatedAt: Date.now(), fetchFailureCount: t3.fetchFailureCount + 1, fetchFailureReason: s4, fetchStatus: "idle", status: "error" };
            case "invalidate":
              return { ...t3, isInvalidated: true };
            case "setState":
              return { ...t3, ...e3.state };
          }
          var r4, n3;
        })(this.state), g2.batch(() => {
          this.observers.forEach((e4) => {
            e4.onQueryUpdate();
          }), this.#i.notify({ query: this, type: "updated", action: e3 });
        });
      }
    };
    b = class extends d2 {
      static {
        __name(this, "b");
      }
      constructor(e3 = {}) {
        super(), this.config = e3, this.#p = /* @__PURE__ */ new Map();
      }
      #p;
      build(e3, t3, r4) {
        const n3 = t3.queryKey, s4 = t3.queryHash ?? hashQueryKeyByOptions(n3, t3);
        let o5 = this.get(s4);
        return o5 || (o5 = new v({ client: e3, queryKey: n3, queryHash: s4, options: e3.defaultQueryOptions(t3), state: r4, defaultOptions: e3.getQueryDefaults(n3) }), this.add(o5)), o5;
      }
      add(e3) {
        this.#p.has(e3.queryHash) || (this.#p.set(e3.queryHash, e3), this.notify({ type: "added", query: e3 }));
      }
      remove(e3) {
        const t3 = this.#p.get(e3.queryHash);
        t3 && (e3.destroy(), t3 === e3 && this.#p.delete(e3.queryHash), this.notify({ type: "removed", query: e3 }));
      }
      clear() {
        g2.batch(() => {
          this.getAll().forEach((e3) => {
            this.remove(e3);
          });
        });
      }
      get(e3) {
        return this.#p.get(e3);
      }
      getAll() {
        return [...this.#p.values()];
      }
      find(e3) {
        const t3 = { exact: true, ...e3 };
        return this.getAll().find((e4) => matchQuery(t3, e4));
      }
      findAll(e3 = {}) {
        const t3 = this.getAll();
        return Object.keys(e3).length > 0 ? t3.filter((t4) => matchQuery(e3, t4)) : t3;
      }
      notify(e3) {
        g2.batch(() => {
          this.listeners.forEach((t3) => {
            t3(e3);
          });
        });
      }
      onFocus() {
        g2.batch(() => {
          this.getAll().forEach((e3) => {
            e3.onFocus();
          });
        });
      }
      onOnline() {
        g2.batch(() => {
          this.getAll().forEach((e3) => {
            e3.onOnline();
          });
        });
      }
    };
    S2 = class extends y {
      static {
        __name(this, "S");
      }
      #f;
      #m;
      #u;
      constructor(e3) {
        super(), this.mutationId = e3.mutationId, this.#m = e3.mutationCache, this.#f = [], this.state = e3.state || { context: void 0, data: void 0, error: null, failureCount: 0, failureReason: null, isPaused: false, status: "idle", variables: void 0, submittedAt: 0 }, this.setOptions(e3.options), this.scheduleGc();
      }
      setOptions(e3) {
        this.options = e3, this.updateGcTime(this.options.gcTime);
      }
      get meta() {
        return this.options.meta;
      }
      addObserver(e3) {
        this.#f.includes(e3) || (this.#f.push(e3), this.clearGcTimeout(), this.#m.notify({ type: "observerAdded", mutation: this, observer: e3 }));
      }
      removeObserver(e3) {
        this.#f = this.#f.filter((t3) => t3 !== e3), this.scheduleGc(), this.#m.notify({ type: "observerRemoved", mutation: this, observer: e3 });
      }
      optionalRemove() {
        this.#f.length || ("pending" === this.state.status ? this.scheduleGc() : this.#m.remove(this));
      }
      continue() {
        return this.#u?.continue() ?? this.execute(this.state.variables);
      }
      async execute(e3) {
        const onContinue = /* @__PURE__ */ __name(() => {
          this.#h({ type: "continue" });
        }, "onContinue");
        this.#u = createRetryer({ fn: /* @__PURE__ */ __name(() => this.options.mutationFn ? this.options.mutationFn(e3) : Promise.reject(new Error("No mutationFn found")), "fn"), onFail: /* @__PURE__ */ __name((e4, t4) => {
          this.#h({ type: "failed", failureCount: e4, error: t4 });
        }, "onFail"), onPause: /* @__PURE__ */ __name(() => {
          this.#h({ type: "pause" });
        }, "onPause"), onContinue, retry: this.options.retry ?? 0, retryDelay: this.options.retryDelay, networkMode: this.options.networkMode, canRun: /* @__PURE__ */ __name(() => this.#m.canRun(this), "canRun") });
        const t3 = "pending" === this.state.status, r4 = !this.#u.canStart();
        try {
          if (t3) onContinue();
          else {
            this.#h({ type: "pending", variables: e3, isPaused: r4 }), await this.#m.config.onMutate?.(e3, this);
            const t4 = await this.options.onMutate?.(e3);
            t4 !== this.state.context && this.#h({ type: "pending", context: t4, variables: e3, isPaused: r4 });
          }
          const n3 = await this.#u.start();
          return await this.#m.config.onSuccess?.(n3, e3, this.state.context, this), await this.options.onSuccess?.(n3, e3, this.state.context), await this.#m.config.onSettled?.(n3, null, this.state.variables, this.state.context, this), await this.options.onSettled?.(n3, null, e3, this.state.context), this.#h({ type: "success", data: n3 }), n3;
        } catch (t4) {
          try {
            throw await this.#m.config.onError?.(t4, e3, this.state.context, this), await this.options.onError?.(t4, e3, this.state.context), await this.#m.config.onSettled?.(void 0, t4, this.state.variables, this.state.context, this), await this.options.onSettled?.(void 0, t4, e3, this.state.context), t4;
          } finally {
            this.#h({ type: "error", error: t4 });
          }
        } finally {
          this.#m.runNext(this);
        }
      }
      #h(e3) {
        this.state = ((t3) => {
          switch (e3.type) {
            case "failed":
              return { ...t3, failureCount: e3.failureCount, failureReason: e3.error };
            case "pause":
              return { ...t3, isPaused: true };
            case "continue":
              return { ...t3, isPaused: false };
            case "pending":
              return { ...t3, context: e3.context, data: void 0, failureCount: 0, failureReason: null, error: null, isPaused: e3.isPaused, status: "pending", variables: e3.variables, submittedAt: Date.now() };
            case "success":
              return { ...t3, data: e3.data, failureCount: 0, failureReason: null, error: null, status: "success", isPaused: false };
            case "error":
              return { ...t3, data: void 0, error: e3.error, failureCount: t3.failureCount + 1, failureReason: e3.error, isPaused: false, status: "error" };
          }
        })(this.state), g2.batch(() => {
          this.#f.forEach((t3) => {
            t3.onMutationUpdate(e3);
          }), this.#m.notify({ mutation: this, type: "updated", action: e3 });
        });
      }
    };
    k2 = class extends d2 {
      static {
        __name(this, "k");
      }
      constructor(e3 = {}) {
        super(), this.config = e3, this.#g = /* @__PURE__ */ new Set(), this.#y = /* @__PURE__ */ new Map(), this.#v = 0;
      }
      #g;
      #y;
      #v;
      build(e3, t3, r4) {
        const n3 = new S2({ mutationCache: this, mutationId: ++this.#v, options: e3.defaultMutationOptions(t3), state: r4 });
        return this.add(n3), n3;
      }
      add(e3) {
        this.#g.add(e3);
        const t3 = scopeFor(e3);
        if ("string" == typeof t3) {
          const r4 = this.#y.get(t3);
          r4 ? r4.push(e3) : this.#y.set(t3, [e3]);
        }
        this.notify({ type: "added", mutation: e3 });
      }
      remove(e3) {
        if (this.#g.delete(e3)) {
          const t3 = scopeFor(e3);
          if ("string" == typeof t3) {
            const r4 = this.#y.get(t3);
            if (r4) if (r4.length > 1) {
              const t4 = r4.indexOf(e3);
              -1 !== t4 && r4.splice(t4, 1);
            } else r4[0] === e3 && this.#y.delete(t3);
          }
        }
        this.notify({ type: "removed", mutation: e3 });
      }
      canRun(e3) {
        const t3 = scopeFor(e3);
        if ("string" == typeof t3) {
          const r4 = this.#y.get(t3), n3 = r4?.find((e4) => "pending" === e4.state.status);
          return !n3 || n3 === e3;
        }
        return true;
      }
      runNext(e3) {
        const t3 = scopeFor(e3);
        if ("string" == typeof t3) {
          const r4 = this.#y.get(t3)?.find((t4) => t4 !== e3 && t4.state.isPaused);
          return r4?.continue() ?? Promise.resolve();
        }
        return Promise.resolve();
      }
      clear() {
        g2.batch(() => {
          this.#g.forEach((e3) => {
            this.notify({ type: "removed", mutation: e3 });
          }), this.#g.clear(), this.#y.clear();
        });
      }
      getAll() {
        return Array.from(this.#g);
      }
      find(e3) {
        const t3 = { exact: true, ...e3 };
        return this.getAll().find((e4) => matchMutation(t3, e4));
      }
      findAll(e3 = {}) {
        return this.getAll().filter((t3) => matchMutation(e3, t3));
      }
      notify(e3) {
        g2.batch(() => {
          this.listeners.forEach((t3) => {
            t3(e3);
          });
        });
      }
      resumePausedMutations() {
        const e3 = this.getAll().filter((e4) => e4.state.isPaused);
        return g2.batch(() => Promise.all(e3.map((e4) => e4.continue().catch(noop$6))));
      }
    };
    __name(scopeFor, "scopeFor");
    __name(infiniteQueryBehavior, "infiniteQueryBehavior");
    __name(getNextPageParam, "getNextPageParam");
    __name(getPreviousPageParam, "getPreviousPageParam");
    w2 = class {
      static {
        __name(this, "w");
      }
      #b;
      #m;
      #c;
      #S;
      #k;
      #w;
      #C;
      #x;
      constructor(e3 = {}) {
        this.#b = e3.queryCache || new b(), this.#m = e3.mutationCache || new k2(), this.#c = e3.defaultOptions || {}, this.#S = /* @__PURE__ */ new Map(), this.#k = /* @__PURE__ */ new Map(), this.#w = 0;
      }
      mount() {
        this.#w++, 1 === this.#w && (this.#C = p2.subscribe(async (e3) => {
          e3 && (await this.resumePausedMutations(), this.#b.onFocus());
        }), this.#x = f2.subscribe(async (e3) => {
          e3 && (await this.resumePausedMutations(), this.#b.onOnline());
        }));
      }
      unmount() {
        this.#w--, 0 === this.#w && (this.#C?.(), this.#C = void 0, this.#x?.(), this.#x = void 0);
      }
      isFetching(e3) {
        return this.#b.findAll({ ...e3, fetchStatus: "fetching" }).length;
      }
      isMutating(e3) {
        return this.#m.findAll({ ...e3, status: "pending" }).length;
      }
      getQueryData(e3) {
        const t3 = this.defaultQueryOptions({ queryKey: e3 });
        return this.#b.get(t3.queryHash)?.state.data;
      }
      ensureQueryData(e3) {
        const t3 = this.defaultQueryOptions(e3), r4 = this.#b.build(this, t3), n3 = r4.state.data;
        return void 0 === n3 ? this.fetchQuery(e3) : (e3.revalidateIfStale && r4.isStaleByTime(resolveStaleTime(t3.staleTime, r4)) && this.prefetchQuery(t3), Promise.resolve(n3));
      }
      getQueriesData(e3) {
        return this.#b.findAll(e3).map(({ queryKey: e4, state: t3 }) => [e4, t3.data]);
      }
      setQueryData(e3, t3, r4) {
        const n3 = this.defaultQueryOptions({ queryKey: e3 }), s4 = this.#b.get(n3.queryHash), o5 = s4?.state.data, a5 = function(e4, t4) {
          return "function" == typeof e4 ? e4(t4) : e4;
        }(t3, o5);
        if (void 0 !== a5) return this.#b.build(this, n3).setData(a5, { ...r4, manual: true });
      }
      setQueriesData(e3, t3, r4) {
        return g2.batch(() => this.#b.findAll(e3).map(({ queryKey: e4 }) => [e4, this.setQueryData(e4, t3, r4)]));
      }
      getQueryState(e3) {
        const t3 = this.defaultQueryOptions({ queryKey: e3 });
        return this.#b.get(t3.queryHash)?.state;
      }
      removeQueries(e3) {
        const t3 = this.#b;
        g2.batch(() => {
          t3.findAll(e3).forEach((e4) => {
            t3.remove(e4);
          });
        });
      }
      resetQueries(e3, t3) {
        const r4 = this.#b;
        return g2.batch(() => (r4.findAll(e3).forEach((e4) => {
          e4.reset();
        }), this.refetchQueries({ type: "active", ...e3 }, t3)));
      }
      cancelQueries(e3, t3 = {}) {
        const r4 = { revert: true, ...t3 }, n3 = g2.batch(() => this.#b.findAll(e3).map((e4) => e4.cancel(r4)));
        return Promise.all(n3).then(noop$6).catch(noop$6);
      }
      invalidateQueries(e3, t3 = {}) {
        return g2.batch(() => (this.#b.findAll(e3).forEach((e4) => {
          e4.invalidate();
        }), "none" === e3?.refetchType ? Promise.resolve() : this.refetchQueries({ ...e3, type: e3?.refetchType ?? e3?.type ?? "active" }, t3)));
      }
      refetchQueries(e3, t3 = {}) {
        const r4 = { ...t3, cancelRefetch: t3.cancelRefetch ?? true }, n3 = g2.batch(() => this.#b.findAll(e3).filter((e4) => !e4.isDisabled() && !e4.isStatic()).map((e4) => {
          let t4 = e4.fetch(void 0, r4);
          return r4.throwOnError || (t4 = t4.catch(noop$6)), "paused" === e4.state.fetchStatus ? Promise.resolve() : t4;
        }));
        return Promise.all(n3).then(noop$6);
      }
      fetchQuery(e3) {
        const t3 = this.defaultQueryOptions(e3);
        void 0 === t3.retry && (t3.retry = false);
        const r4 = this.#b.build(this, t3);
        return r4.isStaleByTime(resolveStaleTime(t3.staleTime, r4)) ? r4.fetch(t3) : Promise.resolve(r4.state.data);
      }
      prefetchQuery(e3) {
        return this.fetchQuery(e3).then(noop$6).catch(noop$6);
      }
      fetchInfiniteQuery(e3) {
        return e3.behavior = infiniteQueryBehavior(e3.pages), this.fetchQuery(e3);
      }
      prefetchInfiniteQuery(e3) {
        return this.fetchInfiniteQuery(e3).then(noop$6).catch(noop$6);
      }
      ensureInfiniteQueryData(e3) {
        return e3.behavior = infiniteQueryBehavior(e3.pages), this.ensureQueryData(e3);
      }
      resumePausedMutations() {
        return f2.isOnline() ? this.#m.resumePausedMutations() : Promise.resolve();
      }
      getQueryCache() {
        return this.#b;
      }
      getMutationCache() {
        return this.#m;
      }
      getDefaultOptions() {
        return this.#c;
      }
      setDefaultOptions(e3) {
        this.#c = e3;
      }
      setQueryDefaults(e3, t3) {
        this.#S.set(hashKey(e3), { queryKey: e3, defaultOptions: t3 });
      }
      getQueryDefaults(e3) {
        const t3 = [...this.#S.values()], r4 = {};
        return t3.forEach((t4) => {
          partialMatchKey(e3, t4.queryKey) && Object.assign(r4, t4.defaultOptions);
        }), r4;
      }
      setMutationDefaults(e3, t3) {
        this.#k.set(hashKey(e3), { mutationKey: e3, defaultOptions: t3 });
      }
      getMutationDefaults(e3) {
        const t3 = [...this.#k.values()], r4 = {};
        return t3.forEach((t4) => {
          partialMatchKey(e3, t4.mutationKey) && Object.assign(r4, t4.defaultOptions);
        }), r4;
      }
      defaultQueryOptions(e3) {
        if (e3._defaulted) return e3;
        const t3 = { ...this.#c.queries, ...this.getQueryDefaults(e3.queryKey), ...e3, _defaulted: true };
        return t3.queryHash || (t3.queryHash = hashQueryKeyByOptions(t3.queryKey, t3)), void 0 === t3.refetchOnReconnect && (t3.refetchOnReconnect = "always" !== t3.networkMode), void 0 === t3.throwOnError && (t3.throwOnError = !!t3.suspense), !t3.networkMode && t3.persister && (t3.networkMode = "offlineFirst"), t3.queryFn === h2 && (t3.enabled = false), t3;
      }
      defaultMutationOptions(e3) {
        return e3?._defaulted ? e3 : { ...this.#c.mutations, ...e3?.mutationKey && this.getMutationDefaults(e3.mutationKey), ...e3, _defaulted: true };
      }
      clear() {
        this.#b.clear(), this.#m.clear();
      }
    };
    __name(defaultTransformerFn, "defaultTransformerFn");
    __name(dehydrateMutation, "dehydrateMutation");
    __name(dehydrateQuery, "dehydrateQuery");
    __name(defaultShouldDehydrateMutation, "defaultShouldDehydrateMutation");
    __name(defaultShouldDehydrateQuery, "defaultShouldDehydrateQuery");
    __name(defaultShouldRedactErrors, "defaultShouldRedactErrors");
    __name(dehydrate, "dehydrate");
    __name(hydrate, "hydrate");
    C2 = { exports: {} };
    x = {};
    P2 = Symbol.for("react.transitional.element");
    R2 = Symbol.for("react.portal");
    T2 = Symbol.for("react.fragment");
    $ = Symbol.for("react.strict_mode");
    E2 = Symbol.for("react.profiler");
    F2 = Symbol.for("react.consumer");
    I2 = Symbol.for("react.context");
    A2 = Symbol.for("react.forward_ref");
    _ = Symbol.for("react.suspense");
    M = Symbol.for("react.memo");
    O2 = Symbol.for("react.lazy");
    N2 = Symbol.iterator;
    j = { isMounted: /* @__PURE__ */ __name(function() {
      return false;
    }, "isMounted"), enqueueForceUpdate: /* @__PURE__ */ __name(function() {
    }, "enqueueForceUpdate"), enqueueReplaceState: /* @__PURE__ */ __name(function() {
    }, "enqueueReplaceState"), enqueueSetState: /* @__PURE__ */ __name(function() {
    }, "enqueueSetState") };
    L2 = Object.assign;
    D2 = {};
    __name(Component, "Component");
    __name(ComponentDummy, "ComponentDummy");
    __name(PureComponent, "PureComponent");
    Component.prototype.isReactComponent = {}, Component.prototype.setState = function(e3, t3) {
      if ("object" != typeof e3 && "function" != typeof e3 && null != e3) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, e3, t3, "setState");
    }, Component.prototype.forceUpdate = function(e3) {
      this.updater.enqueueForceUpdate(this, e3, "forceUpdate");
    }, ComponentDummy.prototype = Component.prototype;
    B = PureComponent.prototype = new ComponentDummy();
    B.constructor = PureComponent, L2(B, Component.prototype), B.isPureReactComponent = true;
    H = Array.isArray;
    z = { H: null, A: null, T: null, S: null, V: null };
    q = Object.prototype.hasOwnProperty;
    __name(ReactElement, "ReactElement");
    __name(isValidElement, "isValidElement");
    U2 = /\/+/g;
    __name(getElementKey, "getElementKey");
    __name(noop$1$2, "noop$1$2");
    __name(mapIntoArray, "mapIntoArray");
    __name(mapChildren, "mapChildren");
    __name(lazyInitializer, "lazyInitializer");
    V2 = "function" == typeof reportError ? reportError : function(t3) {
      "object" != typeof g || "function" != typeof g.emit ? console.error(t3) : g.emit("uncaughtException", t3);
    };
    __name(noop$5, "noop$5");
    x.Children = { map: mapChildren, forEach: /* @__PURE__ */ __name(function(e3, t3, r4) {
      mapChildren(e3, function() {
        t3.apply(this, arguments);
      }, r4);
    }, "forEach"), count: /* @__PURE__ */ __name(function(e3) {
      var t3 = 0;
      return mapChildren(e3, function() {
        t3++;
      }), t3;
    }, "count"), toArray: /* @__PURE__ */ __name(function(e3) {
      return mapChildren(e3, function(e4) {
        return e4;
      }) || [];
    }, "toArray"), only: /* @__PURE__ */ __name(function(e3) {
      if (!isValidElement(e3)) throw Error("React.Children.only expected to receive a single React element child.");
      return e3;
    }, "only") }, x.Component = Component, x.Fragment = T2, x.Profiler = E2, x.PureComponent = PureComponent, x.StrictMode = $, x.Suspense = _, x.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = z, x.__COMPILER_RUNTIME = { __proto__: null, c: /* @__PURE__ */ __name(function(e3) {
      return z.H.useMemoCache(e3);
    }, "c") }, x.cache = function(e3) {
      return function() {
        return e3.apply(null, arguments);
      };
    }, x.cloneElement = function(e3, t3, r4) {
      if (null == e3) throw Error("The argument must be a React element, but you passed " + e3 + ".");
      var n3 = L2({}, e3.props), s4 = e3.key;
      if (null != t3) for (o5 in void 0 !== t3.ref && void 0, void 0 !== t3.key && (s4 = "" + t3.key), t3) !q.call(t3, o5) || "key" === o5 || "__self" === o5 || "__source" === o5 || "ref" === o5 && void 0 === t3.ref || (n3[o5] = t3[o5]);
      var o5 = arguments.length - 2;
      if (1 === o5) n3.children = r4;
      else if (1 < o5) {
        for (var a5 = Array(o5), i5 = 0; i5 < o5; i5++) a5[i5] = arguments[i5 + 2];
        n3.children = a5;
      }
      return ReactElement(e3.type, s4, void 0, 0, 0, n3);
    }, x.createContext = function(e3) {
      return (e3 = { $$typeof: I2, _currentValue: e3, _currentValue2: e3, _threadCount: 0, Provider: null, Consumer: null }).Provider = e3, e3.Consumer = { $$typeof: F2, _context: e3 }, e3;
    }, x.createElement = function(e3, t3, r4) {
      var n3, s4 = {}, o5 = null;
      if (null != t3) for (n3 in void 0 !== t3.key && (o5 = "" + t3.key), t3) q.call(t3, n3) && "key" !== n3 && "__self" !== n3 && "__source" !== n3 && (s4[n3] = t3[n3]);
      var a5 = arguments.length - 2;
      if (1 === a5) s4.children = r4;
      else if (1 < a5) {
        for (var i5 = Array(a5), l4 = 0; l4 < a5; l4++) i5[l4] = arguments[l4 + 2];
        s4.children = i5;
      }
      if (e3 && e3.defaultProps) for (n3 in a5 = e3.defaultProps) void 0 === s4[n3] && (s4[n3] = a5[n3]);
      return ReactElement(e3, o5, void 0, 0, 0, s4);
    }, x.createRef = function() {
      return { current: null };
    }, x.forwardRef = function(e3) {
      return { $$typeof: A2, render: e3 };
    }, x.isValidElement = isValidElement, x.lazy = function(e3) {
      return { $$typeof: O2, _payload: { _status: -1, _result: e3 }, _init: lazyInitializer };
    }, x.memo = function(e3, t3) {
      return { $$typeof: M, type: e3, compare: void 0 === t3 ? null : t3 };
    }, x.startTransition = function(e3) {
      var t3 = z.T, r4 = {};
      z.T = r4;
      try {
        var n3 = e3(), s4 = z.S;
        null !== s4 && s4(r4, n3), "object" == typeof n3 && null !== n3 && "function" == typeof n3.then && n3.then(noop$5, V2);
      } catch (e4) {
        V2(e4);
      } finally {
        z.T = t3;
      }
    }, x.unstable_useCacheRefresh = function() {
      return z.H.useCacheRefresh();
    }, x.use = function(e3) {
      return z.H.use(e3);
    }, x.useActionState = function(e3, t3, r4) {
      return z.H.useActionState(e3, t3, r4);
    }, x.useCallback = function(e3, t3) {
      return z.H.useCallback(e3, t3);
    }, x.useContext = function(e3) {
      return z.H.useContext(e3);
    }, x.useDebugValue = function() {
    }, x.useDeferredValue = function(e3, t3) {
      return z.H.useDeferredValue(e3, t3);
    }, x.useEffect = function(e3, t3, r4) {
      var n3 = z.H;
      if ("function" == typeof r4) throw Error("useEffect CRUD overload is not enabled in this build of React.");
      return n3.useEffect(e3, t3);
    }, x.useId = function() {
      return z.H.useId();
    }, x.useImperativeHandle = function(e3, t3, r4) {
      return z.H.useImperativeHandle(e3, t3, r4);
    }, x.useInsertionEffect = function(e3, t3) {
      return z.H.useInsertionEffect(e3, t3);
    }, x.useLayoutEffect = function(e3, t3) {
      return z.H.useLayoutEffect(e3, t3);
    }, x.useMemo = function(e3, t3) {
      return z.H.useMemo(e3, t3);
    }, x.useOptimistic = function(e3, t3) {
      return z.H.useOptimistic(e3, t3);
    }, x.useReducer = function(e3, t3, r4) {
      return z.H.useReducer(e3, t3, r4);
    }, x.useRef = function(e3) {
      return z.H.useRef(e3);
    }, x.useState = function(e3) {
      return z.H.useState(e3);
    }, x.useSyncExternalStore = function(e3, t3, r4) {
      return z.H.useSyncExternalStore(e3, t3, r4);
    }, x.useTransition = function() {
      return z.H.useTransition();
    }, x.version = "19.1.0", C2.exports = x;
    W2 = C2.exports;
    K2 = getDefaultExportFromCjs(W2);
    Q = { exports: {} };
    G = {};
    J = Symbol.for("react.transitional.element");
    Y2 = Symbol.for("react.fragment");
    __name(jsxProd, "jsxProd");
    G.Fragment = Y2, G.jsx = jsxProd, G.jsxs = jsxProd, Q.exports = G;
    X2 = Q.exports;
    Z = W2.createContext(void 0);
    QueryClientProvider = /* @__PURE__ */ __name(({ client: e3, children: t3 }) => (W2.useEffect(() => (e3.mount(), () => {
      e3.unmount();
    }), [e3]), X2.jsx(Z.Provider, { value: e3, children: t3 })), "QueryClientProvider");
    __name(invariant$1, "invariant$1");
    ee = getDefaultExportFromCjs(function(e3, t3) {
    });
    te = /* @__PURE__ */ new WeakMap();
    re = /* @__PURE__ */ new WeakMap();
    ne = { current: [] };
    se = false;
    oe = 0;
    ae = /* @__PURE__ */ new Set();
    ie = /* @__PURE__ */ new Map();
    __name(__flush_internals, "__flush_internals");
    __name(__notifyListeners, "__notifyListeners");
    __name(__notifyDerivedListeners, "__notifyDerivedListeners");
    __name(__flush, "__flush");
    __name(batch, "batch");
    Store = class {
      static {
        __name(this, "Store");
      }
      constructor(e3, t3) {
        this.listeners = /* @__PURE__ */ new Set(), this.subscribe = (e4) => {
          var t4, r4;
          this.listeners.add(e4);
          const n3 = null == (r4 = null == (t4 = this.options) ? void 0 : t4.onSubscribe) ? void 0 : r4.call(t4, e4, this);
          return () => {
            this.listeners.delete(e4), null == n3 || n3();
          };
        }, this.prevState = e3, this.state = e3, this.options = t3;
      }
      setState(e3) {
        var t3, r4, n3;
        this.prevState = this.state, (null == (t3 = this.options) ? void 0 : t3.updateFn) ? this.state = this.options.updateFn(this.prevState)(e3) : !/* @__PURE__ */ function(e4) {
          return "function" == typeof e4;
        }(e3) ? this.state = e3 : this.state = e3(this.prevState), null == (n3 = null == (r4 = this.options) ? void 0 : r4.onUpdate) || n3.call(r4), __flush(this);
      }
    };
    Derived = class _Derived {
      static {
        __name(this, "Derived");
      }
      constructor(e3) {
        this.listeners = /* @__PURE__ */ new Set(), this._subscriptions = [], this.lastSeenDepValues = [], this.getDepVals = () => {
          const e4 = [], t3 = [];
          for (const r4 of this.options.deps) e4.push(r4.prevState), t3.push(r4.state);
          return this.lastSeenDepValues = t3, { prevDepVals: e4, currDepVals: t3, prevVal: this.prevState ?? void 0 };
        }, this.recompute = () => {
          var e4, t3;
          this.prevState = this.state;
          const { prevDepVals: r4, currDepVals: n3, prevVal: s4 } = this.getDepVals();
          this.state = this.options.fn({ prevDepVals: r4, currDepVals: n3, prevVal: s4 }), null == (t3 = (e4 = this.options).onUpdate) || t3.call(e4);
        }, this.checkIfRecalculationNeededDeeply = () => {
          for (const e5 of this.options.deps) e5 instanceof _Derived && e5.checkIfRecalculationNeededDeeply();
          let e4 = false;
          const t3 = this.lastSeenDepValues, { currDepVals: r4 } = this.getDepVals();
          for (let n3 = 0; n3 < r4.length; n3++) if (r4[n3] !== t3[n3]) {
            e4 = true;
            break;
          }
          e4 && this.recompute();
        }, this.mount = () => (this.registerOnGraph(), this.checkIfRecalculationNeededDeeply(), () => {
          this.unregisterFromGraph();
          for (const e4 of this._subscriptions) e4();
        }), this.subscribe = (e4) => {
          var t3, r4;
          this.listeners.add(e4);
          const n3 = null == (r4 = (t3 = this.options).onSubscribe) ? void 0 : r4.call(t3, e4, this);
          return () => {
            this.listeners.delete(e4), null == n3 || n3();
          };
        }, this.options = e3, this.state = e3.fn({ prevDepVals: void 0, prevVal: void 0, currDepVals: this.getDepVals().currDepVals });
      }
      registerOnGraph(e3 = this.options.deps) {
        for (const t3 of e3) if (t3 instanceof _Derived) t3.registerOnGraph(), this.registerOnGraph(t3.options.deps);
        else if (t3 instanceof Store) {
          let e4 = te.get(t3);
          e4 || (e4 = /* @__PURE__ */ new Set(), te.set(t3, e4)), e4.add(this);
          let r4 = re.get(this);
          r4 || (r4 = /* @__PURE__ */ new Set(), re.set(this, r4)), r4.add(t3);
        }
      }
      unregisterFromGraph(e3 = this.options.deps) {
        for (const t3 of e3) if (t3 instanceof _Derived) this.unregisterFromGraph(t3.options.deps);
        else if (t3 instanceof Store) {
          const e4 = te.get(t3);
          e4 && e4.delete(this);
          const r4 = re.get(this);
          r4 && r4.delete(t3);
        }
      }
    };
    le = "__TSR_index";
    ue = "popstate";
    ce = "beforeunload";
    __name(createHistory$1, "createHistory$1");
    __name(assignKeyAndIndex$1, "assignKeyAndIndex$1");
    __name(parseHref$1, "parseHref$1");
    __name(createRandomKey$1, "createRandomKey$1");
    __name(last, "last");
    __name(functionalUpdate, "functionalUpdate");
    __name(pick, "pick");
    __name(replaceEqualDeep, "replaceEqualDeep");
    __name(isSimplePlainObject, "isSimplePlainObject");
    __name(isPlainObject$1, "isPlainObject$1");
    __name(hasObjectPrototype$1, "hasObjectPrototype$1");
    __name(isPlainArray, "isPlainArray");
    __name(getObjectKeys, "getObjectKeys");
    __name(deepEqual, "deepEqual");
    __name(createControlledPromise$1, "createControlledPromise$1");
    __name(joinPaths$1, "joinPaths$1");
    __name(cleanPath$1, "cleanPath$1");
    __name(trimPathLeft$1, "trimPathLeft$1");
    __name(trimPathRight$1, "trimPathRight$1");
    __name(trimPath$1, "trimPath$1");
    __name(removeTrailingSlash, "removeTrailingSlash");
    de = /^\$.{1,}$/;
    he = /^(.*?)\{(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/;
    pe = /^\$$/;
    fe = /^(.*?)\{\$\}(.*)$/;
    __name(parsePathname$1, "parsePathname$1");
    __name(interpolatePath, "interpolatePath");
    __name(matchPathname$1, "matchPathname$1");
    __name(removeBasepath$1, "removeBasepath$1");
    __name(isNotFound$1, "isNotFound$1");
    me = "tsr-scroll-restoration-v1_3";
    ge = function() {
      const e3 = void 0;
      if (!e3) return;
      const t3 = e3.getItem(me);
      let r4 = t3 ? JSON.parse(t3) : {};
      return { state: r4, set: /* @__PURE__ */ __name((t4) => (r4 = functionalUpdate(t4, r4) || r4, e3.setItem(me, JSON.stringify(r4))), "set") };
    }();
    defaultGetScrollRestorationKey = /* @__PURE__ */ __name((e3) => e3.state.__TSR_key || e3.href, "defaultGetScrollRestorationKey");
    ye = false;
    __name(restoreScroll, "restoreScroll");
    __name(setupScrollRestoration, "setupScrollRestoration");
    __name(toValue, "toValue");
    ve = (be = JSON.parse, (e3) => {
      "?" === e3.substring(0, 1) && (e3 = e3.substring(1));
      const t3 = [...new URLSearchParams(e3).entries()].reduce((e4, [t4, r4]) => {
        const n3 = e4[t4];
        return e4[t4] = null == n3 ? toValue(r4) : Array.isArray(n3) ? [...n3, toValue(r4)] : [n3, toValue(r4)], e4;
      }, {});
      for (const e4 in t3) {
        const r4 = t3[e4];
        if ("string" == typeof r4) try {
          t3[e4] = be(r4);
        } catch (e5) {
        }
      }
      return t3;
    });
    Se = /* @__PURE__ */ function(e3, t3) {
      return (r4) => {
        r4 = { ...r4 }, Object.keys(r4).forEach((n4) => {
          const s4 = r4[n4];
          void 0 === s4 || void 0 === s4 ? delete r4[n4] : r4[n4] = function(r5) {
            if ("object" == typeof r5 && null !== r5) try {
              return e3(r5);
            } catch (e4) {
            }
            else if ("string" == typeof r5 && "function" == typeof t3) try {
              return t3(r5), e3(r5);
            } catch (e4) {
            }
            return r5;
          }(s4);
        });
        const n3 = function(e4) {
          const t4 = Object.entries(e4).flatMap(([e5, t5]) => Array.isArray(t5) ? t5.map((t6) => [e5, String(t6)]) : [[e5, String(t5)]]);
          return "" + new URLSearchParams(t4).toString();
        }(r4).toString();
        return n3 ? `?${n3}` : "";
      };
    }(JSON.stringify, JSON.parse);
    ke = "__root__";
    __name(isRedirect$1, "isRedirect$1");
    __name(getLocationChangeInfo, "getLocationChangeInfo");
    RouterCore = class {
      static {
        __name(this, "RouterCore");
      }
      constructor(e3) {
        this.tempLocationKey = `${Math.round(1e7 * Math.random())}`, this.resetNextScroll = true, this.shouldViewTransition = void 0, this.isViewTransitionTypesSupported = void 0, this.subscribers = /* @__PURE__ */ new Set(), this.isScrollRestoring = false, this.isScrollRestorationSetup = false, this.startTransition = (e4) => e4(), this.update = (e4) => {
          e4.notFoundRoute && console.warn("The notFoundRoute API is deprecated and will be removed in the next major version. See https://tanstack.com/router/v1/docs/framework/react/guide/not-found-errors#migrating-from-notfoundroute for more info.");
          const t3 = this.options;
          this.options = { ...this.options, ...e4 }, this.isServer = this.options.isServer ?? "undefined" == typeof document, this.pathParamsDecodeCharMap = this.options.pathParamsAllowedCharacters ? new Map(this.options.pathParamsAllowedCharacters.map((e5) => [encodeURIComponent(e5), e5])) : void 0, (!this.basepath || e4.basepath && e4.basepath !== t3.basepath) && (void 0 === e4.basepath || "" === e4.basepath || "/" === e4.basepath ? this.basepath = "/" : this.basepath = `/${trimPath$1(e4.basepath)}`), (!this.history || this.options.history && this.options.history !== this.history) && (this.history = this.options.history ?? (this.isServer ? function(e5 = { initialEntries: ["/"] }) {
            const t4 = e5.initialEntries;
            let r4 = e5.initialIndex ? Math.min(Math.max(e5.initialIndex, 0), t4.length - 1) : t4.length - 1;
            const n3 = t4.map((e6, t5) => assignKeyAndIndex$1(t5, void 0));
            return createHistory$1({ getLocation: /* @__PURE__ */ __name(() => parseHref$1(t4[r4], n3[r4]), "getLocation"), getLength: /* @__PURE__ */ __name(() => t4.length, "getLength"), pushState: /* @__PURE__ */ __name((e6, s4) => {
              r4 < t4.length - 1 && (t4.splice(r4 + 1), n3.splice(r4 + 1)), n3.push(s4), t4.push(e6), r4 = Math.max(t4.length - 1, 0);
            }, "pushState"), replaceState: /* @__PURE__ */ __name((e6, s4) => {
              n3[r4] = s4, t4[r4] = e6;
            }, "replaceState"), back: /* @__PURE__ */ __name(() => {
              r4 = Math.max(r4 - 1, 0);
            }, "back"), forward: /* @__PURE__ */ __name(() => {
              r4 = Math.min(r4 + 1, t4.length - 1);
            }, "forward"), go: /* @__PURE__ */ __name((e6) => {
              r4 = Math.min(Math.max(r4 + e6, 0), t4.length - 1);
            }, "go"), createHref: /* @__PURE__ */ __name((e6) => e6, "createHref") });
          }({ initialEntries: [this.basepath || "/"] }) : function() {
            var e5, t4;
            const r4 = "undefined" != typeof document ? window : void 0, n3 = r4.history.pushState, s4 = r4.history.replaceState;
            let o5 = [];
            const _getBlockers = /* @__PURE__ */ __name(() => o5, "_getBlockers"), parseLocation = /* @__PURE__ */ __name(() => parseHref$1(`${r4.location.pathname}${r4.location.search}${r4.location.hash}`, r4.history.state), "parseLocation");
            if (!(null == (e5 = r4.history.state) ? void 0 : e5.__TSR_key) && !(null == (t4 = r4.history.state) ? void 0 : t4.key)) {
              const e6 = createRandomKey$1();
              r4.history.replaceState({ [le]: 0, key: e6, __TSR_key: e6 }, "");
            }
            let a5, i5, l4, u4 = parseLocation(), c4 = false, d4 = false, h4 = false, p4 = false;
            const flush = /* @__PURE__ */ __name(() => {
              i5 && (f4._ignoreSubscribers = true, (i5.isPush ? r4.history.pushState : r4.history.replaceState)(i5.state, "", i5.href), f4._ignoreSubscribers = false, i5 = void 0, l4 = void 0, a5 = void 0);
            }, "flush"), queueHistoryAction = /* @__PURE__ */ __name((e6, t5, r5) => {
              const n4 = t5;
              l4 || (a5 = u4), u4 = parseHref$1(t5, r5), i5 = { href: n4, state: r5, isPush: (null == i5 ? void 0 : i5.isPush) || "push" === e6 }, l4 || (l4 = Promise.resolve().then(() => flush()));
            }, "queueHistoryAction"), onPushPop = /* @__PURE__ */ __name((e6) => {
              u4 = parseLocation(), f4.notify({ type: e6 });
            }, "onPushPop"), onPushPopEvent = /* @__PURE__ */ __name(async () => {
              if (d4) return void (d4 = false);
              const e6 = parseLocation(), t5 = e6.state[le] - u4.state[le], n4 = -1 === t5, s5 = !(1 === t5) && !n4 || c4;
              c4 = false;
              const o6 = s5 ? "GO" : n4 ? "BACK" : "FORWARD", a6 = s5 ? { type: "GO", index: t5 } : { type: n4 ? "BACK" : "FORWARD" };
              if (h4) h4 = false;
              else {
                const t6 = _getBlockers();
                if ("undefined" != typeof document && t6.length) {
                  for (const n5 of t6) if (await n5.blockerFn({ currentLocation: u4, nextLocation: e6, action: o6 })) return d4 = true, r4.history.go(1), void f4.notify(a6);
                }
              }
              u4 = parseLocation(), f4.notify(a6);
            }, "onPushPopEvent"), onBeforeUnload = /* @__PURE__ */ __name((e6) => {
              if (p4) return void (p4 = false);
              let t5 = false;
              const r5 = _getBlockers();
              if ("undefined" != typeof document && r5.length) for (const e7 of r5) {
                const r6 = e7.enableBeforeUnload ?? true;
                if (true === r6) {
                  t5 = true;
                  break;
                }
                if ("function" == typeof r6 && true === r6()) {
                  t5 = true;
                  break;
                }
              }
              return t5 ? (e6.preventDefault(), e6.returnValue = "") : void 0;
            }, "onBeforeUnload"), f4 = createHistory$1({ getLocation: /* @__PURE__ */ __name(() => u4, "getLocation"), getLength: /* @__PURE__ */ __name(() => r4.history.length, "getLength"), pushState: /* @__PURE__ */ __name((e6, t5) => queueHistoryAction("push", e6, t5), "pushState"), replaceState: /* @__PURE__ */ __name((e6, t5) => queueHistoryAction("replace", e6, t5), "replaceState"), back: /* @__PURE__ */ __name((e6) => (e6 && (h4 = true), p4 = true, r4.history.back()), "back"), forward: /* @__PURE__ */ __name((e6) => {
              e6 && (h4 = true), p4 = true, r4.history.forward();
            }, "forward"), go: /* @__PURE__ */ __name((e6) => {
              c4 = true, r4.history.go(e6);
            }, "go"), createHref: /* @__PURE__ */ __name((e6) => e6, "createHref"), flush, destroy: /* @__PURE__ */ __name(() => {
              r4.history.pushState = n3, r4.history.replaceState = s4, r4.removeEventListener(ce, onBeforeUnload, { capture: true }), r4.removeEventListener(ue, onPushPopEvent);
            }, "destroy"), onBlocked: /* @__PURE__ */ __name(() => {
              a5 && u4 !== a5 && (u4 = a5);
            }, "onBlocked"), getBlockers: _getBlockers, setBlockers: /* @__PURE__ */ __name((e6) => o5 = e6, "setBlockers"), notifyOnIndexChange: false });
            return r4.addEventListener(ce, onBeforeUnload, { capture: true }), r4.addEventListener(ue, onPushPopEvent), r4.history.pushState = function(...e6) {
              const t5 = n3.apply(r4.history, e6);
              return f4._ignoreSubscribers || onPushPop("PUSH"), t5;
            }, r4.history.replaceState = function(...e6) {
              const t5 = s4.apply(r4.history, e6);
              return f4._ignoreSubscribers || onPushPop("REPLACE"), t5;
            }, f4;
          }()), this.latestLocation = this.parseLocation()), this.options.routeTree !== this.routeTree && (this.routeTree = this.options.routeTree, this.buildRouteTree()), this.__store || (this.__store = new Store({ loadedAt: 0, isLoading: false, isTransitioning: false, status: "idle", resolvedLocation: void 0, location: this.latestLocation, matches: [], pendingMatches: [], cachedMatches: [], statusCode: 200 }, { onUpdate: /* @__PURE__ */ __name(() => {
            this.__store.state = { ...this.state, cachedMatches: this.state.cachedMatches.filter((e5) => !["redirected"].includes(e5.status)) };
          }, "onUpdate") }), setupScrollRestoration(this));
        }, this.buildRouteTree = () => {
          const { routesById: e4, routesByPath: t3, flatRoutes: r4 } = function({ routeTree: e5, initRoute: t4 }) {
            const r5 = {}, n4 = {}, recurseRoutes = /* @__PURE__ */ __name((e6) => {
              e6.forEach((e7, s5) => {
                null == t4 || t4(e7, s5);
                if (invariant$1(!r5[e7.id], String(e7.id)), r5[e7.id] = e7, !e7.isRoot && e7.path) {
                  const t5 = trimPathRight$1(e7.fullPath);
                  n4[t5] && !e7.fullPath.endsWith("/") || (n4[t5] = e7);
                }
                const o6 = e7.children;
                (null == o6 ? void 0 : o6.length) && recurseRoutes(o6);
              });
            }, "recurseRoutes");
            recurseRoutes([e5]);
            const s4 = [], o5 = Object.values(r5);
            o5.forEach((e6, t5) => {
              var r6;
              if (e6.isRoot || !e6.path) return;
              const n5 = trimPathLeft$1(e6.fullPath), o6 = parsePathname$1(n5);
              for (; o6.length > 1 && "/" === (null == (r6 = o6[0]) ? void 0 : r6.value); ) o6.shift();
              const a6 = o6.map((e7) => "/" === e7.value ? 0.75 : "param" === e7.type && e7.prefixSegment && e7.suffixSegment ? 0.55 : "param" === e7.type && e7.prefixSegment ? 0.52 : "param" === e7.type && e7.suffixSegment ? 0.51 : "param" === e7.type ? 0.5 : "wildcard" === e7.type && e7.prefixSegment && e7.suffixSegment ? 0.3 : "wildcard" === e7.type && e7.prefixSegment ? 0.27 : "wildcard" === e7.type && e7.suffixSegment ? 0.26 : "wildcard" === e7.type ? 0.25 : 1);
              s4.push({ child: e6, trimmed: n5, parsed: o6, index: t5, scores: a6 });
            });
            const a5 = s4.sort((e6, t5) => {
              const r6 = Math.min(e6.scores.length, t5.scores.length);
              for (let n5 = 0; n5 < r6; n5++) if (e6.scores[n5] !== t5.scores[n5]) return t5.scores[n5] - e6.scores[n5];
              if (e6.scores.length !== t5.scores.length) return t5.scores.length - e6.scores.length;
              for (let n5 = 0; n5 < r6; n5++) if (e6.parsed[n5].value !== t5.parsed[n5].value) return e6.parsed[n5].value > t5.parsed[n5].value ? 1 : -1;
              return e6.index - t5.index;
            }).map((e6, t5) => (e6.child.rank = t5, e6.child));
            return { routesById: r5, routesByPath: n4, flatRoutes: a5 };
          }({ routeTree: this.routeTree, initRoute: /* @__PURE__ */ __name((e5, t4) => {
            e5.init({ originalIndex: t4 });
          }, "initRoute") });
          this.routesById = e4, this.routesByPath = t3, this.flatRoutes = r4;
          const n3 = this.options.notFoundRoute;
          n3 && (n3.init({ originalIndex: 99999999999 }), this.routesById[n3.id] = n3);
        }, this.subscribe = (e4, t3) => {
          const r4 = { eventType: e4, fn: t3 };
          return this.subscribers.add(r4), () => {
            this.subscribers.delete(r4);
          };
        }, this.emit = (e4) => {
          this.subscribers.forEach((t3) => {
            t3.eventType === e4.type && t3.fn(e4);
          });
        }, this.parseLocation = (e4, t3) => {
          const parse2 = /* @__PURE__ */ __name(({ pathname: t4, search: r5, hash: n4, state: s5 }) => {
            const o5 = this.options.parseSearch(r5), a5 = this.options.stringifySearch(o5);
            return { pathname: t4, searchStr: a5, search: replaceEqualDeep(null == e4 ? void 0 : e4.search, o5), hash: n4.split("#").reverse()[0] ?? "", href: `${t4}${a5}${n4}`, state: replaceEqualDeep(null == e4 ? void 0 : e4.state, s5) };
          }, "parse"), r4 = parse2(t3 ?? this.history.location), { __tempLocation: n3, __tempKey: s4 } = r4.state;
          if (n3 && (!s4 || s4 === this.tempLocationKey)) {
            const e5 = parse2(n3);
            return e5.state.key = r4.state.key, e5.state.__TSR_key = r4.state.__TSR_key, delete e5.state.__tempLocation, { ...e5, maskedLocation: r4 };
          }
          return r4;
        }, this.resolvePathWithBase = (e4, t3) => function({ basepath: e5, base: t4, to: r4, trailingSlash: n3 = "never", caseSensitive: s4 }) {
          var o5, a5;
          t4 = removeBasepath$1(e5, t4, s4), r4 = removeBasepath$1(e5, r4, s4);
          let i5 = parsePathname$1(t4);
          const l4 = parsePathname$1(r4);
          return i5.length > 1 && "/" === (null == (o5 = last(i5)) ? void 0 : o5.value) && i5.pop(), l4.forEach((e6, t5) => {
            "/" === e6.value ? t5 ? t5 === l4.length - 1 && i5.push(e6) : i5 = [e6] : ".." === e6.value ? i5.pop() : "." === e6.value || i5.push(e6);
          }), i5.length > 1 && ("/" === (null == (a5 = last(i5)) ? void 0 : a5.value) ? "never" === n3 && i5.pop() : "always" === n3 && i5.push({ type: "pathname", value: "/" })), cleanPath$1(joinPaths$1([e5, ...i5.map((e6) => {
            if ("param" === e6.type) {
              const t5 = e6.value.substring(1);
              if (e6.prefixSegment && e6.suffixSegment) return `${e6.prefixSegment}{$${t5}}${e6.suffixSegment}`;
              if (e6.prefixSegment) return `${e6.prefixSegment}{$${t5}}`;
              if (e6.suffixSegment) return `{$${t5}}${e6.suffixSegment}`;
            }
            if ("wildcard" === e6.type) {
              if (e6.prefixSegment && e6.suffixSegment) return `${e6.prefixSegment}{$}${e6.suffixSegment}`;
              if (e6.prefixSegment) return `${e6.prefixSegment}{$}`;
              if (e6.suffixSegment) return `{$}${e6.suffixSegment}`;
            }
            return e6.value;
          })]));
        }({ basepath: this.basepath, base: e4, to: cleanPath$1(t3), trailingSlash: this.options.trailingSlash, caseSensitive: this.options.caseSensitive }), this.matchRoutes = (e4, t3, r4) => "string" == typeof e4 ? this.matchRoutesInternal({ pathname: e4, search: t3 }, r4) : this.matchRoutesInternal(e4, t3), this.getMatchedRoutes = (e4, t3) => function({ pathname: e5, routePathname: t4, basepath: r4, caseSensitive: n3, routesByPath: s4, routesById: o5, flatRoutes: a5 }) {
          let i5 = {};
          const l4 = trimPathRight$1(e5), getMatchedParams = /* @__PURE__ */ __name((e6) => {
            var t5;
            return matchPathname$1(r4, l4, { to: e6.fullPath, caseSensitive: (null == (t5 = e6.options) ? void 0 : t5.caseSensitive) ?? n3, fuzzy: true });
          }, "getMatchedParams");
          let u4 = void 0 !== t4 ? s4[t4] : void 0;
          u4 ? i5 = getMatchedParams(u4) : u4 = a5.find((e6) => {
            const t5 = getMatchedParams(e6);
            return !!t5 && (i5 = t5, true);
          });
          let c4 = u4 || o5[ke];
          const d4 = [c4];
          for (; c4.parentRoute; ) c4 = c4.parentRoute, d4.unshift(c4);
          return { matchedRoutes: d4, routeParams: i5, foundRoute: u4 };
        }({ pathname: e4, routePathname: t3, basepath: this.basepath, caseSensitive: this.options.caseSensitive, routesByPath: this.routesByPath, routesById: this.routesById, flatRoutes: this.flatRoutes }), this.cancelMatch = (e4) => {
          const t3 = this.getMatch(e4);
          t3 && (t3.abortController.abort(), this.updateMatch(e4, (e5) => (clearTimeout(e5.pendingTimeout), { ...e5, pendingTimeout: void 0 })));
        }, this.cancelMatches = () => {
          var e4;
          null == (e4 = this.state.pendingMatches) || e4.forEach((e5) => {
            this.cancelMatch(e5.id);
          });
        }, this.buildLocation = (e4) => {
          const build = /* @__PURE__ */ __name((t3 = {}) => {
            var r4;
            const n3 = t3._fromLocation || this.latestLocation, s4 = last(this.matchRoutes(n3, { _buildLocation: true }));
            let o5 = s4.fullPath;
            const a5 = t3.to ? this.resolvePathWithBase(o5, `${t3.to}`) : this.resolvePathWithBase(o5, "."), i5 = !!t3.to && !this.comparePaths(t3.to.toString(), o5) && !this.comparePaths(a5, o5);
            "path" === t3.unsafeRelative ? o5 = n3.pathname : i5 && t3.from && (o5 = t3.from);
            const l4 = s4.search, u4 = { ...s4.params }, c4 = t3.to ? this.resolvePathWithBase(o5, `${t3.to}`) : this.resolvePathWithBase(o5, ".");
            let d4 = true === (t3.params ?? true) ? u4 : { ...u4, ...functionalUpdate(t3.params, u4) };
            const h4 = this.matchRoutes(c4, {}, { _buildLocation: true }).map((e5) => this.looseRoutesById[e5.routeId]);
            Object.keys(d4).length > 0 && h4.map((e5) => {
              var t4;
              return (null == (t4 = e5.options.params) ? void 0 : t4.stringify) ?? e5.options.stringifyParams;
            }).filter(Boolean).forEach((e5) => {
              d4 = { ...d4, ...e5(d4) };
            });
            const p4 = interpolatePath({ path: c4, params: d4 ?? {}, leaveWildcards: false, leaveParams: e4.leaveParams, decodeCharMap: this.pathParamsDecodeCharMap }).interpolatedPath;
            let f4 = l4;
            if (e4._includeValidateSearch && (null == (r4 = this.options.search) ? void 0 : r4.strict)) {
              let e5 = {};
              h4.forEach((t4) => {
                try {
                  t4.options.validateSearch && (e5 = { ...e5, ...validateSearch(t4.options.validateSearch, { ...e5, ...f4 }) ?? {} });
                } catch {
                }
              }), f4 = e5;
            }
            f4 = function({ search: e5, dest: t4, destRoutes: r5, _includeValidateSearch: n4 }) {
              const s5 = r5.reduce((e6, t5) => {
                var r6;
                const s6 = [];
                if ("search" in t5.options) (null == (r6 = t5.options.search) ? void 0 : r6.middlewares) && s6.push(...t5.options.search.middlewares);
                else if (t5.options.preSearchFilters || t5.options.postSearchFilters) {
                  const legacyMiddleware = /* @__PURE__ */ __name(({ search: e7, next: r7 }) => {
                    let n5 = e7;
                    "preSearchFilters" in t5.options && t5.options.preSearchFilters && (n5 = t5.options.preSearchFilters.reduce((e8, t6) => t6(e8), e7));
                    const s7 = r7(n5);
                    return "postSearchFilters" in t5.options && t5.options.postSearchFilters ? t5.options.postSearchFilters.reduce((e8, t6) => t6(e8), s7) : s7;
                  }, "legacyMiddleware");
                  s6.push(legacyMiddleware);
                }
                if (n4 && t5.options.validateSearch) {
                  const validate = /* @__PURE__ */ __name(({ search: e7, next: r7 }) => {
                    const n5 = r7(e7);
                    try {
                      return { ...n5, ...validateSearch(t5.options.validateSearch, n5) ?? {} };
                    } catch {
                      return n5;
                    }
                  }, "validate");
                  s6.push(validate);
                }
                return e6.concat(s6);
              }, []) ?? [], final = /* @__PURE__ */ __name(({ search: e6 }) => t4.search ? true === t4.search ? e6 : functionalUpdate(t4.search, e6) : {}, "final");
              s5.push(final);
              const applyNext = /* @__PURE__ */ __name((e6, t5) => {
                if (e6 >= s5.length) return t5;
                return (0, s5[e6])({ search: t5, next: /* @__PURE__ */ __name((t6) => applyNext(e6 + 1, t6), "next") });
              }, "applyNext");
              return applyNext(0, e5);
            }({ search: f4, dest: t3, destRoutes: h4, _includeValidateSearch: e4._includeValidateSearch }), f4 = replaceEqualDeep(l4, f4);
            const m5 = this.options.stringifySearch(f4), g3 = true === t3.hash ? n3.hash : t3.hash ? functionalUpdate(t3.hash, n3.hash) : void 0, y3 = g3 ? `#${g3}` : "";
            let v3 = true === t3.state ? n3.state : t3.state ? functionalUpdate(t3.state, n3.state) : {};
            return v3 = replaceEqualDeep(n3.state, v3), { pathname: p4, search: f4, searchStr: m5, state: v3, hash: g3 ?? "", href: `${p4}${m5}${y3}`, unmaskOnReload: t3.unmaskOnReload };
          }, "build"), buildWithMatches = /* @__PURE__ */ __name((t3 = {}, r4) => {
            var n3;
            const s4 = build(t3);
            let o5 = r4 ? build(r4) : void 0;
            if (!o5) {
              let t4 = {};
              const a5 = null == (n3 = this.options.routeMasks) ? void 0 : n3.find((e5) => {
                const r5 = matchPathname$1(this.basepath, s4.pathname, { to: e5.from, caseSensitive: false, fuzzy: false });
                return !!r5 && (t4 = r5, true);
              });
              if (a5) {
                const { from: n4, ...s5 } = a5;
                r4 = { ...pick(e4, ["from"]), ...s5, params: t4 }, o5 = build(r4);
              }
            }
            if (o5) {
              const e5 = build(r4);
              s4.maskedLocation = e5;
            }
            return s4;
          }, "buildWithMatches");
          return e4.mask ? buildWithMatches(e4, { ...pick(e4, ["from"]), ...e4.mask }) : buildWithMatches(e4);
        }, this.commitLocation = ({ viewTransition: e4, ignoreBlocker: t3, ...r4 }) => {
          const n3 = this.latestLocation.href === r4.href, s4 = this.commitLocationPromise;
          if (this.commitLocationPromise = createControlledPromise$1(() => {
            null == s4 || s4.resolve();
          }), n3 && (() => {
            const e5 = ["key", "__TSR_key", "__TSR_index", "__hashScrollIntoViewOptions"];
            e5.forEach((e6) => {
              r4.state[e6] = this.latestLocation.state[e6];
            });
            const t4 = deepEqual(r4.state, this.latestLocation.state);
            return e5.forEach((e6) => {
              delete r4.state[e6];
            }), t4;
          })()) this.load();
          else {
            let { maskedLocation: n4, hashScrollIntoView: s5, ...o5 } = r4;
            n4 && (o5 = { ...n4, state: { ...n4.state, __tempKey: void 0, __tempLocation: { ...o5, search: o5.searchStr, state: { ...o5.state, __tempKey: void 0, __tempLocation: void 0, __TSR_key: void 0, key: void 0 } } } }, (o5.unmaskOnReload ?? this.options.unmaskOnReload) && (o5.state.__tempKey = this.tempLocationKey)), o5.state.__hashScrollIntoViewOptions = s5 ?? this.options.defaultHashScrollIntoView ?? true, this.shouldViewTransition = e4, this.history[r4.replace ? "replace" : "push"](o5.href, o5.state, { ignoreBlocker: t3 });
          }
          return this.resetNextScroll = r4.resetScroll ?? true, this.history.subscribers.size || this.load(), this.commitLocationPromise;
        }, this.buildAndCommitLocation = ({ replace: e4, resetScroll: t3, hashScrollIntoView: r4, viewTransition: n3, ignoreBlocker: s4, href: o5, ...a5 } = {}) => {
          if (o5) {
            const t4 = this.history.location.state.__TSR_index, r5 = parseHref$1(o5, { __TSR_index: e4 ? t4 : t4 + 1 });
            a5.to = r5.pathname, a5.search = this.options.parseSearch(r5.search), a5.hash = r5.hash.slice(1);
          }
          const i5 = this.buildLocation({ ...a5, _includeValidateSearch: true });
          return this.commitLocation({ ...i5, viewTransition: n3, replace: e4, resetScroll: t3, hashScrollIntoView: r4, ignoreBlocker: s4 });
        }, this.navigate = ({ to: e4, reloadDocument: t3, href: r4, ...n3 }) => {
          if (!t3 && r4) try {
            new URL(`${r4}`), t3 = true;
          } catch {
          }
          if (!t3) return this.buildAndCommitLocation({ ...n3, href: r4, to: e4, _isNavigate: true });
          if (!r4) {
            const t4 = this.buildLocation({ to: e4, ...n3 });
            r4 = this.history.createHref(t4.href);
          }
          n3.replace ? window.location.replace(r4) : window.location.href = r4;
        }, this.beforeLoad = () => {
          if (this.cancelMatches(), this.latestLocation = this.parseLocation(this.latestLocation), this.isServer) {
            const e5 = this.buildLocation({ to: this.latestLocation.pathname, search: true, params: true, hash: true, state: true, _includeValidateSearch: true });
            if (trimPath$1(this.latestLocation.href) !== trimPath$1(e5.href)) throw function(e6) {
              if (e6.statusCode = e6.statusCode || e6.code || 307, !e6.reloadDocument) try {
                new URL(`${e6.href}`), e6.reloadDocument = true;
              } catch {
              }
              const t3 = new Headers(e6.headers || {});
              e6.href && null === t3.get("Location") && t3.set("Location", e6.href);
              const r4 = new Response(null, { status: e6.statusCode, headers: t3 });
              if (r4.options = e6, e6.throw) throw r4;
              return r4;
            }({ href: e5.href });
          }
          const e4 = this.matchRoutes(this.latestLocation);
          this.__store.setState((t3) => ({ ...t3, status: "pending", isLoading: true, location: this.latestLocation, pendingMatches: e4, cachedMatches: t3.cachedMatches.filter((t4) => !e4.find((e5) => e5.id === t4.id)) }));
        }, this.load = async (e4) => {
          let t3, r4, n3;
          for (n3 = new Promise((s4) => {
            this.startTransition(async () => {
              var o5;
              try {
                this.beforeLoad();
                const t4 = this.latestLocation, r5 = this.state.resolvedLocation;
                this.state.redirect || this.emit({ type: "onBeforeNavigate", ...getLocationChangeInfo({ resolvedLocation: r5, location: t4 }) }), this.emit({ type: "onBeforeLoad", ...getLocationChangeInfo({ resolvedLocation: r5, location: t4 }) }), await this.loadMatches({ sync: null == e4 ? void 0 : e4.sync, matches: this.state.pendingMatches, location: t4, onReady: /* @__PURE__ */ __name(async () => {
                  this.startViewTransition(async () => {
                    let e5, t5, r6;
                    batch(() => {
                      this.__store.setState((n4) => {
                        const s5 = n4.matches, o6 = n4.pendingMatches || n4.matches;
                        return e5 = s5.filter((e6) => !o6.find((t6) => t6.id === e6.id)), t5 = o6.filter((e6) => !s5.find((t6) => t6.id === e6.id)), r6 = s5.filter((e6) => o6.find((t6) => t6.id === e6.id)), { ...n4, isLoading: false, loadedAt: Date.now(), matches: o6, pendingMatches: void 0, cachedMatches: [...n4.cachedMatches, ...e5.filter((e6) => "error" !== e6.status)] };
                      }), this.clearExpiredCache();
                    }), [[e5, "onLeave"], [t5, "onEnter"], [r6, "onStay"]].forEach(([e6, t6]) => {
                      e6.forEach((e7) => {
                        var r7, n4;
                        null == (n4 = (r7 = this.looseRoutesById[e7.routeId].options)[t6]) || n4.call(r7, e7);
                      });
                    });
                  });
                }, "onReady") });
              } catch (e5) {
                isRedirect$1(e5) ? (t3 = e5, this.isServer || this.navigate({ ...t3.options, replace: true, ignoreBlocker: true })) : isNotFound$1(e5) && (r4 = e5), this.__store.setState((e6) => ({ ...e6, statusCode: t3 ? t3.status : r4 ? 404 : e6.matches.some((e7) => "error" === e7.status) ? 500 : 200, redirect: t3 }));
              }
              this.latestLoadPromise === n3 && (null == (o5 = this.commitLocationPromise) || o5.resolve(), this.latestLoadPromise = void 0, this.commitLocationPromise = void 0), s4();
            });
          }), this.latestLoadPromise = n3, await n3; this.latestLoadPromise && n3 !== this.latestLoadPromise; ) await this.latestLoadPromise;
          this.hasNotFoundMatch() && this.__store.setState((e5) => ({ ...e5, statusCode: 404 }));
        }, this.startViewTransition = (e4) => {
          const t3 = this.shouldViewTransition ?? this.options.defaultViewTransition;
          if (delete this.shouldViewTransition, t3 && "undefined" != typeof document && "startViewTransition" in document && "function" == typeof document.startViewTransition) {
            let r4;
            if ("object" == typeof t3 && this.isViewTransitionTypesSupported) {
              const n3 = this.latestLocation, s4 = this.state.resolvedLocation;
              r4 = { update: e4, types: "function" == typeof t3.types ? t3.types(getLocationChangeInfo({ resolvedLocation: s4, location: n3 })) : t3.types };
            } else r4 = e4;
            document.startViewTransition(r4);
          } else e4();
        }, this.updateMatch = (e4, t3) => {
          var r4;
          let n3;
          const s4 = null == (r4 = this.state.pendingMatches) ? void 0 : r4.find((t4) => t4.id === e4), o5 = this.state.matches.find((t4) => t4.id === e4), a5 = this.state.cachedMatches.find((t4) => t4.id === e4), i5 = s4 ? "pendingMatches" : o5 ? "matches" : a5 ? "cachedMatches" : "";
          return i5 && this.__store.setState((r5) => {
            var s5;
            return { ...r5, [i5]: null == (s5 = r5[i5]) ? void 0 : s5.map((r6) => r6.id === e4 ? n3 = t3(r6) : r6) };
          }), n3;
        }, this.getMatch = (e4) => [...this.state.cachedMatches, ...this.state.pendingMatches ?? [], ...this.state.matches].find((t3) => t3.id === e4), this.loadMatches = async ({ location: e4, matches: t3, preload: r4, onReady: n3, updateMatch: s4 = this.updateMatch, sync: o5 }) => {
          let a5, i5 = false;
          const triggerOnReady = /* @__PURE__ */ __name(async () => {
            i5 || (i5 = true, await (null == n3 ? void 0 : n3()));
          }, "triggerOnReady"), resolvePreload = /* @__PURE__ */ __name((e5) => !(!r4 || this.state.matches.find((t4) => t4.id === e5)), "resolvePreload");
          !this.isServer && this.state.matches.find((e5) => e5._forcePending) && triggerOnReady();
          const handleRedirectAndNotFound = /* @__PURE__ */ __name((r5, n4) => {
            var o6, a6, l4;
            if (isRedirect$1(n4) || isNotFound$1(n4)) {
              if (isRedirect$1(n4) && n4.redirectHandled && !n4.options.reloadDocument) throw n4;
              if (null == (o6 = r5.beforeLoadPromise) || o6.resolve(), null == (a6 = r5.loaderPromise) || a6.resolve(), s4(r5.id, (e5) => ({ ...e5, status: isRedirect$1(n4) ? "redirected" : isNotFound$1(n4) ? "notFound" : "error", isFetching: false, error: n4, beforeLoadPromise: void 0, loaderPromise: void 0 })), n4.routeId || (n4.routeId = r5.routeId), null == (l4 = r5.loadPromise) || l4.resolve(), isRedirect$1(n4)) throw i5 = true, n4.options._fromLocation = e4, n4.redirectHandled = true, n4 = this.resolveRedirect(n4);
              if (isNotFound$1(n4)) throw this._handleNotFound(t3, n4, { updateMatch: s4 }), n4;
            }
          }, "handleRedirectAndNotFound"), shouldSkipLoader = /* @__PURE__ */ __name((e5) => {
            const t4 = this.getMatch(e5);
            return !(this.isServer || !t4._dehydrated) || !(!this.isServer || false !== t4.ssr);
          }, "shouldSkipLoader");
          try {
            await new Promise((r5, i6) => {
              (async () => {
                var l4, u4, c4, d4;
                try {
                  const handleSerialError = /* @__PURE__ */ __name((e5, r6, n4) => {
                    var o6, i8;
                    const { id: l5, routeId: u5 } = t3[e5], c5 = this.looseRoutesById[u5];
                    if (r6 instanceof Promise) throw r6;
                    r6.routerCode = n4, a5 = a5 ?? e5, handleRedirectAndNotFound(this.getMatch(l5), r6);
                    try {
                      null == (i8 = (o6 = c5.options).onError) || i8.call(o6, r6);
                    } catch (e6) {
                      r6 = e6, handleRedirectAndNotFound(this.getMatch(l5), r6);
                    }
                    s4(l5, (e6) => {
                      var t4, n5;
                      return null == (t4 = e6.beforeLoadPromise) || t4.resolve(), null == (n5 = e6.loadPromise) || n5.resolve(), { ...e6, error: r6, status: "error", isFetching: false, updatedAt: Date.now(), abortController: new AbortController(), beforeLoadPromise: void 0 };
                    });
                  }, "handleSerialError");
                  for (const [r6, { id: o6, routeId: a6 }] of t3.entries()) {
                    const i8 = this.getMatch(o6), h5 = null == (l4 = t3[r6 - 1]) ? void 0 : l4.id, p4 = h5 ? this.getMatch(h5) : void 0, f4 = this.looseRoutesById[a6], m5 = f4.options.pendingMs ?? this.options.defaultPendingMs;
                    if (this.isServer) {
                      let r7;
                      if (this.isShell()) r7 = o6 === ke;
                      else {
                        const n4 = this.options.defaultSsr ?? true;
                        if (false === (null == p4 ? void 0 : p4.ssr)) r7 = false;
                        else {
                          let s5;
                          if (void 0 === f4.options.ssr) s5 = n4;
                          else if ("function" == typeof f4.options.ssr) {
                            let makeMaybe = /* @__PURE__ */ __name(function(e5, t4) {
                              return t4 ? { status: "error", error: t4 } : { status: "success", value: e5 };
                            }, "makeMaybe");
                            const { search: r8, params: a7 } = this.getMatch(o6), l5 = { search: makeMaybe(r8, i8.searchError), params: makeMaybe(a7, i8.paramsError), location: e4, matches: t3.map((e5) => ({ index: e5.index, pathname: e5.pathname, fullPath: e5.fullPath, staticData: e5.staticData, id: e5.id, routeId: e5.routeId, search: makeMaybe(e5.search, e5.searchError), params: makeMaybe(e5.params, e5.paramsError), ssr: e5.ssr })) };
                            s5 = await f4.options.ssr(l5) ?? n4;
                          } else s5 = f4.options.ssr;
                          r7 = true === s5 && "data-only" === (null == p4 ? void 0 : p4.ssr) ? "data-only" : s5;
                        }
                      }
                      s4(o6, (e5) => ({ ...e5, ssr: r7 }));
                    }
                    if (shouldSkipLoader(o6)) continue;
                    const g3 = !(!n3 || this.isServer || resolvePreload(o6) || !(f4.options.loader || f4.options.beforeLoad || routeNeedsPreload(f4)) || "number" != typeof m5 || m5 === 1 / 0 || !(f4.options.pendingComponent ?? (null == (u4 = this.options) ? void 0 : u4.defaultPendingComponent)));
                    let y3 = true;
                    const setupPendingTimeout = /* @__PURE__ */ __name(() => {
                      if (g3 && void 0 === this.getMatch(o6).pendingTimeout) {
                        const e5 = setTimeout(() => {
                          try {
                            triggerOnReady();
                          } catch {
                          }
                        }, m5);
                        s4(o6, (t4) => ({ ...t4, pendingTimeout: e5 }));
                      }
                    }, "setupPendingTimeout");
                    if (i8.beforeLoadPromise || i8.loaderPromise) {
                      setupPendingTimeout(), await i8.beforeLoadPromise;
                      const e5 = this.getMatch(o6);
                      "error" === e5.status ? y3 = true : !e5.preload || "redirected" !== e5.status && "notFound" !== e5.status || handleRedirectAndNotFound(e5, e5.error);
                    }
                    if (y3) {
                      try {
                        s4(o6, (e5) => {
                          const t4 = e5.loadPromise;
                          return { ...e5, loadPromise: createControlledPromise$1(() => {
                            null == t4 || t4.resolve();
                          }), beforeLoadPromise: createControlledPromise$1() };
                        });
                        const { paramsError: n4, searchError: a7 } = this.getMatch(o6);
                        n4 && handleSerialError(r6, n4, "PARSE_PARAMS"), a7 && handleSerialError(r6, a7, "VALIDATE_SEARCH"), setupPendingTimeout();
                        const i9 = new AbortController(), l5 = (null == p4 ? void 0 : p4.context) ?? this.options.context ?? {};
                        s4(o6, (e5) => ({ ...e5, isFetching: "beforeLoad", fetchCount: e5.fetchCount + 1, abortController: i9, context: { ...l5, ...e5.__routeContext } }));
                        const { search: u5, params: h6, context: m6, cause: g4 } = this.getMatch(o6), y4 = resolvePreload(o6), v3 = { search: u5, abortController: i9, params: h6, preload: y4, context: m6, location: e4, navigate: /* @__PURE__ */ __name((t4) => this.navigate({ ...t4, _fromLocation: e4 }), "navigate"), buildLocation: this.buildLocation, cause: y4 ? "preload" : g4, matches: t3 }, b3 = await (null == (d4 = (c4 = f4.options).beforeLoad) ? void 0 : d4.call(c4, v3));
                        (isRedirect$1(b3) || isNotFound$1(b3)) && handleSerialError(r6, b3, "BEFORE_LOAD"), s4(o6, (e5) => ({ ...e5, __beforeLoadContext: b3, context: { ...l5, ...e5.__routeContext, ...b3 }, abortController: i9 }));
                      } catch (e5) {
                        handleSerialError(r6, e5, "BEFORE_LOAD");
                      }
                      s4(o6, (e5) => {
                        var t4;
                        return null == (t4 = e5.beforeLoadPromise) || t4.resolve(), { ...e5, beforeLoadPromise: void 0, isFetching: false };
                      });
                    }
                  }
                  const i7 = t3.slice(0, a5), h4 = [];
                  i7.forEach(({ id: r6, routeId: n4 }, a6) => {
                    h4.push((async () => {
                      let i8 = false, l5 = false;
                      const u5 = this.looseRoutesById[n4], executeHead = /* @__PURE__ */ __name(async () => {
                        var e5, n5, s5, o6, a7, i9;
                        const l6 = this.getMatch(r6);
                        if (!l6) return;
                        const c6 = { matches: t3, match: l6, params: l6.params, loaderData: l6.loaderData }, d5 = await (null == (n5 = (e5 = u5.options).head) ? void 0 : n5.call(e5, c6)), h5 = null == d5 ? void 0 : d5.meta, p4 = null == d5 ? void 0 : d5.links, f4 = null == d5 ? void 0 : d5.scripts, m5 = null == d5 ? void 0 : d5.styles, g3 = await (null == (o6 = (s5 = u5.options).scripts) ? void 0 : o6.call(s5, c6));
                        return { meta: h5, links: p4, headScripts: f4, headers: await (null == (i9 = (a7 = u5.options).headers) ? void 0 : i9.call(a7, c6)), scripts: g3, styles: m5 };
                      }, "executeHead"), potentialPendingMinPromise = /* @__PURE__ */ __name(async () => {
                        const e5 = this.getMatch(r6);
                        e5.minPendingPromise && await e5.minPendingPromise;
                      }, "potentialPendingMinPromise"), c5 = this.getMatch(r6);
                      if (shouldSkipLoader(r6)) {
                        if (this.isServer) {
                          const e5 = await executeHead();
                          return s4(r6, (t4) => ({ ...t4, ...e5 })), this.getMatch(r6);
                        }
                      } else if (c5.loaderPromise) {
                        if ("success" === c5.status && !o5 && !c5.preload) return this.getMatch(r6);
                        await c5.loaderPromise;
                        const e5 = this.getMatch(r6);
                        e5.error && handleRedirectAndNotFound(e5, e5.error);
                      } else {
                        const t4 = h4[a6 - 1], getLoaderContext = /* @__PURE__ */ __name(() => {
                          const { params: n6, loaderDeps: s5, abortController: o6, context: a7, cause: i9 } = this.getMatch(r6), l6 = resolvePreload(r6);
                          return { params: n6, deps: s5, preload: !!l6, parentMatchPromise: t4, abortController: o6, context: a7, location: e4, navigate: /* @__PURE__ */ __name((t5) => this.navigate({ ...t5, _fromLocation: e4 }), "navigate"), cause: l6 ? "preload" : i9, route: u5 };
                        }, "getLoaderContext"), n5 = Date.now() - this.getMatch(r6).updatedAt, c6 = resolvePreload(r6), d5 = c6 ? u5.options.preloadStaleTime ?? this.options.defaultPreloadStaleTime ?? 3e4 : u5.options.staleTime ?? this.options.defaultStaleTime ?? 0, p4 = u5.options.shouldReload, f4 = "function" == typeof p4 ? p4(getLoaderContext()) : p4;
                        s4(r6, (e5) => ({ ...e5, loaderPromise: createControlledPromise$1(), preload: !!c6 && !this.state.matches.find((e6) => e6.id === r6) }));
                        const runLoader = /* @__PURE__ */ __name(async () => {
                          var e5, t5, n6, o6;
                          try {
                            try {
                              (!this.isServer || this.isServer && true === this.getMatch(r6).ssr) && this.loadRouteChunk(u5), s4(r6, (e6) => ({ ...e6, isFetching: "loader" }));
                              const n7 = await (null == (t5 = (e5 = u5.options).loader) ? void 0 : t5.call(e5, getLoaderContext()));
                              handleRedirectAndNotFound(this.getMatch(r6), n7), s4(r6, (e6) => ({ ...e6, loaderData: n7 })), await u5._lazyPromise;
                              const o7 = await executeHead();
                              await potentialPendingMinPromise(), await u5._componentsPromise, s4(r6, (e6) => ({ ...e6, error: void 0, status: "success", isFetching: false, updatedAt: Date.now(), ...o7 }));
                            } catch (e6) {
                              let t6 = e6;
                              await potentialPendingMinPromise(), handleRedirectAndNotFound(this.getMatch(r6), e6);
                              try {
                                null == (o6 = (n6 = u5.options).onError) || o6.call(n6, e6);
                              } catch (e7) {
                                t6 = e7, handleRedirectAndNotFound(this.getMatch(r6), e7);
                              }
                              const a7 = await executeHead();
                              s4(r6, (e7) => ({ ...e7, error: t6, status: "error", isFetching: false, ...a7 }));
                            }
                          } catch (e6) {
                            const t6 = await executeHead();
                            s4(r6, (e7) => ({ ...e7, loaderPromise: void 0, ...t6 })), handleRedirectAndNotFound(this.getMatch(r6), e6);
                          }
                        }, "runLoader"), { status: m5, invalid: g3 } = this.getMatch(r6);
                        if (i8 = "success" === m5 && (g3 || (f4 ?? n5 > d5)), c6 && false === u5.options.preload) ;
                        else if (i8 && !o5) l5 = true, (async () => {
                          try {
                            await runLoader();
                            const { loaderPromise: e5, loadPromise: t5 } = this.getMatch(r6);
                            null == e5 || e5.resolve(), null == t5 || t5.resolve(), s4(r6, (e6) => ({ ...e6, loaderPromise: void 0 }));
                          } catch (e5) {
                            isRedirect$1(e5) && await this.navigate(e5.options);
                          }
                        })();
                        else if ("success" !== m5 || i8 && o5) await runLoader();
                        else {
                          const e5 = await executeHead();
                          s4(r6, (t5) => ({ ...t5, ...e5 }));
                        }
                      }
                      if (!l5) {
                        const { loaderPromise: e5, loadPromise: t4 } = this.getMatch(r6);
                        null == e5 || e5.resolve(), null == t4 || t4.resolve();
                      }
                      return s4(r6, (e5) => (clearTimeout(e5.pendingTimeout), { ...e5, isFetching: !!l5 && e5.isFetching, loaderPromise: l5 ? e5.loaderPromise : void 0, invalid: false, pendingTimeout: void 0, _dehydrated: void 0 })), this.getMatch(r6);
                    })());
                  }), await Promise.all(h4), r5();
                } catch (e5) {
                  i6(e5);
                }
              })();
            }), await triggerOnReady();
          } catch (e5) {
            if (isRedirect$1(e5) || isNotFound$1(e5)) throw isNotFound$1(e5) && !r4 && await triggerOnReady(), e5;
          }
          return t3;
        }, this.invalidate = (e4) => {
          const invalidate = /* @__PURE__ */ __name((t3) => {
            var r4;
            return (null == (r4 = null == e4 ? void 0 : e4.filter) ? void 0 : r4.call(e4, t3)) ?? 1 ? { ...t3, invalid: true, ...(null == e4 ? void 0 : e4.forcePending) || "error" === t3.status ? { status: "pending", error: void 0 } : {} } : t3;
          }, "invalidate");
          return this.__store.setState((e5) => {
            var t3;
            return { ...e5, matches: e5.matches.map(invalidate), cachedMatches: e5.cachedMatches.map(invalidate), pendingMatches: null == (t3 = e5.pendingMatches) ? void 0 : t3.map(invalidate) };
          }), this.shouldViewTransition = false, this.load({ sync: null == e4 ? void 0 : e4.sync });
        }, this.resolveRedirect = (e4) => (e4.options.href || (e4.options.href = this.buildLocation(e4.options).href, e4.headers.set("Location", e4.options.href)), e4.headers.get("Location") || e4.headers.set("Location", e4.options.href), e4), this.clearCache = (e4) => {
          const t3 = null == e4 ? void 0 : e4.filter;
          void 0 !== t3 ? this.__store.setState((e5) => ({ ...e5, cachedMatches: e5.cachedMatches.filter((e6) => !t3(e6)) })) : this.__store.setState((e5) => ({ ...e5, cachedMatches: [] }));
        }, this.clearExpiredCache = () => {
          this.clearCache({ filter: /* @__PURE__ */ __name((e4) => {
            const t3 = this.looseRoutesById[e4.routeId];
            if (!t3.options.loader) return true;
            const r4 = (e4.preload ? t3.options.preloadGcTime ?? this.options.defaultPreloadGcTime : t3.options.gcTime ?? this.options.defaultGcTime) ?? 3e5;
            return !("error" !== e4.status && Date.now() - e4.updatedAt < r4);
          }, "filter") });
        }, this.loadRouteChunk = (e4) => (void 0 === e4._lazyPromise && (e4.lazyFn ? e4._lazyPromise = e4.lazyFn().then((t3) => {
          const { id: r4, ...n3 } = t3.options;
          Object.assign(e4.options, n3);
        }) : e4._lazyPromise = Promise.resolve()), void 0 === e4._componentsPromise && (e4._componentsPromise = e4._lazyPromise.then(() => Promise.all(we.map(async (t3) => {
          const r4 = e4.options[t3];
          (null == r4 ? void 0 : r4.preload) && await r4.preload();
        })))), e4._componentsPromise), this.preloadRoute = async (e4) => {
          const t3 = this.buildLocation(e4);
          let r4 = this.matchRoutes(t3, { throwOnError: true, preload: true, dest: e4 });
          const n3 = new Set([...this.state.matches, ...this.state.pendingMatches ?? []].map((e5) => e5.id)), s4 = /* @__PURE__ */ new Set([...n3, ...this.state.cachedMatches.map((e5) => e5.id)]);
          batch(() => {
            r4.forEach((e5) => {
              s4.has(e5.id) || this.__store.setState((t4) => ({ ...t4, cachedMatches: [...t4.cachedMatches, e5] }));
            });
          });
          try {
            return r4 = await this.loadMatches({ matches: r4, location: t3, preload: true, updateMatch: /* @__PURE__ */ __name((e5, t4) => {
              n3.has(e5) ? r4 = r4.map((r5) => r5.id === e5 ? t4(r5) : r5) : this.updateMatch(e5, t4);
            }, "updateMatch") }), r4;
          } catch (e5) {
            if (isRedirect$1(e5)) {
              if (e5.options.reloadDocument) return;
              return await this.preloadRoute({ ...e5.options, _fromLocation: t3 });
            }
            return void (isNotFound$1(e5) || console.error(e5));
          }
        }, this.matchRoute = (e4, t3) => {
          const r4 = { ...e4, to: e4.to ? this.resolvePathWithBase(e4.from || "", e4.to) : void 0, params: e4.params || {}, leaveParams: true }, n3 = this.buildLocation(r4);
          if ((null == t3 ? void 0 : t3.pending) && "pending" !== this.state.status) return false;
          const s4 = (void 0 === (null == t3 ? void 0 : t3.pending) ? !this.state.isLoading : t3.pending) ? this.latestLocation : this.state.resolvedLocation || this.state.location, o5 = matchPathname$1(this.basepath, s4.pathname, { ...t3, to: n3.pathname });
          return !!o5 && (!(e4.params && !deepEqual(o5, e4.params, { partial: true })) && (o5 && ((null == t3 ? void 0 : t3.includeSearch) ?? 1) ? !!deepEqual(s4.search, n3.search, { partial: true }) && o5 : o5));
        }, this._handleNotFound = (e4, t3, { updateMatch: r4 = this.updateMatch } = {}) => {
          var n3;
          const s4 = this.routesById[t3.routeId ?? ""] ?? this.routeTree, o5 = {};
          for (const t4 of e4) o5[t4.routeId] = t4;
          !s4.options.notFoundComponent && (null == (n3 = this.options) ? void 0 : n3.defaultNotFoundComponent) && (s4.options.notFoundComponent = this.options.defaultNotFoundComponent), invariant$1(s4.options.notFoundComponent);
          const a5 = o5[s4.id];
          invariant$1(a5, s4.id), r4(a5.id, (e5) => ({ ...e5, status: "notFound", error: t3, isFetching: false })), "BEFORE_LOAD" === t3.routerCode && s4.parentRoute && (t3.routeId = s4.parentRoute.id, this._handleNotFound(e4, t3, { updateMatch: r4 }));
        }, this.hasNotFoundMatch = () => this.__store.state.matches.some((e4) => "notFound" === e4.status || e4.globalNotFound), this.update({ defaultPreloadDelay: 50, defaultPendingMs: 1e3, defaultPendingMinMs: 500, context: void 0, ...e3, caseSensitive: e3.caseSensitive ?? false, notFoundMode: e3.notFoundMode ?? "fuzzy", stringifySearch: e3.stringifySearch ?? Se, parseSearch: e3.parseSearch ?? ve }), "undefined" != typeof document && (self.__TSR_ROUTER__ = this);
      }
      isShell() {
        return this.options.isShell;
      }
      get state() {
        return this.__store.state;
      }
      get looseRoutesById() {
        return this.routesById;
      }
      matchRoutesInternal(e3, t3) {
        var r4;
        const { foundRoute: n3, matchedRoutes: s4, routeParams: o5 } = this.getMatchedRoutes(e3.pathname, null == (r4 = null == t3 ? void 0 : t3.dest) ? void 0 : r4.to);
        let a5 = false;
        (n3 ? "/" !== n3.path && o5["**"] : trimPathRight$1(e3.pathname)) && (this.options.notFoundRoute ? s4.push(this.options.notFoundRoute) : a5 = true);
        const i5 = (() => {
          if (a5) {
            if ("root" !== this.options.notFoundMode) for (let e4 = s4.length - 1; e4 >= 0; e4--) {
              const t4 = s4[e4];
              if (t4.children) return t4.id;
            }
            return ke;
          }
        })(), l4 = s4.map((e4) => {
          var r5;
          let n4;
          const s5 = (null == (r5 = e4.options.params) ? void 0 : r5.parse) ?? e4.options.parseParams;
          if (s5) try {
            const e5 = s5(o5);
            Object.assign(o5, e5);
          } catch (e5) {
            if (n4 = new PathParamError(e5.message, { cause: e5 }), null == t3 ? void 0 : t3.throwOnError) throw n4;
            return n4;
          }
        }), u4 = [], getParentContext = /* @__PURE__ */ __name((e4) => (null == e4 ? void 0 : e4.id) ? e4.context ?? this.options.context ?? {} : this.options.context ?? {}, "getParentContext");
        return s4.forEach((r5, n4) => {
          var s5, a6;
          const c4 = u4[n4 - 1], [d4, h4, p4] = (() => {
            const n5 = (null == c4 ? void 0 : c4.search) ?? e3.search, s6 = (null == c4 ? void 0 : c4._strictSearch) ?? {};
            try {
              const e4 = validateSearch(r5.options.validateSearch, { ...n5 }) ?? {};
              return [{ ...n5, ...e4 }, { ...s6, ...e4 }, void 0];
            } catch (e4) {
              let r6 = e4;
              if (e4 instanceof SearchParamError || (r6 = new SearchParamError(e4.message, { cause: e4 })), null == t3 ? void 0 : t3.throwOnError) throw r6;
              return [n5, {}, r6];
            }
          })(), f4 = (null == (a6 = (s5 = r5.options).loaderDeps) ? void 0 : a6.call(s5, { search: d4 })) ?? "", m5 = f4 ? JSON.stringify(f4) : "", { usedParams: g3, interpolatedPath: y3 } = interpolatePath({ path: r5.fullPath, params: o5, decodeCharMap: this.pathParamsDecodeCharMap }), v3 = interpolatePath({ path: r5.id, params: o5, leaveWildcards: true, decodeCharMap: this.pathParamsDecodeCharMap }).interpolatedPath + m5, b3 = this.getMatch(v3), S4 = this.state.matches.find((e4) => e4.routeId === r5.id), k4 = S4 ? "stay" : "enter";
          let w4;
          if (b3) w4 = { ...b3, cause: k4, params: S4 ? replaceEqualDeep(S4.params, o5) : o5, _strictParams: g3, search: replaceEqualDeep(S4 ? S4.search : b3.search, d4), _strictSearch: h4 };
          else {
            const e4 = r5.options.loader || r5.options.beforeLoad || r5.lazyFn || routeNeedsPreload(r5) ? "pending" : "success";
            w4 = { id: v3, index: n4, routeId: r5.id, params: S4 ? replaceEqualDeep(S4.params, o5) : o5, _strictParams: g3, pathname: joinPaths$1([this.basepath, y3]), updatedAt: Date.now(), search: S4 ? replaceEqualDeep(S4.search, d4) : d4, _strictSearch: h4, searchError: void 0, status: e4, isFetching: false, error: void 0, paramsError: l4[n4], __routeContext: {}, __beforeLoadContext: void 0, context: {}, abortController: new AbortController(), fetchCount: 0, cause: k4, loaderDeps: S4 ? replaceEqualDeep(S4.loaderDeps, f4) : f4, invalid: false, preload: false, links: void 0, scripts: void 0, headScripts: void 0, meta: void 0, staticData: r5.options.staticData || {}, loadPromise: createControlledPromise$1(), fullPath: r5.fullPath };
          }
          (null == t3 ? void 0 : t3.preload) || (w4.globalNotFound = i5 === r5.id), w4.searchError = p4;
          const C4 = getParentContext(c4);
          w4.context = { ...C4, ...w4.__routeContext, ...w4.__beforeLoadContext }, u4.push(w4);
        }), u4.forEach((r5, n4) => {
          var s5, o6;
          const a6 = this.looseRoutesById[r5.routeId];
          if (!this.getMatch(r5.id) && true !== (null == t3 ? void 0 : t3._buildLocation)) {
            const t4 = u4[n4 - 1], i6 = getParentContext(t4), l5 = { deps: r5.loaderDeps, params: r5.params, context: i6, location: e3, navigate: /* @__PURE__ */ __name((t5) => this.navigate({ ...t5, _fromLocation: e3 }), "navigate"), buildLocation: this.buildLocation, cause: r5.cause, abortController: r5.abortController, preload: !!r5.preload, matches: u4 };
            r5.__routeContext = (null == (o6 = (s5 = a6.options).context) ? void 0 : o6.call(s5, l5)) ?? {}, r5.context = { ...i6, ...r5.__routeContext, ...r5.__beforeLoadContext };
          }
        }), u4;
      }
      comparePaths(e3, t3) {
        return e3.replace(/(.+)\/$/, "$1") === t3.replace(/(.+)\/$/, "$1");
      }
    };
    SearchParamError = class extends Error {
      static {
        __name(this, "SearchParamError");
      }
    };
    PathParamError = class extends Error {
      static {
        __name(this, "PathParamError");
      }
    };
    __name(validateSearch, "validateSearch");
    we = ["component", "errorComponent", "pendingComponent", "notFoundComponent"];
    __name(routeNeedsPreload, "routeNeedsPreload");
    BaseRoute = class {
      static {
        __name(this, "BaseRoute");
      }
      constructor(e3) {
        if (this.init = (e4) => {
          var t3, r4;
          this.originalIndex = e4.originalIndex;
          const n3 = this.options, s4 = !(null == n3 ? void 0 : n3.path) && !(null == n3 ? void 0 : n3.id);
          this.parentRoute = null == (r4 = (t3 = this.options).getParentRoute) ? void 0 : r4.call(t3), s4 ? this._path = ke : this.parentRoute || invariant$1(false);
          let o5 = s4 ? ke : null == n3 ? void 0 : n3.path;
          o5 && "/" !== o5 && (o5 = trimPathLeft$1(o5));
          const a5 = (null == n3 ? void 0 : n3.id) || o5;
          let i5 = s4 ? ke : joinPaths$1([this.parentRoute.id === ke ? "" : this.parentRoute.id, a5]);
          o5 === ke && (o5 = "/"), i5 !== ke && (i5 = joinPaths$1(["/", i5]));
          const l4 = i5 === ke ? "/" : joinPaths$1([this.parentRoute.fullPath, o5]);
          this._path = o5, this._id = i5, this._fullPath = l4, this._to = l4;
        }, this.clone = (e4) => {
          this._path = e4._path, this._id = e4._id, this._fullPath = e4._fullPath, this._to = e4._to, this.options.getParentRoute = e4.options.getParentRoute, this.children = e4.children;
        }, this.addChildren = (e4) => this._addFileChildren(e4), this._addFileChildren = (e4) => (Array.isArray(e4) && (this.children = e4), "object" == typeof e4 && null !== e4 && (this.children = Object.values(e4)), this), this._addFileTypes = () => this, this.updateLoader = (e4) => (Object.assign(this.options, e4), this), this.update = (e4) => (Object.assign(this.options, e4), this), this.lazy = (e4) => (this.lazyFn = e4, this), this.options = e3 || {}, this.isRoot = !(null == e3 ? void 0 : e3.getParentRoute), (null == e3 ? void 0 : e3.id) && (null == e3 ? void 0 : e3.path)) throw new Error("Route cannot have both an 'id' and a 'path' option.");
      }
      get to() {
        return this._to;
      }
      get id() {
        return this._id;
      }
      get path() {
        return this._path;
      }
      get fullPath() {
        return this._fullPath;
      }
    };
    BaseRootRoute = class extends BaseRoute {
      static {
        __name(this, "BaseRootRoute");
      }
      constructor(e3) {
        super(e3);
      }
    };
    __name(CatchBoundary, "CatchBoundary");
    CatchBoundaryImpl = class extends W2.Component {
      static {
        __name(this, "CatchBoundaryImpl");
      }
      constructor() {
        super(...arguments), this.state = { error: null };
      }
      static getDerivedStateFromProps(e3) {
        return { resetKey: e3.getResetKey() };
      }
      static getDerivedStateFromError(e3) {
        return { error: e3 };
      }
      reset() {
        this.setState({ error: null });
      }
      componentDidUpdate(e3, t3) {
        t3.error && t3.resetKey !== this.state.resetKey && this.reset();
      }
      componentDidCatch(e3, t3) {
        this.props.onCatch && this.props.onCatch(e3, t3);
      }
      render() {
        return this.props.children({ error: this.state.resetKey !== this.props.getResetKey() ? null : this.state.error, reset: /* @__PURE__ */ __name(() => {
          this.reset();
        }, "reset") });
      }
    };
    __name(ErrorComponent, "ErrorComponent");
    __name(ClientOnly, "ClientOnly");
    __name(subscribe, "subscribe");
    Ce = { exports: {} };
    xe = {};
    Pe = { exports: {} };
    Re = {};
    Te = W2;
    Te.useState, Te.useEffect, Te.useLayoutEffect, Te.useDebugValue;
    shim$1 = /* @__PURE__ */ __name(function(e3, t3) {
      return t3();
    }, "shim$1");
    Re.useSyncExternalStore = void 0 !== Te.useSyncExternalStore ? Te.useSyncExternalStore : shim$1, Pe.exports = Re;
    $e = Pe.exports;
    Ee = W2;
    Fe = $e;
    Ie = "function" == typeof Object.is ? Object.is : function(e3, t3) {
      return e3 === t3 && (0 !== e3 || 1 / e3 == 1 / t3) || e3 != e3 && t3 != t3;
    };
    Ae = Fe.useSyncExternalStore;
    _e = Ee.useRef;
    Me = Ee.useEffect;
    Oe = Ee.useMemo;
    Ne = Ee.useDebugValue;
    xe.useSyncExternalStoreWithSelector = function(e3, t3, r4, n3, s4) {
      var o5 = _e(null);
      if (null === o5.current) {
        var a5 = { hasValue: false, value: null };
        o5.current = a5;
      } else a5 = o5.current;
      o5 = Oe(function() {
        function memoizedSelector(t4) {
          if (!i6) {
            if (i6 = true, e4 = t4, t4 = n3(t4), void 0 !== s4 && a5.hasValue) {
              var r5 = a5.value;
              if (s4(r5, t4)) return o6 = r5;
            }
            return o6 = t4;
          }
          if (r5 = o6, Ie(e4, t4)) return r5;
          var l5 = n3(t4);
          return void 0 !== s4 && s4(r5, l5) ? (e4 = t4, r5) : (e4 = t4, o6 = l5);
        }
        __name(memoizedSelector, "memoizedSelector");
        var e4, o6, i6 = false, l4 = void 0 === r4 ? null : r4;
        return [function() {
          return memoizedSelector(t3());
        }, null === l4 ? void 0 : function() {
          return memoizedSelector(l4());
        }];
      }, [t3, r4, n3, s4]);
      var i5 = Ae(e3, o5[0], o5[1]);
      return Me(function() {
        a5.hasValue = true, a5.value = i5;
      }, [i5]), Ne(i5), i5;
    }, Ce.exports = xe;
    je = Ce.exports;
    __name(shallow, "shallow");
    Le = W2.createContext(null);
    __name(getRouterContext, "getRouterContext");
    __name(useRouter, "useRouter");
    __name(useRouterState, "useRouterState");
    De = W2.createContext(void 0);
    Be = W2.createContext(void 0);
    __name(useMatch, "useMatch");
    __name(useLoaderData, "useLoaderData");
    __name(useLoaderDeps, "useLoaderDeps");
    __name(useParams, "useParams");
    __name(useSearch, "useSearch");
    __name(useNavigate, "useNavigate");
    He = { exports: {} };
    ze = {};
    qe = W2;
    __name(formatProdErrorMessage$1, "formatProdErrorMessage$1");
    __name(noop$4, "noop$4");
    Ue = { d: { f: noop$4, r: /* @__PURE__ */ __name(function() {
      throw Error(formatProdErrorMessage$1(522));
    }, "r"), D: noop$4, C: noop$4, L: noop$4, m: noop$4, X: noop$4, S: noop$4, M: noop$4 }, p: 0, findDOMNode: null };
    Ve = Symbol.for("react.portal");
    We = qe.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    __name(getCrossOriginStringAs, "getCrossOriginStringAs");
    ze.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Ue, ze.createPortal = function(e3, t3) {
      var r4 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
      if (!t3 || 1 !== t3.nodeType && 9 !== t3.nodeType && 11 !== t3.nodeType) throw Error(formatProdErrorMessage$1(299));
      return function(e4, t4, r5) {
        var n3 = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
        return { $$typeof: Ve, key: null == n3 ? null : "" + n3, children: e4, containerInfo: t4, implementation: r5 };
      }(e3, t3, null, r4);
    }, ze.flushSync = function(e3) {
      var t3 = We.T, r4 = Ue.p;
      try {
        if (We.T = null, Ue.p = 2, e3) return e3();
      } finally {
        We.T = t3, Ue.p = r4, Ue.d.f();
      }
    }, ze.preconnect = function(e3, t3) {
      "string" == typeof e3 && (t3 ? t3 = "string" == typeof (t3 = t3.crossOrigin) ? "use-credentials" === t3 ? t3 : "" : void 0 : t3 = null, Ue.d.C(e3, t3));
    }, ze.prefetchDNS = function(e3) {
      "string" == typeof e3 && Ue.d.D(e3);
    }, ze.preinit = function(e3, t3) {
      if ("string" == typeof e3 && t3 && "string" == typeof t3.as) {
        var r4 = t3.as, n3 = getCrossOriginStringAs(r4, t3.crossOrigin), s4 = "string" == typeof t3.integrity ? t3.integrity : void 0, o5 = "string" == typeof t3.fetchPriority ? t3.fetchPriority : void 0;
        "style" === r4 ? Ue.d.S(e3, "string" == typeof t3.precedence ? t3.precedence : void 0, { crossOrigin: n3, integrity: s4, fetchPriority: o5 }) : "script" === r4 && Ue.d.X(e3, { crossOrigin: n3, integrity: s4, fetchPriority: o5, nonce: "string" == typeof t3.nonce ? t3.nonce : void 0 });
      }
    }, ze.preinitModule = function(e3, t3) {
      if ("string" == typeof e3) if ("object" == typeof t3 && null !== t3) {
        if (null == t3.as || "script" === t3.as) {
          var r4 = getCrossOriginStringAs(t3.as, t3.crossOrigin);
          Ue.d.M(e3, { crossOrigin: r4, integrity: "string" == typeof t3.integrity ? t3.integrity : void 0, nonce: "string" == typeof t3.nonce ? t3.nonce : void 0 });
        }
      } else null == t3 && Ue.d.M(e3);
    }, ze.preload = function(e3, t3) {
      if ("string" == typeof e3 && "object" == typeof t3 && null !== t3 && "string" == typeof t3.as) {
        var r4 = t3.as, n3 = getCrossOriginStringAs(r4, t3.crossOrigin);
        Ue.d.L(e3, r4, { crossOrigin: n3, integrity: "string" == typeof t3.integrity ? t3.integrity : void 0, nonce: "string" == typeof t3.nonce ? t3.nonce : void 0, type: "string" == typeof t3.type ? t3.type : void 0, fetchPriority: "string" == typeof t3.fetchPriority ? t3.fetchPriority : void 0, referrerPolicy: "string" == typeof t3.referrerPolicy ? t3.referrerPolicy : void 0, imageSrcSet: "string" == typeof t3.imageSrcSet ? t3.imageSrcSet : void 0, imageSizes: "string" == typeof t3.imageSizes ? t3.imageSizes : void 0, media: "string" == typeof t3.media ? t3.media : void 0 });
      }
    }, ze.preloadModule = function(e3, t3) {
      if ("string" == typeof e3) if (t3) {
        var r4 = getCrossOriginStringAs(t3.as, t3.crossOrigin);
        Ue.d.m(e3, { as: "string" == typeof t3.as && "script" !== t3.as ? t3.as : void 0, crossOrigin: r4, integrity: "string" == typeof t3.integrity ? t3.integrity : void 0 });
      } else Ue.d.m(e3);
    }, ze.requestFormReset = function(e3) {
      Ue.d.r(e3);
    }, ze.unstable_batchedUpdates = function(e3, t3) {
      return e3(t3);
    }, ze.useFormState = function(e3, t3, r4) {
      return We.H.useFormState(e3, t3, r4);
    }, ze.useFormStatus = function() {
      return We.H.useHostTransitionStatus();
    }, ze.version = "19.1.0", (/* @__PURE__ */ __name(function checkDCE() {
      if ("undefined" != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" == typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE) try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (e3) {
        console.error(e3);
      }
    }, "checkDCE"))(), He.exports = ze;
    Ke = He.exports;
    Qe = getDefaultExportFromCjs(Ke);
    Ge = W2.useEffect;
    __name(usePrevious, "usePrevious");
    __name(useLinkProps, "useLinkProps");
    Je = W2.forwardRef((e3, t3) => {
      const { _asChild: r4, ...n3 } = e3, { type: s4, ref: o5, ...a5 } = useLinkProps(n3, t3), i5 = "function" == typeof n3.children ? n3.children({ isActive: "active" === a5["data-status"] }) : n3.children;
      return void 0 === r4 && delete a5.disabled, W2.createElement(r4 || "a", { ...a5, ref: o5 }, i5);
    });
    Ye = class extends BaseRoute {
      static {
        __name(this, "Ye");
      }
      constructor(e3) {
        super(e3), this.useMatch = (e4) => useMatch({ select: null == e4 ? void 0 : e4.select, from: this.id, structuralSharing: null == e4 ? void 0 : e4.structuralSharing }), this.useRouteContext = (e4) => useMatch({ ...e4, from: this.id, select: /* @__PURE__ */ __name((t3) => (null == e4 ? void 0 : e4.select) ? e4.select(t3.context) : t3.context, "select") }), this.useSearch = (e4) => useSearch({ select: null == e4 ? void 0 : e4.select, structuralSharing: null == e4 ? void 0 : e4.structuralSharing, from: this.id }), this.useParams = (e4) => useParams({ select: null == e4 ? void 0 : e4.select, structuralSharing: null == e4 ? void 0 : e4.structuralSharing, from: this.id }), this.useLoaderDeps = (e4) => useLoaderDeps({ ...e4, from: this.id }), this.useLoaderData = (e4) => useLoaderData({ ...e4, from: this.id }), this.useNavigate = () => useNavigate({ from: this.fullPath }), this.Link = K2.forwardRef((e4, t3) => X2.jsx(Je, { ref: t3, from: this.fullPath, ...e4 })), this.$$typeof = Symbol.for("react.memo");
      }
    };
    RootRoute = class extends BaseRootRoute {
      static {
        __name(this, "RootRoute");
      }
      constructor(e3) {
        super(e3), this.useMatch = (e4) => useMatch({ select: null == e4 ? void 0 : e4.select, from: this.id, structuralSharing: null == e4 ? void 0 : e4.structuralSharing }), this.useRouteContext = (e4) => useMatch({ ...e4, from: this.id, select: /* @__PURE__ */ __name((t3) => (null == e4 ? void 0 : e4.select) ? e4.select(t3.context) : t3.context, "select") }), this.useSearch = (e4) => useSearch({ select: null == e4 ? void 0 : e4.select, structuralSharing: null == e4 ? void 0 : e4.structuralSharing, from: this.id }), this.useParams = (e4) => useParams({ select: null == e4 ? void 0 : e4.select, structuralSharing: null == e4 ? void 0 : e4.structuralSharing, from: this.id }), this.useLoaderDeps = (e4) => useLoaderDeps({ ...e4, from: this.id }), this.useLoaderData = (e4) => useLoaderData({ ...e4, from: this.id }), this.useNavigate = () => useNavigate({ from: this.fullPath }), this.Link = K2.forwardRef((e4, t3) => X2.jsx(Je, { ref: t3, from: this.fullPath, ...e4 })), this.$$typeof = Symbol.for("react.memo");
      }
    };
    __name(createFileRoute, "createFileRoute");
    FileRoute = class {
      static {
        __name(this, "FileRoute");
      }
      constructor(e3, t3) {
        this.path = e3, this.createRoute = (e4) => {
          ee(this.silent, "FileRoute is deprecated and will be removed in the next major version. Use the createFileRoute(path)(options) function instead.");
          const t4 = function(e5) {
            return new Ye(e5);
          }(e4);
          return t4.isRoot = false, t4;
        }, this.silent = null == t3 ? void 0 : t3.silent;
      }
    };
    LazyRoute = class {
      static {
        __name(this, "LazyRoute");
      }
      constructor(e3) {
        this.useMatch = (e4) => useMatch({ select: null == e4 ? void 0 : e4.select, from: this.options.id, structuralSharing: null == e4 ? void 0 : e4.structuralSharing }), this.useRouteContext = (e4) => useMatch({ from: this.options.id, select: /* @__PURE__ */ __name((t3) => (null == e4 ? void 0 : e4.select) ? e4.select(t3.context) : t3.context, "select") }), this.useSearch = (e4) => useSearch({ select: null == e4 ? void 0 : e4.select, structuralSharing: null == e4 ? void 0 : e4.structuralSharing, from: this.options.id }), this.useParams = (e4) => useParams({ select: null == e4 ? void 0 : e4.select, structuralSharing: null == e4 ? void 0 : e4.structuralSharing, from: this.options.id }), this.useLoaderDeps = (e4) => useLoaderDeps({ ...e4, from: this.options.id }), this.useLoaderData = (e4) => useLoaderData({ ...e4, from: this.options.id }), this.useNavigate = () => useNavigate({ from: useRouter().routesById[this.options.id].fullPath }), this.options = e3, this.$$typeof = Symbol.for("react.memo");
      }
    };
    __name(Transitioner, "Transitioner");
    __name(CatchNotFound, "CatchNotFound");
    __name(DefaultGlobalNotFound, "DefaultGlobalNotFound");
    __name(SafeFragment, "SafeFragment");
    __name(renderRouteNotFound, "renderRouteNotFound");
    __name(ScriptOnce, "ScriptOnce");
    __name(ScrollRestoration, "ScrollRestoration");
    Xe = W2.memo(function({ matchId: e3 }) {
      var t3, r4;
      const n3 = useRouter(), s4 = useRouterState({ select: /* @__PURE__ */ __name((t4) => {
        const r5 = t4.matches.find((t5) => t5.id === e3);
        return invariant$1(r5), pick(r5, ["routeId", "ssr", "_displayPending"]);
      }, "select"), structuralSharing: true }), o5 = n3.routesById[s4.routeId], a5 = o5.options.pendingComponent ?? n3.options.defaultPendingComponent, i5 = a5 ? X2.jsx(a5, {}) : null, l4 = o5.options.errorComponent ?? n3.options.defaultErrorComponent, u4 = o5.options.onCatch ?? n3.options.defaultOnCatch, c4 = o5.isRoot ? o5.options.notFoundComponent ?? (null == (t3 = n3.options.notFoundRoute) ? void 0 : t3.options.component) : o5.options.notFoundComponent, d4 = false === s4.ssr || "data-only" === s4.ssr, h4 = (!o5.isRoot || o5.options.wrapInSuspense || d4) && (o5.options.wrapInSuspense ?? a5 ?? ((null == (r4 = o5.options.errorComponent) ? void 0 : r4.preload) || d4)) ? W2.Suspense : SafeFragment, p4 = l4 ? CatchBoundary : SafeFragment, f4 = c4 ? CatchNotFound : SafeFragment, m5 = useRouterState({ select: /* @__PURE__ */ __name((e4) => e4.loadedAt, "select") }), g3 = useRouterState({ select: /* @__PURE__ */ __name((t4) => {
        var r5;
        const n4 = t4.matches.findIndex((t5) => t5.id === e3);
        return null == (r5 = t4.matches[n4 - 1]) ? void 0 : r5.routeId;
      }, "select") }), y3 = o5.isRoot ? o5.options.shellComponent ?? SafeFragment : SafeFragment;
      return X2.jsxs(y3, { children: [X2.jsx(De.Provider, { value: e3, children: X2.jsx(h4, { fallback: i5, children: X2.jsx(p4, { getResetKey: /* @__PURE__ */ __name(() => m5, "getResetKey"), errorComponent: l4 || ErrorComponent, onCatch: /* @__PURE__ */ __name((t4, r5) => {
        if (isNotFound$1(t4)) throw t4;
        ee(false, `Error in route match: ${e3}`), null == u4 || u4(t4, r5);
      }, "onCatch"), children: X2.jsx(f4, { fallback: /* @__PURE__ */ __name((e4) => {
        if (!c4 || e4.routeId && e4.routeId !== s4.routeId || !e4.routeId && !o5.isRoot) throw e4;
        return W2.createElement(c4, e4);
      }, "fallback"), children: d4 || s4._displayPending ? X2.jsx(ClientOnly, { fallback: i5, children: X2.jsx(Ze, { matchId: e3 }) }) : X2.jsx(Ze, { matchId: e3 }) }) }) }) }), g3 === ke && n3.options.scrollRestoration ? X2.jsxs(X2.Fragment, { children: [X2.jsx(OnRendered, {}), X2.jsx(ScrollRestoration, {})] }) : null] });
    });
    __name(OnRendered, "OnRendered");
    Ze = W2.memo(function({ matchId: e3 }) {
      var t3, r4, n3, s4, o5;
      const a5 = useRouter(), { match: i5, key: l4, routeId: u4 } = useRouterState({ select: /* @__PURE__ */ __name((t4) => {
        const r5 = t4.matches.findIndex((t5) => t5.id === e3), n4 = t4.matches[r5], s5 = n4.routeId, o6 = a5.routesById[s5].options.remountDeps ?? a5.options.defaultRemountDeps, i6 = null == o6 ? void 0 : o6({ routeId: s5, loaderDeps: n4.loaderDeps, params: n4._strictParams, search: n4._strictSearch });
        return { key: i6 ? JSON.stringify(i6) : void 0, routeId: s5, match: pick(n4, ["id", "status", "error", "_forcePending", "_displayPending"]) };
      }, "select"), structuralSharing: true }), c4 = a5.routesById[u4], d4 = W2.useMemo(() => {
        const e4 = c4.options.component ?? a5.options.defaultComponent;
        return e4 ? X2.jsx(e4, {}, l4) : X2.jsx(et, {});
      }, [l4, c4.options.component, a5.options.defaultComponent]);
      if (i5._displayPending) throw null == (t3 = a5.getMatch(i5.id)) ? void 0 : t3.displayPendingPromise;
      if (i5._forcePending) throw null == (r4 = a5.getMatch(i5.id)) ? void 0 : r4.minPendingPromise;
      if ("pending" === i5.status) {
        const e4 = c4.options.pendingMinMs ?? a5.options.defaultPendingMinMs;
        if (e4 && !(null == (n3 = a5.getMatch(i5.id)) ? void 0 : n3.minPendingPromise) && !a5.isServer) {
          const t4 = createControlledPromise$1();
          Promise.resolve().then(() => {
            a5.updateMatch(i5.id, (e5) => ({ ...e5, minPendingPromise: t4 }));
          }), setTimeout(() => {
            t4.resolve(), a5.updateMatch(i5.id, (e5) => ({ ...e5, minPendingPromise: void 0 }));
          }, e4);
        }
        throw null == (s4 = a5.getMatch(i5.id)) ? void 0 : s4.loadPromise;
      }
      if ("notFound" === i5.status) return invariant$1(isNotFound$1(i5.error)), renderRouteNotFound(a5, c4, i5.error);
      if ("redirected" === i5.status) throw invariant$1(isRedirect$1(i5.error)), null == (o5 = a5.getMatch(i5.id)) ? void 0 : o5.loadPromise;
      if ("error" === i5.status) {
        if (a5.isServer) {
          const e4 = (c4.options.errorComponent ?? a5.options.defaultErrorComponent) || ErrorComponent;
          return X2.jsx(e4, { error: i5.error, reset: void 0, info: { componentStack: "" } });
        }
        throw i5.error;
      }
      return d4;
    });
    et = W2.memo(function() {
      const e3 = useRouter(), t3 = W2.useContext(De), r4 = useRouterState({ select: /* @__PURE__ */ __name((e4) => {
        var r5;
        return null == (r5 = e4.matches.find((e5) => e5.id === t3)) ? void 0 : r5.routeId;
      }, "select") }), n3 = e3.routesById[r4], s4 = useRouterState({ select: /* @__PURE__ */ __name((e4) => {
        const r5 = e4.matches.find((e5) => e5.id === t3);
        return invariant$1(r5), r5.globalNotFound;
      }, "select") }), o5 = useRouterState({ select: /* @__PURE__ */ __name((e4) => {
        var r5;
        const n4 = e4.matches, s5 = n4.findIndex((e5) => e5.id === t3);
        return null == (r5 = n4[s5 + 1]) ? void 0 : r5.id;
      }, "select") }), a5 = e3.options.defaultPendingComponent ? X2.jsx(e3.options.defaultPendingComponent, {}) : null;
      if (s4) return renderRouteNotFound(e3, n3, void 0);
      if (!o5) return null;
      const i5 = X2.jsx(Xe, { matchId: o5 });
      return t3 === ke ? X2.jsx(W2.Suspense, { fallback: a5, children: i5 }) : i5;
    });
    __name(Matches, "Matches");
    __name(MatchesInner, "MatchesInner");
    Router = class extends RouterCore {
      static {
        __name(this, "Router");
      }
      constructor(e3) {
        super(e3);
      }
    };
    __name(RouterContextProvider, "RouterContextProvider");
    __name(RouterProvider, "RouterProvider");
    __name(Asset, "Asset");
    __name(Script, "Script");
    "undefined" != typeof globalThis && (globalThis.createFileRoute = createFileRoute, globalThis.createLazyFileRoute = function(e3) {
      return "object" == typeof e3 ? new LazyRoute(e3) : (t3) => new LazyRoute({ id: e3, ...t3 });
    });
    useTags = /* @__PURE__ */ __name(() => {
      const e3 = useRouter(), t3 = useRouterState({ select: /* @__PURE__ */ __name((e4) => e4.matches.map((e5) => e5.meta).filter(Boolean), "select") }), r4 = W2.useMemo(() => {
        const e4 = [], r5 = {};
        let n4;
        return [...t3].reverse().forEach((t4) => {
          [...t4].reverse().forEach((t5) => {
            if (t5) if (t5.title) n4 || (n4 = { tag: "title", children: t5.title });
            else {
              const n5 = t5.name ?? t5.property;
              if (n5) {
                if (r5[n5]) return;
                r5[n5] = true;
              }
              e4.push({ tag: "meta", attrs: { ...t5 } });
            }
          });
        }), n4 && e4.push(n4), e4.reverse(), e4;
      }, [t3]), n3 = useRouterState({ select: /* @__PURE__ */ __name((t4) => {
        var r5;
        const n4 = t4.matches.map((e4) => e4.links).filter(Boolean).flat(1).map((e4) => ({ tag: "link", attrs: { ...e4 } })), s5 = null == (r5 = e3.ssr) ? void 0 : r5.manifest;
        return [...n4, ...t4.matches.map((e4) => {
          var t5;
          return (null == (t5 = null == s5 ? void 0 : s5.routes[e4.routeId]) ? void 0 : t5.assets) ?? [];
        }).filter(Boolean).flat(1).filter((e4) => "link" === e4.tag).map((e4) => ({ tag: "link", attrs: { ...e4.attrs, suppressHydrationWarning: true } }))];
      }, "select"), structuralSharing: true }), s4 = useRouterState({ select: /* @__PURE__ */ __name((t4) => {
        const r5 = [];
        return t4.matches.map((t5) => e3.looseRoutesById[t5.routeId]).forEach((t5) => {
          var n4, s5, o5, a5;
          return null == (a5 = null == (o5 = null == (s5 = null == (n4 = e3.ssr) ? void 0 : n4.manifest) ? void 0 : s5.routes[t5.id]) ? void 0 : o5.preloads) ? void 0 : a5.filter(Boolean).forEach((e4) => {
            r5.push({ tag: "link", attrs: { rel: "modulepreload", href: e4 } });
          });
        }), r5;
      }, "select"), structuralSharing: true });
      return function(e4, t4) {
        const r5 = /* @__PURE__ */ new Set();
        return e4.filter((e5) => {
          const n4 = t4(e5);
          return !r5.has(n4) && (r5.add(n4), true);
        });
      }([...r4, ...s4, ...n3, ...useRouterState({ select: /* @__PURE__ */ __name((e4) => e4.matches.map((e5) => e5.styles).flat(1).filter(Boolean).map(({ children: e5, ...t4 }) => ({ tag: "style", attrs: t4, children: e5 })), "select"), structuralSharing: true }), ...useRouterState({ select: /* @__PURE__ */ __name((e4) => e4.matches.map((e5) => e5.headScripts).flat(1).filter(Boolean).map(({ children: e5, ...t4 }) => ({ tag: "script", attrs: { ...t4 }, children: e5 })), "select"), structuralSharing: true })], (e4) => JSON.stringify(e4));
    }, "useTags");
    __name(HeadContent, "HeadContent");
    Scripts = /* @__PURE__ */ __name(() => {
      const e3 = useRouter(), t3 = useRouterState({ select: /* @__PURE__ */ __name((t4) => {
        var r5;
        const n4 = [], s4 = null == (r5 = e3.ssr) ? void 0 : r5.manifest;
        return s4 ? (t4.matches.map((t5) => e3.looseRoutesById[t5.routeId]).forEach((e4) => {
          var t5, r6;
          return null == (r6 = null == (t5 = s4.routes[e4.id]) ? void 0 : t5.assets) ? void 0 : r6.filter((e5) => "script" === e5.tag).forEach((e5) => {
            n4.push({ tag: "script", attrs: e5.attrs, children: e5.children });
          });
        }), n4) : [];
      }, "select"), structuralSharing: true }), { scripts: r4 } = useRouterState({ select: /* @__PURE__ */ __name((e4) => ({ scripts: e4.matches.map((e5) => e5.scripts).flat(1).filter(Boolean).map(({ children: e5, ...t4 }) => ({ tag: "script", attrs: { ...t4, suppressHydrationWarning: true }, children: e5 })) }), "select"), structuralSharing: true }), n3 = [...r4, ...t3];
      return X2.jsx(X2.Fragment, { children: n3.map((e4, t4) => W2.createElement(Asset, { ...e4, key: `tsr-scripts-${e4.tag}-${t4}` })) });
    }, "Scripts");
    __name(routerWithQueryClient, "routerWithQueryClient");
    tt = Array(12).fill(0);
    Loader = /* @__PURE__ */ __name(({ visible: e3, className: t3 }) => K2.createElement("div", { className: ["sonner-loading-wrapper", t3].filter(Boolean).join(" "), "data-visible": e3 }, K2.createElement("div", { className: "sonner-spinner" }, tt.map((e4, t4) => K2.createElement("div", { className: "sonner-loading-bar", key: `spinner-bar-${t4}` })))), "Loader");
    rt = K2.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, K2.createElement("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z", clipRule: "evenodd" }));
    nt = K2.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", height: "20", width: "20" }, K2.createElement("path", { fillRule: "evenodd", d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z", clipRule: "evenodd" }));
    st = K2.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, K2.createElement("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z", clipRule: "evenodd" }));
    ot = K2.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, K2.createElement("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z", clipRule: "evenodd" }));
    at = K2.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }, K2.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), K2.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }));
    it = 1;
    lt = new class {
      constructor() {
        this.subscribe = (e3) => (this.subscribers.push(e3), () => {
          const t3 = this.subscribers.indexOf(e3);
          this.subscribers.splice(t3, 1);
        }), this.publish = (e3) => {
          this.subscribers.forEach((t3) => t3(e3));
        }, this.addToast = (e3) => {
          this.publish(e3), this.toasts = [...this.toasts, e3];
        }, this.create = (e3) => {
          var t3;
          const { message: r4, ...n3 } = e3, s4 = "number" == typeof (null == e3 ? void 0 : e3.id) || (null == (t3 = e3.id) ? void 0 : t3.length) > 0 ? e3.id : it++, o5 = this.toasts.find((e4) => e4.id === s4), a5 = void 0 === e3.dismissible || e3.dismissible;
          return this.dismissedToasts.has(s4) && this.dismissedToasts.delete(s4), o5 ? this.toasts = this.toasts.map((t4) => t4.id === s4 ? (this.publish({ ...t4, ...e3, id: s4, title: r4 }), { ...t4, ...e3, id: s4, dismissible: a5, title: r4 }) : t4) : this.addToast({ title: r4, ...n3, dismissible: a5, id: s4 }), s4;
        }, this.dismiss = (e3) => (e3 ? (this.dismissedToasts.add(e3), requestAnimationFrame(() => this.subscribers.forEach((t3) => t3({ id: e3, dismiss: true })))) : this.toasts.forEach((e4) => {
          this.subscribers.forEach((t3) => t3({ id: e4.id, dismiss: true }));
        }), e3), this.message = (e3, t3) => this.create({ ...t3, message: e3 }), this.error = (e3, t3) => this.create({ ...t3, message: e3, type: "error" }), this.success = (e3, t3) => this.create({ ...t3, type: "success", message: e3 }), this.info = (e3, t3) => this.create({ ...t3, type: "info", message: e3 }), this.warning = (e3, t3) => this.create({ ...t3, type: "warning", message: e3 }), this.loading = (e3, t3) => this.create({ ...t3, type: "loading", message: e3 }), this.promise = (e3, t3) => {
          if (!t3) return;
          let r4;
          void 0 !== t3.loading && (r4 = this.create({ ...t3, promise: e3, type: "loading", message: t3.loading, description: "function" != typeof t3.description ? t3.description : void 0 }));
          const n3 = Promise.resolve(e3 instanceof Function ? e3() : e3);
          let s4, o5 = void 0 !== r4;
          const a5 = n3.then(async (e4) => {
            s4 = ["resolve", e4];
            if (K2.isValidElement(e4)) o5 = false, this.create({ id: r4, type: "default", message: e4 });
            else if (isHttpResponse(e4) && !e4.ok) {
              o5 = false;
              const n4 = "function" == typeof t3.error ? await t3.error(`HTTP error! status: ${e4.status}`) : t3.error, s5 = "function" == typeof t3.description ? await t3.description(`HTTP error! status: ${e4.status}`) : t3.description, a6 = "object" == typeof n4 && !K2.isValidElement(n4) ? n4 : { message: n4 };
              this.create({ id: r4, type: "error", description: s5, ...a6 });
            } else if (e4 instanceof Error) {
              o5 = false;
              const n4 = "function" == typeof t3.error ? await t3.error(e4) : t3.error, s5 = "function" == typeof t3.description ? await t3.description(e4) : t3.description, a6 = "object" == typeof n4 && !K2.isValidElement(n4) ? n4 : { message: n4 };
              this.create({ id: r4, type: "error", description: s5, ...a6 });
            } else if (void 0 !== t3.success) {
              o5 = false;
              const n4 = "function" == typeof t3.success ? await t3.success(e4) : t3.success, s5 = "function" == typeof t3.description ? await t3.description(e4) : t3.description, a6 = "object" == typeof n4 && !K2.isValidElement(n4) ? n4 : { message: n4 };
              this.create({ id: r4, type: "success", description: s5, ...a6 });
            }
          }).catch(async (e4) => {
            if (s4 = ["reject", e4], void 0 !== t3.error) {
              o5 = false;
              const n4 = "function" == typeof t3.error ? await t3.error(e4) : t3.error, s5 = "function" == typeof t3.description ? await t3.description(e4) : t3.description, a6 = "object" == typeof n4 && !K2.isValidElement(n4) ? n4 : { message: n4 };
              this.create({ id: r4, type: "error", description: s5, ...a6 });
            }
          }).finally(() => {
            o5 && (this.dismiss(r4), r4 = void 0), null == t3.finally || t3.finally.call(t3);
          }), unwrap = /* @__PURE__ */ __name(() => new Promise((e4, t4) => a5.then(() => "reject" === s4[0] ? t4(s4[1]) : e4(s4[1])).catch(t4)), "unwrap");
          return "string" != typeof r4 && "number" != typeof r4 ? { unwrap } : Object.assign(r4, { unwrap });
        }, this.custom = (e3, t3) => {
          const r4 = (null == t3 ? void 0 : t3.id) || it++;
          return this.create({ jsx: e3(r4), id: r4, ...t3 }), r4;
        }, this.getActiveToasts = () => this.toasts.filter((e3) => !this.dismissedToasts.has(e3.id)), this.subscribers = [], this.toasts = [], this.dismissedToasts = /* @__PURE__ */ new Set();
      }
    }();
    isHttpResponse = /* @__PURE__ */ __name((e3) => e3 && "object" == typeof e3 && "ok" in e3 && "boolean" == typeof e3.ok && "status" in e3 && "number" == typeof e3.status, "isHttpResponse");
    basicToast = /* @__PURE__ */ __name((e3, t3) => {
      const r4 = (null == t3 ? void 0 : t3.id) || it++;
      return lt.addToast({ title: e3, ...t3, id: r4 }), r4;
    }, "basicToast");
    __name(isAction, "isAction");
    Object.assign(basicToast, { success: lt.success, info: lt.info, warning: lt.warning, error: lt.error, custom: lt.custom, message: lt.message, promise: lt.promise, dismiss: lt.dismiss, loading: lt.loading }, { getHistory: /* @__PURE__ */ __name(() => lt.toasts, "getHistory"), getToasts: /* @__PURE__ */ __name(() => lt.getActiveToasts(), "getToasts") }), function(e3) {
      if ("undefined" == typeof document) return;
      let t3 = document.head || document.getElementsByTagName("head")[0], r4 = document.createElement("style");
      r4.type = "text/css", t3.appendChild(r4), r4.styleSheet ? r4.styleSheet.cssText = e3 : r4.appendChild(document.createTextNode(e3));
    }("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");
    ut = 3;
    ct = 14;
    __name(cn, "cn");
    Toast = /* @__PURE__ */ __name((e3) => {
      var t3, r4, n3, s4, o5, a5, i5, l4, u4;
      const { invert: c4, toast: d4, unstyled: h4, interacting: p4, setHeights: f4, visibleToasts: m5, heights: g3, index: y3, toasts: v3, expanded: b3, removeToast: S4, defaultRichColors: k4, closeButton: w4, style: C4, cancelButtonStyle: x3, actionButtonStyle: P4, className: R4 = "", descriptionClassName: T4 = "", duration: $3, position: E4, gap: F4, expandByDefault: I4, classNames: A4, icons: _3, closeButtonAriaLabel: M3 = "Close toast" } = e3, [O4, N4] = K2.useState(null), [j3, L4] = K2.useState(null), [D4, B3] = K2.useState(false), [H3, z3] = K2.useState(false), [q3, U4] = K2.useState(false), [V4, W4] = K2.useState(false), [Q3, G3] = K2.useState(false), [J3, Y4] = K2.useState(0), [X4, Z3] = K2.useState(0), ee3 = K2.useRef(d4.duration || $3 || 4e3), te3 = K2.useRef(null), re3 = K2.useRef(null), ne3 = 0 === y3, se3 = y3 + 1 <= m5, oe3 = d4.type, ae3 = false !== d4.dismissible, ie3 = d4.className || "", le3 = d4.descriptionClassName || "", ue3 = K2.useMemo(() => g3.findIndex((e4) => e4.toastId === d4.id) || 0, [g3, d4.id]), ce3 = K2.useMemo(() => {
        var e4;
        return null != (e4 = d4.closeButton) ? e4 : w4;
      }, [d4.closeButton, w4]), de3 = K2.useMemo(() => d4.duration || $3 || 4e3, [d4.duration, $3]), he3 = K2.useRef(0), pe3 = K2.useRef(0), fe3 = K2.useRef(0), me3 = K2.useRef(null), [ge3, ye3] = E4.split("-"), ve3 = K2.useMemo(() => g3.reduce((e4, t4, r5) => r5 >= ue3 ? e4 : e4 + t4.height, 0), [g3, ue3]), be3 = (() => {
        const [e4, t4] = K2.useState(document.hidden);
        return K2.useEffect(() => {
          const callback = /* @__PURE__ */ __name(() => {
            t4(document.hidden);
          }, "callback");
          return document.addEventListener("visibilitychange", callback), () => window.removeEventListener("visibilitychange", callback);
        }, []), e4;
      })(), Se3 = d4.invert || c4, ke3 = "loading" === oe3;
      pe3.current = K2.useMemo(() => ue3 * F4 + ve3, [ue3, ve3]), K2.useEffect(() => {
        ee3.current = de3;
      }, [de3]), K2.useEffect(() => {
        B3(true);
      }, []), K2.useEffect(() => {
        const e4 = re3.current;
        if (e4) {
          const t4 = e4.getBoundingClientRect().height;
          return Z3(t4), f4((e5) => [{ toastId: d4.id, height: t4, position: d4.position }, ...e5]), () => f4((e5) => e5.filter((e6) => e6.toastId !== d4.id));
        }
      }, [f4, d4.id]), K2.useLayoutEffect(() => {
        if (!D4) return;
        const e4 = re3.current, t4 = e4.style.height;
        e4.style.height = "auto";
        const r5 = e4.getBoundingClientRect().height;
        e4.style.height = t4, Z3(r5), f4((e5) => e5.find((e6) => e6.toastId === d4.id) ? e5.map((e6) => e6.toastId === d4.id ? { ...e6, height: r5 } : e6) : [{ toastId: d4.id, height: r5, position: d4.position }, ...e5]);
      }, [D4, d4.title, d4.description, f4, d4.id, d4.jsx, d4.action, d4.cancel]);
      const we3 = K2.useCallback(() => {
        z3(true), Y4(pe3.current), f4((e4) => e4.filter((e5) => e5.toastId !== d4.id)), setTimeout(() => {
          S4(d4);
        }, 200);
      }, [d4, S4, f4, pe3]);
      K2.useEffect(() => {
        if (d4.promise && "loading" === oe3 || d4.duration === 1 / 0 || "loading" === d4.type) return;
        let e4;
        return b3 || p4 || be3 ? (() => {
          if (fe3.current < he3.current) {
            const e5 = (/* @__PURE__ */ new Date()).getTime() - he3.current;
            ee3.current = ee3.current - e5;
          }
          fe3.current = (/* @__PURE__ */ new Date()).getTime();
        })() : ee3.current !== 1 / 0 && (he3.current = (/* @__PURE__ */ new Date()).getTime(), e4 = setTimeout(() => {
          null == d4.onAutoClose || d4.onAutoClose.call(d4, d4), we3();
        }, ee3.current)), () => clearTimeout(e4);
      }, [b3, p4, d4, oe3, be3, we3]), K2.useEffect(() => {
        d4.delete && (we3(), null == d4.onDismiss || d4.onDismiss.call(d4, d4));
      }, [we3, d4.delete]);
      const Ce3 = d4.icon || (null == _3 ? void 0 : _3[oe3]) || ((e4) => {
        switch (e4) {
          case "success":
            return rt;
          case "info":
            return st;
          case "warning":
            return nt;
          case "error":
            return ot;
          default:
            return null;
        }
      })(oe3);
      var xe3, Pe3;
      return K2.createElement("li", { tabIndex: 0, ref: re3, className: cn(R4, ie3, null == A4 ? void 0 : A4.toast, null == d4 || null == (t3 = d4.classNames) ? void 0 : t3.toast, null == A4 ? void 0 : A4.default, null == A4 ? void 0 : A4[oe3], null == d4 || null == (r4 = d4.classNames) ? void 0 : r4[oe3]), "data-sonner-toast": "", "data-rich-colors": null != (xe3 = d4.richColors) ? xe3 : k4, "data-styled": !Boolean(d4.jsx || d4.unstyled || h4), "data-mounted": D4, "data-promise": Boolean(d4.promise), "data-swiped": Q3, "data-removed": H3, "data-visible": se3, "data-y-position": ge3, "data-x-position": ye3, "data-index": y3, "data-front": ne3, "data-swiping": q3, "data-dismissible": ae3, "data-type": oe3, "data-invert": Se3, "data-swipe-out": V4, "data-swipe-direction": j3, "data-expanded": Boolean(b3 || I4 && D4), style: { "--index": y3, "--toasts-before": y3, "--z-index": v3.length - y3, "--offset": `${H3 ? J3 : pe3.current}px`, "--initial-height": I4 ? "auto" : `${X4}px`, ...C4, ...d4.style }, onDragEnd: /* @__PURE__ */ __name(() => {
        U4(false), N4(null), me3.current = null;
      }, "onDragEnd"), onPointerDown: /* @__PURE__ */ __name((e4) => {
        2 !== e4.button && !ke3 && ae3 && (te3.current = /* @__PURE__ */ new Date(), Y4(pe3.current), e4.target.setPointerCapture(e4.pointerId), "BUTTON" !== e4.target.tagName && (U4(true), me3.current = { x: e4.clientX, y: e4.clientY }));
      }, "onPointerDown"), onPointerUp: /* @__PURE__ */ __name(() => {
        var e4, t4, r5;
        if (V4 || !ae3) return;
        me3.current = null;
        const n4 = Number((null == (e4 = re3.current) ? void 0 : e4.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0), s5 = Number((null == (t4 = re3.current) ? void 0 : t4.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0), o6 = (/* @__PURE__ */ new Date()).getTime() - (null == (r5 = te3.current) ? void 0 : r5.getTime()), a6 = "x" === O4 ? n4 : s5, i6 = Math.abs(a6) / o6;
        if (Math.abs(a6) >= 45 || i6 > 0.11) return Y4(pe3.current), null == d4.onDismiss || d4.onDismiss.call(d4, d4), L4("x" === O4 ? n4 > 0 ? "right" : "left" : s5 > 0 ? "down" : "up"), we3(), void W4(true);
        var l5, u5;
        null == (l5 = re3.current) || l5.style.setProperty("--swipe-amount-x", "0px"), null == (u5 = re3.current) || u5.style.setProperty("--swipe-amount-y", "0px"), G3(false), U4(false), N4(null);
      }, "onPointerUp"), onPointerMove: /* @__PURE__ */ __name((t4) => {
        var r5, n4, s5;
        if (!me3.current || !ae3) return;
        if ((null == (r5 = window.getSelection()) ? void 0 : r5.toString().length) > 0) return;
        const o6 = t4.clientY - me3.current.y, a6 = t4.clientX - me3.current.x;
        var i6;
        const l5 = null != (i6 = e3.swipeDirections) ? i6 : function(e4) {
          const [t5, r6] = e4.split("-"), n5 = [];
          return t5 && n5.push(t5), r6 && n5.push(r6), n5;
        }(E4);
        !O4 && (Math.abs(a6) > 1 || Math.abs(o6) > 1) && N4(Math.abs(a6) > Math.abs(o6) ? "x" : "y");
        let u5 = { x: 0, y: 0 };
        const getDampening = /* @__PURE__ */ __name((e4) => 1 / (1.5 + Math.abs(e4) / 20), "getDampening");
        if ("y" === O4) {
          if (l5.includes("top") || l5.includes("bottom")) if (l5.includes("top") && o6 < 0 || l5.includes("bottom") && o6 > 0) u5.y = o6;
          else {
            const e4 = o6 * getDampening(o6);
            u5.y = Math.abs(e4) < Math.abs(o6) ? e4 : o6;
          }
        } else if ("x" === O4 && (l5.includes("left") || l5.includes("right"))) if (l5.includes("left") && a6 < 0 || l5.includes("right") && a6 > 0) u5.x = a6;
        else {
          const e4 = a6 * getDampening(a6);
          u5.x = Math.abs(e4) < Math.abs(a6) ? e4 : a6;
        }
        (Math.abs(u5.x) > 0 || Math.abs(u5.y) > 0) && G3(true), null == (n4 = re3.current) || n4.style.setProperty("--swipe-amount-x", `${u5.x}px`), null == (s5 = re3.current) || s5.style.setProperty("--swipe-amount-y", `${u5.y}px`);
      }, "onPointerMove") }, ce3 && !d4.jsx && "loading" !== oe3 ? K2.createElement("button", { "aria-label": M3, "data-disabled": ke3, "data-close-button": true, onClick: ke3 || !ae3 ? () => {
      } : () => {
        we3(), null == d4.onDismiss || d4.onDismiss.call(d4, d4);
      }, className: cn(null == A4 ? void 0 : A4.closeButton, null == d4 || null == (n3 = d4.classNames) ? void 0 : n3.closeButton) }, null != (Pe3 = null == _3 ? void 0 : _3.close) ? Pe3 : at) : null, (oe3 || d4.icon || d4.promise) && null !== d4.icon && (null !== (null == _3 ? void 0 : _3[oe3]) || d4.icon) ? K2.createElement("div", { "data-icon": "", className: cn(null == A4 ? void 0 : A4.icon, null == d4 || null == (s4 = d4.classNames) ? void 0 : s4.icon) }, d4.promise || "loading" === d4.type && !d4.icon ? d4.icon || function() {
        var e4, t4;
        return (null == _3 ? void 0 : _3.loading) ? K2.createElement("div", { className: cn(null == A4 ? void 0 : A4.loader, null == d4 || null == (t4 = d4.classNames) ? void 0 : t4.loader, "sonner-loader"), "data-visible": "loading" === oe3 }, _3.loading) : K2.createElement(Loader, { className: cn(null == A4 ? void 0 : A4.loader, null == d4 || null == (e4 = d4.classNames) ? void 0 : e4.loader), visible: "loading" === oe3 });
      }() : null, "loading" !== d4.type ? Ce3 : null) : null, K2.createElement("div", { "data-content": "", className: cn(null == A4 ? void 0 : A4.content, null == d4 || null == (o5 = d4.classNames) ? void 0 : o5.content) }, K2.createElement("div", { "data-title": "", className: cn(null == A4 ? void 0 : A4.title, null == d4 || null == (a5 = d4.classNames) ? void 0 : a5.title) }, d4.jsx ? d4.jsx : "function" == typeof d4.title ? d4.title() : d4.title), d4.description ? K2.createElement("div", { "data-description": "", className: cn(T4, le3, null == A4 ? void 0 : A4.description, null == d4 || null == (i5 = d4.classNames) ? void 0 : i5.description) }, "function" == typeof d4.description ? d4.description() : d4.description) : null), K2.isValidElement(d4.cancel) ? d4.cancel : d4.cancel && isAction(d4.cancel) ? K2.createElement("button", { "data-button": true, "data-cancel": true, style: d4.cancelButtonStyle || x3, onClick: /* @__PURE__ */ __name((e4) => {
        isAction(d4.cancel) && ae3 && (null == d4.cancel.onClick || d4.cancel.onClick.call(d4.cancel, e4), we3());
      }, "onClick"), className: cn(null == A4 ? void 0 : A4.cancelButton, null == d4 || null == (l4 = d4.classNames) ? void 0 : l4.cancelButton) }, d4.cancel.label) : null, K2.isValidElement(d4.action) ? d4.action : d4.action && isAction(d4.action) ? K2.createElement("button", { "data-button": true, "data-action": true, style: d4.actionButtonStyle || P4, onClick: /* @__PURE__ */ __name((e4) => {
        isAction(d4.action) && (null == d4.action.onClick || d4.action.onClick.call(d4.action, e4), e4.defaultPrevented || we3());
      }, "onClick"), className: cn(null == A4 ? void 0 : A4.actionButton, null == d4 || null == (u4 = d4.classNames) ? void 0 : u4.actionButton) }, d4.action.label) : null);
    }, "Toast");
    __name(getDocumentDirection, "getDocumentDirection");
    __name(assignOffset, "assignOffset");
    dt = K2.forwardRef(function(e3, t3) {
      const { invert: r4, position: n3 = "bottom-right", hotkey: s4 = ["altKey", "KeyT"], expand: o5, closeButton: a5, className: i5, offset: l4, mobileOffset: u4, theme: c4 = "light", richColors: d4, duration: h4, style: p4, visibleToasts: f4 = ut, toastOptions: m5, dir: g3 = getDocumentDirection(), gap: y3 = ct, icons: v3, containerAriaLabel: b3 = "Notifications" } = e3, [S4, k4] = K2.useState([]), w4 = K2.useMemo(() => Array.from(new Set([n3].concat(S4.filter((e4) => e4.position).map((e4) => e4.position)))), [S4, n3]), [C4, x3] = K2.useState([]), [P4, R4] = K2.useState(false), [T4, $3] = K2.useState(false), [E4, F4] = K2.useState("system" !== c4 ? c4 : "light"), I4 = K2.useRef(null), A4 = s4.join("+").replace(/Key/g, "").replace(/Digit/g, ""), _3 = K2.useRef(null), M3 = K2.useRef(false), O4 = K2.useCallback((e4) => {
        k4((t4) => {
          var r5;
          return (null == (r5 = t4.find((t5) => t5.id === e4.id)) ? void 0 : r5.delete) || lt.dismiss(e4.id), t4.filter(({ id: t5 }) => t5 !== e4.id);
        });
      }, []);
      return K2.useEffect(() => lt.subscribe((e4) => {
        e4.dismiss ? requestAnimationFrame(() => {
          k4((t4) => t4.map((t5) => t5.id === e4.id ? { ...t5, delete: true } : t5));
        }) : setTimeout(() => {
          Qe.flushSync(() => {
            k4((t4) => {
              const r5 = t4.findIndex((t5) => t5.id === e4.id);
              return -1 !== r5 ? [...t4.slice(0, r5), { ...t4[r5], ...e4 }, ...t4.slice(r5 + 1)] : [e4, ...t4];
            });
          });
        });
      }), [S4]), K2.useEffect(() => {
        "system" === c4 ? "system" === c4 && (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? F4("dark") : F4("light")) : F4(c4);
      }, [c4]), K2.useEffect(() => {
        S4.length <= 1 && R4(false);
      }, [S4]), K2.useEffect(() => {
        const handleKeyDown = /* @__PURE__ */ __name((e4) => {
          var t4;
          var r5;
          s4.every((t5) => e4[t5] || e4.code === t5) && (R4(true), null == (r5 = I4.current) || r5.focus());
          "Escape" !== e4.code || document.activeElement !== I4.current && !(null == (t4 = I4.current) ? void 0 : t4.contains(document.activeElement)) || R4(false);
        }, "handleKeyDown");
        return document.addEventListener("keydown", handleKeyDown), () => document.removeEventListener("keydown", handleKeyDown);
      }, [s4]), K2.useEffect(() => {
        if (I4.current) return () => {
          _3.current && (_3.current.focus({ preventScroll: true }), _3.current = null, M3.current = false);
        };
      }, [I4.current]), K2.createElement("section", { ref: t3, "aria-label": `${b3} ${A4}`, tabIndex: -1, "aria-live": "polite", "aria-relevant": "additions text", "aria-atomic": "false", suppressHydrationWarning: true }, w4.map((t4, n4) => {
        var s5;
        const [c5, b4] = t4.split("-");
        return S4.length ? K2.createElement("ol", { key: t4, dir: "auto" === g3 ? getDocumentDirection() : g3, tabIndex: -1, ref: I4, className: i5, "data-sonner-toaster": true, "data-sonner-theme": E4, "data-y-position": c5, "data-x-position": b4, style: { "--front-toast-height": `${(null == (s5 = C4[0]) ? void 0 : s5.height) || 0}px`, "--width": "356px", "--gap": `${y3}px`, ...p4, ...assignOffset(l4, u4) }, onBlur: /* @__PURE__ */ __name((e4) => {
          M3.current && !e4.currentTarget.contains(e4.relatedTarget) && (M3.current = false, _3.current && (_3.current.focus({ preventScroll: true }), _3.current = null));
        }, "onBlur"), onFocus: /* @__PURE__ */ __name((e4) => {
          e4.target instanceof HTMLElement && "false" === e4.target.dataset.dismissible || M3.current || (M3.current = true, _3.current = e4.relatedTarget);
        }, "onFocus"), onMouseEnter: /* @__PURE__ */ __name(() => R4(true), "onMouseEnter"), onMouseMove: /* @__PURE__ */ __name(() => R4(true), "onMouseMove"), onMouseLeave: /* @__PURE__ */ __name(() => {
          T4 || R4(false);
        }, "onMouseLeave"), onDragEnd: /* @__PURE__ */ __name(() => R4(false), "onDragEnd"), onPointerDown: /* @__PURE__ */ __name((e4) => {
          e4.target instanceof HTMLElement && "false" === e4.target.dataset.dismissible || $3(true);
        }, "onPointerDown"), onPointerUp: /* @__PURE__ */ __name(() => $3(false), "onPointerUp") }, S4.filter((e4) => !e4.position && 0 === n4 || e4.position === t4).map((n5, s6) => {
          var i6, l5;
          return K2.createElement(Toast, { key: n5.id, icons: v3, index: s6, toast: n5, defaultRichColors: d4, duration: null != (i6 = null == m5 ? void 0 : m5.duration) ? i6 : h4, className: null == m5 ? void 0 : m5.className, descriptionClassName: null == m5 ? void 0 : m5.descriptionClassName, invert: r4, visibleToasts: f4, closeButton: null != (l5 = null == m5 ? void 0 : m5.closeButton) ? l5 : a5, interacting: T4, position: t4, style: null == m5 ? void 0 : m5.style, unstyled: null == m5 ? void 0 : m5.unstyled, classNames: null == m5 ? void 0 : m5.classNames, cancelButtonStyle: null == m5 ? void 0 : m5.cancelButtonStyle, actionButtonStyle: null == m5 ? void 0 : m5.actionButtonStyle, closeButtonAriaLabel: null == m5 ? void 0 : m5.closeButtonAriaLabel, removeToast: O4, toasts: S4.filter((e4) => e4.position == n5.position), heights: C4.filter((e4) => e4.position == n5.position), setHeights: x3, expandByDefault: o5, gap: y3, expanded: P4, swipeDirections: e3.swipeDirections });
        })) : null;
      }));
    });
    ht = /(<body)/;
    pt = /(<\/body>)/;
    ft = /(<\/html>)/;
    mt = /(<head.*?>)/;
    gt = /(<\/[a-zA-Z][\w:.-]*?>)/g;
    yt = new TextDecoder();
    __name(transformStreamWithRouter, "transformStreamWithRouter");
    vt = {};
    bt = {};
    St = W2;
    kt = Ke;
    wt = Symbol.for("react.transitional.element");
    Ct = Symbol.for("react.portal");
    xt = Symbol.for("react.fragment");
    Pt = Symbol.for("react.strict_mode");
    Rt = Symbol.for("react.profiler");
    Tt = Symbol.for("react.provider");
    $t = Symbol.for("react.consumer");
    Et = Symbol.for("react.context");
    Ft = Symbol.for("react.forward_ref");
    It = Symbol.for("react.suspense");
    At = Symbol.for("react.suspense_list");
    _t = Symbol.for("react.memo");
    Mt = Symbol.for("react.lazy");
    Ot = Symbol.for("react.scope");
    Nt = Symbol.for("react.activity");
    jt = Symbol.for("react.legacy_hidden");
    Lt = Symbol.for("react.memo_cache_sentinel");
    Dt = Symbol.for("react.view_transition");
    Bt = Symbol.iterator;
    Ht = Array.isArray;
    __name(murmurhash3_32_gc$1, "murmurhash3_32_gc$1");
    __name(handleErrorInNextTick, "handleErrorInNextTick");
    zt = Promise;
    qt = "function" == typeof queueMicrotask ? queueMicrotask : function(e3) {
      zt.resolve(null).then(e3).catch(handleErrorInNextTick);
    };
    Ut = null;
    Vt = 0;
    __name(writeChunk, "writeChunk");
    __name(writeChunkAndReturn, "writeChunkAndReturn");
    __name(completeWriting, "completeWriting");
    Wt = new TextEncoder();
    __name(stringToChunk, "stringToChunk");
    __name(stringToPrecomputedChunk, "stringToPrecomputedChunk");
    __name(closeWithError, "closeWithError");
    Kt = Object.assign;
    Qt = Object.prototype.hasOwnProperty;
    Gt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");
    Jt = {};
    Yt = {};
    __name(isAttributeNameSafe$1, "isAttributeNameSafe$1");
    Xt = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
    Zt = /* @__PURE__ */ new Map([["acceptCharset", "accept-charset"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"], ["crossOrigin", "crossorigin"], ["accentHeight", "accent-height"], ["alignmentBaseline", "alignment-baseline"], ["arabicForm", "arabic-form"], ["baselineShift", "baseline-shift"], ["capHeight", "cap-height"], ["clipPath", "clip-path"], ["clipRule", "clip-rule"], ["colorInterpolation", "color-interpolation"], ["colorInterpolationFilters", "color-interpolation-filters"], ["colorProfile", "color-profile"], ["colorRendering", "color-rendering"], ["dominantBaseline", "dominant-baseline"], ["enableBackground", "enable-background"], ["fillOpacity", "fill-opacity"], ["fillRule", "fill-rule"], ["floodColor", "flood-color"], ["floodOpacity", "flood-opacity"], ["fontFamily", "font-family"], ["fontSize", "font-size"], ["fontSizeAdjust", "font-size-adjust"], ["fontStretch", "font-stretch"], ["fontStyle", "font-style"], ["fontVariant", "font-variant"], ["fontWeight", "font-weight"], ["glyphName", "glyph-name"], ["glyphOrientationHorizontal", "glyph-orientation-horizontal"], ["glyphOrientationVertical", "glyph-orientation-vertical"], ["horizAdvX", "horiz-adv-x"], ["horizOriginX", "horiz-origin-x"], ["imageRendering", "image-rendering"], ["letterSpacing", "letter-spacing"], ["lightingColor", "lighting-color"], ["markerEnd", "marker-end"], ["markerMid", "marker-mid"], ["markerStart", "marker-start"], ["overlinePosition", "overline-position"], ["overlineThickness", "overline-thickness"], ["paintOrder", "paint-order"], ["panose-1", "panose-1"], ["pointerEvents", "pointer-events"], ["renderingIntent", "rendering-intent"], ["shapeRendering", "shape-rendering"], ["stopColor", "stop-color"], ["stopOpacity", "stop-opacity"], ["strikethroughPosition", "strikethrough-position"], ["strikethroughThickness", "strikethrough-thickness"], ["strokeDasharray", "stroke-dasharray"], ["strokeDashoffset", "stroke-dashoffset"], ["strokeLinecap", "stroke-linecap"], ["strokeLinejoin", "stroke-linejoin"], ["strokeMiterlimit", "stroke-miterlimit"], ["strokeOpacity", "stroke-opacity"], ["strokeWidth", "stroke-width"], ["textAnchor", "text-anchor"], ["textDecoration", "text-decoration"], ["textRendering", "text-rendering"], ["transformOrigin", "transform-origin"], ["underlinePosition", "underline-position"], ["underlineThickness", "underline-thickness"], ["unicodeBidi", "unicode-bidi"], ["unicodeRange", "unicode-range"], ["unitsPerEm", "units-per-em"], ["vAlphabetic", "v-alphabetic"], ["vHanging", "v-hanging"], ["vIdeographic", "v-ideographic"], ["vMathematical", "v-mathematical"], ["vectorEffect", "vector-effect"], ["vertAdvY", "vert-adv-y"], ["vertOriginX", "vert-origin-x"], ["vertOriginY", "vert-origin-y"], ["wordSpacing", "word-spacing"], ["writingMode", "writing-mode"], ["xmlnsXlink", "xmlns:xlink"], ["xHeight", "x-height"]]);
    er = /["'&<>]/;
    __name(escapeTextForBrowser$1, "escapeTextForBrowser$1");
    tr = /([A-Z])/g;
    rr = /^ms-/;
    nr = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    __name(sanitizeURL$1, "sanitizeURL$1");
    sr = St.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    or = kt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    ar2 = { pending: false, data: null, method: null, action: null };
    ir = or.d;
    or.d = { f: ir.f, r: ir.r, D: /* @__PURE__ */ __name(function(e3) {
      var t3 = resolveRequest();
      if (t3) {
        var r4 = t3.resumableState, n3 = t3.renderState;
        if ("string" == typeof e3 && e3) {
          var s4, o5;
          if (!r4.dnsResources.hasOwnProperty(e3)) r4.dnsResources[e3] = null, (o5 = (r4 = n3.headers) && 0 < r4.remainingCapacity) && (s4 = "<" + ("" + e3).replace(is, escapeHrefForLinkHeaderURLContextReplacer$1) + ">; rel=dns-prefetch", o5 = 0 <= (r4.remainingCapacity -= s4.length + 2)), o5 ? (n3.resets.dns[e3] = null, r4.preconnects && (r4.preconnects += ", "), r4.preconnects += s4) : (pushLinkImpl$1(s4 = [], { href: e3, rel: "dns-prefetch" }), n3.preconnects.add(s4));
          enqueueFlush$1(t3);
        }
      } else ir.D(e3);
    }, "D"), C: /* @__PURE__ */ __name(function(e3, t3) {
      var r4 = resolveRequest();
      if (r4) {
        var n3 = r4.resumableState, s4 = r4.renderState;
        if ("string" == typeof e3 && e3) {
          var o5 = "use-credentials" === t3 ? "credentials" : "string" == typeof t3 ? "anonymous" : "default";
          if (!n3.connectResources[o5].hasOwnProperty(e3)) {
            var a5, i5;
            if (n3.connectResources[o5][e3] = null, i5 = (n3 = s4.headers) && 0 < n3.remainingCapacity) {
              if (i5 = "<" + ("" + e3).replace(is, escapeHrefForLinkHeaderURLContextReplacer$1) + ">; rel=preconnect", "string" == typeof t3) i5 += '; crossorigin="' + ("" + t3).replace(ls, escapeStringForLinkHeaderQuotedParamValueContextReplacer$1) + '"';
              a5 = i5, i5 = 0 <= (n3.remainingCapacity -= a5.length + 2);
            }
            i5 ? (s4.resets.connect[o5][e3] = null, n3.preconnects && (n3.preconnects += ", "), n3.preconnects += a5) : (pushLinkImpl$1(o5 = [], { rel: "preconnect", href: e3, crossOrigin: t3 }), s4.preconnects.add(o5));
          }
          enqueueFlush$1(r4);
        }
      } else ir.C(e3, t3);
    }, "C"), L: /* @__PURE__ */ __name(function(e3, t3, r4) {
      var n3 = resolveRequest();
      if (n3) {
        var s4 = n3.resumableState, o5 = n3.renderState;
        if (t3 && e3) {
          switch (t3) {
            case "image":
              if (r4) var a5 = r4.imageSrcSet, i5 = r4.imageSizes, l4 = r4.fetchPriority;
              var u4, c4 = a5 ? a5 + "\n" + (i5 || "") : e3;
              if (s4.imageResources.hasOwnProperty(c4)) return;
              s4.imageResources[c4] = lr, (s4 = o5.headers) && 0 < s4.remainingCapacity && "string" != typeof a5 && "high" === l4 && (u4 = getPreloadAsHeader$1(e3, t3, r4), 0 <= (s4.remainingCapacity -= u4.length + 2)) ? (o5.resets.image[c4] = lr, s4.highImagePreloads && (s4.highImagePreloads += ", "), s4.highImagePreloads += u4) : (pushLinkImpl$1(s4 = [], Kt({ rel: "preload", href: a5 ? void 0 : e3, as: t3 }, r4)), "high" === l4 ? o5.highImagePreloads.add(s4) : (o5.bulkPreloads.add(s4), o5.preloads.images.set(c4, s4)));
              break;
            case "style":
              if (s4.styleResources.hasOwnProperty(e3)) return;
              pushLinkImpl$1(a5 = [], Kt({ rel: "preload", href: e3, as: t3 }, r4)), s4.styleResources[e3] = !r4 || "string" != typeof r4.crossOrigin && "string" != typeof r4.integrity ? lr : [r4.crossOrigin, r4.integrity], o5.preloads.stylesheets.set(e3, a5), o5.bulkPreloads.add(a5);
              break;
            case "script":
              if (s4.scriptResources.hasOwnProperty(e3)) return;
              a5 = [], o5.preloads.scripts.set(e3, a5), o5.bulkPreloads.add(a5), pushLinkImpl$1(a5, Kt({ rel: "preload", href: e3, as: t3 }, r4)), s4.scriptResources[e3] = !r4 || "string" != typeof r4.crossOrigin && "string" != typeof r4.integrity ? lr : [r4.crossOrigin, r4.integrity];
              break;
            default:
              if (s4.unknownResources.hasOwnProperty(t3)) {
                if ((a5 = s4.unknownResources[t3]).hasOwnProperty(e3)) return;
              } else a5 = {}, s4.unknownResources[t3] = a5;
              if (a5[e3] = lr, (s4 = o5.headers) && 0 < s4.remainingCapacity && "font" === t3 && (c4 = getPreloadAsHeader$1(e3, t3, r4), 0 <= (s4.remainingCapacity -= c4.length + 2))) o5.resets.font[e3] = lr, s4.fontPreloads && (s4.fontPreloads += ", "), s4.fontPreloads += c4;
              else if ("font" === (pushLinkImpl$1(s4 = [], e3 = Kt({ rel: "preload", href: e3, as: t3 }, r4)), t3)) o5.fontPreloads.add(s4);
              else o5.bulkPreloads.add(s4);
          }
          enqueueFlush$1(n3);
        }
      } else ir.L(e3, t3, r4);
    }, "L"), m: /* @__PURE__ */ __name(function(e3, t3) {
      var r4 = resolveRequest();
      if (r4) {
        var n3 = r4.resumableState, s4 = r4.renderState;
        if (e3) {
          var o5 = t3 && "string" == typeof t3.as ? t3.as : "script";
          if ("script" === o5) {
            if (n3.moduleScriptResources.hasOwnProperty(e3)) return;
            o5 = [], n3.moduleScriptResources[e3] = !t3 || "string" != typeof t3.crossOrigin && "string" != typeof t3.integrity ? lr : [t3.crossOrigin, t3.integrity], s4.preloads.moduleScripts.set(e3, o5);
          } else {
            if (n3.moduleUnknownResources.hasOwnProperty(o5)) {
              var a5 = n3.unknownResources[o5];
              if (a5.hasOwnProperty(e3)) return;
            } else a5 = {}, n3.moduleUnknownResources[o5] = a5;
            o5 = [], a5[e3] = lr;
          }
          pushLinkImpl$1(o5, Kt({ rel: "modulepreload", href: e3 }, t3)), s4.bulkPreloads.add(o5), enqueueFlush$1(r4);
        }
      } else ir.m(e3, t3);
    }, "m"), X: /* @__PURE__ */ __name(function(e3, t3) {
      var r4 = resolveRequest();
      if (r4) {
        var n3 = r4.resumableState, s4 = r4.renderState;
        if (e3) {
          var o5 = n3.scriptResources.hasOwnProperty(e3) ? n3.scriptResources[e3] : void 0;
          null !== o5 && (n3.scriptResources[e3] = null, t3 = Kt({ src: e3, async: true }, t3), o5 && (2 === o5.length && adoptPreloadCredentials$1(t3, o5), e3 = s4.preloads.scripts.get(e3)) && (e3.length = 0), e3 = [], s4.scripts.add(e3), pushScriptImpl$1(e3, t3), enqueueFlush$1(r4));
        }
      } else ir.X(e3, t3);
    }, "X"), S: /* @__PURE__ */ __name(function(e3, t3, r4) {
      var n3 = resolveRequest();
      if (n3) {
        var s4 = n3.resumableState, o5 = n3.renderState;
        if (e3) {
          t3 = t3 || "default";
          var a5 = o5.styles.get(t3), i5 = s4.styleResources.hasOwnProperty(e3) ? s4.styleResources[e3] : void 0;
          null !== i5 && (s4.styleResources[e3] = null, a5 || (a5 = { precedence: stringToChunk(escapeTextForBrowser$1(t3)), rules: [], hrefs: [], sheets: /* @__PURE__ */ new Map() }, o5.styles.set(t3, a5)), t3 = { state: 0, props: Kt({ rel: "stylesheet", href: e3, "data-precedence": t3 }, r4) }, i5 && (2 === i5.length && adoptPreloadCredentials$1(t3.props, i5), (o5 = o5.preloads.stylesheets.get(e3)) && 0 < o5.length ? o5.length = 0 : t3.state = 1), a5.sheets.set(e3, t3), enqueueFlush$1(n3));
        }
      } else ir.S(e3, t3, r4);
    }, "S"), M: /* @__PURE__ */ __name(function(e3, t3) {
      var r4 = resolveRequest();
      if (r4) {
        var n3 = r4.resumableState, s4 = r4.renderState;
        if (e3) {
          var o5 = n3.moduleScriptResources.hasOwnProperty(e3) ? n3.moduleScriptResources[e3] : void 0;
          null !== o5 && (n3.moduleScriptResources[e3] = null, t3 = Kt({ src: e3, type: "module", async: true }, t3), o5 && (2 === o5.length && adoptPreloadCredentials$1(t3, o5), e3 = s4.preloads.moduleScripts.get(e3)) && (e3.length = 0), e3 = [], s4.scripts.add(e3), pushScriptImpl$1(e3, t3), enqueueFlush$1(r4));
        }
      } else ir.M(e3, t3);
    }, "M") };
    lr = [];
    stringToPrecomputedChunk('"></template>');
    ur = stringToPrecomputedChunk("<script>");
    cr = stringToPrecomputedChunk("<\/script>");
    dr = stringToPrecomputedChunk('<script src="');
    hr = stringToPrecomputedChunk('<script type="module" src="');
    pr = stringToPrecomputedChunk('" nonce="');
    fr = stringToPrecomputedChunk('" integrity="');
    mr = stringToPrecomputedChunk('" crossorigin="');
    gr = stringToPrecomputedChunk('" async=""><\/script>');
    yr = /(<\/|<)(s)(cript)/gi;
    __name(scriptReplacer$1, "scriptReplacer$1");
    vr = stringToPrecomputedChunk('<script type="importmap">');
    br = stringToPrecomputedChunk("<\/script>");
    __name(createRenderState$1, "createRenderState$1");
    __name(createResumableState$1, "createResumableState$1");
    __name(createPreambleState$1, "createPreambleState$1");
    __name(createFormatContext$1, "createFormatContext$1");
    __name(createRootFormatContext, "createRootFormatContext");
    __name(getChildFormatContext$1, "getChildFormatContext$1");
    Sr = stringToPrecomputedChunk("<!-- -->");
    __name(pushTextInstance$1, "pushTextInstance$1");
    kr = /* @__PURE__ */ new Map();
    wr = stringToPrecomputedChunk(' style="');
    Cr = stringToPrecomputedChunk(":");
    xr = stringToPrecomputedChunk(";");
    __name(pushStyleAttribute$1, "pushStyleAttribute$1");
    Pr = stringToPrecomputedChunk(" ");
    Rr = stringToPrecomputedChunk('="');
    Tr = stringToPrecomputedChunk('"');
    $r = stringToPrecomputedChunk('=""');
    __name(pushBooleanAttribute$1, "pushBooleanAttribute$1");
    __name(pushStringAttribute$1, "pushStringAttribute$1");
    Er = stringToPrecomputedChunk(escapeTextForBrowser$1("javascript:throw new Error('React form unexpectedly submitted.')"));
    Fr = stringToPrecomputedChunk('<input type="hidden"');
    __name(pushAdditionalFormField$1, "pushAdditionalFormField$1");
    __name(validateAdditionalFormField$1, "validateAdditionalFormField$1");
    __name(getCustomFormFields$1, "getCustomFormFields$1");
    __name(pushFormActionAttribute$1, "pushFormActionAttribute$1");
    __name(pushAttribute$1, "pushAttribute$1");
    Ir = stringToPrecomputedChunk(">");
    Ar = stringToPrecomputedChunk("/>");
    __name(pushInnerHTML$1, "pushInnerHTML$1");
    _r = stringToPrecomputedChunk(' selected=""');
    Mr = stringToPrecomputedChunk(`addEventListener("submit",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute("formAction");null!=f&&(e=f,b=null)}"javascript:throw new Error('React form unexpectedly submitted.')"===e&&(a.preventDefault(),b?(a=document.createElement("input"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});`);
    __name(injectFormReplayingRuntime$1, "injectFormReplayingRuntime$1");
    Or = stringToPrecomputedChunk("<!--F!-->");
    Nr = stringToPrecomputedChunk("<!--F-->");
    __name(pushLinkImpl$1, "pushLinkImpl$1");
    jr = /(<\/|<)(s)(tyle)/gi;
    __name(styleReplacer$1, "styleReplacer$1");
    __name(pushSelfClosing$1, "pushSelfClosing$1");
    __name(pushTitleImpl$1, "pushTitleImpl$1");
    __name(pushScriptImpl$1, "pushScriptImpl$1");
    __name(pushStartSingletonElement$1, "pushStartSingletonElement$1");
    __name(pushStartGenericElement$1, "pushStartGenericElement$1");
    Lr = stringToPrecomputedChunk("\n");
    Dr = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
    Br = /* @__PURE__ */ new Map();
    __name(startChunkForTag$1, "startChunkForTag$1");
    Hr = stringToPrecomputedChunk("<!DOCTYPE html>");
    __name(pushStartInstance$1, "pushStartInstance$1");
    zr = /* @__PURE__ */ new Map();
    __name(endChunkForTag$1, "endChunkForTag$1");
    __name(hoistPreambleState$1, "hoistPreambleState$1");
    __name(writeBootstrap$1, "writeBootstrap$1");
    qr = stringToPrecomputedChunk('<template id="');
    Ur = stringToPrecomputedChunk('"></template>');
    Vr = stringToPrecomputedChunk("<!--$-->");
    Wr = stringToPrecomputedChunk('<!--$?--><template id="');
    Kr = stringToPrecomputedChunk('"></template>');
    Qr = stringToPrecomputedChunk("<!--$!-->");
    Gr = stringToPrecomputedChunk("<!--/$-->");
    Jr = stringToPrecomputedChunk("<template");
    Yr = stringToPrecomputedChunk('"');
    Xr = stringToPrecomputedChunk(' data-dgst="');
    stringToPrecomputedChunk(' data-msg="'), stringToPrecomputedChunk(' data-stck="'), stringToPrecomputedChunk(' data-cstck="');
    Zr = stringToPrecomputedChunk("></template>");
    __name(writeStartPendingSuspenseBoundary$1, "writeStartPendingSuspenseBoundary$1");
    en = stringToPrecomputedChunk("<!--");
    tn = stringToPrecomputedChunk("-->");
    __name(writePreambleContribution$1, "writePreambleContribution$1");
    rn = stringToPrecomputedChunk('<div hidden id="');
    nn = stringToPrecomputedChunk('">');
    sn = stringToPrecomputedChunk("</div>");
    on2 = stringToPrecomputedChunk('<svg aria-hidden="true" style="display:none" id="');
    an = stringToPrecomputedChunk('">');
    ln = stringToPrecomputedChunk("</svg>");
    un = stringToPrecomputedChunk('<math aria-hidden="true" style="display:none" id="');
    dn = stringToPrecomputedChunk('">');
    hn = stringToPrecomputedChunk("</math>");
    pn = stringToPrecomputedChunk('<table hidden id="');
    fn = stringToPrecomputedChunk('">');
    mn = stringToPrecomputedChunk("</table>");
    gn = stringToPrecomputedChunk('<table hidden><tbody id="');
    yn = stringToPrecomputedChunk('">');
    vn = stringToPrecomputedChunk("</tbody></table>");
    bn = stringToPrecomputedChunk('<table hidden><tr id="');
    Sn = stringToPrecomputedChunk('">');
    kn = stringToPrecomputedChunk("</tr></table>");
    wn = stringToPrecomputedChunk('<table hidden><colgroup id="');
    Cn = stringToPrecomputedChunk('">');
    xn = stringToPrecomputedChunk("</colgroup></table>");
    Pn = stringToPrecomputedChunk('$RS=function(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("');
    Rn = stringToPrecomputedChunk('$RS("');
    Tn = stringToPrecomputedChunk('","');
    $n = stringToPrecomputedChunk('")<\/script>');
    stringToPrecomputedChunk('<template data-rsi="" data-sid="'), stringToPrecomputedChunk('" data-pid="');
    En = stringToPrecomputedChunk('$RC=function(b,c,e){c=document.getElementById(c);c.parentNode.removeChild(c);var a=document.getElementById(b);if(a){b=a.previousSibling;if(e)b.data="$!",a.setAttribute("data-dgst",e);else{e=b.parentNode;a=b.nextSibling;var f=0;do{if(a&&8===a.nodeType){var d=a.data;if("/$"===d)if(0===f)break;else f--;else"$"!==d&&"$?"!==d&&"$!"!==d||f++}d=a.nextSibling;e.removeChild(a);a=d}while(a);for(;c.firstChild;)e.insertBefore(c.firstChild,a);b.data="$"}b._reactRetry&&b._reactRetry()}};$RC("');
    Fn = stringToPrecomputedChunk('$RC("');
    In = stringToPrecomputedChunk('$RC=function(b,c,e){c=document.getElementById(c);c.parentNode.removeChild(c);var a=document.getElementById(b);if(a){b=a.previousSibling;if(e)b.data="$!",a.setAttribute("data-dgst",e);else{e=b.parentNode;a=b.nextSibling;var f=0;do{if(a&&8===a.nodeType){var d=a.data;if("/$"===d)if(0===f)break;else f--;else"$"!==d&&"$?"!==d&&"$!"!==d||f++}d=a.nextSibling;e.removeChild(a);a=d}while(a);for(;c.firstChild;)e.insertBefore(c.firstChild,a);b.data="$"}b._reactRetry&&b._reactRetry()}};$RM=new Map;\n$RR=function(t,u,y){function v(n){this._p=null;n()}for(var w=$RC,p=$RM,q=new Map,r=document,g,b,h=r.querySelectorAll("link[data-precedence],style[data-precedence]"),x=[],k=0;b=h[k++];)"not all"===b.getAttribute("media")?x.push(b):("LINK"===b.tagName&&p.set(b.getAttribute("href"),b),q.set(b.dataset.precedence,g=b));b=0;h=[];var l,a;for(k=!0;;){if(k){var e=y[b++];if(!e){k=!1;b=0;continue}var c=!1,m=0;var d=e[m++];if(a=p.get(d)){var f=a._p;c=!0}else{a=r.createElement("link");a.href=\nd;a.rel="stylesheet";for(a.dataset.precedence=l=e[m++];f=e[m++];)a.setAttribute(f,e[m++]);f=a._p=new Promise(function(n,z){a.onload=v.bind(a,n);a.onerror=v.bind(a,z)});p.set(d,a)}d=a.getAttribute("media");!f||d&&!matchMedia(d).matches||h.push(f);if(c)continue}else{a=x[b++];if(!a)break;l=a.getAttribute("data-precedence");a.removeAttribute("media")}c=q.get(l)||g;c===g&&(g=a);q.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=r.head,c.insertBefore(a,c.firstChild))}Promise.all(h).then(w.bind(null,\nt,u,""),w.bind(null,t,u,"Resource failed to load"))};$RR("');
    An = stringToPrecomputedChunk('$RM=new Map;\n$RR=function(t,u,y){function v(n){this._p=null;n()}for(var w=$RC,p=$RM,q=new Map,r=document,g,b,h=r.querySelectorAll("link[data-precedence],style[data-precedence]"),x=[],k=0;b=h[k++];)"not all"===b.getAttribute("media")?x.push(b):("LINK"===b.tagName&&p.set(b.getAttribute("href"),b),q.set(b.dataset.precedence,g=b));b=0;h=[];var l,a;for(k=!0;;){if(k){var e=y[b++];if(!e){k=!1;b=0;continue}var c=!1,m=0;var d=e[m++];if(a=p.get(d)){var f=a._p;c=!0}else{a=r.createElement("link");a.href=\nd;a.rel="stylesheet";for(a.dataset.precedence=l=e[m++];f=e[m++];)a.setAttribute(f,e[m++]);f=a._p=new Promise(function(n,z){a.onload=v.bind(a,n);a.onerror=v.bind(a,z)});p.set(d,a)}d=a.getAttribute("media");!f||d&&!matchMedia(d).matches||h.push(f);if(c)continue}else{a=x[b++];if(!a)break;l=a.getAttribute("data-precedence");a.removeAttribute("media")}c=q.get(l)||g;c===g&&(g=a);q.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=r.head,c.insertBefore(a,c.firstChild))}Promise.all(h).then(w.bind(null,\nt,u,""),w.bind(null,t,u,"Resource failed to load"))};$RR("');
    _n = stringToPrecomputedChunk('$RR("');
    Mn = stringToPrecomputedChunk('","');
    On = stringToPrecomputedChunk('",');
    Nn = stringToPrecomputedChunk('"');
    jn = stringToPrecomputedChunk(")<\/script>");
    stringToPrecomputedChunk('<template data-rci="" data-bid="'), stringToPrecomputedChunk('<template data-rri="" data-bid="'), stringToPrecomputedChunk('" data-sid="'), stringToPrecomputedChunk('" data-sty="');
    Ln = stringToPrecomputedChunk('$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX("');
    Dn = stringToPrecomputedChunk('$RX("');
    Bn = stringToPrecomputedChunk('"');
    Hn = stringToPrecomputedChunk(",");
    zn = stringToPrecomputedChunk(")<\/script>");
    stringToPrecomputedChunk('<template data-rxi="" data-bid="'), stringToPrecomputedChunk('" data-dgst="'), stringToPrecomputedChunk('" data-msg="'), stringToPrecomputedChunk('" data-stck="'), stringToPrecomputedChunk('" data-cstck="');
    qn = /[<\u2028\u2029]/g;
    __name(escapeJSStringsForInstructionScripts$1, "escapeJSStringsForInstructionScripts$1");
    Un = /[&><\u2028\u2029]/g;
    __name(escapeJSObjectForInstructionScripts$1, "escapeJSObjectForInstructionScripts$1");
    Vn = stringToPrecomputedChunk('<style media="not all" data-precedence="');
    Wn = stringToPrecomputedChunk('" data-href="');
    Kn = stringToPrecomputedChunk('">');
    Qn = stringToPrecomputedChunk("</style>");
    Gn = false;
    Jn = true;
    __name(flushStyleTagsLateForBoundary$1, "flushStyleTagsLateForBoundary$1");
    __name(hasStylesToHoist$1, "hasStylesToHoist$1");
    __name(writeHoistablesForBoundary$1, "writeHoistablesForBoundary$1");
    __name(flushResource$1, "flushResource$1");
    Yn = [];
    __name(flushStyleInPreamble$1, "flushStyleInPreamble$1");
    Xn = stringToPrecomputedChunk('<style data-precedence="');
    Zn = stringToPrecomputedChunk('" data-href="');
    es = stringToPrecomputedChunk(" ");
    ts = stringToPrecomputedChunk('">');
    rs = stringToPrecomputedChunk("</style>");
    __name(flushStylesInPreamble$1, "flushStylesInPreamble$1");
    __name(preloadLateStyle$1, "preloadLateStyle$1");
    __name(preloadLateStyles$1, "preloadLateStyles$1");
    ns = stringToPrecomputedChunk("[");
    ss = stringToPrecomputedChunk(",[");
    os = stringToPrecomputedChunk(",");
    as = stringToPrecomputedChunk("]");
    __name(writeStyleResourceAttributeInJS$1, "writeStyleResourceAttributeInJS$1");
    __name(createHoistableState$1, "createHoistableState$1");
    __name(adoptPreloadCredentials$1, "adoptPreloadCredentials$1");
    __name(getPreloadAsHeader$1, "getPreloadAsHeader$1");
    is = /[<>\r\n]/g;
    __name(escapeHrefForLinkHeaderURLContextReplacer$1, "escapeHrefForLinkHeaderURLContextReplacer$1");
    ls = /["';,\r\n]/g;
    __name(escapeStringForLinkHeaderQuotedParamValueContextReplacer$1, "escapeStringForLinkHeaderQuotedParamValueContextReplacer$1");
    __name(hoistStyleQueueDependency$1, "hoistStyleQueueDependency$1");
    __name(hoistStylesheetDependency$1, "hoistStylesheetDependency$1");
    us = Function.prototype.bind;
    cs = "function" == typeof AsyncLocalStorage;
    ds = cs ? new AsyncLocalStorage() : null;
    hs = Symbol.for("react.client.reference");
    __name(getComponentNameFromType$1, "getComponentNameFromType$1");
    ps = {};
    fs = null;
    __name(popToNearestCommonAncestor$1, "popToNearestCommonAncestor$1");
    __name(popAllPrevious$1, "popAllPrevious$1");
    __name(pushAllNext$1, "pushAllNext$1");
    __name(popPreviousToCommonLevel$1, "popPreviousToCommonLevel$1");
    __name(popNextToCommonLevel$1, "popNextToCommonLevel$1");
    __name(switchContext$1, "switchContext$1");
    ms = { enqueueSetState: /* @__PURE__ */ __name(function(e3, t3) {
      null !== (e3 = e3._reactInternals).queue && e3.queue.push(t3);
    }, "enqueueSetState"), enqueueReplaceState: /* @__PURE__ */ __name(function(e3, t3) {
      (e3 = e3._reactInternals).replace = true, e3.queue = [t3];
    }, "enqueueReplaceState"), enqueueForceUpdate: /* @__PURE__ */ __name(function() {
    }, "enqueueForceUpdate") };
    gs = { id: 1, overflow: "" };
    __name(pushTreeContext$1, "pushTreeContext$1");
    ys = Math.clz32 ? Math.clz32 : function(e3) {
      return 0 === (e3 >>>= 0) ? 32 : 31 - (vs(e3) / bs | 0) | 0;
    };
    vs = Math.log;
    bs = Math.LN2;
    Ss = Error("Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`.");
    __name(noop$2$1, "noop$2$1");
    ks = null;
    __name(getSuspendedThenable$1, "getSuspendedThenable$1");
    ws = "function" == typeof Object.is ? Object.is : function(e3, t3) {
      return e3 === t3 && (0 !== e3 || 1 / e3 == 1 / t3) || e3 != e3 && t3 != t3;
    };
    Cs = null;
    xs = null;
    Ps = null;
    Rs = null;
    Ts = null;
    $s = null;
    Es = false;
    Fs = false;
    Is = 0;
    As = 0;
    _s = -1;
    Ms = 0;
    Os = null;
    Ns = null;
    js = 0;
    __name(resolveCurrentlyRenderingComponent$1, "resolveCurrentlyRenderingComponent$1");
    __name(createHook$1, "createHook$1");
    __name(createWorkInProgressHook$1, "createWorkInProgressHook$1");
    __name(getThenableStateAfterSuspending$1, "getThenableStateAfterSuspending$1");
    __name(resetHooksState$1, "resetHooksState$1");
    __name(basicStateReducer$1, "basicStateReducer$1");
    __name(useReducer$1, "useReducer$1");
    __name(useMemo$1, "useMemo$1");
    __name(dispatchAction$1, "dispatchAction$1");
    __name(unsupportedStartTransition$1, "unsupportedStartTransition$1");
    __name(unsupportedSetOptimisticState$1, "unsupportedSetOptimisticState$1");
    __name(useActionState$1, "useActionState$1");
    __name(unwrapThenable$1, "unwrapThenable$1");
    __name(unsupportedRefresh$1, "unsupportedRefresh$1");
    __name(noop$1$1, "noop$1$1");
    Bs = { readContext: /* @__PURE__ */ __name(function(e3) {
      return e3._currentValue;
    }, "readContext"), use: /* @__PURE__ */ __name(function(e3) {
      if (null !== e3 && "object" == typeof e3) {
        if ("function" == typeof e3.then) return unwrapThenable$1(e3);
        if (e3.$$typeof === Et) return e3._currentValue;
      }
      throw Error("An unsupported type was passed to use(): " + String(e3));
    }, "use"), useContext: /* @__PURE__ */ __name(function(e3) {
      return resolveCurrentlyRenderingComponent$1(), e3._currentValue;
    }, "useContext"), useMemo: useMemo$1, useReducer: useReducer$1, useRef: /* @__PURE__ */ __name(function(e3) {
      Cs = resolveCurrentlyRenderingComponent$1();
      var t3 = ($s = createWorkInProgressHook$1()).memoizedState;
      return null === t3 ? (e3 = { current: e3 }, $s.memoizedState = e3) : t3;
    }, "useRef"), useState: /* @__PURE__ */ __name(function(e3) {
      return useReducer$1(basicStateReducer$1, e3);
    }, "useState"), useInsertionEffect: noop$1$1, useLayoutEffect: noop$1$1, useCallback: /* @__PURE__ */ __name(function(e3, t3) {
      return useMemo$1(function() {
        return e3;
      }, t3);
    }, "useCallback"), useImperativeHandle: noop$1$1, useEffect: noop$1$1, useDebugValue: noop$1$1, useDeferredValue: /* @__PURE__ */ __name(function(e3, t3) {
      return resolveCurrentlyRenderingComponent$1(), void 0 !== t3 ? t3 : e3;
    }, "useDeferredValue"), useTransition: /* @__PURE__ */ __name(function() {
      return resolveCurrentlyRenderingComponent$1(), [false, unsupportedStartTransition$1];
    }, "useTransition"), useId: /* @__PURE__ */ __name(function() {
      var e3 = xs.treeContext, t3 = e3.overflow;
      e3 = ((e3 = e3.id) & ~(1 << 32 - ys(e3) - 1)).toString(32) + t3;
      var r4 = Hs;
      if (null === r4) throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component.");
      return t3 = Is++, e3 = "\xAB" + r4.idPrefix + "R" + e3, 0 < t3 && (e3 += "H" + t3.toString(32)), e3 + "\xBB";
    }, "useId"), useSyncExternalStore: /* @__PURE__ */ __name(function(e3, t3, r4) {
      if (void 0 === r4) throw Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
      return r4();
    }, "useSyncExternalStore"), useOptimistic: /* @__PURE__ */ __name(function(e3) {
      return resolveCurrentlyRenderingComponent$1(), [e3, unsupportedSetOptimisticState$1];
    }, "useOptimistic"), useActionState: useActionState$1, useFormState: useActionState$1, useHostTransitionStatus: /* @__PURE__ */ __name(function() {
      return resolveCurrentlyRenderingComponent$1(), ar2;
    }, "useHostTransitionStatus"), useMemoCache: /* @__PURE__ */ __name(function(e3) {
      for (var t3 = Array(e3), r4 = 0; r4 < e3; r4++) t3[r4] = Lt;
      return t3;
    }, "useMemoCache"), useCacheRefresh: /* @__PURE__ */ __name(function() {
      return unsupportedRefresh$1;
    }, "useCacheRefresh") };
    Hs = null;
    zs = { getCacheForType: /* @__PURE__ */ __name(function() {
      throw Error("Not implemented.");
    }, "getCacheForType") };
    __name(prepareStackTrace, "prepareStackTrace");
    __name(describeBuiltInComponentFrame$1, "describeBuiltInComponentFrame$1");
    qs = false;
    __name(describeNativeComponentFrame$1, "describeNativeComponentFrame$1");
    __name(describeComponentStackByType$1, "describeComponentStackByType$1");
    __name(defaultErrorHandler$1, "defaultErrorHandler$1");
    __name(noop$3, "noop$3");
    __name(RequestInstance$1, "RequestInstance$1");
    __name(createRequest$1, "createRequest$1");
    Us = null;
    __name(resolveRequest, "resolveRequest");
    __name(pingTask$1, "pingTask$1");
    __name(createSuspenseBoundary$1, "createSuspenseBoundary$1");
    __name(createRenderTask$1, "createRenderTask$1");
    __name(createReplayTask$1, "createReplayTask$1");
    __name(createPendingSegment$1, "createPendingSegment$1");
    __name(pushComponentStack$1, "pushComponentStack$1");
    __name(getThrownInfo$1, "getThrownInfo$1");
    __name(logRecoverableError$1, "logRecoverableError$1");
    __name(fatalError$1, "fatalError$1");
    __name(renderWithHooks$1, "renderWithHooks$1");
    __name(finishFunctionComponent$1, "finishFunctionComponent$1");
    __name(renderElement$1, "renderElement$1");
    __name(resumeNode$1, "resumeNode$1");
    __name(renderNodeDestructive$1, "renderNodeDestructive$1");
    __name(retryNode$1, "retryNode$1");
    __name(renderChildrenArray$1, "renderChildrenArray$1");
    __name(untrackBoundary$1, "untrackBoundary$1");
    __name(spawnNewSuspendedReplayTask$1, "spawnNewSuspendedReplayTask$1");
    __name(spawnNewSuspendedRenderTask$1, "spawnNewSuspendedRenderTask$1");
    __name(renderNode$1, "renderNode$1");
    __name(abortTaskSoft$1, "abortTaskSoft$1");
    __name(abortRemainingReplayNodes$1, "abortRemainingReplayNodes$1");
    __name(abortTask$1, "abortTask$1");
    __name(safelyEmitEarlyPreloads$1, "safelyEmitEarlyPreloads$1");
    __name(completeShell$1, "completeShell$1");
    __name(completeAll$1, "completeAll$1");
    __name(queueCompletedSegment$1, "queueCompletedSegment$1");
    __name(finishedTask$1, "finishedTask$1");
    __name(performWork$1, "performWork$1");
    __name(preparePreambleFromSubtree$1, "preparePreambleFromSubtree$1");
    __name(preparePreambleFromSegment$1, "preparePreambleFromSegment$1");
    __name(preparePreamble$1, "preparePreamble$1");
    __name(flushSubtree$1, "flushSubtree$1");
    __name(flushSegment$1, "flushSegment$1");
    __name(flushSegmentContainer$1, "flushSegmentContainer$1");
    __name(flushCompletedBoundary$1, "flushCompletedBoundary$1");
    __name(flushPartiallyCompletedSegment$1, "flushPartiallyCompletedSegment$1");
    __name(flushCompletedQueues$1, "flushCompletedQueues$1");
    __name(startWork, "startWork");
    __name(enqueueEarlyPreloadsAfterInitialWork, "enqueueEarlyPreloadsAfterInitialWork");
    __name(enqueueFlush$1, "enqueueFlush$1");
    __name(startFlowing$1, "startFlowing$1");
    __name(abort$1, "abort$1");
    __name(ensureCorrectIsomorphicReactVersion, "ensureCorrectIsomorphicReactVersion");
    ensureCorrectIsomorphicReactVersion(), ensureCorrectIsomorphicReactVersion(), bt.prerender = function(e3, t3) {
      return new Promise(function(r4, n3) {
        var s4, o5 = t3 ? t3.onHeaders : void 0;
        o5 && (s4 = /* @__PURE__ */ __name(function(e4) {
          o5(new Headers(e4));
        }, "s"));
        var a5 = createResumableState$1(t3 ? t3.identifierPrefix : void 0, t3 && t3.unstable_externalRuntimeSrc, t3 ? t3.bootstrapScriptContent : void 0, t3 ? t3.bootstrapScripts : void 0, t3 ? t3.bootstrapModules : void 0), i5 = function(e4, t4, r5, n4, s5, o6, a6, i6, l5, u4, c4) {
          return (e4 = createRequest$1(e4, t4, r5, n4, s5, o6, a6, i6, l5, u4, c4, void 0)).trackedPostpones = { workingMap: /* @__PURE__ */ new Map(), rootNodes: [], rootSlots: null }, e4;
        }(e3, a5, createRenderState$1(a5, void 0, t3 ? t3.unstable_externalRuntimeSrc : void 0, t3 ? t3.importMap : void 0, s4, t3 ? t3.maxHeadersLength : void 0), createRootFormatContext(t3 ? t3.namespaceURI : void 0), t3 ? t3.progressiveChunkSize : void 0, t3 ? t3.onError : void 0, function() {
          var e4 = { prelude: new ReadableStream({ type: "bytes", pull: /* @__PURE__ */ __name(function(e5) {
            startFlowing$1(i5, e5);
          }, "pull"), cancel: /* @__PURE__ */ __name(function(e5) {
            i5.destination = null, abort$1(i5, e5);
          }, "cancel") }, { highWaterMark: 0 }) };
          r4(e4);
        }, void 0, void 0, n3, t3 ? t3.onPostpone : void 0);
        if (t3 && t3.signal) {
          var l4 = t3.signal;
          if (l4.aborted) abort$1(i5, l4.reason);
          else {
            var listener = /* @__PURE__ */ __name(function() {
              abort$1(i5, l4.reason), l4.removeEventListener("abort", listener);
            }, "listener");
            l4.addEventListener("abort", listener);
          }
        }
        startWork(i5);
      });
    }, bt.renderToReadableStream = function(e3, t3) {
      return new Promise(function(r4, n3) {
        var s4, o5, a5, i5 = new Promise(function(e4, t4) {
          o5 = e4, s4 = t4;
        }), l4 = t3 ? t3.onHeaders : void 0;
        l4 && (a5 = /* @__PURE__ */ __name(function(e4) {
          l4(new Headers(e4));
        }, "a"));
        var u4 = createResumableState$1(t3 ? t3.identifierPrefix : void 0, t3 && t3.unstable_externalRuntimeSrc, t3 ? t3.bootstrapScriptContent : void 0, t3 ? t3.bootstrapScripts : void 0, t3 ? t3.bootstrapModules : void 0), c4 = createRequest$1(e3, u4, createRenderState$1(u4, t3 ? t3.nonce : void 0, t3 ? t3.unstable_externalRuntimeSrc : void 0, t3 ? t3.importMap : void 0, a5, t3 ? t3.maxHeadersLength : void 0), createRootFormatContext(t3 ? t3.namespaceURI : void 0), t3 ? t3.progressiveChunkSize : void 0, t3 ? t3.onError : void 0, o5, function() {
          var e4 = new ReadableStream({ type: "bytes", pull: /* @__PURE__ */ __name(function(e5) {
            startFlowing$1(c4, e5);
          }, "pull"), cancel: /* @__PURE__ */ __name(function(e5) {
            c4.destination = null, abort$1(c4, e5);
          }, "cancel") }, { highWaterMark: 0 });
          e4.allReady = i5, r4(e4);
        }, function(e4) {
          i5.catch(function() {
          }), n3(e4);
        }, s4, t3 ? t3.onPostpone : void 0, t3 ? t3.formState : void 0);
        if (t3 && t3.signal) {
          var d4 = t3.signal;
          if (d4.aborted) abort$1(c4, d4.reason);
          else {
            var listener = /* @__PURE__ */ __name(function() {
              abort$1(c4, d4.reason), d4.removeEventListener("abort", listener);
            }, "listener");
            d4.addEventListener("abort", listener);
          }
        }
        startWork(c4);
      });
    }, bt.version = "19.1.0";
    Vs = {};
    Ws = W2;
    Ks = Ke;
    __name(formatProdErrorMessage, "formatProdErrorMessage");
    Qs = Symbol.for("react.transitional.element");
    Gs = Symbol.for("react.portal");
    Js = Symbol.for("react.fragment");
    Ys = Symbol.for("react.strict_mode");
    Xs = Symbol.for("react.profiler");
    Zs = Symbol.for("react.provider");
    eo = Symbol.for("react.consumer");
    to = Symbol.for("react.context");
    ro = Symbol.for("react.forward_ref");
    no = Symbol.for("react.suspense");
    so = Symbol.for("react.suspense_list");
    oo = Symbol.for("react.memo");
    ao = Symbol.for("react.lazy");
    io = Symbol.for("react.scope");
    lo = Symbol.for("react.activity");
    uo = Symbol.for("react.legacy_hidden");
    co = Symbol.for("react.memo_cache_sentinel");
    ho = Symbol.for("react.view_transition");
    po = Symbol.iterator;
    fo = Array.isArray;
    __name(murmurhash3_32_gc, "murmurhash3_32_gc");
    mo = Object.assign;
    go = Object.prototype.hasOwnProperty;
    yo = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");
    vo = {};
    bo = {};
    __name(isAttributeNameSafe, "isAttributeNameSafe");
    So = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
    ko = /* @__PURE__ */ new Map([["acceptCharset", "accept-charset"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"], ["crossOrigin", "crossorigin"], ["accentHeight", "accent-height"], ["alignmentBaseline", "alignment-baseline"], ["arabicForm", "arabic-form"], ["baselineShift", "baseline-shift"], ["capHeight", "cap-height"], ["clipPath", "clip-path"], ["clipRule", "clip-rule"], ["colorInterpolation", "color-interpolation"], ["colorInterpolationFilters", "color-interpolation-filters"], ["colorProfile", "color-profile"], ["colorRendering", "color-rendering"], ["dominantBaseline", "dominant-baseline"], ["enableBackground", "enable-background"], ["fillOpacity", "fill-opacity"], ["fillRule", "fill-rule"], ["floodColor", "flood-color"], ["floodOpacity", "flood-opacity"], ["fontFamily", "font-family"], ["fontSize", "font-size"], ["fontSizeAdjust", "font-size-adjust"], ["fontStretch", "font-stretch"], ["fontStyle", "font-style"], ["fontVariant", "font-variant"], ["fontWeight", "font-weight"], ["glyphName", "glyph-name"], ["glyphOrientationHorizontal", "glyph-orientation-horizontal"], ["glyphOrientationVertical", "glyph-orientation-vertical"], ["horizAdvX", "horiz-adv-x"], ["horizOriginX", "horiz-origin-x"], ["imageRendering", "image-rendering"], ["letterSpacing", "letter-spacing"], ["lightingColor", "lighting-color"], ["markerEnd", "marker-end"], ["markerMid", "marker-mid"], ["markerStart", "marker-start"], ["overlinePosition", "overline-position"], ["overlineThickness", "overline-thickness"], ["paintOrder", "paint-order"], ["panose-1", "panose-1"], ["pointerEvents", "pointer-events"], ["renderingIntent", "rendering-intent"], ["shapeRendering", "shape-rendering"], ["stopColor", "stop-color"], ["stopOpacity", "stop-opacity"], ["strikethroughPosition", "strikethrough-position"], ["strikethroughThickness", "strikethrough-thickness"], ["strokeDasharray", "stroke-dasharray"], ["strokeDashoffset", "stroke-dashoffset"], ["strokeLinecap", "stroke-linecap"], ["strokeLinejoin", "stroke-linejoin"], ["strokeMiterlimit", "stroke-miterlimit"], ["strokeOpacity", "stroke-opacity"], ["strokeWidth", "stroke-width"], ["textAnchor", "text-anchor"], ["textDecoration", "text-decoration"], ["textRendering", "text-rendering"], ["transformOrigin", "transform-origin"], ["underlinePosition", "underline-position"], ["underlineThickness", "underline-thickness"], ["unicodeBidi", "unicode-bidi"], ["unicodeRange", "unicode-range"], ["unitsPerEm", "units-per-em"], ["vAlphabetic", "v-alphabetic"], ["vHanging", "v-hanging"], ["vIdeographic", "v-ideographic"], ["vMathematical", "v-mathematical"], ["vectorEffect", "vector-effect"], ["vertAdvY", "vert-adv-y"], ["vertOriginX", "vert-origin-x"], ["vertOriginY", "vert-origin-y"], ["wordSpacing", "word-spacing"], ["writingMode", "writing-mode"], ["xmlnsXlink", "xmlns:xlink"], ["xHeight", "x-height"]]);
    wo = /["'&<>]/;
    __name(escapeTextForBrowser, "escapeTextForBrowser");
    Co = /([A-Z])/g;
    xo = /^ms-/;
    Po = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    __name(sanitizeURL, "sanitizeURL");
    Ro = Ws.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    To = Ks.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    $o = { pending: false, data: null, method: null, action: null };
    Eo = To.d;
    To.d = { f: Eo.f, r: Eo.r, D: /* @__PURE__ */ __name(function(e3) {
      var t3 = Ra || null;
      if (t3) {
        var r4 = t3.resumableState, n3 = t3.renderState;
        if ("string" == typeof e3 && e3) {
          var s4, o5;
          if (!r4.dnsResources.hasOwnProperty(e3)) r4.dnsResources[e3] = null, (o5 = (r4 = n3.headers) && 0 < r4.remainingCapacity) && (s4 = "<" + ("" + e3).replace(qo, escapeHrefForLinkHeaderURLContextReplacer) + ">; rel=dns-prefetch", o5 = 0 <= (r4.remainingCapacity -= s4.length + 2)), o5 ? (n3.resets.dns[e3] = null, r4.preconnects && (r4.preconnects += ", "), r4.preconnects += s4) : (pushLinkImpl(s4 = [], { href: e3, rel: "dns-prefetch" }), n3.preconnects.add(s4));
          enqueueFlush(t3);
        }
      } else Eo.D(e3);
    }, "D"), C: /* @__PURE__ */ __name(function(e3, t3) {
      var r4 = Ra || null;
      if (r4) {
        var n3 = r4.resumableState, s4 = r4.renderState;
        if ("string" == typeof e3 && e3) {
          var o5 = "use-credentials" === t3 ? "credentials" : "string" == typeof t3 ? "anonymous" : "default";
          if (!n3.connectResources[o5].hasOwnProperty(e3)) {
            var a5, i5;
            if (n3.connectResources[o5][e3] = null, i5 = (n3 = s4.headers) && 0 < n3.remainingCapacity) {
              if (i5 = "<" + ("" + e3).replace(qo, escapeHrefForLinkHeaderURLContextReplacer) + ">; rel=preconnect", "string" == typeof t3) i5 += '; crossorigin="' + ("" + t3).replace(Uo, escapeStringForLinkHeaderQuotedParamValueContextReplacer) + '"';
              a5 = i5, i5 = 0 <= (n3.remainingCapacity -= a5.length + 2);
            }
            i5 ? (s4.resets.connect[o5][e3] = null, n3.preconnects && (n3.preconnects += ", "), n3.preconnects += a5) : (pushLinkImpl(o5 = [], { rel: "preconnect", href: e3, crossOrigin: t3 }), s4.preconnects.add(o5));
          }
          enqueueFlush(r4);
        }
      } else Eo.C(e3, t3);
    }, "C"), L: /* @__PURE__ */ __name(function(e3, t3, r4) {
      var n3 = Ra || null;
      if (n3) {
        var s4 = n3.resumableState, o5 = n3.renderState;
        if (t3 && e3) {
          switch (t3) {
            case "image":
              if (r4) var a5 = r4.imageSrcSet, i5 = r4.imageSizes, l4 = r4.fetchPriority;
              var u4, c4 = a5 ? a5 + "\n" + (i5 || "") : e3;
              if (s4.imageResources.hasOwnProperty(c4)) return;
              s4.imageResources[c4] = Fo, (s4 = o5.headers) && 0 < s4.remainingCapacity && "string" != typeof a5 && "high" === l4 && (u4 = getPreloadAsHeader(e3, t3, r4), 0 <= (s4.remainingCapacity -= u4.length + 2)) ? (o5.resets.image[c4] = Fo, s4.highImagePreloads && (s4.highImagePreloads += ", "), s4.highImagePreloads += u4) : (pushLinkImpl(s4 = [], mo({ rel: "preload", href: a5 ? void 0 : e3, as: t3 }, r4)), "high" === l4 ? o5.highImagePreloads.add(s4) : (o5.bulkPreloads.add(s4), o5.preloads.images.set(c4, s4)));
              break;
            case "style":
              if (s4.styleResources.hasOwnProperty(e3)) return;
              pushLinkImpl(a5 = [], mo({ rel: "preload", href: e3, as: t3 }, r4)), s4.styleResources[e3] = !r4 || "string" != typeof r4.crossOrigin && "string" != typeof r4.integrity ? Fo : [r4.crossOrigin, r4.integrity], o5.preloads.stylesheets.set(e3, a5), o5.bulkPreloads.add(a5);
              break;
            case "script":
              if (s4.scriptResources.hasOwnProperty(e3)) return;
              a5 = [], o5.preloads.scripts.set(e3, a5), o5.bulkPreloads.add(a5), pushLinkImpl(a5, mo({ rel: "preload", href: e3, as: t3 }, r4)), s4.scriptResources[e3] = !r4 || "string" != typeof r4.crossOrigin && "string" != typeof r4.integrity ? Fo : [r4.crossOrigin, r4.integrity];
              break;
            default:
              if (s4.unknownResources.hasOwnProperty(t3)) {
                if ((a5 = s4.unknownResources[t3]).hasOwnProperty(e3)) return;
              } else a5 = {}, s4.unknownResources[t3] = a5;
              if (a5[e3] = Fo, (s4 = o5.headers) && 0 < s4.remainingCapacity && "font" === t3 && (c4 = getPreloadAsHeader(e3, t3, r4), 0 <= (s4.remainingCapacity -= c4.length + 2))) o5.resets.font[e3] = Fo, s4.fontPreloads && (s4.fontPreloads += ", "), s4.fontPreloads += c4;
              else if ("font" === (pushLinkImpl(s4 = [], e3 = mo({ rel: "preload", href: e3, as: t3 }, r4)), t3)) o5.fontPreloads.add(s4);
              else o5.bulkPreloads.add(s4);
          }
          enqueueFlush(n3);
        }
      } else Eo.L(e3, t3, r4);
    }, "L"), m: /* @__PURE__ */ __name(function(e3, t3) {
      var r4 = Ra || null;
      if (r4) {
        var n3 = r4.resumableState, s4 = r4.renderState;
        if (e3) {
          var o5 = t3 && "string" == typeof t3.as ? t3.as : "script";
          if ("script" === o5) {
            if (n3.moduleScriptResources.hasOwnProperty(e3)) return;
            o5 = [], n3.moduleScriptResources[e3] = !t3 || "string" != typeof t3.crossOrigin && "string" != typeof t3.integrity ? Fo : [t3.crossOrigin, t3.integrity], s4.preloads.moduleScripts.set(e3, o5);
          } else {
            if (n3.moduleUnknownResources.hasOwnProperty(o5)) {
              var a5 = n3.unknownResources[o5];
              if (a5.hasOwnProperty(e3)) return;
            } else a5 = {}, n3.moduleUnknownResources[o5] = a5;
            o5 = [], a5[e3] = Fo;
          }
          pushLinkImpl(o5, mo({ rel: "modulepreload", href: e3 }, t3)), s4.bulkPreloads.add(o5), enqueueFlush(r4);
        }
      } else Eo.m(e3, t3);
    }, "m"), X: /* @__PURE__ */ __name(function(e3, t3) {
      var r4 = Ra || null;
      if (r4) {
        var n3 = r4.resumableState, s4 = r4.renderState;
        if (e3) {
          var o5 = n3.scriptResources.hasOwnProperty(e3) ? n3.scriptResources[e3] : void 0;
          null !== o5 && (n3.scriptResources[e3] = null, t3 = mo({ src: e3, async: true }, t3), o5 && (2 === o5.length && adoptPreloadCredentials(t3, o5), e3 = s4.preloads.scripts.get(e3)) && (e3.length = 0), e3 = [], s4.scripts.add(e3), pushScriptImpl(e3, t3), enqueueFlush(r4));
        }
      } else Eo.X(e3, t3);
    }, "X"), S: /* @__PURE__ */ __name(function(e3, t3, r4) {
      var n3 = Ra || null;
      if (n3) {
        var s4 = n3.resumableState, o5 = n3.renderState;
        if (e3) {
          t3 = t3 || "default";
          var a5 = o5.styles.get(t3), i5 = s4.styleResources.hasOwnProperty(e3) ? s4.styleResources[e3] : void 0;
          null !== i5 && (s4.styleResources[e3] = null, a5 || (a5 = { precedence: escapeTextForBrowser(t3), rules: [], hrefs: [], sheets: /* @__PURE__ */ new Map() }, o5.styles.set(t3, a5)), t3 = { state: 0, props: mo({ rel: "stylesheet", href: e3, "data-precedence": t3 }, r4) }, i5 && (2 === i5.length && adoptPreloadCredentials(t3.props, i5), (o5 = o5.preloads.stylesheets.get(e3)) && 0 < o5.length ? o5.length = 0 : t3.state = 1), a5.sheets.set(e3, t3), enqueueFlush(n3));
        }
      } else Eo.S(e3, t3, r4);
    }, "S"), M: /* @__PURE__ */ __name(function(e3, t3) {
      var r4 = Ra || null;
      if (r4) {
        var n3 = r4.resumableState, s4 = r4.renderState;
        if (e3) {
          var o5 = n3.moduleScriptResources.hasOwnProperty(e3) ? n3.moduleScriptResources[e3] : void 0;
          null !== o5 && (n3.moduleScriptResources[e3] = null, t3 = mo({ src: e3, type: "module", async: true }, t3), o5 && (2 === o5.length && adoptPreloadCredentials(t3, o5), e3 = s4.preloads.moduleScripts.get(e3)) && (e3.length = 0), e3 = [], s4.scripts.add(e3), pushScriptImpl(e3, t3), enqueueFlush(r4));
        }
      } else Eo.M(e3, t3);
    }, "M") };
    Fo = [];
    Io = /(<\/|<)(s)(cript)/gi;
    __name(scriptReplacer, "scriptReplacer");
    __name(createPreambleState, "createPreambleState");
    __name(createFormatContext, "createFormatContext");
    __name(getChildFormatContext, "getChildFormatContext");
    Ao = /* @__PURE__ */ new Map();
    __name(pushStyleAttribute, "pushStyleAttribute");
    __name(pushBooleanAttribute, "pushBooleanAttribute");
    __name(pushStringAttribute, "pushStringAttribute");
    _o = escapeTextForBrowser("javascript:throw new Error('React form unexpectedly submitted.')");
    __name(pushAdditionalFormField, "pushAdditionalFormField");
    __name(validateAdditionalFormField, "validateAdditionalFormField");
    __name(getCustomFormFields, "getCustomFormFields");
    __name(pushFormActionAttribute, "pushFormActionAttribute");
    __name(pushAttribute, "pushAttribute");
    __name(pushInnerHTML, "pushInnerHTML");
    __name(injectFormReplayingRuntime, "injectFormReplayingRuntime");
    __name(pushLinkImpl, "pushLinkImpl");
    Mo = /(<\/|<)(s)(tyle)/gi;
    __name(styleReplacer, "styleReplacer");
    __name(pushSelfClosing, "pushSelfClosing");
    __name(pushTitleImpl, "pushTitleImpl");
    __name(pushScriptImpl, "pushScriptImpl");
    __name(pushStartSingletonElement, "pushStartSingletonElement");
    __name(pushStartGenericElement, "pushStartGenericElement");
    Oo = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
    No = /* @__PURE__ */ new Map();
    __name(startChunkForTag, "startChunkForTag");
    __name(pushStartInstance, "pushStartInstance");
    jo = /* @__PURE__ */ new Map();
    __name(endChunkForTag, "endChunkForTag");
    __name(hoistPreambleState, "hoistPreambleState");
    __name(writeBootstrap, "writeBootstrap");
    __name(writeStartPendingSuspenseBoundary, "writeStartPendingSuspenseBoundary");
    __name(writePreambleContribution, "writePreambleContribution");
    Lo = /[<\u2028\u2029]/g;
    __name(escapeJSStringsForInstructionScripts, "escapeJSStringsForInstructionScripts");
    Do = /[&><\u2028\u2029]/g;
    __name(escapeJSObjectForInstructionScripts, "escapeJSObjectForInstructionScripts");
    Bo = false;
    Ho = true;
    __name(flushStyleTagsLateForBoundary, "flushStyleTagsLateForBoundary");
    __name(hasStylesToHoist, "hasStylesToHoist");
    __name(writeHoistablesForBoundary, "writeHoistablesForBoundary");
    __name(flushResource, "flushResource");
    zo = [];
    __name(flushStyleInPreamble, "flushStyleInPreamble");
    __name(flushStylesInPreamble, "flushStylesInPreamble");
    __name(preloadLateStyle, "preloadLateStyle");
    __name(preloadLateStyles, "preloadLateStyles");
    __name(writeStyleResourceAttributeInJS, "writeStyleResourceAttributeInJS");
    __name(createHoistableState, "createHoistableState");
    __name(adoptPreloadCredentials, "adoptPreloadCredentials");
    __name(getPreloadAsHeader, "getPreloadAsHeader");
    qo = /[<>\r\n]/g;
    __name(escapeHrefForLinkHeaderURLContextReplacer, "escapeHrefForLinkHeaderURLContextReplacer");
    Uo = /["';,\r\n]/g;
    __name(escapeStringForLinkHeaderQuotedParamValueContextReplacer, "escapeStringForLinkHeaderQuotedParamValueContextReplacer");
    __name(hoistStyleQueueDependency, "hoistStyleQueueDependency");
    __name(hoistStylesheetDependency, "hoistStylesheetDependency");
    __name(pushTextInstance, "pushTextInstance");
    __name(pushSegmentFinale, "pushSegmentFinale");
    Vo = Function.prototype.bind;
    Wo = Symbol.for("react.client.reference");
    __name(getComponentNameFromType, "getComponentNameFromType");
    Ko = {};
    Qo = null;
    __name(popToNearestCommonAncestor, "popToNearestCommonAncestor");
    __name(popAllPrevious, "popAllPrevious");
    __name(pushAllNext, "pushAllNext");
    __name(popPreviousToCommonLevel, "popPreviousToCommonLevel");
    __name(popNextToCommonLevel, "popNextToCommonLevel");
    __name(switchContext, "switchContext");
    Go = { enqueueSetState: /* @__PURE__ */ __name(function(e3, t3) {
      null !== (e3 = e3._reactInternals).queue && e3.queue.push(t3);
    }, "enqueueSetState"), enqueueReplaceState: /* @__PURE__ */ __name(function(e3, t3) {
      (e3 = e3._reactInternals).replace = true, e3.queue = [t3];
    }, "enqueueReplaceState"), enqueueForceUpdate: /* @__PURE__ */ __name(function() {
    }, "enqueueForceUpdate") };
    Jo = { id: 1, overflow: "" };
    __name(pushTreeContext, "pushTreeContext");
    Yo = Math.clz32 ? Math.clz32 : function(e3) {
      return 0 === (e3 >>>= 0) ? 32 : 31 - (Xo(e3) / Zo | 0) | 0;
    };
    Xo = Math.log;
    Zo = Math.LN2;
    ea = Error(formatProdErrorMessage(460));
    __name(noop$2, "noop$2");
    ta = null;
    __name(getSuspendedThenable, "getSuspendedThenable");
    ra = "function" == typeof Object.is ? Object.is : function(e3, t3) {
      return e3 === t3 && (0 !== e3 || 1 / e3 == 1 / t3) || e3 != e3 && t3 != t3;
    };
    na = null;
    sa = null;
    oa = null;
    aa = null;
    ia = null;
    la = null;
    ua = false;
    ca = false;
    da = 0;
    ha = 0;
    pa = -1;
    fa = 0;
    ma = null;
    ga = null;
    ya = 0;
    __name(resolveCurrentlyRenderingComponent, "resolveCurrentlyRenderingComponent");
    __name(createHook, "createHook");
    __name(createWorkInProgressHook, "createWorkInProgressHook");
    __name(getThenableStateAfterSuspending, "getThenableStateAfterSuspending");
    __name(resetHooksState, "resetHooksState");
    __name(basicStateReducer, "basicStateReducer");
    __name(useReducer, "useReducer");
    __name(useMemo, "useMemo");
    __name(dispatchAction, "dispatchAction");
    __name(unsupportedStartTransition, "unsupportedStartTransition");
    __name(unsupportedSetOptimisticState, "unsupportedSetOptimisticState");
    __name(useActionState, "useActionState");
    __name(unwrapThenable, "unwrapThenable");
    __name(unsupportedRefresh, "unsupportedRefresh");
    __name(noop$1, "noop$1");
    Sa = { readContext: /* @__PURE__ */ __name(function(e3) {
      return e3._currentValue2;
    }, "readContext"), use: /* @__PURE__ */ __name(function(e3) {
      if (null !== e3 && "object" == typeof e3) {
        if ("function" == typeof e3.then) return unwrapThenable(e3);
        if (e3.$$typeof === to) return e3._currentValue2;
      }
      throw Error(formatProdErrorMessage(438, String(e3)));
    }, "use"), useContext: /* @__PURE__ */ __name(function(e3) {
      return resolveCurrentlyRenderingComponent(), e3._currentValue2;
    }, "useContext"), useMemo, useReducer, useRef: /* @__PURE__ */ __name(function(e3) {
      na = resolveCurrentlyRenderingComponent();
      var t3 = (la = createWorkInProgressHook()).memoizedState;
      return null === t3 ? (e3 = { current: e3 }, la.memoizedState = e3) : t3;
    }, "useRef"), useState: /* @__PURE__ */ __name(function(e3) {
      return useReducer(basicStateReducer, e3);
    }, "useState"), useInsertionEffect: noop$1, useLayoutEffect: noop$1, useCallback: /* @__PURE__ */ __name(function(e3, t3) {
      return useMemo(function() {
        return e3;
      }, t3);
    }, "useCallback"), useImperativeHandle: noop$1, useEffect: noop$1, useDebugValue: noop$1, useDeferredValue: /* @__PURE__ */ __name(function(e3, t3) {
      return resolveCurrentlyRenderingComponent(), void 0 !== t3 ? t3 : e3;
    }, "useDeferredValue"), useTransition: /* @__PURE__ */ __name(function() {
      return resolveCurrentlyRenderingComponent(), [false, unsupportedStartTransition];
    }, "useTransition"), useId: /* @__PURE__ */ __name(function() {
      var e3 = sa.treeContext, t3 = e3.overflow;
      e3 = ((e3 = e3.id) & ~(1 << 32 - Yo(e3) - 1)).toString(32) + t3;
      var r4 = ka;
      if (null === r4) throw Error(formatProdErrorMessage(404));
      return t3 = da++, e3 = "\xAB" + r4.idPrefix + "R" + e3, 0 < t3 && (e3 += "H" + t3.toString(32)), e3 + "\xBB";
    }, "useId"), useSyncExternalStore: /* @__PURE__ */ __name(function(e3, t3, r4) {
      if (void 0 === r4) throw Error(formatProdErrorMessage(407));
      return r4();
    }, "useSyncExternalStore"), useOptimistic: /* @__PURE__ */ __name(function(e3) {
      return resolveCurrentlyRenderingComponent(), [e3, unsupportedSetOptimisticState];
    }, "useOptimistic"), useActionState, useFormState: useActionState, useHostTransitionStatus: /* @__PURE__ */ __name(function() {
      return resolveCurrentlyRenderingComponent(), $o;
    }, "useHostTransitionStatus"), useMemoCache: /* @__PURE__ */ __name(function(e3) {
      for (var t3 = Array(e3), r4 = 0; r4 < e3; r4++) t3[r4] = co;
      return t3;
    }, "useMemoCache"), useCacheRefresh: /* @__PURE__ */ __name(function() {
      return unsupportedRefresh;
    }, "useCacheRefresh") };
    ka = null;
    wa = { getCacheForType: /* @__PURE__ */ __name(function() {
      throw Error(formatProdErrorMessage(248));
    }, "getCacheForType") };
    __name(describeBuiltInComponentFrame, "describeBuiltInComponentFrame");
    Ca = false;
    __name(describeNativeComponentFrame, "describeNativeComponentFrame");
    __name(describeComponentStackByType, "describeComponentStackByType");
    __name(defaultErrorHandler, "defaultErrorHandler");
    __name(noop, "noop");
    __name(RequestInstance, "RequestInstance");
    Ra = null;
    __name(pingTask, "pingTask");
    __name(createSuspenseBoundary, "createSuspenseBoundary");
    __name(createRenderTask, "createRenderTask");
    __name(createReplayTask, "createReplayTask");
    __name(createPendingSegment, "createPendingSegment");
    __name(pushComponentStack, "pushComponentStack");
    __name(getThrownInfo, "getThrownInfo");
    __name(logRecoverableError, "logRecoverableError");
    __name(fatalError, "fatalError");
    __name(renderWithHooks, "renderWithHooks");
    __name(finishFunctionComponent, "finishFunctionComponent");
    __name(renderElement, "renderElement");
    __name(resumeNode, "resumeNode");
    __name(renderNodeDestructive, "renderNodeDestructive");
    __name(retryNode, "retryNode");
    __name(renderChildrenArray, "renderChildrenArray");
    __name(untrackBoundary, "untrackBoundary");
    __name(spawnNewSuspendedReplayTask, "spawnNewSuspendedReplayTask");
    __name(spawnNewSuspendedRenderTask, "spawnNewSuspendedRenderTask");
    __name(renderNode, "renderNode");
    __name(abortTaskSoft, "abortTaskSoft");
    __name(abortRemainingReplayNodes, "abortRemainingReplayNodes");
    __name(abortTask, "abortTask");
    __name(safelyEmitEarlyPreloads, "safelyEmitEarlyPreloads");
    __name(completeShell, "completeShell");
    __name(completeAll, "completeAll");
    __name(queueCompletedSegment, "queueCompletedSegment");
    __name(finishedTask, "finishedTask");
    __name(performWork, "performWork");
    __name(preparePreambleFromSubtree, "preparePreambleFromSubtree");
    __name(preparePreambleFromSegment, "preparePreambleFromSegment");
    __name(preparePreamble, "preparePreamble");
    __name(flushSubtree, "flushSubtree");
    __name(flushSegment, "flushSegment");
    __name(flushSegmentContainer, "flushSegmentContainer");
    __name(flushCompletedBoundary, "flushCompletedBoundary");
    __name(flushPartiallyCompletedSegment, "flushPartiallyCompletedSegment");
    __name(flushCompletedQueues, "flushCompletedQueues");
    __name(enqueueFlush, "enqueueFlush");
    __name(startFlowing, "startFlowing");
    __name(abort2, "abort");
    __name(onError, "onError");
    __name(renderToStringImpl, "renderToStringImpl");
    Vs.renderToStaticMarkup = function(e3, t3) {
      return renderToStringImpl(e3, t3, true, 'The server used "renderToStaticMarkup" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server');
    }, Vs.renderToString = function(e3, t3) {
      return renderToStringImpl(e3, t3, false, 'The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server');
    }, Vs.version = "19.1.0", xa = bt, Pa = Vs, vt.version = xa.version, vt.renderToReadableStream = xa.renderToReadableStream, vt.renderToString = Pa.renderToString, vt.renderToStaticMarkup = Pa.renderToStaticMarkup, xa.resume && (vt.resume = xa.resume);
    $a = /bot|crawl|http|lighthouse|scan|search|spider/i;
    __name(isbot, "isbot");
    renderRouterToStream = /* @__PURE__ */ __name(async ({ request: e3, router: t3, responseHeaders: r4, children: n3 }) => {
      if ("function" == typeof vt.renderToReadableStream) {
        const s4 = await vt.renderToReadableStream(n3, { signal: e3.signal });
        isbot(e3.headers.get("User-Agent")) && await s4.allReady;
        const o5 = function(e4, t4) {
          return transformStreamWithRouter(e4, t4);
        }(t3, s4);
        return new Response(o5, { status: t3.state.statusCode, headers: r4 });
      }
      if ("function" == typeof vt.renderToPipeableStream) {
        const a5 = new o3();
        try {
          const t4 = vt.renderToPipeableStream(n3, { ...isbot(e3.headers.get("User-Agent")) ? { onAllReady() {
            t4.pipe(a5);
          } } : { onShellReady() {
            t4.pipe(a5);
          } }, onError: /* @__PURE__ */ __name((e4, t5) => {
            console.error("Error in renderToPipeableStream:", e4, t5);
          }, "onError") });
        } catch (e4) {
          console.error("Error in renderToPipeableStream:", e4);
        }
        const i5 = function(e4, t4) {
          return s2.fromWeb(transformStreamWithRouter(e4, s2.toWeb(t4)));
        }(t3, a5);
        return new Response(i5, { status: t3.state.statusCode, headers: r4 });
      }
      throw new Error("No renderToReadableStream or renderToPipeableStream found in react-dom/server. Ensure you are using a version of react-dom that supports streaming.");
    }, "renderRouterToStream");
    __name(StartServer, "StartServer");
    defaultStreamHandler = /* @__PURE__ */ __name(({ request: e3, router: t3, responseHeaders: r4 }) => renderRouterToStream({ request: e3, router: t3, responseHeaders: r4, children: X2.jsx(StartServer, { router: t3 }) }), "defaultStreamHandler");
    Ea = "__TSR_index";
    __name(assignKeyAndIndex, "assignKeyAndIndex");
    __name(createMemoryHistory, "createMemoryHistory");
    __name(parseHref, "parseHref");
    __name(createRandomKey, "createRandomKey");
    __name(parse, "parse");
    __name(decode, "decode");
    __name(tryDecode, "tryDecode");
    Fa = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
    __name(serialize, "serialize");
    __name(splitSetCookieString, "splitSetCookieString");
    __name(mergeHeaders, "mergeHeaders");
    __name(json, "json");
    __name(invariant, "invariant");
    __name(isPlainObject, "isPlainObject");
    __name(hasObjectPrototype, "hasObjectPrototype");
    __name(joinPaths, "joinPaths");
    __name(cleanPath, "cleanPath");
    __name(trimPathLeft, "trimPathLeft");
    __name(trimPathRight, "trimPathRight");
    Ia = /^\$.{1,}$/;
    Aa = /^(.*?)\{(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/;
    _a = /^\$$/;
    Ma = /^(.*?)\{\$\}(.*)$/;
    __name(parsePathname, "parsePathname");
    __name(matchPathname, "matchPathname");
    __name(removeBasepath, "removeBasepath");
    __name(isNotFound, "isNotFound");
    Oa = "__root__";
    __name(isRedirect, "isRedirect");
    Na = { stringify: /* @__PURE__ */ __name((e3) => JSON.stringify(e3, function(e4, t3) {
      const r4 = this[e4], n3 = ja.find((e5) => e5.stringifyCondition(r4));
      return n3 ? n3.stringify(r4) : t3;
    }), "stringify"), parse: /* @__PURE__ */ __name((e3) => JSON.parse(e3, function(e4, t3) {
      const r4 = this[e4];
      if (isPlainObject(r4)) {
        const e5 = ja.find((e6) => e6.parseCondition(r4));
        if (e5) return e5.parse(r4);
      }
      return t3;
    }), "parse"), encode: /* @__PURE__ */ __name((e3) => {
      if (Array.isArray(e3)) return e3.map((e4) => Na.encode(e4));
      if (isPlainObject(e3)) return Object.fromEntries(Object.entries(e3).map(([e4, t4]) => [e4, Na.encode(t4)]));
      const t3 = ja.find((t4) => t4.stringifyCondition(e3));
      return t3 ? t3.stringify(e3) : e3;
    }, "encode"), decode: /* @__PURE__ */ __name((e3) => {
      if (isPlainObject(e3)) {
        const t3 = ja.find((t4) => t4.parseCondition(e3));
        if (t3) return t3.parse(e3);
      }
      return Array.isArray(e3) ? e3.map((e4) => Na.decode(e4)) : isPlainObject(e3) ? Object.fromEntries(Object.entries(e3).map(([e4, t3]) => [e4, Na.decode(t3)])) : e3;
    }, "decode") };
    createSerializer = /* @__PURE__ */ __name((e3, t3, r4, n3) => ({ key: e3, stringifyCondition: t3, stringify: /* @__PURE__ */ __name((t4) => ({ [`$${e3}`]: r4(t4) }), "stringify"), parseCondition: /* @__PURE__ */ __name((t4) => Object.hasOwn(t4, `$${e3}`), "parseCondition"), parse: /* @__PURE__ */ __name((t4) => n3(t4[`$${e3}`]), "parse") }), "createSerializer");
    ja = [createSerializer("undefined", (e3) => void 0 === e3, () => 0, () => {
    }), createSerializer("date", (e3) => e3 instanceof Date, (e3) => e3.toISOString(), (e3) => new Date(e3)), createSerializer("error", (e3) => e3 instanceof Error, (e3) => ({ ...e3, message: e3.message, stack: void 0, cause: e3.cause }), (e3) => Object.assign(new Error(e3.message), e3)), createSerializer("formData", (e3) => e3 instanceof FormData, (e3) => {
      const t3 = {};
      return e3.forEach((e4, r4) => {
        const n3 = t3[r4];
        void 0 !== n3 ? Array.isArray(n3) ? n3.push(e4) : t3[r4] = [n3, e4] : t3[r4] = e4;
      }), t3;
    }, (e3) => {
      const t3 = new FormData();
      return Object.entries(e3).forEach(([e4, r4]) => {
        Array.isArray(r4) ? r4.forEach((r5) => t3.append(e4, r5)) : t3.append(e4, r4);
      }), t3;
    }), createSerializer("bigint", (e3) => "bigint" == typeof e3, (e3) => e3.toString(), (e3) => BigInt(e3))];
    La = [];
    __name(createServerFn, "createServerFn");
    __name(executeMiddleware$1, "executeMiddleware$1");
    __name(flattenMiddlewares, "flattenMiddlewares");
    !function(e3) {
      const t3 = Da;
      Da = "function" == typeof e3 ? e3() : e3;
    }(() => {
      const getStaticCacheUrl = /* @__PURE__ */ __name(async (e4, t3) => {
        const r4 = await async function(e5) {
          const t4 = new TextEncoder().encode(e5), r5 = await crypto.subtle.digest("SHA-1", t4), n3 = Array.from(new Uint8Array(r5)).map((e6) => e6.toString(16).padStart(2, "0")).join("");
          return n3;
        }(`${e4.functionId}__${t3}`);
        return `/__tsr/staticServerFnCache/${r4}.json`;
      }, "getStaticCacheUrl"), jsonToFilenameSafeString = /* @__PURE__ */ __name((e4) => JSON.stringify(e4 ?? "", (e5, t3) => t3 && "object" == typeof t3 && !Array.isArray(t3) ? Object.keys(t3).sort().reduce((e6, r4) => (e6[r4] = t3[r4], e6), {}) : t3).replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, "_"), "jsonToFilenameSafeString"), e3 = "undefined" != typeof document ? /* @__PURE__ */ new Map() : null;
      return { getItem: /* @__PURE__ */ __name(async (e4) => {
        if ("undefined" == typeof document) {
          const t3 = jsonToFilenameSafeString(e4.data), r4 = await getStaticCacheUrl(e4, t3), n3 = "/Users/kregenrek/projects/codefetchUI/.output/public", { promises: s4 } = await Promise.resolve().then(() => (init_fs(), fs_exports)), o5 = (await import("node:path")).join(n3, r4), [a5, i5] = await s4.readFile(o5, "utf-8").then((e5) => [Na.parse(e5), null]).catch((e5) => [null, e5]);
          if (i5 && "ENOENT" !== i5.code) throw i5;
          return a5;
        }
      }, "getItem"), setItem: /* @__PURE__ */ __name(async (e4, t3) => {
        const { promises: r4 } = await Promise.resolve().then(() => (init_fs(), fs_exports)), n3 = await import("node:path"), s4 = jsonToFilenameSafeString(e4.data), o5 = await getStaticCacheUrl(e4, s4), a5 = n3.join("/Users/kregenrek/projects/codefetchUI/.output/public", o5);
        await r4.mkdir(n3.dirname(a5), { recursive: true }), await r4.writeFile(a5, Na.stringify(t3));
      }, "setItem"), fetchItem: /* @__PURE__ */ __name(async (t3) => {
        const r4 = jsonToFilenameSafeString(t3.data), n3 = await getStaticCacheUrl(t3, r4);
        let s4 = null == e3 ? void 0 : e3.get(n3);
        return s4 || (s4 = await fetch(n3, { method: "GET" }).then((e4) => e4.text()).then((e4) => Na.parse(e4)), null == e3 || e3.set(n3, s4)), s4;
      }, "fetchItem") };
    });
    applyMiddleware = /* @__PURE__ */ __name(async (e3, t3, r4) => e3({ ...t3, next: /* @__PURE__ */ __name(async (e4 = {}) => r4({ ...t3, ...e4, context: { ...t3.context, ...e4.context }, sendContext: { ...t3.sendContext, ...e4.sendContext ?? {} }, headers: mergeHeaders(t3.headers, e4.headers), result: void 0 !== e4.result ? e4.result : "raw" === t3.response ? e4 : t3.result, error: e4.error ?? t3.error }), "next") }), "applyMiddleware");
    __name(serverFnBaseToMiddleware, "serverFnBaseToMiddleware");
    __name(serializeChar, "serializeChar");
    __name(serializeString, "serializeString");
    Ba = "__SEROVAL_REFS__";
    Ha = "$R";
    za = `self.${Ha}`;
    __name(assert3, "assert");
    qa = /* @__PURE__ */ new Map();
    Ua = /* @__PURE__ */ new Map();
    __name(hasReferenceID, "hasReferenceID");
    __name(createPlugin, "createPlugin");
    __name(dedupePlugins, "dedupePlugins");
    __name(resolvePlugins, "resolvePlugins");
    "undefined" != typeof globalThis ? Object.defineProperty(globalThis, Ba, { value: Ua, configurable: true, writable: false, enumerable: false }) : "undefined" != typeof self ? Object.defineProperty(self, Ba, { value: Ua, configurable: true, writable: false, enumerable: false }) : void 0 !== ar && Object.defineProperty(ar, Ba, { value: Ua, configurable: true, writable: false, enumerable: false });
    Va = { 0: "Symbol.asyncIterator", 1: "Symbol.hasInstance", 2: "Symbol.isConcatSpreadable", 3: "Symbol.iterator", 4: "Symbol.match", 5: "Symbol.matchAll", 6: "Symbol.replace", 7: "Symbol.search", 8: "Symbol.species", 9: "Symbol.split", 10: "Symbol.toPrimitive", 11: "Symbol.toStringTag", 12: "Symbol.unscopables" };
    Wa = { [Symbol.asyncIterator]: 0, [Symbol.hasInstance]: 1, [Symbol.isConcatSpreadable]: 2, [Symbol.iterator]: 3, [Symbol.match]: 4, [Symbol.matchAll]: 5, [Symbol.replace]: 6, [Symbol.search]: 7, [Symbol.species]: 8, [Symbol.split]: 9, [Symbol.toPrimitive]: 10, [Symbol.toStringTag]: 11, [Symbol.unscopables]: 12 };
    Ka = { 2: "!0", 3: "!1", 1: "void 0", 0: "null", 4: "-0", 5: "1/0", 6: "-1/0", 7: "0/0" };
    Qa = { 0: "Error", 1: "EvalError", 2: "RangeError", 3: "ReferenceError", 4: "SyntaxError", 5: "TypeError", 6: "URIError" };
    Ga = void 0;
    __name(createSerovalNode, "createSerovalNode");
    __name(createConstantNode, "createConstantNode");
    Ja = createConstantNode(2);
    Ya = createConstantNode(3);
    Xa = createConstantNode(1);
    Za = createConstantNode(0);
    ei = createConstantNode(4);
    ti = createConstantNode(5);
    ri = createConstantNode(6);
    ni = createConstantNode(7);
    __name(getErrorConstructor, "getErrorConstructor");
    __name(getErrorOptions, "getErrorOptions");
    __name(getObjectFlag, "getObjectFlag");
    __name(createStringNode, "createStringNode");
    __name(createReferenceNode, "createReferenceNode");
    __name(createPluginNode, "createPluginNode");
    __name(createIteratorFactoryInstanceNode, "createIteratorFactoryInstanceNode");
    __name(createAsyncIteratorFactoryInstanceNode, "createAsyncIteratorFactoryInstanceNode");
    __name(createStreamConstructorNode, "createStreamConstructorNode");
    ({ toString: si } = Object.prototype);
    oi = class extends Error {
      static {
        __name(this, "oi");
      }
      constructor(e3, t3) {
        super(function(e4, t4) {
          return t4 instanceof Error ? `Seroval caught an error during the ${e4} process.
  
${t4.name}
${t4.message}

- For more information, please check the "cause" property of this error.
- If you believe this is an error in Seroval, please submit an issue at https://github.com/lxsmnsyc/seroval/issues/new` : `Seroval caught an error during the ${e4} process.

"${si.call(t4)}"

For more information, please check the "cause" property of this error.`;
        }(e3, t3)), this.cause = t3;
      }
    };
    ai = class extends oi {
      static {
        __name(this, "ai");
      }
      constructor(e3) {
        super("parsing", e3);
      }
    };
    ii = class extends oi {
      static {
        __name(this, "ii");
      }
      constructor(e3) {
        super("serialization", e3);
      }
    };
    li = class extends Error {
      static {
        __name(this, "li");
      }
      constructor(e3) {
        super(`The value ${si.call(e3)} of type "${typeof e3}" cannot be parsed/serialized.
      
There are few workarounds for this problem:
- Transform the value in a way that it can be serialized.
- If the reference is present on multiple runtimes (isomorphic), you can use the Reference API to map the references.`), this.value = e3;
      }
    };
    ui = class extends Error {
      static {
        __name(this, "ui");
      }
      constructor(e3) {
        super('Unsupported node type "' + e3.t + '".');
      }
    };
    ci = class extends Error {
      static {
        __name(this, "ci");
      }
      constructor(e3) {
        super('Missing plugin for tag "' + e3 + '".');
      }
    };
    di = class extends Error {
      static {
        __name(this, "di");
      }
      constructor(e3) {
        super('Missing reference for the value "' + si.call(e3) + '" of type "' + typeof e3 + '"'), this.value = e3;
      }
    };
    hi = class {
      static {
        __name(this, "hi");
      }
      constructor(e3, t3) {
        this.value = e3, this.replacement = t3;
      }
    };
    __name(createFunction, "createFunction");
    __name(createEffectfulFunction, "createEffectfulFunction");
    pi = {};
    fi = {};
    mi = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} };
    __name(serializeSpecialReferenceValue, "serializeSpecialReferenceValue");
    __name(createStream, "createStream");
    __name(iteratorToSequence, "iteratorToSequence");
    gi = class {
      static {
        __name(this, "gi");
      }
      constructor(e3) {
        this.marked = /* @__PURE__ */ new Set(), this.plugins = e3.plugins, this.features = 31 ^ (e3.disabledFeatures || 0), this.refs = e3.refs || /* @__PURE__ */ new Map();
      }
      markRef(e3) {
        this.marked.add(e3);
      }
      isMarked(e3) {
        return this.marked.has(e3);
      }
      createIndex(e3) {
        const t3 = this.refs.size;
        return this.refs.set(e3, t3), t3;
      }
      getIndexedValue(e3) {
        const t3 = this.refs.get(e3);
        return null != t3 ? (this.markRef(t3), { type: 1, value: (r4 = t3, createSerovalNode(4, r4, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga)) }) : { type: 0, value: this.createIndex(e3) };
        var r4;
      }
      getReference(e3) {
        const t3 = this.getIndexedValue(e3);
        return 1 === t3.type ? t3 : hasReferenceID(e3) ? { type: 2, value: createReferenceNode(t3.value, e3) } : t3;
      }
      parseWellKnownSymbol(e3) {
        const t3 = this.getReference(e3);
        return 0 !== t3.type ? t3.value : (assert3(e3 in Wa, new li(e3)), function(e4, t4) {
          return createSerovalNode(17, e4, Wa[t4], Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga);
        }(t3.value, e3));
      }
      parseSpecialReference(e3) {
        const t3 = this.getIndexedValue(mi[e3]);
        return 1 === t3.type ? t3.value : createSerovalNode(26, t3.value, e3, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga);
      }
      parseIteratorFactory() {
        const e3 = this.getIndexedValue(pi);
        return 1 === e3.type ? e3.value : createSerovalNode(27, e3.value, Ga, Ga, Ga, Ga, Ga, Ga, Ga, this.parseWellKnownSymbol(Symbol.iterator), Ga, Ga);
      }
      parseAsyncIteratorFactory() {
        const e3 = this.getIndexedValue(fi);
        return 1 === e3.type ? e3.value : createSerovalNode(29, e3.value, Ga, Ga, Ga, Ga, Ga, Ga, [this.parseSpecialReference(1), this.parseWellKnownSymbol(Symbol.asyncIterator)], Ga, Ga, Ga);
      }
      createObjectNode(e3, t3, r4, n3) {
        return createSerovalNode(r4 ? 11 : 10, e3, Ga, Ga, Ga, Ga, n3, Ga, Ga, Ga, Ga, getObjectFlag(t3));
      }
      createMapNode(e3, t3, r4, n3) {
        return createSerovalNode(8, e3, Ga, Ga, Ga, Ga, Ga, { k: t3, v: r4, s: n3 }, Ga, this.parseSpecialReference(0), Ga, Ga);
      }
      createPromiseConstructorNode(e3, t3) {
        return createSerovalNode(22, e3, t3, Ga, Ga, Ga, Ga, Ga, Ga, this.parseSpecialReference(1), Ga, Ga);
      }
    };
    yi = /^[$A-Z_][0-9A-Z_$]*$/i;
    __name(isValidIdentifier, "isValidIdentifier");
    __name(getAssignmentExpression, "getAssignmentExpression");
    __name(resolveAssignments, "resolveAssignments");
    vi = { 3: "Object.freeze", 2: "Object.seal", 1: "Object.preventExtensions", 0: Ga };
    bi = class {
      static {
        __name(this, "bi");
      }
      constructor(e3) {
        this.stack = [], this.flags = [], this.assignments = [], this.plugins = e3.plugins, this.features = e3.features, this.marked = new Set(e3.markedRefs);
      }
      createFunction(e3, t3) {
        return createFunction(this.features, e3, t3);
      }
      createEffectfulFunction(e3, t3) {
        return createEffectfulFunction(this.features, e3, t3);
      }
      markRef(e3) {
        this.marked.add(e3);
      }
      isMarked(e3) {
        return this.marked.has(e3);
      }
      pushObjectFlag(e3, t3) {
        0 !== e3 && (this.markRef(t3), this.flags.push({ type: e3, value: this.getRefParam(t3) }));
      }
      resolveFlags() {
        let e3 = "";
        for (let t3 = 0, r4 = this.flags, n3 = r4.length; t3 < n3; t3++) {
          const n4 = r4[t3];
          e3 += vi[n4.type] + "(" + n4.value + "),";
        }
        return e3;
      }
      resolvePatches() {
        const e3 = resolveAssignments(this.assignments), t3 = this.resolveFlags();
        return e3 ? t3 ? e3 + t3 : e3 : t3;
      }
      createAssignment(e3, t3) {
        this.assignments.push({ t: 0, s: e3, k: Ga, v: t3 });
      }
      createAddAssignment(e3, t3) {
        this.assignments.push({ t: 1, s: this.getRefParam(e3), k: Ga, v: t3 });
      }
      createSetAssignment(e3, t3, r4) {
        this.assignments.push({ t: 2, s: this.getRefParam(e3), k: t3, v: r4 });
      }
      createDeleteAssignment(e3, t3) {
        this.assignments.push({ t: 3, s: this.getRefParam(e3), k: t3, v: Ga });
      }
      createArrayAssign(e3, t3, r4) {
        this.createAssignment(this.getRefParam(e3) + "[" + t3 + "]", r4);
      }
      createObjectAssign(e3, t3, r4) {
        this.createAssignment(this.getRefParam(e3) + "." + t3, r4);
      }
      isIndexedValueInStack(e3) {
        return 4 === e3.t && this.stack.includes(e3.i);
      }
      serializeReference(e3) {
        return this.assignIndexedValue(e3.i, Ba + '.get("' + e3.s + '")');
      }
      serializeArrayItem(e3, t3, r4) {
        return t3 ? this.isIndexedValueInStack(t3) ? (this.markRef(e3), this.createArrayAssign(e3, r4, this.getRefParam(t3.i)), "") : this.serialize(t3) : "";
      }
      serializeArray(e3) {
        const t3 = e3.i;
        if (e3.l) {
          this.stack.push(t3);
          const r4 = e3.a;
          let n3 = this.serializeArrayItem(t3, r4[0], 0), s4 = "" === n3;
          for (let o5, a5 = 1, i5 = e3.l; a5 < i5; a5++) o5 = this.serializeArrayItem(t3, r4[a5], a5), n3 += "," + o5, s4 = "" === o5;
          return this.stack.pop(), this.pushObjectFlag(e3.o, e3.i), this.assignIndexedValue(t3, "[" + n3 + (s4 ? ",]" : "]"));
        }
        return this.assignIndexedValue(t3, "[]");
      }
      serializeProperty(e3, t3, r4) {
        if ("string" == typeof t3) {
          const n3 = Number(t3), s4 = n3 >= 0 && n3.toString() === t3 || isValidIdentifier(t3);
          if (this.isIndexedValueInStack(r4)) {
            const o5 = this.getRefParam(r4.i);
            return this.markRef(e3.i), s4 && n3 != n3 ? this.createObjectAssign(e3.i, t3, o5) : this.createArrayAssign(e3.i, s4 ? t3 : '"' + t3 + '"', o5), "";
          }
          return (s4 ? t3 : '"' + t3 + '"') + ":" + this.serialize(r4);
        }
        return "[" + this.serialize(t3) + "]:" + this.serialize(r4);
      }
      serializeProperties(e3, t3) {
        const r4 = t3.s;
        if (r4) {
          const n3 = t3.k, s4 = t3.v;
          this.stack.push(e3.i);
          let o5 = this.serializeProperty(e3, n3[0], s4[0]);
          for (let t4 = 1, a5 = o5; t4 < r4; t4++) a5 = this.serializeProperty(e3, n3[t4], s4[t4]), o5 += (a5 && o5 && ",") + a5;
          return this.stack.pop(), "{" + o5 + "}";
        }
        return "{}";
      }
      serializeObject(e3) {
        return this.pushObjectFlag(e3.o, e3.i), this.assignIndexedValue(e3.i, this.serializeProperties(e3, e3.p));
      }
      serializeWithObjectAssign(e3, t3, r4) {
        const n3 = this.serializeProperties(e3, t3);
        return "{}" !== n3 ? "Object.assign(" + r4 + "," + n3 + ")" : r4;
      }
      serializeStringKeyAssignment(e3, t3, r4, n3) {
        const s4 = this.serialize(n3), o5 = Number(r4), a5 = o5 >= 0 && o5.toString() === r4 || isValidIdentifier(r4);
        if (this.isIndexedValueInStack(n3)) a5 && o5 != o5 ? this.createObjectAssign(e3.i, r4, s4) : this.createArrayAssign(e3.i, a5 ? r4 : '"' + r4 + '"', s4);
        else {
          const n4 = this.assignments;
          this.assignments = t3, a5 && o5 != o5 ? this.createObjectAssign(e3.i, r4, s4) : this.createArrayAssign(e3.i, a5 ? r4 : '"' + r4 + '"', s4), this.assignments = n4;
        }
      }
      serializeAssignment(e3, t3, r4, n3) {
        if ("string" == typeof r4) this.serializeStringKeyAssignment(e3, t3, r4, n3);
        else {
          const s4 = this.stack;
          this.stack = [];
          const o5 = this.serialize(n3);
          this.stack = s4;
          const a5 = this.assignments;
          this.assignments = t3, this.createArrayAssign(e3.i, this.serialize(r4), o5), this.assignments = a5;
        }
      }
      serializeAssignments(e3, t3) {
        const r4 = t3.s;
        if (r4) {
          const n3 = [], s4 = t3.k, o5 = t3.v;
          this.stack.push(e3.i);
          for (let t4 = 0; t4 < r4; t4++) this.serializeAssignment(e3, n3, s4[t4], o5[t4]);
          return this.stack.pop(), resolveAssignments(n3);
        }
        return Ga;
      }
      serializeDictionary(e3, t3) {
        if (e3.p) if (8 & this.features) t3 = this.serializeWithObjectAssign(e3, e3.p, t3);
        else {
          this.markRef(e3.i);
          const r4 = this.serializeAssignments(e3, e3.p);
          if (r4) return "(" + this.assignIndexedValue(e3.i, t3) + "," + r4 + this.getRefParam(e3.i) + ")";
        }
        return this.assignIndexedValue(e3.i, t3);
      }
      serializeNullConstructor(e3) {
        return this.pushObjectFlag(e3.o, e3.i), this.serializeDictionary(e3, "Object.create(null)");
      }
      serializeDate(e3) {
        return this.assignIndexedValue(e3.i, 'new Date("' + e3.s + '")');
      }
      serializeRegExp(e3) {
        return this.assignIndexedValue(e3.i, "/" + e3.c + "/" + e3.m);
      }
      serializeSetItem(e3, t3) {
        return this.isIndexedValueInStack(t3) ? (this.markRef(e3), this.createAddAssignment(e3, this.getRefParam(t3.i)), "") : this.serialize(t3);
      }
      serializeSet(e3) {
        let t3 = "new Set";
        const r4 = e3.l, n3 = e3.i;
        if (r4) {
          const s4 = e3.a;
          this.stack.push(n3);
          let o5 = this.serializeSetItem(n3, s4[0]);
          for (let e4 = 1, t4 = o5; e4 < r4; e4++) t4 = this.serializeSetItem(n3, s4[e4]), o5 += (t4 && o5 && ",") + t4;
          this.stack.pop(), o5 && (t3 += "([" + o5 + "])");
        }
        return this.assignIndexedValue(n3, t3);
      }
      serializeMapEntry(e3, t3, r4, n3) {
        if (this.isIndexedValueInStack(t3)) {
          const s4 = this.getRefParam(t3.i);
          if (this.markRef(e3), this.isIndexedValueInStack(r4)) {
            const t4 = this.getRefParam(r4.i);
            return this.createSetAssignment(e3, s4, t4), "";
          }
          if (4 !== r4.t && null != r4.i && this.isMarked(r4.i)) {
            const t4 = "(" + this.serialize(r4) + ",[" + n3 + "," + n3 + "])";
            return this.createSetAssignment(e3, s4, this.getRefParam(r4.i)), this.createDeleteAssignment(e3, n3), t4;
          }
          const o5 = this.stack;
          return this.stack = [], this.createSetAssignment(e3, s4, this.serialize(r4)), this.stack = o5, "";
        }
        if (this.isIndexedValueInStack(r4)) {
          const s4 = this.getRefParam(r4.i);
          if (this.markRef(e3), 4 !== t3.t && null != t3.i && this.isMarked(t3.i)) {
            const r5 = "(" + this.serialize(t3) + ",[" + n3 + "," + n3 + "])";
            return this.createSetAssignment(e3, this.getRefParam(t3.i), s4), this.createDeleteAssignment(e3, n3), r5;
          }
          const o5 = this.stack;
          return this.stack = [], this.createSetAssignment(e3, this.serialize(t3), s4), this.stack = o5, "";
        }
        return "[" + this.serialize(t3) + "," + this.serialize(r4) + "]";
      }
      serializeMap(e3) {
        let t3 = "new Map";
        const r4 = e3.e.s, n3 = e3.i, s4 = e3.f, o5 = this.getRefParam(s4.i);
        if (r4) {
          const s5 = e3.e.k, a5 = e3.e.v;
          this.stack.push(n3);
          let i5 = this.serializeMapEntry(n3, s5[0], a5[0], o5);
          for (let e4 = 1, t4 = i5; e4 < r4; e4++) t4 = this.serializeMapEntry(n3, s5[e4], a5[e4], o5), i5 += (t4 && i5 && ",") + t4;
          this.stack.pop(), i5 && (t3 += "([" + i5 + "])");
        }
        return 26 === s4.t && (this.markRef(s4.i), t3 = "(" + this.serialize(s4) + "," + t3 + ")"), this.assignIndexedValue(n3, t3);
      }
      serializeArrayBuffer(e3) {
        let t3 = "new Uint8Array(";
        const r4 = e3.s, n3 = r4.length;
        if (n3) {
          t3 += "[" + r4[0];
          for (let e4 = 1; e4 < n3; e4++) t3 += "," + r4[e4];
          t3 += "]";
        }
        return this.assignIndexedValue(e3.i, t3 + ").buffer");
      }
      serializeTypedArray(e3) {
        return this.assignIndexedValue(e3.i, "new " + e3.c + "(" + this.serialize(e3.f) + "," + e3.b + "," + e3.l + ")");
      }
      serializeDataView(e3) {
        return this.assignIndexedValue(e3.i, "new DataView(" + this.serialize(e3.f) + "," + e3.b + "," + e3.l + ")");
      }
      serializeAggregateError(e3) {
        const t3 = e3.i;
        this.stack.push(t3);
        const r4 = this.serializeDictionary(e3, 'new AggregateError([],"' + e3.m + '")');
        return this.stack.pop(), r4;
      }
      serializeError(e3) {
        return this.serializeDictionary(e3, "new " + Qa[e3.s] + '("' + e3.m + '")');
      }
      serializePromise(e3) {
        let t3;
        const r4 = e3.f, n3 = e3.i, s4 = e3.s ? "Promise.resolve" : "Promise.reject";
        if (this.isIndexedValueInStack(r4)) {
          const n4 = this.getRefParam(r4.i);
          t3 = s4 + (e3.s ? "().then(" + this.createFunction([], n4) + ")" : "().catch(" + this.createEffectfulFunction([], "throw " + n4) + ")");
        } else {
          this.stack.push(n3);
          const e4 = this.serialize(r4);
          this.stack.pop(), t3 = s4 + "(" + e4 + ")";
        }
        return this.assignIndexedValue(n3, t3);
      }
      serializeWellKnownSymbol(e3) {
        return this.assignIndexedValue(e3.i, Va[e3.s]);
      }
      serializeBoxed(e3) {
        return this.assignIndexedValue(e3.i, "Object(" + this.serialize(e3.f) + ")");
      }
      serializePlugin(e3) {
        const t3 = this.plugins;
        if (t3) for (let r4 = 0, n3 = t3.length; r4 < n3; r4++) {
          const n4 = t3[r4];
          if (n4.tag === e3.c) return this.assignIndexedValue(e3.i, n4.serialize(e3.s, this, { id: e3.i }));
        }
        throw new ci(e3.c);
      }
      getConstructor(e3) {
        const t3 = this.serialize(e3);
        return t3 === this.getRefParam(e3.i) ? t3 : "(" + t3 + ")";
      }
      serializePromiseConstructor(e3) {
        const t3 = this.assignIndexedValue(e3.s, "{p:0,s:0,f:0}");
        return this.assignIndexedValue(e3.i, this.getConstructor(e3.f) + "(" + t3 + ")");
      }
      serializePromiseResolve(e3) {
        return this.getConstructor(e3.a[0]) + "(" + this.getRefParam(e3.i) + "," + this.serialize(e3.a[1]) + ")";
      }
      serializePromiseReject(e3) {
        return this.getConstructor(e3.a[0]) + "(" + this.getRefParam(e3.i) + "," + this.serialize(e3.a[1]) + ")";
      }
      serializeSpecialReference(e3) {
        return this.assignIndexedValue(e3.i, serializeSpecialReferenceValue(this.features, e3.s));
      }
      serializeIteratorFactory(e3) {
        let t3 = "", r4 = false;
        return 4 !== e3.f.t && (this.markRef(e3.f.i), t3 = "(" + this.serialize(e3.f) + ",", r4 = true), t3 += this.assignIndexedValue(e3.i, this.createFunction(["s"], this.createFunction(["i", "c", "d", "t"], "(i=0,t={[" + this.getRefParam(e3.f.i) + "]:" + this.createFunction([], "t") + ",next:" + this.createEffectfulFunction([], "if(i>s.d)return{done:!0,value:void 0};if(d=s.v[c=i++],c===s.t)throw d;return{done:c===s.d,value:d}") + "})"))), r4 && (t3 += ")"), t3;
      }
      serializeIteratorFactoryInstance(e3) {
        return this.getConstructor(e3.a[0]) + "(" + this.serialize(e3.a[1]) + ")";
      }
      serializeAsyncIteratorFactory(e3) {
        const t3 = e3.a[0], r4 = e3.a[1];
        let n3 = "";
        4 !== t3.t && (this.markRef(t3.i), n3 += "(" + this.serialize(t3)), 4 !== r4.t && (this.markRef(r4.i), n3 += (n3 ? "," : "(") + this.serialize(r4)), n3 && (n3 += ",");
        const s4 = this.assignIndexedValue(e3.i, this.createFunction(["s"], this.createFunction(["b", "c", "p", "d", "e", "t", "f"], "(b=[],c=0,p=[],d=-1,e=!1,f=" + this.createEffectfulFunction(["i", "l"], "for(i=0,l=p.length;i<l;i++)p[i].s({done:!0,value:void 0})") + ",s.on({next:" + this.createEffectfulFunction(["v", "t"], "if(t=p.shift())t.s({done:!1,value:v});b.push(v)") + ",throw:" + this.createEffectfulFunction(["v", "t"], "if(t=p.shift())t.f(v);f(),d=b.length,e=!0,b.push(v)") + ",return:" + this.createEffectfulFunction(["v", "t"], "if(t=p.shift())t.s({done:!0,value:v});f(),d=b.length,b.push(v)") + "}),t={[" + this.getRefParam(r4.i) + "]:" + this.createFunction([], "t.p") + ",next:" + this.createEffectfulFunction(["i", "t", "v"], "if(d===-1){return((i=c++)>=b.length)?(" + this.getRefParam(t3.i) + "(t={p:0,s:0,f:0}),p.push(t),t.p):{done:!1,value:b[i]}}if(c>d)return{done:!0,value:void 0};if(v=b[i=c++],i!==d)return{done:!1,value:v};if(e)throw v;return{done:!0,value:v}") + "})")));
        return n3 ? n3 + s4 + ")" : s4;
      }
      serializeAsyncIteratorFactoryInstance(e3) {
        return this.getConstructor(e3.a[0]) + "(" + this.serialize(e3.a[1]) + ")";
      }
      serializeStreamConstructor(e3) {
        const t3 = this.assignIndexedValue(e3.i, this.getConstructor(e3.f) + "()"), r4 = e3.a.length;
        if (r4) {
          let n3 = this.serialize(e3.a[0]);
          for (let t4 = 1; t4 < r4; t4++) n3 += "," + this.serialize(e3.a[t4]);
          return "(" + t3 + "," + n3 + "," + this.getRefParam(e3.i) + ")";
        }
        return t3;
      }
      serializeStreamNext(e3) {
        return this.getRefParam(e3.i) + ".next(" + this.serialize(e3.f) + ")";
      }
      serializeStreamThrow(e3) {
        return this.getRefParam(e3.i) + ".throw(" + this.serialize(e3.f) + ")";
      }
      serializeStreamReturn(e3) {
        return this.getRefParam(e3.i) + ".return(" + this.serialize(e3.f) + ")";
      }
      serialize(e3) {
        try {
          switch (e3.t) {
            case 2:
              return Ka[e3.s];
            case 0:
              return "" + e3.s;
            case 1:
              return '"' + e3.s + '"';
            case 3:
              return e3.s + "n";
            case 4:
              return this.getRefParam(e3.i);
            case 18:
              return this.serializeReference(e3);
            case 9:
              return this.serializeArray(e3);
            case 10:
              return this.serializeObject(e3);
            case 11:
              return this.serializeNullConstructor(e3);
            case 5:
              return this.serializeDate(e3);
            case 6:
              return this.serializeRegExp(e3);
            case 7:
              return this.serializeSet(e3);
            case 8:
              return this.serializeMap(e3);
            case 19:
              return this.serializeArrayBuffer(e3);
            case 16:
            case 15:
              return this.serializeTypedArray(e3);
            case 20:
              return this.serializeDataView(e3);
            case 14:
              return this.serializeAggregateError(e3);
            case 13:
              return this.serializeError(e3);
            case 12:
              return this.serializePromise(e3);
            case 17:
              return this.serializeWellKnownSymbol(e3);
            case 21:
              return this.serializeBoxed(e3);
            case 22:
              return this.serializePromiseConstructor(e3);
            case 23:
              return this.serializePromiseResolve(e3);
            case 24:
              return this.serializePromiseReject(e3);
            case 25:
              return this.serializePlugin(e3);
            case 26:
              return this.serializeSpecialReference(e3);
            case 27:
              return this.serializeIteratorFactory(e3);
            case 28:
              return this.serializeIteratorFactoryInstance(e3);
            case 29:
              return this.serializeAsyncIteratorFactory(e3);
            case 30:
              return this.serializeAsyncIteratorFactoryInstance(e3);
            case 31:
              return this.serializeStreamConstructor(e3);
            case 32:
              return this.serializeStreamNext(e3);
            case 33:
              return this.serializeStreamThrow(e3);
            case 34:
              return this.serializeStreamReturn(e3);
            default:
              throw new ui(e3);
          }
        } catch (e4) {
          throw new ii(e4);
        }
      }
    };
    Si = class extends bi {
      static {
        __name(this, "Si");
      }
      constructor(e3) {
        super(e3), this.mode = "cross", this.scopeId = e3.scopeId;
      }
      getRefParam(e3) {
        return "$R[" + e3 + "]";
      }
      assignIndexedValue(e3, t3) {
        return this.getRefParam(e3) + "=" + t3;
      }
      serializeTop(e3) {
        const t3 = this.serialize(e3), r4 = e3.i;
        if (null == r4) return t3;
        const n3 = this.resolvePatches(), s4 = this.getRefParam(r4), o5 = null == this.scopeId ? "" : Ha, a5 = n3 ? "(" + t3 + "," + n3 + s4 + ")" : t3;
        if ("" === o5) return 10 !== e3.t || n3 ? a5 : "(" + a5 + ")";
        const i5 = null == this.scopeId ? "()" : '($R["' + serializeString(this.scopeId) + '"])';
        return "(" + this.createFunction([o5], a5) + ")" + i5;
      }
    };
    ki = class extends gi {
      static {
        __name(this, "ki");
      }
      parseItems(e3) {
        const t3 = [];
        for (let r4 = 0, n3 = e3.length; r4 < n3; r4++) r4 in e3 && (t3[r4] = this.parse(e3[r4]));
        return t3;
      }
      parseArray(e3, t3) {
        return function(e4, t4, r4) {
          return createSerovalNode(9, e4, Ga, t4.length, Ga, Ga, Ga, Ga, r4, Ga, Ga, getObjectFlag(t4));
        }(e3, t3, this.parseItems(t3));
      }
      parseProperties(e3) {
        const t3 = Object.entries(e3), r4 = [], n3 = [];
        for (let e4 = 0, s5 = t3.length; e4 < s5; e4++) r4.push(serializeString(t3[e4][0])), n3.push(this.parse(t3[e4][1]));
        let s4 = Symbol.iterator;
        return s4 in e3 && (r4.push(this.parseWellKnownSymbol(s4)), n3.push(createIteratorFactoryInstanceNode(this.parseIteratorFactory(), this.parse(iteratorToSequence(e3))))), s4 = Symbol.asyncIterator, s4 in e3 && (r4.push(this.parseWellKnownSymbol(s4)), n3.push(createAsyncIteratorFactoryInstanceNode(this.parseAsyncIteratorFactory(), this.parse(createStream())))), s4 = Symbol.toStringTag, s4 in e3 && (r4.push(this.parseWellKnownSymbol(s4)), n3.push(createStringNode(e3[s4]))), s4 = Symbol.isConcatSpreadable, s4 in e3 && (r4.push(this.parseWellKnownSymbol(s4)), n3.push(e3[s4] ? Ja : Ya)), { k: r4, v: n3, s: r4.length };
      }
      parsePlainObject(e3, t3, r4) {
        return this.createObjectNode(e3, t3, r4, this.parseProperties(t3));
      }
      parseBoxed(e3, t3) {
        return function(e4, t4) {
          return createSerovalNode(21, e4, Ga, Ga, Ga, Ga, Ga, Ga, Ga, t4, Ga, Ga);
        }(e3, this.parse(t3.valueOf()));
      }
      parseTypedArray(e3, t3) {
        return function(e4, t4, r4) {
          return createSerovalNode(15, e4, Ga, t4.length, t4.constructor.name, Ga, Ga, Ga, Ga, r4, t4.byteOffset, Ga);
        }(e3, t3, this.parse(t3.buffer));
      }
      parseBigIntTypedArray(e3, t3) {
        return function(e4, t4, r4) {
          return createSerovalNode(16, e4, Ga, t4.length, t4.constructor.name, Ga, Ga, Ga, Ga, r4, t4.byteOffset, Ga);
        }(e3, t3, this.parse(t3.buffer));
      }
      parseDataView(e3, t3) {
        return function(e4, t4, r4) {
          return createSerovalNode(20, e4, Ga, t4.byteLength, Ga, Ga, Ga, Ga, Ga, r4, t4.byteOffset, Ga);
        }(e3, t3, this.parse(t3.buffer));
      }
      parseError(e3, t3) {
        const r4 = getErrorOptions(t3, this.features);
        return function(e4, t4, r5) {
          return createSerovalNode(13, e4, getErrorConstructor(t4), Ga, Ga, serializeString(t4.message), r5, Ga, Ga, Ga, Ga, Ga);
        }(e3, t3, r4 ? this.parseProperties(r4) : Ga);
      }
      parseAggregateError(e3, t3) {
        const r4 = getErrorOptions(t3, this.features);
        return function(e4, t4, r5) {
          return createSerovalNode(14, e4, getErrorConstructor(t4), Ga, Ga, serializeString(t4.message), r5, Ga, Ga, Ga, Ga, Ga);
        }(e3, t3, r4 ? this.parseProperties(r4) : Ga);
      }
      parseMap(e3, t3) {
        const r4 = [], n3 = [];
        for (const [e4, s4] of t3.entries()) r4.push(this.parse(e4)), n3.push(this.parse(s4));
        return this.createMapNode(e3, r4, n3, t3.size);
      }
      parseSet(e3, t3) {
        const r4 = [];
        for (const e4 of t3.keys()) r4.push(this.parse(e4));
        return function(e4, t4, r5) {
          return createSerovalNode(7, e4, Ga, t4, Ga, Ga, Ga, Ga, r5, Ga, Ga, Ga);
        }(e3, t3.size, r4);
      }
      parsePlugin(e3, t3) {
        const r4 = this.plugins;
        if (r4) for (let n3 = 0, s4 = r4.length; n3 < s4; n3++) {
          const s5 = r4[n3];
          if (s5.parse.sync && s5.test(t3)) return createPluginNode(e3, s5.tag, s5.parse.sync(t3, this, { id: e3 }));
        }
      }
      parseStream(e3, t3) {
        return createStreamConstructorNode(e3, this.parseSpecialReference(4), []);
      }
      parsePromise(e3, t3) {
        return this.createPromiseConstructorNode(e3, this.createIndex({}));
      }
      parseObject(e3, t3) {
        if (Array.isArray(t3)) return this.parseArray(e3, t3);
        if ("__SEROVAL_STREAM__" in t3) return this.parseStream(e3, t3);
        const r4 = t3.constructor;
        if (r4 === hi) return this.parse(t3.replacement);
        const n3 = this.parsePlugin(e3, t3);
        if (n3) return n3;
        switch (r4) {
          case Object:
            return this.parsePlainObject(e3, t3, false);
          case void 0:
            return this.parsePlainObject(e3, t3, true);
          case Date:
            return function(e4, t4) {
              const r5 = t4.valueOf();
              return createSerovalNode(5, e4, r5 != r5 ? "" : t4.toISOString(), Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga);
            }(e3, t3);
          case RegExp:
            return function(e4, t4) {
              return createSerovalNode(6, e4, Ga, Ga, serializeString(t4.source), t4.flags, Ga, Ga, Ga, Ga, Ga, Ga);
            }(e3, t3);
          case Error:
          case EvalError:
          case RangeError:
          case ReferenceError:
          case SyntaxError:
          case TypeError:
          case URIError:
            return this.parseError(e3, t3);
          case Number:
          case Boolean:
          case String:
          case BigInt:
            return this.parseBoxed(e3, t3);
          case ArrayBuffer:
            return function(e4, t4) {
              const r5 = new Uint8Array(t4), n4 = r5.length, s5 = new Array(n4);
              for (let e5 = 0; e5 < n4; e5++) s5[e5] = r5[e5];
              return createSerovalNode(19, e4, s5, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga);
            }(e3, t3);
          case Int8Array:
          case Int16Array:
          case Int32Array:
          case Uint8Array:
          case Uint16Array:
          case Uint32Array:
          case Uint8ClampedArray:
          case Float32Array:
          case Float64Array:
            return this.parseTypedArray(e3, t3);
          case DataView:
            return this.parseDataView(e3, t3);
          case Map:
            return this.parseMap(e3, t3);
          case Set:
            return this.parseSet(e3, t3);
        }
        if (r4 === Promise || t3 instanceof Promise) return this.parsePromise(e3, t3);
        const s4 = this.features;
        if (16 & s4) switch (r4) {
          case BigInt64Array:
          case BigUint64Array:
            return this.parseBigIntTypedArray(e3, t3);
        }
        if (1 & s4 && "undefined" != typeof AggregateError && (r4 === AggregateError || t3 instanceof AggregateError)) return this.parseAggregateError(e3, t3);
        if (t3 instanceof Error) return this.parseError(e3, t3);
        if (Symbol.iterator in t3 || Symbol.asyncIterator in t3) return this.parsePlainObject(e3, t3, !!r4);
        throw new li(t3);
      }
      parseFunction(e3) {
        const t3 = this.getReference(e3);
        if (0 !== t3.type) return t3.value;
        const r4 = this.parsePlugin(t3.value, e3);
        if (r4) return r4;
        throw new li(e3);
      }
      parse(e3) {
        switch (typeof e3) {
          case "boolean":
            return e3 ? Ja : Ya;
          case "undefined":
            return Xa;
          case "string":
            return createStringNode(e3);
          case "number":
            return function(e4) {
              switch (e4) {
                case Number.POSITIVE_INFINITY:
                  return ti;
                case Number.NEGATIVE_INFINITY:
                  return ri;
              }
              return e4 != e4 ? ni : Object.is(e4, -0) ? ei : createSerovalNode(0, Ga, e4, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga);
            }(e3);
          case "bigint":
            return function(e4) {
              return createSerovalNode(3, Ga, "" + e4, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga, Ga);
            }(e3);
          case "object":
            if (e3) {
              const t3 = this.getReference(e3);
              return 0 === t3.type ? this.parseObject(t3.value, e3) : t3.value;
            }
            return Za;
          case "symbol":
            return this.parseWellKnownSymbol(e3);
          case "function":
            return this.parseFunction(e3);
          default:
            throw new li(e3);
        }
      }
      parseTop(e3) {
        try {
          return this.parse(e3);
        } catch (e4) {
          throw e4 instanceof ai ? e4 : new ai(e4);
        }
      }
    };
    wi = class extends ki {
      static {
        __name(this, "wi");
      }
      constructor(e3) {
        super(e3), this.alive = true, this.pending = 0, this.initial = true, this.buffer = [], this.onParseCallback = e3.onParse, this.onErrorCallback = e3.onError, this.onDoneCallback = e3.onDone;
      }
      onParseInternal(e3, t3) {
        try {
          this.onParseCallback(e3, t3);
        } catch (e4) {
          this.onError(e4);
        }
      }
      flush() {
        for (let e3 = 0, t3 = this.buffer.length; e3 < t3; e3++) this.onParseInternal(this.buffer[e3], false);
      }
      onParse(e3) {
        this.initial ? this.buffer.push(e3) : this.onParseInternal(e3, false);
      }
      onError(e3) {
        if (!this.onErrorCallback) throw e3;
        this.onErrorCallback(e3);
      }
      onDone() {
        this.onDoneCallback && this.onDoneCallback();
      }
      pushPendingState() {
        this.pending++;
      }
      popPendingState() {
        --this.pending <= 0 && this.onDone();
      }
      parseProperties(e3) {
        const t3 = Object.entries(e3), r4 = [], n3 = [];
        for (let e4 = 0, s5 = t3.length; e4 < s5; e4++) r4.push(serializeString(t3[e4][0])), n3.push(this.parse(t3[e4][1]));
        let s4 = Symbol.iterator;
        return s4 in e3 && (r4.push(this.parseWellKnownSymbol(s4)), n3.push(createIteratorFactoryInstanceNode(this.parseIteratorFactory(), this.parse(iteratorToSequence(e3))))), s4 = Symbol.asyncIterator, s4 in e3 && (r4.push(this.parseWellKnownSymbol(s4)), n3.push(createAsyncIteratorFactoryInstanceNode(this.parseAsyncIteratorFactory(), this.parse(function(e4) {
          const t4 = createStream(), r5 = e4[Symbol.asyncIterator]();
          return (/* @__PURE__ */ __name(async function push() {
            try {
              const e5 = await r5.next();
              e5.done ? t4.return(e5.value) : (t4.next(e5.value), await push());
            } catch (e5) {
              t4.throw(e5);
            }
          }, "push"))().catch(() => {
          }), t4;
        }(e3))))), s4 = Symbol.toStringTag, s4 in e3 && (r4.push(this.parseWellKnownSymbol(s4)), n3.push(createStringNode(e3[s4]))), s4 = Symbol.isConcatSpreadable, s4 in e3 && (r4.push(this.parseWellKnownSymbol(s4)), n3.push(e3[s4] ? Ja : Ya)), { k: r4, v: n3, s: r4.length };
      }
      handlePromiseSuccess(e3, t3) {
        const r4 = this.parseWithError(t3);
        r4 && this.onParse(createSerovalNode(23, e3, Ga, Ga, Ga, Ga, Ga, Ga, [this.parseSpecialReference(2), r4], Ga, Ga, Ga)), this.popPendingState();
      }
      handlePromiseFailure(e3, t3) {
        if (this.alive) {
          const r4 = this.parseWithError(t3);
          r4 && this.onParse(createSerovalNode(24, e3, Ga, Ga, Ga, Ga, Ga, Ga, [this.parseSpecialReference(3), r4], Ga, Ga, Ga));
        }
        this.popPendingState();
      }
      parsePromise(e3, t3) {
        const r4 = this.createIndex({});
        return t3.then(this.handlePromiseSuccess.bind(this, r4), this.handlePromiseFailure.bind(this, r4)), this.pushPendingState(), this.createPromiseConstructorNode(e3, r4);
      }
      parsePlugin(e3, t3) {
        const r4 = this.plugins;
        if (r4) for (let n3 = 0, s4 = r4.length; n3 < s4; n3++) {
          const s5 = r4[n3];
          if (s5.parse.stream && s5.test(t3)) return createPluginNode(e3, s5.tag, s5.parse.stream(t3, this, { id: e3 }));
        }
        return Ga;
      }
      parseStream(e3, t3) {
        const r4 = createStreamConstructorNode(e3, this.parseSpecialReference(4), []);
        return this.pushPendingState(), t3.on({ next: /* @__PURE__ */ __name((t4) => {
          if (this.alive) {
            const r5 = this.parseWithError(t4);
            r5 && this.onParse(function(e4, t5) {
              return createSerovalNode(32, e4, Ga, Ga, Ga, Ga, Ga, Ga, Ga, t5, Ga, Ga);
            }(e3, r5));
          }
        }, "next"), throw: /* @__PURE__ */ __name((t4) => {
          if (this.alive) {
            const r5 = this.parseWithError(t4);
            r5 && this.onParse(function(e4, t5) {
              return createSerovalNode(33, e4, Ga, Ga, Ga, Ga, Ga, Ga, Ga, t5, Ga, Ga);
            }(e3, r5));
          }
          this.popPendingState();
        }, "throw"), return: /* @__PURE__ */ __name((t4) => {
          if (this.alive) {
            const r5 = this.parseWithError(t4);
            r5 && this.onParse(function(e4, t5) {
              return createSerovalNode(34, e4, Ga, Ga, Ga, Ga, Ga, Ga, Ga, t5, Ga, Ga);
            }(e3, r5));
          }
          this.popPendingState();
        }, "return") }), r4;
      }
      parseWithError(e3) {
        try {
          return this.parse(e3);
        } catch (e4) {
          return this.onError(e4), Ga;
        }
      }
      start(e3) {
        const t3 = this.parseWithError(e3);
        t3 && (this.onParseInternal(t3, true), this.initial = false, this.flush(), this.pending <= 0 && this.destroy());
      }
      destroy() {
        this.alive && (this.onDone(), this.alive = false);
      }
      isAlive() {
        return this.alive;
      }
    };
    Ci = class extends wi {
      static {
        __name(this, "Ci");
      }
      constructor() {
        super(...arguments), this.mode = "cross";
      }
    };
    xi = {};
    __name(toStream, "toStream");
    Pi = createPlugin({ tag: "seroval/plugins/web/ReadableStream", extends: [createPlugin({ tag: "seroval-plugins/web/ReadableStreamFactory", test: /* @__PURE__ */ __name((e3) => e3 === xi, "test"), parse: { sync() {
    }, async: /* @__PURE__ */ __name(async () => await Promise.resolve(void 0), "async"), stream() {
    } }, serialize: /* @__PURE__ */ __name((e3, t3) => t3.createFunction(["d"], "new ReadableStream({start:" + t3.createEffectfulFunction(["c"], "d.on({next:" + t3.createEffectfulFunction(["v"], "c.enqueue(v)") + ",throw:" + t3.createEffectfulFunction(["v"], "c.error(v)") + ",return:" + t3.createEffectfulFunction([], "c.close()") + "})") + "})"), "serialize"), deserialize: /* @__PURE__ */ __name(() => xi, "deserialize") })], test: /* @__PURE__ */ __name((e3) => "undefined" != typeof ReadableStream && e3 instanceof ReadableStream, "test"), parse: { sync: /* @__PURE__ */ __name((e3, t3) => ({ factory: t3.parse(xi), stream: t3.parse(createStream()) }), "sync"), async: /* @__PURE__ */ __name(async (e3, t3) => ({ factory: await t3.parse(xi), stream: await t3.parse(toStream(e3)) }), "async"), stream: /* @__PURE__ */ __name((e3, t3) => ({ factory: t3.parse(xi), stream: t3.parse(toStream(e3)) }), "stream") }, serialize: /* @__PURE__ */ __name((e3, t3) => "(" + t3.serialize(e3.factory) + ")(" + t3.serialize(e3.stream) + ")", "serialize"), deserialize(e3, t3) {
      const r4 = t3.deserialize(e3.stream);
      return new ReadableStream({ start(e4) {
        r4.on({ next(t4) {
          e4.enqueue(t4);
        }, throw(t4) {
          e4.error(t4);
        }, return() {
          e4.close();
        } });
      } });
    } });
    Ri = createPlugin({ tag: "tanstack-start:seroval-plugins/Error", test: /* @__PURE__ */ __name((e3) => e3 instanceof Error, "test"), parse: { sync: /* @__PURE__ */ __name((e3, t3) => ({ message: t3.parse(e3.message) }), "sync"), async: /* @__PURE__ */ __name(async (e3, t3) => ({ message: await t3.parse(e3.message) }), "async"), stream: /* @__PURE__ */ __name((e3, t3) => ({ message: t3.parse(e3.message) }), "stream") }, serialize: /* @__PURE__ */ __name((e3, t3) => "new Error(" + t3.serialize(e3.message) + ")", "serialize"), deserialize: /* @__PURE__ */ __name((e3, t3) => new Error(t3.deserialize(e3.message)), "deserialize") });
    __name(dehydrateMatch, "dehydrateMatch");
    __name(attachRouterServerSsrUtils, "attachRouterServerSsrUtils");
    Ti = Object.freeze({ ignoreUnknown: false, respectType: false, respectFunctionNames: false, respectFunctionProperties: false, unorderedObjects: true, unorderedArrays: false, unorderedSets: false, excludeKeys: void 0, excludeValues: void 0, replacer: void 0 });
    __name(objectHash, "objectHash");
    $i = Object.freeze(["prototype", "__proto__", "constructor"]);
    __name(createHasher, "createHasher");
    Ei = "[native code] }";
    Fi = Ei.length;
    __name(isNativeFunction, "isNativeFunction");
    __name(hasProp, "hasProp");
    Ii = Object.defineProperty;
    __publicField$2 = /* @__PURE__ */ __name((e3, t3, r4) => (((e4, t4, r5) => {
      t4 in e4 ? Ii(e4, t4, { enumerable: true, configurable: true, writable: true, value: r5 }) : e4[t4] = r5;
    })(e3, "symbol" != typeof t3 ? t3 + "" : t3, r4), r4), "__publicField$2");
    H3Error = class extends Error {
      static {
        __name(this, "H3Error");
      }
      constructor(e3, t3 = {}) {
        super(e3, t3), __publicField$2(this, "statusCode", 500), __publicField$2(this, "fatal", false), __publicField$2(this, "unhandled", false), __publicField$2(this, "statusMessage"), __publicField$2(this, "data"), __publicField$2(this, "cause"), t3.cause && !this.cause && (this.cause = t3.cause);
      }
      toJSON() {
        const e3 = { message: this.message, statusCode: sanitizeStatusCode(this.statusCode, 500) };
        return this.statusMessage && (e3.statusMessage = sanitizeStatusMessage(this.statusMessage)), void 0 !== this.data && (e3.data = this.data), e3;
      }
    };
    __name(assertMethod, "assertMethod");
    __name(toWebRequest, "toWebRequest");
    __publicField$2(H3Error, "__h3_error__", true);
    Ai = Symbol.for("h3RawBody");
    _i = ["PATCH", "POST", "PUT", "DELETE"];
    __name(getRequestWebStream, "getRequestWebStream");
    Mi = /[^\u0009\u0020-\u007E]/g;
    __name(sanitizeStatusMessage, "sanitizeStatusMessage");
    __name(sanitizeStatusCode, "sanitizeStatusCode");
    __name(splitCookiesString, "splitCookiesString");
    __name(sendWebResponse, "sendWebResponse");
    Oi = Object.defineProperty;
    __publicField = /* @__PURE__ */ __name((e3, t3, r4) => (((e4, t4, r5) => {
      t4 in e4 ? Oi(e4, t4, { enumerable: true, configurable: true, writable: true, value: r5 }) : e4[t4] = r5;
    })(e3, "symbol" != typeof t3 ? t3 + "" : t3, r4), r4), "__publicField");
    H3Event = class {
      static {
        __name(this, "H3Event");
      }
      constructor(e3, t3) {
        __publicField(this, "__is_event__", true), __publicField(this, "node"), __publicField(this, "web"), __publicField(this, "context", {}), __publicField(this, "_method"), __publicField(this, "_path"), __publicField(this, "_headers"), __publicField(this, "_requestBody"), __publicField(this, "_handled", false), __publicField(this, "_onBeforeResponseCalled"), __publicField(this, "_onAfterResponseCalled"), this.node = { req: e3, res: t3 };
      }
      get method() {
        return this._method || (this._method = (this.node.req.method || "GET").toUpperCase()), this._method;
      }
      get path() {
        return this._path || this.node.req.url || "/";
      }
      get headers() {
        return this._headers || (this._headers = function(e3) {
          const t3 = new Headers();
          for (const [r4, n3] of Object.entries(e3)) if (Array.isArray(n3)) for (const e4 of n3) t3.append(r4, e4);
          else n3 && t3.set(r4, n3);
          return t3;
        }(this.node.req.headers)), this._headers;
      }
      get handled() {
        return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
      }
      respondWith(e3) {
        return Promise.resolve(e3).then((e4) => sendWebResponse(this, e4));
      }
      toString() {
        return `[${this.method}] ${this.path}`;
      }
      toJSON() {
        return this.toString();
      }
      get req() {
        return this.node.req;
      }
      get res() {
        return this.node.res;
      }
    };
    __name(_normalizeArray, "_normalizeArray");
    Ni = new AsyncLocalStorage2();
    __name(getEvent, "getEvent");
    ji = Symbol("$HTTPEvent");
    __name(createWrapperFunction, "createWrapperFunction");
    Li = createWrapperFunction(function(e3) {
      return e3.node.res.statusCode;
    });
    Di = createWrapperFunction(function(e3) {
      return e3.node.res.getHeaders();
    });
    Bi = createWrapperFunction(function(e3, t3) {
      return function(e4) {
        return parse(e4.node.req.headers.cookie || "");
      }(e3)[t3];
    });
    Hi = createWrapperFunction(function(e3, t3, r4, n3) {
      const s4 = serialize(t3, r4, n3 = { path: "/", ...n3 });
      let o5 = e3.node.res.getHeader("set-cookie");
      Array.isArray(o5) || (o5 = [o5]);
      const a5 = objectHash(n3);
      o5 = o5.filter((e4) => e4 && a5 !== objectHash(parse(e4))), e3.node.res.setHeader("set-cookie", [...o5, s4]);
    });
    zi = "tanstack-start-route-tree:v";
    qi = "tanstack-start-manifest:v";
    Ui = "tanstack-start-server-fn-manifest:v";
    __name(loadVirtualModule, "loadVirtualModule");
    __name(isNotFoundResponse, "isNotFoundResponse");
    __name(handlerToMiddleware, "handlerToMiddleware");
    __name(handleCtxResult, "handleCtxResult");
    __name(isSpecialResponse, "isSpecialResponse");
    __name(createServerRoute, "createServerRoute");
    Vi = createServerRoute;
    createMethodBuilder = /* @__PURE__ */ __name((e3) => ({ _options: e3 || {}, _types: {}, middleware: /* @__PURE__ */ __name((t3) => createMethodBuilder({ ...e3, middlewares: t3 }), "middleware"), handler: /* @__PURE__ */ __name((t3) => createMethodBuilder({ ...e3, handler: t3 }), "handler") }), "createMethodBuilder");
    __name(DefaultCatchBoundary, "DefaultCatchBoundary");
    __name(NotFound, "NotFound");
    __name(ThemeInitScript, "ThemeInitScript");
    __name(sanitizeBase, "sanitizeBase");
    createServerRpc = /* @__PURE__ */ __name((e3, t3, r4) => {
      invariant(r4);
      const n3 = sanitizeBase("/"), s4 = `${n3 ? `/${n3}` : ""}/${sanitizeBase(t3)}/${e3}`;
      return Object.assign(r4, { url: s4, functionId: e3 });
    }, "createServerRpc");
    Wi = "vite-ui-theme";
    Ki = createServerRpc("src_lib_theme_ts--getTheme_createServerFn_handler", "/_serverFn", (e3, t3) => Qi.__executeServer(e3, t3));
    Qi = createServerFn().handler(Ki, async () => {
      const e3 = Bi(Wi);
      return "light" === e3 || "dark" === e3 || "system" === e3 ? e3 : "system";
    });
    Gi = createServerRpc("src_lib_theme_ts--setTheme_createServerFn_handler", "/_serverFn", (e3, t3) => Ji.__executeServer(e3, t3));
    Ji = createServerFn({ method: "POST" }).validator((e3) => {
      if ("light" !== e3 && "dark" !== e3 && "system" !== e3) throw new Error("theme must be light | dark | system");
      return e3;
    }).handler(Gi, async ({ data: e3 }) => {
      Hi(Wi, e3, { path: "/", maxAge: 31536e3 });
    });
    Yi = "vite-ui-theme";
    Xi = W2.createContext(null);
    __name(ThemeProvider, "ThemeProvider");
    seo = /* @__PURE__ */ __name(({ title: e3, description: t3, keywords: r4, image: n3 }) => [{ title: e3 }, { name: "description", content: t3 }, { name: "keywords", content: r4 }, { name: "twitter:title", content: e3 }, { name: "twitter:description", content: t3 }, { name: "twitter:creator", content: "@tannerlinsley" }, { name: "twitter:site", content: "@tannerlinsley" }, { name: "og:type", content: "website" }, { name: "og:title", content: e3 }, { name: "og:description", content: t3 }, ...n3 ? [{ name: "twitter:image", content: n3 }, { name: "twitter:card", content: "summary_large_image" }, { name: "og:image", content: n3 }] : []], "seo");
    Zi = function(e3) {
      return new RootRoute(e3);
    }({ loader: /* @__PURE__ */ __name(() => Qi(), "loader"), head: /* @__PURE__ */ __name(() => ({ meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, ...seo({ title: "Instructa Start", description: "Instructa App Starter" })], links: [{ rel: "stylesheet", href: "/assets/app-CuP4mKs1.css" }, { rel: "stylesheet", href: "/assets/custom-tn0RQdqM.css" }, { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }, { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.png" }, { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon.png" }, { rel: "manifest", href: "/site.webmanifest", color: "#fffff" }, { rel: "icon", href: "/favicon.ico" }] }), "head"), errorComponent: /* @__PURE__ */ __name((e3) => c2.jsxDEV(RootDocument, { children: c2.jsxDEV(DefaultCatchBoundary, { ...e3 }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/__root.tsx", lineNumber: 71, columnNumber: 9 }, void 0) }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/__root.tsx", lineNumber: 70, columnNumber: 7 }, void 0), "errorComponent"), notFoundComponent: /* @__PURE__ */ __name(() => c2.jsxDEV(NotFound, {}, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/__root.tsx", lineNumber: 75, columnNumber: 28 }, void 0), "notFoundComponent"), component: /* @__PURE__ */ __name(function() {
      return c2.jsxDEV(RootDocument, { children: c2.jsxDEV(et, {}, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/__root.tsx", lineNumber: 82, columnNumber: 7 }, this) }, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/routes/__root.tsx", lineNumber: 81, columnNumber: 5 }, this);
    }, "component") });
    __name(RootDocument, "RootDocument");
    el = createFileRoute("/")({ component: function(e3, t3) {
      let r4, n3, s4;
      const load = /* @__PURE__ */ __name(() => (r4 || (r4 = e3().then((e4) => {
        r4 = void 0, n3 = e4[t3];
      }).catch((e4) => {
        s4 = e4, function(e5) {
          "string" == typeof (null == e5 ? void 0 : e5.message) && (e5.message.startsWith("Failed to fetch dynamically imported module") || e5.message.startsWith("error loading dynamically imported module") || e5.message.startsWith("Importing a module script failed"));
        }(s4);
      })), r4), "load"), lazyComp = /* @__PURE__ */ __name(function(e4) {
        if (s4) throw s4;
        if (!n3) throw load();
        return W2.createElement(n3, e4);
      }, "lazyComp");
      return lazyComp.preload = load, lazyComp;
    }(() => Promise.resolve().then(() => (init_index_DEtW6s6k(), index_DEtW6s6k_exports)), "component") });
    tl = createServerRoute().methods({ GET: /* @__PURE__ */ __name(async () => json({ message: "Hello from the test API!", timestamp: (/* @__PURE__ */ new Date()).toISOString(), data: { status: "success", value: 100 * Math.random() } }), "GET") });
    rl = Vi();
    nl = el.update({ id: "/", path: "/", getParentRoute: /* @__PURE__ */ __name(() => Zi, "getParentRoute") });
    sl = tl.update({ id: "/api/test", path: "/api/test", getParentRoute: /* @__PURE__ */ __name(() => rl, "getParentRoute") });
    ol = { IndexRoute: nl };
    al = Zi._addFileChildren(ol)._addFileTypes();
    il = { ApiTestServerRoute: sl };
    ll = rl._addFileChildren(il)._addFileTypes();
    ul = Object.freeze(Object.defineProperty({ __proto__: null, routeTree: al, serverRouteTree: ll }, Symbol.toStringTag, { value: "Module" }));
    cl = function({ createRouter: e3 }) {
      let t3, r4 = null, n3 = null;
      return (s4) => {
        const o5 = globalThis.fetch, startRequestResolver = /* @__PURE__ */ __name(async ({ request: a5 }) => {
          globalThis.fetch = async function(e4, t4) {
            function resolve(e5, t5) {
              const r5 = new Request(e5, t5);
              return startRequestResolver({ request: r5 });
            }
            __name(resolve, "resolve");
            function getOrigin() {
              return a5.headers.get("Origin") || a5.headers.get("Referer") || "http://localhost";
            }
            __name(getOrigin, "getOrigin");
            if ("string" == typeof e4 && e4.startsWith("/")) {
              return resolve(new URL(e4, getOrigin()), t4);
            }
            if ("object" == typeof e4 && "url" in e4 && "string" == typeof e4.url && e4.url.startsWith("/")) {
              return resolve(new URL(e4.url, getOrigin()), t4);
            }
            return o5(e4, t4);
          };
          const i5 = new URL(a5.url), l4 = decodeURIComponent(i5.href.replace(i5.origin, "")), u4 = await e3(), c4 = createMemoryHistory({ initialEntries: [l4] });
          u4.update({ history: c4, isShell: false });
          const d4 = await (async () => {
            try {
              0;
              const o6 = joinPaths(["/", (e4 = "/_serverFn", trimPathRight(trimPathLeft(e4))), "/"]);
              if (l4.startsWith(o6)) return await (async ({ request: e5 }) => {
                const t4 = new AbortController(), r5 = t4.signal, abort3 = /* @__PURE__ */ __name(() => t4.abort(), "abort");
                e5.signal.addEventListener("abort", abort3);
                const n4 = e5.method, s5 = new URL(e5.url, "http://localhost:3000"), o7 = new RegExp(`${a6 = "/_serverFn", a6.replace(/^\/|\/$/g, "")}/([^/?#]+)`);
                var a6;
                const i6 = s5.pathname.match(o7), l5 = i6 ? i6[1] : null, u5 = Object.fromEntries(s5.searchParams.entries()), c5 = "createServerFn" in u5;
                if ("string" != typeof l5) throw new Error("Invalid server action param for serverFnId: " + l5);
                const { default: d5 } = await loadVirtualModule(Ui), h5 = d5[l5];
                if (!h5) throw console.info("serverFnManifest", d5), new Error("Server function info not found for " + l5);
                const p4 = await h5.importer();
                if (!p4) throw console.info("serverFnInfo", h5), new Error("Server function module not resolved for " + l5);
                const f4 = p4[h5.functionName];
                if (!f4) throw console.info("serverFnInfo", h5), console.info("fnModule", p4), new Error(`Server function module export not resolved for serverFn ID: ${l5}`);
                const m5 = ["multipart/form-data", "application/x-www-form-urlencoded"], g3 = await (async () => {
                  try {
                    let t5 = await (async () => {
                      if (e5.headers.get("Content-Type") && m5.some((t7) => {
                        var r6;
                        return null == (r6 = e5.headers.get("Content-Type")) ? void 0 : r6.includes(t7);
                      })) return invariant("get" !== n4.toLowerCase()), await f4(await e5.formData(), r5);
                      if ("get" === n4.toLowerCase()) {
                        let e6 = u5;
                        return c5 && (e6 = u5.payload), e6 = e6 ? Na.parse(e6) : e6, await f4(e6, r5);
                      }
                      const t6 = await e5.text(), s6 = Na.parse(t6);
                      return c5 ? await f4(s6, r5) : await f4(...s6, r5);
                    })();
                    return t5.result instanceof Response ? t5.result : !c5 && (t5 = t5.result, t5 instanceof Response) ? t5 : isNotFound(t5) ? isNotFoundResponse(t5) : new Response(void 0 !== t5 ? Na.stringify(t5) : void 0, { status: Li(getEvent()), headers: { "Content-Type": "application/json" } });
                  } catch (e6) {
                    return e6 instanceof Response ? e6 : isNotFound(e6) ? isNotFoundResponse(e6) : (console.info(), console.info("Server Fn Error!"), console.info(), console.error(e6), console.info(), new Response(Na.stringify(e6), { status: 500, headers: { "Content-Type": "application/json" } }));
                  }
                })();
                return e5.signal.removeEventListener("abort", abort3), g3;
              })({ request: a5 });
              if (null === r4) try {
                r4 = await loadVirtualModule(zi), r4.serverRouteTree && (t3 = function({ routeTree: e5, initRoute: t4 }) {
                  const r5 = {}, n4 = {}, recurseRoutes = /* @__PURE__ */ __name((e6) => {
                    e6.forEach((e7, s6) => {
                      if (null == t4 || t4(e7, s6), invariant(!r5[e7.id], String(e7.id)), r5[e7.id] = e7, !e7.isRoot && e7.path) {
                        const t5 = trimPathRight(e7.fullPath);
                        n4[t5] && !e7.fullPath.endsWith("/") || (n4[t5] = e7);
                      }
                      const o8 = e7.children;
                      (null == o8 ? void 0 : o8.length) && recurseRoutes(o8);
                    });
                  }, "recurseRoutes");
                  recurseRoutes([e5]);
                  const s5 = [];
                  Object.values(r5).forEach((e6, t5) => {
                    var r6;
                    if (e6.isRoot || !e6.path) return;
                    const n5 = trimPathLeft(e6.fullPath), o8 = parsePathname(n5);
                    for (; o8.length > 1 && "/" === (null == (r6 = o8[0]) ? void 0 : r6.value); ) o8.shift();
                    const a6 = o8.map((e7) => "/" === e7.value ? 0.75 : "param" === e7.type && e7.prefixSegment && e7.suffixSegment ? 0.55 : "param" === e7.type && e7.prefixSegment ? 0.52 : "param" === e7.type && e7.suffixSegment ? 0.51 : "param" === e7.type ? 0.5 : "wildcard" === e7.type && e7.prefixSegment && e7.suffixSegment ? 0.3 : "wildcard" === e7.type && e7.prefixSegment ? 0.27 : "wildcard" === e7.type && e7.suffixSegment ? 0.26 : "wildcard" === e7.type ? 0.25 : 1);
                    s5.push({ child: e6, trimmed: n5, parsed: o8, index: t5, scores: a6 });
                  });
                  const o7 = s5.sort((e6, t5) => {
                    const r6 = Math.min(e6.scores.length, t5.scores.length);
                    for (let n5 = 0; n5 < r6; n5++) if (e6.scores[n5] !== t5.scores[n5]) return t5.scores[n5] - e6.scores[n5];
                    if (e6.scores.length !== t5.scores.length) return t5.scores.length - e6.scores.length;
                    for (let n5 = 0; n5 < r6; n5++) if (e6.parsed[n5].value !== t5.parsed[n5].value) return e6.parsed[n5].value > t5.parsed[n5].value ? 1 : -1;
                    return e6.index - t5.index;
                  }).map((e6, t5) => (e6.child.rank = t5, e6.child));
                  return { routesById: r5, routesByPath: n4, flatRoutes: o7 };
                }({ routeTree: r4.serverRouteTree, initRoute: /* @__PURE__ */ __name((e5, t4) => {
                  e5.init({ originalIndex: t4 });
                }, "initRoute") }));
              } catch (i6) {
                console.log(i6);
              }
              async function executeRouter() {
                const e5 = (a5.headers.get("Accept") || "*/*").split(",");
                if (!["*/*", "text/html"].some((t5) => e5.some((e6) => e6.trim().startsWith(t5)))) return json({ error: "Only HTML requests are supported here" }, { status: 500 });
                if (null === n3 && (n3 = await async function() {
                  const { tsrStartManifest: e6 } = await loadVirtualModule(qi), t5 = e6(), r6 = t5.routes[Oa] = t5.routes[Oa] || {};
                  r6.assets = r6.assets || [];
                  let n4 = `import('${t5.clientEntry}')`;
                  return r6.assets.push({ tag: "script", attrs: { type: "module", suppressHydrationWarning: true, async: true }, children: n4 }), { ...t5, routes: Object.fromEntries(Object.entries(t5.routes).map(([e7, t6]) => {
                    const { preloads: r7, assets: n5 } = t6;
                    return [e7, { preloads: r7, assets: n5 }];
                  })) };
                }()), attachRouterServerSsrUtils(u4, n3), await u4.load(), u4.state.redirect) return u4.state.redirect;
                await u4.serverSsr.dehydrate();
                const t4 = (r5 = { router: u4 }, mergeHeaders(Di(), { "Content-Type": "text/html; charset=UTF-8" }, ...r5.router.state.matches.map((e6) => e6.headers)));
                var r5;
                return await s4({ request: a5, router: u4, responseHeaders: t4 });
              }
              __name(executeRouter, "executeRouter");
              if (t3) {
                const [c5, d5] = await async function(e5) {
                  var t4, r5;
                  const n4 = new URL(e5.request.url), s5 = n4.pathname, o7 = function({ pathname: e6, routePathname: t5, basepath: r6, caseSensitive: n5, routesByPath: s6, routesById: o8, flatRoutes: a7 }) {
                    let i7 = {};
                    const l6 = trimPathRight(e6), getMatchedParams = /* @__PURE__ */ __name((e7) => {
                      var t6;
                      return matchPathname(r6, l6, { to: e7.fullPath, caseSensitive: (null == (t6 = e7.options) ? void 0 : t6.caseSensitive) ?? n5 });
                    }, "getMatchedParams");
                    let u5 = void 0 !== t5 ? s6[t5] : void 0;
                    u5 ? i7 = getMatchedParams(u5) : u5 = a7.find((e7) => {
                      const t6 = getMatchedParams(e7);
                      return !!t6 && (i7 = t6, true);
                    });
                    let c6 = u5 || o8[Oa];
                    const d6 = [c6];
                    for (; c6.parentRoute; ) c6 = c6.parentRoute, d6.unshift(c6);
                    return { matchedRoutes: d6, routeParams: i7, foundRoute: u5 };
                  }({ pathname: s5, basepath: e5.basePath, caseSensitive: true, routesByPath: e5.processedServerRouteTree.routesByPath, routesById: e5.processedServerRouteTree.routesById, flatRoutes: e5.processedServerRouteTree.flatRoutes }), a6 = e5.router.getMatchedRoutes(s5, void 0);
                  let i6, l5 = [];
                  if (l5 = o7.matchedRoutes, a6.foundRoute && o7.matchedRoutes.length < a6.matchedRoutes.length) {
                    const r6 = [...a6.matchedRoutes].reverse().find((t5) => void 0 !== e5.processedServerRouteTree.routesById[t5.id]);
                    if (r6) {
                      let n5 = r6.id;
                      l5 = [];
                      do {
                        const r7 = e5.processedServerRouteTree.routesById[n5];
                        if (!r7) break;
                        l5.push(r7), n5 = null == (t4 = r7.parentRoute) ? void 0 : t4.id;
                      } while (n5);
                      l5.reverse();
                    }
                  }
                  if (l5.length) {
                    const t5 = flattenMiddlewares(l5.flatMap((e6) => e6.options.middleware).filter(Boolean)).map((e6) => e6.options.server);
                    if (null == (r5 = o7.foundRoute) ? void 0 : r5.options.methods) {
                      const r6 = Object.keys(o7.foundRoute.options.methods).find((t6) => t6.toLowerCase() === e5.request.method.toLowerCase());
                      if (r6) {
                        const e6 = o7.foundRoute.options.methods[r6];
                        e6 && ("function" == typeof e6 ? t5.push(handlerToMiddleware(e6)) : (e6._options.middlewares && e6._options.middlewares.length && t5.push(...flattenMiddlewares(e6._options.middlewares).map((e7) => e7.options.server)), e6._options.handler && t5.push(handlerToMiddleware(e6._options.handler))));
                      }
                    }
                    t5.push(handlerToMiddleware(e5.executeRouter));
                    const n5 = await function(e6, t6) {
                      let r6 = -1;
                      const next = /* @__PURE__ */ __name(async (t7) => {
                        r6++;
                        const n6 = e6[r6];
                        if (!n6) return t7;
                        const s6 = await n6({ ...t7, next: /* @__PURE__ */ __name(async (e7) => {
                          const r7 = await next({ ...t7, ...e7 });
                          return Object.assign(t7, handleCtxResult(r7));
                        }, "next") }).catch((e7) => {
                          if (isSpecialResponse(e7)) return { response: e7 };
                          throw e7;
                        });
                        return Object.assign(t7, handleCtxResult(s6));
                      }, "next");
                      return handleCtxResult(next(t6));
                    }(t5, { request: e5.request, context: {}, params: o7.routeParams, pathname: s5 });
                    i6 = n5.response;
                  }
                  return [l5, i6];
                }({ processedServerRouteTree: t3, router: u4, request: a5, basePath: "/", executeRouter });
                if (d5) return d5;
              }
              return await executeRouter();
            } catch (h5) {
              if (h5 instanceof Response) return h5;
              throw h5;
            }
            var e4;
          })();
          if (isRedirect(d4)) {
            if (isRedirect(h4 = d4) && h4.options.href) return "manual" === a5.headers.get("x-tsr-redirect") ? json({ ...d4.options, isSerializedRedirect: true }, { headers: d4.headers }) : d4;
            if (d4.options.to && "string" == typeof d4.options.to && !d4.options.to.startsWith("/")) throw new Error(`Server side redirects must use absolute paths via the 'href' or 'to' options. Received: ${JSON.stringify(d4.options)}`);
            if (["params", "search", "hash"].some((e5) => "function" == typeof d4.options[e5])) throw new Error(`Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(d4.options).filter((e5) => "function" == typeof d4.options[e5]).map((e5) => `"${e5}"`).join(", ")}`);
            const e4 = u4.resolveRedirect(d4);
            return "manual" === a5.headers.get("x-tsr-redirect") ? json({ ...d4.options, isSerializedRedirect: true }, { headers: d4.headers }) : e4;
          }
          var h4;
          return d4;
        }, "startRequestResolver");
        return startRequestResolver;
      };
    }({ createRouter: /* @__PURE__ */ __name(function() {
      const e3 = new w2();
      return routerWithQueryClient(((e4) => new Router(e4))({ routeTree: al, context: { queryClient: e3 }, defaultPreload: "intent", defaultErrorComponent: DefaultCatchBoundary, defaultNotFoundComponent: /* @__PURE__ */ __name(() => c2.jsxDEV(NotFound, {}, void 0, false, { fileName: "/Users/kregenrek/projects/codefetchUI/src/router.tsx", lineNumber: 17, columnNumber: 45 }, this), "defaultNotFoundComponent") }), e3);
    }, "createRouter") })(defaultStreamHandler);
    dl = (hl = /* @__PURE__ */ __name(function(e3) {
      const t3 = toWebRequest(e3);
      return cl({ request: t3 });
    }, "hl"), function(e3) {
      if ("function" == typeof e3) return e3.__is_handler__ = true, e3;
      const t3 = { onRequest: _normalizeArray(e3.onRequest), onBeforeResponse: _normalizeArray(e3.onBeforeResponse) }, _handler = /* @__PURE__ */ __name((r4) => async function(e4, t4, r5) {
        if (r5.onRequest) {
          for (const t5 of r5.onRequest) if (await t5(e4), e4.handled) return;
        }
        const n3 = { body: await t4(e4) };
        if (r5.onBeforeResponse) for (const t5 of r5.onBeforeResponse) await t5(e4, n3);
        return n3.body;
      }(r4, e3.handler, t3), "_handler");
      return _handler.__is_handler__ = true, _handler.__resolve__ = e3.handler.__resolve__, _handler.__websocket__ = e3.websocket, _handler;
    }((e3) => async function(e4, t3) {
      return Ni.run(e4, t3);
    }(e3, () => hl(e3))));
    pl = Object.freeze(Object.defineProperty({ __proto__: null, a: createServerFn, c: createServerRpc, default: dl, g: Bi, s: Hi }, Symbol.toStringTag, { value: "Module" }));
  }
});

// .output/server/chunks/nitro/nitro.mjs
import { env as t2 } from "cloudflare:workers";
import { EventEmitter as r3 } from "node:events";
import { Buffer as s3 } from "node:buffer";
import { setImmediate as a4, clearImmediate as c3 } from "node:timers";
function createNotImplementedError2(e3) {
  return new Error(`[unenv] ${e3} is not implemented yet!`);
}
function notImplemented2(e3) {
  return Object.assign(() => {
    throw createNotImplementedError2(e3);
  }, { __unenv__: true });
}
function jsonParseTransform(e3, t3) {
  if (!("__proto__" === e3 || "constructor" === e3 && t3 && "object" == typeof t3 && "prototype" in t3)) return t3;
  !function(e4) {
    console.warn(`[destr] Dropping "${e4}" key to prevent prototype pollution.`);
  }(e3);
}
function destr(e3, t3 = {}) {
  if ("string" != typeof e3) return e3;
  if ('"' === e3[0] && '"' === e3[e3.length - 1] && -1 === e3.indexOf("\\")) return e3.slice(1, -1);
  const r4 = e3.trim();
  if (r4.length <= 9) switch (r4.toLowerCase()) {
    case "true":
      return true;
    case "false":
      return false;
    case "undefined":
      return;
    case "null":
      return null;
    case "nan":
      return Number.NaN;
    case "infinity":
      return Number.POSITIVE_INFINITY;
    case "-infinity":
      return Number.NEGATIVE_INFINITY;
  }
  if (!Rt2.test(e3)) {
    if (t3.strict) throw new SyntaxError("[destr] Invalid JSON");
    return e3;
  }
  try {
    if (bt2.test(e3) || xt2.test(e3)) {
      if (t3.strict) throw new Error("[destr] Possible prototype pollution");
      return JSON.parse(e3, jsonParseTransform);
    }
    return JSON.parse(e3);
  } catch (r5) {
    if (t3.strict) throw r5;
    return e3;
  }
}
function encodeQueryValue(e3) {
  return (t3 = "string" == typeof e3 ? e3 : JSON.stringify(e3), encodeURI("" + t3).replace(jt2, "|")).replace(At2, "%2B").replace(It2, "+").replace(kt2, "%23").replace(Et2, "%26").replace(Ht2, "`").replace(Tt2, "^").replace(Ct2, "%2F");
  var t3;
}
function encodeQueryKey(e3) {
  return encodeQueryValue(e3).replace(St2, "%3D");
}
function decode2(e3 = "") {
  try {
    return decodeURIComponent("" + e3);
  } catch {
    return "" + e3;
  }
}
function decodeQueryKey(e3) {
  return decode2(e3.replace(At2, " "));
}
function decodeQueryValue(e3) {
  return decode2(e3.replace(At2, " "));
}
function parseQuery(e3 = "") {
  const t3 = /* @__PURE__ */ Object.create(null);
  "?" === e3[0] && (e3 = e3.slice(1));
  for (const r4 of e3.split("&")) {
    const e4 = r4.match(/([^=]+)=?(.*)/) || [];
    if (e4.length < 2) continue;
    const s4 = decodeQueryKey(e4[1]);
    if ("__proto__" === s4 || "constructor" === s4) continue;
    const a5 = decodeQueryValue(e4[2] || "");
    void 0 === t3[s4] ? t3[s4] = a5 : Array.isArray(t3[s4]) ? t3[s4].push(a5) : t3[s4] = [t3[s4], a5];
  }
  return t3;
}
function stringifyQuery(e3) {
  return Object.keys(e3).filter((t3) => void 0 !== e3[t3]).map((t3) => {
    return r4 = t3, "number" != typeof (s4 = e3[t3]) && "boolean" != typeof s4 || (s4 = String(s4)), s4 ? Array.isArray(s4) ? s4.map((e4) => `${encodeQueryKey(r4)}=${encodeQueryValue(e4)}`).join("&") : `${encodeQueryKey(r4)}=${encodeQueryValue(s4)}` : encodeQueryKey(r4);
    var r4, s4;
  }).filter(Boolean).join("&");
}
function hasProtocol(e3, t3 = {}) {
  return "boolean" == typeof t3 && (t3 = { acceptRelative: t3 }), t3.strict ? Pt2.test(e3) : Mt2.test(e3) || !!t3.acceptRelative && Ot2.test(e3);
}
function withoutTrailingSlash(e3 = "", t3) {
  return (function(e4 = "") {
    return e4.endsWith("/");
  }(e3) ? e3.slice(0, -1) : e3) || "/";
}
function withTrailingSlash(e3 = "", t3) {
  return e3.endsWith("/") ? e3 : e3 + "/";
}
function withoutBase(e3, t3) {
  if (isEmptyURL(t3)) return e3;
  const r4 = withoutTrailingSlash(t3);
  if (!e3.startsWith(r4)) return e3;
  const s4 = e3.slice(r4.length);
  return "/" === s4[0] ? s4 : "/" + s4;
}
function withQuery(e3, t3) {
  const r4 = parseURL(e3), s4 = { ...parseQuery(r4.search), ...t3 };
  return r4.search = stringifyQuery(s4), function(e4) {
    const t4 = e4.pathname || "", r5 = e4.search ? (e4.search.startsWith("?") ? "" : "?") + e4.search : "", s5 = e4.hash || "", a5 = e4.auth ? e4.auth + "@" : "", c4 = e4.host || "", u4 = e4.protocol || e4[qt2] ? (e4.protocol || "") + "//" : "";
    return u4 + a5 + c4 + t4 + r5 + s5;
  }(r4);
}
function getQuery(e3) {
  return parseQuery(parseURL(e3).search);
}
function isEmptyURL(e3) {
  return !e3 || "/" === e3;
}
function joinURL(e3, ...t3) {
  let r4 = e3 || "";
  for (const e4 of t3.filter((e5) => /* @__PURE__ */ function(e6) {
    return e6 && "/" !== e6;
  }(e5))) if (r4) {
    const t4 = e4.replace(Nt2, "");
    r4 = withTrailingSlash(r4) + t4;
  } else r4 = e4;
  return r4;
}
function parseURL(e3 = "", t3) {
  const r4 = e3.match(/^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i);
  if (r4) {
    const [, e4, t4 = ""] = r4;
    return { protocol: e4.toLowerCase(), pathname: t4, href: e4 + t4, auth: "", host: "", search: "", hash: "" };
  }
  if (!hasProtocol(e3, { acceptRelative: true })) return parsePath(e3);
  const [, s4 = "", a5, c4 = ""] = e3.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, u4 = "", d4 = ""] = c4.match(/([^#/?]*)(.*)?/) || [];
  "file:" === s4 && (d4 = d4.replace(/\/(?=[A-Za-z]:)/, ""));
  const { pathname: h4, search: f4, hash: m5 } = parsePath(d4);
  return { protocol: s4.toLowerCase(), auth: a5 ? a5.slice(0, Math.max(0, a5.length - 1)) : "", host: u4, pathname: h4, search: f4, hash: m5, [qt2]: !s4 };
}
function parsePath(e3 = "") {
  const [t3 = "", r4 = "", s4 = ""] = (e3.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return { pathname: t3, search: r4, hash: s4 };
}
function createRouter$1(e3 = {}) {
  const t3 = { options: e3, rootNode: createRadixNode(), staticRoutesMap: {} }, normalizeTrailingSlash = /* @__PURE__ */ __name((t4) => e3.strictTrailingSlash ? t4 : t4.replace(/\/$/, "") || "/", "normalizeTrailingSlash");
  if (e3.routes) for (const r4 in e3.routes) insert(t3, normalizeTrailingSlash(r4), e3.routes[r4]);
  return { ctx: t3, lookup: /* @__PURE__ */ __name((e4) => function(e5, t4) {
    const r4 = e5.staticRoutesMap[t4];
    if (r4) return r4.data;
    const s4 = t4.split("/"), a5 = {};
    let c4 = false, u4 = null, d4 = e5.rootNode, h4 = null;
    for (let e6 = 0; e6 < s4.length; e6++) {
      const t5 = s4[e6];
      null !== d4.wildcardChildNode && (u4 = d4.wildcardChildNode, h4 = s4.slice(e6).join("/"));
      const r5 = d4.children.get(t5);
      if (void 0 === r5) {
        if (d4 && d4.placeholderChildren.length > 1) {
          const t6 = s4.length - e6;
          d4 = d4.placeholderChildren.find((e7) => e7.maxDepth === t6) || null;
        } else d4 = d4.placeholderChildren[0] || null;
        if (!d4) break;
        d4.paramName && (a5[d4.paramName] = t5), c4 = true;
      } else d4 = r5;
    }
    null !== d4 && null !== d4.data || null === u4 || (d4 = u4, a5[d4.paramName || "_"] = h4, c4 = true);
    if (!d4) return null;
    if (c4) return { ...d4.data, params: c4 ? a5 : void 0 };
    return d4.data;
  }(t3, normalizeTrailingSlash(e4)), "lookup"), insert: /* @__PURE__ */ __name((e4, r4) => insert(t3, normalizeTrailingSlash(e4), r4), "insert"), remove: /* @__PURE__ */ __name((e4) => function(e5, t4) {
    let r4 = false;
    const s4 = t4.split("/");
    let a5 = e5.rootNode;
    for (const e6 of s4) if (a5 = a5.children.get(e6), !a5) return r4;
    if (a5.data) {
      const e6 = s4.at(-1) || "";
      a5.data = null, 0 === Object.keys(a5.children).length && a5.parent && (a5.parent.children.delete(e6), a5.parent.wildcardChildNode = null, a5.parent.placeholderChildren = []), r4 = true;
    }
    return r4;
  }(t3, normalizeTrailingSlash(e4)), "remove") };
}
function insert(e3, t3, r4) {
  let s4 = true;
  const a5 = t3.split("/");
  let c4 = e3.rootNode, u4 = 0;
  const d4 = [c4];
  for (const e4 of a5) {
    let t4;
    if (t4 = c4.children.get(e4)) c4 = t4;
    else {
      const r5 = getNodeType(e4);
      t4 = createRadixNode({ type: r5, parent: c4 }), c4.children.set(e4, t4), r5 === zt2 ? (t4.paramName = "*" === e4 ? "_" + u4++ : e4.slice(1), c4.placeholderChildren.push(t4), s4 = false) : r5 === Ut2 && (c4.wildcardChildNode = t4, t4.paramName = e4.slice(3) || "_", s4 = false), d4.push(t4), c4 = t4;
    }
  }
  for (const [e4, t4] of d4.entries()) t4.maxDepth = Math.max(d4.length - e4, t4.maxDepth || 0);
  return c4.data = r4, true === s4 && (e3.staticRoutesMap[t3] = c4), c4;
}
function createRadixNode(e3 = {}) {
  return { type: e3.type || Bt2, maxDepth: 0, parent: e3.parent || null, children: /* @__PURE__ */ new Map(), data: e3.data || null, paramName: e3.paramName || null, wildcardChildNode: null, placeholderChildren: [] };
}
function getNodeType(e3) {
  return e3.startsWith("**") ? Ut2 : ":" === e3[0] || "*" === e3 ? zt2 : Bt2;
}
function toRouteMatcher(e3) {
  return /* @__PURE__ */ function(e4, t3) {
    return { ctx: { table: e4 }, matchAll: /* @__PURE__ */ __name((r4) => _matchRoutes(r4, e4, t3), "matchAll") };
  }(_routerNodeToTable("", e3.ctx.rootNode), e3.ctx.options.strictTrailingSlash);
}
function _matchRoutes(e3, t3, r4) {
  true !== r4 && e3.endsWith("/") && (e3 = e3.slice(0, -1) || "/");
  const s4 = [];
  for (const [r5, a6] of _sortRoutesMap(t3.wildcard)) (e3 === r5 || e3.startsWith(r5 + "/")) && s4.push(a6);
  for (const [r5, a6] of _sortRoutesMap(t3.dynamic)) if (e3.startsWith(r5 + "/")) {
    const t4 = "/" + e3.slice(r5.length).split("/").splice(2).join("/");
    s4.push(..._matchRoutes(t4, a6));
  }
  const a5 = t3.static.get(e3);
  return a5 && s4.push(a5), s4.filter(Boolean);
}
function _sortRoutesMap(e3) {
  return [...e3.entries()].sort((e4, t3) => e4[0].length - t3[0].length);
}
function _routerNodeToTable(e3, t3) {
  const r4 = { static: /* @__PURE__ */ new Map(), wildcard: /* @__PURE__ */ new Map(), dynamic: /* @__PURE__ */ new Map() };
  return (/* @__PURE__ */ __name(function _addNode(e4, t4) {
    if (e4) if (t4.type !== Bt2 || e4.includes("*") || e4.includes(":")) {
      if (t4.type === Ut2) r4.wildcard.set(e4.replace("/**", ""), t4.data);
      else if (t4.type === zt2) {
        const s4 = _routerNodeToTable("", t4);
        return t4.data && s4.static.set("/", t4.data), void r4.dynamic.set(e4.replace(/\/\*|\/:\w+/, ""), s4);
      }
    } else t4.data && r4.static.set(e4, t4.data);
    for (const [r5, s4] of t4.children.entries()) _addNode(`${e4}/${r5}`.replace("//", "/"), s4);
  }, "_addNode"))(e3, t3), r4;
}
function isPlainObject2(e3) {
  if (null === e3 || "object" != typeof e3) return false;
  const t3 = Object.getPrototypeOf(e3);
  return (null === t3 || t3 === Object.prototype || null === Object.getPrototypeOf(t3)) && (!(Symbol.iterator in e3) && (!(Symbol.toStringTag in e3) || "[object Module]" === Object.prototype.toString.call(e3)));
}
function _defu(e3, t3, r4 = ".", s4) {
  if (!isPlainObject2(t3)) return _defu(e3, {}, r4, s4);
  const a5 = Object.assign({}, t3);
  for (const t4 in e3) {
    if ("__proto__" === t4 || "constructor" === t4) continue;
    const c4 = e3[t4];
    null != c4 && (s4 && s4(a5, t4, c4, r4) || (Array.isArray(c4) && Array.isArray(a5[t4]) ? a5[t4] = [...c4, ...a5[t4]] : isPlainObject2(c4) && isPlainObject2(a5[t4]) ? a5[t4] = _defu(c4, a5[t4], (r4 ? `${r4}.` : "") + t4.toString(), s4) : a5[t4] = c4));
  }
  return a5;
}
function createDefu(e3) {
  return (...t3) => t3.reduce((t4, r4) => _defu(t4, r4, "", e3), {});
}
function o4(e3) {
  throw new Error(`${e3} is not implemented yet!`);
}
function p3(e3) {
  const t3 = {};
  for (const [r4, s4] of Object.entries(e3)) r4 && (t3[r4] = (Array.isArray(s4) ? s4 : [s4]).filter(Boolean));
  return t3;
}
function v2(e3 = {}) {
  if (e3 instanceof Headers) return e3;
  const t3 = new Headers();
  for (const [r4, s4] of Object.entries(e3)) if (void 0 !== s4) {
    if (Array.isArray(s4)) {
      for (const e4 of s4) t3.append(r4, String(e4));
      continue;
    }
    t3.set(r4, String(s4));
  }
  return t3;
}
async function b2(e3, t3) {
  const r4 = new y2(), s4 = new w3(r4);
  let a5;
  if (r4.url = t3.url?.toString() || "/", !r4.url.startsWith("/")) {
    const e4 = new URL(r4.url);
    a5 = e4.host, r4.url = e4.pathname + e4.search + e4.hash;
  }
  r4.method = t3.method || "GET", r4.headers = function(e4 = {}) {
    const t4 = new Ft2(), r5 = Array.isArray(e4) || function(e5) {
      return "function" == typeof e5?.entries;
    }(e4) ? e4 : Object.entries(e4);
    for (const [e5, s5] of r5) if (s5) {
      if (void 0 === t4[e5]) {
        t4[e5] = s5;
        continue;
      }
      t4[e5] = [...Array.isArray(t4[e5]) ? t4[e5] : [t4[e5]], ...Array.isArray(s5) ? s5 : [s5]];
    }
    return t4;
  }(t3.headers || {}), r4.headers.host || (r4.headers.host = t3.host || a5 || "localhost"), r4.connection.encrypted = r4.connection.encrypted || "https" === t3.protocol, r4.body = t3.body || null, r4.__unenv__ = t3.context, await e3(r4, s4);
  let c4 = s4._data;
  (Qt2.has(s4.statusCode) || "HEAD" === r4.method.toUpperCase()) && (c4 = null, delete s4._headers["content-length"]);
  const u4 = { status: s4.statusCode, statusText: s4.statusMessage, headers: s4._headers, body: c4 };
  return r4.destroy(), s4.destroy(), u4;
}
function hasProp2(e3, t3) {
  try {
    return t3 in e3;
  } catch {
    return false;
  }
}
function createError(e3) {
  if ("string" == typeof e3) return new H3Error2(e3);
  if (isError(e3)) return e3;
  const t3 = new H3Error2(e3.message ?? e3.statusMessage ?? "", { cause: e3.cause || e3 });
  if (hasProp2(e3, "stack")) try {
    Object.defineProperty(t3, "stack", { get: /* @__PURE__ */ __name(() => e3.stack, "get") });
  } catch {
    try {
      t3.stack = e3.stack;
    } catch {
    }
  }
  if (e3.data && (t3.data = e3.data), e3.statusCode ? t3.statusCode = sanitizeStatusCode2(e3.statusCode, t3.statusCode) : e3.status && (t3.statusCode = sanitizeStatusCode2(e3.status, t3.statusCode)), e3.statusMessage ? t3.statusMessage = e3.statusMessage : e3.statusText && (t3.statusMessage = e3.statusText), t3.statusMessage) {
    const e4 = t3.statusMessage;
    sanitizeStatusMessage2(t3.statusMessage) !== e4 && console.warn("[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default.");
  }
  return void 0 !== e3.fatal && (t3.fatal = e3.fatal), void 0 !== e3.unhandled && (t3.unhandled = e3.unhandled), t3;
}
function isError(e3) {
  return true === e3?.constructor?.__h3_error__;
}
function readRawBody(e3, t3 = "utf8") {
  !function(e4, t4) {
    if (!function(e5, t5) {
      if ("string" == typeof t5) {
        if (e5.method === t5) return true;
      } else if (t5.includes(e5.method)) return true;
      return false;
    }(e4, t4)) throw createError({ statusCode: 405, statusMessage: "HTTP method is not allowed." });
  }(e3, Vt2);
  const r4 = e3._requestBody || e3.web?.request?.body || e3.node.req[Jt2] || e3.node.req.rawBody || e3.node.req.body;
  if (r4) {
    const e4 = Promise.resolve(r4).then((e5) => s3.isBuffer(e5) ? e5 : "function" == typeof e5.pipeTo ? new Promise((t4, r5) => {
      const a6 = [];
      e5.pipeTo(new WritableStream({ write(e6) {
        a6.push(e6);
      }, close() {
        t4(s3.concat(a6));
      }, abort(e6) {
        r5(e6);
      } })).catch(r5);
    }) : "function" == typeof e5.pipe ? new Promise((t4, r5) => {
      const a6 = [];
      e5.on("data", (e6) => {
        a6.push(e6);
      }).on("end", () => {
        t4(s3.concat(a6));
      }).on("error", r5);
    }) : e5.constructor === Object ? s3.from(JSON.stringify(e5)) : e5 instanceof URLSearchParams ? s3.from(e5.toString()) : e5 instanceof FormData ? new Response(e5).bytes().then((e6) => s3.from(e6)) : s3.from(e5));
    return t3 ? e4.then((e5) => e5.toString(t3)) : e4;
  }
  if (!Number.parseInt(e3.node.req.headers["content-length"] || "") && !String(e3.node.req.headers["transfer-encoding"] ?? "").split(",").map((e4) => e4.trim()).filter(Boolean).includes("chunked")) return Promise.resolve(void 0);
  const a5 = e3.node.req[Jt2] = new Promise((t4, r5) => {
    const a6 = [];
    e3.node.req.on("error", (e4) => {
      r5(e4);
    }).on("data", (e4) => {
      a6.push(e4);
    }).on("end", () => {
      t4(s3.concat(a6));
    });
  });
  return t3 ? a5.then((e4) => e4.toString(t3)) : a5;
}
function handleCacheHeaders(e3, t3) {
  const r4 = ["public", ...t3.cacheControls || []];
  let s4 = false;
  if (void 0 !== t3.maxAge && r4.push("max-age=" + +t3.maxAge, "s-maxage=" + +t3.maxAge), t3.modifiedTime) {
    const r5 = new Date(t3.modifiedTime), a5 = e3.node.req.headers["if-modified-since"];
    e3.node.res.setHeader("last-modified", r5.toUTCString()), a5 && new Date(a5) >= r5 && (s4 = true);
  }
  if (t3.etag) {
    e3.node.res.setHeader("etag", t3.etag);
    e3.node.req.headers["if-none-match"] === t3.etag && (s4 = true);
  }
  return e3.node.res.setHeader("cache-control", r4.join(", ")), !!s4 && (e3.node.res.statusCode = 304, e3.handled || e3.node.res.end(), true);
}
function sanitizeStatusMessage2(e3 = "") {
  return e3.replace(Gt2, "");
}
function sanitizeStatusCode2(e3, t3 = 200) {
  return e3 ? ("string" == typeof e3 && (e3 = Number.parseInt(e3, 10)), e3 < 100 || e3 > 999 ? t3 : e3) : t3;
}
function splitCookiesString2(e3) {
  if (Array.isArray(e3)) return e3.flatMap((e4) => splitCookiesString2(e4));
  if ("string" != typeof e3) return [];
  const t3 = [];
  let r4, s4, a5, c4, u4, d4 = 0;
  const skipWhitespace = /* @__PURE__ */ __name(() => {
    for (; d4 < e3.length && /\s/.test(e3.charAt(d4)); ) d4 += 1;
    return d4 < e3.length;
  }, "skipWhitespace"), notSpecialChar = /* @__PURE__ */ __name(() => (s4 = e3.charAt(d4), "=" !== s4 && ";" !== s4 && "," !== s4), "notSpecialChar");
  for (; d4 < e3.length; ) {
    for (r4 = d4, u4 = false; skipWhitespace(); ) if (s4 = e3.charAt(d4), "," === s4) {
      for (a5 = d4, d4 += 1, skipWhitespace(), c4 = d4; d4 < e3.length && notSpecialChar(); ) d4 += 1;
      d4 < e3.length && "=" === e3.charAt(d4) ? (u4 = true, d4 = c4, t3.push(e3.slice(r4, a5)), r4 = d4) : d4 = a5 + 1;
    } else d4 += 1;
    (!u4 || d4 >= e3.length) && t3.push(e3.slice(r4));
  }
  return t3;
}
function send2(e3, t3, r4) {
  return r4 && function(e4, t4) {
    t4 && 304 !== e4.node.res.statusCode && !e4.node.res.getHeader("content-type") && e4.node.res.setHeader("content-type", t4);
  }(e3, r4), new Promise((r5) => {
    Yt2(() => {
      e3.handled || e3.node.res.end(t3), r5();
    });
  });
}
function setResponseStatus(e3, t3, r4) {
  t3 && (e3.node.res.statusCode = sanitizeStatusCode2(t3, e3.node.res.statusCode)), r4 && (e3.node.res.statusMessage = sanitizeStatusMessage2(r4));
}
function setResponseHeaders(e3, t3) {
  for (const [r4, s4] of Object.entries(t3)) e3.node.res.setHeader(r4, s4);
}
function sendStream(e3, t3) {
  if (!t3 || "object" != typeof t3) throw new Error("[h3] Invalid stream provided.");
  if (e3.node.res._data = t3, !e3.node.res.socket) return e3._handled = true, Promise.resolve();
  if (hasProp2(t3, "pipeTo") && "function" == typeof t3.pipeTo) return t3.pipeTo(new WritableStream({ write(t4) {
    e3.node.res.write(t4);
  } })).then(() => {
    e3.node.res.end();
  });
  if (hasProp2(t3, "pipe") && "function" == typeof t3.pipe) return new Promise((r4, s4) => {
    t3.pipe(e3.node.res), t3.on && (t3.on("end", () => {
      e3.node.res.end(), r4();
    }), t3.on("error", (e4) => {
      s4(e4);
    })), e3.node.res.on("close", () => {
      t3.abort && t3.abort();
    });
  });
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse2(e3, t3) {
  for (const [r4, s4] of t3.headers) "set-cookie" === r4 ? e3.node.res.appendHeader(r4, splitCookiesString2(s4)) : e3.node.res.setHeader(r4, s4);
  if (t3.status && (e3.node.res.statusCode = sanitizeStatusCode2(t3.status, e3.node.res.statusCode)), t3.statusText && (e3.node.res.statusMessage = sanitizeStatusMessage2(t3.statusText)), t3.redirected && e3.node.res.setHeader("location", t3.url), t3.body) return sendStream(e3, t3.body);
  e3.node.res.end();
}
async function proxyRequest(e3, t3, r4 = {}) {
  let s4, a5;
  er2.has(e3.method) && (r4.streamRequest ? (s4 = function(e4) {
    if (!Vt2.includes(e4.method)) return;
    const t4 = e4.web?.request?.body || e4._requestBody;
    return t4 || (Jt2 in e4.node.req || "rawBody" in e4.node.req || "body" in e4.node.req || "__unenv__" in e4.node.req ? new ReadableStream({ async start(t5) {
      const r5 = await readRawBody(e4, false);
      r5 && t5.enqueue(r5), t5.close();
    } }) : new ReadableStream({ start: /* @__PURE__ */ __name((t5) => {
      e4.node.req.on("data", (e5) => {
        t5.enqueue(e5);
      }), e4.node.req.on("end", () => {
        t5.close();
      }), e4.node.req.on("error", (e5) => {
        t5.error(e5);
      });
    }, "start") }));
  }(e3), a5 = "half") : s4 = await readRawBody(e3, false).catch(() => {
  }));
  const c4 = r4.fetchOptions?.method || e3.method, u4 = function(e4, ...t4) {
    const r5 = t4.filter(Boolean);
    if (0 === r5.length) return e4;
    const s5 = new Headers(e4);
    for (const e5 of r5) {
      const t5 = Array.isArray(e5) ? e5 : "function" == typeof e5.entries ? e5.entries() : Object.entries(e5);
      for (const [e6, r6] of t5) void 0 !== r6 && s5.set(e6, r6);
    }
    return s5;
  }(getProxyRequestHeaders(e3, { host: t3.startsWith("/") }), r4.fetchOptions?.headers, r4.headers);
  return async function(e4, t4, r5 = {}) {
    let s5;
    try {
      s5 = await _getFetch(r5.fetch)(t4, { headers: r5.headers, ignoreResponseError: true, ...r5.fetchOptions });
    } catch (e5) {
      throw createError({ status: 502, statusMessage: "Bad Gateway", cause: e5 });
    }
    e4.node.res.statusCode = sanitizeStatusCode2(s5.status, e4.node.res.statusCode), e4.node.res.statusMessage = sanitizeStatusMessage2(s5.statusText);
    const a6 = [];
    for (const [t5, r6] of s5.headers.entries()) "content-encoding" !== t5 && "content-length" !== t5 && ("set-cookie" !== t5 ? e4.node.res.setHeader(t5, r6) : a6.push(...splitCookiesString2(r6)));
    a6.length > 0 && e4.node.res.setHeader("set-cookie", a6.map((e5) => (r5.cookieDomainRewrite && (e5 = rewriteCookieProperty(e5, r5.cookieDomainRewrite, "domain")), r5.cookiePathRewrite && (e5 = rewriteCookieProperty(e5, r5.cookiePathRewrite, "path")), e5)));
    r5.onResponse && await r5.onResponse(e4, s5);
    if (void 0 !== s5._data) return s5._data;
    if (e4.handled) return;
    if (false === r5.sendStream) {
      const t5 = new Uint8Array(await s5.arrayBuffer());
      return e4.node.res.end(t5);
    }
    if (s5.body) for await (const t5 of s5.body) e4.node.res.write(t5);
    return e4.node.res.end();
  }(e3, t3, { ...r4, fetchOptions: { method: c4, body: s4, duplex: a5, ...r4.fetchOptions, headers: u4 } });
}
function getProxyRequestHeaders(e3, t3) {
  const r4 = /* @__PURE__ */ Object.create(null), s4 = function(e4) {
    const t4 = {};
    for (const r5 in e4.node.req.headers) {
      const s5 = e4.node.req.headers[r5];
      t4[r5] = Array.isArray(s5) ? s5.filter(Boolean).join(", ") : s5;
    }
    return t4;
  }(e3);
  for (const e4 in s4) (!tr2.has(e4) || "host" === e4 && t3?.host) && (r4[e4] = s4[e4]);
  return r4;
}
function fetchWithEvent(e3, t3, r4, s4) {
  return _getFetch(s4?.fetch)(t3, { ...r4, context: r4?.context || e3.context, headers: { ...getProxyRequestHeaders(e3, { host: "string" == typeof t3 && t3.startsWith("/") }), ...r4?.headers } });
}
function _getFetch(e3) {
  if (e3) return e3;
  if (globalThis.fetch) return globalThis.fetch;
  throw new Error("fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js.");
}
function rewriteCookieProperty(e3, t3, r4) {
  const s4 = "string" == typeof t3 ? { "*": t3 } : t3;
  return e3.replace(new RegExp(`(;\\s*${r4}=)([^;]+)`, "gi"), (e4, t4, r5) => {
    let a5;
    if (r5 in s4) a5 = s4[r5];
    else {
      if (!("*" in s4)) return e4;
      a5 = s4["*"];
    }
    return a5 ? t4 + a5 : "";
  });
}
function isEvent(e3) {
  return hasProp2(e3, "__is_event__");
}
function createEvent(e3, t3) {
  return new H3Event2(e3, t3);
}
function defineEventHandler(e3) {
  if ("function" == typeof e3) return e3.__is_handler__ = true, e3;
  const t3 = { onRequest: _normalizeArray2(e3.onRequest), onBeforeResponse: _normalizeArray2(e3.onBeforeResponse) }, _handler = /* @__PURE__ */ __name((r4) => async function(e4, t4, r5) {
    if (r5.onRequest) {
      for (const t5 of r5.onRequest) if (await t5(e4), e4.handled) return;
    }
    const s4 = await t4(e4), a5 = { body: s4 };
    if (r5.onBeforeResponse) for (const t5 of r5.onBeforeResponse) await t5(e4, a5);
    return a5.body;
  }(r4, e3.handler, t3), "_handler");
  return _handler.__is_handler__ = true, _handler.__resolve__ = e3.handler.__resolve__, _handler.__websocket__ = e3.websocket, _handler;
}
function _normalizeArray2(e3) {
  return e3 ? Array.isArray(e3) ? e3 : [e3] : void 0;
}
function isEventHandler(e3) {
  return hasProp2(e3, "__is_handler__");
}
function toEventHandler(e3, t3, r4) {
  return isEventHandler(e3) || console.warn("[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.", r4 && "/" !== r4 ? `
     Route: ${r4}` : "", `
     Handler: ${e3}`), e3;
}
function createApp(e3 = {}) {
  const t3 = [], r4 = function(e4, t4) {
    const r5 = t4.debug ? 2 : void 0;
    return rr2(async (s5) => {
      s5.node.req.originalUrl = s5.node.req.originalUrl || s5.node.req.url || "/";
      const a6 = s5._path || s5.node.req.url || "/";
      let c5;
      t4.onRequest && await t4.onRequest(s5);
      for (const u4 of e4) {
        if (u4.route.length > 1) {
          if (!a6.startsWith(u4.route)) continue;
          c5 = a6.slice(u4.route.length) || "/";
        } else c5 = a6;
        if (u4.match && !u4.match(c5, s5)) continue;
        s5._path = c5, s5.node.req.url = c5;
        const e5 = await u4.handler(s5), d4 = void 0 === e5 ? void 0 : await e5;
        if (void 0 !== d4) {
          const e6 = { body: d4 };
          return t4.onBeforeResponse && (s5._onBeforeResponseCalled = true, await t4.onBeforeResponse(s5, e6)), await handleHandlerResponse(s5, e6.body, r5), void (t4.onAfterResponse && (s5._onAfterResponseCalled = true, await t4.onAfterResponse(s5, e6)));
        }
        if (s5.handled) return void (t4.onAfterResponse && (s5._onAfterResponseCalled = true, await t4.onAfterResponse(s5, void 0)));
      }
      if (!s5.handled) throw createError({ statusCode: 404, statusMessage: `Cannot find any path matching ${s5.path || "/"}.` });
      t4.onAfterResponse && (s5._onAfterResponseCalled = true, await t4.onAfterResponse(s5, void 0));
    });
  }(t3, e3), s4 = /* @__PURE__ */ function(e4) {
    return async (t4) => {
      let r5;
      for (const s5 of e4) {
        if ("/" === s5.route && !s5.handler.__resolve__) continue;
        if (!t4.startsWith(s5.route)) continue;
        if (r5 = t4.slice(s5.route.length) || "/", s5.match && !s5.match(r5, void 0)) continue;
        let e5 = { route: s5.route, handler: s5.handler };
        if (e5.handler.__resolve__) {
          const t5 = await e5.handler.__resolve__(r5);
          if (!t5) continue;
          e5 = { ...e5, ...t5, route: joinURL(e5.route || "/", t5.route || "/") };
        }
        return e5;
      }
    };
  }(t3);
  r4.__resolve__ = s4;
  const a5 = /* @__PURE__ */ function(e4) {
    let t4;
    return () => (t4 || (t4 = e4()), t4);
  }(() => {
    return t4 = s4, { ...e3.websocket, async resolve(e4) {
      const r5 = e4.request?.url || e4.url || "/", { pathname: s5 } = "string" == typeof r5 ? parseURL(r5) : r5, a6 = await t4(s5);
      return a6?.handler?.__websocket__ || {};
    } };
    var t4;
  }), c4 = { use: /* @__PURE__ */ __name((e4, t4, r5) => use(c4, e4, t4, r5), "use"), resolve: s4, handler: r4, stack: t3, options: e3, get websocket() {
    return a5();
  } };
  return c4;
}
function use(e3, t3, r4, s4) {
  if (Array.isArray(t3)) for (const a5 of t3) use(e3, a5, r4, s4);
  else if (Array.isArray(r4)) for (const a5 of r4) use(e3, t3, a5, s4);
  else "string" == typeof t3 ? e3.stack.push(normalizeLayer({ ...s4, route: t3, handler: r4 })) : "function" == typeof t3 ? e3.stack.push(normalizeLayer({ ...r4, handler: t3 })) : e3.stack.push(normalizeLayer({ ...t3 }));
  return e3;
}
function normalizeLayer(e3) {
  let t3 = e3.handler;
  return t3.handler && (t3 = t3.handler), e3.lazy ? t3 = lazyEventHandler(t3) : isEventHandler(t3) || (t3 = toEventHandler(t3, 0, e3.route)), { route: withoutTrailingSlash(e3.route), match: e3.match, handler: t3 };
}
function handleHandlerResponse(e3, t3, r4) {
  if (null === t3) return function(e4, t4) {
    if (e4.handled) return;
    t4 || 200 === e4.node.res.statusCode || (t4 = e4.node.res.statusCode);
    const r5 = sanitizeStatusCode2(t4, 204);
    204 === r5 && e4.node.res.removeHeader("content-length"), e4.node.res.writeHead(r5), e4.node.res.end();
  }(e3);
  if (t3) {
    if (a5 = t3, "undefined" != typeof Response && a5 instanceof Response) return sendWebResponse2(e3, t3);
    if (function(e4) {
      if (!e4 || "object" != typeof e4) return false;
      if ("function" == typeof e4.pipe) {
        if ("function" == typeof e4._read) return true;
        if ("function" == typeof e4.abort) return true;
      }
      return "function" == typeof e4.pipeTo;
    }(t3)) return sendStream(e3, t3);
    if (t3.buffer) return send2(e3, t3);
    if (t3.arrayBuffer && "function" == typeof t3.arrayBuffer) return t3.arrayBuffer().then((r5) => send2(e3, s3.from(r5), t3.type));
    if (t3 instanceof Error) throw createError(t3);
    if ("function" == typeof t3.end) return true;
  }
  var a5;
  const c4 = typeof t3;
  if ("string" === c4) return send2(e3, t3, Zt2.html);
  if ("object" === c4 || "boolean" === c4 || "number" === c4) return send2(e3, JSON.stringify(t3, void 0, r4), Zt2.json);
  if ("bigint" === c4) return send2(e3, t3.toString(), Zt2.json);
  throw createError({ statusCode: 500, statusMessage: `[h3] Cannot send ${c4} as response.` });
}
function toNodeListener(e3) {
  return async function(t3, r4) {
    const s4 = createEvent(t3, r4);
    try {
      await e3.handler(s4);
    } catch (t4) {
      const r5 = createError(t4);
      if (isError(t4) || (r5.unhandled = true), setResponseStatus(s4, r5.statusCode, r5.statusMessage), e3.options.onError && await e3.options.onError(r5, s4), s4.handled) return;
      (r5.unhandled || r5.fatal) && console.error("[h3]", r5.fatal ? "[fatal]" : "[unhandled]", r5), e3.options.onBeforeResponse && !s4._onBeforeResponseCalled && await e3.options.onBeforeResponse(s4, { body: r5 }), await function(e4, t5, r6) {
        if (e4.handled) return;
        const s5 = isError(t5) ? t5 : createError(t5), a5 = { statusCode: s5.statusCode, statusMessage: s5.statusMessage, stack: [], data: s5.data };
        if (r6 && (a5.stack = (s5.stack || "").split("\n").map((e5) => e5.trim())), e4.handled) return;
        setResponseStatus(e4, Number.parseInt(s5.statusCode), s5.statusMessage), e4.node.res.setHeader("content-type", Zt2.json), e4.node.res.end(JSON.stringify(a5, void 0, 2));
      }(s4, r5, !!e3.options.debug), e3.options.onAfterResponse && !s4._onAfterResponseCalled && await e3.options.onAfterResponse(s4, { body: r5 });
    }
  };
}
function flatHooks(e3, t3 = {}, r4) {
  for (const s4 in e3) {
    const a5 = e3[s4], c4 = r4 ? `${r4}:${s4}` : s4;
    "object" == typeof a5 && null !== a5 ? flatHooks(a5, t3, c4) : "function" == typeof a5 && (t3[c4] = a5);
  }
  return t3;
}
function serialTaskCaller(e3, t3) {
  const r4 = t3.shift(), s4 = sr2(r4);
  return e3.reduce((e4, r5) => e4.then(() => s4.run(() => r5(...t3))), Promise.resolve());
}
function parallelTaskCaller(e3, t3) {
  const r4 = t3.shift(), s4 = sr2(r4);
  return Promise.all(e3.map((e4) => s4.run(() => e4(...t3))));
}
function callEachWith(e3, t3) {
  for (const r4 of [...e3]) r4(t3);
}
function isPayloadMethod(e3 = "GET") {
  return ir2.has(e3.toUpperCase());
}
function resolveFetchOptions(e3, t3, r4, s4) {
  const a5 = function(e4, t4, r5) {
    if (!t4) return new r5(e4);
    const s5 = new r5(t4);
    if (e4) for (const [t5, a6] of Symbol.iterator in e4 || Array.isArray(e4) ? e4 : new r5(e4)) s5.set(t5, a6);
    return s5;
  }(t3?.headers ?? e3?.headers, r4?.headers, s4);
  let c4;
  return (r4?.query || r4?.params || t3?.params || t3?.query) && (c4 = { ...r4?.params, ...r4?.query, ...t3?.params, ...t3?.query }), { ...r4, ...t3, query: c4, params: c4, headers: a5 };
}
async function callHooks(e3, t3) {
  if (t3) if (Array.isArray(t3)) for (const r4 of t3) await r4(e3);
  else await t3(e3);
}
function createFetch(e3 = {}) {
  const { fetch: t3 = globalThis.fetch, Headers: r4 = globalThis.Headers, AbortController: s4 = globalThis.AbortController } = e3;
  async function onError2(e4) {
    const t4 = e4.error && "AbortError" === e4.error.name && !e4.options.timeout || false;
    if (false !== e4.options.retry && !t4) {
      let t5;
      t5 = "number" == typeof e4.options.retry ? e4.options.retry : isPayloadMethod(e4.options.method) ? 0 : 1;
      const r6 = e4.response && e4.response.status || 500;
      if (t5 > 0 && (Array.isArray(e4.options.retryStatusCodes) ? e4.options.retryStatusCodes.includes(r6) : lr2.has(r6))) {
        const r7 = "function" == typeof e4.options.retryDelay ? e4.options.retryDelay(e4) : e4.options.retryDelay || 0;
        return r7 > 0 && await new Promise((e5) => setTimeout(e5, r7)), $fetchRaw(e4.request, { ...e4.options, retry: t5 - 1 });
      }
    }
    const r5 = function(e5) {
      const t5 = e5.error?.message || e5.error?.toString() || "", r6 = e5.request?.method || e5.options?.method || "GET", s5 = e5.request?.url || String(e5.request) || "/", a5 = `[${r6}] ${JSON.stringify(s5)}`, c4 = e5.response ? `${e5.response.status} ${e5.response.statusText}` : "<no response>", u4 = new FetchError(`${a5}: ${c4}${t5 ? ` ${t5}` : ""}`, e5.error ? { cause: e5.error } : void 0);
      for (const t6 of ["request", "options", "response"]) Object.defineProperty(u4, t6, { get: /* @__PURE__ */ __name(() => e5[t6], "get") });
      for (const [t6, r7] of [["data", "_data"], ["status", "status"], ["statusCode", "status"], ["statusText", "statusText"], ["statusMessage", "statusText"]]) Object.defineProperty(u4, t6, { get: /* @__PURE__ */ __name(() => e5.response && e5.response[r7], "get") });
      return u4;
    }(e4);
    throw Error.captureStackTrace && Error.captureStackTrace(r5, $fetchRaw), r5;
  }
  __name(onError2, "onError");
  const $fetchRaw = /* @__PURE__ */ __name(async function(a5, c4 = {}) {
    const u4 = { request: a5, options: resolveFetchOptions(a5, c4, e3.defaults, r4), response: void 0, error: void 0 };
    let d4;
    if (u4.options.method && (u4.options.method = u4.options.method.toUpperCase()), u4.options.onRequest && await callHooks(u4, u4.options.onRequest), "string" == typeof u4.request && (u4.options.baseURL && (u4.request = function(e4, t4) {
      if (isEmptyURL(t4) || hasProtocol(e4)) return e4;
      const r5 = withoutTrailingSlash(t4);
      return e4.startsWith(r5) ? e4 : joinURL(r5, e4);
    }(u4.request, u4.options.baseURL)), u4.options.query && (u4.request = withQuery(u4.request, u4.options.query), delete u4.options.query), "query" in u4.options && delete u4.options.query, "params" in u4.options && delete u4.options.params), u4.options.body && isPayloadMethod(u4.options.method) && (!function(e4) {
      if (void 0 === e4) return false;
      const t4 = typeof e4;
      return "string" === t4 || "number" === t4 || "boolean" === t4 || null === t4 || "object" === t4 && (!!Array.isArray(e4) || !e4.buffer && (e4.constructor && "Object" === e4.constructor.name || "function" == typeof e4.toJSON));
    }(u4.options.body) ? ("pipeTo" in u4.options.body && "function" == typeof u4.options.body.pipeTo || "function" == typeof u4.options.body.pipe) && ("duplex" in u4.options || (u4.options.duplex = "half")) : (u4.options.body = "string" == typeof u4.options.body ? u4.options.body : JSON.stringify(u4.options.body), u4.options.headers = new r4(u4.options.headers || {}), u4.options.headers.has("content-type") || u4.options.headers.set("content-type", "application/json"), u4.options.headers.has("accept") || u4.options.headers.set("accept", "application/json"))), !u4.options.signal && u4.options.timeout) {
      const e4 = new s4();
      d4 = setTimeout(() => {
        const t4 = new Error("[TimeoutError]: The operation was aborted due to timeout");
        t4.name = "TimeoutError", t4.code = 23, e4.abort(t4);
      }, u4.options.timeout), u4.options.signal = e4.signal;
    }
    try {
      u4.response = await t3(u4.request, u4.options);
    } catch (e4) {
      return u4.error = e4, u4.options.onRequestError && await callHooks(u4, u4.options.onRequestError), await onError2(u4);
    } finally {
      d4 && clearTimeout(d4);
    }
    if ((u4.response.body || u4.response._bodyInit) && !dr2.has(u4.response.status) && "HEAD" !== u4.options.method) {
      const e4 = (u4.options.parseResponse ? "json" : u4.options.responseType) || function(e5 = "") {
        if (!e5) return "json";
        const t4 = e5.split(";").shift() || "";
        return ur2.test(t4) ? "json" : cr2.has(t4) || t4.startsWith("text/") ? "text" : "blob";
      }(u4.response.headers.get("content-type") || "");
      switch (e4) {
        case "json": {
          const e5 = await u4.response.text(), t4 = u4.options.parseResponse || destr;
          u4.response._data = t4(e5);
          break;
        }
        case "stream":
          u4.response._data = u4.response.body || u4.response._bodyInit;
          break;
        default:
          u4.response._data = await u4.response[e4]();
      }
    }
    return u4.options.onResponse && await callHooks(u4, u4.options.onResponse), !u4.options.ignoreResponseError && u4.response.status >= 400 && u4.response.status < 600 ? (u4.options.onResponseError && await callHooks(u4, u4.options.onResponseError), await onError2(u4)) : u4.response;
  }, "$fetchRaw"), $fetch = /* @__PURE__ */ __name(async function(e4, t4) {
    return (await $fetchRaw(e4, t4))._data;
  }, "$fetch");
  return $fetch.raw = $fetchRaw, $fetch.native = (...e4) => t3(...e4), $fetch.create = (t4 = {}, r5 = {}) => createFetch({ ...e3, ...r5, defaults: { ...e3.defaults, ...r5.defaults, ...t4 } }), $fetch;
}
function asyncCall(e3, ...t3) {
  try {
    return (r4 = e3(...t3)) && "function" == typeof r4.then ? r4 : Promise.resolve(r4);
  } catch (e4) {
    return Promise.reject(e4);
  }
  var r4;
}
function stringify(e3) {
  if (/* @__PURE__ */ function(e4) {
    const t3 = typeof e4;
    return null === e4 || "object" !== t3 && "function" !== t3;
  }(e3)) return String(e3);
  if (function(e4) {
    const t3 = Object.getPrototypeOf(e4);
    return !t3 || t3.isPrototypeOf(Object);
  }(e3) || Array.isArray(e3)) return JSON.stringify(e3);
  if ("function" == typeof e3.toJSON) return stringify(e3.toJSON());
  throw new Error("[unstorage] Cannot stringify value!");
}
function serializeRaw(e3) {
  return "string" == typeof e3 ? e3 : yr2 + function(e4) {
    if (globalThis.Buffer) return s3.from(e4).toString("base64");
    return globalThis.btoa(String.fromCodePoint(...e4));
  }(e3);
}
function deserializeRaw(e3) {
  return "string" != typeof e3 ? e3 : e3.startsWith(yr2) ? function(e4) {
    if (globalThis.Buffer) return s3.from(e4, "base64");
    return Uint8Array.from(globalThis.atob(e4), (e5) => e5.codePointAt(0));
  }(e3.slice(7)) : e3;
}
function normalizeKey$1(e3) {
  return e3 && e3.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...e3) {
  return normalizeKey$1(e3.join(":"));
}
function normalizeBaseKey(e3) {
  return (e3 = normalizeKey$1(e3)) ? e3 + ":" : "";
}
function watch(e3, t3, r4) {
  return e3.watch ? e3.watch((e4, s4) => t3(e4, r4 + s4)) : () => {
  };
}
async function dispose(e3) {
  "function" == typeof e3.dispose && await asyncCall(e3.dispose);
}
function useStorage(e3 = "") {
  return e3 ? function(e4, t3) {
    if (!(t3 = normalizeBaseKey(t3))) return e4;
    const r4 = { ...e4 };
    for (const s4 of gr2) r4[s4] = (r5 = "", ...a5) => e4[s4](t3 + r5, ...a5);
    return r4.getKeys = (r5 = "", ...s4) => e4.getKeys(t3 + r5, ...s4).then((e5) => e5.map((e6) => e6.slice(t3.length))), r4.getItems = async (r5, s4) => {
      const a5 = r5.map((e5) => "string" == typeof e5 ? t3 + e5 : { ...e5, key: t3 + e5.key });
      return (await e4.getItems(a5, s4)).map((e5) => ({ key: e5.key.slice(t3.length), value: e5.value }));
    }, r4.setItems = async (r5, s4) => {
      const a5 = r5.map((e5) => ({ key: t3 + e5.key, value: e5.value, options: e5.options }));
      return e4.setItems(a5, s4);
    }, r4;
  }(_r2, e3) : _r2;
}
function hash(e3) {
  return function(e4) {
    return new k3().finalize(e4).toBase64();
  }("string" == typeof e3 ? e3 : function(e4) {
    const t3 = new kr2();
    return t3.dispatch(e4), t3.buff;
  }(e3)).replace(/[-_]/g, "").slice(0, 10);
}
function defineCachedFunction(e3, t3 = {}) {
  t3 = { name: "_", base: "/cache", swr: true, maxAge: 1, ...t3 };
  const r4 = {}, s4 = t3.group || "nitro/functions", a5 = t3.name || e3.name || "_", c4 = t3.integrity || hash([e3, t3]), u4 = t3.validate || ((e4) => void 0 !== e4.value);
  return async (...d4) => {
    if (await t3.shouldBypassCache?.(...d4)) return e3(...d4);
    const h4 = await (t3.getKey || getKey)(...d4), f4 = await t3.shouldInvalidateCache?.(...d4), m5 = await async function(e4, d5, h5, f5) {
      const m6 = [t3.base, s4, a5, e4 + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
      let g4 = await useStorage().getItem(m6).catch((e5) => {
        console.error("[cache] Cache read error.", e5), useNitroApp().captureError(e5, { event: f5, tags: ["cache"] });
      }) || {};
      if ("object" != typeof g4) {
        g4 = {};
        const e5 = new Error("Malformed data read from cache.");
        console.error("[cache]", e5), useNitroApp().captureError(e5, { event: f5, tags: ["cache"] });
      }
      const _3 = 1e3 * (t3.maxAge ?? 0);
      _3 && (g4.expires = Date.now() + _3);
      const x3 = h5 || g4.integrity !== c4 || _3 && Date.now() - (g4.mtime || 0) > _3 || false === u4(g4), R4 = x3 ? (async () => {
        const s5 = r4[e4];
        s5 || (void 0 !== g4.value && (t3.staleMaxAge || 0) >= 0 && false === t3.swr && (g4.value = void 0, g4.integrity = void 0, g4.mtime = void 0, g4.expires = void 0), r4[e4] = Promise.resolve(d5()));
        try {
          g4.value = await r4[e4];
        } catch (t4) {
          throw s5 || delete r4[e4], t4;
        }
        if (!s5 && (g4.mtime = Date.now(), g4.integrity = c4, delete r4[e4], false !== u4(g4))) {
          let e5;
          t3.maxAge && !t3.swr && (e5 = { ttl: t3.maxAge });
          const r5 = useStorage().setItem(m6, g4, e5).catch((e6) => {
            console.error("[cache] Cache write error.", e6), useNitroApp().captureError(e6, { event: f5, tags: ["cache"] });
          });
          f5?.waitUntil && f5.waitUntil(r5);
        }
      })() : Promise.resolve();
      return void 0 === g4.value ? await R4 : x3 && f5 && f5.waitUntil && f5.waitUntil(R4), t3.swr && false !== u4(g4) ? (R4.catch((e5) => {
        console.error("[cache] SWR handler error.", e5), useNitroApp().captureError(e5, { event: f5, tags: ["cache"] });
      }), g4) : R4.then(() => g4);
    }(h4, () => e3(...d4), f4, d4[0] && isEvent(d4[0]) ? d4[0] : void 0);
    let g3 = m5.value;
    return t3.transform && (g3 = await t3.transform(m5, ...d4) || g3), g3;
  };
}
function getKey(...e3) {
  return e3.length > 0 ? hash(e3) : "";
}
function escapeKey(e3) {
  return String(e3).replace(/\W/g, "");
}
function cloneWithProxy(e3, t3) {
  return new Proxy(e3, { get: /* @__PURE__ */ __name((e4, r4, s4) => r4 in t3 ? t3[r4] : Reflect.get(e4, r4, s4), "get"), set: /* @__PURE__ */ __name((e4, r4, s4, a5) => r4 in t3 ? (t3[r4] = s4, true) : Reflect.set(e4, r4, s4, a5), "set") });
}
function klona(e3) {
  if ("object" != typeof e3) return e3;
  var t3, r4, s4 = Object.prototype.toString.call(e3);
  if ("[object Object]" === s4) {
    if (e3.constructor !== Object && "function" == typeof e3.constructor) for (t3 in r4 = new e3.constructor(), e3) e3.hasOwnProperty(t3) && r4[t3] !== e3[t3] && (r4[t3] = klona(e3[t3]));
    else for (t3 in r4 = {}, e3) "__proto__" === t3 ? Object.defineProperty(r4, t3, { value: klona(e3[t3]), configurable: true, enumerable: true, writable: true }) : r4[t3] = klona(e3[t3]);
    return r4;
  }
  if ("[object Array]" === s4) {
    for (t3 = e3.length, r4 = Array(t3); t3--; ) r4[t3] = klona(e3[t3]);
    return r4;
  }
  return "[object Set]" === s4 ? (r4 = /* @__PURE__ */ new Set(), e3.forEach(function(e4) {
    r4.add(klona(e4));
  }), r4) : "[object Map]" === s4 ? (r4 = /* @__PURE__ */ new Map(), e3.forEach(function(e4, t4) {
    r4.set(klona(t4), klona(e4));
  }), r4) : "[object Date]" === s4 ? /* @__PURE__ */ new Date(+e3) : "[object RegExp]" === s4 ? ((r4 = new RegExp(e3.source, e3.flags)).lastIndex = e3.lastIndex, r4) : "[object DataView]" === s4 ? new e3.constructor(klona(e3.buffer)) : "[object ArrayBuffer]" === s4 ? e3.slice(0) : "Array]" === s4.slice(-6) ? new e3.constructor(e3) : e3;
}
function isUppercase(e3 = "") {
  if (!Cr2.test(e3)) return e3 !== e3.toLowerCase();
}
function kebabCase(e3, t3) {
  return e3 ? (Array.isArray(e3) ? e3 : function(e4) {
    const t4 = Sr2, r4 = [];
    if (!e4 || "string" != typeof e4) return r4;
    let s4, a5, c4 = "";
    for (const u4 of e4) {
      const e5 = t4.includes(u4);
      if (true === e5) {
        r4.push(c4), c4 = "", s4 = void 0;
        continue;
      }
      const d4 = isUppercase(u4);
      if (false === a5) {
        if (false === s4 && true === d4) {
          r4.push(c4), c4 = u4, s4 = d4;
          continue;
        }
        if (true === s4 && false === d4 && c4.length > 1) {
          const e6 = c4.at(-1);
          r4.push(c4.slice(0, Math.max(0, c4.length - 1))), c4 = e6 + u4, s4 = d4;
          continue;
        }
      }
      c4 += u4, s4 = d4, a5 = e5;
    }
    return r4.push(c4), r4;
  }(e3)).map((e4) => e4.toLowerCase()).join(t3) : "";
}
function getEnv(e3, t3) {
  const r4 = (s4 = e3, kebabCase(s4 || "", "_")).toUpperCase();
  var s4;
  return destr(g.env[t3.prefix + r4] ?? g.env[t3.altPrefix + r4]);
}
function _isObject(e3) {
  return "object" == typeof e3 && !Array.isArray(e3);
}
function _expandFromEnv(e3) {
  return e3.replace(Ar2, (e4, t3) => g.env[t3] || e4);
}
function useRuntimeConfig(e3) {
  return jr2;
}
function _deepFreeze(e3) {
  const t3 = Object.getOwnPropertyNames(e3);
  for (const r4 of t3) {
    const t4 = e3[r4];
    t4 && "object" == typeof t4 && _deepFreeze(t4);
  }
  return Object.freeze(e3);
}
function createRouteRulesHandler(e3) {
  return rr2((t3) => {
    const r4 = function(e4) {
      e4.context._nitro = e4.context._nitro || {}, e4.context._nitro.routeRules || (e4.context._nitro.routeRules = getRouteRulesForPath(withoutBase(e4.path.split("?")[0], useRuntimeConfig().app.baseURL)));
      return e4.context._nitro.routeRules;
    }(t3);
    if (r4.headers && Xt2(t3, r4.headers), r4.redirect) {
      let e4 = r4.redirect.to;
      if (e4.endsWith("/**")) {
        let s4 = t3.path;
        const a5 = r4.redirect._redirectStripBase;
        a5 && (s4 = withoutBase(s4, a5)), e4 = joinURL(e4.slice(0, -3), s4);
      } else if (t3.path.includes("?")) {
        e4 = withQuery(e4, getQuery(t3.path));
      }
      return function(e5, t4, r5 = 302) {
        return e5.node.res.statusCode = sanitizeStatusCode2(r5, e5.node.res.statusCode), e5.node.res.setHeader("location", t4), send2(e5, `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${t4.replace(/"/g, "%22")}"></head></html>`, Zt2.html);
      }(t3, e4, r4.redirect.statusCode);
    }
    if (r4.proxy) {
      let s4 = r4.proxy.to;
      if (s4.endsWith("/**")) {
        let e4 = t3.path;
        const a5 = r4.proxy._proxyStripBase;
        a5 && (e4 = withoutBase(e4, a5)), s4 = joinURL(s4.slice(0, -3), e4);
      } else if (t3.path.includes("?")) {
        s4 = withQuery(s4, getQuery(t3.path));
      }
      return proxyRequest(t3, s4, { fetch: e3.localFetch, ...r4.proxy });
    }
  });
}
function getRouteRulesForPath(e3) {
  return Lt2({}, ...qr2.matchAll(e3).reverse());
}
function joinHeaders(e3) {
  return Array.isArray(e3) ? e3.join(", ") : String(e3);
}
function normalizeCookieHeader(e3 = "") {
  return splitCookiesString2(joinHeaders(e3));
}
function normalizeCookieHeaders(e3) {
  const t3 = new Headers();
  for (const [r4, s4] of e3) if ("set-cookie" === r4) for (const e4 of normalizeCookieHeader(s4)) t3.append("set-cookie", e4);
  else t3.set(r4, joinHeaders(s4));
  return t3;
}
function defaultHandler(e3, t3, r4) {
  const s4 = e3.unhandled || e3.fatal, a5 = e3.statusCode || 500, c4 = e3.statusMessage || "Server Error", u4 = function(e4, t4 = {}) {
    const r5 = function(e5, t5 = {}) {
      if (t5.xForwardedHost) {
        const t6 = e5.node.req.headers["x-forwarded-host"];
        if (t6) return t6;
      }
      return e5.node.req.headers.host || "localhost";
    }(e4, t4), s5 = function(e5, t5 = {}) {
      return false !== t5.xForwardedProto && "https" === e5.node.req.headers["x-forwarded-proto"] || e5.node.req.connection?.encrypted ? "https" : "http";
    }(e4, t4), a6 = (e4.node.req.originalUrl || e4.path).replace(/^[/\\]+/g, "/");
    return new URL(a6, `${s5}://${r5}`);
  }(t3, { xForwardedHost: true, xForwardedProto: true });
  if (404 === a5) {
    const e4 = "/";
    if (/^\/[^/]/.test(e4) && !u4.pathname.startsWith(e4)) {
      return { status: 302, statusText: "Found", headers: { location: `${e4}${u4.pathname.slice(1)}${u4.search}` }, body: "Redirecting..." };
    }
  }
  if (s4 && !r4?.silent) {
    const r5 = [e3.unhandled && "[unhandled]", e3.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${r5} [${t3.method}] ${u4}
`, e3);
  }
  const d4 = { "content-type": "application/json", "x-content-type-options": "nosniff", "x-frame-options": "DENY", "referrer-policy": "no-referrer", "content-security-policy": "script-src 'none'; frame-ancestors 'none';" };
  setResponseStatus(t3, a5, c4), 404 !== a5 && function(e4, t4) {
    return e4.node.res.getHeader(t4);
  }(t3, "cache-control") || (d4["cache-control"] = "no-cache");
  return { status: a5, statusText: c4, headers: d4, body: { error: true, url: u4.href, statusCode: a5, statusMessage: c4, message: s4 ? "Server Error" : e3.message, data: s4 ? void 0 : e3.data } };
}
function useNitroApp() {
  return $r2;
}
var WriteStream2, ReadStream2, u3, Process2, d3, h3, _getEnv, f3, m4, g, _2, x2, R3, E3, C3, S3, T3, H2, j2, I3, P3, M2, O3, N3, q2, B2, U3, z2, L3, $2, K3, W3, D3, F3, Q2, J2, V3, Z2, G2, Y3, X3, ee2, te2, re2, oe2, ne2, se2, ae2, ie2, ce2, ue2, le2, de2, he2, fe2, pe2, me2, ye2, ge2, we2, ve2, _e2, be2, xe2, Re2, ke2, Ee2, Ce2, Se2, Ae2, Te2, He2, je2, Ie2, Pe2, Me2, Oe2, Ne2, qe2, Be2, Ue2, ze2, Le2, $e2, Ke2, We2, De2, Fe2, Qe2, Je2, Ve2, Ze2, Ge2, Ye2, Xe2, et2, tt2, rt2, ot2, nt2, st2, at2, it2, ct2, ut2, lt2, dt2, ht2, ft2, pt2, mt2, yt2, gt2, wt2, vt2, _t2, bt2, xt2, Rt2, kt2, Et2, Ct2, St2, At2, Tt2, Ht2, jt2, It2, Pt2, Mt2, Ot2, Nt2, qt2, Bt2, Ut2, zt2, Lt2, $t2, i4, Kt2, Wt2, Dt2, A3, y2, w3, Ft2, Qt2, H3Error2, Jt2, Vt2, Zt2, Gt2, Yt2, Xt2, er2, tr2, H3Event2, rr2, lazyEventHandler, or2, nr2, sr2, Hookable, ar, FetchError, ir2, cr2, ur2, lr2, dr2, hr2, fr2, pr2, mr2, yr2, gr2, memory, wr2, normalizeKey, vr2, _r2, br2, xr2, Rr2, k3, l3, kr2, cachedEventHandler, Er2, Cr2, Sr2, Ar2, Tr2, Hr2, jr2, Ir2, Pr2, Mr2, Or2, Nr2, qr2, Br2, Ur2, zr2, Lr2, $r2, Kr2, Wr2, Dr2;
var init_nitro = __esm({
  ".output/server/chunks/nitro/nitro.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_process2();
    "global" in globalThis || (globalThis.global = globalThis);
    WriteStream2 = class {
      static {
        __name(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(e3) {
        this.fd = e3;
      }
      clearLine(e3, t3) {
        return t3 && t3(), false;
      }
      clearScreenDown(e3) {
        return e3 && e3(), false;
      }
      cursorTo(e3, t3, r4) {
        return r4 && "function" == typeof r4 && r4(), false;
      }
      moveCursor(e3, t3, r4) {
        return r4 && r4(), false;
      }
      getColorDepth(e3) {
        return 1;
      }
      hasColors(e3, t3) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(e3, t3, r4) {
        e3 instanceof Uint8Array && (e3 = new TextDecoder().decode(e3));
        try {
          console.log(e3);
        } catch {
        }
        return r4 && "function" == typeof r4 && r4(), false;
      }
    };
    ReadStream2 = class {
      static {
        __name(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(e3) {
        this.fd = e3;
      }
      setRawMode(e3) {
        return this.isRaw = e3, this;
      }
    };
    __name(createNotImplementedError2, "createNotImplementedError");
    __name(notImplemented2, "notImplemented");
    u3 = "22.14.0";
    Process2 = class _Process extends r3 {
      static {
        __name(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(e3) {
        super(), this.env = e3.env, this.hrtime = e3.hrtime, this.nextTick = e3.nextTick;
        for (const e4 of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(r3.prototype)]) {
          const t3 = this[e4];
          "function" == typeof t3 && (this[e4] = t3.bind(this));
        }
      }
      emitWarning(e3, t3, r4) {
        console.warn(`${r4 ? `[${r4}] ` : ""}${t3 ? `${t3}: ` : ""}${e3}`);
      }
      emit(...e3) {
        return super.emit(...e3);
      }
      listeners(e3) {
        return super.listeners(e3);
      }
      #e;
      #t;
      #r;
      get stdin() {
        return this.#e ??= new ReadStream2(0);
      }
      get stdout() {
        return this.#t ??= new WriteStream2(1);
      }
      get stderr() {
        return this.#r ??= new WriteStream2(2);
      }
      #o = "/";
      chdir(e3) {
        this.#o = e3;
      }
      cwd() {
        return this.#o;
      }
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${u3}`;
      }
      get versions() {
        return { node: u3 };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      ref() {
      }
      unref() {
      }
      umask() {
        throw createNotImplementedError2("process.umask");
      }
      getBuiltinModule() {
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError2("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError2("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError2("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError2("process.kill");
      }
      abort() {
        throw createNotImplementedError2("process.abort");
      }
      dlopen() {
        throw createNotImplementedError2("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError2("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError2("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError2("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError2("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError2("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError2("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError2("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError2("process.openStdin");
      }
      assert() {
        throw createNotImplementedError2("process.assert");
      }
      binding() {
        throw createNotImplementedError2("process.binding");
      }
      permission = { has: notImplemented2("process.permission.has") };
      report = { directory: "", filename: "", signal: "SIGUSR2", compact: false, reportOnFatalError: false, reportOnSignal: false, reportOnUncaughtException: false, getReport: notImplemented2("process.report.getReport"), writeReport: notImplemented2("process.report.writeReport") };
      finalization = { register: notImplemented2("process.finalization.register"), unregister: notImplemented2("process.finalization.unregister"), registerBeforeExit: notImplemented2("process.finalization.registerBeforeExit") };
      memoryUsage = Object.assign(() => ({ arrayBuffers: 0, rss: 0, external: 0, heapTotal: 0, heapUsed: 0 }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
      mainModule = void 0;
      domain = void 0;
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
    d3 = /* @__PURE__ */ Object.create(null);
    h3 = globalThis.process;
    _getEnv = /* @__PURE__ */ __name((e3) => globalThis.__env__ || h3?.env || (e3 ? d3 : globalThis), "_getEnv");
    f3 = new Proxy(d3, { get: /* @__PURE__ */ __name((e3, t3) => _getEnv()[t3] ?? d3[t3], "get"), has: /* @__PURE__ */ __name((e3, t3) => t3 in _getEnv() || t3 in d3, "has"), set: /* @__PURE__ */ __name((e3, t3, r4) => (_getEnv(true)[t3] = r4, true), "set"), deleteProperty: /* @__PURE__ */ __name((e3, t3) => (delete _getEnv(true)[t3], true), "deleteProperty"), ownKeys() {
      const e3 = _getEnv();
      return Object.keys(e3);
    }, getOwnPropertyDescriptor(e3, t3) {
      const r4 = _getEnv();
      if (t3 in r4) return { value: r4[t3], writable: true, enumerable: true, configurable: true };
    } });
    m4 = Object.assign(function(e3) {
      const t3 = Date.now(), r4 = Math.trunc(t3 / 1e3), s4 = t3 % 1e3 * 1e6;
      if (e3) {
        let t4 = r4 - e3[0], a5 = s4 - e3[0];
        return a5 < 0 && (t4 -= 1, a5 = 1e9 + a5), [t4, a5];
      }
      return [r4, s4];
    }, { bigint: /* @__PURE__ */ __name(function() {
      return BigInt(1e6 * Date.now());
    }, "bigint") });
    globalThis.__env__ = t2;
    g = new Process2({ env: f3, hrtime: m4, nextTick: process_default.nextTick });
    for (const t3 of ["exit", "getBuiltinModule", "platform"]) t3 in process_default && (g[t3] = process_default[t3]);
    process_default.features && Object.defineProperty(g, "features", { get: /* @__PURE__ */ __name(() => process_default.features, "get") });
    ({ abort: _2, addListener: x2, allowedNodeEnvironmentFlags: R3, hasUncaughtExceptionCaptureCallback: E3, setUncaughtExceptionCaptureCallback: C3, loadEnvFile: S3, sourceMapsEnabled: T3, arch: H2, argv: j2, argv0: I3, chdir: P3, config: M2, connected: O3, constrainedMemory: N3, availableMemory: q2, cpuUsage: B2, cwd: U3, debugPort: z2, dlopen: L3, disconnect: $2, emit: K3, emitWarning: W3, env: D3, eventNames: F3, execArgv: Q2, execPath: J2, exit: V3, finalization: Z2, features: G2, getBuiltinModule: Y3, getActiveResourcesInfo: X3, getMaxListeners: ee2, hrtime: te2, kill: re2, listeners: oe2, listenerCount: ne2, memoryUsage: se2, nextTick: ae2, on: ie2, off: ce2, once: ue2, pid: le2, platform: de2, ppid: he2, prependListener: fe2, prependOnceListener: pe2, rawListeners: me2, release: ye2, removeAllListeners: ge2, removeListener: we2, report: ve2, resourceUsage: _e2, setMaxListeners: be2, setSourceMapsEnabled: xe2, stderr: Re2, stdin: ke2, stdout: Ee2, title: Ce2, umask: Se2, uptime: Ae2, version: Te2, versions: He2, domain: je2, initgroups: Ie2, moduleLoadList: Pe2, reallyExit: Me2, openStdin: Oe2, assert: Ne2, binding: qe2, send: Be2, exitCode: Ue2, channel: ze2, getegid: Le2, geteuid: $e2, getgid: Ke2, getgroups: We2, getuid: De2, setegid: Fe2, seteuid: Qe2, setgid: Je2, setgroups: Ve2, setuid: Ze2, permission: Ge2, mainModule: Ye2, _events: Xe2, _eventsCount: et2, _exiting: tt2, _maxListeners: rt2, _debugEnd: ot2, _debugProcess: nt2, _fatalException: st2, _getActiveHandles: at2, _getActiveRequests: it2, _kill: ct2, _preload_modules: ut2, _rawDebug: lt2, _startProfilerIdleNotifier: dt2, _stopProfilerIdleNotifier: ht2, _tickCallback: ft2, _disconnect: pt2, _handleQueue: mt2, _pendingMessage: yt2, _channel: gt2, _send: wt2, _linkedBinding: vt2 } = g);
    _t2 = globalThis.process;
    globalThis.process = _t2 ? new Proxy(_t2, { get: /* @__PURE__ */ __name((e3, t3, r4) => Reflect.has(e3, t3) ? Reflect.get(e3, t3, r4) : Reflect.get(g, t3, r4), "get") }) : g, globalThis.Buffer || (globalThis.Buffer = s3), globalThis.setImmediate || (globalThis.setImmediate = a4), globalThis.clearImmediate || (globalThis.clearImmediate = c3);
    bt2 = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
    xt2 = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
    Rt2 = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
    __name(jsonParseTransform, "jsonParseTransform");
    __name(destr, "destr");
    kt2 = /#/g;
    Et2 = /&/g;
    Ct2 = /\//g;
    St2 = /=/g;
    At2 = /\+/g;
    Tt2 = /%5e/gi;
    Ht2 = /%60/gi;
    jt2 = /%7c/gi;
    It2 = /%20/gi;
    __name(encodeQueryValue, "encodeQueryValue");
    __name(encodeQueryKey, "encodeQueryKey");
    __name(decode2, "decode");
    __name(decodeQueryKey, "decodeQueryKey");
    __name(decodeQueryValue, "decodeQueryValue");
    __name(parseQuery, "parseQuery");
    __name(stringifyQuery, "stringifyQuery");
    Pt2 = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
    Mt2 = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
    Ot2 = /^([/\\]\s*){2,}[^/\\]/;
    Nt2 = /^\.?\//;
    __name(hasProtocol, "hasProtocol");
    __name(withoutTrailingSlash, "withoutTrailingSlash");
    __name(withTrailingSlash, "withTrailingSlash");
    __name(withoutBase, "withoutBase");
    __name(withQuery, "withQuery");
    __name(getQuery, "getQuery");
    __name(isEmptyURL, "isEmptyURL");
    __name(joinURL, "joinURL");
    qt2 = Symbol.for("ufo:protocolRelative");
    __name(parseURL, "parseURL");
    __name(parsePath, "parsePath");
    Bt2 = 0;
    Ut2 = 1;
    zt2 = 2;
    __name(createRouter$1, "createRouter$1");
    __name(insert, "insert");
    __name(createRadixNode, "createRadixNode");
    __name(getNodeType, "getNodeType");
    __name(toRouteMatcher, "toRouteMatcher");
    __name(_matchRoutes, "_matchRoutes");
    __name(_sortRoutesMap, "_sortRoutesMap");
    __name(_routerNodeToTable, "_routerNodeToTable");
    __name(isPlainObject2, "isPlainObject");
    __name(_defu, "_defu");
    __name(createDefu, "createDefu");
    Lt2 = createDefu();
    $t2 = createDefu((e3, t3, r4) => {
      if (void 0 !== e3[t3] && "function" == typeof r4) return e3[t3] = r4(e3[t3]), true;
    });
    __name(o4, "o");
    i4 = class _i2 extends r3 {
      static {
        __name(this, "i");
      }
      __unenv__ = {};
      readableEncoding = null;
      readableEnded = true;
      readableFlowing = false;
      readableHighWaterMark = 0;
      readableLength = 0;
      readableObjectMode = false;
      readableAborted = false;
      readableDidRead = false;
      closed = false;
      errored = null;
      readable = false;
      destroyed = false;
      static from(e3, t3) {
        return new _i2(t3);
      }
      constructor(e3) {
        super();
      }
      _read(e3) {
      }
      read(e3) {
      }
      setEncoding(e3) {
        return this;
      }
      pause() {
        return this;
      }
      resume() {
        return this;
      }
      isPaused() {
        return true;
      }
      unpipe(e3) {
        return this;
      }
      unshift(e3, t3) {
      }
      wrap(e3) {
        return this;
      }
      push(e3, t3) {
        return false;
      }
      _destroy(e3, t3) {
        this.removeAllListeners();
      }
      destroy(e3) {
        return this.destroyed = true, this._destroy(e3), this;
      }
      pipe(e3, t3) {
        return {};
      }
      compose(e3, t3) {
        throw new Error("Method not implemented.");
      }
      [Symbol.asyncDispose]() {
        return this.destroy(), Promise.resolve();
      }
      async *[Symbol.asyncIterator]() {
        throw o4("Readable.asyncIterator");
      }
      iterator(e3) {
        throw o4("Readable.iterator");
      }
      map(e3, t3) {
        throw o4("Readable.map");
      }
      filter(e3, t3) {
        throw o4("Readable.filter");
      }
      forEach(e3, t3) {
        throw o4("Readable.forEach");
      }
      reduce(e3, t3, r4) {
        throw o4("Readable.reduce");
      }
      find(e3, t3) {
        throw o4("Readable.find");
      }
      findIndex(e3, t3) {
        throw o4("Readable.findIndex");
      }
      some(e3, t3) {
        throw o4("Readable.some");
      }
      toArray(e3) {
        throw o4("Readable.toArray");
      }
      every(e3, t3) {
        throw o4("Readable.every");
      }
      flatMap(e3, t3) {
        throw o4("Readable.flatMap");
      }
      drop(e3, t3) {
        throw o4("Readable.drop");
      }
      take(e3, t3) {
        throw o4("Readable.take");
      }
      asIndexedPairs(e3) {
        throw o4("Readable.asIndexedPairs");
      }
    };
    Kt2 = class extends r3 {
      static {
        __name(this, "Kt");
      }
      __unenv__ = {};
      writable = true;
      writableEnded = false;
      writableFinished = false;
      writableHighWaterMark = 0;
      writableLength = 0;
      writableObjectMode = false;
      writableCorked = 0;
      closed = false;
      errored = null;
      writableNeedDrain = false;
      writableAborted = false;
      destroyed = false;
      _data;
      _encoding = "utf8";
      constructor(e3) {
        super();
      }
      pipe(e3, t3) {
        return {};
      }
      _write(e3, t3, r4) {
        if (this.writableEnded) r4 && r4();
        else {
          if (void 0 === this._data) this._data = e3;
          else {
            const r5 = "string" == typeof this._data ? s3.from(this._data, this._encoding || t3 || "utf8") : this._data, a5 = "string" == typeof e3 ? s3.from(e3, t3 || this._encoding || "utf8") : e3;
            this._data = s3.concat([r5, a5]);
          }
          this._encoding = t3, r4 && r4();
        }
      }
      _writev(e3, t3) {
      }
      _destroy(e3, t3) {
      }
      _final(e3) {
      }
      write(e3, t3, r4) {
        const s4 = "string" == typeof t3 ? this._encoding : "utf8", a5 = "function" == typeof t3 ? t3 : "function" == typeof r4 ? r4 : void 0;
        return this._write(e3, s4, a5), true;
      }
      setDefaultEncoding(e3) {
        return this;
      }
      end(e3, t3, r4) {
        const s4 = "function" == typeof e3 ? e3 : "function" == typeof t3 ? t3 : "function" == typeof r4 ? r4 : void 0;
        if (this.writableEnded) return s4 && s4(), this;
        const a5 = e3 === s4 ? void 0 : e3;
        if (a5) {
          const e4 = t3 === s4 ? void 0 : t3;
          this.write(a5, e4, s4);
        }
        return this.writableEnded = true, this.writableFinished = true, this.emit("close"), this.emit("finish"), this;
      }
      cork() {
      }
      uncork() {
      }
      destroy(e3) {
        return this.destroyed = true, delete this._data, this.removeAllListeners(), this;
      }
      compose(e3, t3) {
        throw new Error("Method not implemented.");
      }
    };
    Wt2 = class {
      static {
        __name(this, "Wt");
      }
      allowHalfOpen = true;
      _destroy;
      constructor(e3 = new i4(), t3 = new Kt2()) {
        Object.assign(this, e3), Object.assign(this, t3), this._destroy = /* @__PURE__ */ function(...e4) {
          return function(...t4) {
            for (const r4 of e4) r4(...t4);
          };
        }(e3._destroy, t3._destroy);
      }
    };
    Dt2 = (Object.assign(Wt2.prototype, i4.prototype), Object.assign(Wt2.prototype, Kt2.prototype), Wt2);
    A3 = class extends Dt2 {
      static {
        __name(this, "A");
      }
      __unenv__ = {};
      bufferSize = 0;
      bytesRead = 0;
      bytesWritten = 0;
      connecting = false;
      destroyed = false;
      pending = false;
      localAddress = "";
      localPort = 0;
      remoteAddress = "";
      remoteFamily = "";
      remotePort = 0;
      autoSelectFamilyAttemptedAddresses = [];
      readyState = "readOnly";
      constructor(e3) {
        super();
      }
      write(e3, t3, r4) {
        return false;
      }
      connect(e3, t3, r4) {
        return this;
      }
      end(e3, t3, r4) {
        return this;
      }
      setEncoding(e3) {
        return this;
      }
      pause() {
        return this;
      }
      resume() {
        return this;
      }
      setTimeout(e3, t3) {
        return this;
      }
      setNoDelay(e3) {
        return this;
      }
      setKeepAlive(e3, t3) {
        return this;
      }
      address() {
        return {};
      }
      unref() {
        return this;
      }
      ref() {
        return this;
      }
      destroySoon() {
        this.destroy();
      }
      resetAndDestroy() {
        const e3 = new Error("ERR_SOCKET_CLOSED");
        return e3.code = "ERR_SOCKET_CLOSED", this.destroy(e3), this;
      }
    };
    y2 = class extends i4 {
      static {
        __name(this, "y");
      }
      aborted = false;
      httpVersion = "1.1";
      httpVersionMajor = 1;
      httpVersionMinor = 1;
      complete = true;
      connection;
      socket;
      headers = {};
      trailers = {};
      method = "GET";
      url = "/";
      statusCode = 200;
      statusMessage = "";
      closed = false;
      errored = null;
      readable = false;
      constructor(e3) {
        super(), this.socket = this.connection = e3 || new A3();
      }
      get rawHeaders() {
        const e3 = this.headers, t3 = [];
        for (const r4 in e3) if (Array.isArray(e3[r4])) for (const s4 of e3[r4]) t3.push(r4, s4);
        else t3.push(r4, e3[r4]);
        return t3;
      }
      get rawTrailers() {
        return [];
      }
      setTimeout(e3, t3) {
        return this;
      }
      get headersDistinct() {
        return p3(this.headers);
      }
      get trailersDistinct() {
        return p3(this.trailers);
      }
    };
    __name(p3, "p");
    w3 = class extends Kt2 {
      static {
        __name(this, "w");
      }
      statusCode = 200;
      statusMessage = "";
      upgrading = false;
      chunkedEncoding = false;
      shouldKeepAlive = false;
      useChunkedEncodingByDefault = false;
      sendDate = false;
      finished = false;
      headersSent = false;
      strictContentLength = false;
      connection = null;
      socket = null;
      req;
      _headers = {};
      constructor(e3) {
        super(), this.req = e3;
      }
      assignSocket(e3) {
        e3._httpMessage = this, this.socket = e3, this.connection = e3, this.emit("socket", e3), this._flush();
      }
      _flush() {
        this.flushHeaders();
      }
      detachSocket(e3) {
      }
      writeContinue(e3) {
      }
      writeHead(e3, t3, r4) {
        e3 && (this.statusCode = e3), "string" == typeof t3 && (this.statusMessage = t3, t3 = void 0);
        const s4 = r4 || t3;
        if (s4 && !Array.isArray(s4)) for (const e4 in s4) this.setHeader(e4, s4[e4]);
        return this.headersSent = true, this;
      }
      writeProcessing() {
      }
      setTimeout(e3, t3) {
        return this;
      }
      appendHeader(e3, t3) {
        e3 = e3.toLowerCase();
        const r4 = this._headers[e3], s4 = [...Array.isArray(r4) ? r4 : [r4], ...Array.isArray(t3) ? t3 : [t3]].filter(Boolean);
        return this._headers[e3] = s4.length > 1 ? s4 : s4[0], this;
      }
      setHeader(e3, t3) {
        return this._headers[e3.toLowerCase()] = t3, this;
      }
      setHeaders(e3) {
        for (const [t3, r4] of Object.entries(e3)) this.setHeader(t3, r4);
        return this;
      }
      getHeader(e3) {
        return this._headers[e3.toLowerCase()];
      }
      getHeaders() {
        return this._headers;
      }
      getHeaderNames() {
        return Object.keys(this._headers);
      }
      hasHeader(e3) {
        return e3.toLowerCase() in this._headers;
      }
      removeHeader(e3) {
        delete this._headers[e3.toLowerCase()];
      }
      addTrailers(e3) {
      }
      flushHeaders() {
      }
      writeEarlyHints(e3, t3) {
        "function" == typeof t3 && t3();
      }
    };
    Ft2 = (() => {
      const n3 = /* @__PURE__ */ __name(function() {
      }, "n");
      return n3.prototype = /* @__PURE__ */ Object.create(null), n3;
    })();
    __name(v2, "v");
    Qt2 = /* @__PURE__ */ new Set([101, 204, 205, 304]);
    __name(b2, "b");
    __name(hasProp2, "hasProp");
    H3Error2 = class extends Error {
      static {
        __name(this, "H3Error");
      }
      static __h3_error__ = true;
      statusCode = 500;
      fatal = false;
      unhandled = false;
      statusMessage;
      data;
      cause;
      constructor(e3, t3 = {}) {
        super(e3, t3), t3.cause && !this.cause && (this.cause = t3.cause);
      }
      toJSON() {
        const e3 = { message: this.message, statusCode: sanitizeStatusCode2(this.statusCode, 500) };
        return this.statusMessage && (e3.statusMessage = sanitizeStatusMessage2(this.statusMessage)), void 0 !== this.data && (e3.data = this.data), e3;
      }
    };
    __name(createError, "createError");
    __name(isError, "isError");
    Jt2 = Symbol.for("h3RawBody");
    Vt2 = ["PATCH", "POST", "PUT", "DELETE"];
    __name(readRawBody, "readRawBody");
    __name(handleCacheHeaders, "handleCacheHeaders");
    Zt2 = { html: "text/html", json: "application/json" };
    Gt2 = /[^\u0009\u0020-\u007E]/g;
    __name(sanitizeStatusMessage2, "sanitizeStatusMessage");
    __name(sanitizeStatusCode2, "sanitizeStatusCode");
    __name(splitCookiesString2, "splitCookiesString");
    Yt2 = void 0 === a4 ? (e3) => e3() : a4;
    __name(send2, "send");
    __name(setResponseStatus, "setResponseStatus");
    __name(setResponseHeaders, "setResponseHeaders");
    Xt2 = setResponseHeaders;
    __name(sendStream, "sendStream");
    __name(sendWebResponse2, "sendWebResponse");
    er2 = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
    tr2 = /* @__PURE__ */ new Set(["transfer-encoding", "accept-encoding", "connection", "keep-alive", "upgrade", "expect", "host", "accept"]);
    __name(proxyRequest, "proxyRequest");
    __name(getProxyRequestHeaders, "getProxyRequestHeaders");
    __name(fetchWithEvent, "fetchWithEvent");
    __name(_getFetch, "_getFetch");
    __name(rewriteCookieProperty, "rewriteCookieProperty");
    H3Event2 = class {
      static {
        __name(this, "H3Event");
      }
      __is_event__ = true;
      node;
      web;
      context = {};
      _method;
      _path;
      _headers;
      _requestBody;
      _handled = false;
      _onBeforeResponseCalled;
      _onAfterResponseCalled;
      constructor(e3, t3) {
        this.node = { req: e3, res: t3 };
      }
      get method() {
        return this._method || (this._method = (this.node.req.method || "GET").toUpperCase()), this._method;
      }
      get path() {
        return this._path || this.node.req.url || "/";
      }
      get headers() {
        return this._headers || (this._headers = function(e3) {
          const t3 = new Headers();
          for (const [r4, s4] of Object.entries(e3)) if (Array.isArray(s4)) for (const e4 of s4) t3.append(r4, e4);
          else s4 && t3.set(r4, s4);
          return t3;
        }(this.node.req.headers)), this._headers;
      }
      get handled() {
        return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
      }
      respondWith(e3) {
        return Promise.resolve(e3).then((e4) => sendWebResponse2(this, e4));
      }
      toString() {
        return `[${this.method}] ${this.path}`;
      }
      toJSON() {
        return this.toString();
      }
      get req() {
        return this.node.req;
      }
      get res() {
        return this.node.res;
      }
    };
    __name(isEvent, "isEvent");
    __name(createEvent, "createEvent");
    __name(defineEventHandler, "defineEventHandler");
    __name(_normalizeArray2, "_normalizeArray");
    rr2 = defineEventHandler;
    __name(isEventHandler, "isEventHandler");
    __name(toEventHandler, "toEventHandler");
    lazyEventHandler = /* @__PURE__ */ __name(function(e3) {
      let t3, r4;
      const resolveHandler = /* @__PURE__ */ __name(() => r4 ? Promise.resolve(r4) : (t3 || (t3 = Promise.resolve(e3()).then((e4) => {
        const t4 = e4.default || e4;
        if ("function" != typeof t4) throw new TypeError("Invalid lazy handler result. It should be a function:", t4);
        return r4 = { handler: toEventHandler(e4.default || e4) }, r4;
      })), t3), "resolveHandler"), s4 = rr2((e4) => r4 ? r4.handler(e4) : resolveHandler().then((t4) => t4.handler(e4)));
      return s4.__resolve__ = resolveHandler, s4;
    }, "lazyEventHandler");
    __name(createApp, "createApp");
    __name(use, "use");
    __name(normalizeLayer, "normalizeLayer");
    __name(handleHandlerResponse, "handleHandlerResponse");
    or2 = ["connect", "delete", "get", "head", "options", "post", "put", "trace", "patch"];
    __name(toNodeListener, "toNodeListener");
    __name(flatHooks, "flatHooks");
    nr2 = { run: /* @__PURE__ */ __name((e3) => e3(), "run") };
    sr2 = void 0 !== console.createTask ? console.createTask : () => nr2;
    __name(serialTaskCaller, "serialTaskCaller");
    __name(parallelTaskCaller, "parallelTaskCaller");
    __name(callEachWith, "callEachWith");
    Hookable = class {
      static {
        __name(this, "Hookable");
      }
      constructor() {
        this._hooks = {}, this._before = void 0, this._after = void 0, this._deprecatedMessages = void 0, this._deprecatedHooks = {}, this.hook = this.hook.bind(this), this.callHook = this.callHook.bind(this), this.callHookWith = this.callHookWith.bind(this);
      }
      hook(e3, t3, r4 = {}) {
        if (!e3 || "function" != typeof t3) return () => {
        };
        const s4 = e3;
        let a5;
        for (; this._deprecatedHooks[e3]; ) a5 = this._deprecatedHooks[e3], e3 = a5.to;
        if (a5 && !r4.allowDeprecated) {
          let e4 = a5.message;
          e4 || (e4 = `${s4} hook has been deprecated` + (a5.to ? `, please use ${a5.to}` : "")), this._deprecatedMessages || (this._deprecatedMessages = /* @__PURE__ */ new Set()), this._deprecatedMessages.has(e4) || (console.warn(e4), this._deprecatedMessages.add(e4));
        }
        if (!t3.name) try {
          Object.defineProperty(t3, "name", { get: /* @__PURE__ */ __name(() => "_" + e3.replace(/\W+/g, "_") + "_hook_cb", "get"), configurable: true });
        } catch {
        }
        return this._hooks[e3] = this._hooks[e3] || [], this._hooks[e3].push(t3), () => {
          t3 && (this.removeHook(e3, t3), t3 = void 0);
        };
      }
      hookOnce(e3, t3) {
        let r4, _function = /* @__PURE__ */ __name((...e4) => ("function" == typeof r4 && r4(), r4 = void 0, _function = void 0, t3(...e4)), "_function");
        return r4 = this.hook(e3, _function), r4;
      }
      removeHook(e3, t3) {
        if (this._hooks[e3]) {
          const r4 = this._hooks[e3].indexOf(t3);
          -1 !== r4 && this._hooks[e3].splice(r4, 1), 0 === this._hooks[e3].length && delete this._hooks[e3];
        }
      }
      deprecateHook(e3, t3) {
        this._deprecatedHooks[e3] = "string" == typeof t3 ? { to: t3 } : t3;
        const r4 = this._hooks[e3] || [];
        delete this._hooks[e3];
        for (const t4 of r4) this.hook(e3, t4);
      }
      deprecateHooks(e3) {
        Object.assign(this._deprecatedHooks, e3);
        for (const t3 in e3) this.deprecateHook(t3, e3[t3]);
      }
      addHooks(e3) {
        const t3 = flatHooks(e3), r4 = Object.keys(t3).map((e4) => this.hook(e4, t3[e4]));
        return () => {
          for (const e4 of r4.splice(0, r4.length)) e4();
        };
      }
      removeHooks(e3) {
        const t3 = flatHooks(e3);
        for (const e4 in t3) this.removeHook(e4, t3[e4]);
      }
      removeAllHooks() {
        for (const e3 in this._hooks) delete this._hooks[e3];
      }
      callHook(e3, ...t3) {
        return t3.unshift(e3), this.callHookWith(serialTaskCaller, e3, ...t3);
      }
      callHookParallel(e3, ...t3) {
        return t3.unshift(e3), this.callHookWith(parallelTaskCaller, e3, ...t3);
      }
      callHookWith(e3, t3, ...r4) {
        const s4 = this._before || this._after ? { name: t3, args: r4, context: {} } : void 0;
        this._before && callEachWith(this._before, s4);
        const a5 = e3(t3 in this._hooks ? [...this._hooks[t3]] : [], r4);
        return a5 instanceof Promise ? a5.finally(() => {
          this._after && s4 && callEachWith(this._after, s4);
        }) : (this._after && s4 && callEachWith(this._after, s4), a5);
      }
      beforeEach(e3) {
        return this._before = this._before || [], this._before.push(e3), () => {
          if (void 0 !== this._before) {
            const t3 = this._before.indexOf(e3);
            -1 !== t3 && this._before.splice(t3, 1);
          }
        };
      }
      afterEach(e3) {
        return this._after = this._after || [], this._after.push(e3), () => {
          if (void 0 !== this._after) {
            const t3 = this._after.indexOf(e3);
            -1 !== t3 && this._after.splice(t3, 1);
          }
        };
      }
    };
    ar = globalThis;
    FetchError = class extends Error {
      static {
        __name(this, "FetchError");
      }
      constructor(e3, t3) {
        super(e3, t3), this.name = "FetchError", t3?.cause && !this.cause && (this.cause = t3.cause);
      }
    };
    ir2 = new Set(Object.freeze(["PATCH", "POST", "PUT", "DELETE"]));
    __name(isPayloadMethod, "isPayloadMethod");
    cr2 = /* @__PURE__ */ new Set(["image/svg", "application/xml", "application/xhtml", "application/html"]);
    ur2 = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
    __name(resolveFetchOptions, "resolveFetchOptions");
    __name(callHooks, "callHooks");
    lr2 = /* @__PURE__ */ new Set([408, 409, 425, 429, 500, 502, 503, 504]);
    dr2 = /* @__PURE__ */ new Set([101, 204, 205, 304]);
    __name(createFetch, "createFetch");
    hr2 = function() {
      if ("undefined" != typeof globalThis) return globalThis;
      if ("undefined" != typeof self) return self;
      if (void 0 !== ar) return ar;
      throw new Error("unable to locate global object");
    }();
    fr2 = hr2.fetch ? (...e3) => hr2.fetch(...e3) : () => Promise.reject(new Error("[ofetch] global.fetch is not supported!"));
    pr2 = hr2.Headers;
    mr2 = hr2.AbortController;
    __name(asyncCall, "asyncCall");
    __name(stringify, "stringify");
    createFetch({ fetch: fr2, Headers: pr2, AbortController: mr2 });
    yr2 = "base64:";
    __name(serializeRaw, "serializeRaw");
    __name(deserializeRaw, "deserializeRaw");
    gr2 = ["has", "hasItem", "get", "getItem", "getItemRaw", "set", "setItem", "setItemRaw", "del", "remove", "removeItem", "getMeta", "setMeta", "removeMeta", "getKeys", "clear", "mount", "unmount"];
    __name(normalizeKey$1, "normalizeKey$1");
    __name(joinKeys, "joinKeys");
    __name(normalizeBaseKey, "normalizeBaseKey");
    memory = /* @__PURE__ */ __name(() => {
      const e3 = /* @__PURE__ */ new Map();
      return { name: "memory", getInstance: /* @__PURE__ */ __name(() => e3, "getInstance"), hasItem: /* @__PURE__ */ __name((t3) => e3.has(t3), "hasItem"), getItem: /* @__PURE__ */ __name((t3) => e3.get(t3) ?? null, "getItem"), getItemRaw: /* @__PURE__ */ __name((t3) => e3.get(t3) ?? null, "getItemRaw"), setItem(t3, r4) {
        e3.set(t3, r4);
      }, setItemRaw(t3, r4) {
        e3.set(t3, r4);
      }, removeItem(t3) {
        e3.delete(t3);
      }, getKeys: /* @__PURE__ */ __name(() => [...e3.keys()], "getKeys"), clear() {
        e3.clear();
      }, dispose() {
        e3.clear();
      } };
    }, "memory");
    __name(watch, "watch");
    __name(dispose, "dispose");
    wr2 = {};
    normalizeKey = /* @__PURE__ */ __name(function(e3) {
      return e3 && e3.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
    }, "normalizeKey");
    vr2 = { getKeys: /* @__PURE__ */ __name(() => Promise.resolve(Object.keys(wr2)), "getKeys"), hasItem: /* @__PURE__ */ __name((e3) => (e3 = normalizeKey(e3), Promise.resolve(e3 in wr2)), "hasItem"), getItem: /* @__PURE__ */ __name((e3) => (e3 = normalizeKey(e3), Promise.resolve(wr2[e3] ? wr2[e3].import() : null)), "getItem"), getMeta: /* @__PURE__ */ __name((e3) => (e3 = normalizeKey(e3), Promise.resolve(wr2[e3] ? wr2[e3].meta : {})), "getMeta") };
    _r2 = function(e3 = {}) {
      const t3 = { mounts: { "": e3.driver || memory() }, mountpoints: [""], watching: false, watchListeners: [], unwatch: {} }, getMount = /* @__PURE__ */ __name((e4) => {
        for (const r5 of t3.mountpoints) if (e4.startsWith(r5)) return { base: r5, relativeKey: e4.slice(r5.length), driver: t3.mounts[r5] };
        return { base: "", relativeKey: e4, driver: t3.mounts[""] };
      }, "getMount"), getMounts = /* @__PURE__ */ __name((e4, r5) => t3.mountpoints.filter((t4) => t4.startsWith(e4) || r5 && e4.startsWith(t4)).map((r6) => ({ relativeBase: e4.length > r6.length ? e4.slice(r6.length) : void 0, mountpoint: r6, driver: t3.mounts[r6] })), "getMounts"), onChange = /* @__PURE__ */ __name((e4, r5) => {
        if (t3.watching) {
          r5 = normalizeKey$1(r5);
          for (const s4 of t3.watchListeners) s4(e4, r5);
        }
      }, "onChange"), stopWatch = /* @__PURE__ */ __name(async () => {
        if (t3.watching) {
          for (const e4 in t3.unwatch) await t3.unwatch[e4]();
          t3.unwatch = {}, t3.watching = false;
        }
      }, "stopWatch"), runBatch = /* @__PURE__ */ __name((e4, t4, r5) => {
        const s4 = /* @__PURE__ */ new Map(), getBatch = /* @__PURE__ */ __name((e5) => {
          let t5 = s4.get(e5.base);
          return t5 || (t5 = { driver: e5.driver, base: e5.base, items: [] }, s4.set(e5.base, t5)), t5;
        }, "getBatch");
        for (const r6 of e4) {
          const e5 = "string" == typeof r6, s5 = normalizeKey$1(e5 ? r6 : r6.key), a5 = e5 ? void 0 : r6.value, c4 = e5 || !r6.options ? t4 : { ...t4, ...r6.options }, u4 = getMount(s5);
          getBatch(u4).items.push({ key: s5, value: a5, relativeKey: u4.relativeKey, options: c4 });
        }
        return Promise.all([...s4.values()].map((e5) => r5(e5))).then((e5) => e5.flat());
      }, "runBatch"), r4 = { hasItem(e4, t4 = {}) {
        e4 = normalizeKey$1(e4);
        const { relativeKey: r5, driver: s4 } = getMount(e4);
        return asyncCall(s4.hasItem, r5, t4);
      }, getItem(e4, t4 = {}) {
        e4 = normalizeKey$1(e4);
        const { relativeKey: r5, driver: s4 } = getMount(e4);
        return asyncCall(s4.getItem, r5, t4).then((e5) => destr(e5));
      }, getItems: /* @__PURE__ */ __name((e4, t4 = {}) => runBatch(e4, t4, (e5) => e5.driver.getItems ? asyncCall(e5.driver.getItems, e5.items.map((e6) => ({ key: e6.relativeKey, options: e6.options })), t4).then((t5) => t5.map((t6) => ({ key: joinKeys(e5.base, t6.key), value: destr(t6.value) }))) : Promise.all(e5.items.map((t5) => asyncCall(e5.driver.getItem, t5.relativeKey, t5.options).then((e6) => ({ key: t5.key, value: destr(e6) }))))), "getItems"), getItemRaw(e4, t4 = {}) {
        e4 = normalizeKey$1(e4);
        const { relativeKey: r5, driver: s4 } = getMount(e4);
        return s4.getItemRaw ? asyncCall(s4.getItemRaw, r5, t4) : asyncCall(s4.getItem, r5, t4).then((e5) => deserializeRaw(e5));
      }, async setItem(e4, t4, s4 = {}) {
        if (void 0 === t4) return r4.removeItem(e4);
        e4 = normalizeKey$1(e4);
        const { relativeKey: a5, driver: c4 } = getMount(e4);
        c4.setItem && (await asyncCall(c4.setItem, a5, stringify(t4), s4), c4.watch || onChange("update", e4));
      }, async setItems(e4, t4) {
        await runBatch(e4, t4, async (e5) => {
          if (e5.driver.setItems) return asyncCall(e5.driver.setItems, e5.items.map((e6) => ({ key: e6.relativeKey, value: stringify(e6.value), options: e6.options })), t4);
          e5.driver.setItem && await Promise.all(e5.items.map((t5) => asyncCall(e5.driver.setItem, t5.relativeKey, stringify(t5.value), t5.options)));
        });
      }, async setItemRaw(e4, t4, s4 = {}) {
        if (void 0 === t4) return r4.removeItem(e4, s4);
        e4 = normalizeKey$1(e4);
        const { relativeKey: a5, driver: c4 } = getMount(e4);
        if (c4.setItemRaw) await asyncCall(c4.setItemRaw, a5, t4, s4);
        else {
          if (!c4.setItem) return;
          await asyncCall(c4.setItem, a5, serializeRaw(t4), s4);
        }
        c4.watch || onChange("update", e4);
      }, async removeItem(e4, t4 = {}) {
        "boolean" == typeof t4 && (t4 = { removeMeta: t4 }), e4 = normalizeKey$1(e4);
        const { relativeKey: r5, driver: s4 } = getMount(e4);
        s4.removeItem && (await asyncCall(s4.removeItem, r5, t4), (t4.removeMeta || t4.removeMata) && await asyncCall(s4.removeItem, r5 + "$", t4), s4.watch || onChange("remove", e4));
      }, async getMeta(e4, t4 = {}) {
        "boolean" == typeof t4 && (t4 = { nativeOnly: t4 }), e4 = normalizeKey$1(e4);
        const { relativeKey: r5, driver: s4 } = getMount(e4), a5 = /* @__PURE__ */ Object.create(null);
        if (s4.getMeta && Object.assign(a5, await asyncCall(s4.getMeta, r5, t4)), !t4.nativeOnly) {
          const e5 = await asyncCall(s4.getItem, r5 + "$", t4).then((e6) => destr(e6));
          e5 && "object" == typeof e5 && ("string" == typeof e5.atime && (e5.atime = new Date(e5.atime)), "string" == typeof e5.mtime && (e5.mtime = new Date(e5.mtime)), Object.assign(a5, e5));
        }
        return a5;
      }, setMeta(e4, t4, r5 = {}) {
        return this.setItem(e4 + "$", t4, r5);
      }, removeMeta(e4, t4 = {}) {
        return this.removeItem(e4 + "$", t4);
      }, async getKeys(e4, t4 = {}) {
        e4 = normalizeBaseKey(e4);
        const r5 = getMounts(e4, true);
        let s4 = [];
        const a5 = [];
        let c4 = true;
        for (const e5 of r5) {
          e5.driver.flags?.maxDepth || (c4 = false);
          const r6 = await asyncCall(e5.driver.getKeys, e5.relativeBase, t4);
          for (const t5 of r6) {
            const r7 = e5.mountpoint + normalizeKey$1(t5);
            s4.some((e6) => r7.startsWith(e6)) || a5.push(r7);
          }
          s4 = [e5.mountpoint, ...s4.filter((t5) => !t5.startsWith(e5.mountpoint))];
        }
        const u4 = void 0 !== t4.maxDepth && !c4;
        return a5.filter((r6) => (!u4 || function(e5, t5) {
          if (void 0 === t5) return true;
          let r7 = 0, s5 = e5.indexOf(":");
          for (; s5 > -1; ) r7++, s5 = e5.indexOf(":", s5 + 1);
          return r7 <= t5;
        }(r6, t4.maxDepth)) && function(e5, t5) {
          return t5 ? e5.startsWith(t5) && "$" !== e5[e5.length - 1] : "$" !== e5[e5.length - 1];
        }(r6, e4));
      }, async clear(e4, t4 = {}) {
        e4 = normalizeBaseKey(e4), await Promise.all(getMounts(e4, false).map(async (e5) => {
          if (e5.driver.clear) return asyncCall(e5.driver.clear, e5.relativeBase, t4);
          if (e5.driver.removeItem) {
            const r5 = await e5.driver.getKeys(e5.relativeBase || "", t4);
            return Promise.all(r5.map((r6) => e5.driver.removeItem(r6, t4)));
          }
        }));
      }, async dispose() {
        await Promise.all(Object.values(t3.mounts).map((e4) => dispose(e4)));
      }, watch: /* @__PURE__ */ __name(async (e4) => (await (async () => {
        if (!t3.watching) {
          t3.watching = true;
          for (const e5 in t3.mounts) t3.unwatch[e5] = await watch(t3.mounts[e5], onChange, e5);
        }
      })(), t3.watchListeners.push(e4), async () => {
        t3.watchListeners = t3.watchListeners.filter((t4) => t4 !== e4), 0 === t3.watchListeners.length && await stopWatch();
      }), "watch"), async unwatch() {
        t3.watchListeners = [], await stopWatch();
      }, mount(e4, s4) {
        if ((e4 = normalizeBaseKey(e4)) && t3.mounts[e4]) throw new Error(`already mounted at ${e4}`);
        return e4 && (t3.mountpoints.push(e4), t3.mountpoints.sort((e5, t4) => t4.length - e5.length)), t3.mounts[e4] = s4, t3.watching && Promise.resolve(watch(s4, onChange, e4)).then((r5) => {
          t3.unwatch[e4] = r5;
        }).catch(console.error), r4;
      }, async unmount(e4, r5 = true) {
        (e4 = normalizeBaseKey(e4)) && t3.mounts[e4] && (t3.watching && e4 in t3.unwatch && (t3.unwatch[e4]?.(), delete t3.unwatch[e4]), r5 && await dispose(t3.mounts[e4]), t3.mountpoints = t3.mountpoints.filter((t4) => t4 !== e4), delete t3.mounts[e4]);
      }, getMount(e4 = "") {
        e4 = normalizeKey$1(e4) + ":";
        const t4 = getMount(e4);
        return { driver: t4.driver, base: t4.base };
      }, getMounts(e4 = "", t4 = {}) {
        e4 = normalizeKey$1(e4);
        return getMounts(e4, t4.parents).map((e5) => ({ driver: e5.driver, base: e5.mountpoint }));
      }, keys: /* @__PURE__ */ __name((e4, t4 = {}) => r4.getKeys(e4, t4), "keys"), get: /* @__PURE__ */ __name((e4, t4 = {}) => r4.getItem(e4, t4), "get"), set: /* @__PURE__ */ __name((e4, t4, s4 = {}) => r4.setItem(e4, t4, s4), "set"), has: /* @__PURE__ */ __name((e4, t4 = {}) => r4.hasItem(e4, t4), "has"), del: /* @__PURE__ */ __name((e4, t4 = {}) => r4.removeItem(e4, t4), "del"), remove: /* @__PURE__ */ __name((e4, t4 = {}) => r4.removeItem(e4, t4), "remove") };
      return r4;
    }({});
    __name(useStorage, "useStorage");
    _r2.mount("/assets", vr2);
    br2 = [1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225];
    xr2 = [1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987, 1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998];
    Rr2 = [];
    k3 = class {
      static {
        __name(this, "k");
      }
      _data = new l3();
      _hash = new l3([...br2]);
      _nDataBytes = 0;
      _minBufferSize = 0;
      finalize(e3) {
        e3 && this._append(e3);
        const t3 = 8 * this._nDataBytes, r4 = 8 * this._data.sigBytes;
        return this._data.words[r4 >>> 5] |= 128 << 24 - r4 % 32, this._data.words[14 + (r4 + 64 >>> 9 << 4)] = Math.floor(t3 / 4294967296), this._data.words[15 + (r4 + 64 >>> 9 << 4)] = t3, this._data.sigBytes = 4 * this._data.words.length, this._process(), this._hash;
      }
      _doProcessBlock(e3, t3) {
        const r4 = this._hash.words;
        let s4 = r4[0], a5 = r4[1], c4 = r4[2], u4 = r4[3], d4 = r4[4], h4 = r4[5], f4 = r4[6], m5 = r4[7];
        for (let r5 = 0; r5 < 64; r5++) {
          if (r5 < 16) Rr2[r5] = 0 | e3[t3 + r5];
          else {
            const e4 = Rr2[r5 - 15], t4 = (e4 << 25 | e4 >>> 7) ^ (e4 << 14 | e4 >>> 18) ^ e4 >>> 3, s5 = Rr2[r5 - 2], a6 = (s5 << 15 | s5 >>> 17) ^ (s5 << 13 | s5 >>> 19) ^ s5 >>> 10;
            Rr2[r5] = t4 + Rr2[r5 - 7] + a6 + Rr2[r5 - 16];
          }
          const g3 = s4 & a5 ^ s4 & c4 ^ a5 & c4, _3 = (s4 << 30 | s4 >>> 2) ^ (s4 << 19 | s4 >>> 13) ^ (s4 << 10 | s4 >>> 22), x3 = m5 + ((d4 << 26 | d4 >>> 6) ^ (d4 << 21 | d4 >>> 11) ^ (d4 << 7 | d4 >>> 25)) + (d4 & h4 ^ ~d4 & f4) + xr2[r5] + Rr2[r5];
          m5 = f4, f4 = h4, h4 = d4, d4 = u4 + x3 | 0, u4 = c4, c4 = a5, a5 = s4, s4 = x3 + (_3 + g3) | 0;
        }
        r4[0] = r4[0] + s4 | 0, r4[1] = r4[1] + a5 | 0, r4[2] = r4[2] + c4 | 0, r4[3] = r4[3] + u4 | 0, r4[4] = r4[4] + d4 | 0, r4[5] = r4[5] + h4 | 0, r4[6] = r4[6] + f4 | 0, r4[7] = r4[7] + m5 | 0;
      }
      _append(e3) {
        "string" == typeof e3 && (e3 = l3.fromUtf8(e3)), this._data.concat(e3), this._nDataBytes += e3.sigBytes;
      }
      _process(e3) {
        let t3, r4 = this._data.sigBytes / 64;
        r4 = e3 ? Math.ceil(r4) : Math.max((0 | r4) - this._minBufferSize, 0);
        const s4 = 16 * r4, a5 = Math.min(4 * s4, this._data.sigBytes);
        if (s4) {
          for (let e4 = 0; e4 < s4; e4 += 16) this._doProcessBlock(this._data.words, e4);
          t3 = this._data.words.splice(0, s4), this._data.sigBytes -= a5;
        }
        return new l3(t3, a5);
      }
    };
    l3 = class _l {
      static {
        __name(this, "l");
      }
      words;
      sigBytes;
      constructor(e3, t3) {
        e3 = this.words = e3 || [], this.sigBytes = void 0 === t3 ? 4 * e3.length : t3;
      }
      static fromUtf8(e3) {
        const t3 = unescape(encodeURIComponent(e3)), r4 = t3.length, s4 = [];
        for (let e4 = 0; e4 < r4; e4++) s4[e4 >>> 2] |= (255 & t3.charCodeAt(e4)) << 24 - e4 % 4 * 8;
        return new _l(s4, r4);
      }
      toBase64() {
        const e3 = [];
        for (let t3 = 0; t3 < this.sigBytes; t3 += 3) {
          const r4 = (this.words[t3 >>> 2] >>> 24 - t3 % 4 * 8 & 255) << 16 | (this.words[t3 + 1 >>> 2] >>> 24 - (t3 + 1) % 4 * 8 & 255) << 8 | this.words[t3 + 2 >>> 2] >>> 24 - (t3 + 2) % 4 * 8 & 255;
          for (let s4 = 0; s4 < 4 && 8 * t3 + 6 * s4 < 8 * this.sigBytes; s4++) e3.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(r4 >>> 6 * (3 - s4) & 63));
        }
        return e3.join("");
      }
      concat(e3) {
        if (this.words[this.sigBytes >>> 2] &= 4294967295 << 32 - this.sigBytes % 4 * 8, this.words.length = Math.ceil(this.sigBytes / 4), this.sigBytes % 4) for (let t3 = 0; t3 < e3.sigBytes; t3++) {
          const r4 = e3.words[t3 >>> 2] >>> 24 - t3 % 4 * 8 & 255;
          this.words[this.sigBytes + t3 >>> 2] |= r4 << 24 - (this.sigBytes + t3) % 4 * 8;
        }
        else for (let t3 = 0; t3 < e3.sigBytes; t3 += 4) this.words[this.sigBytes + t3 >>> 2] = e3.words[t3 >>> 2];
        this.sigBytes += e3.sigBytes;
      }
    };
    kr2 = (() => {
      class Hasher2 {
        static {
          __name(this, "Hasher2");
        }
        buff = "";
        #n = /* @__PURE__ */ new Map();
        write(e3) {
          this.buff += e3;
        }
        dispatch(e3) {
          return this[null === e3 ? "null" : typeof e3](e3);
        }
        object(e3) {
          if (e3 && "function" == typeof e3.toJSON) return this.object(e3.toJSON());
          const t3 = Object.prototype.toString.call(e3);
          let r4 = "";
          const a5 = t3.length;
          r4 = a5 < 10 ? "unknown:[" + t3 + "]" : t3.slice(8, a5 - 1), r4 = r4.toLowerCase();
          let c4 = null;
          if (void 0 !== (c4 = this.#n.get(e3))) return this.dispatch("[CIRCULAR:" + c4 + "]");
          if (this.#n.set(e3, this.#n.size), void 0 !== s3 && s3.isBuffer && s3.isBuffer(e3)) return this.write("buffer:"), this.write(e3.toString("utf8"));
          if ("object" !== r4 && "function" !== r4 && "asyncfunction" !== r4) this[r4] ? this[r4](e3) : this.unknown(e3, r4);
          else {
            const t4 = Object.keys(e3).sort(), r5 = [];
            this.write("object:" + (t4.length + r5.length) + ":");
            const dispatchForKey = /* @__PURE__ */ __name((t5) => {
              this.dispatch(t5), this.write(":"), this.dispatch(e3[t5]), this.write(",");
            }, "dispatchForKey");
            for (const e4 of t4) dispatchForKey(e4);
            for (const e4 of r5) dispatchForKey(e4);
          }
        }
        array(e3, t3) {
          if (t3 = void 0 !== t3 && t3, this.write("array:" + e3.length + ":"), !t3 || e3.length <= 1) {
            for (const t4 of e3) this.dispatch(t4);
            return;
          }
          const r4 = /* @__PURE__ */ new Map(), s4 = e3.map((e4) => {
            const t4 = new Hasher2();
            t4.dispatch(e4);
            for (const [e5, s5] of t4.#n) r4.set(e5, s5);
            return t4.toString();
          });
          return this.#n = r4, s4.sort(), this.array(s4, false);
        }
        date(e3) {
          return this.write("date:" + e3.toJSON());
        }
        symbol(e3) {
          return this.write("symbol:" + e3.toString());
        }
        unknown(e3, t3) {
          if (this.write(t3), e3) return this.write(":"), e3 && "function" == typeof e3.entries ? this.array([...e3.entries()], true) : void 0;
        }
        error(e3) {
          return this.write("error:" + e3.toString());
        }
        boolean(e3) {
          return this.write("bool:" + e3);
        }
        string(e3) {
          this.write("string:" + e3.length + ":"), this.write(e3);
        }
        function(e3) {
          this.write("fn:"), !function(e4) {
            if ("function" != typeof e4) return false;
            return "[native code] }" === Function.prototype.toString.call(e4).slice(-15);
          }(e3) ? this.dispatch(e3.toString()) : this.dispatch("[native]");
        }
        number(e3) {
          return this.write("number:" + e3);
        }
        null() {
          return this.write("Null");
        }
        undefined() {
          return this.write("Undefined");
        }
        regexp(e3) {
          return this.write("regex:" + e3.toString());
        }
        arraybuffer(e3) {
          return this.write("arraybuffer:"), this.dispatch(new Uint8Array(e3));
        }
        url(e3) {
          return this.write("url:" + e3.toString());
        }
        map(e3) {
          this.write("map:");
          const t3 = [...e3];
          return this.array(t3, false);
        }
        set(e3) {
          this.write("set:");
          const t3 = [...e3];
          return this.array(t3, false);
        }
        bigint(e3) {
          return this.write("bigint:" + e3.toString());
        }
      }
      for (const e3 of ["uint8array", "uint8clampedarray", "unt8array", "uint16array", "unt16array", "uint32array", "unt32array", "float32array", "float64array"]) Hasher2.prototype[e3] = function(t3) {
        return this.write(e3 + ":"), this.array([...t3], false);
      };
      return Hasher2;
    })();
    __name(hash, "hash");
    __name(defineCachedFunction, "defineCachedFunction");
    __name(getKey, "getKey");
    __name(escapeKey, "escapeKey");
    __name(cloneWithProxy, "cloneWithProxy");
    cachedEventHandler = /* @__PURE__ */ __name(function(e3, t3 = { name: "_", base: "/cache", swr: true, maxAge: 1 }) {
      const r4 = (t3.varies || []).filter(Boolean).map((e4) => e4.toLowerCase()).sort(), s4 = { ...t3, getKey: /* @__PURE__ */ __name(async (e4) => {
        const s5 = await t3.getKey?.(e4);
        if (s5) return escapeKey(s5);
        const a6 = e4.node.req.originalUrl || e4.node.req.url || e4.path;
        let c4;
        try {
          c4 = escapeKey(decodeURI(parseURL(a6).pathname)).slice(0, 16) || "index";
        } catch {
          c4 = "-";
        }
        return [`${c4}.${hash(a6)}`, ...r4.map((t4) => [t4, e4.node.req.headers[t4]]).map(([e5, t4]) => `${escapeKey(e5)}.${hash(t4)}`)].join(":");
      }, "getKey"), validate: /* @__PURE__ */ __name((e4) => !!e4.value && (!(e4.value.code >= 400) && (void 0 !== e4.value.body && ("undefined" !== e4.value.headers.etag && "undefined" !== e4.value.headers["last-modified"]))), "validate"), group: t3.group || "nitro/handlers", integrity: t3.integrity || hash([e3, t3]) }, a5 = function(e4, t4 = {}) {
        return defineCachedFunction(e4, t4);
      }(async (a6) => {
        const c4 = {};
        for (const e4 of r4) {
          const t4 = a6.node.req.headers[e4];
          void 0 !== t4 && (c4[e4] = t4);
        }
        const u4 = cloneWithProxy(a6.node.req, { headers: c4 }), d4 = {};
        let h4;
        const f4 = createEvent(u4, cloneWithProxy(a6.node.res, { statusCode: 200, writableEnded: false, writableFinished: false, headersSent: false, closed: false, getHeader: /* @__PURE__ */ __name((e4) => d4[e4], "getHeader"), setHeader(e4, t4) {
          return d4[e4] = t4, this;
        }, getHeaderNames: /* @__PURE__ */ __name(() => Object.keys(d4), "getHeaderNames"), hasHeader: /* @__PURE__ */ __name((e4) => e4 in d4, "hasHeader"), removeHeader(e4) {
          delete d4[e4];
        }, getHeaders: /* @__PURE__ */ __name(() => d4, "getHeaders"), end(e4, t4, r5) {
          return "string" == typeof e4 && (h4 = e4), "function" == typeof t4 && t4(), "function" == typeof r5 && r5(), this;
        }, write: /* @__PURE__ */ __name((e4, t4, r5) => ("string" == typeof e4 && (h4 = e4), "function" == typeof t4 && t4(void 0), "function" == typeof r5 && r5(), true), "write"), writeHead(e4, t4) {
          if (this.statusCode = e4, t4) {
            if (Array.isArray(t4) || "string" == typeof t4) throw new TypeError("Raw headers  is not supported.");
            for (const e5 in t4) {
              const r5 = t4[e5];
              void 0 !== r5 && this.setHeader(e5, r5);
            }
          }
          return this;
        } }));
        f4.fetch = (e4, t4) => fetchWithEvent(f4, e4, t4, { fetch: useNitroApp().localFetch }), f4.$fetch = (e4, t4) => fetchWithEvent(f4, e4, t4, { fetch: globalThis.$fetch }), f4.waitUntil = a6.waitUntil, f4.context = a6.context, f4.context.cache = { options: s4 };
        const m5 = await e3(f4) || h4, g3 = f4.node.res.getHeaders();
        g3.etag = String(g3.Etag || g3.etag || `W/"${hash(m5)}"`), g3["last-modified"] = String(g3["Last-Modified"] || g3["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString());
        const _3 = [];
        t3.swr ? (t3.maxAge && _3.push(`s-maxage=${t3.maxAge}`), t3.staleMaxAge ? _3.push(`stale-while-revalidate=${t3.staleMaxAge}`) : _3.push("stale-while-revalidate")) : t3.maxAge && _3.push(`max-age=${t3.maxAge}`), _3.length > 0 && (g3["cache-control"] = _3.join(", "));
        return { code: f4.node.res.statusCode, headers: g3, body: m5 };
      }, s4);
      return defineEventHandler(async (r5) => {
        if (t3.headersOnly) {
          if (handleCacheHeaders(r5, { maxAge: t3.maxAge })) return;
          return e3(r5);
        }
        const s5 = await a5(r5);
        if (r5.node.res.headersSent || r5.node.res.writableEnded) return s5.body;
        if (!handleCacheHeaders(r5, { modifiedTime: new Date(s5.headers["last-modified"]), etag: s5.headers.etag, maxAge: t3.maxAge })) {
          r5.node.res.statusCode = s5.code;
          for (const e4 in s5.headers) {
            const t4 = s5.headers[e4];
            "set-cookie" === e4 ? r5.node.res.appendHeader(e4, splitCookiesString2(t4)) : void 0 !== t4 && r5.node.res.setHeader(e4, t4);
          }
          return s5.body;
        }
      });
    }, "cachedEventHandler");
    __name(klona, "klona");
    Er2 = $t2({});
    Cr2 = /\d/;
    Sr2 = ["-", "_", "/", "."];
    __name(isUppercase, "isUppercase");
    __name(kebabCase, "kebabCase");
    __name(getEnv, "getEnv");
    __name(_isObject, "_isObject");
    Ar2 = /\{\{([^{}]*)\}\}/g;
    __name(_expandFromEnv, "_expandFromEnv");
    Tr2 = { app: { baseURL: "/" }, nitro: { routeRules: {} } };
    Hr2 = { prefix: "NITRO_", altPrefix: Tr2.nitro.envPrefix ?? g.env.NITRO_ENV_PREFIX ?? "_", envExpansion: Tr2.nitro.envExpansion ?? g.env.NITRO_ENV_EXPANSION ?? false };
    jr2 = _deepFreeze((/* @__PURE__ */ __name(function applyEnv(e3, t3, r4 = "") {
      for (const s4 in e3) {
        const a5 = r4 ? `${r4}_${s4}` : s4, c4 = getEnv(a5, t3);
        _isObject(e3[s4]) ? _isObject(c4) ? (e3[s4] = { ...e3[s4], ...c4 }, applyEnv(e3[s4], t3, a5)) : void 0 === c4 ? applyEnv(e3[s4], t3, a5) : e3[s4] = c4 ?? e3[s4] : e3[s4] = c4 ?? e3[s4], t3.envExpansion && "string" == typeof e3[s4] && (e3[s4] = _expandFromEnv(e3[s4]));
      }
      return e3;
    }, "applyEnv"))(klona(Tr2), Hr2));
    __name(useRuntimeConfig, "useRuntimeConfig");
    __name(_deepFreeze, "_deepFreeze");
    _deepFreeze(klona(Er2)), new Proxy(/* @__PURE__ */ Object.create(null), { get: /* @__PURE__ */ __name((e3, t3) => {
      console.warn("Please use `useRuntimeConfig()` instead of accessing config directly.");
      const r4 = useRuntimeConfig();
      if (t3 in r4) return r4[t3];
    }, "get") });
    Ir2 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : void 0 !== ar ? ar : {};
    Pr2 = "__unctx__";
    Mr2 = Ir2[Pr2] || (Ir2[Pr2] = /* @__PURE__ */ function(e3 = {}) {
      const t3 = {};
      return { get: /* @__PURE__ */ __name((r4, s4 = {}) => (t3[r4] || (t3[r4] = function(e4 = {}) {
        let t4, r5 = false;
        const checkConflict = /* @__PURE__ */ __name((e5) => {
          if (t4 && t4 !== e5) throw new Error("Context conflict");
        }, "checkConflict");
        let s5;
        if (e4.asyncContext) {
          const t5 = e4.AsyncLocalStorage || globalThis.AsyncLocalStorage;
          t5 ? s5 = new t5() : console.warn("[unctx] `AsyncLocalStorage` is not provided.");
        }
        const _getCurrentInstance = /* @__PURE__ */ __name(() => {
          if (s5) {
            const e5 = s5.getStore();
            if (void 0 !== e5) return e5;
          }
          return t4;
        }, "_getCurrentInstance");
        return { use: /* @__PURE__ */ __name(() => {
          const e5 = _getCurrentInstance();
          if (void 0 === e5) throw new Error("Context is not available");
          return e5;
        }, "use"), tryUse: /* @__PURE__ */ __name(() => _getCurrentInstance(), "tryUse"), set: /* @__PURE__ */ __name((e5, s6) => {
          s6 || checkConflict(e5), t4 = e5, r5 = true;
        }, "set"), unset: /* @__PURE__ */ __name(() => {
          t4 = void 0, r5 = false;
        }, "unset"), call: /* @__PURE__ */ __name((e5, a5) => {
          checkConflict(e5), t4 = e5;
          try {
            return s5 ? s5.run(e5, a5) : a5();
          } finally {
            r5 || (t4 = void 0);
          }
        }, "call"), async callAsync(e5, a5) {
          t4 = e5;
          const onRestore = /* @__PURE__ */ __name(() => {
            t4 = e5;
          }, "onRestore"), onLeave = /* @__PURE__ */ __name(() => t4 === e5 ? onRestore : void 0, "onLeave");
          Nr2.add(onLeave);
          try {
            const c4 = s5 ? s5.run(e5, a5) : a5();
            return r5 || (t4 = void 0), await c4;
          } finally {
            Nr2.delete(onLeave);
          }
        } };
      }({ ...e3, ...s4 })), t3[r4]), "get") };
    }());
    Or2 = "__unctx_async_handlers__";
    Nr2 = Ir2[Or2] || (Ir2[Or2] = /* @__PURE__ */ new Set());
    ((e3, t3 = {}) => {
      Mr2.get(e3, t3);
    })("nitro-app", { asyncContext: void 0, AsyncLocalStorage: void 0 });
    qr2 = toRouteMatcher(createRouter$1({ routes: useRuntimeConfig().nitro.routeRules }));
    __name(createRouteRulesHandler, "createRouteRulesHandler");
    __name(getRouteRulesForPath, "getRouteRulesForPath");
    Br2 = /post|put|patch/i;
    __name(joinHeaders, "joinHeaders");
    __name(normalizeCookieHeader, "normalizeCookieHeader");
    __name(normalizeCookieHeaders, "normalizeCookieHeaders");
    __name(defaultHandler, "defaultHandler");
    Ur2 = [function(e3, t3) {
      const r4 = defaultHandler(e3, t3);
      return setResponseHeaders(t3, r4.headers), setResponseStatus(t3, r4.status, r4.statusText), send2(t3, JSON.stringify(r4.body, null, 2));
    }];
    zr2 = [];
    Lr2 = [{ route: "/**", handler: /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_ssr(), ssr_exports)).then(function(e3) {
      return e3.b;
    }), "handler"), lazy: true, middleware: false, method: void 0 }];
    $r2 = function() {
      const e3 = useRuntimeConfig(), t3 = new Hookable(), captureError = /* @__PURE__ */ __name((e4, r5 = {}) => {
        const s5 = t3.callHookParallel("error", e4, r5).catch((e5) => {
          console.error("Error while capturing another error", e5);
        });
        if (r5.event && isEvent(r5.event)) {
          const t4 = r5.event.context.nitro?.errors;
          t4 && t4.push({ error: e4, context: r5 }), r5.event.waitUntil && r5.event.waitUntil(s5);
        }
      }, "captureError"), r4 = createApp({ debug: destr(false), onError: /* @__PURE__ */ __name((e4, t4) => (captureError(e4, { event: t4, tags: ["request"] }), async function(e5, t5) {
        for (const r5 of Ur2) try {
          if (await r5(e5, t5, { defaultHandler }), t5.handled) return;
        } catch (e6) {
          console.error(e6);
        }
      }(e4, t4)), "onError"), onRequest: /* @__PURE__ */ __name(async (e4) => {
        e4.context.nitro = e4.context.nitro || { errors: [] };
        const t4 = e4.node.req?.__unenv__;
        t4?._platform && (e4.context = { _platform: t4?._platform, ...t4._platform, ...e4.context }), !e4.context.waitUntil && t4?.waitUntil && (e4.context.waitUntil = t4.waitUntil), e4.fetch = (t5, r5) => fetchWithEvent(e4, t5, r5, { fetch: localFetch }), e4.$fetch = (t5, r5) => fetchWithEvent(e4, t5, r5, { fetch: c4 }), e4.waitUntil = (t5) => {
          e4.context.nitro._waitUntilPromises || (e4.context.nitro._waitUntilPromises = []), e4.context.nitro._waitUntilPromises.push(t5), e4.context.waitUntil && e4.context.waitUntil(t5);
        }, e4.captureError = (t5, r5) => {
          captureError(t5, { event: e4, ...r5 });
        }, await $r2.hooks.callHook("request", e4).catch((t5) => {
          captureError(t5, { event: e4, tags: ["request"] });
        });
      }, "onRequest"), onBeforeResponse: /* @__PURE__ */ __name(async (e4, t4) => {
        await $r2.hooks.callHook("beforeResponse", e4, t4).catch((t5) => {
          captureError(t5, { event: e4, tags: ["request", "response"] });
        });
      }, "onBeforeResponse"), onAfterResponse: /* @__PURE__ */ __name(async (e4, t4) => {
        await $r2.hooks.callHook("afterResponse", e4, t4).catch((t5) => {
          captureError(t5, { event: e4, tags: ["request", "response"] });
        });
      }, "onAfterResponse") }), s4 = function(e4 = {}) {
        const t4 = createRouter$1({}), r5 = {};
        let s5;
        const a6 = {}, addRoute = /* @__PURE__ */ __name((e5, s6, c6) => {
          let u4 = r5[e5];
          if (u4 || (r5[e5] = u4 = { path: e5, handlers: {} }, t4.insert(e5, u4)), Array.isArray(c6)) for (const t5 of c6) addRoute(e5, s6, t5);
          else u4.handlers[c6] = toEventHandler(s6, 0, e5);
          return a6;
        }, "addRoute");
        a6.use = a6.add = (e5, t5, r6) => addRoute(e5, t5, r6 || "all");
        for (const e5 of or2) a6[e5] = (t5, r6) => a6.add(t5, r6, e5);
        const matchHandler = /* @__PURE__ */ __name((e5 = "/", r6 = "get") => {
          const a7 = e5.indexOf("?");
          -1 !== a7 && (e5 = e5.slice(0, Math.max(0, a7)));
          const c6 = t4.lookup(e5);
          if (!c6 || !c6.handlers) return { error: createError({ statusCode: 404, name: "Not Found", statusMessage: `Cannot find any route matching ${e5 || "/"}.` }) };
          let u4 = c6.handlers[r6] || c6.handlers.all;
          if (!u4) {
            s5 || (s5 = toRouteMatcher(t4));
            const a8 = s5.matchAll(e5).reverse();
            for (const e6 of a8) {
              if (e6.handlers[r6]) {
                u4 = e6.handlers[r6], c6.handlers[r6] = c6.handlers[r6] || u4;
                break;
              }
              if (e6.handlers.all) {
                u4 = e6.handlers.all, c6.handlers.all = c6.handlers.all || u4;
                break;
              }
            }
          }
          return u4 ? { matched: c6, handler: u4 } : { error: createError({ statusCode: 405, name: "Method Not Allowed", statusMessage: `Method ${r6} is not allowed on this route.` }) };
        }, "matchHandler"), c5 = e4.preemptive || e4.preemtive;
        return a6.handler = rr2((e5) => {
          const t5 = matchHandler(e5.path, e5.method.toLowerCase());
          if ("error" in t5) {
            if (c5) throw t5.error;
            return;
          }
          e5.context.matchedRoute = t5.matched;
          const r6 = t5.matched.params || {};
          return e5.context.params = r6, Promise.resolve(t5.handler(e5)).then((e6) => void 0 === e6 && c5 ? null : e6);
        }), a6.handler.__resolve__ = async (e5) => {
          e5 = function(e6 = "") {
            return function(e7 = "") {
              return e7.startsWith("/");
            }(e6) ? e6 : "/" + e6;
          }(e5);
          const t5 = matchHandler(e5);
          if ("error" in t5) return;
          let r6 = { route: t5.matched.path, handler: t5.handler };
          if (t5.handler.__resolve__) {
            const s6 = await t5.handler.__resolve__(e5);
            if (!s6) return;
            r6 = { ...r6, ...s6 };
          }
          return r6;
        }, a6;
      }({ preemptive: true }), a5 = toNodeListener(r4), localFetch = /* @__PURE__ */ __name((e4, t4) => e4.toString().startsWith("/") ? async function(e5, t5, r5 = {}) {
        try {
          const s5 = await b2(e5, { url: t5, ...r5 });
          return new Response(s5.body, { status: s5.status, statusText: s5.statusText, headers: v2(s5.headers) });
        } catch (e6) {
          return new Response(e6.toString(), { status: Number.parseInt(e6.statusCode || e6.code) || 500, statusText: e6.statusText });
        }
      }(a5, e4, t4).then((e5) => function(e6) {
        return e6.headers.has("set-cookie") ? new Response(e6.body, { status: e6.status, statusText: e6.statusText, headers: normalizeCookieHeaders(e6.headers) }) : e6;
      }(e5)) : globalThis.fetch(e4, t4), "localFetch"), c4 = createFetch({ fetch: localFetch, Headers: pr2, defaults: { baseURL: e3.app.baseURL } });
      globalThis.$fetch = c4, r4.use(createRouteRulesHandler({ localFetch }));
      for (const t4 of Lr2) {
        let a6 = t4.lazy ? lazyEventHandler(t4.handler) : t4.handler;
        if (t4.middleware || !t4.route) {
          const s5 = (e3.app.baseURL + (t4.route || "/")).replace(/\/+/g, "/");
          r4.use(s5, a6);
        } else {
          const e4 = getRouteRulesForPath(t4.route.replace(/:\w+|\*\*/g, "_"));
          e4.cache && (a6 = cachedEventHandler(a6, { group: "nitro/routes", ...e4.cache })), s4.use(t4.route, a6, t4.method);
        }
      }
      return r4.use(e3.app.baseURL, s4.handler), { hooks: t3, h3App: r4, router: s4, localCall: /* @__PURE__ */ __name((e4) => b2(a5, e4), "localCall"), localFetch, captureError };
    }();
    __name(useNitroApp, "useNitroApp");
    !function(e3) {
      for (const t3 of zr2) try {
        t3(e3);
      } catch (t4) {
        throw e3.captureError(t4, { tags: ["plugin"] }), t4;
      }
    }($r2);
    Kr2 = { "/android-chrome-192x192.png": { type: "image/png", etag: '"750c-oU2mem0jjZ8XbVMelLzRr7WdVPI"', mtime: "2025-07-17T07:49:59.533Z", size: 29964, path: "../public/android-chrome-192x192.png" }, "/android-chrome-512x512.png": { type: "image/png", etag: '"1aad7-TxqzM3JFMTytpE8GX+/4lMPNyzQ"', mtime: "2025-07-17T07:49:59.534Z", size: 109271, path: "../public/android-chrome-512x512.png" }, "/apple-touch-icon.png": { type: "image/png", etag: '"6a6e-DDBGYLGi+sElNLs2+1QICHz5lS4"', mtime: "2025-07-17T07:49:59.534Z", size: 27246, path: "../public/apple-touch-icon.png" }, "/constructa_banner_.png": { type: "image/png", etag: '"280c0-lPy+5LM4cIw+MgR90q+TJhkoRm0"', mtime: "2025-07-17T07:49:59.534Z", size: 164032, path: "../public/constructa_banner_.png" }, "/favicon.ico": { type: "image/vnd.microsoft.icon", etag: '"10be-znt63X+zxDewIRdvPHK7PFIPMUY"', mtime: "2025-07-17T07:49:59.534Z", size: 4286, path: "../public/favicon.ico" }, "/favicon.png": { type: "image/png", etag: '"67e5-ny4sVkZ+LjrJ2LL5g6fVyYGPMa8"', mtime: "2025-07-17T07:49:59.534Z", size: 26597, path: "../public/favicon.png" }, "/site.webmanifest": { type: "application/manifest+json", etag: '"1aa-E+WqWOshgtis5jJmhWyMwpxHwIM"', mtime: "2025-07-17T07:49:59.534Z", size: 426, path: "../public/site.webmanifest" }, "/assets/app-CuP4mKs1.css": { type: "text/css; charset=utf-8", etag: '"1b51c-JbYxFDxKlw27LilefpFlUrep6qE"', mtime: "2025-07-17T07:49:59.533Z", size: 111900, path: "../public/assets/app-CuP4mKs1.css" }, "/assets/custom-tn0RQdqM.css": { type: "text/css; charset=utf-8", etag: '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"', mtime: "2025-07-17T07:49:59.215Z", size: 0, path: "../public/assets/custom-tn0RQdqM.css" }, "/assets/index-yCcNlDWb.js": { type: "text/javascript; charset=utf-8", etag: '"bf4-KLUhFeWMQPtMDhrMivQh2yz+6S0"', mtime: "2025-07-17T07:49:59.533Z", size: 3060, path: "../public/assets/index-yCcNlDWb.js" }, "/assets/main-CQQcyaBi.js": { type: "text/javascript; charset=utf-8", etag: '"80d8d-9qTVOiGruYoACbSLTePnb0MTIzM"', mtime: "2025-07-17T07:49:59.535Z", size: 527757, path: "../public/assets/main-CQQcyaBi.js" }, "/.vite/manifest.json": { type: "application/json", etag: '"3eb-b/5aEahoA4wOVu98C0TtJn2HE1M"', mtime: "2025-07-17T07:49:59.533Z", size: 1003, path: "../public/.vite/manifest.json" } };
    Wr2 = {};
    Dr2 = function(e3) {
      const t3 = useNitroApp();
      return { async fetch(r4, a5, c4) {
        const u4 = {}, d4 = new URL(r4.url);
        if (e3.fetch) {
          const t4 = await e3.fetch(r4, a5, c4, d4, u4);
          if (t4) return t4;
        }
        return async function(e4, t4, r5, a6 = new URL(e4.url), c5 = useNitroApp(), u5) {
          let d5;
          (function(e5) {
            return Br2.test(e5.method);
          })(e4) && (d5 = s3.from(await e4.arrayBuffer()));
          return globalThis.__env__ = t4, c5.localFetch(a6.pathname + a6.search, { context: { waitUntil: /* @__PURE__ */ __name((e5) => r5.waitUntil(e5), "waitUntil"), _platform: { cf: e4.cf, cloudflare: { request: e4, env: t4, context: r5, url: a6, ...u5 } } }, host: a6.hostname, protocol: a6.protocol, method: e4.method, headers: e4.headers, body: d5 });
        }(r4, a5, c4, d4, t3, u4);
      }, scheduled(e4, r4, s4) {
        globalThis.__env__ = r4, s4.waitUntil(t3.hooks.callHook("cloudflare:scheduled", { controller: e4, env: r4, context: s4 }));
      }, email(e4, r4, s4) {
        globalThis.__env__ = r4, s4.waitUntil(t3.hooks.callHook("cloudflare:email", { message: e4, event: e4, env: r4, context: s4 }));
      }, queue(e4, r4, s4) {
        globalThis.__env__ = r4, s4.waitUntil(t3.hooks.callHook("cloudflare:queue", { batch: e4, event: e4, env: r4, context: s4 }));
      }, tail(e4, r4, s4) {
        globalThis.__env__ = r4, s4.waitUntil(t3.hooks.callHook("cloudflare:tail", { traces: e4, env: r4, context: s4 }));
      }, trace(e4, r4, s4) {
        globalThis.__env__ = r4, s4.waitUntil(t3.hooks.callHook("cloudflare:trace", { traces: e4, env: r4, context: s4 }));
      } };
    }({ fetch(e3, t3, r4, s4) {
      if (t3.ASSETS && function(e4 = "") {
        if (Kr2[e4]) return true;
        for (const t4 in Wr2) if (e4.startsWith(t4)) return true;
        return false;
      }(s4.pathname)) return t3.ASSETS.fetch(e3);
    } });
  }
});

// .wrangler/tmp/bundle-vrQNkE/middleware-loader.entry.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// .wrangler/tmp/bundle-vrQNkE/middleware-insertion-facade.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// .output/server/index.mjs
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_nitro();
import "cloudflare:workers";
import "node:events";
import "node:buffer";
import "node:timers";
globalThis._importMeta_ = { url: "file:///_entry.js", env: {} };

// node_modules/.pnpm/wrangler@4.24.3_@cloudflare+workers-types@4.20250715.0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e3) {
      console.error("Failed to drain the unused request body.", e3);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/.pnpm/wrangler@4.24.3_@cloudflare+workers-types@4.20250715.0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e3) {
  return {
    name: e3?.name,
    message: e3?.message ?? String(e3),
    stack: e3?.stack,
    cause: e3?.cause === void 0 ? void 0 : reduceError(e3.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e3) {
    const error3 = reduceError(e3);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-vrQNkE/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = Dr2;

// node_modules/.pnpm/wrangler@4.24.3_@cloudflare+workers-types@4.20250715.0/node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-vrQNkE/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
