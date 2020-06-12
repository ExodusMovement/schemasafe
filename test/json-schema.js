const tape = require('tape')
const fs = require('fs')
const path = require('path')
const validator = require('../')

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
])

const unsupported = new Set([
  // Whole files, meaning unsupported keywords / features
  //  draft2019-09
  'draft2019-09/anchor.json',
  'draft2019-09/dependentSchemas.json',
  'draft2019-09/unevaluatedProperties.json',
  'draft2019-09/unevaluatedItems.json',
  'draft2019-09/defs.json',
  'draft2019-09/refRemote.json', // earlier versions are fine
  'draft2019-09/id.json', // earlier versions are fine
  //  draft3 only
  'draft3/extends.json',
  'draft3/disallow.json',

  // Unsupported formats
  //  draft6 and later
  'format.json/validation of IRIs',
  'format.json/validation of IRI references',
  'format.json/validation of IDN hostnames',
  'format.json/validation of IDN e-mail addresses',

  // Blocks and individual tests
  //  draft2019-09
  'draft2019-09/ref.json/ref creates new scope when adjacent to keywords',
  'draft2019-09/ref.json/remote ref, containing refs itself',
  //  draft3 only
  'draft3/ref.json/remote ref, containing refs itself',
  'draft3/type.json/types can include schemas',
  'draft3/type.json/when types includes a schema it should fully validate the schema',
  'draft3/type.json/types from separate schemas are merged',
  'draft3/optional/ecmascript-regex.json/ECMA 262 regex dialect recognition', // broken assumption in test

  // Optional
  'optional/zeroTerminatedFloats.json',
  'optional/format/iri-reference.json',
  'optional/format/iri.json',
  'optional/format/idn-email.json',
  'optional/format/idn-hostname.json',
  //  draft7
  'optional/content.json',
  //  draft2019-09
  'draft2019-09/optional/refOfUnknownKeyword.json',
  'draft2019-09/optional/format/duration.json',
])

const schemaDir = path.join(__dirname, 'JSON-Schema-Test-Suite/tests')

const schemas = {
  // standard
  'https://json-schema.org/draft/2019-09/schema': require('./schemas/json-schema-draft-2019-09.json'),
  'http://json-schema.org/draft-07/schema': require('./schemas/json-schema-draft-07.json'),
  'http://json-schema.org/draft-06/schema': require('./schemas/json-schema-draft-06.json'),
  'http://json-schema.org/draft-04/schema': require('./schemas/json-schema-draft-04.json'),
  'http://json-schema.org/draft-03/schema': require('./schemas/json-schema-draft-03.json'),
  // remote
  'http://localhost:1234/integer.json': require('./JSON-Schema-Test-Suite/remotes/integer.json'),
  'http://localhost:1234/subSchemas.json': require('./JSON-Schema-Test-Suite/remotes/subSchemas.json'),
  'http://localhost:1234/folder/folderInteger.json': require('./JSON-Schema-Test-Suite/remotes/folder/folderInteger.json'),
  'http://localhost:1234/name.json': require('./JSON-Schema-Test-Suite/remotes/name.json'),
  'http://localhost:1234/name-defs.json': require('./JSON-Schema-Test-Suite/remotes/name-defs.json'),
}

function processTestDir(main, subdir = '') {
  const dir = path.join(schemaDir, main, subdir)
  const shouldIngore = (id) => unsupported.has(id) || unsupported.has(`${main}/${id}`)
  const requiresLax = (id) => unsafe.has(id) || unsafe.has(`${main}/${id}`)
  for (const file of fs.readdirSync(dir)) {
    const sub = path.join(subdir, file) // relative to schemaDir
    if (shouldIngore(sub)) continue
    if (file.endsWith('.json')) {
      const content = fs.readFileSync(path.join(schemaDir, main, sub))
      processTest(main, sub, JSON.parse(content), shouldIngore, requiresLax)
    } else {
      // assume it's a dir and let it fail otherwise
      processTestDir(main, sub)
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

processTestDir('draft4')
processTestDir('draft6')
processTestDir('draft7')
processTestDir('draft3')
processTestDir('draft2019-09')
