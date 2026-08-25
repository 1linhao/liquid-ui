import type { LiquidRuntime, SurfaceDescriptor } from './core.js'

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
