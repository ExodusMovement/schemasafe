# Samples

Based on JSON Schema Test Suite for `draft2019-09`.


### Disambiguation

 * **Failed to compile** — schemas that did not compile in any mode.

 * **Warnings** — schemas that did not compile in the `default` mode, but compiled in `lax`
   mode.

   JSON Schema spec allows usage of ineffective or unknown keywords, which is considered a mistake
   by `@exodus/schemasafe` by default. `lax` mode lifts that sanity check.

 * **Misclassified** — schemas that classified at least one test value incorrectly, i.e. gave
   `true` where testsuite expected `false` or vice versa.

## Results

| Name                                                              | Total | Failed to compile | Warnings | Misclassified |
|-------------------------------------------------------------------|-------|-------------------|----------|---------------|
| [additionalItems](./additionalItems.md)                           | 7     | -                 | 3        | -             |
| [additionalProperties](./additionalProperties.md)                 | 6     | -                 | -        | -             |
| [allOf](./allOf.md)                                               | 12    | -                 | -        | -             |
| [anchor](./anchor.md)                                             | 3     | -                 | -        | -             |
| [anyOf](./anyOf.md)                                               | 8     | -                 | -        | -             |
| [boolean_schema](./boolean_schema.md)                             | 2     | -                 | -        | -             |
| [const](./const.md)                                               | 11    | -                 | -        | -             |
| [contains](./contains.md)                                         | 5     | -                 | -        | -             |
| [default](./default.md)                                           | 2     | -                 | -        | -             |
| [defs](./defs.md)                                                 | 2     | -                 | -        | -             |
| [dependentRequired](./dependentRequired.md)                       | 4     | -                 | -        | -             |
| [dependentSchemas](./dependentSchemas.md)                         | 3     | -                 | -        | -             |
| [enum](./enum.md)                                                 | 10    | -                 | -        | -             |
| [exclusiveMaximum](./exclusiveMaximum.md)                         | 1     | -                 | -        | -             |
| [exclusiveMinimum](./exclusiveMinimum.md)                         | 1     | -                 | -        | -             |
| [format](./format.md)                                             | 19    | 4                 | -        | -             |
| [id](./id.md)                                                     | 3     | -                 | -        | -             |
| [if-then-else](./if-then-else.md)                                 | 9     | -                 | 4        | -             |
| [items](./items.md)                                               | 7     | -                 | -        | -             |
| [maxContains](./maxContains.md)                                   | 3     | -                 | 1        | -             |
| [maxItems](./maxItems.md)                                         | 1     | -                 | -        | -             |
| [maxLength](./maxLength.md)                                       | 1     | -                 | -        | -             |
| [maxProperties](./maxProperties.md)                               | 2     | -                 | -        | -             |
| [maximum](./maximum.md)                                           | 2     | -                 | -        | -             |
| [minContains](./minContains.md)                                   | 6     | -                 | 2        | -             |
| [minItems](./minItems.md)                                         | 1     | -                 | -        | -             |
| [minLength](./minLength.md)                                       | 1     | -                 | -        | -             |
| [minProperties](./minProperties.md)                               | 1     | -                 | -        | -             |
| [minimum](./minimum.md)                                           | 2     | -                 | -        | -             |
| [multipleOf](./multipleOf.md)                                     | 3     | -                 | -        | -             |
| [not](./not.md)                                                   | 6     | -                 | -        | -             |
| [oneOf](./oneOf.md)                                               | 11    | -                 | -        | -             |
| [pattern](./pattern.md)                                           | 2     | -                 | -        | -             |
| [patternProperties](./patternProperties.md)                       | 4     | -                 | -        | -             |
| [properties](./properties.md)                                     | 4     | -                 | -        | -             |
| [propertyNames](./propertyNames.md)                               | 3     | -                 | -        | -             |
| [ref](./ref.md)                                                   | 14    | -                 | -        | -             |
| [refRemote](./refRemote.md)                                       | 7     | -                 | -        | -             |
| [required](./required.md)                                         | 4     | -                 | -        | -             |
| [type](./type.md)                                                 | 11    | -                 | -        | -             |
| [unevaluatedItems](./unevaluatedItems.md)                         | 16    | 2                 | -        | -             |
| [unevaluatedProperties](./unevaluatedProperties.md)               | 18    | 4                 | 1        | -             |
| [uniqueItems](./uniqueItems.md)                                   | 6     | -                 | -        | -             |
| [optional/bignum](./optional-bignum.md)                           | 9     | -                 | -        | -             |
| [optional/content](./optional-content.md)                         | 3     | -                 | -        | -             |
| [optional/ecmascript-regex](./optional-ecmascript-regex.md)       | 11    | -                 | -        | -             |
| [optional/non-bmp-regex](./optional-non-bmp-regex.md)             | 2     | -                 | -        | -             |
| [optional/refOfUnknownKeyword](./optional-refOfUnknownKeyword.md) | 2     | -                 | 2        | -             |
