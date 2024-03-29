'use strict'

const tape = require('tape')
const { validator, parser } = require('..')

tape('$ref throws on invalid refs', (t) => {
  const throws = (schema, message = /failed to resolve \$ref/) =>
    t.throws(() => validator(schema), message)
  const passes = (schema) => t.doesNotThrow(() => validator(schema))

  throws({ $ref: 'foo' })
  throws({ $ref: '#foo' })

  throws({ $ref: '#/$ref' }, /Schema is not an object/)
  throws({ $ref: '#/$defs', $defs: 'string' }, /Unexpected type for "?\$defs"? at #/)
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
  throws({ format: ['email'] }, /Unexpected type for "?format"? at #/)

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

  passes({ isJSON: true })
  passes({ jsonCheck: true })
  passes({ isJSON: true, jsonCheck: false })
  passes({ isJSON: false, jsonCheck: true })
  throws({ isJSON: true, jsonCheck: true }, /Can not specify.* isJSON and jsonCheck/)

  passes({ schemas: [] })
  throws({ schemas: 'not-a-valid-schemas' }, /Unexpected value for 'schemas' option/)

  t.end()
})

tape('Invalid parser options throw', (t) => {
  const schema = { $schema: 'http://json-schema.org/draft/2019-09/schema#', type: 'number' }
  const throws = (options, message) => t.throws(() => parser(schema, options), message)
  const passes = (options) => t.doesNotThrow(() => parser(schema, options))

  passes({})
  throws({ isJSON: true }, /not applicable in parser mode/)
  throws({ jsonCheck: true }, /not applicable in parser mode/)

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

tape('Invalid max/min', (t) => {
  const throws = (schema, message = /Invalid (min|max)(imum|Items|Properties)/) =>
    t.throws(() => validator(schema), message)
  const passes = (schema) => t.doesNotThrow(() => validator(schema))

  passes({})

  passes({ items: [true, true, true], maxItems: 3 })
  passes({ items: [true, true, true], maxItems: 4 })
  throws({ items: [true, true, true], maxItems: 2 })

  passes({ minItems: 2, maxItems: 3 })
  passes({ minItems: 3, maxItems: 3 })
  throws({ minItems: 3, maxItems: 2 })

  passes({ minProperties: 2, maxProperties: 3 })
  passes({ minProperties: 3, maxProperties: 3 })
  throws({ minProperties: 3, maxProperties: 2 })

  passes({ minimum: 2, maximum: 3 })
  passes({ minimum: 3, maximum: 3 })
  throws({ minimum: 3, maximum: 2 })

  t.end()
})

tape('Invalid default', (t) => {
  t.doesNotThrow(() => validator({ default: {} }, { useDefaults: false }))
  t.doesNotThrow(() => validator({ items: [{ default: {} }] }, { useDefaults: true }))
  t.throws(
    () => validator({ default: {} }, { useDefaults: true }),
    /Can not apply default value here/
  )
  t.end()
})

tape('Invalid required', (t) => {
  t.throws(() =>
    validator({
      type: 'object',
      required: ['foo', 'bar', 'bax'],
      properties: {
        foo: {
          type: 'number',
        },
      },
      additionalProperties: false,
    })
  )
  t.doesNotThrow(() =>
    validator({
      type: 'object',
      required: ['foo', 'bar', 'bax'],
      properties: {
        foo: {
          type: 'number',
        },
      },
      additionalProperties: true,
    })
  )
  t.doesNotThrow(() =>
    validator({
      type: 'object',
      required: ['foo', 'bar', 'bax'],
      properties: {
        foo: {
          type: 'number',
        },
      },
      additionalProperties: { type: 'number' },
      unevaluatedProperties: false,
    })
  )
  t.doesNotThrow(() =>
    validator({
      type: 'object',
      required: ['foo', 'bar', 'bax'],
      properties: {
        foo: {
          type: 'number',
        },
      },
      patternProperties: {
        '^.*x$': {
          type: 'number',
        },
      },
      allOf: [
        {
          required: [],
          properties: {
            bar: {
              type: 'number',
            },
          },
        },
      ],
      unevaluatedProperties: false,
    })
  )
  t.throws(
    () =>
      validator({
        type: 'object',
        required: ['foo', 'bar', 'bax'],
        properties: {
          foo: {
            type: 'number',
          },
        },
        patternProperties: {
          '^.*y$': {
            type: 'number',
          },
        },
        allOf: [
          {
            required: [],
            properties: {
              bar: {
                type: 'number',
              },
            },
          },
        ],
        unevaluatedProperties: false,
      }),
    /Unknown required property: "bax"/
  )
  t.throws(
    () =>
      validator({
        type: 'object',
        required: [],
        properties: {
          foo: {
            type: 'number',
          },
        },
        allOf: [
          {
            required: ['foo', 'bar'],
          },
        ],
        unevaluatedProperties: false,
      }),
    /Unknown required property: "bar"/
  )
  t.throws(
    () =>
      validator({
        type: 'object',
        required: [],
        properties: {
          foo: {
            type: 'number',
          },
        },
        allOf: [
          {
            required: ['foo', 'bar'],
          },
        ],
        additionalProperties: false,
      }),
    /Unknown required property: "bar"/
  )
  t.end()
})
