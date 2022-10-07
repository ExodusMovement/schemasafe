# minContains

## minContains without contains is ignored

### Schema

```json
{ "minContains": 1 }
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

 * `Unprocessed keywords: ["minContains"] at #`


## minContains=1 with contains

### Schema

```json
{ "contains": { "const": 1 }, "minContains": 1 }
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
          if (!(data[i] === 1)) return false
        }
        return true
      })()
      if (sub0) passes0++
    }
    if (passes0 < 1) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    let passes1 = 0
    for (const key0 of Object.keys(data)) {
      const sub1 = (() => {
        if (!(data[key0] === 1)) return false
        return true
      })()
      if (sub1) passes1++
    }
    if (passes1 < 1) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] possible type confusion in 'contains', forbid 'object' or 'array' at #`


## minContains=2 with contains

### Schema

```json
{ "contains": { "const": 1 }, "minContains": 2 }
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
          if (!(data[i] === 1)) return false
        }
        return true
      })()
      if (sub0) passes0++
    }
    if (passes0 < 2) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    let passes1 = 0
    for (const key0 of Object.keys(data)) {
      const sub1 = (() => {
        if (!(data[key0] === 1)) return false
        return true
      })()
      if (sub1) passes1++
    }
    if (passes1 < 2) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] possible type confusion in 'contains', forbid 'object' or 'array' at #`


## minContains=2 with contains with a decimal value

### Schema

```json
{ "contains": { "const": 1 }, "minContains": 2 }
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
          if (!(data[i] === 1)) return false
        }
        return true
      })()
      if (sub0) passes0++
    }
    if (passes0 < 2) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    let passes1 = 0
    for (const key0 of Object.keys(data)) {
      const sub1 = (() => {
        if (!(data[key0] === 1)) return false
        return true
      })()
      if (sub1) passes1++
    }
    if (passes1 < 2) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] possible type confusion in 'contains', forbid 'object' or 'array' at #`


## maxContains = minContains

### Schema

```json
{ "contains": { "const": 1 }, "maxContains": 2, "minContains": 2 }
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
          if (!(data[i] === 1)) return false
        }
        return true
      })()
      if (sub0) passes0++
    }
    if (passes0 < 2) return false
    if (passes0 > 2) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    let passes1 = 0
    for (const key0 of Object.keys(data)) {
      const sub1 = (() => {
        if (!(data[key0] === 1)) return false
        return true
      })()
      if (sub1) passes1++
    }
    if (passes1 < 2) return false
    if (passes1 > 2) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] possible type confusion in 'contains', forbid 'object' or 'array' at #`


## maxContains < minContains

### Schema

```json
{ "contains": { "const": 1 }, "maxContains": 1, "minContains": 3 }
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
          if (!(data[i] === 1)) return false
        }
        return true
      })()
      if (sub0) passes0++
    }
    if (passes0 < 3) return false
    if (passes0 > 1) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    let passes1 = 0
    for (const key0 of Object.keys(data)) {
      const sub1 = (() => {
        if (!(data[key0] === 1)) return false
        return true
      })()
      if (sub1) passes1++
    }
    if (passes1 < 3) return false
    if (passes1 > 1) return false
  }
  return true
};
return ref0
```

### Warnings

 * `Invalid minContains / maxContains combination at #`


## minContains = 0

### Schema

```json
{ "contains": { "const": 1 }, "minContains": 0 }
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
          if (!(data[i] === 1)) return false
        }
        return true
      })()
      if (sub0) passes0++
    }
    if (passes0 < 0) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    let passes1 = 0
    for (const key0 of Object.keys(data)) {
      const sub1 = (() => {
        if (!(data[key0] === 1)) return false
        return true
      })()
      if (sub1) passes1++
    }
    if (passes1 < 0) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] possible type confusion in 'contains', forbid 'object' or 'array' at #`


## minContains = 0 with maxContains

### Schema

```json
{ "contains": { "const": 1 }, "minContains": 0, "maxContains": 1 }
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
          if (!(data[i] === 1)) return false
        }
        return true
      })()
      if (sub0) passes0++
    }
    if (passes0 < 0) return false
    if (passes0 > 1) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    let passes1 = 0
    for (const key0 of Object.keys(data)) {
      const sub1 = (() => {
        if (!(data[key0] === 1)) return false
        return true
      })()
      if (sub1) passes1++
    }
    if (passes1 < 0) return false
    if (passes1 > 1) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] possible type confusion in 'contains', forbid 'object' or 'array' at #`

