import assert from 'node:assert/strict'
import test from 'node:test'
import { createLiquidUI } from '../src/index.js'

test('Vue adapter installs only public LiquidUI components', () => {
  const registered = new Map()
  function Vue() {}
  Vue.prototype = {}
  Vue.component = (name, component) => registered.set(name, component)
  const liquidUI = createLiquidUI({ matchMedia: () => ({ matches: false, addEventListener() {} }) })
  liquidUI.install(Vue)
  assert.deepEqual([...registered.keys()].sort(), [
    'LiquidButton', 'LiquidDatePicker', 'LiquidDialog', 'LiquidDropdown', 'LiquidForm', 'LiquidFormItem', 'LiquidGlassSurface', 'LiquidInput', 'LiquidNumberInput', 'LiquidPopover', 'LiquidSelect', 'LiquidSwitch', 'LiquidTable', 'LiquidTag', 'LiquidTooltip'
  ])
  assert.equal(Vue.prototype.$liquidUI.material, liquidUI.material)
  assert.equal(Vue.prototype.$liquidUI, liquidUI.runtime)
})
