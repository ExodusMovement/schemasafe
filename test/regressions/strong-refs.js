'use strict'

const tape = require('tape')
const { validator } = require('../../')

tape('refs require validation in strong mode', (t) => {
  t.doesNotThrow(() => {
    validator(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        propertyNames: { pattern: '^[a-z]+$' },
        definitions: {
          goodString: { type: 'string', pattern: '^a+$' },
        },
        additionalProperties: {
          anyOf: [{ type: 'number' }, { $ref: '#/definitions/goodString' }],
        },
      },
      { mode: 'strong' }
    )
  })
  t.throws(() => {
    validator(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        propertyNames: { pattern: '^[a-z]+$' },
        definitions: {
          badString: { type: 'string', pattern: '^a+' },
        },
        additionalProperties: {
          anyOf: [{ type: 'number' }, { $ref: '#/definitions/badString' }],
        },
      },
      { mode: 'strong' }
    )
  }, /Should start with \^ and end with \$: /)

  t.doesNotThrow(() => {
    validator(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        propertyNames: { pattern: '^[a-z]+$' },
        definitions: {
          goodObject: {
            type: 'object',
            required: [],
            properties: { a: { type: 'number' } },
            additionalProperties: false,
          },
        },
        additionalProperties: {
          anyOf: [{ type: 'number' }, { $ref: '#/definitions/goodObject' }],
        },
      },
      { mode: 'strong' }
    )
  })
  t.throws(() => {
    validator(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        propertyNames: { pattern: '^[a-z]+$' },
        definitions: {
          badObject: { type: 'object', required: [], properties: { a: { type: 'number' } } },
        },
        additionalProperties: {
          anyOf: [{ type: 'number' }, { $ref: '#/definitions/badObject' }],
        },
      },
      { mode: 'strong' }
    )
  }, /\[requireValidation\] additionalProperties /)

  t.end()
})

tape('cyclic ref passes if fully covers the object', (t) => {
  t.doesNotThrow(() => {
    const validate = validator(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        propertyNames: { pattern: '^[a-z]+$' },
        additionalProperties: {
          anyOf: [{ type: 'number' }, { $ref: '#' }],
        },
      },
      { mode: 'strong' }
    )

    t.ok(validate({}), '{}')
    t.ok(validate({ foo: 3 }), '{foo:3}')
    t.notOk(validate({ FOO: 3 }), '{FOO:3}')
    t.notOk(validate({ foo: [] }), '{foo:[]}')

    t.ok(validate({ x: {} }), '{x:{}}')
    t.notOk(validate({ X: {} }), '{X:{}}')
    t.ok(validate({ x: { foo: 3 } }), '{x:{foo:3}}')
    t.notOk(validate({ x: { FOO: 3 } }), '{x:{FOO:3}}')
    t.notOk(validate({ x: { foo: [] } }), '{x:{foo:[]}}')
  })

  t.end()
})
