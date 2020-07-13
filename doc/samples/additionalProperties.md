# additionalProperties

## additionalProperties being false does not allow other properties

### Schema

```json
{
  "properties": { "foo": {}, "bar": {} },
  "patternProperties": { "^v": {} },
  "additionalProperties": false
}
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key1 of Object.keys(data)) {
      if (key1 !== "foo" && key1 !== "bar" && !(key1.startsWith("v"))) {
        if (data[key1] !== undefined) return false
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## non-ASCII pattern with additionalProperties

### Schema

```json
{ "patternProperties": { "^á": {} }, "additionalProperties": false }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key1 of Object.keys(data)) {
      if (!(key1.startsWith("á"))) {
        if (data[key1] !== undefined) return false
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## additionalProperties allows a schema which should validate

### Schema

```json
{
  "properties": { "foo": {}, "bar": {} },
  "additionalProperties": { "type": "boolean" }
}
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (key0 !== "foo" && key0 !== "bar") {
        if (data[key0] !== undefined) {
          if (!(typeof data[key0] === "boolean")) return false
        }
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## additionalProperties can exist by itself

### Schema

```json
{ "additionalProperties": { "type": "boolean" } }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (data[key0] !== undefined) {
        if (!(typeof data[key0] === "boolean")) return false
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## additionalProperties are allowed by default

### Schema

```json
{ "properties": { "foo": {}, "bar": {} } }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## additionalProperties should not look in applicators

### Schema

```json
{
  "allOf": [{ "properties": { "foo": {} } }],
  "additionalProperties": { "type": "boolean" }
}
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (data[key0] !== undefined) {
        if (!(typeof data[key0] === "boolean")) return false
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] wild-card additionalProperties requires propertyNames at #`
