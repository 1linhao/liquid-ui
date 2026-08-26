import assert from 'node:assert/strict'
import test from 'node:test'
import { createFeedbackController } from '../src/feedback/controller.js'

test('feedback messages expose deterministic lifecycle and bounded queues', () => {
  const jobs = new Map(); let jobId = 0
  const feedback = createFeedbackController({ maxMessages: 2, setTimeout: (fn) => { jobs.set(++jobId, fn); return jobId }, clearTimeout: (id) => jobs.delete(id) })
  const states = []
  feedback.subscribe((state) => states.push(state))
  feedback.message('Saved')
  feedback.notification({ id: 'sync', title: 'Sync', message: 'Running', duration: 0 })
  feedback.message({ message: 'Ready', type: 'success' })
  assert.deepEqual(feedback.getState().messages.map((item) => item.message), ['Running', 'Ready'])
  jobs.get(2)()
  assert.deepEqual(feedback.getState().messages.map((item) => item.message), ['Running'])
  assert.ok(states.length >= 4)
  feedback.destroy()
})

test('confirm and prompt requests resolve in FIFO order with cancellation values', async () => {
  const feedback = createFeedbackController()
  const confirmed = feedback.confirm('Continue?')
  const prompted = feedback.prompt({ message: 'Name?', defaultValue: 'Ada' })
  const [first, second] = feedback.getState().requests
  feedback.settleRequest(first.id, true)
  feedback.settleRequest(second.id, false, 'ignored')
  assert.equal(await confirmed, true)
  assert.equal(await prompted, null)
  feedback.destroy()
})
