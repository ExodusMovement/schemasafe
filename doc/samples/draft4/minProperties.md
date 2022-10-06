# minProperties

## minProperties validation

### Schema

```json
{ "minProperties": 1 }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (Object.keys(data).length < 1) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

