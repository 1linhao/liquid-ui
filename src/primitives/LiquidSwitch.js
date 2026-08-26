export const LiquidSwitch = {
  name: 'LiquidSwitch',
  inheritAttrs: false,
  props: {
    value: { type: [Boolean, Number, String], default: false },
    activeValue: { type: [Boolean, Number, String], default: true },
    inactiveValue: { type: [Boolean, Number, String], default: false },
    activeText: { type: String, default: '' },
    inactiveText: { type: String, default: '' },
    disabled: Boolean,
    label: { type: String, default: '' }
  },
  computed: {
    checked() { return Object.is(this.value, this.activeValue) },
    stateText() { return this.checked ? this.activeText : this.inactiveText }
  },
  methods: {
    toggle(event) {
      if (this.disabled) return
      const value = this.checked ? this.inactiveValue : this.activeValue
      this.$emit('input', value)
      this.$emit('change', value, event)
    }
  },
  render(h) {
    const label = this.$slots.default ?? (this.stateText ? [this.stateText] : null)
    return h('button', {
      class: ['liquid-switch', { 'is-checked': this.checked }],
      attrs: {
        ...this.$attrs,
        type: 'button',
        role: 'switch',
        disabled: this.disabled,
        'aria-checked': String(this.checked),
        'aria-label': this.label || this.$attrs['aria-label']
      },
      on: { click: this.toggle }
    }, [
      h('span', { class: 'liquid-switch__thumb', attrs: { 'aria-hidden': 'true' } }),
      label ? h('span', { class: 'liquid-switch__label' }, label) : null
    ])
  }
}
