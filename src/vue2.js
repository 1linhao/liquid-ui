import { createLiquidRuntime } from './core.js'
import { LiquidGlassSurface } from './material/LiquidGlassSurface.js'
import { LiquidForm } from './forms/LiquidForm.js'
import { LiquidFormItem } from './forms/LiquidFormItem.js'
import { LiquidDialog } from './overlays/LiquidDialog.js'
import { LiquidDrawer } from './overlays/LiquidDrawer.js'
import { LiquidDropdown } from './overlays/LiquidDropdown.js'
import { LiquidPopover } from './overlays/LiquidPopover.js'
import { LiquidTooltip } from './overlays/LiquidTooltip.js'
import { LiquidTable } from './data/LiquidTable.js'
import { LiquidTableColumn } from './data/LiquidTableColumn.js'
import { LiquidBadge } from './data/LiquidBadge.js'
import { LiquidCard } from './data/LiquidCard.js'
import { LiquidDescriptions } from './data/LiquidDescriptions.js'
import { LiquidMeter } from './data/LiquidMeter.js'
import { createFeedbackController } from './feedback/controller.js'
import { LiquidFeedbackHost } from './feedback/LiquidFeedbackHost.js'
import { LiquidLoading } from './feedback/LiquidLoading.js'
import { LiquidCol } from './layout/LiquidCol.js'
import { LiquidRow } from './layout/LiquidRow.js'
import { LiquidBreadcrumb } from './navigation/LiquidBreadcrumb.js'
import { LiquidMenu } from './navigation/LiquidMenu.js'
import { LiquidNavIcon } from './navigation/LiquidNavIcon.js'
import { LiquidButton } from './primitives/LiquidButton.js'
import { LiquidDatePicker } from './primitives/LiquidDatePicker.js'
import { LiquidInput } from './primitives/LiquidInput.js'
import { LiquidIcon } from './primitives/LiquidIcon.js'
import { LiquidIconButton } from './primitives/LiquidIconButton.js'
import { LiquidNumberInput } from './primitives/LiquidNumberInput.js'
import { LiquidSelect } from './primitives/LiquidSelect.js'
import { LiquidSegmented } from './primitives/LiquidSegmented.js'
import { LiquidSpinner } from './primitives/LiquidSpinner.js'
import { LiquidProgress } from './primitives/LiquidProgress.js'
import { LiquidScrollArea } from './primitives/LiquidScrollArea.js'
import { LiquidSwitch } from './primitives/LiquidSwitch.js'
import { LiquidTag } from './primitives/LiquidTag.js'
import { LiquidTextarea } from './primitives/LiquidTextarea.js'
import { LiquidPalettePicker } from './theme/LiquidPalettePicker.js'
import { LiquidThemeToggle } from './theme/LiquidThemeToggle.js'

export { LiquidBadge, LiquidBreadcrumb, LiquidButton, LiquidCard, LiquidCol, LiquidDatePicker, LiquidDescriptions, LiquidDialog, LiquidDrawer, LiquidDropdown, LiquidFeedbackHost, LiquidForm, LiquidFormItem, LiquidGlassSurface, LiquidIcon, LiquidIconButton, LiquidInput, LiquidLoading, LiquidMenu, LiquidMeter, LiquidNavIcon, LiquidNumberInput, LiquidPalettePicker, LiquidPopover, LiquidProgress, LiquidRow, LiquidScrollArea, LiquidSegmented, LiquidSelect, LiquidSpinner, LiquidSwitch, LiquidTable, LiquidTableColumn, LiquidTag, LiquidTextarea, LiquidThemeToggle, LiquidTooltip }

export function createLiquidUI(options = {}) {
  const runtime = options.runtime ?? createLiquidRuntime(options)
  const feedback = options.feedback ?? createFeedbackController(options.feedbackOptions)
  const components = { LiquidBadge, LiquidBreadcrumb, LiquidButton, LiquidCard, LiquidCol, LiquidDatePicker, LiquidDescriptions, LiquidDialog, LiquidDrawer, LiquidDropdown, LiquidFeedbackHost, LiquidForm, LiquidFormItem, LiquidGlassSurface, LiquidIcon, LiquidIconButton, LiquidInput, LiquidLoading, LiquidMenu, LiquidMeter, LiquidNavIcon, LiquidNumberInput, LiquidPalettePicker, LiquidPopover, LiquidProgress, LiquidRow, LiquidScrollArea, LiquidSegmented, LiquidSelect, LiquidSpinner, LiquidSwitch, LiquidTable, LiquidTableColumn, LiquidTag, LiquidTextarea, LiquidThemeToggle, LiquidTooltip }

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
