# Complexity checks and DoS prevention

JSON Schemas can be vulnerable to DoS attacks in case if slow validation steps are performed
without proper restrictions.

In that case, the attacker can purposely spam the validator with JSON data which would slow the
validation logic down significantly and cause a DoS.

## What could be slow?

Such slow steps are, for example:

 1. `pattern` validation for complex patterns (e.g. those that could contain ReDoS),
 2. `patternProperties` for the same reason as `pattern`,
 3. `format` if format validation is slow (which shouldn't be true for build-in formats).
 4. `uniqueItems` validation for arrays

There are exceptions:

 1. `pattern` / `format` / `patternProperties` are fine if the regex they contain are definitely not
    vulnerable to ReDoS
 2. `pattern` / `format` should be fine if the string length is limited to a small enough number
 3. `patternProperties` should be fine if combined with `propertyNames` limiting the property names
    lengths to a small enough number
 4. `uniqueItems` items should be fine if `maxItems` is limited to a small enough number
 5. `uniqueItems` items should be fine it the array includes only primitive values

## Schema pre-validation approach
 
See e.g. [ajv meta-schema](https://github.com/ajv-validator/ajv/blob/master/lib/refs/json-schema-secure.json)
for reference on schema pre-validation approach.

Drawbacks of that approach (apart of shared [limitations](#limitations)):

 1. Does not follow refs, i.e.:
    * All schemas referenced from the top-level one should be checked separately.
    * Subschemas placed anywhere but `definitions` might be not checked.
 2. Overall, it might miss other parts of schemas that are actually used, as complexity/slowness
    checks are decoupled from actual code generation -- that could give both false positives and
    false negatives.

## Built-in approach

This library supports performing basic complexity checks similar to what the above-mentioned
ajv meta-schema does, but closely integrated with code generation. 

## On ReDoS safety

Restriciting the length of input 

`safe-regex` package is not a sufficient check for regular expressions, as it has both known
false negatives and false positives. 

There isn't a 100% reliable RegExp pattern check against ReDoS, but consulting
[this list](https://github.com/davisjam/vuln-regex-detector/blob/master/src/detect/README.md#which-detectors-do-we-use)
could be helful, e.g. [RegexStaticAnalysis](https://github.com/NicolaasWeideman/RegexStaticAnalysis).

This library expects `format` _functions_ to perform own length checks,
and allows regular expressions with less than two repetition groups.

### Enabling complexity checks

By default, complexity checks are disabled unless in [strong mode](./Strong-mode.md).

They could be enabled via the `complexityChecks: true` option.

### Limitations

Note that this won't protect against:

1. Exponential patterns which can get out of hand very fast even on short strings.

   E.g. `/^(a*)*b$/` is freezing for several seconds even on input with length `30`.

2. Too large numbers being passed as string or array maximum length.

   E.g. a quadratic ReDoS like `/^a*a*$/` can be mitigated with two-digit length restrictions, but
   setting `maxLength` to e.g. `80000` won't make the situation much better.
   
3. Slow formats impelemnted via functions.

   Formats implemented via functions are not validated at all and are _supposed_ to be safe.
   Slow functions won't be catched and `maxLength` requirement does not apply to functions.

Complexity checks don't _guarantee_ that the schema is safe against DoS, they just _help to notice_
potential problems which could lead to DoS vulnerabilities.
