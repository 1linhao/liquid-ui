const LiquidSegmented = {
  name: "LiquidSegmented",
  inheritAttrs: false,
  props: { value: { default: null }, options: { type: Array, required: true }, disabled: Boolean, label: { type: String, default: "Options" } },
  methods: {
    select(option, event) {
      if (this.disabled || option.disabled || option.value === this.value) return;
      this.$emit("input", option.value);
      this.$emit("change", option.value, event);
    },
    move(index, step, event) {
      const enabled = this.options.map((option, optionIndex) => ({ ...option, optionIndex })).filter((option) => !option.disabled);
      const current = enabled.findIndex((option) => option.optionIndex === index);
      const next = enabled[(current + step + enabled.length) % enabled.length];
      if (next) {
        this.select(next, event);
        this.$nextTick(() => {
          var _a, _b;
          return (_b = (_a = this.$refs[`option-${next.optionIndex}`]) == null ? void 0 : _a[0]) == null ? void 0 : _b.focus();
        });
      }
    }
  },
  render(h) {
    return h("div", { class: ["liquid-segmented", { "is-disabled": this.disabled }], attrs: { ...this.$attrs, role: "radiogroup", "aria-label": this.label } }, this.options.map((option, index) => {
      var _a;
      return h("button", { ref: `option-${index}`, refInFor: true, key: String(option.value), class: ["liquid-segmented__option", { "is-selected": option.value === this.value }], attrs: { type: "button", role: "radio", "aria-checked": String(option.value === this.value), disabled: this.disabled || option.disabled, tabindex: option.value === this.value ? "0" : "-1" }, on: { click: (event) => this.select(option, event), keydown: (event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          this.move(index, 1, event);
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          this.move(index, -1, event);
        }
      } } }, (_a = option.label) != null ? _a : String(option.value));
    }));
  }
};
export {
  LiquidSegmented
};
