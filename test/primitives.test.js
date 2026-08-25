import assert from 'node:assert/strict'
import test from 'node:test'
import { LiquidInput } from '../src/primitives/LiquidInput.js'
import { LiquidNumberInput } from '../src/primitives/LiquidNumberInput.js'
import { LiquidSwitch } from '../src/primitives/LiquidSwitch.js'
import { LiquidTag } from '../src/primitives/LiquidTag.js'
import { normalizeNumber, stepNumber } from '../src/primitives/number.js'

function emitter(overrides = {}) {
  const events = []
  return { ...overrides, events, $emit: (...args) => events.push(args) }
}

test('input emits controlled values and clear intent', () => {
  const input = emitter({ disabled: false, readonly: false, $nextTick: (callback) => callback(), $refs: { input: { focus() {} } } })
  LiquidInput.methods.onInput.call(input, { target: { value: 'hello' } })
  LiquidInput.methods.clear.call(input, { type: 'click' })
  assert.deepEqual(input.events.map(([name, value]) => [name, value]), [
    ['input', 'hello'], ['input', ''], ['clear', { type: 'click' }]
  ])
})

test('number helpers clamp, round, and step deterministically', () => {
  assert.equal(normalizeNumber('2.349', { min: 0, max: 3, precision: 2 }), 2.35)
  assert.equal(normalizeNumber('8', { max: 5 }), 5)
  assert.equal(normalizeNumber('not-a-number'), undefined)
  assert.equal(stepNumber(0.2, 1, { step: 0.1 }), 0.3)
  assert.equal(stepNumber(5, 1, { step: 2, max: 6 }), 6)
})

test('number input reports the rejected draft and restores controlled state', () => {
  const numberInput = emitter({
    draft: 'invalid',
    value: 4,
    numberOptions: { min: 1, max: 6, step: 1 }
  })
  LiquidNumberInput.methods.commit.call(numberInput)
  assert.equal(numberInput.draft, '4')
  assert.deepEqual(numberInput.events[0], ['invalid', 'invalid'])
})

test('switch emits one controlled toggle and respects disabled', () => {
  const enabled = emitter({ value: false, disabled: false })
  LiquidSwitch.methods.toggle.call(enabled, { type: 'click' })
  assert.deepEqual(enabled.events.map(([name, value]) => [name, value]), [['input', true], ['change', true]])
  const disabled = emitter({ value: false, disabled: true })
  LiquidSwitch.methods.toggle.call(disabled, { type: 'click' })
  assert.equal(disabled.events.length, 0)
})

test('closable tag emits no action while disabled', () => {
  const enabled = emitter({ disabled: false })
  LiquidTag.methods.close.call(enabled, { type: 'click' })
  assert.equal(enabled.events[0][0], 'close')
  const disabled = emitter({ disabled: true })
  LiquidTag.methods.close.call(disabled, { type: 'click' })
  assert.equal(disabled.events.length, 0)
})
