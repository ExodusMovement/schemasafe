'use strict'

const tape = require('tape')
const { validator } = require('../../')

tape('$schema is required on sub-schemas when sub-$ref is present', (t) => {
  t.throws(() => {
    validator(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $ref: 'other#/definitions/obj',
      },
      {
        mode: 'strong',
        schemas: {
          other: {
            definitions: {
              obj: {
                type: 'object',
                required: [],
                properties: {
                  x: { $ref: '#/definitions/obj' },
                },
                additionalProperties: false,
              },
            },
          },
        },
      }
    )
  }, /\[requireSchema\] \$schema is required/)

  t.doesNotThrow(() => {
    validator(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $ref: 'other#/definitions/obj',
      },
      {
        mode: 'strong',
        schemas: {
          other: {
            $schema: 'http://json-schema.org/draft-07/schema#',
            definitions: {
              obj: {
                type: 'object',
                required: [],
                properties: {
                  x: { $ref: '#/definitions/obj' },
                },
                additionalProperties: false,
              },
            },
          },
        },
      }
    )
  })

  t.end()
})

tape('$schema is required on sub-schemas even when sub-$ref is not present', (t) => {
  t.throws(() => {
    validator(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $ref: 'other#/definitions/obj',
      },
      {
        mode: 'strong',
        schemas: {
          other: {
            definitions: {
              obj: {
                type: 'object',
                required: [],
                properties: {
                  x: { type: 'number' },
                },
                additionalProperties: false,
              },
            },
          },
        },
      }
    )
  }, /\[requireSchema\] \$schema is required/)

  t.doesNotThrow(() => {
    validator(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $ref: 'other#/definitions/obj',
      },
      {
        mode: 'strong',
        schemas: {
          other: {
            $schema: 'http://json-schema.org/draft-07/schema#',
            definitions: {
              obj: {
                type: 'object',
                required: [],
                properties: {
                  x: { type: 'number' },
                },
                additionalProperties: false,
              },
            },
          },
        },
      }
    )
  })

  t.end()
})

tape('$schema is affecting sub-$refs behavior', (t) => {
  const options = ($schema) => [
    { $schema, $ref: 'other#/definitions/obj' },
    {
      mode: 'strong',
      schemas: {
        other: {
          $schema,
          definitions: {
            obj: {
              type: 'object',
              required: [],
              properties: {
                x: {
                  $ref: '#/definitions/obj',
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
          },
        },
      },
    },
  ]
  t.throws(() => {
    validator(...options('http://json-schema.org/draft-07/schema#'))
  }, /Unprocessed keywords: \["additionalProperties"\]/)

  t.doesNotThrow(() => {
    const validate = validator(...options('https://json-schema.org/draft/2019-09/schema'))

    t.ok(validate({}), '{}')
    t.ok(validate({ x: {} }), '{x:{}}')
    t.notOk(validate({ x: 3 }), '{x:3}')
    t.notOk(validate({ y: {} }), '{y:{}}')
    t.notOk(validate({ x: { x: {} } }), '{x:{x:{}}')
  })

  t.end()
})
