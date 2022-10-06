# maxLength

## maxLength validation

### Schema

```json
{ "maxLength": 2 }
```

### Code

```js
'use strict'
const stringLength = (string) =>
  /[\uD800-\uDFFF]/.test(string) ? [...string].length : string.length;
const ref0 = function validate(data) {
  if (typeof data === "string") {
    if (data.length > 2 && stringLength(data) > 2) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## maxLength validation with a decimal

### Schema

```json
{ "maxLength": 2 }
```

### Code

```js
'use strict'
const stringLength = (string) =>
  /[\uD800-\uDFFF]/.test(string) ? [...string].length : string.length;
const ref0 = function validate(data) {
  if (typeof data === "string") {
    if (data.length > 2 && stringLength(data) > 2) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

