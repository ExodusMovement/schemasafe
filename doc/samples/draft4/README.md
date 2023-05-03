# Samples

Based on JSON Schema Test Suite for `draft4`.


### Disambiguation

 * **Failed to compile** — schemas that did not compile in any mode.

 * **Warnings** — schemas that did not compile in the `default` mode, but compiled in `lax`
   mode.

   JSON Schema spec allows usage of ineffective or unknown keywords, which is considered a mistake
   by `@exodus/schemasafe` by default. `lax` mode lifts that coherence check.

 * **Misclassified** — schemas that classified at least one test value incorrectly, i.e. gave
   `true` where testsuite expected `false` or vice versa.

## Results

| Name                                                                | Total | Failed to compile | Warnings | Misclassified |
|---------------------------------------------------------------------|-------|-------------------|----------|---------------|
| [additionalItems](./additionalItems.md)                             | 9     | -                 | 4        | -             |
| [additionalProperties](./additionalProperties.md)                   | 7     | -                 | -        | -             |
| [allOf](./allOf.md)                                                 | 9     | -                 | -        | -             |
| [anyOf](./anyOf.md)                                                 | 5     | -                 | 1        | -             |
| [default](./default.md)                                             | 3     | -                 | -        | -             |
| [definitions](./definitions.md)                                     | 1     | -                 | -        | -             |
| [dependencies](./dependencies.md)                                   | 5     | -                 | -        | -             |
| [enum](./enum.md)                                                   | 10    | -                 | -        | -             |
| [format](./format.md)                                               | 6     | -                 | -        | -             |
| [id](./id.md)                                                       | 1     | -                 | -        | -             |
| [infinite-loop-detection](./infinite-loop-detection.md)             | 1     | -                 | -        | -             |
| [items](./items.md)                                                 | 6     | -                 | -        | -             |
| [maxItems](./maxItems.md)                                           | 1     | -                 | -        | -             |
| [maxLength](./maxLength.md)                                         | 1     | -                 | -        | -             |
| [maxProperties](./maxProperties.md)                                 | 2     | -                 | -        | -             |
| [maximum](./maximum.md)                                             | 4     | -                 | -        | -             |
| [minItems](./minItems.md)                                           | 1     | -                 | -        | -             |
| [minLength](./minLength.md)                                         | 1     | -                 | -        | -             |
| [minProperties](./minProperties.md)                                 | 1     | -                 | -        | -             |
| [minimum](./minimum.md)                                             | 4     | -                 | -        | -             |
| [multipleOf](./multipleOf.md)                                       | 5     | -                 | -        | -             |
| [not](./not.md)                                                     | 4     | -                 | -        | -             |
| [oneOf](./oneOf.md)                                                 | 7     | -                 | -        | -             |
| [pattern](./pattern.md)                                             | 2     | -                 | -        | -             |
| [patternProperties](./patternProperties.md)                         | 4     | -                 | -        | -             |
| [properties](./properties.md)                                       | 5     | -                 | -        | -             |
| [ref](./ref.md)                                                     | 19    | -                 | 2        | -             |
| [refRemote](./refRemote.md)                                         | 8     | -                 | -        | -             |
| [required](./required.md)                                           | 4     | -                 | -        | -             |
| [type](./type.md)                                                   | 11    | -                 | -        | -             |
| [uniqueItems](./uniqueItems.md)                                     | 6     | -                 | -        | -             |
| [optional/bignum](./optional-bignum.md)                             | 7     | -                 | -        | -             |
| [optional/ecmascript-regex](./optional-ecmascript-regex.md)         | 20    | -                 | -        | -             |
| [optional/float-overflow](./optional-float-overflow.md)             | 1     | -                 | -        | -             |
| [optional/non-bmp-regex](./optional-non-bmp-regex.md)               | 2     | -                 | -        | -             |
| [optional/zeroTerminatedFloats](./optional-zeroTerminatedFloats.md) | 1     | -                 | -        | 1             |

### Notes

`{ isJSON: true }` option is used for better clarity, and that also corresponds to the main
expected usage pattern of this module. Without it, there would be additional checks for
`!== undefined`, which can be fast-tracked if we know that the input came from `JSON.parse()`.
