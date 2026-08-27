const LiquidButton = {
  name: "LiquidButton",
  inheritAttrs: false,
  props: {
    disabled: Boolean,
    loading: Boolean,
    icon: { type: String, default: "" },
    tone: { type: String, default: "neutral" },
    size: { type: String, default: "medium" },
    type: { type: String, default: "button" }
  },
  methods: {
    activate(event) {
      if (this.disabled || this.loading) return;
      this.$emit("click", event);
    }
  },
  render(h) {
    return h("button", {
      class: ["liquid-button", `liquid-button--${this.tone}`, `liquid-button--${this.size}`],
      attrs: { ...this.$attrs, type: this.type, disabled: this.disabled || this.loading, "aria-busy": String(this.loading) },
      on: { click: this.activate }
    }, [
      this.loading ? h("span", { class: "liquid-spinner", attrs: { "aria-hidden": "true" } }) : null,
      !this.loading && this.icon ? h("span", { class: ["liquid-button__icon", this.icon], attrs: { "aria-hidden": "true" } }) : null,
      h("span", { class: "liquid-button__label" }, this.$slots.default)
    ]);
  }
};
export {
  LiquidButton
};
