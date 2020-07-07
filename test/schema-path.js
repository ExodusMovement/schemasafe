'use strict'

const tape = require('tape')
const { validator } = require('../')

tape('schemaPath', function(t) {
  const schema = {
    type: 'object',
    properties: {
      hello: {
        type: 'string',
      },
      someItems: {
        type: 'array',
        items: [
          {
            type: 'string',
          },
          {
            type: 'array',
          },
        ],
        additionalItems: {
          type: 'boolean',
        },
      },
      nestedOuter: {
        type: 'object',
        properties: {
          nestedInner: {
            type: 'object',
            properties: {
              deeplyNestedProperty: {
                type: 'boolean',
              },
            },
          },
        },
        required: ['nestedInner'],
      },
      aggregate: {
        allOf: [{ pattern: 'z$' }, { pattern: '^a' }, { pattern: '-' }, { pattern: '^...$' }],
      },
      negate: {
        not: {
          type: 'boolean',
        },
      },
      selection: {
        anyOf: [{ pattern: '^[a-z]{3}$' }, { pattern: '^[0-9]$' }],
      },
      exclusiveSelection: {
        oneOf: [
          { pattern: 'a' },
          { pattern: 'e' },
          { pattern: 'i' },
          { pattern: 'o' },
          { pattern: 'u' },
        ],
      },
    },
    patternProperties: {
      '.*String': { type: 'string' },
      '^[01]+$': { type: 'number' },
    },
    additionalProperties: false,
  }
  const validate = validator(schema, { includeErrors: true })

  function notOkAt(data, path, message) {
    if (validate(data)) {
      return t.fail(`should have failed: ${message}`)
    }
    t.deepEqual(validate.errors[0].schemaPath, path, message)
  }

  // Top level errors
  notOkAt(null, '#/type', 'should target parent of failed type error')
  notOkAt(undefined, '#/type', 'should target parent of failed type error')
  notOkAt(
    { invalidAdditionalProp: '*whistles innocently*' },
    '#/additionalProperties',
    'additionalProperties should be associated with containing schema'
  )

  // Errors in properties
  notOkAt({ hello: 42 }, '#/properties/hello/type', 'should target property with type error')
  notOkAt(
    { someItems: [42] },
    '#/properties/someItems/0/type',
    'should target specific someItems rule(0)'
  )
  notOkAt(
    { someItems: ['astring', 42] },
    '#/properties/someItems/1/type',
    'should target specific someItems rule(1)'
  )
  notOkAt(
    { someItems: ['astring', [], 'not a boolean'] },
    '#/properties/someItems/additionalItems/type',
    'should target additionalItems'
  )
  notOkAt(
    { someItems: ['astring', [], true, false, 42] },
    '#/properties/someItems/additionalItems/type',
    'should sitll target additionalProperties after valid additional items'
  )

  notOkAt(
    { nestedOuter: {} },
    '#/properties/nestedOuter/required',
    'should target container of missing required property'
  )
  notOkAt(
    { nestedOuter: { nestedInner: 'not an object' } },
    '#/properties/nestedOuter/properties/nestedInner/type',
    'should target property with type error (inner)'
  )
  notOkAt(
    { nestedOuter: { nestedInner: { deeplyNestedProperty: 'not a boolean' } } },
    '#/properties/nestedOuter/properties/nestedInner/properties/deeplyNestedProperty/type',
    'should target property with type error (deep)'
  )

  notOkAt(
    { aggregate: 'a-a' },
    '#/properties/aggregate/allOf/0/pattern',
    'should target specific rule in allOf (0)'
  )
  notOkAt(
    { aggregate: 'z-z' },
    '#/properties/aggregate/allOf/1/pattern',
    'should target specific rule in allOf (1)'
  )
  notOkAt(
    { aggregate: 'a:z' },
    '#/properties/aggregate/allOf/2/pattern',
    'should target specific rule in allOf (2)'
  )
  notOkAt(
    { aggregate: 'a--z' },
    '#/properties/aggregate/allOf/3/pattern',
    'should target specific rule in allOf (3)'
  )

  notOkAt(
    { notAString: 42 },
    '#/patternProperties/.*String/type',
    'should target the specific pattern in patternProperties (wildcards)'
  )
  notOkAt(
    {
      'I am a String': 'I really am',
      '001100111011000111100': "Don't stand around jabbering when you're in mortal danger",
    },
    '#/patternProperties/^[01]+$/type',
    'should target the specific pattern in patternProperties ("binary" keys)'
  )

  notOkAt({ negate: false }, '#/properties/negate/not', 'should target container of not')

  notOkAt(
    { selection: 'grit' },
    '#/properties/selection/anyOf',
    'should target container for anyOf (no matches)'
  )
  notOkAt(
    { exclusiveSelection: 'fly' },
    '#/properties/exclusiveSelection/oneOf',
    'should target container for oneOf (no match)'
  )
  notOkAt(
    { exclusiveSelection: 'ice' },
    '#/properties/exclusiveSelection/oneOf',
    'should target container for oneOf (multiple matches)'
  )

  t.end()
})

tape('schemaPath - nested selectors', function(t) {
  const schema = {
    anyOf: [
      {
        oneOf: [
          {
            allOf: [
              {
                properties: {
                  nestedSelectors: { type: 'integer' },
                },
              },
            ],
          },
        ],
      },
    ],
  }
  const validate = validator(schema, { includeErrors: true })
  t.notOk(validate({ nestedSelectors: 'nope' }), 'should not crash on visit inside *Of')

  t.end()
})
