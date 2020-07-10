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
  ...['properties', 'maxProperties', 'minProperties', 'additionalProperties', 'patternProperties'], // objects
  ...['propertyNames', 'dependencies', 'dependentRequired', 'dependentSchemas'], // objects
  ...['unevaluatedProperties', 'unevaluatedItems'], // see-through
  // Unused meta keywords not affecting validation (annotations and comments)
  // https://json-schema.org/understanding-json-schema/reference/generic.html
  ...['description', 'title', 'examples', '$comment'], // unused
]

// Order is important, newer at the top!
const schemaVersions = [
  'https://json-schema.org/draft/2019-09/schema',
  'https://json-schema.org/draft-07/schema',
  'https://json-schema.org/draft-06/schema',
  'https://json-schema.org/draft-04/schema',
  'https://json-schema.org/draft-03/schema',
]

const vocab2019 = ['core', 'applicator', 'validation', 'meta-data', 'format', 'content']
const knownVocabularies = vocab2019.map((v) => `https://json-schema.org/draft/2019-09/vocab/${v}`)

module.exports = { knownKeywords, schemaVersions, knownVocabularies }
