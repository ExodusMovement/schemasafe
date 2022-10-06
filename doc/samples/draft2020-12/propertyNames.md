# propertyNames

## propertyNames validation

### Schema

```json
{ "propertyNames": { "maxLength": 3 } }
```

### Code

```js
'use strict'
const stringLength = (string) =>
  /[\uD800-\uDFFF]/.test(string) ? [...string].length : string.length;
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (key0.length > 3 && stringLength(key0) > 3) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/propertyNames`


## propertyNames with boolean schema true

### Schema

```json
{ "propertyNames": true }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/propertyNames`


## propertyNames with boolean schema false

### Schema

```json
{ "propertyNames": false }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

