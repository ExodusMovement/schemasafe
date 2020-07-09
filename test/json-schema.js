'use strict'

const tape = require('tape')
const fs = require('fs')
const path = require('path')
const { validator } = require('../')

// these tests require lax mode
const unsafe = new Set([
  'additionalItems.json/items is schema, no additionalItems',
  'additionalItems.json/additionalItems as false without items',
  'additionalItems.json/additionalItems should not look in applicators, valid case',
  'maxContains.json/maxContains without contains is ignored',
  'minContains.json/minContains without contains is ignored',
  'ref.json/escaped pointer ref',
  'ref.json/ref overrides any sibling keywords', // this was fixed in draft/2019-09 spec
  'if-then-else.json/ignore if without then or else',
  'if-then-else.json/ignore then without if',
  'if-then-else.json/ignore else without if',
  'if-then-else.json/non-interference across combined schemas',

  // draft3 only
  'draft3/additionalItems.json/additionalItems should not look in applicators',
  'draft3/additionalProperties.json/additionalProperties should not look in applicators',

  // draft2019-09 only
  'draft2019-09/optional/refOfUnknownKeyword.json/reference of a root arbitrary keyword ',
  'draft2019-09/optional/refOfUnknownKeyword.json/reference of an arbitrary keyword of a sub-schema',
])

const unsupported = new Set([
  // Unsupported formats
  'format.json/validation of IRIs',
  'format.json/validation of IRI references',
  'format.json/validation of IDN hostnames',
  'format.json/validation of IDN e-mail addresses',
  'optional/format/iri-reference.json',
  'optional/format/iri.json',
  'optional/format/idn-email.json',
  'optional/format/idn-hostname.json',

  // Optional
  'optional/content.json', // draft7+
  'optional/zeroTerminatedFloats.json', // makes no sense in js

  //  draft3 is deprecated and not fully supported
  'draft3/extends.json',
  'draft3/disallow.json',
  'draft3/type.json', // we don't want draft3-specific type logic
  'draft3/ref.json/remote ref, containing refs itself',
  'draft3/optional/ecmascript-regex.json/ECMA 262 regex dialect recognition', // broken assumption in test

  //  draft2019-09 is not supported yet
  'draft2019-09/unevaluatedProperties.json',
  'draft2019-09/unevaluatedItems.json',
  'draft2019-09/ref.json/ref creates new scope when adjacent to keywords',
])

const schemas = [
  // standard
  require('./schemas/json-schema-draft-2019-09/meta/core.json'),
  require('./schemas/json-schema-draft-2019-09/meta/applicator.json'),
  require('./schemas/json-schema-draft-2019-09/meta/validation.json'),
  require('./schemas/json-schema-draft-2019-09/meta/meta-data.json'),
  require('./schemas/json-schema-draft-2019-09/meta/format.json'),
  require('./schemas/json-schema-draft-2019-09/meta/content.json'),
  require('./schemas/json-schema-draft-2019-09/schema.json'),
  require('./schemas/json-schema-draft-07.json'),
  require('./schemas/json-schema-draft-06.json'),
  require('./schemas/json-schema-draft-04.json'),
  require('./schemas/json-schema-draft-03.json'),
  // remote
  {
    $id: 'http://localhost:1234/integer.json',
    ...require('./JSON-Schema-Test-Suite/remotes/integer.json'),
  },
  {
    $id: 'http://localhost:1234/subSchemas.json',
    ...require('./JSON-Schema-Test-Suite/remotes/subSchemas.json'),
  },
  {
    $id: 'http://localhost:1234/subSchemas-defs.json',
    ...require('./JSON-Schema-Test-Suite/remotes/subSchemas-defs.json'),
  },
  {
    $id: 'http://localhost:1234/folder/folderInteger.json',
    ...require('./JSON-Schema-Test-Suite/remotes/folder/folderInteger.json'),
  },
  {
    $id: 'http://localhost:1234/name.json',
    ...require('./JSON-Schema-Test-Suite/remotes/name.json'),
  },
  {
    $id: 'http://localhost:1234/name-defs.json',
    ...require('./JSON-Schema-Test-Suite/remotes/name-defs.json'),
  },
]

function processTestDir(schemaDir, main, subdir = '') {
  const dir = path.join(__dirname, schemaDir, main, subdir)
  const shouldIngore = (id) => unsupported.has(id) || unsupported.has(`${main}/${id}`)
  const requiresLax = (id) => unsafe.has(id) || unsafe.has(`${main}/${id}`)
  for (const file of fs.readdirSync(dir)) {
    const sub = path.join(subdir, file) // relative to schemaDir
    if (shouldIngore(sub)) continue
    if (file.endsWith('.json')) {
      const content = fs.readFileSync(path.join(dir, file))
      processTest(main, sub, JSON.parse(content), shouldIngore, requiresLax)
    } else {
      // assume it's a dir and let it fail otherwise
      processTestDir(schemaDir, main, sub)
    }
  }
}

const schemaVersions = new Map(
  Object.entries({
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
        const validate = validator(block.schema, { schemas, mode, $schemaDefault, extraFormats })
        for (const test of block.tests) {
          if (shouldIngore(`${id}/${block.description}/${test.description}`)) continue
          t.same(validate(test.data), test.valid, test.description)
        }
      } catch (e) {
        t.fail(e)
      } finally {
        t.end()
      }
    })
  }
}

const testsDir = 'JSON-Schema-Test-Suite/tests'
processTestDir(testsDir, 'draft4')
processTestDir(testsDir, 'draft6')
processTestDir(testsDir, 'draft7')
processTestDir(testsDir, 'draft3')
processTestDir(testsDir, 'draft2019-09')
