# Defaults assigning

If `useDefaults` option is set to `true` (default is `false`), then `default` values from the schema
will be used in case of missing / undefined object properties or array items.

Empty strings and `null` values are not considered `undefined` and are not replaced.

The assigned object is a _separate deep clone_ of the `default` value from the schema for each
validation, so each validated object receives an unique deep clone and they never reference the same
object (or the original object).

## Side effects warning

Unless used with [a parser](./Parser-not-validator.md), that *modifies* the supplied object upon
validation.

Using in parser mode is recommended.

## Example

```
'use strict'

const { parser } = require('@exodus/schemasafe')
const schema = {
  $schema: 'https://json-schema.org/draft/2019-09/schema',
  type: 'object',
  required: [],
  properties: { bar: { type: 'number', default: 0 } },
  additionalProperties: false,
}

const parse = parser(schema, { useDefaults: true })

console.log(parse('{"bar": 9}')) // { valid: true, value: { bar: 3 } }
console.log(parse('{}')) // { valid: true, value: { bar: 0 } }
```
