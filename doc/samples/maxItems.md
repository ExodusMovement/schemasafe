# maxItems

## maxItems validation

### Schema

```json
{ "maxItems": 2 }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (Array.isArray(data)) {
    if (data.length > 2) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

