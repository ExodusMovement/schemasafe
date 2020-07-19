'use strict'

const tape = require('tape')
const { validator } = require('../../')

const $schema = 'https://json-schema.org/draft/2019-09/schema#'

const fail = (t, schema, mode, msg) => t.throws(() => validator(schema, { mode }), msg)
const pass = (t, schema, mode, msg) => t.doesNotThrow(() => validator(schema, { mode }), msg)

const common = (t, mode) => {
  pass(t, { $schema, type: 'array', const: [1, 2, 3] }, mode, 'const validated (array)')
  pass(t, { $schema, type: 'number', const: 1 }, mode, 'const validated (number)')
  pass(t, { $schema, const: [1, 2, 3] }, mode, 'const without type')
  pass(t, { $schema, type: 'number', enum: [1, 2, 3] }, mode, 'enum validated')
  pass(t, { $schema, type: 'number', enum: [1, 2, 3] }, mode, 'enum validated')
  pass(t, { $schema, enum: [1, 2, 3] }, mode, 'enum without type')
  fail(t, { $schema, const: 1, enum: [1, 2, 3] }, mode, 'const + enum')
  fail(t, { $schema, const: '1970-01-01', format: 'date' }, mode, 'const + format')
  fail(t, { $schema, enum: ['1970-01-01'], format: 'date' }, mode, 'enum + format')
}

tape('default mode', (t) => {
  pass(t, { $schema }, undefined, 'no enum, const or type')
  common(t, undefined)
  t.end()
})

tape('strong mode', (t) => {
  fail(t, { $schema }, 'strong', 'no enum, const or type')
  common(t, 'strong')
  t.end()
})
