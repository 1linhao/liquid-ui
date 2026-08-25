import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createLiquidRuntime,
  LIQUID_MODES,
  LIQUID_PALETTES,
  LIQUID_QUALITIES,
  LIQUID_SURFACES
} from '../src/core.js'

test('core runtime works without a DOM or framework runtime', () => {
  const runtime = createLiquidRuntime({
    document: null,
    matchMedia: null,
    environment: {}
  })
  assert.deepEqual(runtime.theme.getState(), { mode: 'system', resolvedMode: 'light', palette: 'blue' })
  assert.equal(runtime.material.getCapabilities().refraction, false)
  assert.deepEqual(LIQUID_MODES, ['light', 'dark', 'system'])
  assert.deepEqual(LIQUID_PALETTES, ['blue', 'violet', 'emerald', 'amber'])
  assert.deepEqual(LIQUID_QUALITIES, ['auto', 'reduced', 'full'])
  assert.deepEqual(LIQUID_SURFACES, ['panel', 'overlay', 'control', 'navigation'])
})

test('two adapters can share one runtime state', () => {
  const runtime = createLiquidRuntime({ document: null, matchMedia: null, environment: {} })
  const observed = []
  runtime.theme.subscribe((state) => observed.push(state.mode))
  runtime.theme.setMode('dark')
  assert.deepEqual(observed, ['dark'])
  assert.equal(runtime.theme.getState().resolvedMode, 'dark')
})
