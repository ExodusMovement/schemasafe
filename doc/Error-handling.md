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

  * `verboseErrors` — include more information in each error object. Requires `includeErrors`.

All of those are opt-ins (i.e. `false` by default).
