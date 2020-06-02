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
  }, /Strong mode demands requireValidation/)

  t.doesNotThrow(() => {
    parser({}, { mode: 'default' })
  })

  t.end()
})

tape('parser works correctly', (t) => {
  let parsed

  t.strictEqual(typeof parser({ type: 'string' }), 'function', 'returns a function')

  t.throws(() => {
    parser({ type: 'integer' })('{}')
  }, /validation error/)

  t.doesNotThrow(() => {
    parsed = parser({ type: 'integer' })('10')
  })

  t.strictEqual(parsed, 10, 'result returned correctly')

  t.end()
})
