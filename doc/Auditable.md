# Auditable

Features:

  * Whole module size is ~1900 lines of code.

  * 0 dependencies on any other packages.

  * 0 dependencies on Node.js builtins which are not ECMAScript core or Web APIs.

It's designed that way to reduce the amount of code that can affect the behavior of this module
and/or contain vulnerabilities, and to make this module easily auditable if needed, e.g. to
confirm that it behaves in an intended way.

## Generated code

Generated code is formatted in a way that it should be also readable by any audit process,
without reformatting it.

Generating compact code is a priority as well as keeping the generator code itself clean,
so that both of those could be audited if needed.

E.g. empty code branches are removed during code generation in most cases to not pollute the output.
