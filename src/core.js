import { createMaterialController } from './material/index.js'
import { createThemeController } from './theme/index.js'
export { createFormController } from './forms/controller.js'
export { createFeedbackController } from './feedback/controller.js'

export { createMaterialController, createThemeController }
export { detectCapabilities, normalizeDescriptor } from './material/index.js'

export const LIQUID_MODES = Object.freeze(['light', 'dark', 'system'])
export const LIQUID_PALETTES = Object.freeze(['blue', 'violet', 'emerald', 'amber'])
export const LIQUID_QUALITIES = Object.freeze(['auto', 'reduced', 'full'])
export const LIQUID_SURFACES = Object.freeze(['panel', 'overlay', 'control', 'navigation'])

export function createLiquidRuntime(options = {}) {
  const materialOptions = { ...(options.material ?? {}) }
  if (!Object.hasOwn(materialOptions, 'environment') && Object.hasOwn(options, 'environment')) {
    materialOptions.environment = options.environment
  }
  if (!Object.hasOwn(materialOptions, 'document') && Object.hasOwn(options, 'document')) {
    materialOptions.document = options.document
  }
  return Object.freeze({
    theme: createThemeController(options),
    material: createMaterialController(materialOptions)
  })
}
