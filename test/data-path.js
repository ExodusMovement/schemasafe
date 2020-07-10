'use strict'

const tape = require('tape')
const { validator } = require('../')

tape('instanceLocation', (t) => {
  const schema = {
    properties: {
      arr: {
        items: {
          additionalProperties: { type: 'string' },
          propertyNames: { minLength: 2 },
        },
      },
    },
  }
  const validate = validator(schema, { includeErrors: true })

  const checkError = (data, keywordLocation, instanceLocation, message) => {
    t.deepEqual(validate(data), false, `should have failed: ${message}`)
    t.deepEqual(
      validate.errors[0].keywordLocation,
      keywordLocation,
      `keywordLocation for ${message}`
    )
    t.deepEqual(
      validate.errors[0].instanceLocation,
      instanceLocation,
      `instanceLocation for ${message}`
    )
  }

  t.ok(validate({ arr: [] }), 'valid empty array passes')
  t.ok(validate({ arr: [{}] }), 'valid empty item in array passes')
  t.ok(validate({ arr: [{ foo: 'bar' }] }), 'valid passes')

  checkError(
    { arr: [{ foo: 2 }] },
    '#/properties/arr/items/additionalProperties/type',
    '#/arr/0/foo',
    'invalid type for #0'
  )
  checkError(
    { arr: [{ x: 'bar' }] },
    '#/properties/arr/items/propertyNames/minLength',
    '#/arr/0/x',
    'invalid name for #0'
  )
  checkError(
    { arr: [{}, { foo: 2 }] },
    '#/properties/arr/items/additionalProperties/type',
    '#/arr/1/foo',
    'invalid type for #1'
  )
  checkError(
    { arr: [{}, { x: 'bar' }] },
    '#/properties/arr/items/propertyNames/minLength',
    '#/arr/1/x',
    'invalid name for #1'
  )

  t.end()
})
