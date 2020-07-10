# Parser, not validator

While this package provides API for generating both parsers and validators, parser should be
preferred if that fits your use case.

## Why?

Using the parser API ensures that the object is never present in your code in parsed but not
validated form, significantly reducing the number of mistakes that can come from using unvalidated
raw objects.

Apart from that, it allows some checks in the validation to be fast-tracked for clarity and
performance if the input is known to be from `JSON.parse` and can not contain, e.g. `undefined`
variables.
That fast-tracking could be also enabled via the `isJSON` option of the validator, but it should be
used only when the input is _definitely_ coming from a `JSON.parse` without a reviver.

## Differences between parser and validator

`validator(schema, options)` creates a `validate(object)` function which accepts input after it has
been parsed from JSON. It will return either `true` or `false` and errors would be reported as a
property of `validate` function: `validate.errors` (if `includeErrors` option is enabled).

`parser(schema, options)` creates a similar `parse(string)` function, which accepts a raw string
containing JSON-encoded input, and returns a parse result as an object
`{ valid, error, errors, value }`.

 1. `valid` is a boolean flag indicating if parsing and validation succeeded (`true`) or not
    (`false`).

 2. `error` is the first error message in a human-readable form. Included if `includeErrors`
    option is enabled.

 3. `errors` is a list of the original validation errors, included only if `includeErrors` option is
    enabled.
    Will be undefined if validation succeeded (even if `JSON.parse` failed).
    
    Has the same form as errors produced by the `validator(schema, options)` API.
    
    Will be limited to at most one error unless `allErrors` option is enabled (in addition to
    `includeErrors`).

    See also [Error handling](./Error-handling.md) documentation on the exact format of the `errors`
    property.

 4. `value` is the result of parsing and validation. If either parsing or validation failed,
    `value` is undefined.
    
    It is affected by the post-processing via `removeAdditional` and `useDefaults` options, if
    enabled (both disabled by default).

This naming is designed to be compatible with
[upstream spec conventions](https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.10.4.2)
for equivalent properties.

Parser operates in [strong mode](./Strong-mode.md) by default. To override it, use `mode: 'default'`
option.

Parsers can be likewise exported to js code by using `parser.toModule()`.
