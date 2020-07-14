# exclusiveMaximum

## exclusiveMaximum validation

### Schema

```json
{ "exclusiveMaximum": 3 }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (typeof data === "number") {
    if (!(3 > data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`

