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
  let parsed

  t.strictEqual(typeof parser({ type: 'string', format: 'date' }), 'function', 'returns a function')

  t.throws(() => {
    parser({ type: 'integer' })('{}')
  }, /validation failed$/)

  t.doesNotThrow(() => {
    parsed = parser({ type: 'integer' })('10')
  })

  const schema = {
    type: 'object',
    required: ['foo'],
    properties: { foo: { const: 42 } },
    additionalProperties: false,
  }
  const check = (data, message) => {
    t.throws(
      () => parser(schema)(data),
      /validation failed$/,
      'Error location is not included if not enabled'
    )
    t.throws(
      () => parser(schema, { includeErrors: true })(data),
      message,
      `Error includes first failed location for ${data}`
    )
  }
  check('42', /validation failed for type at #$/)
  check('{}', /validation failed for required at #\/foo$/)
  check('{"foo":"bar"}', /validation failed for const at #\/foo$/)
  check('{"foo":42,"abc":24}', /validation failed for additionalProperties at #\/abc$/)

  t.strictEqual(parsed, 10, 'result returned correctly')

  t.end()
})
