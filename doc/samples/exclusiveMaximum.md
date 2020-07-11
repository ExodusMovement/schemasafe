# exclusiveMaximum

## exclusiveMaximum validation

### Schema

```json
{ "exclusiveMaximum": 3 }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (typeof data === "number") {
    if (!(3 > data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

