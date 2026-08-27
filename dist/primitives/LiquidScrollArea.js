const LiquidScrollArea = { name: "LiquidScrollArea", inheritAttrs: false, props: { maxHeight: { type: [Number, String], default: "" } }, render(h) {
  const maxHeight = typeof this.maxHeight === "number" ? `${this.maxHeight}px` : this.maxHeight;
  return h("div", { class: "liquid-scroll-area", style: { maxHeight }, attrs: this.$attrs, on: { scroll: (event) => this.$emit("scroll", event) } }, this.$slots.default);
} };
export {
  LiquidScrollArea
};
