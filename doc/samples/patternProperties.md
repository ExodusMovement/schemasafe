# patternProperties

## patternProperties validates properties matching a regex

### Schema

```json
{ "patternProperties": { "f.*o": { "type": "integer" } } }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("f.*o", "u");
const validate = function validate(data, recursive) {
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
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## multiple simultaneous patternProperties are validated

### Schema

```json
{
  "patternProperties": {
    "a*": { "type": "integer" },
    "aaa*": { "maximum": 20 }
  }
}
```

### Code

```js
'use strict'
const pattern0 = new RegExp("a*", "u");
const pattern1 = new RegExp("aaa*", "u");
const validate = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (pattern0.test(key0)) {
        if (data[key0] !== undefined) {
          if (!(Number.isInteger(data[key0]))) return false
        }
      }
      if (pattern1.test(key0)) {
        if (data[key0] !== undefined) {
          if (typeof data[key0] === "number") {
            if (!(20 >= data[key0])) return false
          }
        }
      }
    }
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## regexes are not anchored by default and are case sensitive

### Schema

```json
{
  "patternProperties": {
    "[0-9]{2,}": { "type": "boolean" },
    "X_": { "type": "string" }
  }
}
```

### Code

```js
'use strict'
const pattern0 = new RegExp("[0-9]{2,}", "u");
const pattern1 = new RegExp("X_", "u");
const validate = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (pattern0.test(key0)) {
        if (data[key0] !== undefined) {
          if (!(typeof data[key0] === "boolean")) return false
        }
      }
      if (pattern1.test(key0)) {
        if (data[key0] !== undefined) {
          if (!(typeof data[key0] === "string")) return false
        }
      }
    }
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## patternProperties with boolean schemas

### Schema

```json
{ "patternProperties": { "f.*": true, "b.*": false } }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("f.*", "u");
const pattern1 = new RegExp("b.*", "u");
const validate = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (pattern1.test(key0)) {
        if (data[key0] !== undefined) return false
      }
    }
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

