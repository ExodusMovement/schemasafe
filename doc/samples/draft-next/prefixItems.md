# prefixItems

## a schema given for prefixItems

### Schema

```json
{ "prefixItems": [{ "type": "integer" }, { "type": "string" }] }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(Number.isInteger(data[0]))) return false
    }
    if (data[1] !== undefined && hasOwn(data, 1)) {
      if (!(typeof data[1] === "string")) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/1`


## prefixItems with boolean schemas

### Schema

```json
{ "prefixItems": [true, false] }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    if (data[1] !== undefined && hasOwn(data, 1)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/0`


## additional items are allowed by default

### Schema

```json
{ "prefixItems": [{ "type": "integer" }] }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(Number.isInteger(data[0]))) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## prefixItems with null instance elements

### Schema

```json
{ "prefixItems": [{ "type": "null" }] }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(data[0] === null)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

