# dependentSchemas

## single dependency

### Schema

```json
{
  "dependentSchemas": {
    "bar": {
      "properties": {
        "foo": { "type": "integer" },
        "bar": { "type": "integer" }
      }
    }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (typeof data === "object" && data && !Array.isArray(data)) {
        if (data.foo !== undefined && hasOwn(data, "foo")) {
          if (!Number.isInteger(data.foo)) return false
        }
        if (data.bar !== undefined && hasOwn(data, "bar")) {
          if (!Number.isInteger(data.bar)) return false
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


## boolean subschemas

### Schema

```json
{ "dependentSchemas": { "foo": true, "bar": false } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`


## dependencies with escaped characters

### Schema

```json
{
  "dependentSchemas": {
    "foo\tbar": { "minProperties": 4 },
    "foo'bar": { "required": ["foo\"bar"] }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data["foo\tbar"] !== undefined && hasOwn(data, "foo\tbar")) {
      if (typeof data === "object" && data && !Array.isArray(data)) {
        if (Object.keys(data).length < 4) return false
      }
    }
    if (data["foo'bar"] !== undefined && hasOwn(data, "foo'bar")) {
      if (typeof data === "object" && data && !Array.isArray(data)) {
        if (!(data["foo\"bar"] !== undefined && hasOwn(data, "foo\"bar"))) return false
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`

