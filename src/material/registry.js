const SVG_NS = 'http://www.w3.org/2000/svg'
const FILTER_CACHE_MAX = 192
const IMAGE_CACHE_MAX = 48
const documentRegistries = new WeakMap()
const imageCache = new Map()
let nextFilterId = 0
const ISOLATE_CHANNEL = Object.freeze({
  R: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0',
  G: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0',
  B: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0'
})

function touch(cache, key, value) {
  cache.delete(key)
  cache.set(key, value)
}

function boundedSet(cache, key, value, max, onEvict) {
  touch(cache, key, value)
  if (cache.size <= max) return
  const oldest = cache.entries().next().value
  cache.delete(oldest[0])
  onEvict?.(oldest[1])
}

function createElement(document, name, attributes) {
  const node = document.createElementNS(SVG_NS, name)
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)))
  return node
}

function getRegistry(document) {
  const existing = documentRegistries.get(document)
  if (existing?.host?.isConnected) return existing
  const host = createElement(document, 'svg', { width: 0, height: 0, 'aria-hidden': 'true', 'data-liquid-filter-registry': '' })
  host.style.position = 'absolute'
  host.style.pointerEvents = 'none'
  document.body.appendChild(host)
  const registry = { host, filters: new Map() }
  documentRegistries.set(document, registry)
  return registry
}

function createGlassImages(document, width, height, descriptor) {
  const key = `${width}x${height}|${descriptor.radius}|${descriptor.bezel}`
  const cached = imageCache.get(key)
  if (cached) {
    touch(imageCache, key, cached)
    return cached
  }
  const scale = width * height > 32000 ? 0.5 : 1
  const w = Math.max(1, Math.ceil(width * scale))
  const h = Math.max(1, Math.ceil(height * scale))
  const radius = Math.min(descriptor.radius * scale, w / 2, h / 2)
  const bezel = Math.max(descriptor.bezel * scale, 1)
  const mapCanvas = document.createElement('canvas')
  const specularCanvas = document.createElement('canvas')
  mapCanvas.width = specularCanvas.width = w
  mapCanvas.height = specularCanvas.height = h
  const mapContext = mapCanvas.getContext('2d')
  const specularContext = specularCanvas.getContext('2d')
  if (!mapContext || !specularContext) throw new Error('LiquidUI requires a 2D canvas context for full refraction')
  const mapImage = mapContext.createImageData(w, h)
  const specularImage = specularContext.createImageData(w, h)
  const bx = w / 2 - radius
  const by = h / 2 - radius

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const px = x + 0.5 - w / 2
      const py = y + 0.5 - h / 2
      const qx = Math.abs(px) - bx
      const qy = Math.abs(py) - by
      const ox = Math.max(qx, 0)
      const oy = Math.max(qy, 0)
      const depth = -(Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - radius)
      let nx = 0
      let ny = 0
      if (qx > 0 && qy > 0) {
        const length = Math.hypot(qx, qy) || 1
        nx = Math.sign(px) * qx / length
        ny = Math.sign(py) * qy / length
      } else if (qx > qy) nx = Math.sign(px)
      else ny = Math.sign(py)

      const normalizedDepth = depth / bezel
      const inRim = normalizedDepth >= 0 && normalizedDepth < 1
      const magnitude = inRim ? (1 - normalizedDepth) ** 2 : 0
      const index = (y * w + x) * 4
      mapImage.data[index] = Math.round(128 - nx * magnitude * 127)
      mapImage.data[index + 1] = 128
      mapImage.data[index + 2] = Math.round(128 - ny * magnitude * 127)
      mapImage.data[index + 3] = 255

      if (inRim) {
        const theta = Math.atan2(py, px)
        const band = Math.exp(-(((normalizedDepth - 0.2) / 0.4) ** 2))
        const keyLight = Math.max(Math.cos(theta - Math.atan2(-0.9, -0.45)), 0)
        const counter = Math.max(Math.cos(theta - Math.atan2(0.9, 0.5)), 0)
        const intensity = Math.min(band * (1.15 * keyLight ** 3 + 0.75 * counter ** 3.5), 1)
        specularImage.data.set([255, 255, 255, Math.round(intensity * 255)], index)
      }
    }
  }
  mapContext.putImageData(mapImage, 0, 0)
  specularContext.putImageData(specularImage, 0, 0)
  const images = { map: mapCanvas.toDataURL(), specular: specularCanvas.toDataURL() }
  boundedSet(imageCache, key, images, IMAGE_CACHE_MAX)
  return images
}

function displacement(document, scale, result) {
  const node = createElement(document, 'feDisplacementMap', {
    in: 'SourceGraphic', in2: 'map', scale, xChannelSelector: 'R', yChannelSelector: 'B'
  })
  if (result) node.setAttribute('result', result)
  return node
}

function isolateChannel(document, input, channel, result) {
  return createElement(document, 'feColorMatrix', {
    in: input,
    values: ISOLATE_CHANNEL[channel],
    result
  })
}

export function ensureFilter(document, width, height, descriptor) {
  const registry = getRegistry(document)
  const images = createGlassImages(document, width, height, descriptor)
  const key = `${width}x${height}|${descriptor.radius}|${descriptor.bezel}|${descriptor.refraction}|${descriptor.dispersion}`
  const existing = registry.filters.get(key)
  if (existing) {
    touch(registry.filters, key, existing)
    return { ...existing, cold: false }
  }
  const id = `liquid-refract-${nextFilterId++}`
  const filter = createElement(document, 'filter', {
    id, x: 0, y: 0, width, height, filterUnits: 'userSpaceOnUse', 'color-interpolation-filters': 'sRGB'
  })
  const image = createElement(document, 'feImage', { x: 0, y: 0, width, height, result: 'map' })
  image.setAttribute('href', images.map)
  filter.appendChild(image)
  if (descriptor.dispersion > 0) {
    filter.appendChild(displacement(document, descriptor.refraction * (1 - descriptor.dispersion), 'dispR'))
    filter.appendChild(isolateChannel(document, 'dispR', 'R', 'channelR'))
    filter.appendChild(displacement(document, descriptor.refraction, 'dispG'))
    filter.appendChild(isolateChannel(document, 'dispG', 'G', 'channelG'))
    filter.appendChild(displacement(document, descriptor.refraction * (1 + descriptor.dispersion), 'dispB'))
    filter.appendChild(isolateChannel(document, 'dispB', 'B', 'channelB'))
    filter.appendChild(createElement(document, 'feComposite', {
      in: 'channelR', in2: 'channelG', operator: 'arithmetic', k2: 1, k3: 1, result: 'channelsRG'
    }))
    filter.appendChild(createElement(document, 'feComposite', {
      in: 'channelsRG', in2: 'channelB', operator: 'arithmetic', k2: 1, k3: 1
    }))
  } else {
    filter.appendChild(displacement(document, descriptor.refraction))
  }
  registry.host.appendChild(filter)
  const entry = { id, images }
  boundedSet(registry.filters, key, entry, FILTER_CACHE_MAX, ({ id: evictedId }) => {
    registry.host.querySelector(`#${evictedId}`)?.remove()
  })
  return { ...entry, cold: true }
}

export function getRegistryStats(document) {
  return Object.freeze({ filters: documentRegistries.get(document)?.filters.size ?? 0, images: imageCache.size })
}
