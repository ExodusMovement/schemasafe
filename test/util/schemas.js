'use strict'

module.exports = [
  // standard
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
  // next, use latest available for refs to draft/next for now (until next schema becomes available)
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
  // remote
  {
    $id: 'http://localhost:1234/integer.json',
    ...require('./../JSON-Schema-Test-Suite/remotes/integer.json'),
  },
  {
    $id: 'http://localhost:1234/subSchemas.json',
    ...require('./../JSON-Schema-Test-Suite/remotes/subSchemas.json'),
  },
  {
    $id: 'http://localhost:1234/subSchemas-defs.json',
    ...require('./../JSON-Schema-Test-Suite/remotes/subSchemas-defs.json'),
  },
  {
    $id: 'http://localhost:1234/name.json',
    ...require('./../JSON-Schema-Test-Suite/remotes/name.json'),
  },
  {
    $id: 'http://localhost:1234/name-defs.json',
    ...require('./../JSON-Schema-Test-Suite/remotes/name-defs.json'),
  },
  require('./../JSON-Schema-Test-Suite/remotes/tree.json'),
  require('./../JSON-Schema-Test-Suite/remotes/ref-and-defs.json'),
  require('./../JSON-Schema-Test-Suite/remotes/ref-and-definitions.json'),
  require('./../JSON-Schema-Test-Suite/remotes/extendible-dynamic-ref.json'),
  require('./../JSON-Schema-Test-Suite/remotes/draft2019-09/metaschema-no-validation.json'),
  require('./../JSON-Schema-Test-Suite/remotes/draft2020-12/metaschema-no-validation.json'),
  require('./../JSON-Schema-Test-Suite/remotes/draft2020-12/format-assertion-false.json'),
  require('./../JSON-Schema-Test-Suite/remotes/draft2020-12/format-assertion-true.json'),
  {
    // for AJV test issues/62_resolution_scope_change.json
    $id: 'http://localhost:1234/folder/folderInteger.json',
    ...require('./../JSON-Schema-Test-Suite/remotes/baseUriChange/folderInteger.json'),
  },
  {
    $id: 'http://localhost:1234/baseUriChange/folderInteger.json',
    ...require('./../JSON-Schema-Test-Suite/remotes/baseUriChange/folderInteger.json'),
  },
  {
    $id: 'http://localhost:1234/baseUriChangeFolder/folderInteger.json',
    ...require('./../JSON-Schema-Test-Suite/remotes/baseUriChangeFolder/folderInteger.json'),
  },
  {
    $id: 'http://localhost:1234/baseUriChangeFolderInSubschema/folderInteger.json',
    ...require('./../JSON-Schema-Test-Suite/remotes/baseUriChangeFolderInSubschema/folderInteger.json'),
  },
  {
    $id: 'http://localhost:1234/locationIndependentIdentifier.json',
    ...require('./../JSON-Schema-Test-Suite/remotes/locationIndependentIdentifier.json'),
  },
  {
    $id: 'http://localhost:1234/locationIndependentIdentifierPre2019.json',
    ...require('./../JSON-Schema-Test-Suite/remotes/locationIndependentIdentifierPre2019.json'),
  },
  {
    $id: 'http://localhost:1234/locationIndependentIdentifierDraft4.json',
    ...require('./../JSON-Schema-Test-Suite/remotes/locationIndependentIdentifierDraft4.json'),
  },
]
