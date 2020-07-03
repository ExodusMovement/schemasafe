# maxItems

## maxItems validation

### Schema

```json
{ "maxItems": 2 }
```

### Code

```js
'use strict'
const validate = function validate(data, recursive) {
  if (Array.isArray(data)) {
    if (data.length > 2) return false
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

