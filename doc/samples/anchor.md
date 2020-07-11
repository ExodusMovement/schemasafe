# anchor

## Location-independent identifier

### Schema

```json
{ "$ref": "#foo", "$defs": { "A": { "$anchor": "foo", "type": "integer" } } }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  return true
};
return (function validate(data, recursive) {
  if (!ref0(data, recursive)) return false
  return true
})
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
const ref0 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  return true
};
return (function validate(data, recursive) {
  if (!ref0(data, recursive)) return false
  return true
})
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
const ref0 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  return true
};
return (function validate(data, recursive) {
  if (!ref0(data, recursive)) return false
  return true
})
```

