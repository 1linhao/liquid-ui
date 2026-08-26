import { LiquidGlassSurface } from '../material/LiquidGlassSurface.js'
import { createModalLayer } from './modal.js'

export const LiquidDialog = {
  name: 'LiquidDialog',
  inheritAttrs: false,
  props: {
    value: Boolean,
    title: { type: String, default: '' },
    closeLabel: { type: String, default: 'Close dialog' },
    closeOnBackdrop: { type: Boolean, default: true },
    closeOnEscape: { type: Boolean, default: true }
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.$nextTick(() => value ? this.layer?.open() : this.layer?.close({ reason: 'model' }))
      }
    }
  },
  mounted() {
    this.layer = createModalLayer({
      dialog: this.$refs.dialog,
      closeOnBackdrop: this.closeOnBackdrop,
      closeOnEscape: this.closeOnEscape,
      initialFocus: () => this.$refs.dialog.querySelector('[autofocus]'),
      onDismiss: (reason) => {
        this.$emit('input', false)
        this.$emit('close', reason)
      }
    })
    if (this.value) this.layer.open()
  },
  beforeDestroy() { this.layer?.destroy() },
  methods: { requestClose(reason = 'close-button') { this.layer?.close({ reason }) } },
  render(h) {
    const titleId = `${this._uid}-liquid-dialog-title`
    return h('dialog', {
      ref: 'dialog',
      class: 'liquid-dialog',
      attrs: { ...this.$attrs, hidden: !this.value, 'aria-modal': 'true', 'aria-labelledby': this.title ? titleId : undefined, 'aria-label': this.title ? undefined : this.$attrs['aria-label'], tabindex: '-1' }
    }, [h(LiquidGlassSurface, { class: 'liquid-dialog__surface', props: { surface: 'overlay', elevated: true } }, [
      h('header', { class: 'liquid-dialog__header' }, [
        this.title ? h('h2', { attrs: { id: titleId } }, this.title) : h('div', this.$slots.title),
        h('button', { class: 'liquid-dialog__close', attrs: { type: 'button', 'aria-label': this.closeLabel }, on: { click: () => this.requestClose() } }, '×')
      ]),
      h('div', { class: 'liquid-dialog__body' }, this.$slots.default),
      this.$slots.footer ? h('footer', { class: 'liquid-dialog__footer' }, this.$slots.footer) : null
    ])])
  }
}
