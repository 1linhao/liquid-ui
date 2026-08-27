function normalizeOptions(options = []) {
  if (!Array.isArray(options)) throw new TypeError("LiquidSelect options must be an array");
  const seen = /* @__PURE__ */ new Set();
  return options.map((option, index) => {
    var _a;
    if (!option || !Object.hasOwn(option, "value")) throw new TypeError(`LiquidSelect option ${index} requires a value`);
    if (seen.has(option.value)) throw new TypeError(`LiquidSelect option values must be unique: ${String(option.value)}`);
    seen.add(option.value);
    return Object.freeze({ value: option.value, label: String((_a = option.label) != null ? _a : option.value), disabled: Boolean(option.disabled) });
  });
}
function filterOptions(options, query) {
  const needle = String(query != null ? query : "").trim().toLocaleLowerCase();
  if (!needle) return options;
  return options.filter(({ label }) => label.toLocaleLowerCase().includes(needle));
}
function nextEnabledIndex(options, current, direction) {
  if (!options.length) return -1;
  for (let step = 1; step <= options.length; step += 1) {
    const index = (current + direction * step + options.length) % options.length;
    if (!options[index].disabled) return index;
  }
  return -1;
}
function toggleSelection(value, optionValue, multiple) {
  if (!multiple) return optionValue;
  const values = Array.isArray(value) ? [...value] : [];
  const index = values.findIndex((item) => Object.is(item, optionValue));
  if (index >= 0) values.splice(index, 1);
  else values.push(optionValue);
  return values;
}
export {
  filterOptions,
  nextEnabledIndex,
  normalizeOptions,
  toggleSelection
};
