# exclusiveMaximum

## exclusiveMaximum validation

### Schema

```json
{ "exclusiveMaximum": 3 }
```

### Code

```js
'use strict'
const validate = function validate(data, recursive) {
  if (typeof data === "number") {
    if (!(3 > data)) return false
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

