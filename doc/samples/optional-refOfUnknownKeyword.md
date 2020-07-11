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
const ref0 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  return true
};
return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!ref0(data.bar, recursive)) return false
    }
  }
  return true
})
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
const ref0 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  return true
};
return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
    }
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!ref0(data.bar, recursive)) return false
    }
  }
  return true
})
```

### Warnings

 * `Keyword not supported: "unknown-keyword" at #/properties/foo`

