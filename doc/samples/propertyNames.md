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
return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (key0.length > 3 && stringLength(key0) > 3) return false
    }
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## propertyNames with boolean schema true

### Schema

```json
{ "propertyNames": true }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## propertyNames with boolean schema false

### Schema

```json
{ "propertyNames": false }
```

### Code

```js
'use strict'
const pointerPart = (s) => (/~\//.test(s) ? `${s}`.replace(/~/g, '~0').replace(/\//g, '~1') : s);
return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      return false
    }
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

