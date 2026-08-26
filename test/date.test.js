import assert from 'node:assert/strict'
import test from 'node:test'
import { addDays, addMonths, calendarMonth, compareDates, formatDateLabel, isDateUnavailable, parseISODate, toISODate } from '../src/primitives/date.js'

test('ISO date helpers reject rollover and stay timezone neutral', () => {
  assert.deepEqual(parseISODate('2028-02-29'), { year: 2028, month: 2, day: 29 })
  assert.equal(parseISODate('2027-02-29'), null)
  assert.equal(parseISODate('02/20/2028'), null)
  assert.equal(toISODate(addDays(parseISODate('2028-02-28'), 2)), '2028-03-01')
  assert.equal(toISODate(addMonths(parseISODate('2028-01-31'), 1)), '2028-02-29')
  assert.ok(compareDates(parseISODate('2028-01-01'), parseISODate('2028-01-02')) < 0)
})

test('calendar month always exposes a complete six-week keyboard grid', () => {
  const cells = calendarMonth(parseISODate('2028-02-10'), { value: '2028-02-29', today: '2028-02-14', weekStartsOn: 1 })
  assert.equal(cells.length, 42)
  assert.equal(cells[0].value, '2028-01-31')
  assert.equal(cells.at(-1).value, '2028-03-12')
  assert.equal(cells.find((cell) => cell.selected).value, '2028-02-29')
  assert.equal(cells.find((cell) => cell.today).value, '2028-02-14')
})

test('calendar availability combines range and host predicate', () => {
  const options = { min: '2028-02-05', max: '2028-02-20', disabledDate: (value) => value.endsWith('-14') }
  assert.equal(isDateUnavailable(parseISODate('2028-02-04'), options), true)
  assert.equal(isDateUnavailable(parseISODate('2028-02-14'), options), true)
  assert.equal(isDateUnavailable(parseISODate('2028-02-15'), options), false)
  assert.equal(isDateUnavailable(parseISODate('2028-02-21'), options), true)
})

test('date labels use the requested locale with UTC calendar semantics', () => {
  assert.match(formatDateLabel(parseISODate('2028-02-29'), 'en-US'), /February 29, 2028/)
  assert.match(formatDateLabel(parseISODate('2028-02-29'), 'zh-CN'), /2028年2月29日/)
})
