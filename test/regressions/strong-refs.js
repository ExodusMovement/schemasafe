'use strict'

const tape = require('tape')
const { validator } = require('../../')

tape('refs require validation in strong mode', (t) => {
  t.doesNotThrow(() => {
    validator(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        propertyNames: { pattern: '^[a-z]+$' },
        definitions: {
          goodString: { type: 'string', pattern: '^a+$' },
        },
        additionalProperties: {
          anyOf: [{ type: 'number' }, { $ref: '#/definitions/goodString' }],
        },
      },
      { mode: 'strong' }
    )
  })
  t.throws(() => {
    validator(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        propertyNames: { pattern: '^[a-z]+$' },
        definitions: {
          badString: { type: 'string', pattern: '^a+' },
        },
        additionalProperties: {
          anyOf: [{ type: 'number' }, { $ref: '#/definitions/badString' }],
        },
      },
      { mode: 'strong' }
    )
  }, /Should start with \^ and end with \$: /)

  t.doesNotThrow(() => {
    validator(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        propertyNames: { pattern: '^[a-z]+$' },
        definitions: {
          goodObject: {
            type: 'object',
            required: [],
            properties: { a: { type: 'number' } },
            additionalProperties: false,
          },
        },
        additionalProperties: {
          anyOf: [{ type: 'number' }, { $ref: '#/definitions/goodObject' }],
        },
      },
      { mode: 'strong' }
    )
  })
  t.throws(() => {
    validator(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        propertyNames: { pattern: '^[a-z]+$' },
        definitions: {
          badObject: { type: 'object', required: [], properties: { a: { type: 'number' } } },
        },
        additionalProperties: {
          anyOf: [{ type: 'number' }, { $ref: '#/definitions/badObject' }],
        },
      },
      { mode: 'strong' }
    )
  }, /\[requireValidation\] additionalProperties /)

  t.end()
})

tape('cyclic ref passes if fully covers the object', (t) => {
  t.doesNotThrow(() => {
    const validate = validator(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        propertyNames: { pattern: '^[a-z]+$' },
        additionalProperties: {
          anyOf: [{ type: 'number' }, { $ref: '#' }],
        },
      },
      { mode: 'strong' }
    )

    t.ok(validate({}), '{}')
    t.ok(validate({ foo: 3 }), '{foo:3}')
    t.notOk(validate({ FOO: 3 }), '{FOO:3}')
    t.notOk(validate({ foo: [] }), '{foo:[]}')

    t.ok(validate({ x: {} }), '{x:{}}')
    t.notOk(validate({ X: {} }), '{X:{}}')
    t.ok(validate({ x: { foo: 3 } }), '{x:{foo:3}}')
    t.notOk(validate({ x: { FOO: 3 } }), '{x:{FOO:3}}')
    t.notOk(validate({ x: { foo: [] } }), '{x:{foo:[]}}')
  })

  t.end()
})

