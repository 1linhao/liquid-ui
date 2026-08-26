import assert from 'node:assert/strict'
import test from 'node:test'
import { nextSort, normalizeColumns, stableSortRows } from '../src/data/table.js'

test('table columns expose stable declarative contracts', () => {
  const columns = normalizeColumns([{ key: 'name', label: 'Name', sortable: true }, { key: 'count', align: 'right' }])
  assert.deepEqual(columns, [
    { key: 'name', label: 'Name', width: undefined, minWidth: undefined, align: 'left', sortable: true, format: null },
    { key: 'count', label: 'count', width: undefined, minWidth: undefined, align: 'right', sortable: false, format: null }
  ])
  assert.throws(() => normalizeColumns([{ key: 'name' }, { key: 'name' }]), /unique/)
})

test('table sort cycles and remains stable for equal values', () => {
  assert.deepEqual(nextSort(null, 'name'), { key: 'name', direction: 'ascending' })
  assert.deepEqual(nextSort({ key: 'name', direction: 'ascending' }, 'name'), { key: 'name', direction: 'descending' })
  assert.deepEqual(nextSort({ key: 'name', direction: 'descending' }, 'name'), { key: '', direction: 'none' })
  const rows = [{ id: 1, score: 2 }, { id: 2, score: 1 }, { id: 3, score: 2 }]
  assert.deepEqual(stableSortRows(rows, { key: 'score', direction: 'ascending' }).map(({ id }) => id), [2, 1, 3])
  assert.deepEqual(rows.map(({ id }) => id), [1, 2, 3])
})
