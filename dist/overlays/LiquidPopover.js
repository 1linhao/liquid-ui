import { LiquidGlassSurface } from "../material/LiquidGlassSurface.js";
import { createAnchoredOverlay } from "./anchored.js";
const LiquidPopover = {
  name: "LiquidPopover",
  inheritAttrs: false,
  props: {
    value: Boolean,
    label: { type: String, default: "Open popover" },
    panelLabel: { type: String, default: "Popover" },
    disabled: Boolean,
    matchWidth: Boolean
  },
  watch: { value: { immediate: true, handler(value) {
    this.$nextTick(() => {
      var _a, _b;
      return value ? (_a = this.layer) == null ? void 0 : _a.open() : (_b = this.layer) == null ? void 0 : _b.close({ reason: "model" });
    });
  } } },
  mounted() {
    this.layer = createAnchoredOverlay({
      anchor: this.$refs.trigger,
      panel: this.$refs.panel,
      matchWidth: this.matchWidth,
      onDismiss: (reason) => {
        this.$emit("input", false);
        this.$emit("close", reason);
      }
    });
    if (this.value) this.layer.open();
  },
  updated() {
    var _a;
    (_a = this.layer) == null ? void 0 : _a.updatePosition();
  },
  beforeDestroy() {
    var _a;
    (_a = this.layer) == null ? void 0 : _a.destroy();
  },
  methods: {
    toggle() {
      if (!this.disabled) this.$emit("input", !this.value);
    }
  },
  render(h) {
    var _a;
    const panelId = `${this._uid}-liquid-popover`;
    return h("span", { class: "liquid-popover" }, [
      h("button", { ref: "trigger", class: "liquid-popover__trigger", attrs: { ...this.$attrs, type: "button", disabled: this.disabled, "aria-expanded": String(this.value), "aria-controls": panelId, "aria-haspopup": "dialog" }, on: { click: this.toggle } }, (_a = this.$slots.trigger) != null ? _a : this.label),
      h("div", { ref: "panel", class: "liquid-popover__panel", attrs: { id: panelId, role: "dialog", "aria-label": this.panelLabel, popover: "manual", hidden: !this.value } }, [
        h(LiquidGlassSurface, { class: "liquid-popover__surface", props: { surface: "overlay", elevated: true } }, this.$slots.default)
      ])
    ]);
  }
};
export {
  LiquidPopover
};