tape('partially validating local ref can be used (objects)', (t) => {
  const propTwoBare = { properties: { two: { const: 2 } }, required: ['two'] }
  const propTwoFull = { ...propTwoBare, type: 'object' }
  const compile = (schema) =>
    validator(
      {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        ...schema,
      },
      { mode: 'strong' }
    )

  t.throws(() => compile(propTwoBare), /\[requireValidation\] type should be specified/)
  t.throws(() => compile(propTwoFull), /\[requireValidation\].*Properties should be specified/)

  t.throws(() => {
    compile(
      {
        $ref: '#/$defs/propTwo',
        $defs: {
          propTwo: propTwoBare,
        },
        // type: 'object',
        unevaluatedProperties: false,
      },
      { mode: 'strong' }
    )
  })
  t.throws(() => {
    compile(
      {
        $ref: '#/$defs/propTwo',
        $defs: {
          propTwo: propTwoBare,
        },
        type: 'object',
        // unevaluatedProperties: false,
      },
      { mode: 'strong' }
    )
  })
  t.doesNotThrow(() => {
    const validate = compile({
      $ref: '#/$defs/propTwo',
      $defs: {
        propTwo: propTwoBare,
      },
      type: 'object',
      unevaluatedProperties: false,
    })
    t.notOk(validate({}), '{}')
    t.ok(validate({ two: 2 }), '{two:2}')
    t.notOk(validate({ three: 2 }), '{three:2}')
    t.notOk(validate({ two: 3 }), '{two:3}')
    t.notOk(validate({ two: 2, three: 3 }), '{two:2, three:3}')
    t.notOk(validate({ two: 2, one: 1 }), '{two:2, one:1}')
    t.notOk(validate({ one: 1 }), '{one:1}')
  })
  t.doesNotThrow(() => {
    const validate = compile({
      $ref: '#/$defs/propTwo',
      $defs: {
        propTwo: propTwoFull,
      },
      unevaluatedProperties: false,
    })
    t.notOk(validate({}), '{}')
    t.ok(validate({ two: 2 }), '{two:2}')
    t.notOk(validate({ three: 2 }), '{three:2}')
    t.notOk(validate({ two: 3 }), '{two:3}')
    t.notOk(validate({ two: 2, three: 3 }), '{two:2, three:3}')
    t.notOk(validate({ two: 2, one: 1 }), '{two:2, one:1}')
    t.notOk(validate({ one: 1 }), '{one:1}')
  })
  t.doesNotThrow(() => {
    const validate = compile({
      $ref: '#/$defs/propTwo',
      $defs: {
        propTwo: propTwoBare,
      },
      required: [],
      properties: {
        one: { const: 1 },
      },
      type: 'object',
      unevaluatedProperties: false,
    })
    t.notOk(validate({}), '{}')
    t.ok(validate({ two: 2 }), '{two:2}')
    t.notOk(validate({ three: 2 }), '{three:2}')
    t.notOk(validate({ two: 3 }), '{two:3}')
    t.notOk(validate({ two: 2, three: 3 }), '{two:2, three:3}')
    t.ok(validate({ two: 2, one: 1 }), '{two:2, one:1}')
    t.notOk(validate({ one: 1 }), '{one:1}')
  })
  t.doesNotThrow(() => {
    const validate = compile({
      $ref: '#/$defs/propTwo',
      $defs: {
        propTwo: propTwoFull,
      },
      required: [],
      properties: {
        one: { const: 1 },
      },
      unevaluatedProperties: false,
    })
    t.notOk(validate({}), '{}')
    t.ok(validate({ two: 2 }), '{two:2}')
    t.notOk(validate({ three: 2 }), '{three:2}')
    t.notOk(validate({ two: 3 }), '{two:3}')
    t.notOk(validate({ two: 2, three: 3 }), '{two:2, three:3}')
    t.ok(validate({ two: 2, one: 1 }), '{two:2, one:1}')
    t.notOk(validate({ one: 1 }), '{one:1}')
  })

  t.end()
})

tape('partially validating local ref can be used (strings)', (t) => {
  const stringDateBare = { format: 'date' }
  const stringDateFull = { ...stringDateBare, type: 'string' }
  const compile = (schema) =>
    validator(
      {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        ...schema,
      },
      { mode: 'strong' }
    )

  t.throws(() => compile(stringDateBare), /\[requireValidation\] type should be specified/)
  t.doesNotThrow(() => compile(stringDateFull))

  t.throws(() => {
    compile(
      {
        $ref: '#/$defs/stringDate',
        $defs: {
          stringDate: stringDateBare,
        },
        // type: 'string',
      },
      { mode: 'strong' }
    )
  })
  t.doesNotThrow(() => {
    const validate = compile({
      $ref: '#/$defs/stringDate',
      $defs: {
        stringDate: stringDateBare,
      },
      type: 'string',
    })
    t.notOk(validate(''), '""')
    t.notOk(validate('abc'), '"abc"')
    t.ok(validate('2000-01-01'), '"2000-01-01"')
  })
  t.doesNotThrow(() => {
    const validate = compile({
      $ref: '#/$defs/stringDate',
      $defs: {
        stringDate: stringDateFull,
      },
    })
    t.notOk(validate(''), '""')
    t.notOk(validate('abc'), '"abc"')
    t.ok(validate('2000-01-01'), '"2000-01-01"')
  })
  t.end()
})

