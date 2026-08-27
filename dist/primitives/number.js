function decimals(value) {
  const text = String(value);
  return text.includes(".") ? text.length - text.indexOf(".") - 1 : 0;
}
function normalizeNumber(value, options = {}) {
  var _a;
  if (value === "" || value === null || value === void 0) return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return void 0;
  const minimum = Number.isFinite(options.min) ? options.min : -Infinity;
  const maximum = Number.isFinite(options.max) ? options.max : Infinity;
  const clamped = Math.min(maximum, Math.max(minimum, numeric));
  const precision = Number.isInteger(options.precision) ? Math.min(20, Math.max(0, options.precision)) : decimals((_a = options.step) != null ? _a : 1);
  return Number(clamped.toFixed(precision));
}
function stepNumber(value, direction, options = {}) {
  const step = Number.isFinite(options.step) && options.step > 0 ? options.step : 1;
  const base = normalizeNumber(value, options);
  const start = base === null || base === void 0 ? 0 : base;
  return normalizeNumber(start + step * direction, { ...options, step });
}
export {
  normalizeNumber,
  stepNumber
};
