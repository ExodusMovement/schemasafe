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
    assert(schema.$id === $id)
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
  'draft2019-09/metaschema-no-validation',
  'draft2020-12/format-assertion-false',
  'draft2020-12/format-assertion-true',
  'draft2020-12/metaschema-no-validation',
  'extendible-dynamic-ref',
  'integer',
  'locationIndependentIdentifier',
  'locationIndependentIdentifierDraft4',
  'locationIndependentIdentifierPre2019',
  'name',
  'name-defs',
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
    // for AJV test issues/62_resolution_scope_change.json
    $id: 'http://localhost:1234/folder/folderInteger.json',
    ...require('./../JSON-Schema-Test-Suite/remotes/baseUriChange/folderInteger.json'),
  },
]

module.exports = [...schemas, ...next, ...remotes, ...extra]
