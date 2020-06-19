# Secure code generation

During code generation, the supplied schema is treated as untrusted input (but in JSON form).

While DoS safety of an untrusted schema can't be guaranteed even with
[complexity checks](./Complexity-checks.md), both the process of code generation and the generated
validator/parser code are supposed to be safe against arbitrary code execution, even when both
schema and the data being validated were received as untrusted JSON input.

It should be noted that _supplying untrusted schemas is not recommented_.

Even though they should not cause arbitrary code execution, they can cause DoS.
Also, security issues can happen on any point of the path, and the best way to avoid the problem is
to not use untrusted input in the process of code generation, if possible.

## Code generation approach

To protect code generation against code injection from schemas, the following approach is taken:

 1. All code generated from the schema is going through the `format(template, ...args)` function,
    which embeds supplied arguments into a template string.
    
    It typechecks the supplied arguments, and everything that is not code must be wrapped in JSON.

 2. First argument of the `format()` function (the template), is trusted and must always be a
    literal string or come from a wrapper where it is a literal string.
    That way, it can't come from a runtime variable and can't be affected by untrusted input
    directly.
    
    Custom ESLint rules additionally check that in the code so that it won't be accidentally broken.

 3. Trusted code could be produced only via a limited number of ways:
 
    1. Output emitted by `format()` is treated as code.
    
    2. Safe generated variable ids are also treated as code.
    
    3. Logical and (`&&`) and or (`||`) operations on a variable-length list of code arguments is also
    treated as code. That is used in complex block conditions.
    
    4. Certain explicitly listed constant values can be inserted in `format()` template, but only
    at designated places.
 
    Everything else is rejected by `format()` when trying to be concatenated into the template
    without proper escaping.

 4. No string transformations are performed on the generated code, as any non-context aware
    transformations of generated code are unsafe.\
    See [below](#non-context-aware-code-transformations-are-unsafe) for more information.

    As AST transformation would be too complex here, all optimizations eliminating empty blocks, for
    example, have to come _before_ the code is prepared.
    
    The approach used here wraps block body generators so that when generating the body of the block
    did not emit any code, the whole block is excluded.


Source code for that could be seen in [safe-format.js](../src/safe-format.js).

Separate logic is used for function stringification (e.g. formats), but those do not come from the
schema and are assumed to be trusted input (and are typechecked to be functions).

## Things to note

### `format()` does not make things _magically_ safe

Templates for `format()` should be treated with care.

E.g. `format('%j', arg)` (where `%j` is JSON-escaped variable) is an arbitrary code execution
vulnerability if `arg` is untrusted, as the contents of `arg` can close the single quotes and
escape from the string.

Variables should be inserted only in those contexts where inserting _any_ JSON-encoded value is safe
against code execution.

### `JSON.stringify` is not always safe for inclusion in code

Symbols `\u2028` and `\u2029` should be escaped when embedding JSON-wrapped objects into code.

The [behavior changed](https://github.com/tc39/proposal-json-superset) only in ES2019, so it's best
to not rely on that.

See https://v8.dev/features/subsume-json#security for more details.

`format()` function handles that.

### `RegExp` stringification should use `new RegExp()`

Using `/regexp/` form, produced by converting a `RegExp` object to a string, is not safe.

Consider this _on Node.js 10 and below_: `console.log(String(new RegExp("\n")))`.\
That behaviour differs between platforms and versions.

If pattern is arbitrary input from the schema and RegExp object is stringified via converting it
to a string (e.g. <code>`${regexp}`</code>, `regexp + ''`, `regexp.toString()` or `String(regexp)`,
it can break the generated code in certain cases.

Instead, convert those to code in a form of `new RegExp(pattern, flags)` (where pattern and flags
should be property escaped, as other string variables).

Stringification of `RegExp` objects is supported in the `format()` function.

### Non-context aware code transformations are unsafe

That includes any type of replacements performed on the code after its generation.

Even a seemingly harmless replacement of `else {}` to an empty string can be abused in some
situations because that string could be met in a non-code context, e.g. inside an object property
name.

That _also_ includes altering newlines in the code.

The only safe way to transform generated code is by parsing it to AST, transforming the AST and
re-generating the code from AST.

Trusted code _concatenation_ is fine without being context aware, though.
