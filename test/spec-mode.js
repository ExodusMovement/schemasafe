'use strict'

const tape = require('tape')
const { validator } = require('../')

const newVersions = ['draft/next', 'draft/2020-12', 'draft/2019-09']
const oldVersions = ['draft-07', 'draft-06', 'draft-04', 'draft-03']
const schemaUrl = (draft) => `https://json-schema.org/${draft}/schema`

tape('default, strong and lax modes validate formats', (t) => {
  for (const mode of ['default', 'strong', 'lax']) {
    for (const schema of [...newVersions, ...oldVersions]) {
      t.doesNotThrow(() => {
        const validate = validator(
          {
            $schema: schemaUrl(schema),
            type: 'string',
            format: 'date',
          },
          { mode }
        )
        t.ok(validate('2000-01-01'), `valid date passes, ${JSON.stringify({ mode, schema })}`)
        t.notOk(validate('2000-01-'), `invalid date fails, ${JSON.stringify({ mode, schema })}`)
      })
    }
  }
  t.end()
})

tape('spec mode validate formats for old schema versions', (t) => {
  for (const mode of ['spec']) {
    for (const schema of [...oldVersions]) {
      t.doesNotThrow(() => {
        const validate = validator(
          {
            $schema: schemaUrl(schema),
            type: 'string',
            format: 'date',
          },
          { mode }
        )
        t.ok(validate('2000-01-01'), `valid date passes, ${JSON.stringify({ mode, schema })}`)
        t.notOk(validate('2000-01-'), `invalid date fails, ${JSON.stringify({ mode, schema })}`)
      })
    }
  }
  t.end()
})

tape('All modes validate formats for unknown $schema', (t) => {
  // strong mode demands $schema and hence is skipped
  for (const mode of ['default', 'lax', 'spec']) {
    t.doesNotThrow(() => {
      const validate = validator(
        {
          type: 'string',
          format: 'date',
        },
        { mode }
      )
      t.ok(validate('2000-01-01'), `valid date passes, ${JSON.stringify({ mode })}, no schema`)
      t.notOk(validate('2000-01-'), `invalid date fails, ${JSON.stringify({ mode })}, no schema`)
    })
  }
  t.end()
})

tape('spec mode skips format validation for new schema versions', (t) => {
  for (const mode of ['spec']) {
    for (const schema of [...newVersions]) {
      t.doesNotThrow(() => {
        const validate = validator(
          {
            $schema: schemaUrl(schema),
            type: 'string',
            format: 'date',
          },
          { mode }
        )
        t.ok(validate('2000-01-01'), `valid date passes, ${JSON.stringify({ mode, schema })}`)
        t.ok(validate('2000-01-'), `invalid date passes, ${JSON.stringify({ mode, schema })}`)
      })
    }
  }
  t.end()
})

tape('formatAssertion: false skips format validation for all modes except strong', (t) => {
  for (const mode of ['default', 'lax', 'spec']) {
    for (const schema of [...newVersions, ...oldVersions]) {
      t.doesNotThrow(() => {
        const validate = validator(
          {
            $schema: schemaUrl(schema),
            type: 'string',
            format: 'date',
          },
          { mode, formatAssertion: false }
        )
        t.ok(validate('2000-01-01'), `valid date passes, ${JSON.stringify({ mode, schema })}`)
        t.ok(validate('2000-01-'), `invalid date passes, ${JSON.stringify({ mode, schema })}`)
      })
    }
  }
  t.end()
})

tape('formatAssertion: false throws in strong mode', (t) => {
  for (const mode of ['strong']) {
    for (const schema of [...newVersions, ...oldVersions]) {
      t.throws(() => {
        validator(
          {
            $schema: schemaUrl(schema),
            type: 'string',
            format: 'date',
          },
          { mode, formatAssertion: false }
        )
      })
    }
  }
  t.end()
})
