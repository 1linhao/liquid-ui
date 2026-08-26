const TYPES = new Set(['info', 'success', 'warning', 'danger'])

function normalizeText(value, field) {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${field} must be a non-empty string`)
  return value.trim()
}

export function createFeedbackController(options = {}) {
  const schedule = options.setTimeout ?? globalThis.setTimeout
  const cancelSchedule = options.clearTimeout ?? globalThis.clearTimeout
  let sequence = 0
  let destroyed = false
  let messages = []
  let requests = []
  const listeners = new Set()
  const timers = new Map()
  const resolvers = new Map()

  const snapshot = () => Object.freeze({ messages: Object.freeze([...messages]), requests: Object.freeze([...requests]) })
  const notify = () => {
    const state = snapshot()
    for (const listener of listeners) listener(state)
    return state
  }
  const nextId = (prefix) => `${prefix}-${++sequence}`

  function dismiss(id, reason = 'dismiss') {
    const current = messages.find((item) => item.id === id)
    if (!current) return snapshot()
    const timer = timers.get(id)
    if (timer !== undefined) cancelSchedule(timer)
    timers.delete(id)
    messages = messages.filter((item) => item.id !== id)
    options.onDismiss?.(current, reason)
    return notify()
  }

  function show(kind, input) {
    if (destroyed) throw new Error('feedback controller has been destroyed')
    const source = typeof input === 'string' ? { message: input } : { ...input }
    const type = source.type ?? 'info'
    if (!TYPES.has(type)) throw new TypeError(`Unsupported feedback type: ${type}`)
    const duration = source.duration === 0 ? 0 : Math.max(500, Number(source.duration ?? (kind === 'message' ? 3000 : 5000)))
    const item = Object.freeze({
      id: source.id ?? nextId(kind), kind, type,
      title: source.title ? normalizeText(source.title, 'title') : '',
      message: normalizeText(source.message, 'message'),
      duration,
      actionLabel: source.actionLabel ? normalizeText(source.actionLabel, 'actionLabel') : ''
    })
    if (messages.some((entry) => entry.id === item.id)) dismiss(item.id, 'replace')
    const nextMessages = [...messages, item].slice(-(options.maxMessages ?? 5))
    for (const previous of messages) {
      if (!nextMessages.includes(previous) && timers.has(previous.id)) {
        cancelSchedule(timers.get(previous.id)); timers.delete(previous.id)
      }
    }
    messages = nextMessages
    notify()
    if (duration > 0) timers.set(item.id, schedule(() => dismiss(item.id, 'timeout'), duration))
    return Object.freeze({ id: item.id, close: () => dismiss(item.id, 'api') })
  }

  function ask(kind, input) {
    if (destroyed) return Promise.reject(new Error('feedback controller has been destroyed'))
    const source = typeof input === 'string' ? { message: input } : { ...input }
    return new Promise((resolve) => {
      const request = Object.freeze({
        id: nextId(kind), kind,
        title: source.title ? normalizeText(source.title, 'title') : (kind === 'confirm' ? 'Confirm' : 'Prompt'),
        message: normalizeText(source.message, 'message'),
        confirmText: source.confirmText ?? 'Confirm', cancelText: source.cancelText ?? 'Cancel',
        placeholder: source.placeholder ?? '', defaultValue: source.defaultValue ?? ''
      })
      resolvers.set(request.id, resolve)
      requests = [...requests, request]
      notify()
    })
  }

  function settleRequest(id, accepted, value = '') {
    const request = requests.find((item) => item.id === id)
    if (!request) return snapshot()
    requests = requests.filter((item) => item.id !== id)
    resolvers.get(id)?.(request.kind === 'confirm' ? Boolean(accepted) : (accepted ? String(value) : null))
    resolvers.delete(id)
    return notify()
  }

  return Object.freeze({
    getState: snapshot,
    subscribe(listener) { if (destroyed) throw new Error('feedback controller has been destroyed'); listeners.add(listener); listener(snapshot()); return () => listeners.delete(listener) },
    message: (input) => show('message', input),
    notification: (input) => show('notification', input),
    dismiss,
    clear() { for (const id of timers.keys()) cancelSchedule(timers.get(id)); timers.clear(); messages = []; return notify() },
    confirm: (input) => ask('confirm', input),
    prompt: (input) => ask('prompt', input),
    settleRequest,
    destroy() {
      if (destroyed) return
      for (const id of timers.keys()) cancelSchedule(timers.get(id))
      for (const request of requests) resolvers.get(request.id)?.(request.kind === 'confirm' ? false : null)
      resolvers.clear()
      timers.clear(); messages = []; requests = []; listeners.clear(); destroyed = true
    }
  })
}
