'use strict'

const tape = require('tape')
const cosmic = require('./fixtures/cosmic')
const { validator } = require('../')

tape('simple', function(t) {
  const schema = {
    type: 'object',
    required: ['hello'],
    properties: {
      hello: { type: 'string' },
    },
  }

  const validate = validator(schema)

  t.ok(validate({ hello: 'world' }), 'should be valid')
  t.notOk(validate(), 'should be invalid')
  t.notOk(validate({}), 'should be invalid')
  t.end()
})

tape('data is undefined', function(t) {
  const validate = validator({ type: 'string' })

  t.notOk(validate(null))
  t.notOk(validate(undefined))
  t.end()
})

tape('advanced', function(t) {
  const validate = validator(cosmic.schema)

  t.ok(validate(cosmic.valid), 'should be valid')
  t.notOk(validate(cosmic.invalid), 'should be invalid')
  t.end()
})

tape('allErrors/false', function(t) {
  const validate = validator(
    {
      type: 'object',
      properties: {
        x: {
          type: 'number',
        },
      },
      required: ['x', 'y'],
    },
    { includeErrors: true, allErrors: false }
  )
  t.notOk(validate({}), 'should be invalid')
  t.strictEqual(validate.errors.length, 1)
  t.strictEqual(validate.errors[0].dataPath, '#/x')
  t.strictEqual(validate.errors[0].schemaPath, '#/required')
  t.notOk(validate({ x: 'string' }), 'should be invalid')
  t.strictEqual(validate.errors.length, 1)
  t.strictEqual(validate.errors[0].dataPath, '#/y')
  t.strictEqual(validate.errors[0].schemaPath, '#/required')
  t.notOk(validate({ x: 'string', y: 'value' }), 'should be invalid')
  t.strictEqual(validate.errors.length, 1)
  t.strictEqual(validate.errors[0].dataPath, '#/x')
  t.strictEqual(validate.errors[0].schemaPath, '#/properties/x/type')
  t.end()
})

tape('allErrors/true', function(t) {
  const validate = validator(
    {
      type: 'object',
      properties: {
        x: {
          type: 'number',
        },
      },
      required: ['x', 'y'],
    },
    { includeErrors: true, allErrors: true }
  )
  t.notOk(validate({}), 'should be invalid')
  t.strictEqual(validate.errors.length, 2)
  t.strictEqual(validate.errors[0].dataPath, '#/x')
  t.strictEqual(validate.errors[0].schemaPath, '#/required')
  t.strictEqual(validate.errors[1].dataPath, '#/y')
  t.strictEqual(validate.errors[1].schemaPath, '#/required')
  t.notOk(validate({ x: 'string' }), 'should be invalid')
  t.strictEqual(validate.errors.length, 2)
  t.strictEqual(validate.errors[0].dataPath, '#/y')
  t.strictEqual(validate.errors[0].schemaPath, '#/required')
  t.strictEqual(validate.errors[1].dataPath, '#/x')
  t.strictEqual(validate.errors[1].schemaPath, '#/properties/x/type')
  t.notOk(validate({ x: 'string', y: 'value' }), 'should be invalid')
  t.strictEqual(validate.errors.length, 1)
  t.strictEqual(validate.errors[0].dataPath, '#/x')
  t.strictEqual(validate.errors[0].schemaPath, '#/properties/x/type')
  t.ok(validate({ x: 1, y: 'value' }), 'should be invalid')
  t.end()
})

tape('additional props', function(t) {
  const validate = validator(
    {
      type: 'object',
      additionalProperties: false,
    },
    { includeErrors: true, reflectErrorsValue: true }
  )

  t.ok(validate({}))
  t.notOk(validate({ foo: 'bar' }))
  t.ok(validate.errors[0].value === 'bar', 'should output the property not allowed in verbose mode')
  t.end()
})

tape('array', function(t) {
  const validate = validator({
    type: 'array',
    items: {
      type: 'string',
    },
  })

  t.notOk(validate({}), 'wrong type')
  t.ok(validate(['test']))
  t.end()
})

