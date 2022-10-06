# unknownKeyword

## $id inside an unknown keyword is not a real identifier

### Schema

```json
{
  "$defs": {
    "id_in_unknown0": {
      "not": {
        "array_of_schemas": [
          {
            "$id": "https://localhost:1234/draft-next/unknownKeyword/my_identifier.json",
            "type": "null"
          }
        ]
      }
    },
    "real_id_in_schema": {
      "$id": "https://localhost:1234/draft-next/unknownKeyword/my_identifier.json",
      "type": "string"
    },
    "id_in_unknown1": {
      "not": {
        "object_of_schemas": {
          "foo": {
            "$id": "https://localhost:1234/draft-next/unknownKeyword/my_identifier.json",
            "type": "integer"
          }
        }
      }
    }
  },
  "anyOf": [
    { "$ref": "#/$defs/id_in_unknown0" },
    { "$ref": "#/$defs/id_in_unknown1" },
    {
      "$ref": "https://localhost:1234/draft-next/unknownKeyword/my_identifier.json"
    }
  ]
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  const sub1 = (() => {
    return true
  })()
  if (sub1) return false
  return true
};
const ref2 = function validate(data) {
  const sub3 = (() => {
    return true
  })()
  if (sub3) return false
  return true
};
const ref3 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref0 = function validate(data) {
  const sub0 = (() => {
    if (!ref1(data)) return false
    return true
  })()
  if (!sub0) {
    const sub2 = (() => {
      if (!ref2(data)) return false
      return true
    })()
    if (!sub2) {
      const sub4 = (() => {
        if (!ref3(data)) return false
        return true
      })()
      if (!sub4) return false
    }
  }
  return true
};
return ref0
```

### Warnings

 * `Keyword not supported: "array_of_schemas" at #/not`

