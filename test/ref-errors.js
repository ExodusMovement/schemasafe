'use strict'

const tape = require('tape')
const { validator } = require('..')

const schema = {
  type: 'object',
  required: ['hello', 'bar'],
  properties: {
    hello: {
      type: 'string',
    },
    bar: {
      type: 'number',
    },
  },
  additionalProperties: false,
}

const data = { hello: 100, boo: 10 }

const schemas = [
  {
    $id: 'https://example.com/schema0',
    $defs: schema,
  },
  {
    $id: 'https://example.com/schema1',
    $defs: {
      woo: schema,
    },
    $ref: '#/$defs/woo',
  },
  {
    $id: 'https://example.com/schema2',
    $defs: {
      woo: {
        $id: 'woo-id',
        ...schema,
      },
    },
    $ref: 'woo-id',
  },
]

tape('$ref does not break error path', (t) => {
  const test = (instanceLocation, keywordLocation, wrappedData, wrappedSchema) => {
    for (const allErrors of [true, false]) {
      const validate = validator(wrappedSchema, { includeErrors: true, allErrors, schemas })

      t.strictEqual(validate(wrappedData), false, 'result is correct')
      t.ok(Array.isArray(validate.errors), 'errors are an array')
      t.strictEqual(validate.errors.length, allErrors ? 3 : 1, 'errors number is correct')

      t.strictEqual(validate.errors[0].instanceLocation, `#${instanceLocation}/bar`)
      t.strictEqual(validate.errors[0].keywordLocation, `#${keywordLocation}/required`)

      if (allErrors) {
        t.strictEqual(validate.errors[1].instanceLocation, `#${instanceLocation}/hello`)
        t.strictEqual(
          validate.errors[1].keywordLocation,
          `#${keywordLocation}/properties/hello/type`
        )

        t.strictEqual(validate.errors[2].instanceLocation, `#${instanceLocation}/boo`)
        t.strictEqual(
          validate.errors[2].keywordLocation,
          `#${keywordLocation}/additionalProperties`
        )
      }
    }
  }

  test('', '', data, schema)
  test('/foo', '/properties/foo', { foo: data }, { properties: { foo: schema } })
  test(
    '/foo',
    '/properties/foo/$ref',
    { foo: data },
    { $defs: schema, properties: { foo: { $ref: '#/$defs' } } }
  )

  const schemaRefs = [
    { $ref: 'https://example.com/schema0#/$defs', $path: '/$ref' },
    { $ref: 'https://example.com/schema1', $path: '/$ref/$ref' },
    { $ref: 'https://example.com/schema2', $path: '/$ref/$ref' },
  ]
  for (const { $ref, $path } of schemaRefs) {
    test('', $path, data, { $ref })
    test('/foo', `/properties/foo${$path}`, { foo: data }, { properties: { foo: { $ref } } })
    test(
      '/foo',
      `/properties/foo${$path}`,
      { ok: {}, foo: data },
      { properties: { ok: { not: { $ref } }, foo: { $ref } } }
    )
  }

  t.end()
})
