# Options

## Regular options

  * `mode` — `'default'` by default in `validator()`, `'strong'` by default in `parser()`.\
    See also [strong mode documentation](./Strong-mode.md).

  * `useDefaults` — `false` by default. Apply `default:` values from the schema to missing
    properties.

  * `removeAdditional` — `false` by default.\
    Removes additional properties instead of failing the validation on them.\
    Supports `additionalProperties: false` and `additionalItems: false`.\
    Note that it fails to compile the schema in case of uncertain paths with this option.

  * `includeErrors` — `false` by default.\
    Enable returning errors (without it, just a validaton flag is returned).

  * `allErrors` — `false` by default.\
    Return all errors, not just the first one.

  * `contentValidation` — `false` by default for `draft/2019-09` and newer,\
    `true` by default for `draft7` and older.\
    Enables `contentEncoding`, `contentMediaType`, `contentSchema` usage for validation and makes\
    failing those checks affect the boolean result of the validation.\
    By default they are no-op per spec since `draft/2019-09`, and hence are treated as an unused\
    keyword and raise an error at compile time unless `allowUnusedKeywords` option is enabled.

  * `dryRun` — `false` by default.\
    Don't produce a validator, just verify the schema and throw on first error.

  * `lint` — `false` by default.\
    Don't produce a validator, just verify the schema and collect all errors.
    Same as [Linter mode](./Linter.md).

  * `$schemaDefault` — `null` by default.\
    Can not be used if `requireSchema` is on.

  * `formatAssertion` — `true` by default (`false` by default when `mode = 'spec'` **and** `$schema`
    is `draft2019-09` or later).

    Switching it to `false` will disable `format` assertions, essentially making them not affect
    the result of validation at all, i.e. validation would pass regardless of all `format` strings
    in the schema.

    **That (`false`) behaviour is specified as default in the upstream since `draft2019-09`,
    but not followed here,** unless `mode` is set to `'spec'`, due to being potentially
    dangereous/unsafe and missing expected validation.

    For more info, see
    [upstream documentation](https://json-schema.org/draft/2020-12/json-schema-validation.html#section-7.2)
    and
    [upstream changelog](https://json-schema.org/draft/2019-09/release-notes.html#incompatible-changes).

  * `formats` — `{}` by default.\
    Additional formats to use.

  * `weakFormats` — `true` in `'default'` and `'lax'`/`'spec'` modes, `false` in
    [`'strong'` mode](./Strong-mode.md) by default.\
    Add support for formats deemed potentially weak (currently, only `RegExp`).

  * `extraFormats` — `false` by default.\
    Enable extra built-in non-standard formats, see [formats.js](../src/formats.js).

  * `schemas` — empty by default.\
    Either a `Map`, an `Array`, or an `Object` with schemas to resolve external `$ref` pointers.

## Options for enforcing additional checks

  All these options are `false` by default in `'default'` and `'lax`/`'spec'` modes and `true` by
  default in [`'strong'` mode](./Strong-mode.md).

  * `requireSchema` — refuse to use schemas with missing `$schema`.

  * `requireValidation` — refuse to use schemas which do not perform validation of all items or
    properties.

  * `requireStringValidation` — refuse to use schemas which do not perform validation of all
    string properties against a `format`, `pattern`, or a `contentSchema`.

  * `complexityChecks` — refuse to use schemas that might be missing required checks to avoid
    potential DoS, e.g. require `maxLength` on complex regexps and `maxItems` on complex
    `uniqueItems`. Note that it will pass if those are present but have a very high value, the only
    intent is to prevent a mistake when those checks are missed. If they are present, it is assumed
    that the shema author chose an appropriate value corresponding to the regex complexity.

  * `forbidNoopValues` — refuse to compile schemas with certain noop keywords that make no sense.\
    Currently, that is only `$recursiveAnchor: false`.\
    This option is overridable even in `'strong'` mode.

## Options for relaxing coherence checks

  * `allowUnusedKeywords` — `opts.mode === 'lax' || opts.mode === 'spec'` by default.\
    Allows unused keywords to be present in the schema.

  * `allowUnreachable` — `opts.mode === 'lax' || opts.mode === 'spec'` by default.\
    Allows unreachable checks to be present in the schema.

## Options to pass assumptions about input

If certain assumptions about input are always true, that information can be used to optimize the
generated validator.

  * `unmodifiedPrototypes` — `false` by default.
    Assume no mangled `Object` / `Array` prototypes in runtime.

  * `isJSON` — `false` by default.
    Assume input to be JSON, which e.g. makes `undefined` impossible.
