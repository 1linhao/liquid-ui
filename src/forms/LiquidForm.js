import { createFormController } from './controller.js'

export const LiquidForm = {
  name: 'LiquidForm',
  props: {
    model: { type: Object, required: true },
    rules: { type: Object, default: () => ({}) },
    labelWidth: { type: [String, Number], default: '' },
    labelPosition: { type: String, default: 'right' },
    novalidate: { type: Boolean, default: true }
  },
  data() {
    return { controller: createFormController({ getValues: () => this.model, rules: this.rules }) }
  },
  provide() { return { liquidForm: this } },
  watch: { rules: { deep: true, handler(value) { this.controller.setRules(value) } } },
  beforeDestroy() { this.controller.destroy() },
  methods: {
    async validate(fields, callback) {
      if (typeof fields === 'function') { callback = fields; fields = undefined }
      const result = await this.controller.validate(fields)
      callback?.(result.valid, result)
      return result
    },
    validateField(field) { return this.controller.validateField(field) },
    clearValidate(fields) { return this.controller.clear(fields) },
    async submit(event) {
      event?.preventDefault?.()
      const result = await this.validate()
      this.$emit(result.valid ? 'submit' : 'invalid', result, event)
    },
    reset(event) {
      this.clearValidate()
      this.$emit('reset', event)
    }
  },
  render(h) {
    return h('form', {
      class: 'liquid-form',
      attrs: { novalidate: this.novalidate },
      on: { submit: this.submit, reset: this.reset }
    }, this.$slots.default)
  }
}
