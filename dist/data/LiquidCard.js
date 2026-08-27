import { LiquidGlassSurface } from "../material/LiquidGlassSurface.js";
const LiquidCard = { name: "LiquidCard", inheritAttrs: false, props: { title: { type: String, default: "" }, surface: { type: String, default: "panel" }, elevated: Boolean }, render(h) {
  var _a;
  return h(LiquidGlassSurface, { class: "liquid-card", attrs: this.$attrs, props: { surface: this.surface, elevated: this.elevated } }, [this.title || this.$slots.header ? h("header", { class: "liquid-card__header" }, (_a = this.$slots.header) != null ? _a : [h("h3", this.title)]) : null, h("div", { class: "liquid-card__body" }, this.$slots.default), this.$slots.footer ? h("footer", { class: "liquid-card__footer" }, this.$slots.footer) : null]);
} };
export {
  LiquidCard
};