tape('cyclic local refs do full validation', (t) => {
  const compile = ($defs) =>
    validator(
      {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $defs,
        $ref: '#/$defs/A',
      },
      { mode: 'strong' }
    )

  t.throws(() => {
    compile({
      A: {
        type: ['array'],
      },
    })
  })

  t.throws(() => {
    compile({
      A: {
        type: ['array', 'object'],
        items: {
          $ref: '#/$defs/A',
        },
      },
    })
  })

  t.doesNotThrow(() => {
    const validate = compile({
      A: {
        type: ['array'],
        items: {
          $ref: '#/$defs/A',
        },
      },
    })
    t.notOk(validate({}), '{}')
    t.ok(validate([]), '[]')
    t.ok(validate([[]]), '[[]]')
    t.ok(validate([[[]]]), '[[[]]]')
    t.notOk(validate([1]), '[1]')
    t.notOk(validate([{}]), '[{}]')
  })

  t.throws(() => {
    compile({
      A: {
        type: ['array'],
        prefixItems: [{ $ref: '#/$defs/A' }],
      },
    })
  })

  t.doesNotThrow(() => {
    const validate = compile({
      A: {
        type: ['array', 'object'],
        oneOf: [
          {
            type: 'array',
            items: {
              $ref: '#/$defs/A',
            },
          },
          {
            type: 'object',
            required: [],
            additionalProperties: false,
            properties: {
              x: { $ref: '#/$defs/A' },
            },
          },
        ],
      },
    })
    t.ok(validate({}), '{}')
    t.ok(validate([]), '[]')
    t.ok(validate([[]]), '[[]]')
    t.ok(validate([[[]]]), '[[[]]]')
    t.notOk(validate([1]), '[1]')
    t.ok(validate([{}]), '[{}]')
  })

  t.throws(() => {
    compile({
      A: {
        type: ['array', 'object'],
        oneOf: [
          {
            type: 'array',
            items: {
              $ref: '#/$defs/B',
            },
          },
          {
            type: 'object',
            required: [],
            additionalProperties: false,
            properties: {
              x: { $ref: '#/$defs/B' },
            },
          },
        ],
      },
      B: {
        type: ['array', 'object'],
        oneOf: [
          {
            type: 'array',
          },
          {
            type: 'object',
            required: [],
            additionalProperties: false,
            properties: {
              x: { $ref: '#/$defs/A' },
            },
          },
        ],
      },
    })
  })

  t.throws(() => {
    compile({
      A: {
        type: ['array', 'object'],
        oneOf: [
          {
            type: 'array',
            prefixItems: [{ $ref: '#/$defs/A' }],
          },
          {
            type: 'object',
            required: [],
            additionalProperties: false,
            properties: {
              x: { $ref: '#/$defs/A' },
            },
          },
        ],
      },
    })
  })

  t.doesNotThrow(() => {
    const validate = compile({
      A: {
        type: ['array', 'object'],
        oneOf: [
          {
            type: 'array',
            items: {
              $ref: '#/$defs/B',
            },
          },
          {
            type: 'object',
            required: [],
            additionalProperties: false,
            properties: {
              x: { $ref: '#/$defs/B' },
            },
          },
        ],
      },
      B: {
        type: ['array', 'object'],
        oneOf: [
          {
            type: 'array',
            items: {
              $ref: '#/$defs/A',
            },
          },
          {
            type: 'object',
            required: [],
            additionalProperties: false,
            properties: {
              x: { $ref: '#/$defs/A' },
            },
          },
        ],
      },
    })
    t.ok(validate({}), '{}')
    t.ok(validate([]), '[]')
    t.ok(validate([[]]), '[[]]')
    t.ok(validate([[[]]]), '[[[]]]')
    t.notOk(validate([1]), '[1]')
    t.ok(validate([{}]), '[{}]')
  })

  t.throws(() => {
    compile({
      A: {
        type: ['array', 'object'],
        oneOf: [
          {
            type: 'array',
            prefixItems: [{ $ref: '#/$defs/B' }],
          },
          {
            type: 'object',
            required: [],
            additionalProperties: false,
            properties: {
              x: { $ref: '#/$defs/B' },
            },
          },
        ],
      },
      B: {
        type: ['array', 'object'],
        oneOf: [
          {
            type: 'array',
            items: {
              $ref: '#/$defs/A',
            },
          },
          {
            type: 'object',
            required: [],
            additionalProperties: false,
            properties: {
              x: { $ref: '#/$defs/A' },
            },
          },
        ],
      },
    })
  })

  t.throws(() => {
    compile({
      A: {
        type: ['array', 'object'],
        oneOf: [
          {
            type: 'array',
            items: {
              $ref: '#/$defs/B',
            },
          },
          {
            type: 'object',
            required: [],
            additionalProperties: false,
            properties: {
              x: { $ref: '#/$defs/B' },
            },
          },
        ],
      },
      B: {
        type: ['array', 'object'],
        oneOf: [
          {
            type: 'array',
            prefixItems: [{ $ref: '#/$defs/A' }],
          },
          {
            type: 'object',
            required: [],
            additionalProperties: false,
            properties: {
              x: { $ref: '#/$defs/A' },
            },
          },
        ],
      },
    })
  })

  t.end()
})

