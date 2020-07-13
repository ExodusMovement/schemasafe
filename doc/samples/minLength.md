# minLength

## minLength validation

### Schema

```json
{ "minLength": 2 }
```

### Code

```js
'use strict'
const stringLength = (string) =>
  /[\uD800-\uDFFF]/.test(string) ? [...string].length : string.length;
const ref0 = function validate(data, recursive) {
  if (typeof data === "string") {
    if (data.length < 2 || stringLength(data) < 2) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

