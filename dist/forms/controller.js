function fieldList(input, fallback) {
  if (input === void 0) return fallback;
  return Array.isArray(input) ? input : [input];
}
function readPath(source, path) {
  return String(path).split(".").reduce((value, key) => value == null ? void 0 : value[key], source);
}
function isEmpty(value) {
  return value === void 0 || value === null || value === "" || Array.isArray(value) && value.length === 0;
}
function measure(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string" || Array.isArray(value)) return value.length;
  return void 0;
}
function defaultMessage(field, kind, limit) {
  if (kind === "required") return `${field} is required`;
  if (kind === "pattern") return `${field} has an invalid format`;
  if (kind === "min") return `${field} must be at least ${limit}`;
  if (kind === "max") return `${field} must be at most ${limit}`;
  return `${field} is invalid`;
}
async function evaluateRule(ruleInput, value, values, field) {
  var _a, _b, _c, _d, _e;
  const rule = typeof ruleInput === "function" ? { validator: ruleInput } : ruleInput;
  if (!rule || typeof rule !== "object") throw new TypeError(`Invalid validation rule for ${field}`);
  if (rule.required && isEmpty(value)) return (_a = rule.message) != null ? _a : defaultMessage(field, "required");
  if (isEmpty(value)) return null;
  const amount = measure(value);
  if (rule.min !== void 0 && amount !== void 0 && amount < rule.min) return (_b = rule.message) != null ? _b : defaultMessage(field, "min", rule.min);
  if (rule.max !== void 0 && amount !== void 0 && amount > rule.max) return (_c = rule.message) != null ? _c : defaultMessage(field, "max", rule.max);
  if (rule.pattern) {
    rule.pattern.lastIndex = 0;
    if (!rule.pattern.test(String(value))) return (_d = rule.message) != null ? _d : defaultMessage(field, "pattern");
  }
  if (!rule.validator) return null;
  const result = rule.validator.length >= 3 ? await new Promise((resolve, reject) => {
    let settled = false;
    const done = (error) => {
      if (settled) return;
      settled = true;
      if (!error) resolve(void 0);
      else resolve(error.message || String(error));
    };
    try {
      const pending = rule.validator(rule, value, done, values);
      if (pending == null ? void 0 : pending.then) pending.then(() => done()).catch(reject);
    } catch (error) {
      reject(error);
    }
  }) : await rule.validator(value, values, field);
  if (result === true || result === void 0 || result === null) return null;
  if (result === false) return (_e = rule.message) != null ? _e : defaultMessage(field, "validator");
  if (typeof result === "string") return result;
  throw new TypeError(`Validator for ${field} must return boolean, string, or nothing`);
}
function createFormController(options = {}) {
  var _a;
  if (typeof options.getValues !== "function") throw new TypeError("createFormController requires getValues()");
  let rules = (_a = options.rules) != null ? _a : {};
  let errors = {};
  let destroyed = false;
  const listeners = /* @__PURE__ */ new Set();
  const versions = /* @__PURE__ */ new Map();
  const snapshot = () => Object.freeze({
    valid: Object.values(errors).every((messages) => messages.length === 0),
    errors: Object.freeze(Object.fromEntries(Object.entries(errors).map(([field, messages]) => [field, Object.freeze([...messages])])))
  });
  const notify = () => {
    const state = snapshot();
    for (const listener of listeners) listener(state);
    return state;
  };
  const validateField = async (field) => {
    var _a2, _b, _c;
    if (destroyed) throw new Error("Cannot validate with a destroyed form controller");
    const version = ((_a2 = versions.get(field)) != null ? _a2 : 0) + 1;
    versions.set(field, version);
    const values = (_b = options.getValues()) != null ? _b : {};
    const messages = [];
    for (const rule of fieldList(rules[field], [])) {
      const message = await evaluateRule(rule, readPath(values, field), values, field);
      if (message) messages.push(message);
    }
    if (versions.get(field) !== version) return (_c = errors[field]) != null ? _c : [];
    errors = { ...errors, [field]: messages };
    notify();
    return Object.freeze([...messages]);
  };
  const clear = (fields) => {
    const selected = fieldList(fields, Object.keys(errors));
    errors = { ...errors };
    selected.forEach((field) => {
      var _a2;
      delete errors[field];
      versions.set(field, ((_a2 = versions.get(field)) != null ? _a2 : 0) + 1);
    });
    return notify();
  };
  return Object.freeze({
    getState: snapshot,
    async validate(fields) {
      const selected = fieldList(fields, Object.keys(rules));
      await Promise.all(selected.map(validateField));
      return snapshot();
    },
    validateField,
    clear,
    setRules(nextRules = {}) {
      if (!nextRules || typeof nextRules !== "object") throw new TypeError("Form rules must be an object");
      rules = nextRules;
      return clear();
    },
    subscribe(listener) {
      if (typeof listener !== "function") throw new TypeError("Form listener must be a function");
      listeners.add(listener);
      listener(snapshot());
      return () => listeners.delete(listener);
    },
    destroy() {
      destroyed = true;
      listeners.clear();
      versions.clear();
    }
  });
}
export {
  createFormController
};
