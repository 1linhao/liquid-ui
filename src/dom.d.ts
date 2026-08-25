import type { LiquidRuntime, SurfaceDescriptor } from './core.js'

export interface AnchoredOverlay {
  open(): boolean
  close(options?: { restoreFocus?: boolean; reason?: string }): boolean
  updatePosition(): void
  isOpen(): boolean
  destroy(): void
}

export function createAnchoredOverlay(options: {
  anchor: HTMLElement
  panel: HTMLElement
  document?: Document
  environment?: Window
  gutter?: number
  viewportPadding?: number
  estimatedHeight?: number
  matchWidth?: boolean
  onDismiss?: (reason: string) => void
}): AnchoredOverlay

export interface LiquidSurfaceHandle {
  readonly element: HTMLElement
  readonly contentElement: HTMLElement
  readonly runtime: LiquidRuntime
  update(descriptor?: SurfaceDescriptor): void
  destroy(): void
}

export function createLiquidSurface(options: {
  runtime?: LiquidRuntime
  document?: Document
  tagName?: string
  className?: string
  surface?: SurfaceDescriptor['surface']
  descriptor?: SurfaceDescriptor
  content?: string | number | Node | Array<string | number | Node>
}): LiquidSurfaceHandle
