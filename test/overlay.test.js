import assert from 'node:assert/strict'
import test from 'node:test'
import { createAnchoredOverlay } from '../src/overlays/anchored.js'

function eventHub(size = {}) {
  const listeners = new Map()
  return {
    innerWidth: size.width,
    innerHeight: size.height,
    addEventListener(type, listener) {
      const entries = listeners.get(type) ?? new Set()
      entries.add(listener)
      listeners.set(type, entries)
    },
    removeEventListener(type, listener) { listeners.get(type)?.delete(listener) },
    dispatch(type, event) { for (const listener of listeners.get(type) ?? []) listener(event) },
    listenerCount(type) { return listeners.get(type)?.size ?? 0 }
  }
}

test('anchored overlay owns positioning, escape dismissal, focus restoration, and listener cleanup', () => {
  const document = eventHub()
  const environment = eventHub({ width: 800, height: 600 })
  const insideAnchor = {}
  const insidePanel = {}
  let focusCount = 0
  const anchor = {
    ownerDocument: document,
    getBoundingClientRect: () => ({ left: 40, top: 480, right: 240, bottom: 522, width: 200 }),
    contains: (target) => target === insideAnchor,
    focus: () => { focusCount += 1 }
  }
  const panel = {
    style: {},
    dataset: {},
    hidden: true,
    offsetHeight: 180,
    contains: (target) => target === insidePanel
  }
  const reasons = []
  const overlay = createAnchoredOverlay({ anchor, panel, document, environment, onDismiss: (reason) => reasons.push(reason) })

  assert.equal(overlay.open(), true)
  assert.equal(panel.hidden, false)
  assert.equal(panel.dataset.placement, 'top')
  assert.equal(panel.style.width, '200px')
  assert.equal(document.listenerCount('keydown'), 1)

  let prevented = false
  document.dispatch('keydown', { key: 'Escape', preventDefault: () => { prevented = true } })
  assert.equal(prevented, true)
  assert.equal(panel.hidden, true)
  assert.equal(focusCount, 1)
  assert.deepEqual(reasons, ['escape'])
  assert.equal(document.listenerCount('keydown'), 0)

  overlay.open()
  document.dispatch('pointerdown', { target: {} })
  assert.deepEqual(reasons, ['escape', 'outside'])
  assert.equal(focusCount, 1)
  overlay.destroy()
  assert.throws(() => overlay.open(), /destroyed/)
})
