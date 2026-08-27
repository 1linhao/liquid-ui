function normalizeColumns(columns = []) {
  if (!Array.isArray(columns)) throw new TypeError("LiquidTable columns must be an array");
  const keys = /* @__PURE__ */ new Set();
  return columns.map((column, index) => {
    var _a;
    if (!column || !column.key) throw new TypeError(`LiquidTable column ${index} requires a key`);
    if (keys.has(column.key)) throw new TypeError(`LiquidTable column keys must be unique: ${column.key}`);
    keys.add(column.key);
    return Object.freeze({
      key: String(column.key),
      label: String((_a = column.label) != null ? _a : column.key),
      width: column.width,
      minWidth: column.minWidth,
      align: ["left", "center", "right"].includes(column.align) ? column.align : "left",
      sortable: Boolean(column.sortable),
      format: typeof column.format === "function" ? column.format : null,
      type: column.type || "",
      slot: typeof column.slot === "function" ? column.slot : null
    });
  });
}
function nextSort(current, key) {
  if (!current || current.key !== key) return Object.freeze({ key, direction: "ascending" });
  if (current.direction === "ascending") return Object.freeze({ key, direction: "descending" });
  return Object.freeze({ key: "", direction: "none" });
}
function stableSortRows(rows, sort) {
  if (!(sort == null ? void 0 : sort.key) || !["ascending", "descending"].includes(sort.direction)) return rows;
  const direction = sort.direction === "ascending" ? 1 : -1;
  return rows.map((row, index) => ({ row, index })).sort((left, right) => {
    var _a, _b;
    const a = (_a = left.row) == null ? void 0 : _a[sort.key];
    const b = (_b = right.row) == null ? void 0 : _b[sort.key];
    if (Object.is(a, b)) return left.index - right.index;
    if (a === null || a === void 0) return 1;
    if (b === null || b === void 0) return -1;
    const result = typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b));
    return result * direction || left.index - right.index;
  }).map(({ row }) => row);
}
export {
  nextSort,
  normalizeColumns,
  stableSortRows
};
