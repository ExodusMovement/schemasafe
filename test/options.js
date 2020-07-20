'use strict'

const tape = require('tape')
const { validator } = require('../')

tape('unknown', (t) => {
  t.throws(() => validator({}, { whatever: 1 }), /option.*whatever/)
  t.end()
})

tape('dryRun', (t) => {
  t.strictEqual(typeof validator({}), 'function', 'normal usage returns a function')
  t.strictEqual(typeof validator({}, { dryRun: false }), 'function', '!dryRun returns a function')
  t.strictEqual(typeof validator({}, { dryRun: true }), 'undefined', 'dryRun returns undefined')
  t.end()
})

tape('removeAdditional', (t) => {
  const run = (schema, options, value) => [validator(schema, options)(value), value]

  t.deepEqual(run({}, {}, { x: 1 }), [true, { x: 1 }], 'object: no rules')
  t.deepEqual(
    run({}, { removeAdditional: true }, { x: 1 }),
    [true, { x: 1 }],
    'object: lone removeAdditional'
  )
  t.deepEqual(
    run({ additionalProperties: false }, {}, { x: 1 }),
    [false, { x: 1 }],
    'object: lone additionalProperties'
  )
  t.deepEqual(
    run({ additionalProperties: false }, { removeAdditional: true }, { x: 1 }),
    [true, {}],
    'object: additionalProperties + removeAdditional'
  )

  t.deepEqual(run({}, {}, [1, 2]), [true, [1, 2]], 'array: no rules')
  t.deepEqual(
    run({}, { removeAdditional: true }, [1, 2]),
    [true, [1, 2]],
    'array: lone removeAdditional'
  )
  t.deepEqual(
    run({ items: [true], additionalItems: false }, {}, [1, 2]),
    [false, [1, 2]],
    'array: items + additionalItems'
  )
  t.deepEqual(
    run({ items: [true], additionalItems: false }, { removeAdditional: true }, [1, 2]),
    [true, [1]],
    'array: items + additionalItems + removeAdditional'
  )

  t.doesNotThrow(
    () => validator({ additionalProperties: false }, { removeAdditional: true }),
    'certain'
  )
  t.doesNotThrow(
    () =>
      validator(
        {
          anyOf: [{ additionalProperties: false }],
        },
        { removeAdditional: true }
      ),
    'still certain'
  )
  t.throws(
    () =>
      validator(
        {
          anyOf: [{}, { additionalProperties: false }],
        },
        { removeAdditional: true }
      ),
    /uncertain/,
    'uncertain'
  )
  t.end()
})
