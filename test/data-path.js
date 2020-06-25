'use strict'

const tape = require('tape')
const { validator } = require('../')

tape('dataPath', (t) => {
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
  const validate = validator(schema, { includeErrors: true, verboseErrors: true })

  const checkError = (data, schemaPath, dataPath, message) => {
    t.deepEqual(validate(data), false, `should have failed: ${message}`)
    t.deepEqual(validate.errors[0].schemaPath, schemaPath, `schemaPath for ${message}`)
    t.deepEqual(validate.errors[0].dataPath, dataPath, `dataPath for ${message}`)
  }

  t.ok(validate({ arr: [] }), 'valid empty array passes')
  t.ok(validate({ arr: [{}] }), 'valid empty item in array passes')
  t.ok(validate({ arr: [{ foo: 'bar' }] }), 'valid passes')

  checkError(
    { arr: [{ foo: 2 }] },
    '#/properties/arr/items/additionalProperties',
    '#/arr/0/foo',
    'invalid type for #0'
  )
  checkError(
    { arr: [{ x: 'bar' }] },
    '#/properties/arr/items/propertyNames',
    '#/arr/0/x',
    'invalid name for #0'
  )
  checkError(
    { arr: [{}, { foo: 2 }] },
    '#/properties/arr/items/additionalProperties',
    '#/arr/1/foo',
    'invalid type for #1'
  )
  checkError(
    { arr: [{}, { x: 'bar' }] },
    '#/properties/arr/items/propertyNames',
    '#/arr/1/x',
    'invalid name for #1'
  )

  t.end()
})
