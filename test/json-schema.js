'use strict'

const fs = require('fs')
const path = require('path')
const schemas = require('./util/schemas')
const { processTest } = require('./util/json-schema-test')

// these tests require lax mode
const unsafe = new Set([
  'additionalItems.json/items is schema, no additionalItems',
  'additionalItems.json/additionalItems as false without items',
  'additionalItems.json/additionalItems should not look in applicators, valid case',
  'maxContains.json/maxContains without contains is ignored',
  'minContains.json/minContains without contains is ignored',
  'minContains.json/maxContains < minContains',
  'if-then-else.json/if with boolean schema true',
  'if-then-else.json/if with boolean schema false',
  'if-then-else.json/ignore if without then or else',
  'if-then-else.json/ignore then without if',
  'if-then-else.json/ignore else without if',
  'if-then-else.json/non-interference across combined schemas',
  'unevaluatedProperties.json/unevaluatedProperties with nested unevaluatedProperties',
  'not.json/not with boolean schema false',
  'anyOf.json/anyOf with one empty schema',
  'anyOf.json/anyOf with boolean schemas, all true',
  'anyOf.json/anyOf with boolean schemas, some true',
  'oneOf.json/oneOf with boolean schemas, one true',
  'oneOf.json/oneOf with boolean schemas, more than one true',
  'oneOf.json/oneOf with boolean schemas, all false',

  'ref.json/ref overrides any sibling keywords', // this was fixed in draft/2019-09 spec

  // tests $recursiveRef without $recursiveAnchor, we treat this as a mistake
  'extra-tests/recursiveRef.391.json/$recursiveRef without $recursiveAnchor works like $ref',
  'extra-tests/recursiveRef.391.json/$recursiveRef with $recursiveAnchor: false works like $ref',
  'extra-tests/recursiveRef.391.json/$recursiveRef with no $recursiveAnchor works like $ref',
  'extra-tests/recursiveRef.391.json/$recursiveRef with no $recursiveAnchor in the initial target schema resource',

  // draft3 only
  'draft3/additionalItems.json/additionalItems should not look in applicators',
  'draft3/additionalProperties.json/additionalProperties should not look in applicators',

  // draft2019-09 only
  'draft2019-09/optional/refOfUnknownKeyword.json/reference of a root arbitrary keyword ',
  'draft2019-09/optional/refOfUnknownKeyword.json/reference of an arbitrary keyword of a sub-schema',
  'draft2019-09/unevaluatedProperties.json/nested unevaluatedProperties, outer true, inner false, properties outside',
  'draft2019-09/unevaluatedProperties.json/nested unevaluatedProperties, outer true, inner false, properties inside',

  // ajv tests
  'rules/if.json/then/else without if should be ignored',
  'rules/if.json/if without then/else should be ignored',
  'rules/anyOf.json/anyOf with one of schemas empty',
  'schemas/cosmicrealms.json/schema from cosmicrealms benchmark',
  'schemas/advanced.json/advanced schema from z-schema benchmark (https://github.com/zaggino/z-schema)',
  'issues/27_1_recursive_raml_schema.json/JSON Schema for a standard RAML object (#27)',
  'issues/62_resolution_scope_change.json/resolution scope change - change folder (#62)',
  'issues/70_swagger_schema.json/Swagger api schema does not compile (#70)',
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

  //  draft4/draft3, optional
  'optional/zeroTerminatedFloats.json', // makes no sense in js
  //  draft3 is deprecated and not fully supported
  'draft3/extends.json',
  'draft3/disallow.json',
  'draft3/type.json', // we don't want draft3-specific type logic
  'draft3/required.json', // we don't support boolean required
  'draft3/enum.json/enums in properties', // we don't support boolean required
  'draft3/ref.json/remote ref, containing refs itself',
  'draft3/optional/ecmascript-regex.json/ECMA 262 regex dialect recognition', // broken assumption in test

  // ajv specific non-standard tests
  'rules/format.json/whitelisted unknown format is valid',
  'rules/format.json/validation of URL strings',
  'rules/format.json/validation of JSON-pointer URI fragment strings',
  'issues/33_json_schema_latest.json/use latest json schema as v4 (#33)',
])

function processTestDir(schemaDir, main, subdir = '') {
  const dir = path.join(__dirname, schemaDir, main, subdir)
  const shouldIngore = (id) => unsupported.has(id) || unsupported.has(`${main}/${id}`)
  const requiresLax = (id) => unsafe.has(id) || unsafe.has(`${main}/${id}`)
  for (const file of fs.readdirSync(dir)) {
    const sub = path.join(subdir, file) // relative to schemaDir
    if (shouldIngore(sub)) continue
    if (file.endsWith('.json')) {
      const content = fs.readFileSync(path.join(dir, file), 'utf-8')
      processTest(main, sub, JSON.parse(content), shouldIngore, requiresLax)
    } else {
      // assume it's a dir and let it fail otherwise
      processTestDir(schemaDir, main, sub)
    }
  }
}

/** JSON Schema Test Suite tests **/
const testsDir = 'JSON-Schema-Test-Suite/tests'
processTestDir(testsDir, 'draft4')
processTestDir(testsDir, 'draft6')
processTestDir(testsDir, 'draft7')
processTestDir(testsDir, 'draft3')
processTestDir(testsDir, 'draft2019-09')

/** extra tests not (yet) merged upstream **/
processTestDir('', 'extra-tests')

/** ajv tests **/
schemas.push(
  ...[
    require('./ajv-spec/remotes/bar.json'),
    require('./ajv-spec/remotes/foo.json'),
    require('./ajv-spec/remotes/buu.json'),
    require('./ajv-spec/remotes/tree.json'),
    require('./ajv-spec/remotes/node.json'),
    require('./ajv-spec/remotes/second.json'),
    require('./ajv-spec/remotes/first.json'),
    require('./ajv-spec/remotes/scope_change.json'),
  ]
)
processTestDir('ajv-spec/tests', 'issues')
processTestDir('ajv-spec/tests', 'rules')
processTestDir('ajv-spec/tests', 'schemas')
processTestDir('ajv-spec', 'extras.part')
