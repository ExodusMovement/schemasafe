# items

## a schema given for items

### Schema

```json
{ "items": { "type": "integer" } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined && hasOwn(data, i)) {
        if (!(Number.isInteger(data[i]))) return false
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## an array of schemas for items

### Schema

```json
{ "items": [{ "type": "integer" }, { "type": "string" }] }
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


## items with boolean schema (true)

### Schema

```json
{ "items": true }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/items`


## items with boolean schema (false)

### Schema

```json
{ "items": false }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined && hasOwn(data, i)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## items with boolean schemas

### Schema

```json
{ "items": [true, false] }
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


## items and subitems

### Schema

```json
{
  "definitions": {
    "item": {
      "type": "array",
      "additionalItems": false,
      "items": [
        { "$ref": "#/definitions/sub-item" },
        { "$ref": "#/definitions/sub-item" }
      ]
    },
    "sub-item": { "type": "object", "required": ["foo"] }
  },
  "type": "array",
  "additionalItems": false,
  "items": [
    { "$ref": "#/definitions/item" },
    { "$ref": "#/definitions/item" },
    { "$ref": "#/definitions/item" }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref2 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
  return true
};
const ref1 = function validate(data) {
  if (!Array.isArray(data)) return false
  if (data[0] !== undefined && hasOwn(data, 0)) {
    if (!ref2(data[0])) return false
  }
  if (data[1] !== undefined && hasOwn(data, 1)) {
    if (!ref2(data[1])) return false
  }
  if (data.length > 2) return false
  return true
};
const ref0 = function validate(data) {
  if (!Array.isArray(data)) return false
  if (data[0] !== undefined && hasOwn(data, 0)) {
    if (!ref1(data[0])) return false
  }
  if (data[1] !== undefined && hasOwn(data, 1)) {
    if (!ref1(data[1])) return false
  }
  if (data[2] !== undefined && hasOwn(data, 2)) {
    if (!ref1(data[2])) return false
  }
  if (data.length > 3) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] additionalProperties or unevaluatedProperties should be specified at #`


## nested items

### Schema

```json
{
  "type": "array",
  "items": {
    "type": "array",
    "items": {
      "type": "array",
      "items": { "type": "array", "items": { "type": "number" } }
    }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!(Array.isArray(data[i]))) return false
      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j] !== undefined && hasOwn(data[i], j)) {
          if (!(Array.isArray(data[i][j]))) return false
          for (let k = 0; k < data[i][j].length; k++) {
            if (data[i][j][k] !== undefined && hasOwn(data[i][j], k)) {
              if (!(Array.isArray(data[i][j][k]))) return false
              for (let l = 0; l < data[i][j][k].length; l++) {
                if (data[i][j][k][l] !== undefined && hasOwn(data[i][j][k], l)) {
                  if (!(typeof data[i][j][k][l] === "number")) return false
                }
              }
            }
          }
        }
      }
    }
  }
  return true
};
return ref0
```


## single-form items with null instance elements

### Schema

```json
{ "items": { "type": "null" } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined && hasOwn(data, i)) {
        if (!(data[i] === null)) return false
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## array-form items with null instance elements

### Schema

```json
{ "items": [{ "type": "null" }] }
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

