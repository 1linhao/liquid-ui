import { createAnchoredOverlay } from '../overlays/anchored.js'
import { LiquidGlassSurface } from '../material/LiquidGlassSurface.js'
import { filterOptions, nextEnabledIndex, normalizeOptions, toggleSelection } from './select.js'

function hasValue(value, multiple) {
  return multiple ? Array.isArray(value) && value.length > 0 : value !== '' && value !== null && value !== undefined
}

function vnodeText(node) {
  if (!node) return ''
  if (node.text != null) return String(node.text)
  return (node.children ?? []).map(vnodeText).join('')
}

export function optionsFromVNodes(nodes = []) {
  const options = []
  const visit = (node) => {
    if (!node) return
    if (node.tag === 'option') {
      const attrs = node.data?.attrs ?? {}
      const domProps = node.data?.domProps ?? {}
      const value = Object.prototype.hasOwnProperty.call(domProps, 'value')
        ? domProps.value
        : Object.prototype.hasOwnProperty.call(attrs, 'value') ? attrs.value : vnodeText(node).trim()
      options.push({
        value,
        label: attrs.label == null ? vnodeText(node).trim() : String(attrs.label),
        disabled: Boolean(domProps.disabled ?? attrs.disabled)
      })
      return
    }
    ;(node.children ?? []).forEach(visit)
  }
  nodes.forEach(visit)
  return options
}

