# minItems

## minItems validation

### Schema

```json
{ "minItems": 1 }
```

### Code

```js
'use strict'
const validate = function validate(data, recursive) {
  if (Array.isArray(data)) {
    if (data.length < 1) return false
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