tape('nested array', function(t) {
  const validate = validator({
    type: 'object',
    required: ['list'],
    properties: {
      list: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  })

  t.notOk(validate({}), 'is required')
  t.ok(validate({ list: ['test'] }))
  t.notOk(validate({ list: [1] }))
  t.end()
})

tape('enum', function(t) {
  const validate = validator({
    type: 'object',
    required: ['foo'],
    properties: {
      foo: {
        type: 'number',
        enum: [42],
      },
    },
  })

  t.notOk(validate({}), 'is required')
  t.ok(validate({ foo: 42 }))
  t.notOk(validate({ foo: 43 }))
  t.end()
})

tape('minimum/maximum', function(t) {
  const validate = validator({
    type: 'object',
    properties: {
      foo: {
        type: 'number',
        minimum: 0,
        maximum: 0,
      },
    },
  })

  t.notOk(validate({ foo: -42 }))
  t.ok(validate({ foo: 0 }))
  t.notOk(validate({ foo: 42 }))
  t.end()
})

tape('exclusiveMinimum/exclusiveMaximum', function(t) {
  const validate = validator({
    type: 'object',
    properties: {
      foo: {
        type: 'number',
        minimum: 10,
        maximum: 20,
        exclusiveMinimum: true,
        exclusiveMaximum: true,
      },
    },
  })

  t.notOk(validate({ foo: 10 }))
  t.ok(validate({ foo: 11 }))
  t.notOk(validate({ foo: 20 }))
  t.ok(validate({ foo: 19 }))
  t.end()
})

tape('minimum/maximum number type', function(t) {
  const validate = validator({
    type: ['integer', 'null'],
    minimum: 1,
    maximum: 100,
  })

  t.notOk(validate(-1))
  t.notOk(validate(0))
  t.ok(validate(null))
  t.ok(validate(1))
  t.ok(validate(100))
  t.notOk(validate(101))
  t.end()
})

tape('custom format', function(t) {
  const validate = validator(
    {
      type: 'object',
      properties: {
        foo: {
          type: 'string',
          format: 'as',
        },
      },
    },
    { formats: { as: /^a+$/ } }
  )

  t.notOk(validate({ foo: '' }), 'not as')
  t.notOk(validate({ foo: 'b' }), 'not as')
  t.notOk(validate({ foo: 'aaab' }), 'not as')
  t.ok(validate({ foo: 'a' }), 'as')
  t.ok(validate({ foo: 'aaaaaa' }), 'as')
  t.end()
})

tape('custom format string or null', (t) => {
  const validate = validator(
    {
      type: 'object',
      properties: {
        foo: {
          type: ['string', 'null'],
          format: 'as',
        },
      },
    },
    { formats: { as: /^a+$/ } }
  )

  t.notOk(validate({ foo: '' }), 'not as')
  t.notOk(validate({ foo: 'bar' }), 'not as')
  t.notOk(validate({ foo: 123 }), 'not as if number')
  t.ok(validate({ foo: 'a' }), 'as')
  t.ok(validate({ foo: null }), 'as')
  t.end()
})

tape('custom format function', function(t) {
  const validate = validator(
    {
      type: 'object',
      properties: {
        foo: {
          type: 'string',
          format: 'as',
        },
      },
    },
    {
      formats: {
        as: function(s) {
          return /^a+$/.test(s)
        },
      },
    }
  )

  t.notOk(validate({ foo: '' }), 'not as')
  t.notOk(validate({ foo: 'b' }), 'not as')
  t.notOk(validate({ foo: 'aaab' }), 'not as')
  t.ok(validate({ foo: 'a' }), 'as')
  t.ok(validate({ foo: 'aaaaaa' }), 'as')
  t.end()
})

tape('unknown format throws errors', function(t) {
  t.throws(function() {
    validator({ type: 'string', format: 'foobar' })
  }, /Unrecognized format used/)

  t.end()
})

tape('do not mutate schema', function(t) {
  const sch = {
    items: [{}],
    additionalItems: {
      type: 'integer',
    },
  }

  const copy = JSON.parse(JSON.stringify(sch))

  validator(sch)

  t.same(sch, copy, 'did not mutate')
  t.end()
})

tape('#toJSON()', function(t) {
  const schema = {
    type: 'object',
    required: ['hello'],
    properties: {
      hello: { type: 'string' },
    },
  }

  const validate = validator(schema)

  t.deepEqual(validate.toJSON(), schema, 'should return original schema')
  t.end()
})

tape('external schemas', function(t) {
  const ext = { type: 'string' }
  const schema = {
    $ref: 'ext#',
  }

  const validate = validator(schema, { schemas: { ext: ext } })

  t.ok(validate('hello string'), 'is a string')
  t.notOk(validate(42), 'not a string')
  t.end()
})

tape('external schema URIs', function(t) {
  const ext = { type: 'string' }
  const schema = {
    $ref: 'http://example.com/schemas/schemaURIs',
  }

  const opts = { schemas: {} }
  opts.schemas['http://example.com/schemas/schemaURIs'] = ext
  const validate = validator(schema, opts)

  t.ok(validate('hello string'), 'is a string')
  t.notOk(validate(42), 'not a string')
  t.end()
})

tape('top-level external schema', function(t) {
  const defs = {
    string: {
      type: 'string',
    },
    sex: {
      type: 'string',
      enum: ['male', 'female', 'other'],
    },
  }
  const schema = {
    type: 'object',
    properties: {
      name: { $ref: 'definitions.json#/string' },
      sex: { $ref: 'definitions.json#/sex' },
    },
    required: ['name', 'sex'],
  }

  const validate = validator(schema, {
    schemas: {
      'definitions.json': defs,
    },
  })
  t.ok(validate({ name: 'alice', sex: 'female' }), 'is an object')
  t.notOk(validate({ name: 'alice', sex: 'bob' }), 'recognizes external schema')
  t.notOk(validate({ name: 2, sex: 'female' }), 'recognizes external schema')
  t.end()
})

tape('nested required array decl', function(t) {
  const schema = {
    properties: {
      x: {
        type: 'object',
        properties: {
          y: {
            type: 'object',
            properties: {
              z: {
                type: 'string',
              },
            },
            required: ['z'],
          },
        },
      },
    },
    required: ['x'],
  }

  const validate = validator(schema, { includeErrors: true })

  t.ok(validate({ x: {} }), 'should be valid')
  t.notOk(validate({}), 'should not be valid')
  t.strictEqual(validate.errors[0].dataPath, '#/x', 'should output the missing field')
  t.end()
})

tape('verbose mode', function(t) {
  const schema = {
    type: 'object',
    required: ['hello'],
    properties: {
      hello: {
        type: 'string',
      },
    },
  }

  const validate = validator(schema, { includeErrors: true, reflectErrorsValue: true })

  t.ok(validate({ hello: 'string' }), 'should be valid')
  t.notOk(validate({ hello: 100 }), 'should not be valid')
  t.strictEqual(validate.errors[0].value, 100, 'error object should contain the invalid value')
  t.end()
})

tape('additional props in verbose mode', function(t) {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['hello world'],
    properties: {
      foo: {
        type: 'string',
      },
      'hello world': {
        type: 'object',
        additionalProperties: false,
        properties: {
          foo: {
            type: 'string',
          },
        },
      },
    },
  }

  const validate = validator(schema, { includeErrors: true, reflectErrorsValue: true })

  validate({ 'hello world': { bar: 'string' } })

  t.strictEqual(
    validate.errors[0].value,
    'string',
    'should output the value of the additional prop in the error'
  )
  t.end()
})

