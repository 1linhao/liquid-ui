function fieldList(input, fallback) {
  if (input === undefined) return fallback
  return Array.isArray(input) ? input : [input]
}

function readPath(source, path) {
  return String(path).split('.').reduce((value, key) => value?.[key], source)
}

function isEmpty(value) {
  return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
}

function measure(value) {
  if (typeof value === 'number') return value
  if (typeof value === 'string' || Array.isArray(value)) return value.length
  return undefined
}

function defaultMessage(field, kind, limit) {
  if (kind === 'required') return `${field} is required`
  if (kind === 'pattern') return `${field} has an invalid format`
  if (kind === 'min') return `${field} must be at least ${limit}`
  if (kind === 'max') return `${field} must be at most ${limit}`
  return `${field} is invalid`
}

async function evaluateRule(ruleInput, value, values, field) {
  const rule = typeof ruleInput === 'function' ? { validator: ruleInput } : ruleInput
  if (!rule || typeof rule !== 'object') throw new TypeError(`Invalid validation rule for ${field}`)
  if (rule.required && isEmpty(value)) return rule.message ?? defaultMessage(field, 'required')
  if (isEmpty(value)) return null
  const amount = measure(value)
  if (rule.min !== undefined && amount !== undefined && amount < rule.min) return rule.message ?? defaultMessage(field, 'min', rule.min)
  if (rule.max !== undefined && amount !== undefined && amount > rule.max) return rule.message ?? defaultMessage(field, 'max', rule.max)
  if (rule.pattern) {
    rule.pattern.lastIndex = 0
    if (!rule.pattern.test(String(value))) return rule.message ?? defaultMessage(field, 'pattern')
  }
  if (!rule.validator) return null
  const result = await rule.validator(value, values, field)
  if (result === true || result === undefined || result === null) return null
  if (result === false) return rule.message ?? defaultMessage(field, 'validator')
  if (typeof result === 'string') return result
  throw new TypeError(`Validator for ${field} must return boolean, string, or nothing`)
}

export function createFormController(options = {}) {
  if (typeof options.getValues !== 'function') throw new TypeError('createFormController requires getValues()')
  let rules = options.rules ?? {}
  let errors = {}
  let destroyed = false
  const listeners = new Set()
  const versions = new Map()

  const snapshot = () => Object.freeze({
    valid: Object.values(errors).every((messages) => messages.length === 0),
    errors: Object.freeze(Object.fromEntries(Object.entries(errors).map(([field, messages]) => [field, Object.freeze([...messages])])))
  })
  const notify = () => {
    const state = snapshot()
    for (const listener of listeners) listener(state)
    return state
  }
  const validateField = async (field) => {
    if (destroyed) throw new Error('Cannot validate with a destroyed form controller')
    const version = (versions.get(field) ?? 0) + 1
    versions.set(field, version)
    const values = options.getValues() ?? {}
    const messages = []
    for (const rule of fieldList(rules[field], [])) {
      const message = await evaluateRule(rule, readPath(values, field), values, field)
      if (message) messages.push(message)
    }
    if (versions.get(field) !== version) return errors[field] ?? []
    errors = { ...errors, [field]: messages }
    notify()
    return Object.freeze([...messages])
  }
  const clear = (fields) => {
    const selected = fieldList(fields, Object.keys(errors))
    errors = { ...errors }
    selected.forEach((field) => { delete errors[field]; versions.set(field, (versions.get(field) ?? 0) + 1) })
    return notify()
  }

  return Object.freeze({
    getState: snapshot,
    async validate(fields) {
      const selected = fieldList(fields, Object.keys(rules))
      await Promise.all(selected.map(validateField))
      return snapshot()
    },
    validateField,
    clear,
    setRules(nextRules = {}) {
      if (!nextRules || typeof nextRules !== 'object') throw new TypeError('Form rules must be an object')
      rules = nextRules
      return clear()
    },
    subscribe(listener) {
      if (typeof listener !== 'function') throw new TypeError('Form listener must be a function')
      listeners.add(listener)
      listener(snapshot())
      return () => listeners.delete(listener)
    },
    destroy() {
      destroyed = true
      listeners.clear()
      versions.clear()
    }
  })
}
