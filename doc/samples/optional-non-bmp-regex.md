# optional/non-bmp-regex

## Proper UTF-16 surrogate pair handling: pattern

### Schema

```json
{ "pattern": "^🐲*$" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^🐲*$", "u");
return (function validate(data, recursive) {
  if (typeof data === "string") {
    if (!pattern0.test(data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## Proper UTF-16 surrogate pair handling: patternProperties

### Schema

```json
{ "patternProperties": { "^🐲*$": { "type": "integer" } } }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^🐲*$", "u");
return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (pattern0.test(key0)) {
        if (data[key0] !== undefined) {
          if (!(Number.isInteger(data[key0]))) return false
        }
      }
    }
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

