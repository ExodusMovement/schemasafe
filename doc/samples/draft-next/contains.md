# contains

## contains keyword validation

### Schema

```json
{ "contains": { "minimum": 5 } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    let passes0 = 0
    for (let i = 0; i < data.length; i++) {
      const sub0 = (() => {
        if (data[i] !== undefined && hasOwn(data, i)) {
          if (typeof data[i] === "number") {
            if (!(5 <= data[i])) return false
          }
        }
        return true
      })()
      if (sub0) passes0++
    }
    if (passes0 < 1) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #/contains`

### Misclassified!

**This schema caused 2 misclassifications!**


## contains keyword with const keyword

### Schema

```json
{ "contains": { "const": 5 } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    let passes0 = 0
    for (let i = 0; i < data.length; i++) {
      const sub0 = (() => {
        if (data[i] !== undefined && hasOwn(data, i)) {
          if (!(data[i] === 5)) return false
        }
        return true
      })()
      if (sub0) passes0++
    }
    if (passes0 < 1) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

### Misclassified!

**This schema caused 1 misclassifications!**


## contains keyword with boolean schema true

### Schema

```json
{ "contains": true }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    let passes0 = 0
    for (let i = 0; i < data.length; i++) {
      const sub0 = (() => {
        return true
      })()
      if (sub0) passes0++
    }
    if (passes0 < 1) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/contains`

### Misclassified!

**This schema caused 1 misclassifications!**


## contains keyword with boolean schema false

### Schema

```json
{ "contains": false }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    let passes0 = 0
    for (let i = 0; i < data.length; i++) {
      const sub0 = (() => {
        if (data[i] !== undefined && hasOwn(data, i)) return false
        return true
      })()
      if (sub0) passes0++
    }
    if (passes0 < 1) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

### Misclassified!

**This schema caused 1 misclassifications!**


## items + contains

### Schema

```json
{
  "additionalProperties": { "multipleOf": 2 },
  "items": { "multipleOf": 2 },
  "contains": { "multipleOf": 3 }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined && hasOwn(data, i)) {
        if (typeof data[i] === "number") {
          if (data[i] % 2 !== 0) return false
        }
      }
    }
    let passes0 = 0
    for (let j = 0; j < data.length; j++) {
      const sub0 = (() => {
        if (data[j] !== undefined && hasOwn(data, j)) {
          if (typeof data[j] === "number") {
            if (data[j] % 3 !== 0) return false
          }
        }
        return true
      })()
      if (sub0) passes0++
    }
    if (passes0 < 1) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (typeof data[key0] === "number") {
        if (data[key0] % 2 !== 0) return false
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #/items`

### Misclassified!

**This schema caused 1 misclassifications!**


## contains with false if subschema

### Schema

```json
{ "contains": { "if": false, "else": true } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    let passes0 = 0
    for (let i = 0; i < data.length; i++) {
      const sub0 = (() => {
        return true
      })()
      if (sub0) passes0++
    }
    if (passes0 < 1) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/contains/else`

### Misclassified!

**This schema caused 1 misclassifications!**


## contains with null instance elements

### Schema

```json
{ "contains": { "type": "null" } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    let passes0 = 0
    for (let i = 0; i < data.length; i++) {
      const sub0 = (() => {
        if (data[i] !== undefined && hasOwn(data, i)) {
          if (!(data[i] === null)) return false
        }
        return true
      })()
      if (sub0) passes0++
    }
    if (passes0 < 1) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

