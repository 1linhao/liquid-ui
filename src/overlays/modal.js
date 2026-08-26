const scrollLocks = new WeakMap()

function lockScroll(document) {
  const root = document.documentElement
  const state = scrollLocks.get(document) ?? { count: 0, overflow: root.style.overflow }
  if (state.count === 0) root.style.overflow = 'hidden'
  state.count += 1
  scrollLocks.set(document, state)
}

function unlockScroll(document) {
  const state = scrollLocks.get(document)
  if (!state) return
  state.count -= 1
  if (state.count <= 0) {
    document.documentElement.style.overflow = state.overflow
    scrollLocks.delete(document)
  }
}

function focusableElements(root) {
  return [...root.querySelectorAll('button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.hidden && element.getAttribute?.('aria-hidden') !== 'true')
}

export function createModalLayer(options = {}) {
  const dialog = options.dialog
  const document = options.document ?? dialog?.ownerDocument ?? globalThis.document
  if (!dialog || !document?.addEventListener || !document?.documentElement) throw new TypeError('createModalLayer requires a dialog and DOM document')
  let open = false
  let destroyed = false
  let returnFocus

  const release = () => {
    document.removeEventListener('keydown', onKeyDown, true)
    dialog.removeEventListener?.('cancel', onCancel)
    dialog.removeEventListener?.('pointerdown', onPointerDown)
  }
  const close = ({ reason = 'programmatic', restoreFocus = true } = {}) => {
    if (!open || destroyed) return false
    open = false
    release()
    if (dialog.open && dialog.close) dialog.close()
    dialog.hidden = true
    dialog.removeAttribute?.('open')
    unlockScroll(document)
    options.onDismiss?.(reason)
    if (restoreFocus) returnFocus?.focus?.({ preventScroll: true })
    returnFocus = null
    return true
  }
  const onCancel = (event) => {
    event.preventDefault?.()
    if (options.closeOnEscape !== false) close({ reason: 'escape' })
  }
  const onPointerDown = (event) => {
    if (options.closeOnBackdrop !== false && event.target === dialog) close({ reason: 'backdrop' })
  }
  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      if (options.closeOnEscape !== false) { event.preventDefault?.(); close({ reason: 'escape' }) }
      return
    }
    if (event.key !== 'Tab') return
    const focusable = focusableElements(dialog)
    if (!focusable.length) { event.preventDefault?.(); dialog.focus?.(); return }
    const current = document.activeElement
    const index = focusable.indexOf(current)
    if (event.shiftKey && (index <= 0)) { event.preventDefault?.(); focusable.at(-1).focus() }
    else if (!event.shiftKey && (index < 0 || index === focusable.length - 1)) { event.preventDefault?.(); focusable[0].focus() }
  }

  return Object.freeze({
    open() {
      if (destroyed) throw new Error('Cannot open a destroyed modal layer')
      if (open) return false
      open = true
      returnFocus = options.returnFocus ?? document.activeElement
      dialog.hidden = false
      lockScroll(document)
      if (dialog.showModal) {
        try { dialog.showModal() } catch { dialog.setAttribute?.('open', '') }
      } else dialog.setAttribute?.('open', '')
      document.addEventListener('keydown', onKeyDown, true)
      dialog.addEventListener?.('cancel', onCancel)
      dialog.addEventListener?.('pointerdown', onPointerDown)
      const initial = typeof options.initialFocus === 'function' ? options.initialFocus() : options.initialFocus
      const target = initial ?? dialog.querySelector?.('[autofocus]') ?? focusableElements(dialog)[0] ?? dialog
      target?.focus?.({ preventScroll: true })
      return true
    },
    close,
    isOpen: () => open,
    destroy() {
      if (destroyed) return
      close({ reason: 'destroy', restoreFocus: false })
      release()
      destroyed = true
    }
  })
}
