'use strict'

const tape = require('tape')
const { validator } = require('..')

tape('$ref throws on invalid refs', (t) => {
  const throws = (schema, message = /failed to resolve \$ref/) =>
    t.throws(() => validator(schema), message)
  const passes = (schema) => t.doesNotThrow(() => validator(schema))

  throws({ $ref: 'foo' })
  throws({ $ref: '#foo' })

  throws({ $ref: '#/$ref' }, /Schema is not an object/)
  throws({ $ref: '#/$defs', $defs: 'string' }, /Schema is not an object/)
  throws({ $ref: '#/$defs/a', $defs: { a: [] } }, /Schema is not an object/)
  throws({ $ref: '#/$defs/a', $defs: { a: 'string' } }, /Schema is not an object/)

  passes({ $ref: '#/$defs', $defs: {} })

  t.end()
})
