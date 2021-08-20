'use strict'

const tape = require('tape')
const { validator } = require('../../')

tape('noop pattern compiles in allErrors mode', (t) => {
  t.doesNotThrow(() => {
    validator(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        additionalProperties: {
          type: 'string',
          pattern: '^[\\s\\S]*$',
        },
      },
      {
        includeErrors: true,
        allErrors: true,
      }
    )
  })

  t.end()
})
