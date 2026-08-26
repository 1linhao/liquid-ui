import { createLiquidRuntime } from './core.js'
import { bindGlassSurface } from './material/surface.js'

export { createAnchoredOverlay } from './overlays/anchored.js'
export { createModalLayer } from './overlays/modal.js'

const LAYERS = ['backdrop', 'refract', 'tint', 'specular']

function appendContent(contentElement, content) {
  if (content === undefined || content === null) return
  if (Array.isArray(content)) {
    content.forEach((item) => appendContent(contentElement, item))
    return
  }
  if (typeof content === 'string' || typeof content === 'number') {
    contentElement.append(String(content))
    return
  }
  if (typeof content.nodeType === 'number') {
    contentElement.appendChild(content)
    return
  }
  throw new TypeError('Liquid surface content must be text, a DOM Node, or an array of them')
}

function createLayer(document, name) {
  const layer = document.createElement('span')
  layer.className = `liquid-glass__${name}`
  layer.setAttribute('data-liquid-layer', name)
  layer.setAttribute('aria-hidden', 'true')
  return layer
}

export function createLiquidSurface(options = {}) {
  const document = options.document ?? globalThis.document
  if (!document?.createElement) throw new TypeError('createLiquidSurface requires a DOM document')
  const runtime = options.runtime ?? createLiquidRuntime({ ...options, document })
  if (!runtime?.material?.resolveTier) throw new TypeError('createLiquidSurface requires a Liquid runtime')

  const element = document.createElement(options.tagName ?? 'div')
  element.className = ['liquid-glass', options.className].filter(Boolean).join(' ')
  const layers = LAYERS.map((name) => createLayer(document, name))
  const shine = document.createElement('span')
  shine.className = 'liquid-glass__shine'
  shine.setAttribute('aria-hidden', 'true')
  const contentElement = document.createElement('div')
  contentElement.className = 'liquid-glass__content'
  layers.forEach((layer) => element.appendChild(layer))
  element.appendChild(shine)
  element.appendChild(contentElement)
  appendContent(contentElement, options.content)

  let descriptor = { ...(options.descriptor ?? {}), surface: options.surface ?? options.descriptor?.surface ?? 'panel' }
  let releaseBinding
  let destroyed = false
  const bind = () => {
    if (destroyed) return
    releaseBinding?.()
    element.classList.toggle('liquid-glass--elevated', Boolean(descriptor.elevated))
    releaseBinding = bindGlassSurface(element, descriptor, runtime.material)
  }
  const releaseQuality = runtime.material.subscribe(bind)
  bind()

  return Object.freeze({
    element,
    contentElement,
    runtime,
    update(nextDescriptor = {}) {
      if (destroyed) throw new Error('Cannot update a destroyed Liquid surface')
      descriptor = { ...descriptor, ...nextDescriptor }
      bind()
    },
    destroy() {
      if (destroyed) return
      destroyed = true
      releaseBinding?.()
      releaseQuality()
      element.remove()
    }
  })
}
