'use strict'

const fs = require('fs')
const path = require('path')
const testSchemas = require('./util/schemas')
const { processTest } = require('./util/json-schema-test')

let filter

if (process.argv.length === 3 && path.resolve(process.argv[1]) === __filename) {
  filter = process.argv[2]
}

// these tests require lax mode
const unsafe = new Set([
  'additionalItems.json/when items is schema, additionalItems does nothing',
  'additionalItems.json/additionalItems as false without items',
  'additionalItems.json/additionalItems does not look in applicators, valid case',
  'additionalItems.json/additionalItems with null instance elements',
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
  'unevaluatedItems.json/unevaluatedItems with nested items', // schema true
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
  'optional/cross-draft.json/refs to historic drafts are processed as historic drafts',
  'content.json', // validation for content is disabled by default per spec, which we treat as unsafe

  'ref.json/ref overrides any sibling keywords', // this was fixed in draft/2019-09 spec
  'ref.json/$ref prevents a sibling id from changing the base uri', // in pre-2019-09, any $ref siblings are not handled
  'ref.json/$ref prevents a sibling $id from changing the base uri', // in pre-2019-09, any $ref siblings are not handled

  // draft3 only
  'draft3/additionalItems.json/additionalItems does not look in applicators',
  'draft3/additionalProperties.json/additionalProperties does not look in applicators',

  // draft2019-09 only
  // tests $recursiveRef without $recursiveAnchor, we treat this as a mistake
  'draft2019-09/recursiveRef.json/$recursiveRef without $recursiveAnchor works like $ref',
  'draft2019-09/recursiveRef.json/$recursiveRef with $recursiveAnchor: false works like $ref',
  'draft2019-09/recursiveRef.json/$recursiveRef with no $recursiveAnchor works like $ref',
  'draft2019-09/recursiveRef.json/$recursiveRef with no $recursiveAnchor in the initial target schema resource',

  // same for $dynamicRef without $dynamicAnchor in the same scope
  'dynamicRef.json/A $dynamicRef to an $anchor in the same schema resource behaves like a normal $ref to an $anchor',
  'dynamicRef.json/A $dynamicRef without a matching $dynamicAnchor in the same schema resource behaves like a normal $ref to $anchor',
  'dynamicRef.json/A $dynamicRef with a non-matching $dynamicAnchor in the same schema resource behaves like a normal $ref to $anchor',
  'dynamicRef.json/A $dynamicRef that initially resolves to a schema without a matching $dynamicAnchor behaves like a normal $ref to $anchor',

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
  'optional/format/unknown.json',

  // We don't support custom meta-schemas (yet?)
  'vocabulary.json', // Disables some checks in a custom vocabulary set
  'optional/format-assertion.json', // Unexpected schema id, otherwise this would have passed

  // we have leading time-offset (e.g. Z) optional in time format for compat reasons for now
  'optional/format/time.json/validation of time strings/no time offset',

  // we don't support quoted-string emails (deliberately) and ip-address emails
  'optional/format/email.json/validation of e-mail addresses/a quoted string with a space in the local part is valid',
  'optional/format/email.json/validation of e-mail addresses/a quoted string with a double dot in the local part is valid',
  'optional/format/email.json/validation of e-mail addresses/a quoted string with a @ in the local part is valid',
  'optional/format/email.json/validation of e-mail addresses/an IPv4-address-literal after the @ is valid',
  'optional/format/email.json/validation of e-mail addresses/an IPv6-address-literal after the @ is valid',

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
  'rules/format.json/validation of uuid strings', // URI form not valid per new spec for { format: 'uuid' }
  'issues/33_json_schema_latest.json/use latest json schema as v4 (#33)',

  // draft-next changes to bookending requirement in dynamicRef
  'draft-next/dynamicRef.json',
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

function processTestDir(schemaDir, main, opts = {}, schemas = testSchemas, subdir = '') {
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
      const baseOpts = { ...opts, formats: manualFormats(file) }
      const config = { shouldIngore, requiresLax, filter }
      processTest(main, sub, JSON.parse(content), baseOpts, schemas, config)
    } else {
      // assume it's a dir and let it fail otherwise
      processTestDir(schemaDir, main, opts, schemas, sub)
    }
  }
}

/** JSON Schema Test Suite tests **/
const testsDir = 'JSON-Schema-Test-Suite/tests'
processTestDir(testsDir, 'draft4')
processTestDir(testsDir, 'draft6')
processTestDir(testsDir, 'draft7')
processTestDir(testsDir, 'draft3', { extraFormats: true })
processTestDir(testsDir, 'draft2019-09')
processTestDir(testsDir, 'draft2020-12')
processTestDir(testsDir, 'draft-next')

/** extra tests not (yet) merged upstream **/
processTestDir('', 'extra-tests', { contentValidation: true })

/** ajv tests **/
const ajvSchemas = testSchemas.filter((schema) => !(schema.$id || '').endsWith('/tree.json')) // name collision
ajvSchemas.push(
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
processTestDir('ajv-spec/tests', 'issues', {}, ajvSchemas)
processTestDir('ajv-spec/tests', 'rules', {}, ajvSchemas)
processTestDir('ajv-spec/tests', 'schemas', {}, ajvSchemas)
processTestDir('ajv-spec', 'extras.part', {}, ajvSchemas)
