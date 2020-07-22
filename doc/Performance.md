# Performance

`@exodus/schemasafe` uses code generation to
[be fast](https://github.com/ebdrup/json-schema-benchmark#performance).

It compiles the provided schemas into [auditable](./Auditable.md) validation and parser
[modules](./Module-generation.md), which can be optimized by V8 in run-time.

By default, [errors are disabled](./Error-handling.md) to further increase performance.

See also [Complexity checks](./Complexity-checks.md) for documentation on how to catch potential
DoS issues in the schema (i.e. `complexityChecks` option, enabled automatically in `strong` mode).

## Options that reduce performance

Several options that have a nagative effect on performance:

* `includeErrors`, `allErrors` (all off by default) -- see
  [Error handling](./Error-handling.md#options).

* `jsonCheck` (off by default) — using [parser mode](./Parser-not-validator.md) instead is advised.

## Options that increase performance

* `isJSON` (off by default) — assumes that input was received from e.g. `JSON.parse` and does not
  include values that can not be expressed in JSON, e.g. `undefined`.

  Using [parser mode](./Parser-not-validator.md) instead is advised, which automatically enables it.

* `unmodifiedPrototypes` — assumes that `Object` and `Array` prototypes are not modified (i.e. don't
  include any other properties) _at the time of validation_.
  
  Combining this with `isJSON` mode allows to significantly speed up property existance checks and
  to use `hasOwnProperty` only on those property names that are present in standard `Object` or
  `Array` prototypes.
  
  **This option can be dangereous if `Object` or `Array` prototypes were modified**, especially in
  combination with `useDefaults`.
  
  E.g.:
  ```js
  const { validator } = require('.')

  Object.prototype.foo = {} // unmodifiedPrototypes assumes this is not done

  const schema = { properties: { foo: { properties: { boo: { default: 'polluted' } } } } }

  validator(schema, { useDefaults: true })({})
  console.log(Object.prototype.foo) // {}

  validator(schema, { useDefaults: true, isJSON: true })({})
  console.log(Object.prototype.foo) // {}

  validator(schema, { useDefaults: true, isJSON: true, unmodifiedPrototypes: true })({})
  console.log(Object.prototype.foo) // { boo: 'polluted' }
  ```
  
  It should be safe otherwise.
