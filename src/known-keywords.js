module.exports = [
  '$schema',
  'items',
  'id', // up to draft4
  '$id', // since draft6
  'type',
  'not',
  'properties',
  'additionalItems',
  'additionalProperties',
  'format',
  'required',
  'allOf',
  'anyOf',
  'oneOf',
  'maximum',
  'minimum',
  'exclusiveMaximum',
  'exclusiveMinimum',
  'maxItems',
  'minItems',
  'maxLength',
  'minLength',
  'maxProperties',
  'minProperties',
  'multipleOf',
  'divisibleBy',
  'if',
  'then',
  'else',
  'pattern',
  'patternProperties',
  'propertyNames',
  'dependencies',
  'dependentRequired',
  'enum',
  'const',
  'contains',
  'minContains',
  'maxContains',
  'uniqueItems',
  '$ref',
  'default',
  'definitions', // up to draft7
  '$defs', // since draft2019-09

  // Unused meta keywords not affecting validation (annotations and comments)
  // https://json-schema.org/understanding-json-schema/reference/generic.html
  'description',
  'title',
  'examples',
  '$comment',
]
