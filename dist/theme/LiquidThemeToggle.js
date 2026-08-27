const LiquidThemeToggle = { name: "LiquidThemeToggle", props: { mode: { type: String, default: "" }, label: { type: String, default: "Toggle color mode" } }, computed: { currentMode() {
  var _a;
  return this.mode || ((_a = this.$liquidUI) == null ? void 0 : _a.theme.getState().mode) || "system";
} }, methods: { toggle() {
  var _a, _b;
  const next = ((_a = this.$liquidUI) == null ? void 0 : _a.theme.getState().resolvedMode) === "dark" ? "light" : "dark";
  (_b = this.$liquidUI) == null ? void 0 : _b.theme.setMode(next);
  this.$emit("change", next);
} }, render(h) {
  return h("button", { class: "liquid-theme-toggle", attrs: { type: "button", "aria-label": this.label }, on: { click: this.toggle } }, this.currentMode === "dark" ? "☀" : "☾");
} };
export {
  LiquidThemeToggle
};
