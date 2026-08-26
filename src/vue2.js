import { createLiquidRuntime } from './core.js'
import { LiquidGlassSurface } from './material/LiquidGlassSurface.js'
import { LiquidForm } from './forms/LiquidForm.js'
import { LiquidFormItem } from './forms/LiquidFormItem.js'
import { LiquidDialog } from './overlays/LiquidDialog.js'
import { LiquidDropdown } from './overlays/LiquidDropdown.js'
import { LiquidPopover } from './overlays/LiquidPopover.js'
import { LiquidTooltip } from './overlays/LiquidTooltip.js'
import { LiquidTable } from './data/LiquidTable.js'
import { createFeedbackController } from './feedback/controller.js'
import { LiquidFeedbackHost } from './feedback/LiquidFeedbackHost.js'
import { LiquidButton } from './primitives/LiquidButton.js'
import { LiquidDatePicker } from './primitives/LiquidDatePicker.js'
import { LiquidInput } from './primitives/LiquidInput.js'
import { LiquidNumberInput } from './primitives/LiquidNumberInput.js'
import { LiquidSelect } from './primitives/LiquidSelect.js'
import { LiquidSwitch } from './primitives/LiquidSwitch.js'
import { LiquidTag } from './primitives/LiquidTag.js'

export { LiquidButton, LiquidDatePicker, LiquidDialog, LiquidDropdown, LiquidFeedbackHost, LiquidForm, LiquidFormItem, LiquidGlassSurface, LiquidInput, LiquidNumberInput, LiquidPopover, LiquidSelect, LiquidSwitch, LiquidTable, LiquidTag, LiquidTooltip }

export function createLiquidUI(options = {}) {
  const runtime = options.runtime ?? createLiquidRuntime(options)
  const feedback = options.feedback ?? createFeedbackController(options.feedbackOptions)
  const components = { LiquidButton, LiquidDatePicker, LiquidDialog, LiquidDropdown, LiquidFeedbackHost, LiquidForm, LiquidFormItem, LiquidGlassSurface, LiquidInput, LiquidNumberInput, LiquidPopover, LiquidSelect, LiquidSwitch, LiquidTable, LiquidTag, LiquidTooltip }

  return {
    runtime,
    theme: runtime.theme,
    material: runtime.material,
    feedback,
    install(Vue) {
      for (const component of Object.values(components)) {
        Vue.component(component.name, component)
      }
      Object.defineProperty(Vue.prototype, '$liquidUI', {
        configurable: true,
        get: () => runtime
      })
      Object.defineProperty(Vue.prototype, '$liquidFeedback', { configurable: true, get: () => feedback })
    }
  }
}
