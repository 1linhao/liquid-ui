import { LiquidGlassSurface } from '../material/LiquidGlassSurface.js'
import { createModalLayer } from './modal.js'
export const LiquidDrawer = {
  name: 'LiquidDrawer', inheritAttrs: false,
  props: { value: Boolean, title: { type: String, default: '' }, placement: { type: String, default: 'right' }, closeLabel: { type: String, default: 'Close drawer' }, closeOnBackdrop: { type: Boolean, default: true }, closeOnEscape: { type: Boolean, default: true } },
  watch: { value: { immediate: true, handler(value) { this.$nextTick(() => value ? this.layer?.open() : this.layer?.close({ reason: 'model' })) } } },
  mounted() { this.layer = createModalLayer({ dialog: this.$refs.drawer, closeOnBackdrop: this.closeOnBackdrop, closeOnEscape: this.closeOnEscape, initialFocus: () => this.$refs.drawer.querySelector('[autofocus]'), onDismiss: (reason) => { this.$emit('input', false); this.$emit('close', reason) } }); if (this.value) this.layer.open() },
  beforeDestroy() { this.layer?.destroy() },
  methods: { requestClose(reason = 'close-button') { this.layer?.close({ reason }) } },
  render(h) { const titleId = `${this._uid}-liquid-drawer-title`; return h('dialog', { ref: 'drawer', class: ['liquid-drawer', `liquid-drawer--${this.placement}`], attrs: { ...this.$attrs, hidden: !this.value, 'aria-modal': 'true', 'aria-labelledby': this.title ? titleId : undefined, 'aria-label': this.title ? undefined : this.$attrs['aria-label'], tabindex: '-1' } }, [h(LiquidGlassSurface, { class: 'liquid-drawer__surface', props: { surface: 'overlay', elevated: true } }, [h('header', { class: 'liquid-drawer__header' }, [this.title ? h('h2', { attrs: { id: titleId } }, this.title) : h('div', this.$slots.title), h('button', { attrs: { type: 'button', 'aria-label': this.closeLabel }, on: { click: () => this.requestClose() } }, '×')]), h('div', { class: 'liquid-drawer__body' }, this.$slots.default), this.$slots.footer ? h('footer', { class: 'liquid-drawer__footer' }, this.$slots.footer) : null])]) }
}
