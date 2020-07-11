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

tape('Invalid format throws', (t) => {
  const throws = (schema, message = /Unrecognized format used/) =>
    t.throws(() => validator(schema), message)
  const passes = (schema) => t.doesNotThrow(() => validator(schema))

  throws({ format: 'whatever' })
  throws({ format: ['email'] })

  passes({ format: 'email' })

  t.throws(
    () => validator({ format: 'whatever' }, { formats: { whatever: 'foo' } }),
    /Invalid format used/
  )
  t.ok(() => validator({ format: 'whatever' }, { formats: { whatever: /^x$/ } }))
  t.ok(() => validator({ format: 'whatever' }, { formats: { whatever: () => false } }))

  t.end()
})

tape('Invalid options throw', (t) => {
  const throws = (options, message) => t.throws(() => validator({}, options), message)
  const passes = (options) => t.doesNotThrow(() => validator({}, options))

  passes({ mode: 'default' })
  passes({ mode: 'lax' })
  passes({})
  throws({ mode: 'whatever' }, /Invalid mode/)
  throws({ mode: 42 }, /Invalid mode/)
  throws({ mode: 'stong' }, /Invalid mode/)
  throws({ mode: 'strong', requireValidation: false }, /Strong mode/)

  passes({ schemas: [] })
  throws({ schemas: 'not-a-valid-schemas' }, /Unexpected value for 'schemas' option/)

  t.end()
})

tape('Invalid dependencies', (t) => {
  const throws = (schema, message = /Unexpected dependen(cies|tRequired|tSchemas) entry/) =>
    t.throws(() => validator(schema), message)
  const passes = (schema) => t.doesNotThrow(() => validator(schema))

  passes({})

  passes({ dependencies: { x: false } })
  passes({ dependencies: { x: {} } })
  passes({ dependencies: { x: [] } })
  passes({ dependencies: { x: ['y'] } })

  passes({ dependentSchemas: { x: false } })
  passes({ dependentSchemas: { x: {} } })
  throws({ dependentSchemas: { x: [] } })
  throws({ dependentSchemas: { x: ['y'] } })

  throws({ dependentRequired: { x: false } })
  throws({ dependentRequired: { x: {} } })
  passes({ dependentRequired: { x: [] } })
  passes({ dependentRequired: { x: ['y'] } })

  throws({ dependentRequires: { x: false } }, /Keyword not supported/)

  t.end()
})
