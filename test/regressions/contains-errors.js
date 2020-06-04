const tape = require('tape')
const validator = require('../../')

tape('contains does not pollute errors', (t) => {
  const validate = validator({ type: 'array', contains: { const: 2 } }, { includeErrors: true })

  t.ok(validate([1, 2]), 'valid contains')
  t.strictEqual(validate.errors, null, 'errors object is empty')

  t.notOk(validate([1, 0]), 'invalid contains')
  t.strictEqual(validate.errors.length, 1, 'exactly one error')

  t.end()
})
