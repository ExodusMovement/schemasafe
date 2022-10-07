'use strict'

const tape = require('tape')
const { validator, parser } = require('../')

const $schema = 'https://json-schema.org/draft/2020-12/schema#'

const schemas1 = [{ $schema, type: 'number' }]
const schemas3 = [
  {
    $id: 'https://example.com/a',
    type: 'object',
    properties: {
      value: { $ref: 'https://example.com/b' },
    },
  },
  {
    $id: 'https://example.com/b',
    type: 'array',
    items: { $ref: 'https://example.com/a' },
  },
  { type: 'number' },
]

tape('multi, 0 schemas, validator', (t) => {
  const validates = validator([], { multi: true })
  t.strictEqual(validates.length, 0)
  t.end()
})

tape('multi, 0 schemas, parser', (t) => {
  const parses = parser([], { multi: true })
  t.strictEqual(parses.length, 0)
  t.end()
})

tape('multi, 1 schemas, validator', (t) => {
  const validates = validator(schemas1, { multi: true })
  t.strictEqual(validates.length, 1)

  t.ok(validates[0](1))
  t.strictEqual(validates[0].errors, undefined)
  t.notOk(validates[0](''))
  t.strictEqual(validates[0].errors, undefined)

  t.end()
})

tape('multi, 1 schemas, validator, errors', (t) => {
  const validates = validator(schemas1, { multi: true, includeErrors: true })
  t.strictEqual(validates.length, 1)

  t.ok(validates[0](1))
  t.strictEqual(validates[0].errors, null)
  t.notOk(validates[0](''))
  t.deepEqual(validates[0].errors, [{ keywordLocation: '#/type', instanceLocation: '#' }])

  t.end()
})

tape('multi, 1 schemas, parser', (t) => {
  const parses = parser(schemas1, { multi: true })
  t.strictEqual(parses.length, 1)

  t.deepEqual(parses[0]('1'), { valid: true, value: 1 })
  t.deepEqual(parses[0]('""'), { valid: false })
  t.deepEqual(parses[0]('"'), { valid: false })

  t.end()
})

tape('multi, 1 schemas, parser, errors', (t) => {
  const parses = parser(schemas1, { multi: true, includeErrors: true })
  t.strictEqual(parses.length, 1)

  t.deepEqual(parses[0]('1'), { valid: true, value: 1 })
  t.deepEqual(parses[0]('""'), {
    valid: false,
    error: 'JSON validation failed for type at #',
    errors: [{ keywordLocation: '#/type', instanceLocation: '#' }],
  })
  t.deepEqual(parses[0]('"'), { valid: false, error: 'Unexpected end of JSON input' })

  t.end()
})

tape('multi, 3 schemas, validator', (t) => {
  const validates = validator(schemas3, { multi: true })
  t.strictEqual(validates.length, 3)

  t.ok(validates[0]({ value: [] }))
  t.strictEqual(validates[2].errors, undefined)
  t.notOk(validates[0]({ value: 10 }))
  t.strictEqual(validates[2].errors, undefined)

  t.ok(validates[1]([{ value: [] }]))
  t.strictEqual(validates[2].errors, undefined)
  t.notOk(validates[1]([{ value: 10 }]))
  t.strictEqual(validates[2].errors, undefined)

  t.ok(validates[2](1))
  t.strictEqual(validates[2].errors, undefined)
  t.notOk(validates[2](''))
  t.strictEqual(validates[2].errors, undefined)

  t.end()
})

tape('multi, 3 schemas, validator, errors', (t) => {
  const validates = validator(schemas3, { multi: true, includeErrors: true })
  t.strictEqual(validates.length, 3)

  t.ok(validates[0]({ value: [] }))
  t.strictEqual(validates[0].errors, null)
  t.notOk(validates[0]({ value: 10 }))
  t.deepEqual(validates[0].errors, [
    { keywordLocation: '#/properties/value/$ref/type', instanceLocation: '#/value' },
  ])

  t.ok(validates[1]([{ value: [] }]))
  t.strictEqual(validates[1].errors, null)
  t.notOk(validates[1]([{ value: 10 }]))
  t.deepEqual(validates[1].errors, [
    { keywordLocation: '#/items/$ref/properties/value/$ref/type', instanceLocation: '#/0/value' },
  ])

  t.ok(validates[2](1))
  t.strictEqual(validates[2].errors, null)
  t.notOk(validates[2](''))
  t.deepEqual(validates[2].errors, [{ keywordLocation: '#/type', instanceLocation: '#' }])

  t.end()
})

tape('multi, 3 schemas, parser', (t) => {
  const parses = parser(schemas3, { multi: true, mode: 'default' })
  t.strictEqual(parses.length, 3)

  t.deepEqual(parses[0]('{"value":[]}'), { valid: true, value: { value: [] } })
  t.deepEqual(parses[0]('{"value":10}'), { valid: false })
  t.deepEqual(parses[0]('"'), { valid: false })

  t.deepEqual(parses[1]('[{"value":[]}]'), { valid: true, value: [{ value: [] }] })
  t.deepEqual(parses[1]('[{"value":10}]'), { valid: false })
  t.deepEqual(parses[1]('"'), { valid: false })

  t.deepEqual(parses[2]('1'), { valid: true, value: 1 })
  t.deepEqual(parses[2]('""'), { valid: false })
  t.deepEqual(parses[2]('"'), { valid: false })

  t.end()
})

tape('multi, 3 schemas, parser, errors', (t) => {
  const parses = parser(schemas3, { multi: true, mode: 'default', includeErrors: true })
  t.strictEqual(parses.length, 3)

  t.deepEqual(parses[0]('{"value":[]}'), { valid: true, value: { value: [] } })
  t.deepEqual(parses[0]('{"value":10}'), {
    valid: false,
    error: 'JSON validation failed for type at #/value',
    errors: [{ keywordLocation: '#/properties/value/$ref/type', instanceLocation: '#/value' }],
  })
  t.deepEqual(parses[0]('"'), { valid: false, error: 'Unexpected end of JSON input' })

  t.deepEqual(parses[1]('[{"value":[]}]'), { valid: true, value: [{ value: [] }] })
  t.deepEqual(parses[1]('[{"value":10}]'), {
    valid: false,
    error: 'JSON validation failed for type at #/0/value',
    errors: [
      { keywordLocation: '#/items/$ref/properties/value/$ref/type', instanceLocation: '#/0/value' },
    ],
  })
  t.deepEqual(parses[1]('"'), { valid: false, error: 'Unexpected end of JSON input' })

  t.deepEqual(parses[2]('1'), { valid: true, value: 1 })
  t.deepEqual(parses[2]('""'), {
    valid: false,
    error: 'JSON validation failed for type at #',
    errors: [{ keywordLocation: '#/type', instanceLocation: '#' }],
  })
  t.deepEqual(parses[2]('"'), { valid: false, error: 'Unexpected end of JSON input' })

  t.end()
})
