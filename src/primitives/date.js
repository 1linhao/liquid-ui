const ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

function fromUTCDate(date) {
  return Object.freeze({ year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() })
}

export function parseISODate(value) {
  if (typeof value !== 'string') return null
  const match = value.match(ISO_PATTERN)
  if (!match) return null
  const parts = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) }
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day))
  if (date.getUTCFullYear() !== parts.year || date.getUTCMonth() + 1 !== parts.month || date.getUTCDate() !== parts.day) return null
  return Object.freeze(parts)
}

export function toISODate(parts) {
  if (!parts) return ''
  return `${String(parts.year).padStart(4, '0')}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`
}

export function dateToParts(date = new Date()) {
  return Object.freeze({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() })
}

export function toUTCDate(parts) {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day))
}

export function addDays(parts, amount) {
  const date = toUTCDate(parts)
  date.setUTCDate(date.getUTCDate() + amount)
  return fromUTCDate(date)
}

export function addMonths(parts, amount) {
  const target = new Date(Date.UTC(parts.year, parts.month - 1 + amount, 1))
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate()
  target.setUTCDate(Math.min(parts.day, lastDay))
  return fromUTCDate(target)
}

export function compareDates(left, right) {
  return toISODate(left).localeCompare(toISODate(right))
}

export function isDateUnavailable(parts, options = {}) {
  const min = parseISODate(options.min)
  const max = parseISODate(options.max)
  if (min && compareDates(parts, min) < 0) return true
  if (max && compareDates(parts, max) > 0) return true
  return Boolean(options.disabledDate?.(toISODate(parts)))
}

export function calendarMonth(view, options = {}) {
  const weekStartsOn = Number.isInteger(options.weekStartsOn) && options.weekStartsOn >= 0 && options.weekStartsOn <= 6 ? options.weekStartsOn : 1
  const first = Object.freeze({ year: view.year, month: view.month, day: 1 })
  const weekday = toUTCDate(first).getUTCDay()
  const offset = (weekday - weekStartsOn + 7) % 7
  const start = addDays(first, -offset)
  const today = parseISODate(options.today) ?? dateToParts(options.now?.() ?? new Date())
  const selected = parseISODate(options.value)
  return Object.freeze(Array.from({ length: 42 }, (_, index) => {
    const date = addDays(start, index)
    return Object.freeze({
      date,
      value: toISODate(date),
      outside: date.month !== view.month,
      today: compareDates(date, today) === 0,
      selected: selected ? compareDates(date, selected) === 0 : false,
      disabled: isDateUnavailable(date, options)
    })
  }))
}

export function formatDateLabel(parts, locale, options = { year: 'numeric', month: 'long', day: 'numeric' }) {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(toUTCDate(parts))
}
