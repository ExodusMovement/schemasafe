# additionalItems

## additionalItems as schema

### Schema

```json
{ "items": [{}], "additionalItems": { "type": "integer" } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (Array.isArray(data)) {
    for (let i = 1; i < data.length; i++) {
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

 * `[requireValidation] type must be specified at #`


## items is schema, no additionalItems

### Schema

```json
{ "items": {}, "additionalItems": false }
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

 * `Unprocessed keywords: ["additionalItems"] at #`


## array of items with no additionalItems

### Schema

```json
{ "items": [{}, {}, {}], "additionalItems": false }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (Array.isArray(data)) {
    if (data.length > 3) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`


## additionalItems as false without items

### Schema

```json
{ "additionalItems": false }
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

 * `Unprocessed keywords: ["additionalItems"] at #`


## additionalItems are allowed by default

### Schema

```json
{ "items": [{ "type": "integer" }] }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
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

 * `[requireValidation] type must be specified at #`


## additionalItems should not look in applicators, valid case

### Schema

```json
{
  "allOf": [{ "items": [{ "type": "integer" }] }],
  "additionalItems": { "type": "boolean" }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(Number.isInteger(data[0]))) return false
    }
  }
  return true
};
return ref0
```

### Warnings

 * `Unprocessed keywords: ["additionalItems"] at #`


## additionalItems should not look in applicators, invalid case

### Schema

```json
{
  "allOf": [{ "items": [{ "type": "integer" }, { "type": "string" }] }],
  "items": [{ "type": "integer" }],
  "additionalItems": { "type": "boolean" }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(Number.isInteger(data[0]))) return false
    }
    for (let i = 1; i < data.length; i++) {
      if (data[i] !== undefined && hasOwn(data, i)) {
        if (!(typeof data[i] === "boolean")) return false
      }
    }
  }
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

 * `[requireValidation] type must be specified at #/allOf/0`

