# Strong mode

Strong mode is enabled with `mode: "strong"` option.

It is the recommended mode of operation.

It's enabled by default for `parser`, but not enabled by default for `validator` for compatibility.

## Effect

Strong mode enforces the following [options](./Options.md):

  * `requireSchema`
  * `requireValidation`
  * `requireStringValidation`
  * `complexityChecks`

Strong mode enables the following options by default (overridable):

  * `forbidNoopValues`

Strong mode disables and forbids the following options:

  * `weakFormats`

Strong mode forbids the following options:

  * `allowUnusedKeywords`
  * `allowUnreachable`
  * `$schemaDefault`

See [options documentation](./Options.md) for more information on those.
