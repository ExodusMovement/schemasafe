# maxItems

## maxItems validation

### Schema

```json
{ "maxItems": 2 }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (Array.isArray(data)) {
    if (data.length > 2) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

