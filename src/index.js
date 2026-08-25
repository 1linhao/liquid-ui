import { createMaterialController } from './material/index.js'
import { createThemeController } from './theme/index.js'
import { LiquidButton } from './primitives/LiquidButton.js'
import { LiquidInput } from './primitives/LiquidInput.js'
import { LiquidNumberInput } from './primitives/LiquidNumberInput.js'
import { LiquidSwitch } from './primitives/LiquidSwitch.js'
import { LiquidTag } from './primitives/LiquidTag.js'
import { LiquidGlassSurface } from './material/LiquidGlassSurface.js'

export { createMaterialController, createThemeController }
export { LiquidButton, LiquidGlassSurface, LiquidInput, LiquidNumberInput, LiquidSwitch, LiquidTag }

export function createLiquidUI(options = {}) {
  const theme = createThemeController(options)
  const material = createMaterialController(options.material)
  const components = { LiquidButton, LiquidGlassSurface, LiquidInput, LiquidNumberInput, LiquidSwitch, LiquidTag }

  return {
    theme,
    material,
    install(Vue) {
      for (const component of Object.values(components)) {
        Vue.component(component.name, component)
      }
      Object.defineProperty(Vue.prototype, '$liquidUI', {
        configurable: true,
        get: () => ({ theme, material })
      })
    }
  }
}
