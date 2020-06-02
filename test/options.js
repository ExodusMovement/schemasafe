const tape = require('tape')
const validator = require('../')

tape('dryRun', (t) => {
  t.strictEqual(typeof validator({}), 'function', 'normal usage returns a function')
  t.strictEqual(typeof validator({}, { dryRun: false }), 'function', '!dryRun returns a function')
  t.strictEqual(typeof validator({}, { dryRun: true }), 'undefined', 'dryRun returns undefined')
  t.end()
})
