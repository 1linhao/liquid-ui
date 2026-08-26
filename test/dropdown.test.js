import assert from 'node:assert/strict'
import test from 'node:test'
import { nextMenuIndex, normalizeMenuItems } from '../src/overlays/dropdown.js'

test('dropdown items normalize public data and reject ambiguous keys', () => {
  const items = normalizeMenuItems([{ key: 'edit', label: 'Edit' }, { key: 'remove', disabled: true, tone: 'danger' }])
  assert.deepEqual(items, [
    { key: 'edit', label: 'Edit', disabled: false, tone: 'neutral' },
    { key: 'remove', label: 'remove', disabled: true, tone: 'danger' }
  ])
  assert.throws(() => normalizeMenuItems([{ key: 'same' }, { key: 'same' }]), /unique/)
})

test('dropdown keyboard movement wraps and skips disabled actions', () => {
  const items = normalizeMenuItems([{ key: 'one' }, { key: 'two', disabled: true }, { key: 'three' }])
  assert.equal(nextMenuIndex(items, 0, 1), 2)
  assert.equal(nextMenuIndex(items, 2, 1), 0)
  assert.equal(nextMenuIndex(items, 0, -1), 2)
})
