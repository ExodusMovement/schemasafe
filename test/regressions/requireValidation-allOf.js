'use strict'

const tape = require('tape')
const { validator } = require('../../')

const fail = (t, schema, msg) => t.throws(() => validator(schema, { mode: 'strong' }), msg)
const pass = (t, schema, msg) => t.doesNotThrow(() => validator(schema, { mode: 'strong' }), msg)

tape('requireValidation works with allOf/anyOf/oneOf, objects', (t) => {
  fail(t, {}, 'no validation done fails')
  pass(t, { type: 'boolean' }, 'non-object type passes')
  fail(t, { type: 'object' }, 'object with no additionalProperties fails')

  pass(t, { type: 'object', additionalProperties: false }, 'object with additionalProperties')

  pass(t, { type: 'object', allOf: [{ type: 'object', additionalProperties: false }] }, 'allOf')
  pass(t, { allOf: [{ type: 'object', additionalProperties: false }] }, 'allOf with no type')
  fail(t, { allOf: [{ additionalProperties: false }] }, 'oneOf with no type in allOf')

  pass(t, { type: 'object', oneOf: [{ type: 'object', additionalProperties: false }] }, 'oneOf')
  pass(t, { oneOf: [{ type: 'object', additionalProperties: false }] }, 'oneOf with no type')
  fail(t, { oneOf: [{ additionalProperties: false }] }, 'oneOf with no type in oneOf')
  fail(t, { oneOf: [{ type: 'object', additionalProperties: false }, {}] }, 'oneOf with one empty')

  pass(t, { type: 'object', anyOf: [{ type: 'object', additionalProperties: false }] }, 'anyOf')
  pass(t, { anyOf: [{ type: 'object', additionalProperties: false }] }, 'anyOf with no type')
  fail(t, { anyOf: [{ additionalProperties: false }] }, 'oneOf with no type in anyOf')
  fail(t, { anyOf: [{ type: 'object', additionalProperties: false }, {}] }, 'anyOf with one empty')

  t.end()
})

tape('requireValidation works with allOf/anyOf/oneOf, arrays', (t) => {
  fail(t, {}, 'no validation done fails')
  pass(t, { type: 'boolean' }, 'non-array type passes')
  fail(t, { type: 'array' }, 'array with no additionalItems fails')

  pass(t, { type: 'array', items: [], additionalItems: false }, 'array with additionalItems')

  pass(t, { type: 'array', allOf: [{ type: 'array', items: [], additionalItems: false }] }, 'allOf')
  pass(t, { allOf: [{ type: 'array', items: [], additionalItems: false }] }, 'allOf with no type')
  fail(t, { allOf: [{ items: [], additionalItems: false }] }, 'oneOf with no type in allOf')

  pass(t, { type: 'array', oneOf: [{ type: 'array', items: [], additionalItems: false }] }, 'oneOf')
  pass(t, { oneOf: [{ type: 'array', items: [], additionalItems: false }] }, 'oneOf with no type')
  fail(t, { oneOf: [{ items: [], additionalItems: false }] }, 'oneOf with no type in oneOf')

  pass(t, { type: 'array', anyOf: [{ type: 'array', items: [], additionalItems: false }] }, 'anyOf')
  pass(t, { anyOf: [{ type: 'array', items: [], additionalItems: false }] }, 'anyOf with no type')
  fail(t, { anyOf: [{ items: [], additionalItems: false }] }, 'oneOf with no type in anyOf')

  t.end()
})

tape('requireValidation works with $ref', (t) => {
  const good = { type: 'object', additionalProperties: false }
  const bad0 = {}
  const bad1 = { type: 'object' }
  const bad2 = { additionalProperties: false }
  const $defs = { good, bad0, bad1, bad2 }

  fail(t, { $defs }, 'no validation done fails')
  fail(t, { $defs, $ref: '#/$defs/bad0' }, 'ref to empty fails')
  fail(t, { $defs, $ref: '#/$defs/bad1' }, 'ref to only type fails')
  fail(t, { $defs, $ref: '#/$defs/bad2' }, 'ref to only additionalProperties fails')
  pass(t, { $defs, $ref: '#/$defs/good' }, 'ref to type + additionalProperties passes')

  t.end()
})
