const MODES = new Set(['light', 'dark', 'system'])
const PALETTES = new Set(['blue', 'violet', 'emerald', 'amber'])
const STORAGE_KEY = 'liquid-ui.palette'

function safeRead(storage, key) {
  try {
    return storage?.getItem(key)
  } catch {
    return null
  }
}

function safeWrite(storage, key, value) {
  try {
    storage?.setItem(key, value)
  } catch {
    // Storage can be unavailable in privacy modes; runtime theming must survive.
  }
}

export function createThemeController(options = {}) {
  const root = Object.hasOwn(options, 'document')
    ? options.document?.documentElement
    : globalThis.document?.documentElement
  const matchMedia = Object.hasOwn(options, 'matchMedia') ? options.matchMedia : globalThis.matchMedia
  const media = matchMedia?.('(prefers-color-scheme: dark)')
  const storedPalette = safeRead(options.paletteStorage, STORAGE_KEY)
  let mode = MODES.has(options.initialMode) ? options.initialMode : 'system'
  let palette = PALETTES.has(storedPalette)
    ? storedPalette
    : PALETTES.has(options.initialPalette) ? options.initialPalette : 'blue'
  const listeners = new Set()

  const resolvedMode = () => mode === 'system' ? (media?.matches ? 'dark' : 'light') : mode
  const snapshot = () => Object.freeze({ mode, resolvedMode: resolvedMode(), palette })
  const apply = () => {
    const state = snapshot()
    root?.setAttribute('data-liquid-mode', state.resolvedMode)
    root?.setAttribute('data-liquid-palette', state.palette)
    root?.style?.setProperty('color-scheme', state.resolvedMode)
    listeners.forEach((listener) => listener(state))
    return state
  }
  const onSystemChange = () => {
    if (mode === 'system') apply()
  }

  media?.addEventListener?.('change', onSystemChange)
  media?.addListener?.(onSystemChange)
  apply()

  return {
    getState: snapshot,
    setMode(nextMode) {
      if (!MODES.has(nextMode)) throw new TypeError(`Unknown LiquidUI mode: ${nextMode}`)
      mode = nextMode
      return apply()
    },
    setPalette(nextPalette) {
      if (!PALETTES.has(nextPalette)) throw new TypeError(`Unknown LiquidUI palette: ${nextPalette}`)
      palette = nextPalette
      safeWrite(options.paletteStorage, STORAGE_KEY, palette)
      return apply()
    },
    subscribe(listener) {
      if (typeof listener !== 'function') throw new TypeError('Theme listener must be a function')
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    destroy() {
      media?.removeEventListener?.('change', onSystemChange)
      media?.removeListener?.(onSystemChange)
      listeners.clear()
    }
  }
}
