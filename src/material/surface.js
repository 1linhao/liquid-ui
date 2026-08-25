import { ensureFilter } from './registry.js'
import { normalizeDescriptor } from './profiles.js'

function setFilterStyle(layer, value) {
  if (!layer) return
  layer.style.backdropFilter = value
  layer.style.webkitBackdropFilter = value
}

export function bindGlassSurface(root, descriptorInput, materialController) {
  const descriptor = normalizeDescriptor(descriptorInput)
  const backdrop = root.querySelector('[data-liquid-layer="backdrop"]')
  const refract = root.querySelector('[data-liquid-layer="refract"]')
  const tint = root.querySelector('[data-liquid-layer="tint"]')
  const specular = root.querySelector('[data-liquid-layer="specular"]')
  let observer
  let disposed = false

  const tier = materialController.resolveTier(descriptor)
  root.classList.remove('liquid-glass--clear', 'liquid-glass--frost', 'liquid-glass--refract')
  root.classList.add(`liquid-glass--${tier}`)
  root.style.setProperty('--liquid-radius', `${descriptor.radius}px`)
  tint.style.opacity = tier === 'clear' ? '1' : String(0.25 + 0.75 * descriptor.frost)
  const effectiveBlur = descriptor.blur + descriptor.frost * 14
  setFilterStyle(backdrop, tier === 'clear' ? '' : `blur(${tier === 'frost' ? Math.max(effectiveBlur * 2, 10) : effectiveBlur}px) saturate(${descriptor.saturation})`)

  const apply = (width, height) => {
    if (disposed || tier !== 'refract' || width <= 0 || height <= 0) return
    try {
      const entry = ensureFilter(root.ownerDocument, Math.round(width), Math.round(height), descriptor)
      setFilterStyle(refract, `url(#${entry.id})`)
      specular.style.backgroundImage = `url(${entry.images.specular})`
      specular.style.opacity = String(descriptor.specular)
      if (entry.cold) {
        refract.classList.add('liquid-glass__refract--fade')
        specular.classList.add('liquid-glass__specular--fade')
        setTimeout(() => {
          refract.classList.remove('liquid-glass__refract--fade')
          specular.classList.remove('liquid-glass__specular--fade')
        }, 250)
      }
    } catch {
      root.classList.replace('liquid-glass--refract', 'liquid-glass--frost')
      setFilterStyle(backdrop, `blur(${Math.max(effectiveBlur * 2, 10)}px) saturate(${descriptor.saturation})`)
    }
  }

  if (tier === 'refract') {
    apply(root.offsetWidth, root.offsetHeight)
    const ResizeObserverClass = root.ownerDocument.defaultView?.ResizeObserver ?? globalThis.ResizeObserver
    if (ResizeObserverClass) {
      observer = new ResizeObserverClass((entries) => {
        const rect = entries[0]?.contentRect
        if (rect) apply(rect.width, rect.height)
      })
      observer.observe(root)
    }
  }

  return () => {
    disposed = true
    observer?.disconnect()
  }
}