tape('cyclic local refs do full string validation: !Validation, StringValidation', (t) => {
  const compile = ($defs) =>
    validator(
      {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $defs,
        $ref: '#/$defs/A',
      },
      { requireValidation: false, requireStringValidation: true }
    )

  t.doesNotThrow(() => {
    compile({
      A: {
        type: ['array'],
      },
    })
  })

  t.throws(() => {
    compile({
      A: {
        type: ['string'],
      },
    })
  })

  t.throws(() => {
    compile({
      A: {
        type: ['array', 'string'],
        oneOf: [
          {
            type: 'array',
            items: {
              $ref: '#/$defs/A',
            },
          },
          {
            type: 'string',
          },
        ],
      },
    })
  })

  t.doesNotThrow(() => {
    const validate = compile({
      A: {
        type: ['array', 'string'],
        oneOf: [
          {
            type: 'array',
            items: {
              $ref: '#/$defs/A',
            },
          },
          {
            type: 'string',
            format: 'date',
          },
        ],
      },
    })
    t.notOk(validate({}), '{}')
    t.ok(validate([]), '[]')
    t.ok(validate([[]]), '[[]]')
    t.ok(validate([[[]]]), '[[[]]]')
    t.notOk(validate(['']), '[""]')
    t.ok(validate(['2000-01-01']), '["2000-01-01"]')
  })

  t.throws(() => {
    compile({
      A: {
        type: ['array', 'string'],
        oneOf: [
          {
            type: 'array',
            items: {
              $ref: '#/$defs/B',
            },
          },
          {
            type: 'string',
            format: 'date',
          },
        ],
      },
      B: {
        type: ['array', 'string'],
        oneOf: [
          {
            type: 'array',
            items: {
              $ref: '#/$defs/A',
            },
          },
          {
            type: 'string',
          },
        ],
      },
    })
  })

  t.throws(() => {
    compile({
      A: {
        type: ['array', 'string'],
        oneOf: [
          {
            type: 'array',
            items: {
              $ref: '#/$defs/B',
            },
          },
          {
            type: 'string',
          },
        ],
      },
      B: {
        type: ['array', 'string'],
        oneOf: [
          {
            type: 'array',
            items: {
              $ref: '#/$defs/A',
            },
          },
          {
            type: 'string',
            format: 'date',
          },
        ],
      },
    })
  })

  t.doesNotThrow(() => {
    const validate = compile({
      A: {
        type: ['array', 'string'],
        oneOf: [
          {
            type: 'array',
            items: {
              $ref: '#/$defs/B',
            },
          },
          {
            type: 'string',
            format: 'date',
          },
        ],
      },
      B: {
        type: ['array', 'string'],
        oneOf: [
          {
            type: 'array',
            items: {
              $ref: '#/$defs/A',
            },
          },
          {
            type: 'string',
            format: 'date',
          },
        ],
      },
    })
    t.notOk(validate({}), '{}')
    t.ok(validate([]), '[]')
    t.ok(validate([[]]), '[[]]')
    t.ok(validate([[[]]]), '[[[]]]')
    t.notOk(validate(['']), '[""]')
    t.ok(validate(['2000-01-01']), '["2000-01-01"]')
  })

  t.end()
})
