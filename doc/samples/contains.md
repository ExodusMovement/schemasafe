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
const validate = function validate(data, recursive) {
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
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## contains keyword with const keyword

### Schema

```json
{ "contains": { "const": 5 } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const validate = function validate(data, recursive) {
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
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## contains keyword with boolean schema true

### Schema

```json
{ "contains": true }
```

### Code

```js
'use strict'
const validate = function validate(data, recursive) {
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
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## contains keyword with boolean schema false

### Schema

```json
{ "contains": false }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const validate = function validate(data, recursive) {
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
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## items + contains

### Schema

```json
{ "items": { "multipleOf": 2 }, "contains": { "multipleOf": 3 } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const validate = function validate(data, recursive) {
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
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

