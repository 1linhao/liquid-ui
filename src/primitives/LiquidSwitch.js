export const LiquidSwitch = {
  name: 'LiquidSwitch',
  inheritAttrs: false,
  props: {
    value: Boolean,
    disabled: Boolean,
    label: { type: String, default: '' }
  },
  methods: {
    toggle(event) {
      if (this.disabled) return
      this.$emit('input', !this.value)
      this.$emit('change', !this.value, event)
    }
  },
  render(h) {
    return h('button', {
      class: ['liquid-switch', { 'is-checked': this.value }],
      attrs: {
        ...this.$attrs,
        type: 'button',
        role: 'switch',
        disabled: this.disabled,
        'aria-checked': String(this.value),
        'aria-label': this.label || this.$attrs['aria-label']
      },
      on: { click: this.toggle }
    }, [
      h('span', { class: 'liquid-switch__thumb', attrs: { 'aria-hidden': 'true' } }),
      this.$slots.default ? h('span', { class: 'liquid-switch__label' }, this.$slots.default) : null
    ])
  }
}
