# anchor

## Location-independent identifier

### Schema

```json
{ "$ref": "#foo", "$defs": { "A": { "$anchor": "foo", "type": "integer" } } }
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


## Location-independent identifier with absolute URI

### Schema

```json
{
  "$ref": "http://localhost:1234/bar#foo",
  "$defs": {
    "A": {
      "$id": "http://localhost:1234/bar",
      "$anchor": "foo",
      "type": "integer"
    }
  }
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


## Location-independent identifier with base URI change in subschema

### Schema

```json
{
  "$id": "http://localhost:1234/root",
  "$ref": "http://localhost:1234/nested.json#foo",
  "$defs": {
    "A": {
      "$id": "nested.json",
      "$defs": { "B": { "$anchor": "foo", "type": "integer" } }
    }
  }
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


## $anchor inside an enum is not a real identifier

### Schema

```json
{
  "$defs": {
    "anchor_in_enum": { "enum": [{ "$anchor": "my_anchor", "type": "null" }] },
    "real_identifier_in_schema": { "$anchor": "my_anchor", "type": "string" },
    "zzz_anchor_in_const": {
      "const": { "$anchor": "my_anchor", "type": "null" }
    }
  },
  "anyOf": [{ "$ref": "#/$defs/anchor_in_enum" }, { "$ref": "#my_anchor" }]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data) && Object.keys(data).length === 2 && hasOwn(data, "$anchor") && hasOwn(data, "type") && data["$anchor"] === "my_anchor" && data["type"] === "null")) return false
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


## same $anchor with different base uri

### Schema

```json
{
  "$id": "http://localhost:1234/foobar",
  "$defs": {
    "A": {
      "$id": "child1",
      "allOf": [
        { "$id": "child2", "$anchor": "my_anchor", "type": "number" },
        { "$anchor": "my_anchor", "type": "string" }
      ]
    }
  },
  "$ref": "child1#my_anchor"
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at http://localhost:1234/child1#`

