# oneOf

## oneOf

### Schema

```json
{ "oneOf": [{ "type": "integer" }, { "minimum": 2 }] }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  let passes0 = 0
  const sub0 = (() => {
    if (!Number.isInteger(data)) return false
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    if (typeof data === "number") {
      if (!(2 <= data)) return false
    }
    return true
  })()
  if (sub1) passes0++
  if (passes0 !== 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## oneOf with base schema

### Schema

```json
{ "type": "string", "oneOf": [{ "minLength": 2 }, { "maxLength": 4 }] }
```

### Code

```js
'use strict'
const stringLength = (string) =>
  /[\uD800-\uDFFF]/.test(string) ? [...string].length : string.length;
const ref0 = function validate(data) {
  if (!(typeof data === "string")) return false
  let passes0 = 0
  const sub0 = (() => {
    if (data.length < 2 || stringLength(data) < 2) return false
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    if (data.length > 4 && stringLength(data) > 4) return false
    return true
  })()
  if (sub1) passes0++
  if (passes0 !== 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #`


## oneOf complex types

### Schema

```json
{
  "oneOf": [
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
  let passes0 = 0
  const sub0 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
      if (!Number.isInteger(data.bar)) return false
    }
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
      if (!(typeof data.foo === "string")) return false
    }
    return true
  })()
  if (sub1) passes0++
  if (passes0 !== 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/oneOf/1/properties/foo`


## oneOf with empty schema

### Schema

```json
{ "oneOf": [{ "type": "number" }, {}] }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  let passes0 = 0
  const sub0 = (() => {
    if (!(typeof data === "number")) return false
    return true
  })()
  if (sub0) passes0++
  passes0++
  if (passes0 !== 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## oneOf with required

### Schema

```json
{
  "type": "object",
  "oneOf": [{ "required": ["foo", "bar"] }, { "required": ["foo", "baz"] }]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  let passes0 = 0
  const sub0 = (() => {
    if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
    if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
    if (!(data.baz !== undefined && hasOwn(data, "baz"))) return false
    return true
  })()
  if (sub1) passes0++
  if (passes0 !== 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] additionalProperties or unevaluatedProperties should be specified at #`


## oneOf with missing optional property

### Schema

```json
{
  "oneOf": [
    { "properties": { "bar": {}, "baz": {} }, "required": ["bar"] },
    { "properties": { "foo": {} }, "required": ["foo"] }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  let passes0 = 0
  const sub0 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
    }
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
    }
    return true
  })()
  if (sub1) passes0++
  if (passes0 !== 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] empty rules node is not allowed at #/oneOf/0/properties/bar`


## nested oneOf, to check validation semantics

### Schema

```json
{ "oneOf": [{ "oneOf": [{ "type": "null" }] }] }
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

