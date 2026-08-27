const LiquidPalettePicker = { name: "LiquidPalettePicker", props: { value: { type: String, default: "" }, palettes: { type: Array, default: () => ["blue", "violet", "emerald", "amber"] }, label: { type: String, default: "Color palette" } }, computed: { current() {
  var _a;
  return this.value || ((_a = this.$liquidUI) == null ? void 0 : _a.theme.getState().palette) || "blue";
} }, methods: { select(palette) {
  var _a;
  (_a = this.$liquidUI) == null ? void 0 : _a.theme.setPalette(palette);
  this.$emit("input", palette);
  this.$emit("change", palette);
} }, render(h) {
  return h("div", { class: "liquid-palette-picker", attrs: { role: "radiogroup", "aria-label": this.label } }, this.palettes.map((palette) => h("button", { key: palette, class: `liquid-palette-picker__${palette}`, attrs: { type: "button", role: "radio", "aria-label": palette, "aria-checked": String(palette === this.current) }, on: { click: () => this.select(palette) } })));
} };
export {
  LiquidPalettePicker
};
