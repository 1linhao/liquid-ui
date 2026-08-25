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
}

export interface LiquidUI {
  install(Vue: unknown): void
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

export function createLiquidUI(options?: Record<string, unknown>): LiquidUI
export function createThemeController(options?: Record<string, unknown>): LiquidUI['theme']
export function createMaterialController(options?: Record<string, unknown>): LiquidUI['material']
export const LiquidButton: Record<string, unknown>
export const LiquidGlassSurface: Record<string, unknown>
export const LiquidInput: Record<string, unknown>
export const LiquidNumberInput: Record<string, unknown>
export const LiquidSwitch: Record<string, unknown>
export const LiquidTag: Record<string, unknown>
