const tape = require('tape')
const validator = require('../../')

const runWithOptions = (t, opts) => {
  t.notOk(validator({ required: [], uniqueItems: true }, opts)([1, 1]), 'required + uniqueItems')
  t.end()
}

tape('default', (t) => runWithOptions(t, {}))
tape('allErrors', (t) => runWithOptions(t, { allErrors: true }))
