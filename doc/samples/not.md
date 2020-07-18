# not

## not

### Schema

```json
{ "not": { "type": "integer" } }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
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

 * `[requireValidation] type must be specified at #`


## not multiple types

### Schema

```json
{ "not": { "type": ["integer", "boolean"] } }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
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

 * `[requireValidation] type must be specified at #`


## not more complex schema

### Schema

```json
{ "not": { "type": "object", "properties": { "foo": { "type": "string" } } } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
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

 * `[requireStringValidation] pattern, format or contentSchema must be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/not/properties/foo`


## forbidden property

### Schema

```json
{ "properties": { "foo": { "not": {} } } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #/properties/foo`


## not with boolean schema true

### Schema

```json
{ "not": true }
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

 * `[requireValidation] type must be specified at #`


## not with boolean schema false

### Schema

```json
{ "not": false }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  return true
};
return ref0
```

### Warnings

 * `some checks are never reachable at #`