tape('Date.now() is an integer', function(t) {
  const schema = { type: 'integer' }
  const validate = validator(schema)

  t.ok(validate(Date.now()), 'is integer')
  t.end()
})

tape('field shows item index in arrays', function(t) {
  const schema = {
    type: 'array',
    items: {
      type: 'array',
      items: {
        required: ['foo'],
        properties: {
          foo: {
            type: 'string',
          },
        },
      },
    },
  }

  const validate = validator(schema, { includeErrors: true, reflectErrorsValue: true })

  validate([[{ foo: 'test' }, { foo: 'test' }], [{ foo: 'test' }, { baz: 'test' }]])

  t.strictEqual(
    validate.errors[0].dataPath,
    '#/1/1/foo',
    'should output the field with specific index of failing item in the error'
  )
  t.end()
})

tape('jsonCheck option', function(t) {
  const schema = {
    type: 'object',
    required: ['bar'],
    properties: {
      bar: {
        type: 'boolean',
      },
    },
  }

  class Foo {
    constructor() {
      this.bar = true
    }
  }

  t.ok(validator(schema)(new Foo()), 'non-JSON is OK without jsonCheck')

  const validate = validator(schema, { jsonCheck: true, includeErrors: true })
  t.notOk(validate(new Foo()), 'non-JSON fails with jsonCheck')
  const [error] = validate.errors
  t.is(error.message, 'not JSON compatible', 'correct error message')

  t.end()
})
