import { normalizeNumber, stepNumber } from './number.js'

export const LiquidNumberInput = {
  name: 'LiquidNumberInput',
  inheritAttrs: false,
  props: {
    value: { type: [Number, String], default: null },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
    step: { type: Number, default: 1 },
    precision: { type: Number, default: undefined },
    disabled: Boolean,
    readonly: Boolean,
    invalid: Boolean
  },
  data() {
    return { draft: this.value === null || this.value === undefined ? '' : String(this.value) }
  },
  watch: {
    value(nextValue) {
      this.draft = nextValue === null || nextValue === undefined ? '' : String(nextValue)
    }
  },
  computed: {
    numberOptions() {
      return { min: this.min, max: this.max, step: this.step, precision: this.precision }
    }
  },
  methods: {
    updateDraft(event) {
      this.draft = event.target.value
    },
    commit() {
      const rejectedDraft = this.draft
      const nextValue = normalizeNumber(this.draft, this.numberOptions)
      if (nextValue === undefined) {
        this.draft = this.value === null || this.value === undefined ? '' : String(this.value)
        this.$emit('invalid', rejectedDraft)
        return
      }
      this.draft = nextValue === null ? '' : String(nextValue)
      this.$emit('input', nextValue)
      this.$emit('change', nextValue)
    },
    increment(direction) {
      if (this.disabled || this.readonly) return
      const nextValue = stepNumber(this.value, direction, this.numberOptions)
      this.draft = String(nextValue)
      this.$emit('input', nextValue)
      this.$emit('change', nextValue)
    },
    onKeydown(event) {
      if (event.key === 'Enter') {
        this.commit()
        return
      }
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
      event.preventDefault()
      this.increment(event.key === 'ArrowUp' ? 1 : -1)
    }
  },
  render(h) {
    const button = (label, direction) => h('button', {
      class: 'liquid-number-input__step',
      attrs: { type: 'button', disabled: this.disabled || this.readonly, 'aria-label': label },
      on: { click: () => this.increment(direction) }
    }, direction > 0 ? '+' : '−')
    return h('div', {
      class: ['liquid-number-input', { 'is-disabled': this.disabled, 'is-invalid': this.invalid }]
    }, [
      h('input', {
        class: 'liquid-number-input__control',
        attrs: {
          ...this.$attrs,
          type: 'text',
          inputmode: 'decimal',
          disabled: this.disabled,
          readonly: this.readonly,
          'aria-invalid': String(this.invalid)
        },
        domProps: { value: this.draft },
        on: { input: this.updateDraft, blur: this.commit, keydown: this.onKeydown }
      }),
      h('span', { class: 'liquid-number-input__steps' }, [button('Increase value', 1), button('Decrease value', -1)])
    ])
  }
}
