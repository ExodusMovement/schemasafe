'use strict'

const tape = require('tape')
const { validator, parser } = require('../')

tape('exports', (t) => {
  t.strictEqual(typeof validator, 'function', 'validator is a function')
  t.strictEqual(typeof parser, 'function', 'parser is a function')
  t.end()
})

tape('default is strong mode', (t) => {
  t.throws(() => {
    parser({})
  }, /\[requireValidation\]/)

  t.throws(() => {
    parser({}, { requireValidation: false })
  }, /Strong mode demands/)

  t.doesNotThrow(() => {
    parser({}, { mode: 'default' })
  })

  t.end()
})

tape('parser works correctly', (t) => {
  t.strictEqual(typeof parser({ type: 'string', format: 'date' }), 'function', 'returns a function')

  {
    const result = parser({ type: 'integer' })('x')
    t.strictEqual(result.valid, false, 'Parse failed')
    t.strictEqual(result.value, undefined, 'No value is returned')
  }
  {
    const result = parser({ type: 'integer' })('{}')
    t.strictEqual(result.valid, false, 'Validation failed')
    t.strictEqual(result.value, undefined, 'No value is returned')
  }
  {
    const result = parser({ type: 'integer' })('10')
    t.strictEqual(result.valid, true, 'Validation succeded')
    t.strictEqual(result.value, 10, 'Corect value is returned')
  }

  const schema = {
    type: 'object',
    required: ['foo'],
    properties: { foo: { const: 42 } },
    additionalProperties: false,
  }
  const check = (data, message) => {
    const resultA = parser(schema)(data)
    t.strictEqual(resultA.valid, false, 'Validation failed')
    t.strictEqual(resultA.value, undefined, 'No value is returned')
    t.strictEqual(resultA.message, undefined, 'No message is returned')
    t.strictEqual(resultA.errors, undefined, 'No errors are returned')

    const resultB = parser(schema, { includeErrors: true })(data)
    t.strictEqual(resultB.valid, false, 'Validation failed')
    t.strictEqual(resultB.value, undefined, 'No value is returned')
    t.strictEqual(resultB.message, message, 'An expected message is returned')
    t.ok(Array.isArray(resultB.errors), 'Errors are returned as an array')
    t.strictEqual(resultB.errors.length, 1, 'Exactly one error is returned')
  }
  check('42', 'JSON validation failed for type at #')
  check('{}', 'JSON validation failed for required at #/foo')
  check('{"foo":"bar"}', 'JSON validation failed for const at #/foo')
  check('{"foo":42,"abc":24}', 'JSON validation failed for additionalProperties at #/abc')

  t.end()
})
