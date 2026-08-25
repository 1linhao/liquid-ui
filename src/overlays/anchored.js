function getEnvironment(options) {
  const document = options.document ?? options.anchor?.ownerDocument ?? globalThis.document
  const environment = options.environment ?? document?.defaultView ?? globalThis.window
  if (!document?.addEventListener || !environment?.addEventListener) {
    throw new TypeError('createAnchoredOverlay requires a browser-like document and environment')
  }
  return { document, environment }
}

function place(anchor, panel, environment, options) {
  const rect = anchor.getBoundingClientRect()
  const gutter = options.gutter ?? 6
  const viewportPadding = options.viewportPadding ?? 12
  const availableWidth = Math.max(0, environment.innerWidth - viewportPadding * 2)
  const width = options.matchWidth === false
    ? Math.min(panel.offsetWidth || rect.width, availableWidth)
    : Math.min(rect.width, availableWidth)
  const panelHeight = Math.min(panel.offsetHeight || options.estimatedHeight || 320, environment.innerHeight - viewportPadding * 2)
  const roomBelow = environment.innerHeight - rect.bottom - viewportPadding
  const openAbove = roomBelow < panelHeight && rect.top - viewportPadding > roomBelow
  const left = Math.min(Math.max(viewportPadding, rect.left), environment.innerWidth - width - viewportPadding)

  Object.assign(panel.style, {
    position: 'fixed',
    left: `${left}px`,
    top: openAbove ? 'auto' : `${rect.bottom + gutter}px`,
    bottom: openAbove ? `${environment.innerHeight - rect.top + gutter}px` : 'auto',
    width: `${width}px`,
    maxHeight: `${Math.max(0, panelHeight)}px`
  })
  panel.dataset.placement = openAbove ? 'top' : 'bottom'
}

export function createAnchoredOverlay(options = {}) {
  const { anchor, panel } = options
  if (!anchor?.getBoundingClientRect || !panel?.style) {
    throw new TypeError('createAnchoredOverlay requires anchor and panel elements')
  }
  const { document, environment } = getEnvironment(options)
  let open = false
  let destroyed = false

  const updatePosition = () => {
    if (!open || destroyed) return
    place(anchor, panel, environment, options)
  }
  const finalizeClose = ({ restoreFocus = true, reason = 'programmatic' } = {}) => {
    if (!open || destroyed) return false
    open = false
    if (panel.hidePopover) {
      try { panel.hidePopover() } catch { /* not in the top layer */ }
    }
    panel.hidden = true
    options.onDismiss?.(reason)
    if (restoreFocus) anchor.focus?.({ preventScroll: true })
    return true
  }
  let closeOverlay
  const onPointerDown = (event) => {
    if (!anchor.contains(event.target) && !panel.contains(event.target)) closeOverlay({ restoreFocus: false, reason: 'outside' })
  }
  const onKeyDown = (event) => {
    if (event.key !== 'Escape') return
    event.preventDefault?.()
    closeOverlay({ reason: 'escape' })
  }
  const openOverlay = () => {
    if (destroyed) throw new Error('Cannot open a destroyed overlay')
    if (open) return false
    open = true
    panel.hidden = false
    updatePosition()
    if (panel.showPopover) {
      try { panel.showPopover() } catch { /* already promoted or unsupported */ }
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    environment.addEventListener('resize', updatePosition)
    environment.addEventListener('scroll', updatePosition, true)
    return true
  }
  const releaseListeners = () => {
    document.removeEventListener('pointerdown', onPointerDown, true)
    document.removeEventListener('keydown', onKeyDown, true)
    environment.removeEventListener('resize', updatePosition)
    environment.removeEventListener('scroll', updatePosition, true)
  }
  closeOverlay = (config) => {
    const changed = finalizeClose(config)
    if (changed) releaseListeners()
    return changed
  }

  return Object.freeze({
    open: openOverlay,
    close: closeOverlay,
    updatePosition,
    isOpen: () => open,
    destroy() {
      if (destroyed) return
      closeOverlay({ restoreFocus: false, reason: 'destroy' })
      releaseListeners()
      destroyed = true
    }
  })
}
