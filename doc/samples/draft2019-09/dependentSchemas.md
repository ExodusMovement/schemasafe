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
const ref0 = function validate(data) {
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

 * `[requireValidation] if properties is used, required should be specified at #/dependentSchemas/bar`


## boolean subschemas

### Schema

```json
{ "dependentSchemas": { "foo": true, "bar": false } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/dependentSchemas/foo`


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
const ref0 = function validate(data) {
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

 * `[requireValidation] type should be specified at #`


## dependent subschema incompatible with root

### Schema

```json
{
  "properties": { "foo": {} },
  "dependentSchemas": {
    "foo": { "properties": { "bar": {} }, "additionalProperties": false }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (typeof data === "object" && data && !Array.isArray(data)) {
        for (const key0 of Object.keys(data)) {
          if (key0 !== "bar") return false
        }
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] empty rules node is not allowed at #/dependentSchemas/foo/properties/bar`

