'use strict'

const tape = require('tape')
const { validator } = require('../../')

const fail = (t, schema, mode, msg) => t.throws(() => validator(schema, { mode }), msg)
const pass = (t, schema, mode, msg) => t.doesNotThrow(() => validator(schema, { mode }), msg)

const common = (t, mode) => {
  pass(t, { type: 'array', const: [1, 2, 3] }, mode, 'const validated (array)')
  pass(t, { type: 'number', const: 1 }, mode, 'const validated (number)')
  pass(t, { const: [1, 2, 3] }, mode, 'const without type')
  pass(t, { type: 'number', enum: [1, 2, 3] }, mode, 'enum validated')
  pass(t, { type: 'number', enum: [1, 2, 3] }, mode, 'enum validated')
  pass(t, { enum: [1, 2, 3] }, mode, 'enum without type')
  fail(t, { const: 1, enum: [1, 2, 3] }, mode, 'const + enum')
  fail(t, { const: '1970-01-01', format: 'date' }, mode, 'const + format')
  fail(t, { enum: ['1970-01-01'], format: 'date' }, mode, 'enum + format')
}

tape('default mode', (t) => {
  pass(t, {}, undefined, 'no enum, const or type')
  common(t, undefined)
  t.end()
})

tape('strong mode', (t) => {
  fail(t, {}, 'strong', 'no enum, const or type')
  common(t, 'strong')
  t.end()
})
