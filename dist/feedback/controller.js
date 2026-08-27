const TYPES = /* @__PURE__ */ new Set(["info", "success", "warning", "danger"]);
function normalizeText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new TypeError(`${field} must be a non-empty string`);
  return value.trim();
}
function createFeedbackController(options = {}) {
  var _a, _b;
  const schedule = (_a = options.setTimeout) != null ? _a : globalThis.setTimeout;
  const cancelSchedule = (_b = options.clearTimeout) != null ? _b : globalThis.clearTimeout;
  let sequence = 0;
  let destroyed = false;
  let messages = [];
  let requests = [];
  const listeners = /* @__PURE__ */ new Set();
  const timers = /* @__PURE__ */ new Map();
  const resolvers = /* @__PURE__ */ new Map();
  const snapshot = () => Object.freeze({ messages: Object.freeze([...messages]), requests: Object.freeze([...requests]) });
  const notify = () => {
    const state = snapshot();
    for (const listener of listeners) listener(state);
    return state;
  };
  const nextId = (prefix) => `${prefix}-${++sequence}`;
  function dismiss(id, reason = "dismiss") {
    var _a2;
    const current = messages.find((item) => item.id === id);
    if (!current) return snapshot();
    const timer = timers.get(id);
    if (timer !== void 0) cancelSchedule(timer);
    timers.delete(id);
    messages = messages.filter((item) => item.id !== id);
    (_a2 = options.onDismiss) == null ? void 0 : _a2.call(options, current, reason);
    return notify();
  }
  function show(kind, input) {
    var _a2, _b2, _c, _d;
    if (destroyed) throw new Error("feedback controller has been destroyed");
    const source = typeof input === "string" ? { message: input } : { ...input };
    const type = (_a2 = source.type) != null ? _a2 : "info";
    if (!TYPES.has(type)) throw new TypeError(`Unsupported feedback type: ${type}`);
    const duration = source.duration === 0 ? 0 : Math.max(500, Number((_b2 = source.duration) != null ? _b2 : kind === "message" ? 3e3 : 5e3));
    const item = Object.freeze({
      id: (_c = source.id) != null ? _c : nextId(kind),
      kind,
      type,
      title: source.title ? normalizeText(source.title, "title") : "",
      message: normalizeText(source.message, "message"),
      duration,
      actionLabel: source.actionLabel ? normalizeText(source.actionLabel, "actionLabel") : ""
    });
    if (messages.some((entry) => entry.id === item.id)) dismiss(item.id, "replace");
    const nextMessages = [...messages, item].slice(-((_d = options.maxMessages) != null ? _d : 5));
    for (const previous of messages) {
      if (!nextMessages.includes(previous) && timers.has(previous.id)) {
        cancelSchedule(timers.get(previous.id));
        timers.delete(previous.id);
      }
    }
    messages = nextMessages;
    notify();
    if (duration > 0) timers.set(item.id, schedule(() => dismiss(item.id, "timeout"), duration));
    return Object.freeze({ id: item.id, close: () => dismiss(item.id, "api") });
  }
  function ask(kind, input) {
    if (destroyed) return Promise.reject(new Error("feedback controller has been destroyed"));
    const source = typeof input === "string" ? { message: input } : { ...input };
    return new Promise((resolve) => {
      var _a2, _b2, _c, _d;
      const request = Object.freeze({
        id: nextId(kind),
        kind,
        title: source.title ? normalizeText(source.title, "title") : kind === "confirm" ? "Confirm" : "Prompt",
        message: normalizeText(source.message, "message"),
        confirmText: (_a2 = source.confirmText) != null ? _a2 : "Confirm",
        cancelText: (_b2 = source.cancelText) != null ? _b2 : "Cancel",
        placeholder: (_c = source.placeholder) != null ? _c : "",
        defaultValue: (_d = source.defaultValue) != null ? _d : ""
      });
      resolvers.set(request.id, resolve);
      requests = [...requests, request];
      notify();
    });
  }
  function settleRequest(id, accepted, value = "") {
    var _a2;
    const request = requests.find((item) => item.id === id);
    if (!request) return snapshot();
    requests = requests.filter((item) => item.id !== id);
    (_a2 = resolvers.get(id)) == null ? void 0 : _a2(request.kind === "confirm" ? Boolean(accepted) : accepted ? String(value) : null);
    resolvers.delete(id);
    return notify();
  }
  return Object.freeze({
    getState: snapshot,
    subscribe(listener) {
      if (destroyed) throw new Error("feedback controller has been destroyed");
      listeners.add(listener);
      listener(snapshot());
      return () => listeners.delete(listener);
    },
    message: (input) => show("message", input),
    notification: (input) => show("notification", input),
    dismiss,
    clear() {
      for (const id of timers.keys()) cancelSchedule(timers.get(id));
      timers.clear();
      messages = [];
      return notify();
    },
    confirm: (input) => ask("confirm", input),
    prompt: (input) => ask("prompt", input),
    settleRequest,
    destroy() {
      var _a2;
      if (destroyed) return;
      for (const id of timers.keys()) cancelSchedule(timers.get(id));
      for (const request of requests) (_a2 = resolvers.get(request.id)) == null ? void 0 : _a2(request.kind === "confirm" ? false : null);
      resolvers.clear();
      timers.clear();
      messages = [];
      requests = [];
      listeners.clear();
      destroyed = true;
    }
  });
}
export {
  createFeedbackController
};
