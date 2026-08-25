import assert from 'node:assert/strict'
import test from 'node:test'
import { createMaterialController, detectCapabilities, normalizeDescriptor } from '../src/material/index.js'

test('capability detection keeps Safari and Firefox on frost fallback', () => {
  const environment = (userAgent) => ({
    CSS: { supports: () => true },
    navigator: { userAgent },
    matchMedia: () => ({ matches: false })
  })
  assert.equal(detectCapabilities(environment('Mozilla Chrome/140 Safari/537.36')).refraction, true)
  assert.equal(detectCapabilities(environment('Mozilla Firefox/142')).refraction, false)
  assert.equal(detectCapabilities(environment('Version/19.0 Safari/605.1.15')).refraction, false)
})

test('semantic surface profiles hide optical implementation details', () => {
  const panel = normalizeDescriptor({ surface: 'panel' })
  const overlay = normalizeDescriptor({ surface: 'overlay' })
  assert.equal(panel.surface, 'panel')
  assert.ok(overlay.refraction > panel.refraction)
  assert.throws(() => normalizeDescriptor({ surface: 'business-dashboard' }), /Unknown LiquidUI surface intent/)
})

test('quality can force a cheap tier without changing component descriptors', () => {
  const material = createMaterialController({
    environment: { CSS: { supports: () => true }, navigator: { userAgent: 'Chrome/140' }, matchMedia: () => ({ matches: false }) }
  })
  assert.equal(material.resolveTier({ surface: 'control' }), 'refract')
  let observed
  material.subscribe((quality) => { observed = quality })
  material.setQuality('reduced')
  assert.equal(observed, 'reduced')
  assert.equal(material.resolveTier({ surface: 'control' }), 'frost')
  assert.throws(() => material.setQuality('ultra'), /Unknown material quality/)
})
