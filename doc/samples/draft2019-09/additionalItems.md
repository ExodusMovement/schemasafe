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
const ref0 = function validate(data) {
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

 * `[requireValidation] empty rules node is not allowed at #/0`


## when items is schema, additionalItems does nothing

### Schema

```json
{ "items": { "type": "integer" }, "additionalItems": { "type": "string" } }
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

### Warnings

 * `Unprocessed keywords: ["additionalItems"] at #`


## when items is schema, boolean additionalItems does nothing

### Schema

```json
{ "items": {}, "additionalItems": false }
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

 * `Unprocessed keywords: ["additionalItems"] at #`


## array of items with no additionalItems permitted

### Schema

```json
{ "items": [{}, {}, {}], "additionalItems": false }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    if (data.length > 3) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] empty rules node is not allowed at #/0`


## additionalItems as false without items

### Schema

```json
{ "additionalItems": false }
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


## additionalItems does not look in applicators, valid case

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

### Warnings

 * `Unprocessed keywords: ["additionalItems"] at #`


## additionalItems does not look in applicators, invalid case

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
const ref0 = function validate(data) {
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

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/allOf/0/1`


## items validation adjusts the starting index for additionalItems

### Schema

```json
{ "items": [{ "type": "string" }], "additionalItems": { "type": "integer" } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(typeof data[0] === "string")) return false
    }
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

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/0`


## additionalItems with null instance elements

### Schema

```json
{ "additionalItems": { "type": "null" } }
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

 * `Unprocessed keywords: ["additionalItems"] at #`

