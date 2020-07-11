# maxContains

## maxContains without contains is ignored

### Schema

```json
{ "maxContains": 1 }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  return true
})
```

### Warnings

 * `Unprocessed keywords: ["maxContains"] at #`


## maxContains with contains

### Schema

```json
{ "contains": { "const": 1 }, "maxContains": 1 }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
return (function validate(data, recursive) {
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
    if (passes0 > 1) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## minContains < maxContains

### Schema

```json
{ "contains": { "const": 1 }, "minContains": 1, "maxContains": 3 }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
return (function validate(data, recursive) {
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
    if (passes0 > 3) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

