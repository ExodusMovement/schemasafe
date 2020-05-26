const tape = require('tape')
const fs = require('fs')
const path = require('path')
const validator = require('../')

const schemaDraftDir = path.join(__dirname, '/json-schema-draft4')
const files = fs.readdirSync(schemaDraftDir)
  .map(function(file) {
    if (file === 'definitions.json') return null
    if (file === 'refRemote.json') return null
    if (file === 'ref.json') return null
    const content = fs.readFileSync(path.join(schemaDraftDir, file))
    return JSON.parse(content)
  })
  .filter(Boolean)

files.forEach(function(file) {
  file.forEach(function(f) {
    tape(`json-schema-test-suite ${f.description}`, function(t) {
      const validate = validator(f.schema)
      f.tests.forEach(function(test) {
        t.same(validate(test.data), test.valid, test.description)
      })
      t.end()
    })
  })
})
