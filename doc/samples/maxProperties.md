# maxProperties

## maxProperties validation

### Schema

```json
{ "maxProperties": 2 }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (Object.keys(data).length > 2) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## maxProperties = 0 means the object is empty

### Schema

```json
{ "maxProperties": 0 }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (Object.keys(data).length > 0) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

