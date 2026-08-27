const LiquidRow = { name: "LiquidRow", props: { gap: { type: [Number, String], default: 16 }, align: { type: String, default: "stretch" }, justify: { type: String, default: "start" } }, render(h) {
  const gap = typeof this.gap === "number" ? `${this.gap}px` : this.gap;
  return h("div", { class: "liquid-row", style: { gap, alignItems: this.align, justifyContent: this.justify } }, this.$slots.default);
} };
export {
  LiquidRow
};
