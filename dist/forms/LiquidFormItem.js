const LiquidFormItem = {
  name: "LiquidFormItem",
  inject: { liquidForm: { default: null } },
  props: {
    field: { type: String, default: "" },
    prop: { type: String, default: "" },
    label: { type: String, default: "" },
    help: { type: String, default: "" },
    error: { type: String, default: "" },
    required: Boolean
  },
  data: () => ({ formErrors: [] }),
  computed: {
    fieldName() {
      return this.field || this.prop;
    }
  },
  mounted() {
    var _a;
    this.releaseForm = (_a = this.liquidForm) == null ? void 0 : _a.controller.subscribe(({ errors }) => {
      var _a2;
      this.formErrors = this.fieldName ? (_a2 = errors[this.fieldName]) != null ? _a2 : [] : [];
    });
  },
  beforeDestroy() {
    var _a;
    (_a = this.releaseForm) == null ? void 0 : _a.call(this);
  },
  methods: {
    validate() {
      var _a;
      return this.fieldName ? (_a = this.liquidForm) == null ? void 0 : _a.validateField(this.fieldName) : Promise.resolve([]);
    }
  },
  render(h) {
    var _a;
    const message = this.error || this.formErrors[0];
    return h("div", {
      class: ["liquid-form-item", { "is-invalid": Boolean(message), "is-required": this.required }],
      on: { focusout: this.validate }
    }, [
      this.label ? h("label", { class: "liquid-form-item__label", style: { width: ((_a = this.liquidForm) == null ? void 0 : _a.labelWidth) || void 0 } }, [this.label, this.required ? h("span", { attrs: { "aria-hidden": "true" } }, " *") : null]) : null,
      h("div", { class: "liquid-form-item__control" }, this.$slots.default),
      message ? h("p", { class: "liquid-form-item__message", attrs: { role: "alert" } }, message) : this.help ? h("p", { class: "liquid-form-item__help" }, this.help) : null
    ]);
  }
};
export {
  LiquidFormItem
};
