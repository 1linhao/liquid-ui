import { LiquidGlassSurface } from '../material/LiquidGlassSurface.js'
import { createAnchoredOverlay } from './anchored.js'

export const LiquidTooltip = {
  name: 'LiquidTooltip',
  inheritAttrs: false,
  props: { content: { type: String, required: true }, label: { type: String, default: 'More information' }, disabled: Boolean, delay: { type: Number, default: 250 } },
  data: () => ({ open: false }),
  mounted() { this.layer = createAnchoredOverlay({ anchor: this.$refs.trigger, panel: this.$refs.tooltip, matchWidth: false, gutter: 8, onDismiss: () => { this.open = false } }) },
  beforeDestroy() { clearTimeout(this.timer); this.layer?.destroy() },
  methods: {
    show() { clearTimeout(this.timer); if (!this.disabled) this.timer = setTimeout(() => { this.open = true; this.$nextTick(() => this.layer.open()) }, Math.max(0, this.delay)) },
    hide() { clearTimeout(this.timer); this.layer?.close({ restoreFocus: false, reason: 'hide' }); this.open = false }
  },
  render(h) {
    const id = `${this._uid}-liquid-tooltip`
    return h('span', { class: 'liquid-tooltip' }, [
      h('button', { ref: 'trigger', class: 'liquid-tooltip__trigger', attrs: { ...this.$attrs, type: 'button', disabled: this.disabled, 'aria-describedby': this.open ? id : undefined }, on: { mouseenter: this.show, mouseleave: this.hide, focus: this.show, blur: this.hide } }, this.$slots.default ?? this.label),
      h('div', { ref: 'tooltip', class: 'liquid-tooltip__panel', attrs: { id, role: 'tooltip', popover: 'manual', hidden: !this.open } }, [h(LiquidGlassSurface, { class: 'liquid-tooltip__surface', props: { surface: 'overlay', elevated: true } }, this.content)])
    ])
  }
}
