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
    'LiquidBadge', 'LiquidBreadcrumb', 'LiquidButton', 'LiquidCard', 'LiquidCol', 'LiquidDatePicker', 'LiquidDescriptions', 'LiquidDialog', 'LiquidDrawer', 'LiquidDropdown', 'LiquidFeedbackHost', 'LiquidForm', 'LiquidFormItem', 'LiquidGlassSurface', 'LiquidIcon', 'LiquidIconButton', 'LiquidInput', 'LiquidLoading', 'LiquidMenu', 'LiquidMeter', 'LiquidNavIcon', 'LiquidNumberInput', 'LiquidPalettePicker', 'LiquidPopover', 'LiquidProgress', 'LiquidRow', 'LiquidScrollArea', 'LiquidSegmented', 'LiquidSelect', 'LiquidSpinner', 'LiquidSwitch', 'LiquidTable', 'LiquidTableColumn', 'LiquidTag', 'LiquidTextarea', 'LiquidThemeToggle', 'LiquidTooltip'
  ])
  assert.equal(Vue.prototype.$liquidUI.material, liquidUI.material)
  assert.equal(Vue.prototype.$liquidUI, liquidUI.runtime)
  assert.equal(Vue.prototype.$liquidFeedback, liquidUI.feedback)
})
