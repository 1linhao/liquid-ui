import { bindGlassSurface } from "./surface.js";
const LiquidGlassSurface = {
  name: "LiquidGlassSurface",
  inheritAttrs: false,
  props: {
    surface: { type: String, default: "panel" },
    material: { type: String, default: "auto" },
    elevated: { type: Boolean, default: false },
    descriptor: { type: Object, default: () => ({}) }
  },
  mounted() {
    this.mountSurface();
    this.releaseQuality = this.$liquidUI.material.subscribe(() => this.mountSurface());
  },
  beforeDestroy() {
    var _a, _b;
    (_a = this.releaseSurface) == null ? void 0 : _a.call(this);
    (_b = this.releaseQuality) == null ? void 0 : _b.call(this);
  },
  methods: {
    mountSurface() {
      var _a, _b;
      const materialController = (_a = this.$liquidUI) == null ? void 0 : _a.material;
      if (!materialController) throw new Error("LiquidGlassSurface requires Vue.use(createLiquidUI())");
      (_b = this.releaseSurface) == null ? void 0 : _b.call(this);
      this.releaseSurface = bindGlassSurface(this.$refs.surface, {
        ...this.descriptor,
        surface: this.surface,
        material: this.material
      }, materialController);
    }
  },
  render(h) {
    return h("div", {
      ref: "surface",
      class: ["liqui-glass", { "liqui-glass--elevated": this.elevated }],
      attrs: this.$attrs,
      on: this.$listeners
    }, [
      h("span", { class: "liqui-glass__backdrop", attrs: { "data-liquid-layer": "backdrop", "aria-hidden": "true" } }),
      h("span", { class: "liqui-glass__refract", attrs: { "data-liquid-layer": "refract", "aria-hidden": "true" } }),
      h("span", { class: "liqui-glass__tint", attrs: { "data-liquid-layer": "tint", "aria-hidden": "true" } }),
      h("span", { class: "liqui-glass__specular", attrs: { "data-liquid-layer": "specular", "aria-hidden": "true" } }),
      h("span", { class: "liqui-glass__shine", attrs: { "aria-hidden": "true" } }),
      h("div", { class: "liqui-glass__content" }, this.$slots.default)
    ]);
  }
};
export {
  LiquidGlassSurface
};
