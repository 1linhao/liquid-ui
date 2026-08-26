import assert from 'node:assert/strict'
import test from 'node:test'
import { LiquidSegmented } from '../src/primitives/LiquidSegmented.js'
import { LiquidProgress } from '../src/primitives/LiquidProgress.js'
import { LiquidBadge } from '../src/data/LiquidBadge.js'
import { LiquidMeter } from '../src/data/LiquidMeter.js'
import { LiquidMenu } from '../src/navigation/LiquidMenu.js'

test('segmented control emits controlled values and skips disabled options', () => {
  const events = []
  const context = { disabled: false, value: 'a', $emit: (...args) => events.push(args) }
  LiquidSegmented.methods.select.call(context, { value: 'b', disabled: true }, {})
  LiquidSegmented.methods.select.call(context, { value: 'c' }, { type: 'click' })
  assert.deepEqual(events.map(([name, value]) => [name, value]), [['input', 'c'], ['change', 'c']])
})

test('progress and meter clamp visual percentages without mutating values', () => {
  assert.equal(LiquidProgress.computed.percent.call({ value: 150, max: 100 }), 100)
  assert.equal(LiquidMeter.computed.percent.call({ value: -10, min: 0, max: 100 }), 0)
  assert.equal(LiquidMeter.computed.percent.call({ value: 25, min: 0, max: 50 }), 50)
})

test('badge caps numeric display values', () => {
  assert.equal(LiquidBadge.computed.displayValue.call({ value: 120, max: 99 }), '99+')
  assert.equal(LiquidBadge.computed.displayValue.call({ value: 'new', max: 99 }), 'new')
})

test('menu exposes selection intent without owning navigation', () => {
  const events = []
  const context = { $emit: (...args) => events.push(args) }
  LiquidMenu.methods.activate.call(context, { key: 'settings', label: 'Settings' }, { type: 'click' })
  LiquidMenu.methods.activate.call(context, { key: 'admin', disabled: true }, {})
  assert.deepEqual(events.map(([name, value]) => [name, value]), [['select', 'settings'], ['update:activeKey', 'settings']])
})
