# id

## id inside an enum is not a real identifier

### Schema

```json
{
  "definitions": {
    "id_in_enum": {
      "enum": [
        { "id": "https://localhost:1234/my_identifier.json", "type": "null" }
      ]
    },
    "real_id_in_schema": {
      "id": "https://localhost:1234/my_identifier.json",
      "type": "string"
    },
    "zzz_id_in_const": {
      "const": {
        "id": "https://localhost:1234/my_identifier.json",
        "type": "null"
      }
    }
  },
  "anyOf": [
    { "$ref": "#/definitions/id_in_enum" },
    { "$ref": "https://localhost:1234/my_identifier.json" }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data) && Object.keys(data).length === 2 && hasOwn(data, "id") && hasOwn(data, "type") && data["id"] === "https://localhost:1234/my_identifier.json" && data["type"] === "null")) return false
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

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #`

