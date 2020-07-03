# minProperties

## minProperties validation

### Schema

```json
{ "minProperties": 1 }
```

### Code

```js
'use strict'
const validate = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (Object.keys(data).length < 1) return false
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

