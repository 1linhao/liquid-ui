import assert from 'node:assert/strict'
import test from 'node:test'
import { createFormController } from '../src/forms/controller.js'

test('form controller validates nested controlled values through one interface', async () => {
  const model = { profile: { name: '' }, seats: 14, email: 'invalid' }
  const form = createFormController({
    getValues: () => model,
    rules: {
      'profile.name': { required: true, message: 'Name is required' },
      seats: { min: 1, max: 12 },
      email: { pattern: /^[^@]+@[^@]+$/, message: 'Email is invalid' }
    }
  })
  const states = []
  const release = form.subscribe((state) => states.push(state))
  const result = await form.validate()
  assert.equal(result.valid, false)
  assert.deepEqual(result.errors, {
    'profile.name': ['Name is required'],
    seats: ['seats must be at most 12'],
    email: ['Email is invalid']
  })

  model.profile.name = 'Ada'
  model.seats = 3
  model.email = 'ada@example.test'
  assert.equal((await form.validate()).valid, true)
  assert.ok(states.length >= 3)
  release()
  form.destroy()
})

test('form controller ignores stale async validation results', async () => {
  let model = { handle: 'taken' }
  let releaseFirst
  const first = new Promise((resolve) => { releaseFirst = resolve })
  const form = createFormController({
    getValues: () => model,
    rules: { handle: async (value) => value === 'taken' ? await first : true }
  })
  const stale = form.validateField('handle')
  model = { handle: 'available' }
  const current = form.validateField('handle')
  releaseFirst('Handle is taken')
  await Promise.all([stale, current])
  assert.deepEqual(form.getState().errors.handle, [])
})

test('form rule replacement clears obsolete errors', async () => {
  const form = createFormController({ getValues: () => ({ value: '' }), rules: { value: { required: true } } })
  await form.validate()
  assert.equal(form.getState().valid, false)
  form.setRules({})
  assert.deepEqual(form.getState(), { valid: true, errors: {} })
})

test('form controller supports callback-style ecosystem validators', async () => {
  const form = createFormController({
    getValues: () => ({ code: 'bad' }),
    rules: { code: { validator: (_rule, value, callback) => callback(value === 'good' ? undefined : new Error('Code is invalid')) } }
  })
  assert.deepEqual(await form.validateField('code'), ['Code is invalid'])
})
