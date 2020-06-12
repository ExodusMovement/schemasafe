# `@exodus/schemasafe`

A [JSONSchema](https://json-schema.org/) validator that uses code generation to be extremely fast.

It passes the entire JSONSchema v4 test suite except for `remoteRefs` and `maxLength`/`minLength` when using unicode surrogate pairs.

[![build status](https://img.shields.io/travis/mafintosh/is-my-json-valid.svg?style=flat)](https://travis-ci.org/mafintosh/is-my-json-valid)

## Installation

```sh
npm install --save @exodus/schemasafe
```

## Usage

Simply pass a schema to compile it

```js
var validator = require('@exodus/schemasafe')

var validate = validator({
  required: true,
  type: 'object',
  properties: {
    hello: {
      required: true,
      type: 'string'
    }
  }
})

console.log('should be valid', validate({hello: 'world'}))
console.log('should not be valid', validate({}))

// get the last list of errors by checking validate.errors
// the following will print [{field: 'data.hello', message: 'is required'}]
console.log(validate.errors)
```

You can also pass the schema as a string

```js
var validate = validator('{"type": ... }')
```

## Custom formats

`@exodus/schemasafe` supports the formats specified in JSON schema v4 (such as date-time).
If you want to add your own custom formats pass them as the formats options to the validator

```js
var validate = validator({
  type: 'string',
  required: true,
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
var ext = {
  required: true,
  type: 'string'
}

var schema = {
  $ref: '#ext' // references another schema called ext
}

// pass the external schemas as an option
var validate = validator(schema, {schemas: {ext: ext}})

validate('hello') // returns true
validate(42) // return false
```

## Verbose mode shows more information about the source of the error

When the `verbose` options is set to `true`, `@exodus/schemasafe` also outputs:

- `value`: The data value that caused the error
- `schemaPath`: an array of keys indicating which sub-schema failed

```js
var schema = {
  required: true,
  type: 'object',
  properties: {
    hello: {
      required: true,
      type: 'string'
    }
  }
}
var validate = validator(schema, {
  verbose: true
})

validate({hello: 100});
console.log(validate.errors)
// [ { field: 'data.hello',
//     message: 'is the wrong type',
//     value: 100,
//     type: 'string',
//     schemaPath: [ 'properties', 'hello' ] } ]
```

Many popular libraries make it easy to retrieve the failing rule with the `schemaPath`:

```js
var schemaPath = validate.errors[0].schemaPath
var R = require('ramda')

console.log( 'All evaluate to the same thing: ', R.equals(
  schema.properties.hello,
  { required: true, type: 'string' },
  R.path(schemaPath, schema),
  require('lodash').get(schema, schemaPath),
  require('jsonpointer').get(schema, [""].concat(schemaPath))
))
// All evaluate to the same thing: true
```

## Generate Modules

To compile a validator function to an IIFE, call `validate.toModule()`:

```js
const schema = {
  type: 'string',
  format: 'hex'
}

const validator = require('@exodus/schemasafe')

// This works with custom formats as well.
const formats = {
  hex: (value) => typeof value === 'string' && /^0x[0-9A-Fa-f]*$/.test(value),
}

const validate = validator(schema, { formats })

console.log(validate.toModule())
/** Prints:
 * (function() {
 * var format1 = (value) => typeof value === 'string' && /^0x[0-9A-Fa-f]*$/.test(value);
 * return (function validate(data) {
 *   if (data === undefined) data = null
 *   validate.errors = null
 *   var errors = 0
 *   if (data !== undefined) {
 *     if (!(typeof data === "string")) {
 *       errors++
 *       if (validate.errors === null) validate.errors = []
 *       validate.errors.push({field:"data",message:"is the wrong type"})
 *     } else {
 *       if (!format1(data)) {
 *         errors++
 *         if (validate.errors === null) validate.errors = []
 *         validate.errors.push({field:"data",message:"must be hex format"})
 *       }
 *     }
 *   }
 *   return errors === 0
 * })})();
 */
```

## Performance

`@exodus/schemasafe` uses code generation to turn your JSON schema into basic javascript code that is easily optimizeable by v8.

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
