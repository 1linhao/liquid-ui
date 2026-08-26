import assert from 'node:assert/strict'
import test from 'node:test'
import { createModalLayer } from '../src/overlays/modal.js'

function hub(extra = {}) {
  const listeners = new Map()
  return {
    ...extra,
    addEventListener(type, listener) { const set = listeners.get(type) ?? new Set(); set.add(listener); listeners.set(type, set) },
    removeEventListener(type, listener) { listeners.get(type)?.delete(listener) },
    dispatch(type, event) { for (const listener of listeners.get(type) ?? []) listener(event) },
    count(type) { return listeners.get(type)?.size ?? 0 }
  }
}

function modalFixture(document, buttons = []) {
  const attributes = new Map()
  return hub({
    ownerDocument: document,
    hidden: true,
    open: false,
    querySelectorAll: () => buttons,
    querySelector: () => null,
    setAttribute(name, value) { attributes.set(name, value) },
    removeAttribute(name) { attributes.delete(name) },
    showModal() { this.open = true },
    close() { this.open = false },
    focus() { document.activeElement = this }
  })
}

test('modal layer traps tab, restores focus, and releases scroll lock', () => {
  const root = { style: { overflow: 'auto' } }
  const trigger = { focusCount: 0, focus() { this.focusCount += 1 } }
  const document = hub({ documentElement: root, activeElement: trigger })
  const first = { hidden: false, getAttribute: () => null, focus() { document.activeElement = first } }
  const last = { hidden: false, getAttribute: () => null, focus() { document.activeElement = last } }
  const dialog = modalFixture(document, [first, last])
  const reasons = []
  const layer = createModalLayer({ dialog, document, onDismiss: (reason) => reasons.push(reason) })

  assert.equal(layer.open(), true)
  assert.equal(document.activeElement, first)
  assert.equal(root.style.overflow, 'hidden')
  document.activeElement = last
  let prevented = false
  document.dispatch('keydown', { key: 'Tab', shiftKey: false, preventDefault: () => { prevented = true } })
  assert.equal(prevented, true)
  assert.equal(document.activeElement, first)
  document.dispatch('keydown', { key: 'Escape', preventDefault() {} })
  assert.deepEqual(reasons, ['escape'])
  assert.equal(trigger.focusCount, 1)
  assert.equal(root.style.overflow, 'auto')
  assert.equal(document.count('keydown'), 0)
})

test('nested modal layers keep scroll locked until the last layer closes', () => {
  const root = { style: { overflow: '' } }
  const document = hub({ documentElement: root, activeElement: null })
  const first = createModalLayer({ dialog: modalFixture(document), document })
  const second = createModalLayer({ dialog: modalFixture(document), document })
  first.open()
  second.open()
  first.close({ restoreFocus: false })
  assert.equal(root.style.overflow, 'hidden')
  second.close({ restoreFocus: false })
  assert.equal(root.style.overflow, '')
})
