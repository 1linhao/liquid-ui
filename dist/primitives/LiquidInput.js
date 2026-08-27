import { LiquidTextarea } from "./LiquidTextarea.js";
const LiquidInput = {
  name: "LiquidInput",
  inheritAttrs: false,
  props: {
    value: { type: [String, Number], default: "" },
    type: { type: String, default: "text" },
    disabled: Boolean,
    readonly: Boolean,
    invalid: Boolean,
    clearable: Boolean
  },
  methods: {
    onInput(event) {
      this.$emit("input", event.target.value);
    },
    onChange(event) {
      this.$emit("change", event.target.value);
    },
    clear(event) {
      if (this.disabled || this.readonly) return;
      this.$emit("input", "");
      this.$emit("clear", event);
      this.$nextTick(() => {
        var _a;
        return (_a = this.$refs.input) == null ? void 0 : _a.focus();
      });
    },
    focus() {
      var _a;
      (_a = this.$refs.input) == null ? void 0 : _a.focus();
    }
  },
  render(h) {
    var _a, _b;
    if (this.type === "textarea") {
      return h(LiquidTextarea, {
        attrs: this.$attrs,
        props: { value: this.value, disabled: this.disabled, readonly: this.readonly, invalid: this.invalid, rows: Number(this.$attrs.rows) || 3 },
        on: {
          input: (value) => this.$emit("input", value),
          change: (value, event) => this.$emit("change", value, event),
          focus: (event) => this.$emit("focus", event),
          blur: (event) => this.$emit("blur", event)
        }
      });
    }
    const hasValue = String((_a = this.value) != null ? _a : "").length > 0;
    return h("label", {
      class: ["liquid-input", { "is-disabled": this.disabled, "is-invalid": this.invalid }]
    }, [
      this.$slots.prefix ? h("span", { class: "liquid-input__prefix" }, this.$slots.prefix) : null,
      h("input", {
        ref: "input",
        class: "liquid-input__control",
        attrs: {
          ...this.$attrs,
          type: this.type,
          disabled: this.disabled,
          readonly: this.readonly,
          "aria-invalid": String(this.invalid)
        },
        domProps: { value: (_b = this.value) != null ? _b : "" },
        on: { input: this.onInput, change: this.onChange, focus: (event) => this.$emit("focus", event), blur: (event) => this.$emit("blur", event) }
      }),
      this.clearable && hasValue ? h("button", {
        class: "liquid-input__clear",
        attrs: { type: "button", disabled: this.disabled || this.readonly, "aria-label": "Clear input" },
        on: { click: this.clear }
      }, "×") : null,
      this.$slots.suffix ? h("span", { class: "liquid-input__suffix" }, this.$slots.suffix) : null
    ]);
  }
};
export {
  LiquidInput
};
