import { LiquidGlassSurface } from "../material/LiquidGlassSurface.js";
import { createModalLayer } from "./modal.js";
const LiquidDialog = {
  name: "LiquidDialog",
  inheritAttrs: false,
  props: {
    value: Boolean,
    visible: { type: Boolean, default: void 0 },
    title: { type: [String, Number], default: "" },
    width: { type: [String, Number], default: "" },
    customClass: { type: String, default: "" },
    showClose: { type: Boolean, default: true },
    closeOnClickModal: { type: Boolean, default: void 0 },
    closeLabel: { type: String, default: "Close dialog" },
    closeOnBackdrop: { type: Boolean, default: true },
    closeOnEscape: { type: Boolean, default: true }
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.syncLayer();
      }
    },
    visible: { immediate: true, handler() {
      this.syncLayer();
    } }
  },
  mounted() {
    this.layer = createModalLayer({
      dialog: this.$refs.dialog,
      closeOnBackdrop: this.closeOnClickModal === void 0 ? this.closeOnBackdrop : this.closeOnClickModal,
      closeOnEscape: this.closeOnEscape,
      initialFocus: () => this.$refs.dialog.querySelector("[autofocus]"),
      onDismiss: (reason) => {
        this.$emit("input", false);
        this.$emit("update:visible", false);
        this.$emit("close", reason);
      }
    });
    if (this.isOpen) this.layer.open();
  },
  beforeDestroy() {
    var _a;
    (_a = this.layer) == null ? void 0 : _a.destroy();
  },
  computed: {
    isOpen() {
      return this.visible === void 0 ? this.value : this.visible;
    }
  },
  methods: {
    syncLayer() {
      this.$nextTick(() => {
        var _a, _b;
        return this.isOpen ? (_a = this.layer) == null ? void 0 : _a.open() : (_b = this.layer) == null ? void 0 : _b.close({ reason: "model" });
      });
    },
    requestClose(reason = "close-button") {
      var _a;
      (_a = this.layer) == null ? void 0 : _a.close({ reason });
    }
  },
  render(h) {
    const titleId = `${this._uid}-liquid-dialog-title`;
    return h("dialog", {
      ref: "dialog",
      class: ["liquid-dialog", this.customClass],
      style: { width: this.width ? typeof this.width === "number" ? `${this.width}px` : this.width : void 0 },
      attrs: { ...this.$attrs, hidden: !this.isOpen, "aria-modal": "true", "aria-labelledby": this.title ? titleId : void 0, "aria-label": this.title ? void 0 : this.$attrs["aria-label"], tabindex: "-1" }
    }, [h(LiquidGlassSurface, { class: "liquid-dialog__surface", props: { surface: "overlay", elevated: true } }, [
      h("header", { class: "liquid-dialog__header" }, [
        this.title ? h("h2", { attrs: { id: titleId } }, this.title) : h("div", this.$slots.title),
        this.showClose ? h("button", { class: "liquid-dialog__close", attrs: { type: "button", "aria-label": this.closeLabel }, on: { click: () => this.requestClose() } }, "×") : null
      ]),
      h("div", { class: "liquid-dialog__body" }, this.$slots.default),
      this.$slots.footer ? h("footer", { class: "liquid-dialog__footer" }, this.$slots.footer) : null
    ])]);
  }
};
export {
  LiquidDialog
};
