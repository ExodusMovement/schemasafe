# `@exodus/schemasafe`

A [JSONSchema](https://json-schema.org/) validator that uses code generation to be extremely fast.

[![Node CI Status](https://github.com/ExodusMovement/schemasafe/workflows/Node%20CI/badge.svg)](https://github.com/ExodusMovement/schemasafe/actions)

## Installation

```sh
npm install --save @exodus/schemasafe
```

## Usage

Simply pass a schema to compile it

```js
const { validator } = require('@exodus/schemasafe')

const validate = validator({
  type: 'object',
  required: ['hello'],
  properties: {
    hello: {
      type: 'string'
    }
  }
})

console.log('should be valid', validate({ hello: 'world' }))
console.log('should not be valid', validate({}))
```

## Custom formats

`@exodus/schemasafe` supports the formats specified in JSON schema v4 (such as date-time).
If you want to add your own custom formats pass them as the formats options to the validator

```js
const validate = validator({
  type: 'string',
  format: 'only-a'
}, {
  formats: {
    'only-a': /^a+$/
  }
})

console.log(validate('aa')) // true
console.log(validate('ab')) // false
```

## External schemas

You can pass in external schemas that you reference using the `$ref` attribute as the `schemas` option

```js
const ext = {
  type: 'string'
}

const schema = {
  $ref: 'ext#' // references another schema called ext
}

// pass the external schemas as an option
const validate = validator(schema, { schemas: { ext: ext }})

console.log(validate('hello')) // true
console.log(validate(42)) // false
```

## Verbose mode shows more information about the source of the error

When the `includeErrors` and `verboseErrors` options are set to `true`, `@exodus/schemasafe` also
outputs:

- `schemaPath`: a JSON pointer string as an URI fragment indicating which sub-schema failed, e.g.
  `#/properties/item/type`
- `dataPath`: a JSON pointer string as an URI fragment indicating which property of the object
  failed validation, e.g. `#/item`
- `value`: The data value that caused the error

```js
const schema = {
  type: 'object',
  required: ['hello'],
  properties: {
    hello: {
      type: 'string'
    }
  }
}
const validate = validator(schema, {
  includeErrors: true,
  verboseErrors: true
})

validate({ hello: 100 });
console.log(validate.errors)
// [ { schemaPath: '#/properties/hello/type',
//     dataPath: '#/hello',
//     value: 100 } ]
```

## Generate Modules

To compile a validator function to an IIFE, call `validate.toModule()`:

```js
const { validator } = require('@exodus/schemasafe')

const schema = {
  type: 'string',
  format: 'hex'
}

// This works with custom formats as well.
const formats = {
  hex: (value) => /^0x[0-9A-Fa-f]*$/.test(value),
}

const validate = validator(schema, { formats })

console.log(validate.toModule())
/** Prints:
 * (function() {
 * 'use strict'
 * const format0 = (value) => /^0x[0-9A-Fa-f]*$/.test(value);
 * return (function validate(data) {
 *   if (data === undefined) data = null
 *   let errors = 0
 *   if (!(typeof data === "string")) return false
 *   if (!format0(data)) return false
 *   return errors === 0
 * })})();
 */
```

## Performance

`@exodus/schemasafe` uses code generation to turn a JSON schema into javascript code that is easily optimizeable by v8.

## Previous work

This is based on a heavily rewritten version of the amazing (but outdated)
[is-my-json-valid](https://github.com/mafintosh/is-my-json-valid) by
[@mafintosh](https://github.com/mafintosh/is-my-json-valid).

Compared to `is-my-json-valid`, `@exodus/schemasafe` adds security-first design, many new features,
newer spec versions support, slimmer and more maintainable code, 0 dependencies, self-contained JS
module generation, fixes bugs and adds better test coverage, and drops support for outdated Node.js
versions.

## License

MIT
