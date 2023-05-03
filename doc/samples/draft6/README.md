# Samples

Based on JSON Schema Test Suite for `draft6`.


### Disambiguation

 * **Failed to compile** — schemas that did not compile in any mode.

 * **Warnings** — schemas that did not compile in the `default` mode, but compiled in `lax`
   mode.

   JSON Schema spec allows usage of ineffective or unknown keywords, which is considered a mistake
   by `@exodus/schemasafe` by default. `lax` mode lifts that coherence check.

 * **Misclassified** — schemas that classified at least one test value incorrectly, i.e. gave
   `true` where testsuite expected `false` or vice versa.

## Results

| Name                                                        | Total | Failed to compile | Warnings | Misclassified |
|-------------------------------------------------------------|-------|-------------------|----------|---------------|
| [additionalItems](./additionalItems.md)                     | 10    | -                 | 5        | -             |
| [additionalProperties](./additionalProperties.md)           | 7     | -                 | -        | -             |
| [allOf](./allOf.md)                                         | 12    | -                 | -        | -             |
| [anyOf](./anyOf.md)                                         | 8     | -                 | 3        | -             |
| [boolean_schema](./boolean_schema.md)                       | 2     | -                 | -        | -             |
| [const](./const.md)                                         | 15    | -                 | -        | -             |
| [contains](./contains.md)                                   | 6     | -                 | -        | -             |
| [default](./default.md)                                     | 3     | -                 | -        | -             |
| [definitions](./definitions.md)                             | 1     | -                 | -        | -             |
| [dependencies](./dependencies.md)                           | 7     | -                 | -        | -             |
| [enum](./enum.md)                                           | 10    | -                 | -        | -             |
| [exclusiveMaximum](./exclusiveMaximum.md)                   | 1     | -                 | -        | -             |
| [exclusiveMinimum](./exclusiveMinimum.md)                   | 1     | -                 | -        | -             |
| [id](./id.md)                                               | 3     | -                 | -        | -             |
| [infinite-loop-detection](./infinite-loop-detection.md)     | 1     | -                 | -        | -             |
| [items](./items.md)                                         | 9     | -                 | -        | -             |
| [maxItems](./maxItems.md)                                   | 2     | -                 | -        | -             |
| [maxLength](./maxLength.md)                                 | 2     | -                 | -        | -             |
| [maxProperties](./maxProperties.md)                         | 3     | -                 | -        | -             |
| [maximum](./maximum.md)                                     | 2     | -                 | -        | -             |
| [minItems](./minItems.md)                                   | 2     | -                 | -        | -             |
| [minLength](./minLength.md)                                 | 2     | -                 | -        | -             |
| [minProperties](./minProperties.md)                         | 2     | -                 | -        | -             |
| [minimum](./minimum.md)                                     | 2     | -                 | -        | -             |
| [multipleOf](./multipleOf.md)                               | 5     | -                 | -        | -             |
| [not](./not.md)                                             | 6     | -                 | 1        | -             |
| [oneOf](./oneOf.md)                                         | 11    | -                 | 3        | -             |
| [pattern](./pattern.md)                                     | 2     | -                 | -        | -             |
| [patternProperties](./patternProperties.md)                 | 5     | -                 | -        | -             |
| [properties](./properties.md)                               | 6     | -                 | -        | -             |
| [propertyNames](./propertyNames.md)                         | 4     | -                 | -        | -             |
| [ref](./ref.md)                                             | 30    | -                 | 2        | -             |
| [refRemote](./refRemote.md)                                 | 10    | -                 | -        | -             |
| [required](./required.md)                                   | 5     | -                 | -        | -             |
| [type](./type.md)                                           | 11    | -                 | -        | -             |
| [uniqueItems](./uniqueItems.md)                             | 6     | -                 | -        | -             |
| [unknownKeyword](./unknownKeyword.md)                       | 1     | -                 | 1        | -             |
| [optional/bignum](./optional-bignum.md)                     | 7     | -                 | -        | -             |
| [optional/ecmascript-regex](./optional-ecmascript-regex.md) | 20    | -                 | -        | -             |
| [optional/float-overflow](./optional-float-overflow.md)     | 1     | -                 | -        | -             |
| [optional/non-bmp-regex](./optional-non-bmp-regex.md)       | 2     | -                 | -        | -             |

### Notes

`{ isJSON: true }` option is used for better clarity, and that also corresponds to the main
expected usage pattern of this module. Without it, there would be additional checks for
`!== undefined`, which can be fast-tracked if we know that the input came from `JSON.parse()`.
