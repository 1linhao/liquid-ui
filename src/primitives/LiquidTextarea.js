export const LiquidTextarea = {
  name: 'LiquidTextarea', inheritAttrs: false,
  props: { value: { type: [String, Number], default: '' }, disabled: Boolean, readonly: Boolean, invalid: Boolean, rows: { type: Number, default: 3 }, resize: { type: String, default: 'vertical' } },
  methods: { focus() { this.$refs.textarea?.focus() } },
  render(h) { return h('textarea', { ref: 'textarea', class: ['liquid-textarea', { 'is-invalid': this.invalid }], style: { resize: this.resize }, attrs: { ...this.$attrs, rows: this.rows, disabled: this.disabled, readonly: this.readonly, 'aria-invalid': String(this.invalid) }, domProps: { value: this.value ?? '' }, on: { input: (event) => this.$emit('input', event.target.value), change: (event) => this.$emit('change', event.target.value), focus: (event) => this.$emit('focus', event), blur: (event) => this.$emit('blur', event) } }) }
}
