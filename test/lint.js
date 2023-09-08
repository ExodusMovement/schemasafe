'use strict'

const tape = require('tape')
const { lint } = require('../')

tape('lint mode', (t) => {
  t.deepEqual(
    lint({
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'string',
      format: 'date',
    }),
    []
  )
  t.doesNotThrow(() => {
    const schema = { type: 'string', format: 'date' }
    t.deepEqual(lint(schema), [])
    t.deepEqual(lint(schema, { mode: 'strong' }), [
      { message: '[requireSchema] $schema is required at #', keywordLocation: '#', schema },
    ])
  })
  t.end()
})
