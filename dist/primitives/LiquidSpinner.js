const LiquidSpinner = { name: "LiquidSpinner", props: { label: { type: String, default: "Loading" }, size: { type: [Number, String], default: 20 } }, render(h) {
  const size = typeof this.size === "number" ? `${this.size}px` : this.size;
  return h("span", { class: "liquid-spinner-wrap", style: { "--liquid-spinner-size": size }, attrs: { role: "status", "aria-label": this.label } }, [h("span", { class: "liquid-spinner", attrs: { "aria-hidden": "true" } })]);
} };
export {
  LiquidSpinner
};
