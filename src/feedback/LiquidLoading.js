import { LiquidSpinner } from '../primitives/LiquidSpinner.js'
export const LiquidLoading = {
  name: 'LiquidLoading', props: { value: Boolean, label: { type: String, default: 'Loading' }, backdrop: { type: Boolean, default: true } },
  mounted() { this.portalTarget = this.$el.ownerDocument?.body; this.portalTarget?.appendChild(this.$el) },
  beforeDestroy() { if (this.$el?.parentNode === this.portalTarget) this.portalTarget.removeChild(this.$el) },
  render(h) { return h('div', { class: ['liquid-loading', { 'has-backdrop': this.backdrop }], attrs: { hidden: !this.value, 'aria-hidden': String(!this.value) } }, [h('div', { class: 'liquid-loading__content' }, [h(LiquidSpinner, { props: { label: this.label, size: 28 } }), h('span', this.label)])]) }
}
