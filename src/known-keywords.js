'use strict'

module.exports = [
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
