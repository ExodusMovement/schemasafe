'use strict'

const tape = require('tape')
const { date } = require('../src/formats').core

tape('date', (t) => {
  for (const d of ['2019-02-29', '2019-02-30', '2019-02-31', '2020-02-30', '2020-02-31'])
    t.strictEqual(date(d), false, 'Date fails on invalid date')

  t.doesNotThrow(() => {
    const now = Date.now()
    for (let i = 0; i < 1e5; i++) {
      const string = new Date(2 * now * Math.random()).toISOString().slice(0, 10)
      if (!date(string)) throw new Error('False negative!')
    }
  }, 'Date passes on valid dates')

  t.end()
})
