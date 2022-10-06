# anyOf

## anyOf

### Schema

```json
{ "anyOf": [{ "type": "integer" }, { "minimum": 2 }] }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  const sub0 = (() => {
    if (!Number.isInteger(data)) return false
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      if (typeof data === "number") {
        if (!(2 <= data)) return false
      }
      return true
    })()
    if (!sub1) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## anyOf with base schema

### Schema

```json
{ "type": "string", "anyOf": [{ "maxLength": 2 }, { "minLength": 4 }] }
```

### Code

```js
'use strict'
const stringLength = (string) =>
  /[\uD800-\uDFFF]/.test(string) ? [...string].length : string.length;
const ref0 = function validate(data) {
  if (!(typeof data === "string")) return false
  const sub0 = (() => {
    if (data.length > 2 && stringLength(data) > 2) return false
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      if (data.length < 4 || stringLength(data) < 4) return false
      return true
    })()
    if (!sub1) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #`


## anyOf complex types

### Schema

```json
{
  "anyOf": [
    { "properties": { "bar": { "type": "integer" } }, "required": ["bar"] },
    { "properties": { "foo": { "type": "string" } }, "required": ["foo"] }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  const sub0 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
      if (!Number.isInteger(data.bar)) return false
    }
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      if (typeof data === "object" && data && !Array.isArray(data)) {
        if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
        if (!(typeof data.foo === "string")) return false
      }
      return true
    })()
    if (!sub1) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/anyOf/1/properties/foo`


## anyOf with one empty schema

### Schema

```json
{ "anyOf": [{ "type": "number" }, {}] }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  const sub0 = (() => {
    if (!(typeof data === "number")) return false
    return true
  })()
  return true
};
return ref0
```

### Warnings

 * `some checks are never reachable at #`


## nested anyOf, to check validation semantics

### Schema

```json
{ "anyOf": [{ "anyOf": [{ "type": "null" }] }] }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(data === null)) return false
  return true
};
return ref0
```

