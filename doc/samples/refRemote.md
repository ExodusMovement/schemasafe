# refRemote

## remote ref

### Schema

```json
{ "$ref": "http://localhost:1234/integer.json" }
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

##### Strong mode notices

 * `[requireSchema] $schema is required at http://localhost:1234/integer.json#`


## fragment within remote ref

### Schema

```json
{ "$ref": "http://localhost:1234/subSchemas-defs.json#/$defs/integer" }
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

##### Strong mode notices

 * `[requireSchema] $schema is required at http://localhost:1234/subSchemas-defs.json#`


## ref within remote ref

### Schema

```json
{ "$ref": "http://localhost:1234/subSchemas-defs.json#/$defs/refToInteger" }
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
  "$id": "http://localhost:1234/",
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

 * `[requireSchema] $schema is required at http://localhost:1234/baseUriChange/folderInteger.json#`


## base URI change - change folder

### Schema

```json
{
  "$id": "http://localhost:1234/scope_change_defs1.json",
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

 * `[requireSchema] $schema is required at http://localhost:1234/baseUriChangeFolder/folderInteger.json#`


## base URI change - change folder in subschema

### Schema

```json
{
  "$id": "http://localhost:1234/scope_change_defs2.json",
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

 * `[requireSchema] $schema is required at http://localhost:1234/baseUriChangeFolderInSubschema/folderInteger.json#`


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

 * `[requireSchema] $schema is required at http://localhost:1234/name-defs.json#`


## remote ref with ref to defs

### Schema

```json
{
  "$id": "http://localhost:1234/schema-remote-ref-ref-defs1.json",
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

 * `[requireSchema] $schema is required at http://localhost:1234/ref-and-defs.json#`

