'use strict'

const knownKeywords = [
  ...['$schema', '$vocabulary'], // version
  ...['id', '$id', '$anchor', '$ref', 'definitions', '$defs', '$recursiveRef', '$recursiveAnchor'], // pointers
  ...['type', 'required', 'default'], // generic
  ...['enum', 'const'], // constant values
  ...['not', 'allOf', 'anyOf', 'oneOf', 'if', 'then', 'else'], // logical checks
  ...['maximum', 'minimum', 'exclusiveMaximum', 'exclusiveMinimum', 'multipleOf', 'divisibleBy'], // numbers
  ...['items', 'maxItems', 'minItems', 'additionalItems'], // arrays, basic
  ...['contains', 'minContains', 'maxContains', 'uniqueItems'], // arrays, complex
  ...['maxLength', 'minLength', 'format', 'pattern'], // strings
  ...['contentEncoding', 'contentMediaType', 'contentSchema'], // strings content
  ...['properties', 'maxProperties', 'minProperties', 'additionalProperties', 'patternProperties'], // objects
  ...['propertyNames', 'dependencies', 'dependentRequired', 'dependentSchemas'], // objects
  ...['unevaluatedProperties', 'unevaluatedItems'], // see-through
  // Unused meta keywords not affecting validation (annotations and comments)
  // https://json-schema.org/understanding-json-schema/reference/generic.html
  // https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.9
  ...['title', 'description', 'deprecated', 'readOnly', 'writeOnly', 'examples', '$comment'], // unused meta
  'discriminator', // optimization hint and error filtering only, does not affect validation result
]

// Order is important, newer first!
const schemaDrafts = ['draft/2019-09', 'draft-07', 'draft-06', 'draft-04', 'draft-03']
const schemaVersions = schemaDrafts.map((draft) => `https://json-schema.org/${draft}/schema`)

const vocab2019 = ['core', 'applicator', 'validation', 'meta-data', 'format', 'content']
const knownVocabularies = vocab2019.map((v) => `https://json-schema.org/draft/2019-09/vocab/${v}`)

module.exports = { knownKeywords, schemaVersions, knownVocabularies }
