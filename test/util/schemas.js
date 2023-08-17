'use strict'

const fs = require('fs')
const path = require('path')
const assert = require('assert')

function loadSchema(dir, namespace, name, suffix = '') {
  const $id = `${namespace}/${name}${suffix}`
  const file = `${path.join(__dirname, '..', dir, name)}.json`
  const schema = JSON.parse(fs.readFileSync(file, 'utf-8'))

  assert(!schema.id)

  if (schema.$id) {
    assert.strictEqual(schema.$id, $id)
    return schema
  }

  return { ...schema, $id }
}

// standard schemas
const schemas = [
  require('./../schemas/json-schema-draft-2020-12/meta/core.json'),
  require('./../schemas/json-schema-draft-2020-12/meta/applicator.json'),
  require('./../schemas/json-schema-draft-2020-12/meta/unevaluated.json'),
  require('./../schemas/json-schema-draft-2020-12/meta/validation.json'),
  require('./../schemas/json-schema-draft-2020-12/meta/meta-data.json'),
  require('./../schemas/json-schema-draft-2020-12/meta/format-annotation.json'),
  require('./../schemas/json-schema-draft-2020-12/meta/content.json'),
  require('./../schemas/json-schema-draft-2020-12/schema.json'),
  require('./../schemas/json-schema-draft-2019-09/meta/core.json'),
  require('./../schemas/json-schema-draft-2019-09/meta/applicator.json'),
  require('./../schemas/json-schema-draft-2019-09/meta/validation.json'),
  require('./../schemas/json-schema-draft-2019-09/meta/meta-data.json'),
  require('./../schemas/json-schema-draft-2019-09/meta/format.json'),
  require('./../schemas/json-schema-draft-2019-09/meta/content.json'),
  require('./../schemas/json-schema-draft-2019-09/schema.json'),
  require('./../schemas/json-schema-draft-07.json'),
  require('./../schemas/json-schema-draft-06.json'),
  require('./../schemas/json-schema-draft-04.json'),
  require('./../schemas/json-schema-draft-03.json'),
]

// next, use latest available for refs to draft/next for now (until next schema becomes available)
const next = [
  {
    ...require('./../schemas/json-schema-draft-2020-12/meta/core.json'),
    $id: 'https://json-schema.org/draft/next/meta/core',
  },
  {
    ...require('./../schemas/json-schema-draft-2020-12/meta/applicator.json'),
    $id: 'https://json-schema.org/draft/next/meta/applicator',
  },
  {
    ...require('./../schemas/json-schema-draft-2020-12/meta/unevaluated.json'),
    $id: 'https://json-schema.org/draft/next/meta/unevaluated',
  },
  {
    ...require('./../schemas/json-schema-draft-2020-12/meta/validation.json'),
    $id: 'https://json-schema.org/draft/next/meta/validation',
  },
  {
    ...require('./../schemas/json-schema-draft-2020-12/meta/meta-data.json'),
    $id: 'https://json-schema.org/draft/next/meta/meta-data',
  },
  {
    ...require('./../schemas/json-schema-draft-2020-12/meta/format-annotation.json'),
    $id: 'https://json-schema.org/draft/next/meta/format-annotation',
  },
  {
    ...require('./../schemas/json-schema-draft-2020-12/meta/content.json'),
    $id: 'https://json-schema.org/draft/next/meta/content',
  },
  {
    ...require('./../schemas/json-schema-draft-2020-12/schema.json'),
    $id: 'https://json-schema.org/draft/next/schema',
  },
]

const remotes = [
  'baseUriChange/folderInteger',
  'baseUriChangeFolder/folderInteger',
  'baseUriChangeFolderInSubschema/folderInteger',
  'draft-next/baseUriChange/folderInteger',
  'draft-next/baseUriChangeFolder/folderInteger',
  'draft-next/baseUriChangeFolderInSubschema/folderInteger',
  'draft-next/detached-dynamicref',
  'draft-next/detached-ref',
  'draft-next/extendible-dynamic-ref',
  'draft-next/integer',
  'draft-next/locationIndependentIdentifier',
  'draft-next/name-defs',
  'draft-next/nested/foo-ref-string',
  'draft-next/nested/string',
  'draft-next/ref-and-defs',
  'draft-next/subSchemas-defs',
  'draft-next/tree',
  'draft2019-09/baseUriChange/folderInteger',
  'draft2019-09/baseUriChangeFolder/folderInteger',
  'draft2019-09/baseUriChangeFolderInSubschema/folderInteger',
  'draft2019-09/dependentRequired',
  'draft2019-09/detached-ref',
  'draft2019-09/ignore-prefixItems',
  'draft2019-09/integer',
  'draft2019-09/locationIndependentIdentifier',
  'draft2019-09/metaschema-no-validation',
  'draft2019-09/name-defs',
  'draft2019-09/nested/foo-ref-string',
  'draft2019-09/nested/string',
  'draft2019-09/ref-and-defs',
  'draft2019-09/subSchemas-defs',
  'draft2020-12/baseUriChange/folderInteger',
  'draft2020-12/baseUriChangeFolder/folderInteger',
  'draft2020-12/baseUriChangeFolderInSubschema/folderInteger',
  'draft2020-12/detached-dynamicref',
  'draft2020-12/detached-ref',
  'draft2020-12/extendible-dynamic-ref',
  'draft2020-12/format-assertion-false',
  'draft2020-12/format-assertion-true',
  'draft2020-12/integer',
  'draft2020-12/locationIndependentIdentifier',
  'draft2020-12/metaschema-no-validation',
  'draft2020-12/name-defs',
  'draft2020-12/nested/foo-ref-string',
  'draft2020-12/nested/string',
  'draft2020-12/prefixItems',
  'draft2020-12/ref-and-defs',
  'draft2020-12/subSchemas-defs',
  'draft2020-12/tree',
  'draft6/detached-ref',
  'draft7/detached-ref',
  'extendible-dynamic-ref',
  'integer',
  'locationIndependentIdentifier',
  'locationIndependentIdentifierDraft4',
  'locationIndependentIdentifierPre2019',
  'name',
  'name-defs',
  'nested-absolute-ref-to-string',
  'nested/foo-ref-string',
  'nested/string',
  'ref-and-definitions',
  'ref-and-defs',
  'subSchemas',
  'subSchemas-defs',
  'tree',
].map((name) =>
  loadSchema('JSON-Schema-Test-Suite/remotes', 'http://localhost:1234', name, '.json')
)

const extra = [
  {
    // has to be loaded this way as we don't load over network
    ...require('./../JSON-Schema-Test-Suite/remotes/urn-ref-string.json'),
    $id: 'http://localhost:1234/urn-ref-string.json',
  },
  {
    // fails assert in loadSchema() above, likely a bug in tests
    ...require('./../JSON-Schema-Test-Suite/remotes/draft7/ignore-dependentRequired.json'),
    $id: 'http://localhost:1234/draft7/ignore-dependentRequired.json',
  },
  {
    // fails assert in loadSchema() above, intentionally
    ...require('./../JSON-Schema-Test-Suite/remotes/different-id-ref-string.json'),
    $id: 'http://localhost:1234/different-id-ref-string.json',
  },
  {
    // for AJV test issues/62_resolution_scope_change.json
    ...require('./../JSON-Schema-Test-Suite/remotes/baseUriChange/folderInteger.json'),
    $id: 'http://localhost:1234/folder/folderInteger.json',
  },
]

module.exports = [...schemas, ...next, ...remotes, ...extra]
