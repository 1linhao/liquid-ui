import assert from 'node:assert/strict'
import test from 'node:test'
import { createThemeController } from '../src/theme/index.js'

function fixture(prefersDark = false) {
  const attributes = new Map()
  const styles = new Map()
  const storage = new Map()
  const root = {
    setAttribute: (key, value) => attributes.set(key, value),
    style: { setProperty: (key, value) => styles.set(key, value) }
  }
  const media = { matches: prefersDark, addEventListener() {}, removeEventListener() {} }
  return {
    attributes,
    styles,
    document: { documentElement: root },
    matchMedia: () => media,
    storage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    values: storage
  }
}

test('mode stays in memory while palette is persisted', () => {
  const f = fixture(true)
  const theme = createThemeController({ document: f.document, matchMedia: f.matchMedia, paletteStorage: f.storage })
  assert.deepEqual(theme.getState(), { mode: 'system', resolvedMode: 'dark', palette: 'blue' })
  theme.setMode('light')
  theme.setPalette('emerald')
  assert.equal(f.attributes.get('data-liquid-mode'), 'light')
  assert.equal(f.values.get('liquid-ui.palette'), 'emerald')
  assert.equal(f.values.has('liquid-ui.mode'), false)
})

test('invalid theme values fail at the public boundary', () => {
  const f = fixture()
  const theme = createThemeController({ document: f.document, matchMedia: f.matchMedia })
  assert.throws(() => theme.setMode('night'), /Unknown LiquidUI mode/)
  assert.throws(() => theme.setPalette('red'), /Unknown LiquidUI palette/)
})
