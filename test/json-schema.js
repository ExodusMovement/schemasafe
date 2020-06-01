const tape = require('tape')
const fs = require('fs')
const path = require('path')
const validator = require('../')

// these tests require lax mode
const unsafe = new Set([
  'additionalItems.json/items is schema, no additionalItems',
  'additionalItems.json/additionalItems as false without items',
  'ref.json/escaped pointer ref',
])

const unsupported = new Set([
  // Whole files, meaning unsupported keywords / features
  //  draft4
  'definitions.json',
  'refRemote.json',
  //  draft6
  'contains.json',
  //  draft7
  'if-then-else.json',
  //  draft2019-09
  'minContains.json',
  'maxContains.json',
  'anchor.json',
  'dependentSchemas.json',
  'dependentRequired.json',
  'unevaluatedProperties.json',
  'unevaluatedItems.json',
  'defs.json',
  //  draft3 only
  'draft3/extends.json',
  'draft3/disallow.json',

  // Unsupported formats
  //  draft6 and later
  'format.json/validation of JSON pointers',
  'format.json/validation of relative JSON pointers',
  'format.json/validation of URI references',
  'format.json/validation of URI templates',
  'format.json/validation of IRIs',
  'format.json/validation of IRI references',
  'format.json/validation of IDN hostnames',
  'format.json/validation of IDN e-mail addresses',
  'format.json/validation of regexes', // deliberately unsupported
  //  draft3 only
  'draft3/format.json/validation of regular expressions', // deliberately unsupported

  // Blocks and individual tests
  //  draft4
  'ref.json/escaped pointer ref',
  'ref.json/remote ref, containing refs itself',
  'ref.json/ref overrides any sibling keywords',
  'ref.json/Recursive references between schemas',
  'ref.json/Location-independent identifier with base URI change in subschema',
  //  draft2019-09
  'ref.json/ref creates new scope when adjacent to keywords',
  //  draft3 only
  'draft3/additionalProperties.json/additionalProperties should not look in applicators',
  'draft3/type.json/types can include schemas',
  'draft3/type.json/when types includes a schema it should fully validate the schema',
  'draft3/type.json/types from separate schemas are merged',

  // Optional
  'optional/zeroTerminatedFloats.json',
  'optional/format/regex.json', // deliberately unsupported
  'optional/ecmascript-regex.json', // deliberately unsupported
  'optional/format.json/validation of regular expressions', // deliberately unsupported
  'optional/format/ecmascript-regex.json', // deliberately unsupported
  'optional/format.json/validation of JSON-pointers (JSON String Representation)',
  'optional/format.json/validation of URI References',
  'optional/format.json/format: uri-template',
  'optional/format/uri-reference.json',
  'optional/format/uri-template.json',
  'optional/format/iri-reference.json',
  'optional/format/iri.json',
  'optional/format/idn-email.json',
  'optional/format/idn-hostname.json',
  'optional/format/json-pointer.json',
  'optional/format/relative-json-pointer.json',
  //  draft7
  'optional/content.json',
  //  draft2019-09
  'optional/refOfUnknownKeyword.json',
  'optional/format/duration.json',
  //  draft3 only
  'draft3/optional/format.json/validation of CSS colors',
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

function processTest(main, id, file, shouldIngore, requiresLax) {
  for (const block of file) {
    if (shouldIngore(`${id}/${block.description}`)) continue
    tape(`json-schema-test-suite ${main}/${id}/${block.description}`, (t) => {
      try {
        const mode = requiresLax(`${id}/${block.description}`) ? 'lax' : 'default'
        const validate = validator(block.schema, { schemas, mode })
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
