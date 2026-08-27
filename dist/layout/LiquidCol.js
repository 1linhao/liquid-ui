const LiquidCol = { name: "LiquidCol", props: { span: { type: Number, default: 12 }, minWidth: { type: [Number, String], default: 0 } }, render(h) {
  const minWidth = typeof this.minWidth === "number" ? `${this.minWidth}px` : this.minWidth;
  return h("div", { class: "liquid-col", style: { "--liquid-col-span": String(Math.min(12, Math.max(1, this.span))), minWidth } }, this.$slots.default);
} };
export {
  LiquidCol
};
