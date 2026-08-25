function decimals(value) {
  const text = String(value)
  return text.includes('.') ? text.length - text.indexOf('.') - 1 : 0
}

export function normalizeNumber(value, options = {}) {
  if (value === '' || value === null || value === undefined) return null
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return undefined
  const minimum = Number.isFinite(options.min) ? options.min : -Infinity
  const maximum = Number.isFinite(options.max) ? options.max : Infinity
  const clamped = Math.min(maximum, Math.max(minimum, numeric))
  const precision = Number.isInteger(options.precision)
    ? Math.min(20, Math.max(0, options.precision))
    : decimals(options.step ?? 1)
  return Number(clamped.toFixed(precision))
}

export function stepNumber(value, direction, options = {}) {
  const step = Number.isFinite(options.step) && options.step > 0 ? options.step : 1
  const base = normalizeNumber(value, options)
  const start = base === null || base === undefined ? 0 : base
  return normalizeNumber(start + step * direction, { ...options, step })
}
