import { createLiquidRuntime } from './core.js'
import { LiquidGlassSurface } from './material/LiquidGlassSurface.js'
import { LiquidForm } from './forms/LiquidForm.js'
import { LiquidFormItem } from './forms/LiquidFormItem.js'
import { LiquidButton } from './primitives/LiquidButton.js'
import { LiquidInput } from './primitives/LiquidInput.js'
import { LiquidNumberInput } from './primitives/LiquidNumberInput.js'
import { LiquidSelect } from './primitives/LiquidSelect.js'
import { LiquidSwitch } from './primitives/LiquidSwitch.js'
import { LiquidTag } from './primitives/LiquidTag.js'

export { LiquidButton, LiquidForm, LiquidFormItem, LiquidGlassSurface, LiquidInput, LiquidNumberInput, LiquidSelect, LiquidSwitch, LiquidTag }

export function createLiquidUI(options = {}) {
  const runtime = options.runtime ?? createLiquidRuntime(options)
  const components = { LiquidButton, LiquidForm, LiquidFormItem, LiquidGlassSurface, LiquidInput, LiquidNumberInput, LiquidSelect, LiquidSwitch, LiquidTag }

  return {
    runtime,
    theme: runtime.theme,
    material: runtime.material,
    install(Vue) {
      for (const component of Object.values(components)) {
        Vue.component(component.name, component)
      }
      Object.defineProperty(Vue.prototype, '$liquidUI', {
        configurable: true,
        get: () => runtime
      })
    }
  }
}
