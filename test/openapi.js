'use strict'

const tape = require('tape')
const { validator } = require('..')

// https://swagger.io/docs/specification/adding-examples/#parameters
tape('OpenAPI Parameter Examples', (t) => {
  let validate

  const schema = {
    type: 'string',
    enum: ['approved', 'pending', 'closed', 'new'],
    example: 'approved',
  }

  t.doesNotThrow(() => {
    validate = validator(schema)
  })
  t.equal(validate(42), false)
  t.equal(validate(schema.example), true)

  t.end()
})
