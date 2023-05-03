# not

## not

### Schema

```json
{ "not": { "type": "integer" } }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  const sub0 = (() => {
    if (!Number.isInteger(data)) return false
    return true
  })()
  if (sub0) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## not multiple types

### Schema

```json
{ "not": { "type": ["integer", "boolean"] } }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  const sub0 = (() => {
    if (!(Number.isInteger(data) || typeof data === "boolean")) return false
    return true
  })()
  if (sub0) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## not more complex schema

### Schema

```json
{ "not": { "type": "object", "properties": { "foo": { "type": "string" } } } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  const sub0 = (() => {
    if (!(typeof data === "object" && data && !Array.isArray(data))) return false
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!(typeof data.foo === "string")) return false
    }
    return true
  })()
  if (sub0) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] if properties is used, required should be specified at #/not`


## forbidden property

### Schema

```json
{ "properties": { "foo": { "not": {} } } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #/properties/foo`


## not with boolean schema true

### Schema

```json
{ "not": true }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## not with boolean schema false

### Schema

```json
{ "not": false }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  return true
};
return ref0
```

### Warnings

 * `some checks are never reachable at #`


## collect annotations inside a 'not', even if collection is disabled

### Schema

```json
{
  "not": {
    "$comment": "this subschema must still produce annotations internally, even though the 'not' will ultimately discard them",
    "anyOf": [true, { "properties": { "foo": true } }],
    "unevaluatedProperties": false
  }
}
```

### Code

```js
'use strict'
const propertyIn = (key, [properties, patterns]) =>
  properties.includes(true) ||
  properties.some((prop) => prop === key) ||
  patterns.some((pattern) => new RegExp(pattern, 'u').test(key));
const ref0 = function validate(data) {
  validate.evaluatedDynamic = null
  const evaluatedItem0 = []
  const evaluatedItems0 = [0]
  const evaluatedProps0 = [[], []]
  const sub0 = (() => {
    const evaluatedProps1 = [[], []]
    const sub1 = (() => {
      return true
    })()
    if (sub1) evaluatedProps1[0].push(...["foo"])
    if (typeof data === "object" && data && !Array.isArray(data)) {
      for (const key0 of Object.keys(data)) {
        if (true && !propertyIn(key0, evaluatedProps1)) return false
      }
    }
    return true
  })()
  if (sub0) return false
  return true
};
return ref0
```

### Warnings

 * `some checks are never reachable at #/not`

