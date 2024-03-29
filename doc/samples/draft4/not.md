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

