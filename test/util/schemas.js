'use strict'

module.exports = [
  // standard
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
    $id: 'http://localhost:1234/folder/folderInteger.json',
    ...require('./../JSON-Schema-Test-Suite/remotes/folder/folderInteger.json'),
  },
  {
    $id: 'http://localhost:1234/name.json',
    ...require('./../JSON-Schema-Test-Suite/remotes/name.json'),
  },
  {
    $id: 'http://localhost:1234/name-defs.json',
    ...require('./../JSON-Schema-Test-Suite/remotes/name-defs.json'),
  },
]
