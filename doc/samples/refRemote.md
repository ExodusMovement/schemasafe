# refRemote

## remote ref

### Schema

```json
{ "$ref": "http://localhost:1234/integer.json" }
```

### Code

```js
'use strict'
const ref1 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref0 = function validate(data, recursive) {
  if (!ref1(data, recursive)) return false
  return true
};
return ref0
```


## fragment within remote ref

### Schema

```json
{ "$ref": "http://localhost:1234/subSchemas-defs.json#/$defs/integer" }
```

### Code

```js
'use strict'
const ref1 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref0 = function validate(data, recursive) {
  if (!ref1(data, recursive)) return false
  return true
};
return ref0
```


## ref within remote ref

### Schema

```json
{ "$ref": "http://localhost:1234/subSchemas-defs.json#/$defs/refToInteger" }
```

### Code

```js
'use strict'
const ref2 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref1 = function validate(data, recursive) {
  if (!ref2(data, recursive)) return false
  return true
};
const ref0 = function validate(data, recursive) {
  if (!ref1(data, recursive)) return false
  return true
};
return ref0
```


## base URI change

### Schema

```json
{
  "$id": "http://localhost:1234/",
  "items": { "$id": "folder/", "items": { "$ref": "folderInteger.json" } }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref0 = function validate(data, recursive) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined && hasOwn(data, i)) {
        if (Array.isArray(data[i])) {
          for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] !== undefined && hasOwn(data[i], j)) {
              if (!ref1(data[i][j], recursive)) return false
            }
          }
        }
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`


## base URI change - change folder

### Schema

```json
{
  "$id": "http://localhost:1234/scope_change_defs1.json",
  "type": "object",
  "properties": { "list": { "$ref": "folder/" } },
  "$defs": {
    "baz": {
      "$id": "folder/",
      "type": "array",
      "items": { "$ref": "folderInteger.json" }
    }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref2 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref1 = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!ref2(data[i], recursive)) return false
    }
  }
  return true
};
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.list !== undefined && hasOwn(data, "list")) {
    if (!ref1(data.list, recursive)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] additionalProperties or unevaluatedProperties must be specified at #`


## base URI change - change folder in subschema

### Schema

```json
{
  "$id": "http://localhost:1234/scope_change_defs2.json",
  "type": "object",
  "properties": { "list": { "$ref": "folder/#/$defs/bar" } },
  "$defs": {
    "baz": {
      "$id": "folder/",
      "$defs": {
        "bar": { "type": "array", "items": { "$ref": "folderInteger.json" } }
      }
    }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref2 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref1 = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!ref2(data[i], recursive)) return false
    }
  }
  return true
};
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.list !== undefined && hasOwn(data, "list")) {
    if (!ref1(data.list, recursive)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] additionalProperties or unevaluatedProperties must be specified at #`


## root ref in remote ref

### Schema

```json
{
  "$id": "http://localhost:1234/object",
  "type": "object",
  "properties": { "name": { "$ref": "name-defs.json#/$defs/orNull" } }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref2 = function validate(data, recursive) {
  if (!(typeof data === "string")) return false
  return true
};
const ref1 = function validate(data, recursive) {
  const sub0 = (() => {
    if (!(data === null)) return false
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      if (!ref2(data, recursive)) return false
      return true
    })()
    if (!sub1) {
      return false
    }
  }
  return true
};
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.name !== undefined && hasOwn(data, "name")) {
    if (!ref1(data.name, recursive)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema must be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #`