export const LiquidSelect = {
  name: 'LiquidSelect',
  inheritAttrs: false,
  props: {
    value: { type: [String, Number, Boolean, Array], default: '' },
    options: { type: Array, default: () => [] },
    multiple: Boolean,
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    invalid: Boolean,
    placeholder: { type: String, default: 'Select' },
    noResultsText: { type: String, default: 'No matching options' }
  },
  data: () => ({ open: false, query: '', activeIndex: -1 }),
  computed: {
    normalizedOptions() {
      const source = this.options.length ? this.options : optionsFromVNodes(this.$slots.default)
      return normalizeOptions(source)
    },
    visibleOptions() { return filterOptions(this.normalizedOptions, this.query) },
    hasSelection() { return hasValue(this.value, this.multiple) },
    selectedLabel() {
      return this.normalizedOptions
        .filter(({ value }) => this.isSelected(value))
        .map(({ label }) => label)
        .join(', ')
    }
  },
  mounted() {
    this.overlay = createAnchoredOverlay({
      anchor: this.$refs.trigger,
      panel: this.$refs.menu,
      onDismiss: (reason) => {
        if (!this.open) return
        this.open = false
        this.query = ''
        this.$emit('close', reason)
        this.$emit('blur')
      }
    })
  },
  updated() { this.overlay?.updatePosition() },
  beforeDestroy() { this.overlay?.destroy() },
  methods: {
    isSelected(optionValue) {
      return this.multiple
        ? Array.isArray(this.value) && this.value.some((value) => Object.is(value, optionValue))
        : Object.is(this.value, optionValue)
    },
    emitValue(value, event) {
      this.$emit('input', value)
      this.$emit('change', value, event)
    },
    choose(option, event) {
      if (option.disabled) return
      this.emitValue(toggleSelection(this.value, option.value, this.multiple), event)
      if (!this.multiple) this.closeMenu({ reason: 'select' })
    },
    clear(event) {
      if (this.disabled) return
      event?.stopPropagation?.()
      this.emitValue(this.multiple ? [] : '', event)
      this.$emit('clear', event)
    },
    openMenu(direction = 1) {
      if (this.disabled || this.open) return
      this.open = true
      this.query = ''
      const selectedIndex = this.visibleOptions.findIndex(({ value, disabled }) => !disabled && this.isSelected(value))
      this.activeIndex = selectedIndex >= 0 ? selectedIndex : nextEnabledIndex(this.visibleOptions, direction > 0 ? -1 : 0, direction)
      this.$nextTick(() => {
        this.overlay?.open()
        if (this.filterable) this.$refs.search?.focus()
        else this.$refs.menu?.focus({ preventScroll: true })
      })
      this.$emit('open')
    },
    closeMenu({ restoreFocus = true, reason = 'programmatic' } = {}) {
      if (!this.open) return
      this.overlay?.close({ restoreFocus, reason })
    },
    toggleMenu() { this.open ? this.closeMenu() : this.openMenu() },
    moveActive(direction) {
      if (!this.open) {
        this.openMenu(direction)
        return
      }
      this.activeIndex = nextEnabledIndex(this.visibleOptions, this.activeIndex, direction)
      this.$nextTick(() => this.$refs[`option-${this.activeIndex}`]?.scrollIntoView?.({ block: 'nearest' }))
    },
    selectActive(event) {
      const option = this.visibleOptions[this.activeIndex]
      if (option) this.choose(option, event)
    },
    onTriggerKeydown(event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        this.moveActive(event.key === 'ArrowDown' ? 1 : -1)
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.open ? this.selectActive(event) : this.openMenu()
      } else if (event.key === 'Escape') {
        this.closeMenu({ reason: 'escape' })
      }
    },
    onMenuKeydown(event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        this.moveActive(event.key === 'ArrowDown' ? 1 : -1)
      } else if (event.key === 'Enter') {
        event.preventDefault()
        this.selectActive(event)
      }
    }
  },
  render(h) {
    const activeId = this.activeIndex >= 0 ? `${this._uid}-liquid-option-${this.activeIndex}` : undefined
    const optionNodes = this.visibleOptions.map((option, index) => h('button', {
      key: `${typeof option.value}:${String(option.value)}`,
      ref: `option-${index}`,
      class: ['liquid-select__option', { 'is-selected': this.isSelected(option.value), 'is-active': index === this.activeIndex }],
      attrs: {
        id: `${this._uid}-liquid-option-${index}`,
        type: 'button',
        role: 'option',
        disabled: option.disabled,
        'aria-selected': String(this.isSelected(option.value))
      },
      on: { click: (event) => this.choose(option, event), mouseenter: () => { if (!option.disabled) this.activeIndex = index } }
    }, [h('span', option.label), this.isSelected(option.value) ? h('span', { attrs: { 'aria-hidden': 'true' } }, '✓') : null]))

    const panelContent = [
      this.filterable ? h('input', {
        ref: 'search',
        class: 'liquid-select__search',
        attrs: { type: 'search', placeholder: 'Search options', 'aria-label': 'Search options' },
        domProps: { value: this.query },
        on: {
          input: (event) => {
            this.query = event.target.value
            this.$nextTick(() => { this.activeIndex = nextEnabledIndex(this.visibleOptions, -1, 1) })
          }
        }
      }) : null,
      h('div', { class: 'liquid-select__options' }, optionNodes.length ? optionNodes : [h('div', { class: 'liquid-select__empty' }, this.noResultsText)])
    ]

    return h('div', { class: ['liquid-select', { 'is-open': this.open, 'is-disabled': this.disabled, 'is-invalid': this.invalid, 'has-clear': this.clearable && this.hasSelection }] }, [
      h('button', {
        ref: 'trigger',
        class: 'liquid-select__trigger',
        attrs: { ...this.$attrs, type: 'button', disabled: this.disabled, role: 'combobox', 'aria-haspopup': 'listbox', 'aria-expanded': String(this.open), 'aria-controls': `${this._uid}-liquid-listbox` },
        on: { click: this.toggleMenu, keydown: this.onTriggerKeydown }
      }, [
        h('span', { class: { 'is-placeholder': !this.hasSelection } }, this.selectedLabel || this.placeholder),
        this.clearable && this.hasSelection ? null : h('span', { class: 'liquid-select__arrow', attrs: { 'aria-hidden': 'true' } }, '⌄')
      ]),
      this.clearable && this.hasSelection ? h('button', {
        class: 'liquid-select__clear',
        attrs: { type: 'button', disabled: this.disabled, 'aria-label': 'Clear selection' },
        on: { click: this.clear }
      }, '×') : null,
      h('div', {
        ref: 'menu',
        class: 'liquid-select__menu',
        attrs: { id: `${this._uid}-liquid-listbox`, role: 'listbox', tabindex: '-1', popover: 'manual', hidden: !this.open, 'aria-multiselectable': this.multiple ? 'true' : undefined, 'aria-activedescendant': activeId },
        on: { keydown: this.onMenuKeydown }
      }, [h(LiquidGlassSurface, { class: 'liquid-select__surface', props: { surface: 'overlay', elevated: true } }, panelContent)])
    ])
  }
}
