import { LiquidGlassSurface } from '../material/LiquidGlassSurface.js'
import { createAnchoredOverlay } from './anchored.js'
import { nextMenuIndex, normalizeMenuItems } from './dropdown.js'

export const LiquidDropdown = {
  name: 'LiquidDropdown',
  inheritAttrs: false,
  props: { label: { type: String, default: 'Open menu' }, items: { type: Array, default: () => [] }, disabled: Boolean },
  data: () => ({ open: false, activeIndex: -1 }),
  computed: { normalizedItems() { return normalizeMenuItems(this.items) } },
  mounted() {
    this.layer = createAnchoredOverlay({ anchor: this.$refs.trigger, panel: this.$refs.menu, matchWidth: false, onDismiss: (reason) => { if (!this.open) return; this.open = false; this.$emit('close', reason) } })
  },
  updated() { this.layer?.updatePosition() },
  beforeDestroy() { this.layer?.destroy() },
  methods: {
    openMenu(direction = 1) {
      if (this.disabled || this.open) return
      this.open = true
      this.activeIndex = nextMenuIndex(this.normalizedItems, direction > 0 ? -1 : 0, direction)
      this.$nextTick(() => { this.layer.open(); this.$refs[`item-${this.activeIndex}`]?.focus({ preventScroll: true }) })
      this.$emit('open')
    },
    closeMenu(reason = 'programmatic') { this.layer?.close({ reason }) },
    toggleMenu() { this.open ? this.closeMenu() : this.openMenu() },
    move(direction) { this.activeIndex = nextMenuIndex(this.normalizedItems, this.activeIndex, direction); this.$nextTick(() => this.$refs[`item-${this.activeIndex}`]?.focus({ preventScroll: true })) },
    choose(item, event) { if (item.disabled) return; this.$emit('select', item.key, item, event); this.closeMenu('select') },
    onKeydown(event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); this.open ? this.move(event.key === 'ArrowDown' ? 1 : -1) : this.openMenu(event.key === 'ArrowDown' ? 1 : -1) }
      else if ((event.key === 'Enter' || event.key === ' ') && !this.open) { event.preventDefault(); this.openMenu() }
      else if ((event.key === 'Enter' || event.key === ' ') && this.open) { event.preventDefault(); const item = this.normalizedItems[this.activeIndex]; if (item) this.choose(item, event) }
    }
  },
  render(h) {
    const id = `${this._uid}-liquid-menu`
    return h('span', { class: 'liquid-dropdown' }, [
      h('button', { ref: 'trigger', class: 'liquid-dropdown__trigger', attrs: { ...this.$attrs, type: 'button', disabled: this.disabled, 'aria-haspopup': 'menu', 'aria-expanded': String(this.open), 'aria-controls': id }, on: { click: this.toggleMenu, keydown: this.onKeydown } }, this.$slots.trigger ?? this.label),
      h('div', { ref: 'menu', class: 'liquid-dropdown__menu', attrs: { id, role: 'menu', popover: 'manual', hidden: !this.open }, on: { keydown: this.onKeydown } }, [
        h(LiquidGlassSurface, { class: 'liquid-dropdown__surface', props: { surface: 'overlay', elevated: true } }, this.normalizedItems.map((item, index) => h('button', {
          key: item.key,
          ref: `item-${index}`,
          class: ['liquid-dropdown__item', `liquid-dropdown__item--${item.tone}`, { 'is-active': index === this.activeIndex }],
          attrs: { type: 'button', role: 'menuitem', disabled: item.disabled, tabindex: index === this.activeIndex ? '0' : '-1' },
          on: { click: (event) => this.choose(item, event), mouseenter: () => { if (!item.disabled) this.activeIndex = index } }
        }, item.label)))
      ])
    ])
  }
}
