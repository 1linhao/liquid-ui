import { normalizeColumns, nextSort, stableSortRows } from './table.js'

export const LiquidTable = {
  name: 'LiquidTable',
  props: {
    columns: { type: Array, default: () => [] },
    rows: { type: Array, default: () => [] },
    data: { default: () => [] },
    border: Boolean,
    rowKey: { type: [String, Function], default: 'id' },
    sort: { type: Object, default: () => ({ key: '', direction: 'none' }) },
    manualSort: Boolean,
    loading: Boolean,
    emptyText: { type: String, default: 'No data' },
    caption: { type: String, default: '' },
    maxHeight: { type: [String, Number], default: '' }
  },
  computed: {
    normalizedColumns() {
      const columns = this.columns.length ? this.columns : (this.$slots.default ?? []).filter((node) => node.componentOptions?.Ctor?.options?.name === 'LiquidTableColumn').map((node) => {
        const props = node.componentOptions.propsData ?? {}
        return {
          ...props,
          key: props.keyName || props.field || props.prop || (props.type === 'index' ? '__index' : ''),
          slot: node.data?.scopedSlots?.default,
          keyName: undefined,
          field: undefined,
          prop: undefined
        }
      })
      return normalizeColumns(columns)
    },
    sourceRows() { return this.rows.length ? this.rows : Array.isArray(this.data) ? this.data : [] },
    visibleRows() { return this.manualSort ? this.sourceRows : stableSortRows(this.sourceRows, this.sort) }
  },
  methods: {
    keyFor(row, index) { return typeof this.rowKey === 'function' ? this.rowKey(row, index) : row?.[this.rowKey] ?? index },
    requestSort(column, event) {
      if (!column.sortable) return
      const sort = nextSort(this.sort, column.key)
      this.$emit('sort-change', sort, event)
      this.$emit('update:sort', sort)
    },
    cellValue(row, column, rowIndex) {
      if (column.type === 'index') return rowIndex + 1
      const value = String(column.key).split('.').reduce((current, part) => current?.[part], row)
      return column.format ? column.format(value, row, rowIndex) : value
    }
  },
  render(h) {
    const style = this.maxHeight ? { maxHeight: typeof this.maxHeight === 'number' ? `${this.maxHeight}px` : this.maxHeight } : undefined
    const headers = this.normalizedColumns.map((column) => h('th', {
      key: column.key,
      class: `is-${column.align}`,
      style: { width: column.width ? (typeof column.width === 'number' ? `${column.width}px` : column.width) : undefined, minWidth: column.minWidth ? (typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth) : undefined },
      attrs: { scope: 'col', 'aria-sort': this.sort.key === column.key ? this.sort.direction : 'none' }
    }, column.sortable ? [h('button', { attrs: { type: 'button' }, on: { click: (event) => this.requestSort(column, event) } }, [column.label, h('span', { attrs: { 'aria-hidden': 'true' } }, this.sort.key === column.key ? (this.sort.direction === 'ascending' ? ' ↑' : this.sort.direction === 'descending' ? ' ↓' : '') : '')])] : column.label))
    const body = this.visibleRows.length
      ? this.visibleRows.map((row, rowIndex) => h('tr', { key: this.keyFor(row, rowIndex), on: { click: (event) => this.$emit('row-click', row, rowIndex, event) } }, this.normalizedColumns.map((column) => {
        const slot = column.slot || this.$scopedSlots[`cell-${column.key}`]
        const value = this.cellValue(row, column, rowIndex)
        return h('td', { key: column.key, class: `is-${column.align}` }, slot ? slot({ value, row, rowIndex, $index: rowIndex, column }) : String(value ?? ''))
      })))
      : [h('tr', { class: 'liquid-table__empty-row' }, [h('td', { attrs: { colspan: Math.max(this.normalizedColumns.length, 1) } }, this.emptyText)])]

    return h('div', { class: ['liquid-table', { 'is-loading': this.loading, 'is-bordered': this.border }] }, [
      h('div', { class: 'liquid-table__scroll', style }, [h('table', [this.caption ? h('caption', this.caption) : null, h('thead', [h('tr', headers)]), h('tbody', body)])]),
      this.loading ? h('div', { class: 'liquid-table__loading', attrs: { role: 'status', 'aria-label': 'Loading table' } }, [h('span', { class: 'liquid-spinner', attrs: { 'aria-hidden': 'true' } }), h('span', 'Loading')]) : null
    ])
  }
}
