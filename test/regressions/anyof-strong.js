'use strict'

const tape = require('tape')
const { validator } = require('../../')

tape('anyOf does not confuse strong mode', (t) => {
  t.doesNotThrow(() => {
    const validate = validator(
      {
        $schema: 'http://json-schema.org/draft/2020-12/schema#',
        anyOf: [{ const: 1 }, { const: 2 }],
      },
      { mode: 'strong' }
    )

    t.notOk(validate(0), '0')
    t.ok(validate(1), '1')
    t.ok(validate(2), '2')
    t.notOk(validate(''), '""')
  })

  t.end()
})
