'use strict'

const tape = require('tape')
const { validator } = require('../../')

tape('single', (t) => {
  const validate = validator(JSON.parse('{"const": {"__proto__": []}}'))

  t.notOk(validate({}), 'Empty object does not match')
  t.notOk(validate([]), 'Empty array does not match')
  t.notOk(validate({ __proto__: [] }), 'Object with overriden prototype does not match')
  t.ok(validate({ ['__proto__']: [] }), 'Object with __proto__ property matches')
  t.ok(validate(JSON.parse('{"__proto__": []}')), 'Equivalent JSON matches')
  t.end()
})

tape('multiple', (t) => {
  const validate = validator(JSON.parse('{"const": [{"__proto__": []}, {"__proto__": []}]}'))

  const ok = { ['__proto__']: [] }
  const fail = { __proto__: [] }

  t.notOk(validate([]), 'Empty array does not match')
  t.notOk(validate({ fail, ok }), 'First mismatch of two fails')
  t.notOk(validate({ ok, fail }), 'Second mismatch of two fails')
  t.ok(validate([ok, ok]), 'Objects with __proto__ properties match')
  t.ok(validate(JSON.parse('[{"__proto__": []}, {"__proto__": []}]')), 'Equivalent JSON matches')
  t.end()
})
