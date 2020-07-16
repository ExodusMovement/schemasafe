# allOf

## allOf

### Schema

```json
{
  "allOf": [
    { "properties": { "bar": { "type": "integer" } }, "required": ["bar"] },
    { "properties": { "foo": { "type": "string" } }, "required": ["foo"] }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
    if (!Number.isInteger(data.bar)) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
    if (!(typeof data.foo === "string")) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema must be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/allOf/1/properties/foo`


## allOf with base schema

### Schema

```json
{
  "properties": { "bar": { "type": "integer" } },
  "required": ["bar"],
  "allOf": [
    { "properties": { "foo": { "type": "string" } }, "required": ["foo"] },
    { "properties": { "baz": { "type": "null" } }, "required": ["baz"] }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
    if (!Number.isInteger(data.bar)) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
    if (!(typeof data.foo === "string")) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data.baz !== undefined && hasOwn(data, "baz"))) return false
    if (!(data.baz === null)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema must be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/allOf/0/properties/foo`


## allOf simple types

### Schema

```json
{ "allOf": [{ "maximum": 30 }, { "minimum": 20 }] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (typeof data === "number") {
    if (!(30 >= data)) return false
  }
  if (typeof data === "number") {
    if (!(20 <= data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`


## allOf with boolean schemas, all true

### Schema

```json
{ "allOf": [true, true] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/allOf/0`


## allOf with boolean schemas, some false

### Schema

```json
{ "allOf": [true, false] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/allOf/0`


## allOf with boolean schemas, all false

### Schema

```json
{ "allOf": [false, false] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  return false
  return false
  return true
};
return ref0
```


## allOf with one empty schema

### Schema

```json
{ "allOf": [{}] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] empty rules node is not allowed at #/allOf/0`


## allOf with two empty schemas

### Schema

```json
{ "allOf": [{}, {}] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] empty rules node is not allowed at #/allOf/0`


## allOf with the first empty schema

### Schema

```json
{ "allOf": [{}, { "type": "number" }] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "number")) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] empty rules node is not allowed at #/allOf/0`


## allOf with the last empty schema

### Schema

```json
{ "allOf": [{ "type": "number" }, {}] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "number")) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] empty rules node is not allowed at #/allOf/1`


## nested allOf, to check validation semantics

### Schema

```json
{ "allOf": [{ "allOf": [{ "type": "null" }] }] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!(data === null)) return false
  return true
};
return ref0
```


## allOf combined with anyOf, oneOf

### Schema

```json
{
  "allOf": [{ "multipleOf": 2 }],
  "anyOf": [{ "multipleOf": 3 }],
  "oneOf": [{ "multipleOf": 5 }]
}
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (typeof data === "number") {
    if (data % 2 !== 0) return false
  }
  if (typeof data === "number") {
    if (data % 3 !== 0) return false
  }
  if (typeof data === "number") {
    if (data % 5 !== 0) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`

