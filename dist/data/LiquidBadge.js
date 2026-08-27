const LiquidBadge = { name: "LiquidBadge", props: { value: { type: [String, Number], default: "" }, tone: { type: String, default: "danger" }, max: { type: Number, default: 99 }, dot: Boolean, hidden: Boolean }, computed: { displayValue() {
  return typeof this.value === "number" && this.value > this.max ? `${this.max}+` : String(this.value);
} }, render(h) {
  return h("span", { class: "liquid-badge" }, [this.$slots.default, !this.hidden && (this.dot || this.displayValue) ? h("span", { class: ["liquid-badge__mark", `liquid-badge__mark--${this.tone}`, { "is-dot": this.dot }], attrs: { "aria-label": this.dot ? "New" : this.displayValue } }, this.dot ? "" : this.displayValue) : null]);
} };
export {
  LiquidBadge
};
