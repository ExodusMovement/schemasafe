'use strict'

const tape = require('tape')
const { validator } = require('../')

const formats = {
  simple: /^[a-z]+$/,
  complex: /^(a[a-z]+)*$/, // example: `${'a'.repeat(1000)}A`
  func: () => true, // expected to be safe and perform own checks
}

const simple = [
  {},
  { format: 'date' },
  { format: 'uri' },
  { format: 'simple' },
  { format: 'func' },
  { format: 'complex', maxLength: 10 },
  { pattern: '^$' },
  { pattern: '^(foo|bar)$' },
  { pattern: '^[a-z]+$' },
  { pattern: '^(a[a-z]+)*$', maxLength: 10 },
  { pattern: 'a+' },
  { pattern: 'a*c', maxLength: 10 },
  { pattern: '^a*c' },
  { uniqueItems: true, maxItems: 10 },
  { uniqueItems: true, items: { type: 'string' } },
  { uniqueItems: true, items: { type: ['string', 'number'] } },
  { uniqueItems: true, items: { type: ['string', 'number', 'array'] }, maxItems: 10 },
  { uniqueItems: true, items: [{ type: 'string' }], additionalItems: false },
  { uniqueItems: true, items: [{ type: 'object' }], additionalItems: false },
  { patternProperties: { '^foo.*$': {} } },
  { patternProperties: { '^b.*a.*r$': {} }, propertyNames: { maxLength: 10 } },
  { propertyNames: { pattern: '^(a[a-z]+)*$', maxLength: 10 } },
  { uniqueItems: true, items: { const: 'a' } },
  { uniqueItems: true, items: { enum: ['a', 'b', 'c'] } },
]

const complex = [
  { format: 'complex' },
  { pattern: '^(a[a-z]+)*$' },
  { pattern: '^(a|aa)*$' },
  { pattern: '^(aa?)*$' },
  { pattern: 'a+c' },
  { pattern: 'a*c' },
  { uniqueItems: true },
  { uniqueItems: true, items: {} },
  { uniqueItems: true, items: { type: 'object' } },
  { uniqueItems: true, items: { type: ['string', 'number', 'array'] } },
  { uniqueItems: true, items: [{ type: 'string' }] },
  { patternProperties: { '^b.*a.*r$': {} } },
  { patternProperties: { '^foo.*$': {}, '^b.*a.*r$': {} } },
  { patternProperties: { '^b.*a.*r$': {} }, propertyNames: {} },
  { propertyNames: { pattern: '^(a[a-z]+)*$' } },
]

tape('simple pass complexity checks', (t) => {
  for (const schema of simple)
    t.doesNotThrow(() => validator(schema, { formats, complexityChecks: true }))
  t.end()
})

tape('complex are valid without complexity checks', (t) => {
  for (const schema of complex)
    t.doesNotThrow(() => validator(schema, { formats, complexityChecks: false }))
  t.end()
})

tape('complex fail complexity checks', (t) => {
  for (const schema of complex)
    t.throws(() => validator(schema, { formats, complexityChecks: true }), /\[complexityChecks\]/)
  t.end()
})
