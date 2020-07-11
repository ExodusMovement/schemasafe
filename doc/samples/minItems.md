# minItems

## minItems validation

### Schema

```json
{ "minItems": 1 }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (Array.isArray(data)) {
    if (data.length < 1) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

