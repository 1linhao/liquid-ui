export type LiquidMode = 'light' | 'dark' | 'system'
export type LiquidPalette = 'blue' | 'violet' | 'emerald' | 'amber'
export type MaterialQuality = 'auto' | 'reduced' | 'full'
export type SurfaceIntent = 'panel' | 'overlay' | 'control' | 'navigation'

export interface ThemeState {
  mode: LiquidMode
  resolvedMode: 'light' | 'dark'
  palette: LiquidPalette
}

export interface SurfaceDescriptor {
  surface?: SurfaceIntent
  width?: number
  height?: number
  radius?: number
  frost?: number
  blur?: number
  refraction?: number
  bezel?: number
  specular?: number
  saturation?: number
  dispersion?: number
  material?: 'auto' | 'frost' | 'clear'
  elevated?: boolean
}

export interface LiquidRuntime {
  theme: {
    getState(): ThemeState
    setMode(mode: LiquidMode): ThemeState
    setPalette(palette: LiquidPalette): ThemeState
    subscribe(listener: (state: ThemeState) => void): () => void
    destroy(): void
  }
  material: {
    getCapabilities(): { backdropFilter: boolean; refraction: boolean; reducedTransparency: boolean }
    getQuality(): MaterialQuality
    setQuality(quality: MaterialQuality): MaterialQuality
    subscribe(listener: (quality: MaterialQuality) => void): () => void
    preload(descriptors: SurfaceDescriptor[]): Promise<void>
  }
}

export const LIQUID_MODES: readonly LiquidMode[]
export const LIQUID_PALETTES: readonly LiquidPalette[]
export const LIQUID_QUALITIES: readonly MaterialQuality[]
export const LIQUID_SURFACES: readonly SurfaceIntent[]
export function createLiquidRuntime(options?: Record<string, unknown>): LiquidRuntime
export interface FormState {
  readonly valid: boolean
  readonly errors: Readonly<Record<string, readonly string[]>>
}
export type FormRule = {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  message?: string
  validator?: (value: unknown, values: Record<string, unknown>, field: string) => boolean | string | void | Promise<boolean | string | void>
} | ((value: unknown, values: Record<string, unknown>, field: string) => boolean | string | void | Promise<boolean | string | void>)
export interface FormController {
  getState(): FormState
  validate(fields?: string | string[]): Promise<FormState>
  validateField(field: string): Promise<readonly string[]>
  clear(fields?: string | string[]): FormState
  setRules(rules?: Record<string, FormRule | FormRule[]>): FormState
  subscribe(listener: (state: FormState) => void): () => void
  destroy(): void
}
export function createFormController(options: { getValues(): Record<string, unknown>; rules?: Record<string, FormRule | FormRule[]> }): FormController
export function createThemeController(options?: Record<string, unknown>): LiquidRuntime['theme']
export function createMaterialController(options?: Record<string, unknown>): LiquidRuntime['material']
export function detectCapabilities(environment?: unknown): LiquidRuntime['material'] extends { getCapabilities(): infer T } ? T : never
export function normalizeDescriptor(input?: SurfaceDescriptor): Readonly<SurfaceDescriptor>
