const TONES = new Set(['neutral', 'accent', 'success', 'warning', 'danger', 'info'])

export const LiquidTag = {
  name: 'LiquidTag',
  inheritAttrs: false,
  props: {
    tone: {
      type: String,
      default: 'neutral',
      validator: (value) => TONES.has(value)
    },
    type: { type: String, default: '', validator: (value) => !value || TONES.has(value) },
    closable: Boolean,
    disabled: Boolean
  },
  methods: {
    close(event) {
      if (!this.disabled) this.$emit('close', event)
    }
  },
  render(h) {
    const tone = this.type || this.tone
    return h('span', {
      class: ['liquid-tag', `liquid-tag--${tone}`, { 'is-disabled': this.disabled }],
      attrs: this.$attrs
    }, [
      h('span', { class: 'liquid-tag__label' }, this.$slots.default),
      this.closable ? h('button', {
        class: 'liquid-tag__close',
        attrs: { type: 'button', disabled: this.disabled, 'aria-label': 'Remove tag' },
        on: { click: this.close }
      }, '×') : null
    ])
  }
}
