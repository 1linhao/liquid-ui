import { LiquidSpinner } from "../primitives/LiquidSpinner.js";
const LiquidLoading = {
  name: "LiquidLoading",
  props: { value: Boolean, label: { type: String, default: "Loading" }, backdrop: { type: Boolean, default: true } },
  mounted() {
    var _a, _b;
    this.portalTarget = (_a = this.$el.ownerDocument) == null ? void 0 : _a.body;
    (_b = this.portalTarget) == null ? void 0 : _b.appendChild(this.$el);
  },
  beforeDestroy() {
    var _a;
    if (((_a = this.$el) == null ? void 0 : _a.parentNode) === this.portalTarget) this.portalTarget.removeChild(this.$el);
  },
  render(h) {
    return h("div", { class: ["liquid-loading", { "has-backdrop": this.backdrop }], attrs: { hidden: !this.value, "aria-hidden": String(!this.value) } }, [h("div", { class: "liquid-loading__content" }, [h(LiquidSpinner, { props: { label: this.label, size: 28 } }), h("span", this.label)])]);
  }
};
export {
  LiquidLoading
};
