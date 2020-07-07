# Error handling

There are two possible types of errors:
 * Schema compilation (i.e. build-time) errors,
 * Validation (i.e. run-time) errors.

Schema compilation errors always throw synchronously to ensure that no invalid schemas get compiled
and/or produce invalid validation code.

## Validation errors

At the moment of writing, correct error reporting is still in progress. \
Most significant known issue is that error pointers stop at `$ref` usage.

This does not affect the _result_ of the validation, just the information inside of the produced
error objects.

It's significantly better than in `is-my-json-valid` though.\
Further improvements should bring this on par with `ajv`.

### Validation errors are opt-in

Error reporting is disabled by default and is provided as an opt-in, because users who need to
consume errors would enable that, and users who don't would get more concise generated code and
higher performance this way.

### Options

The options relevant to error reporting are:

  * `includeErrors` — return an array of encountered errors as `errors` property of the validator
    function.\
    E.g.: `validate({}); console.log(validate.errors)`.\
    Note that without `allErrors` option, only the first encountered error is returned.

  * `allErrors` — list all encountered errors, not just the first one. Requires `includeErrors`.

    To ensure that this is not a [DoS vector](./Complexity-checks.md), `pattern`, `format` and
    `uniqueItems` checks will be still skipped if the same exact data property already failed
    other restrictions (and already caused an error which will be included), and `propertyPatterns`
    will be skipped if the parent data object (containing the property) failed other restrictions.\
    That does not affect the result of validation, just the list of reported errors in those cases.

  * `reflectErrorsValue` — include `value` property in errors with the data that failed validation.
    Requires `includeErrors`.

    Warning: `reflectErrorsValue` reflects the original _unvalidated_ value as the `value` property
    of each error, which is a _reference_ to the part of the orignal unvalidated object which failed
    validation.

    If the input was untrusted, then `value` property also should be treated as untrusted, e.g.
    when manipulating it and/or reflecting it back to the user.

All of those are opt-ins (i.e. `false` by default).

### Properties

  - `schemaPath`: a JSON pointer string as an URI fragment indicating which sub-schema failed, e.g.
  `#/properties/item/type`

  - `dataPath`: a JSON pointer string as an URI fragment indicating which property of the object
  failed validation, e.g. `#/item`

  - `value`: the _unvalidated_ data value that caused the error. Enabled only when
  `reflectErrorsValue` is set to true. Use with care.

  - `message`: can be present for certain generic validation errors, e.g. failed `jsonCheck`.
  Absent for most errors, as the exact keyword which failed validation can be deduced from
  `schemaPath`, and an additional error message would have just duplicated that information.
