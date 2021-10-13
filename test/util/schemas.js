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
  // future, use latest available for refs to draft/future for now (until future schema becomes available)
  {
    ...require('./../schemas/json-schema-draft-2020-12/meta/core.json'),
    $id: 'https://json-schema.org/draft/future/meta/core',
  },
  {
    ...require('./../schemas/json-schema-draft-2020-12/meta/applicator.json'),
    $id: 'https://json-schema.org/draft/future/meta/applicator',
  },
  {
    ...require('./../schemas/json-schema-draft-2020-12/meta/unevaluated.json'),
    $id: 'https://json-schema.org/draft/future/meta/unevaluated',
  },
  {
    ...require('./../schemas/json-schema-draft-2020-12/meta/validation.json'),
    $id: 'https://json-schema.org/draft/future/meta/validation',
  },
  {
    ...require('./../schemas/json-schema-draft-2020-12/meta/meta-data.json'),
    $id: 'https://json-schema.org/draft/future/meta/meta-data',
  },
  {
    ...require('./../schemas/json-schema-draft-2020-12/meta/format-annotation.json'),
    $id: 'https://json-schema.org/draft/future/meta/format-annotation',
  },
  {
    ...require('./../schemas/json-schema-draft-2020-12/meta/content.json'),
    $id: 'https://json-schema.org/draft/future/meta/content',
  },
  {
    ...require('./../schemas/json-schema-draft-2020-12/schema.json'),
    $id: 'https://json-schema.org/draft/future/schema',
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
  require('./../JSON-Schema-Test-Suite/remotes/ref-and-defs.json'),
  require('./../JSON-Schema-Test-Suite/remotes/ref-and-definitions.json'),
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
]
