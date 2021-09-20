# exclusiveMinimum

## exclusiveMinimum validation

### Schema

```json
{ "exclusiveMinimum": 1.1 }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (typeof data === "number") {
    if (!(1.1 < data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

