'use strict'

const tape = require('tape')
const { validator, parser } = require('../../')
const schemas = require('./schemas')

const schemaVersions = new Map(
  Object.entries({
    'draft2020-12': 'http://json-schema.org/draft/2020-12/schema#',
    'draft2019-09': 'http://json-schema.org/draft/2019-09/schema#',
    draft7: 'http://json-schema.org/draft-07/schema#',
    draft6: 'http://json-schema.org/draft-06/schema#',
    draft4: 'http://json-schema.org/draft-04/schema#',
    draft3: 'http://json-schema.org/draft-03/schema#',
  })
)

function processTest(main, id, file, shouldIngore, requiresLax) {
  for (const block of file) {
    if (shouldIngore(`${id}/${block.description}`)) continue
    tape(`json-schema-test-suite ${main}/${id}/${block.description}`, (t) => {
      try {
        const mode = requiresLax(`${id}/${block.description}`) ? 'lax' : 'default'
        const $schemaDefault = schemaVersions.get(main)
        const extraFormats = main === 'draft3' // needs old formats
        const blockSchemas = [
          ...(Object.hasOwnProperty.call(block, 'schema') ? [block.schema] : []),
          ...(block.schemas || []),
        ]
        for (const schema of blockSchemas) {
          for (const [includeErrors, allErrors] of [[false, false], [true, false], [true, true]]) {
            // ajv sometimes specifies just the schema id as "schema"
            const wrapped = typeof schema === 'string' ? { $ref: schema } : schema
            const opts = { schemas, mode, $schemaDefault, extraFormats, includeErrors, allErrors }
            const validate = validator(wrapped, opts)
            const parse = parser(wrapped, opts)
            for (const test of block.tests) {
              if (shouldIngore(`${id}/${block.description}/${test.description}`)) continue
              t.same(validate(test.data), test.valid, test.description)
              t.same(parse(JSON.stringify(test.data)).valid, test.valid, test.description)
            }
            if (mode === 'lax') {
              t.throws(
                () => validator(wrapped, { ...opts, mode: 'default' }),
                'Throws without lax mode'
              )
            }
          }
        }
      } catch (e) {
        t.fail(e)
      } finally {
        t.end()
      }
    })
  }
}

module.exports = { processTest }
