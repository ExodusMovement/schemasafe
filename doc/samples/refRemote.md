# refRemote

## remote ref

### Schema

```json
{ "$ref": "http://localhost:1234/draft2019-09/integer.json" }
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```


## fragment within remote ref

### Schema

```json
{
  "$ref": "http://localhost:1234/draft2019-09/subSchemas-defs.json#/$defs/integer"
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```


## ref within remote ref

### Schema

```json
{
  "$ref": "http://localhost:1234/draft2019-09/subSchemas-defs.json#/$defs/refToInteger"
}
```

### Code

```js
'use strict'
const ref2 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref1 = function validate(data) {
  if (!ref2(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```


## base URI change

### Schema

```json
{
  "$id": "http://localhost:1234/draft2019-09/",
  "items": {
    "$id": "baseUriChange/",
    "items": { "$ref": "folderInteger.json" }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined && hasOwn(data, i)) {
        if (Array.isArray(data[i])) {
          for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] !== undefined && hasOwn(data[i], j)) {
              if (!ref1(data[i][j])) return false
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

 * `[requireValidation] type should be specified at #/items`


## base URI change - change folder

### Schema

```json
{
  "$id": "http://localhost:1234/draft2019-09/scope_change_defs1.json",
  "type": "object",
  "properties": { "list": { "$ref": "baseUriChangeFolder/" } },
  "$defs": {
    "baz": {
      "$id": "baseUriChangeFolder/",
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
const ref2 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref1 = function validate(data) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!ref2(data[i])) return false
    }
  }
  return true
};
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.list !== undefined && hasOwn(data, "list")) {
    if (!ref1(data.list)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] additionalProperties or unevaluatedProperties should be specified at #`


## base URI change - change folder in subschema

### Schema

```json
{
  "$id": "http://localhost:1234/draft2019-09/scope_change_defs2.json",
  "type": "object",
  "properties": {
    "list": { "$ref": "baseUriChangeFolderInSubschema/#/$defs/bar" }
  },
  "$defs": {
    "baz": {
      "$id": "baseUriChangeFolderInSubschema/",
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
const ref2 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref1 = function validate(data) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!ref2(data[i])) return false
    }
  }
  return true
};
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.list !== undefined && hasOwn(data, "list")) {
    if (!ref1(data.list)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] additionalProperties or unevaluatedProperties should be specified at #`


## root ref in remote ref

### Schema

```json
{
  "$id": "http://localhost:1234/draft2019-09/object",
  "type": "object",
  "properties": { "name": { "$ref": "name-defs.json#/$defs/orNull" } }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref2 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref1 = function validate(data) {
  const sub0 = (() => {
    if (!(data === null)) return false
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      if (!ref2(data)) return false
      return true
    })()
    if (!sub1) return false
  }
  return true
};
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.name !== undefined && hasOwn(data, "name")) {
    if (!ref1(data.name)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #`


## remote ref with ref to defs

### Schema

```json
{
  "$id": "http://localhost:1234/draft2019-09/schema-remote-ref-ref-defs1.json",
  "$ref": "ref-and-defs.json"
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref2 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!(typeof data.bar === "string")) return false
    }
  }
  return true
};
const ref1 = function validate(data) {
  if (!ref2(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at http://localhost:1234/draft2019-09/ref-and-defs.json#/properties/bar`


## Location-independent identifier in remote ref

### Schema

```json
{
  "$ref": "http://localhost:1234/draft2019-09/locationIndependentIdentifier.json#/$defs/refToInteger"
}
```

### Code

```js
'use strict'
const ref2 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref1 = function validate(data) {
  if (!ref2(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```


## retrieved nested refs resolve relative to their URI not $id

### Schema

```json
{
  "$id": "http://localhost:1234/draft2019-09/some-id",
  "properties": { "name": { "$ref": "nested/foo-ref-string.json" } }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref2 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref1 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!ref2(data.foo)) return false
  }
  return true
};
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.name !== undefined && hasOwn(data, "name")) {
      if (!ref1(data.name)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at http://localhost:1234/draft2019-09/nested/string.json#`


## remote HTTP ref with different $id

### Schema

```json
{ "$ref": "http://localhost:1234/different-id-ref-string.json" }
```

### Code

```js
'use strict'
const ref2 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref1 = function validate(data) {
  if (!ref2(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireSchema] $schema is required at http://localhost:1234/different-id-ref-string.json#`


## remote HTTP ref with different URN $id

### Schema

```json
{ "$ref": "http://localhost:1234/urn-ref-string.json" }
```

### Code

```js
'use strict'
const ref2 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref1 = function validate(data) {
  if (!ref2(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireSchema] $schema is required at http://localhost:1234/urn-ref-string.json#`


## remote HTTP ref with nested absolute ref

### Schema

```json
{ "$ref": "http://localhost:1234/nested-absolute-ref-to-string.json" }
```

### Code

```js
'use strict'
const ref2 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref1 = function validate(data) {
  if (!ref2(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireSchema] $schema is required at http://localhost:1234/nested-absolute-ref-to-string.json#`

