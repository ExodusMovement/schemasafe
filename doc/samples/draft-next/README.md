# Samples

Based on JSON Schema Test Suite for `draft-next`.


### Disambiguation

 * **Failed to compile** — schemas that did not compile in any mode.

 * **Warnings** — schemas that did not compile in the `default` mode, but compiled in `lax`
   mode.

   JSON Schema spec allows usage of ineffective or unknown keywords, which is considered a mistake
   by `@exodus/schemasafe` by default. `lax` mode lifts that coherence check.

 * **Misclassified** — schemas that classified at least one test value incorrectly, i.e. gave
   `true` where testsuite expected `false` or vice versa.

## Results

| Name                                                                            | Total | Failed to compile | Warnings | Misclassified |
|---------------------------------------------------------------------------------|-------|-------------------|----------|---------------|
| [additionalProperties](./additionalProperties.md)                               | 7     | -                 | -        | -             |
| [allOf](./allOf.md)                                                             | 12    | -                 | -        | -             |
| [anchor](./anchor.md)                                                           | 7     | -                 | -        | -             |
| [anyOf](./anyOf.md)                                                             | 8     | -                 | 3        | -             |
| [boolean_schema](./boolean_schema.md)                                           | 2     | -                 | -        | -             |
| [const](./const.md)                                                             | 15    | -                 | -        | -             |
| [contains](./contains.md)                                                       | 7     | -                 | -        | 6             |
| [content](./content.md)                                                         | 4     | -                 | 4        | -             |
| [default](./default.md)                                                         | 3     | -                 | -        | -             |
| [defs](./defs.md)                                                               | 1     | -                 | -        | -             |
| [dependentRequired](./dependentRequired.md)                                     | 4     | -                 | -        | -             |
| [dependentSchemas](./dependentSchemas.md)                                       | 3     | -                 | -        | -             |
| [dynamicRef](./dynamicRef.md)                                                   | 12    | 2                 | -        | -             |
| [enum](./enum.md)                                                               | 10    | -                 | -        | -             |
| [exclusiveMaximum](./exclusiveMaximum.md)                                       | 1     | -                 | -        | -             |
| [exclusiveMinimum](./exclusiveMinimum.md)                                       | 1     | -                 | -        | -             |
| [format](./format.md)                                                           | 19    | 4                 | -        | -             |
| [id](./id.md)                                                                   | 5     | -                 | -        | -             |
| [if-then-else](./if-then-else.md)                                               | 10    | -                 | 6        | -             |
| [infinite-loop-detection](./infinite-loop-detection.md)                         | 1     | -                 | -        | -             |
| [items](./items.md)                                                             | 9     | -                 | -        | -             |
| [maxContains](./maxContains.md)                                                 | 4     | -                 | 1        | 2             |
| [maxItems](./maxItems.md)                                                       | 2     | -                 | -        | -             |
| [maxLength](./maxLength.md)                                                     | 2     | -                 | -        | -             |
| [maxProperties](./maxProperties.md)                                             | 3     | -                 | -        | -             |
| [maximum](./maximum.md)                                                         | 2     | -                 | -        | -             |
| [minContains](./minContains.md)                                                 | 8     | -                 | 2        | -             |
| [minItems](./minItems.md)                                                       | 2     | -                 | -        | -             |
| [minLength](./minLength.md)                                                     | 2     | -                 | -        | -             |
| [minProperties](./minProperties.md)                                             | 2     | -                 | -        | -             |
| [minimum](./minimum.md)                                                         | 2     | -                 | -        | -             |
| [multipleOf](./multipleOf.md)                                                   | 4     | -                 | -        | -             |
| [not](./not.md)                                                                 | 6     | -                 | 1        | -             |
| [oneOf](./oneOf.md)                                                             | 11    | -                 | 3        | -             |
| [pattern](./pattern.md)                                                         | 2     | -                 | -        | -             |
| [patternProperties](./patternProperties.md)                                     | 5     | -                 | -        | -             |
| [prefixItems](./prefixItems.md)                                                 | 4     | -                 | -        | -             |
| [properties](./properties.md)                                                   | 6     | -                 | -        | -             |
| [propertyDependencies](./propertyDependencies.md)                               | 3     | -                 | 3        | 1             |
| [propertyNames](./propertyNames.md)                                             | 3     | -                 | -        | -             |
| [ref](./ref.md)                                                                 | 29    | -                 | -        | -             |
| [refRemote](./refRemote.md)                                                     | 13    | -                 | -        | -             |
| [required](./required.md)                                                       | 5     | -                 | -        | -             |
| [type](./type.md)                                                               | 11    | -                 | -        | -             |
| [unevaluatedItems](./unevaluatedItems.md)                                       | 23    | -                 | 2        | -             |
| [unevaluatedProperties](./unevaluatedProperties.md)                             | 36    | -                 | 3        | 2             |
| [uniqueItems](./uniqueItems.md)                                                 | 6     | -                 | -        | -             |
| [unknownKeyword](./unknownKeyword.md)                                           | 1     | -                 | 1        | -             |
| [vocabulary](./vocabulary.md)                                                   | 1     | 1                 | -        | -             |
| [optional/bignum](./optional-bignum.md)                                         | 7     | -                 | -        | -             |
| [optional/dependencies-compatibility](./optional-dependencies-compatibility.md) | 7     | -                 | -        | -             |
| [optional/ecmascript-regex](./optional-ecmascript-regex.md)                     | 21    | -                 | -        | -             |
| [optional/float-overflow](./optional-float-overflow.md)                         | 1     | -                 | -        | -             |
| [optional/format-assertion](./optional-format-assertion.md)                     | 2     | 2                 | -        | -             |
| [optional/non-bmp-regex](./optional-non-bmp-regex.md)                           | 2     | -                 | -        | -             |
| [optional/refOfUnknownKeyword](./optional-refOfUnknownKeyword.md)               | 2     | -                 | 2        | -             |

### Notes

`{ isJSON: true }` option is used for better clarity, and that also corresponds to the main
expected usage pattern of this module. Without it, there would be additional checks for
`!== undefined`, which can be fast-tracked if we know that the input came from `JSON.parse()`.
