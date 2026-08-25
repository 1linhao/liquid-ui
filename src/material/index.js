import { detectCapabilities } from './capabilities.js'
import { normalizeDescriptor } from './profiles.js'
import { ensureFilter } from './registry.js'

const QUALITIES = new Set(['auto', 'reduced', 'full'])

export function createMaterialController(options = {}) {
  const environment = options.environment ?? globalThis
  const capabilities = detectCapabilities(environment)
  let quality = QUALITIES.has(options.initialQuality) ? options.initialQuality : 'auto'
  const listeners = new Set()

  const resolveTier = (descriptorInput = {}) => {
    const descriptor = normalizeDescriptor(descriptorInput)
    if (descriptor.material === 'clear') return 'clear'
    if (descriptor.material === 'frost' || quality === 'reduced' || capabilities.reducedTransparency) return 'frost'
    return capabilities.refraction ? 'refract' : 'frost'
  }

  return {
    getCapabilities: () => capabilities,
    getQuality: () => quality,
    setQuality(nextQuality) {
      if (!QUALITIES.has(nextQuality)) throw new TypeError(`Unknown material quality: ${nextQuality}`)
      if (nextQuality === quality) return quality
      quality = nextQuality
      listeners.forEach((listener) => listener(quality))
      return quality
    },
    subscribe(listener) {
      if (typeof listener !== 'function') throw new TypeError('Material listener must be a function')
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    resolveTier,
    async preload(inputs = []) {
      if (!Array.isArray(inputs)) throw new TypeError('material.preload expects an array')
      const document = options.document ?? environment.document
      for (const input of inputs) {
        const descriptor = normalizeDescriptor(input)
        if (resolveTier(descriptor) !== 'refract' || !document) continue
        if (!(input.width > 0 && input.height > 0)) continue
        ensureFilter(document, Math.round(input.width), Math.round(input.height), descriptor)
      }
    }
  }
}

export { detectCapabilities, normalizeDescriptor }
export { bindGlassSurface } from './surface.js'
export { getRegistryStats } from './registry.js'
