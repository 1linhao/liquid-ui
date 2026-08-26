import { LiquidGlassSurface } from '../material/LiquidGlassSurface.js'
import { createAnchoredOverlay } from '../overlays/anchored.js'
import { addDays, addMonths, calendarMonth, dateToParts, formatDateLabel, isDateUnavailable, parseISODate, toISODate } from './date.js'

export const LiquidDatePicker = {
  name: 'LiquidDatePicker',
  inheritAttrs: false,
  props: {
    value: { type: String, default: '' },
    min: { type: String, default: '' },
    max: { type: String, default: '' },
    disabledDate: { type: Function, default: null },
    locale: { type: String, default: undefined },
    weekStartsOn: { type: Number, default: 1 },
    placeholder: { type: String, default: 'Select date' },
    clearable: { type: Boolean, default: true },
    disabled: Boolean,
    invalid: Boolean
  },
  data() {
    const today = dateToParts(new Date())
    const selected = parseISODate(this.value)
    return { open: false, view: selected ?? today, active: selected ?? today, manualText: this.value, manualError: false }
  },
  computed: {
    selected() { return parseISODate(this.value) },
    displayValue() { return this.selected ? formatDateLabel(this.selected, this.locale) : '' },
    monthTitle() { return formatDateLabel({ ...this.view, day: 1 }, this.locale, { year: 'numeric', month: 'long' }) },
    cells() {
      return calendarMonth(this.view, { value: this.value, min: this.min, max: this.max, disabledDate: this.disabledDate, weekStartsOn: this.weekStartsOn })
    },
    weekdays() {
      const sunday = { year: 2024, month: 1, day: 7 }
      return Array.from({ length: 7 }, (_, index) => formatDateLabel(addDays(sunday, (this.weekStartsOn + index) % 7), this.locale, { weekday: 'short' }))
    }
  },
  mounted() {
    this.overlay = createAnchoredOverlay({
      anchor: this.$refs.trigger,
      panel: this.$refs.panel,
      matchWidth: false,
      estimatedHeight: 480,
      onDismiss: (reason) => {
        if (!this.open) return
        this.open = false
        this.manualError = false
        this.$emit('close', reason)
        this.$emit('blur')
      }
    })
  },
  updated() { this.overlay?.updatePosition() },
  beforeDestroy() { this.overlay?.destroy() },
  methods: {
    syncDraft() {
      const selected = parseISODate(this.value) ?? dateToParts(new Date())
      this.view = selected
      this.active = selected
      this.manualText = this.value
      this.manualError = false
    },
    openPanel() {
      if (this.disabled || this.open) return
      this.syncDraft()
      this.open = true
      this.$nextTick(() => {
        this.overlay?.open()
        this.$nextTick(() => this.$refs[`day-${toISODate(this.active)}`]?.focus({ preventScroll: true }))
      })
      this.$emit('open')
    },
    closePanel(options = {}) { if (this.open) this.overlay?.close(options) },
    togglePanel() { this.open ? this.closePanel() : this.openPanel() },
    emitValue(value, event) {
      this.$emit('input', value)
      this.$emit('change', value, event)
    },
    choose(parts, event) {
      if (isDateUnavailable(parts, this)) return
      const value = toISODate(parts)
      this.emitValue(value, event)
      this.closePanel({ reason: 'select' })
    },
    clear(event) {
      event?.stopPropagation?.()
      if (this.disabled) return
      this.emitValue('', event)
      this.$emit('clear', event)
      this.closePanel({ reason: 'clear' })
    },
    moveMonth(amount) {
      const targetView = addMonths({ ...this.view, day: 1 }, amount)
      let candidate = addMonths(this.active, amount)
      this.view = targetView
      for (let attempt = 0; attempt < 31; attempt += 1) {
        if (!isDateUnavailable(candidate, this)) {
          this.active = candidate
          this.$nextTick(() => this.$refs[`day-${toISODate(this.active)}`]?.focus({ preventScroll: true }))
          return
        }
        candidate = addDays(candidate, amount > 0 ? 1 : -1)
      }
    },
    moveActive(amount) {
      let candidate = addDays(this.active, amount)
      for (let attempt = 0; attempt < 370; attempt += 1) {
        if (!isDateUnavailable(candidate, this)) {
          this.active = candidate
          this.view = { ...candidate, day: 1 }
          this.$nextTick(() => this.$refs[`day-${toISODate(candidate)}`]?.focus({ preventScroll: true }))
          return
        }
        candidate = addDays(candidate, amount > 0 ? 1 : -1)
      }
    },
    onGridKeydown(event) {
      const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
      if (moves[event.key]) { event.preventDefault(); this.moveActive(moves[event.key]); return }
      if (event.key === 'PageUp' || event.key === 'PageDown') { event.preventDefault(); this.moveMonth(event.key === 'PageUp' ? -1 : 1); return }
      if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault()
        const weekday = new Date(`${toISODate(this.active)}T00:00:00Z`).getUTCDay()
        const offset = (weekday - this.weekStartsOn + 7) % 7
        const amount = event.key === 'Home' ? -offset : 6 - offset
        if (amount) this.moveActive(amount)
        return
      }
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); this.choose(this.active, event) }
    },
    applyManual(event) {
      const parsed = parseISODate(this.manualText)
      if (!parsed || isDateUnavailable(parsed, this)) { this.manualError = true; return }
      this.manualError = false
      this.choose(parsed, event)
    },
    chooseToday(event) {
      const today = dateToParts(new Date())
      if (!isDateUnavailable(today, this)) this.choose(today, event)
    }
  },
  render(h) {
    const selectedValue = this.selected ? toISODate(this.selected) : ''
    const days = this.cells.map((cell) => h('button', {
      key: cell.value,
      ref: `day-${cell.value}`,
      class: ['liquid-date-picker__day', { 'is-outside': cell.outside, 'is-today': cell.today, 'is-selected': cell.selected, 'is-active': cell.value === toISODate(this.active) }],
      attrs: { type: 'button', role: 'gridcell', disabled: cell.disabled, tabindex: cell.value === toISODate(this.active) ? '0' : '-1', 'aria-label': formatDateLabel(cell.date, this.locale), 'aria-selected': String(cell.selected) },
      on: { click: (event) => this.choose(cell.date, event), focus: () => { this.active = cell.date } }
    }, String(cell.date.day)))

    return h('div', { class: ['liquid-date-picker', { 'is-open': this.open, 'is-disabled': this.disabled, 'is-invalid': this.invalid, 'has-clear': this.clearable && selectedValue }] }, [
      h('button', {
        ref: 'trigger',
        class: 'liquid-date-picker__trigger',
        attrs: { ...this.$attrs, type: 'button', disabled: this.disabled, 'aria-haspopup': 'dialog', 'aria-expanded': String(this.open), 'aria-controls': `${this._uid}-date-panel` },
        on: { click: this.togglePanel, keydown: (event) => { if (event.key === 'ArrowDown') { event.preventDefault(); this.openPanel() } } }
      }, [h('span', { attrs: { 'aria-hidden': 'true' } }, '▣'), h('span', { class: { 'is-placeholder': !selectedValue } }, this.displayValue || this.placeholder), this.clearable && selectedValue ? null : h('span', { class: 'liquid-date-picker__arrow', attrs: { 'aria-hidden': 'true' } }, '⌄')]),
      this.clearable && selectedValue ? h('button', { class: 'liquid-date-picker__clear', attrs: { type: 'button', 'aria-label': 'Clear date' }, on: { click: this.clear } }, '×') : null,
      h('div', { ref: 'panel', class: 'liquid-date-picker__panel', attrs: { id: `${this._uid}-date-panel`, popover: 'manual', role: 'dialog', 'aria-label': 'Date picker', hidden: !this.open } }, [
        h(LiquidGlassSurface, { class: 'liquid-date-picker__surface', props: { surface: 'overlay', elevated: true } }, [
          h('div', { class: ['liquid-date-picker__manual', { 'is-invalid': this.manualError }] }, [
            h('input', { attrs: { type: 'text', placeholder: 'YYYY-MM-DD', 'aria-label': 'Date input', 'aria-invalid': String(this.manualError) }, domProps: { value: this.manualText }, on: { input: (event) => { this.manualText = event.target.value; this.manualError = false }, keydown: (event) => { if (event.key === 'Enter') { event.preventDefault(); this.applyManual(event) } } } }),
            this.manualError ? h('p', { attrs: { role: 'alert' } }, 'Enter a valid available date as YYYY-MM-DD') : null
          ]),
          h('header', { class: 'liquid-date-picker__header' }, [
            h('button', { attrs: { type: 'button', 'aria-label': 'Previous month' }, on: { click: () => this.moveMonth(-1) } }, '‹'),
            h('strong', this.monthTitle),
            h('button', { attrs: { type: 'button', 'aria-label': 'Next month' }, on: { click: () => this.moveMonth(1) } }, '›')
          ]),
          h('div', { class: 'liquid-date-picker__weekdays', attrs: { 'aria-hidden': 'true' } }, this.weekdays.map((day) => h('span', day))),
          h('div', { class: 'liquid-date-picker__grid', attrs: { role: 'grid' }, on: { keydown: this.onGridKeydown } }, days),
          h('footer', { class: 'liquid-date-picker__footer' }, [
            this.clearable ? h('button', { attrs: { type: 'button' }, on: { click: this.clear } }, 'Clear') : null,
            h('button', { attrs: { type: 'button' }, on: { click: this.chooseToday } }, 'Today'),
            h('span'),
            h('button', { attrs: { type: 'button' }, on: { click: () => this.closePanel({ reason: 'cancel' }) } }, 'Cancel')
          ])
        ])
      ])
    ])
  }
}
