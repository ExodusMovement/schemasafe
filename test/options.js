const tape = require('tape')
const validator = require('../')

tape('unknown', (t) => {
  t.throws(() => validator({}, { whatever: 1 }), /option.*whatever/)
  t.end()
})

tape('dryRun', (t) => {
  t.strictEqual(typeof validator({}), 'function', 'normal usage returns a function')
  t.strictEqual(typeof validator({}, { dryRun: false }), 'function', '!dryRun returns a function')
  t.strictEqual(typeof validator({}, { dryRun: true }), 'undefined', 'dryRun returns undefined')
  t.end()
})
