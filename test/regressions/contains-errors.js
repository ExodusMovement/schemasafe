'use strict'

const tape = require('tape')
const { validator } = require('../../')

for (const allErrors of [true, false]) {
  tape(`contains does not pollute errors, allErrors=${allErrors}`, (t) => {
    const schema = { type: 'array', contains: { const: 2 } }
    const validate = validator(schema, { includeErrors: true, allErrors })

    t.ok(validate([1, 2]), 'valid contains')
    t.strictEqual(validate.errors, null, 'errors object is empty')

    t.notOk(validate([1, 0]), 'invalid contains')
    t.ok(validate.errors.length >= 1, 'at least one error')
    if (!allErrors) t.strictEqual(validate.errors.length, 1, 'exactly one error')
    t.strictEqual(validate.errors[0].schemaPath, '#/contains', 'first error is from #/contains')

    t.end()
  })
}
