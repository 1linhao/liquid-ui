import type { LiquidRuntime } from './core.js'

export interface LiquidUIPlugin extends LiquidRuntime {
  runtime: LiquidRuntime
  install(Vue: unknown): void
}

export function createLiquidUI(options?: Record<string, unknown> & { runtime?: LiquidRuntime }): LiquidUIPlugin
export const LiquidButton: Record<string, unknown>
export const LiquidDatePicker: Record<string, unknown>
export const LiquidForm: Record<string, unknown>
export const LiquidFormItem: Record<string, unknown>
export const LiquidGlassSurface: Record<string, unknown>
export const LiquidInput: Record<string, unknown>
export const LiquidNumberInput: Record<string, unknown>
export const LiquidSelect: Record<string, unknown>
export const LiquidSwitch: Record<string, unknown>
export const LiquidTag: Record<string, unknown>
