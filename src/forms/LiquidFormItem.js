export const LiquidFormItem = {
  name: 'LiquidFormItem',
  inject: { liquidForm: { default: null } },
  props: {
    field: { type: String, default: '' },
    prop: { type: String, default: '' },
    label: { type: String, default: '' },
    help: { type: String, default: '' },
    error: { type: String, default: '' },
    required: Boolean
  },
  data: () => ({ formErrors: [] }),
  computed: {
    fieldName() { return this.field || this.prop }
  },
  mounted() {
    this.releaseForm = this.liquidForm?.controller.subscribe(({ errors }) => {
      this.formErrors = this.fieldName ? errors[this.fieldName] ?? [] : []
    })
  },
  beforeDestroy() { this.releaseForm?.() },
  methods: {
    validate() { return this.fieldName ? this.liquidForm?.validateField(this.fieldName) : Promise.resolve([]) }
  },
  render(h) {
    const message = this.error || this.formErrors[0]
    return h('div', {
      class: ['liquid-form-item', { 'is-invalid': Boolean(message), 'is-required': this.required }],
      on: { focusout: this.validate }
    }, [
      this.label ? h('label', { class: 'liquid-form-item__label', style: { width: this.liquidForm?.labelWidth || undefined } }, [this.label, this.required ? h('span', { attrs: { 'aria-hidden': 'true' } }, ' *') : null]) : null,
      h('div', { class: 'liquid-form-item__control' }, this.$slots.default),
      message
        ? h('p', { class: 'liquid-form-item__message', attrs: { role: 'alert' } }, message)
        : this.help ? h('p', { class: 'liquid-form-item__help' }, this.help) : null
    ])
  }
}
