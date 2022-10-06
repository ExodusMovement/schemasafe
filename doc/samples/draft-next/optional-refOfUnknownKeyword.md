# optional/refOfUnknownKeyword

## reference of a root arbitrary keyword 

### Schema

```json
{
  "unknown-keyword": { "type": "integer" },
  "properties": { "bar": { "$ref": "#/unknown-keyword" } }
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
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!ref1(data.bar)) return false
    }
  }
  return true
};
return ref0
```

### Warnings

 * `Keyword not supported: "unknown-keyword" at #`


## reference of an arbitrary keyword of a sub-schema

### Schema

```json
{
  "properties": {
    "foo": { "unknown-keyword": { "type": "integer" } },
    "bar": { "$ref": "#/properties/foo/unknown-keyword" }
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
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!ref1(data.bar)) return false
    }
  }
  return true
};
return ref0
```

### Warnings

 * `Keyword not supported: "unknown-keyword" at #/properties/foo`

