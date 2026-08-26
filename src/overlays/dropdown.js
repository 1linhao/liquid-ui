export function normalizeMenuItems(items = []) {
  if (!Array.isArray(items)) throw new TypeError('LiquidDropdown items must be an array')
  const keys = new Set()
  return items.map((item, index) => {
    if (!item || item.key === undefined || item.key === null) throw new TypeError(`LiquidDropdown item ${index} requires a key`)
    if (keys.has(item.key)) throw new TypeError(`LiquidDropdown item keys must be unique: ${String(item.key)}`)
    keys.add(item.key)
    return Object.freeze({ key: item.key, label: String(item.label ?? item.key), disabled: Boolean(item.disabled), tone: item.tone ?? 'neutral' })
  })
}

export function nextMenuIndex(items, current, direction) {
  if (!items.length) return -1
  for (let step = 1; step <= items.length; step += 1) {
    const index = (current + direction * step + items.length) % items.length
    if (!items[index].disabled) return index
  }
  return -1
}
