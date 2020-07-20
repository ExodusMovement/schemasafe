# properties

## object properties validation

### Schema

```json
{ "properties": { "foo": { "type": "integer" }, "bar": { "type": "string" } } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!Number.isInteger(data.foo)) return false
    }
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!(typeof data.bar === "string")) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/bar`


## properties, patternProperties, additionalProperties interaction

### Schema

```json
{
  "properties": {
    "foo": { "type": "array", "maxItems": 3 },
    "bar": { "type": "array" }
  },
  "patternProperties": { "f.o": { "minItems": 2 } },
  "additionalProperties": { "type": "integer" }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const pattern0 = new RegExp("f.o", "u");
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!Array.isArray(data.foo)) return false
      if (data.foo.length > 3) return false
    }
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!Array.isArray(data.bar)) return false
    }
    for (const key0 of Object.keys(data)) {
      if (pattern0.test(key0)) {
        if (Array.isArray(data[key0])) {
          if (data[key0].length < 2) return false
        }
      }
    }
    for (const key1 of Object.keys(data)) {
      if (key1 !== "foo" && key1 !== "bar" && !pattern0.test(key1)) {
        if (!(Number.isInteger(data[key1]))) return false
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] items rule should be specified at #/properties/foo`


## properties with boolean schema

### Schema

```json
{ "properties": { "foo": true, "bar": false } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/properties/foo`


## properties with escaped characters

### Schema

```json
{
  "properties": {
    "foo\nbar": { "type": "number" },
    "foo\"bar": { "type": "number" },
    "foo\\bar": { "type": "number" },
    "foo\rbar": { "type": "number" },
    "foo\tbar": { "type": "number" },
    "foo\fbar": { "type": "number" }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data["foo\nbar"] !== undefined && hasOwn(data, "foo\nbar")) {
      if (!(typeof data["foo\nbar"] === "number")) return false
    }
    if (data["foo\"bar"] !== undefined && hasOwn(data, "foo\"bar")) {
      if (!(typeof data["foo\"bar"] === "number")) return false
    }
    if (data["foo\\bar"] !== undefined && hasOwn(data, "foo\\bar")) {
      if (!(typeof data["foo\\bar"] === "number")) return false
    }
    if (data["foo\rbar"] !== undefined && hasOwn(data, "foo\rbar")) {
      if (!(typeof data["foo\rbar"] === "number")) return false
    }
    if (data["foo\tbar"] !== undefined && hasOwn(data, "foo\tbar")) {
      if (!(typeof data["foo\tbar"] === "number")) return false
    }
    if (data["foo\fbar"] !== undefined && hasOwn(data, "foo\fbar")) {
      if (!(typeof data["foo\fbar"] === "number")) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

