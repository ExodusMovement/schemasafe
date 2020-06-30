'use strict'

const tape = require('tape')
const { validator } = require('../../')

tape('allErrors do not cause a DoS (with length restrictions)', (t) => {
  const validate = validator(
    {
      type: 'object',
      properties: {
        a: { uniqueItems: true, maxItems: 10 },
        b: { pattern: '^(aa?)*$', maxLength: 10 },
        c: { const: 'valid' },
        e: { pattern: '^(aa?)*$', maxLength: 10 },
        f: { uniqueItems: true, maxItems: 10 },
      },
      propertyNames: {
        maxLength: 10,
      },
      patternProperties: {
        '^(d|dd)*$': { type: 'string' },
      },
    },
    { complexityChecks: true, includeErrors: true, allErrors: true }
  )
  const t0 = process.hrtime()
  t.notOk(
    validate({
      a: Array(1e5)
        .fill()
        .map((_, i) => [i]),
      b: `${'a'.repeat(1e5)}b`,
      c: 'nope',
      [`${'d'.repeat(1e5)}a`]: ['not a string'],
      e: 'aab',
      f: [1, 1],
    }),
    'validation fails'
  )
  const [seconds] = process.hrtime(t0)
  t.strictEqual(seconds, 0, 'validation is fast')
  t.ok(validate.errors && validate.errors.length >= 6, 'separate errors for each rule or property')
  t.end()
})
