'use strict'

const tape = require('tape')
const { core } = require('../src/formats')

const badDates = ['2019-02-29', '2019-02-30', '2019-02-31', '2020-02-30', '2020-02-31']

tape('date', (t) => {
  for (const d of badDates) t.strictEqual(core.date(d), false, 'date fails on invalid date')

  const check = (val) => {
    if (!core.date(val)) throw new Error(`False negative: ${val}`)
  }
  t.doesNotThrow(() => {
    const now = Date.now()
    for (let i = 0; i < 1e5; i++) {
      const string = new Date(2 * now * Math.random()).toISOString().slice(0, 10)
      check(string)
    }
  }, 'date passes on valid dates')

  t.end()
})

tape('date-time', (t) => {
  for (const d of badDates)
    t.strictEqual(core['date-time'](`${d}T12:00:00Z`), false, 'date-time fails on invalid date')

  const check = (val) => {
    if (!core['date-time'](val)) throw new Error(`False negative: ${val}`)
  }
  t.doesNotThrow(() => {
    const now = Date.now()
    for (let i = 0; i < 1e5; i++) {
      const string = new Date(2 * now * Math.random()).toISOString()
      check(string)
      check(`${string.slice(0, 19)}Z`)
      check(`${string.slice(0, 22)}Z`)
    }
  }, 'date-time passes on valid date-time values')

  t.end()
})
