# minItems

## minItems validation

### Schema

```json
{ "minItems": 1 }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (Array.isArray(data)) {
    if (data.length < 1) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`

