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
containing JSON-encoded input, with a few differences:

 1. If validation succeeds, it returns the parsed object itself, like `JSON.parse(string)` does.

 2. If validation fails, it will throw instead of returning `false`.
 
 3. Validation errors (if enabled) are available as `errors` property of the thrown `err` object: `err.errors`.
 
 4. Parser operates in [strong mode](./Strong-mode.md) by default. To override it, use
    `mode: 'default'` option.

Parsers can be likewise exported to js code by using `parser.toModule()`.
