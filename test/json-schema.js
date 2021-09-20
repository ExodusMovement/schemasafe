'use strict'

const fs = require('fs')
const path = require('path')
const schemas = require('./util/schemas')
const { processTest } = require('./util/json-schema-test')

// these tests require lax mode
const unsafe = new Set([
  'additionalItems.json/when items is schema, additionalItems does nothing',
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
  'unevaluatedProperties.json/nested unevaluatedProperties, outer true, inner false, properties outside',
  'unevaluatedProperties.json/nested unevaluatedProperties, outer true, inner false, properties inside',
  'unevaluatedItems.json/unevaluatedItems and contains interact to control item dependency relationship', // lone if
  'not.json/not with boolean schema false',
  'anyOf.json/anyOf with one empty schema',
  'anyOf.json/anyOf with boolean schemas, all true',
  'anyOf.json/anyOf with boolean schemas, some true',
  'oneOf.json/oneOf with boolean schemas, one true',
  'oneOf.json/oneOf with boolean schemas, more than one true',
  'oneOf.json/oneOf with boolean schemas, all false',
  'unknownKeyword.json/$id inside an unknown keyword is not a real identifier',
  'optional/refOfUnknownKeyword.json/reference of a root arbitrary keyword ',
  'optional/refOfUnknownKeyword.json/reference of an arbitrary keyword of a sub-schema',

  'ref.json/ref overrides any sibling keywords', // this was fixed in draft/2019-09 spec

  // draft3 only
  'draft3/additionalItems.json/additionalItems should not look in applicators',
  'draft3/additionalProperties.json/additionalProperties should not look in applicators',

  // draft2019-09 only
  // tests $recursiveRef without $recursiveAnchor, we treat this as a mistake
  'draft2019-09/recursiveRef.json/$recursiveRef without $recursiveAnchor works like $ref',
  'draft2019-09/recursiveRef.json/$recursiveRef with $recursiveAnchor: false works like $ref',
  'draft2019-09/recursiveRef.json/$recursiveRef with no $recursiveAnchor works like $ref',
  'draft2019-09/recursiveRef.json/$recursiveRef with no $recursiveAnchor in the initial target schema resource',

  // same for $dynamicRef without $dynamicAnchor in the same scope
  'dynamicRef.json/A $dynamicRef to an $anchor in the same schema resource should behave like a normal $ref to an $anchor',
  'dynamicRef.json/A $dynamicRef without a matching $dynamicAnchor in the same schema resource should behave like a normal $ref to $anchor',
  'dynamicRef.json/A $dynamicRef with a non-matching $dynamicAnchor in the same schema resource should behave like a normal $ref to $anchor',
  'dynamicRef.json/A $dynamicRef that initially resolves to a schema without a matching $dynamicAnchor should behave like a normal $ref to $anchor',

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
  'optional/format/iri-reference.json',
  'optional/format/iri.json',
  'optional/format/idn-email.json',
  'optional/format/idn-hostname.json',

  // deliberate differences where format/content do not expect any validation by default in upstream
  'draft2019-09/content.json', // expected to be noop in draft2019-09 and actually implemented as an assertion here
  'draft2020-12/content.json', // same as draft2019-09, we have a replacement test
  'draft-future/content.json', // same

  // we have leading time-offset (e.g. Z) optional in time format for compat reasons for now
  'optional/format/time.json/validation of time strings/no time offset',

  //  draft4/draft3, optional
  'optional/zeroTerminatedFloats.json', // makes no sense in js
  //  draft3 is deprecated and not fully supported
  'draft3/extends.json',
  'draft3/disallow.json',
  'draft3/type.json', // we don't want draft3-specific type logic
  'draft3/required.json', // we don't support boolean required
  'draft3/infinite-loop-detection.json', // has 'extends'
  'draft3/enum.json/enums in properties', // we don't support boolean required
  'draft3/ref.json/remote ref, containing refs itself',
  'draft3/optional/ecmascript-regex.json/ECMA 262 regex dialect recognition', // broken assumption in test

  // ajv specific non-standard tests
  'rules/format.json/whitelisted unknown format is valid',
  'rules/format.json/validation of URL strings',
  'rules/format.json/validation of JSON-pointer URI fragment strings',
  'issues/33_json_schema_latest.json/use latest json schema as v4 (#33)',

  // draft-future only, object contains
  'draft-future/contains.json',
  'draft-future/maxContains.json',
  'draft-future/unevaluatedProperties.json/unevaluatedProperties depends on adjacent contains',
  'draft-future/unevaluatedProperties.json/unevaluatedProperties depends on multiple nested contains',
])
const unsupportedMask = []

// There is no option to make all formats fallback to noop, but users can easily opt-in to that
// per-format, or get a visible error in compile time
const unsupportedFormats = {
  iri: () => true,
  'iri-reference': () => true,
  'idn-email': () => true,
  'idn-hostname': () => true,
}
const manualFormats = (file) => (file === 'format.json' ? unsupportedFormats : undefined)

function processTestDir(schemaDir, main, subdir = '') {
  const dir = path.join(__dirname, schemaDir, main, subdir)
  const shouldIngore = (id) =>
    unsupported.has(id) ||
    unsupported.has(`${main}/${id}`) ||
    unsupportedMask.some((mask) => mask.test(id))
  const requiresLax = (id) => unsafe.has(id) || unsafe.has(`${main}/${id}`)
  for (const file of fs.readdirSync(dir)) {
    const sub = path.join(subdir, file) // relative to schemaDir
    if (shouldIngore(sub)) continue
    if (file.endsWith('.md')) continue
    if (file.endsWith('.json')) {
      const content = fs.readFileSync(path.join(dir, file), 'utf-8')
      processTest(main, sub, JSON.parse(content), shouldIngore, requiresLax, manualFormats(file))
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
processTestDir(testsDir, 'draft2020-12')
processTestDir(testsDir, 'draft-future')

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
