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
const validate = function validate(data, recursive) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined && hasOwn(data, i)) {
        if (!(Number.isInteger(data[i]))) return false
      }
    }
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## an array of schemas for items

### Schema

```json
{ "items": [{ "type": "integer" }, { "type": "string" }] }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const validate = function validate(data, recursive) {
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
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## items with boolean schema (true)

### Schema

```json
{ "items": true }
```

### Code

```js
'use strict'
const validate = function validate(data, recursive) {
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## items with boolean schema (false)

### Schema

```json
{ "items": false }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const validate = function validate(data, recursive) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined && hasOwn(data, i)) return false
    }
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## items with boolean schemas

### Schema

```json
{ "items": [true, false] }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const validate = function validate(data, recursive) {
  if (Array.isArray(data)) {
    if (data[1] !== undefined && hasOwn(data, 1)) return false
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## items and subitems

### Schema

```json
{
  "$defs": {
    "item": {
      "type": "array",
      "additionalItems": false,
      "items": [{ "$ref": "#/$defs/sub-item" }, { "$ref": "#/$defs/sub-item" }]
    },
    "sub-item": { "type": "object", "required": ["foo"] }
  },
  "type": "array",
  "additionalItems": false,
  "items": [
    { "$ref": "#/$defs/item" },
    { "$ref": "#/$defs/item" },
    { "$ref": "#/$defs/item" }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
  return true
};
const ref0 = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  if (data[0] !== undefined && hasOwn(data, 0)) {
    if (!ref1(data[0], recursive)) return false
  }
  if (data[1] !== undefined && hasOwn(data, 1)) {
    if (!ref1(data[1], recursive)) return false
  }
  if (data.length > 2) return false
  return true
};
const validate = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  if (data[0] !== undefined && hasOwn(data, 0)) {
    if (!ref0(data[0], recursive)) return false
  }
  if (data[1] !== undefined && hasOwn(data, 1)) {
    if (!ref0(data[1], recursive)) return false
  }
  if (data[2] !== undefined && hasOwn(data, 2)) {
    if (!ref0(data[2], recursive)) return false
  }
  if (data.length > 3) return false
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] additionalProperties rule must be specified at #`


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
const validate = function validate(data, recursive) {
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
return validate
```

