function normalizeMenuItems(items = []) {
  if (!Array.isArray(items)) throw new TypeError("LiquidDropdown items must be an array");
  const keys = /* @__PURE__ */ new Set();
  return items.map((item, index) => {
    var _a, _b;
    if (!item || item.key === void 0 || item.key === null) throw new TypeError(`LiquidDropdown item ${index} requires a key`);
    if (keys.has(item.key)) throw new TypeError(`LiquidDropdown item keys must be unique: ${String(item.key)}`);
    keys.add(item.key);
    return Object.freeze({ key: item.key, label: String((_a = item.label) != null ? _a : item.key), disabled: Boolean(item.disabled), tone: (_b = item.tone) != null ? _b : "neutral" });
  });
}
function nextMenuIndex(items, current, direction) {
  if (!items.length) return -1;
  for (let step = 1; step <= items.length; step += 1) {
    const index = (current + direction * step + items.length) % items.length;
    if (!items[index].disabled) return index;
  }
  return -1;
}
export {
  nextMenuIndex,
  normalizeMenuItems
};
