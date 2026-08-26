import type { FeedbackController, LiquidRuntime } from './core.js'

export interface LiquidUIPlugin extends LiquidRuntime {
  runtime: LiquidRuntime
  feedback: FeedbackController
  install(Vue: unknown): void
}

export function createLiquidUI(options?: Record<string, unknown> & { runtime?: LiquidRuntime }): LiquidUIPlugin
export const LiquidButton: Record<string, unknown>
export const LiquidBadge: Record<string, unknown>
export const LiquidBreadcrumb: Record<string, unknown>
export const LiquidCard: Record<string, unknown>
export const LiquidCol: Record<string, unknown>
export const LiquidDatePicker: Record<string, unknown>
export const LiquidDialog: Record<string, unknown>
export const LiquidDrawer: Record<string, unknown>
export const LiquidDescriptions: Record<string, unknown>
export const LiquidDropdown: Record<string, unknown>
export const LiquidFeedbackHost: Record<string, unknown>
export const LiquidForm: Record<string, unknown>
export const LiquidFormItem: Record<string, unknown>
export const LiquidGlassSurface: Record<string, unknown>
export const LiquidInput: Record<string, unknown>
export const LiquidIcon: Record<string, unknown>
export const LiquidIconButton: Record<string, unknown>
export const LiquidLoading: Record<string, unknown>
export const LiquidMenu: Record<string, unknown>
export const LiquidMeter: Record<string, unknown>
export const LiquidNavIcon: Record<string, unknown>
export const LiquidNumberInput: Record<string, unknown>
export const LiquidPalettePicker: Record<string, unknown>
export const LiquidPopover: Record<string, unknown>
export const LiquidProgress: Record<string, unknown>
export const LiquidRow: Record<string, unknown>
export const LiquidScrollArea: Record<string, unknown>
export const LiquidSegmented: Record<string, unknown>
export const LiquidSelect: Record<string, unknown>
export const LiquidSpinner: Record<string, unknown>
export const LiquidSwitch: Record<string, unknown>
export const LiquidTable: Record<string, unknown>
export const LiquidTableColumn: Record<string, unknown>
export const LiquidTag: Record<string, unknown>
export const LiquidTextarea: Record<string, unknown>
export const LiquidThemeToggle: Record<string, unknown>
export const LiquidTooltip: Record<string, unknown>
