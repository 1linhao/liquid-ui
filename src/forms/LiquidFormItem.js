export const LiquidFormItem = {
  name: 'LiquidFormItem',
  inject: { liquidForm: { default: null } },
  props: {
    field: { type: String, default: '' },
    label: { type: String, default: '' },
    help: { type: String, default: '' },
    error: { type: String, default: '' },
    required: Boolean
  },
  data: () => ({ formErrors: [] }),
  mounted() {
    this.releaseForm = this.liquidForm?.controller.subscribe(({ errors }) => {
      this.formErrors = this.field ? errors[this.field] ?? [] : []
    })
  },
  beforeDestroy() { this.releaseForm?.() },
  methods: {
    validate() { return this.field ? this.liquidForm?.validateField(this.field) : Promise.resolve([]) }
  },
  render(h) {
    const message = this.error || this.formErrors[0]
    return h('div', {
      class: ['liquid-form-item', { 'is-invalid': Boolean(message), 'is-required': this.required }],
      on: { focusout: this.validate }
    }, [
      this.label ? h('label', { class: 'liquid-form-item__label' }, [this.label, this.required ? h('span', { attrs: { 'aria-hidden': 'true' } }, ' *') : null]) : null,
      h('div', { class: 'liquid-form-item__control' }, this.$slots.default),
      message
        ? h('p', { class: 'liquid-form-item__message', attrs: { role: 'alert' } }, message)
        : this.help ? h('p', { class: 'liquid-form-item__help' }, this.help) : null
    ])
  }
}
