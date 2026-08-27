import { LiquidButton } from "./LiquidButton.js";
const LiquidIconButton = { name: "LiquidIconButton", inheritAttrs: false, props: { label: { type: String, required: true }, disabled: Boolean, loading: Boolean, tone: { type: String, default: "neutral" }, size: { type: String, default: "medium" } }, render(h) {
  return h(LiquidButton, { class: "liquid-icon-button", attrs: { ...this.$attrs, "aria-label": this.label }, props: { disabled: this.disabled, loading: this.loading, tone: this.tone, size: this.size }, on: { click: (event) => this.$emit("click", event) } }, this.$slots.default);
} };
export {
  LiquidIconButton
};
