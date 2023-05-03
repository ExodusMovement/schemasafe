# id

## id inside an enum is not a real identifier

### Schema

```json
{
  "definitions": {
    "id_in_enum": {
      "enum": [
        {
          "$id": "https://localhost:1234/id/my_identifier.json",
          "type": "null"
        }
      ]
    },
    "real_id_in_schema": {
      "$id": "https://localhost:1234/id/my_identifier.json",
      "type": "string"
    },
    "zzz_id_in_const": {
      "const": {
        "$id": "https://localhost:1234/id/my_identifier.json",
        "type": "null"
      }
    }
  },
  "anyOf": [
    { "$ref": "#/definitions/id_in_enum" },
    { "$ref": "https://localhost:1234/id/my_identifier.json" }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data) && Object.keys(data).length === 2 && hasOwn(data, "$id") && hasOwn(data, "type") && data["$id"] === "https://localhost:1234/id/my_identifier.json" && data["type"] === "null")) return false
  return true
};
const ref2 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref0 = function validate(data) {
  const sub0 = (() => {
    if (!ref1(data)) return false
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
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at https://localhost:1234/id/my_identifier.json#`


## non-schema object containing a plain-name $id property

### Schema

```json
{
  "definitions": {
    "const_not_anchor": { "const": { "$id": "#not_a_real_anchor" } }
  },
  "oneOf": [
    { "const": "skip not_a_real_anchor" },
    {
      "allOf": [
        { "not": { "const": "skip not_a_real_anchor" } },
        { "$ref": "#/definitions/const_not_anchor" }
      ]
    }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data) && Object.keys(data).length === 1 && hasOwn(data, "$id") && data["$id"] === "#not_a_real_anchor")) return false
  return true
};
const ref0 = function validate(data) {
  let passes0 = 0
  const sub0 = (() => {
    if (!(data === "skip not_a_real_anchor")) return false
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    const sub2 = (() => {
      if (!(data === "skip not_a_real_anchor")) return false
      return true
    })()
    if (sub2) return false
    if (!ref1(data)) return false
    return true
  })()
  if (sub1) passes0++
  if (passes0 !== 1) return false
  return true
};
return ref0
```


## non-schema object containing an $id property

### Schema

```json
{
  "definitions": { "const_not_id": { "const": { "$id": "not_a_real_id" } } },
  "oneOf": [
    { "const": "skip not_a_real_id" },
    {
      "allOf": [
        { "not": { "const": "skip not_a_real_id" } },
        { "$ref": "#/definitions/const_not_id" }
      ]
    }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data) && Object.keys(data).length === 1 && hasOwn(data, "$id") && data["$id"] === "not_a_real_id")) return false
  return true
};
const ref0 = function validate(data) {
  let passes0 = 0
  const sub0 = (() => {
    if (!(data === "skip not_a_real_id")) return false
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    const sub2 = (() => {
      if (!(data === "skip not_a_real_id")) return false
      return true
    })()
    if (sub2) return false
    if (!ref1(data)) return false
    return true
  })()
  if (sub1) passes0++
  if (passes0 !== 1) return false
  return true
};
return ref0
```

