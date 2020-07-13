# unevaluatedProperties

## unevaluatedProperties true

### Schema

```json
{ "type": "object", "unevaluatedProperties": true }
```

### Code

```js
'use strict'
const validate = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] additionalProperties rule must be specified at #`


## unevaluatedProperties schema

### Schema

```json
{
  "type": "object",
  "unevaluatedProperties": { "type": "string", "minLength": 3 }
}
```

### Code

```js
'use strict'
const stringLength = (string) =>
  /[\uD800-\uDFFF]/.test(string) ? [...string].length : string.length;
const validate = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  for (const key0 of Object.keys(data)) {
    if (data[key0] !== undefined) {
      if (!(typeof data[key0] === "string")) return false
      if (data[key0].length < 3 || stringLength(data[key0]) < 3) return false
    }
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] additionalProperties rule must be specified at #`


## unevaluatedProperties false

### Schema

```json
{ "type": "object", "unevaluatedProperties": false }
```

### Code

```js
'use strict'
const validate = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  for (const key0 of Object.keys(data)) {
    if (data[key0] !== undefined) return false
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] additionalProperties rule must be specified at #`


## unevaluatedProperties with adjacent properties

### Schema

```json
{
  "type": "object",
  "properties": { "foo": { "type": "string" } },
  "unevaluatedProperties": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const validate = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  for (const key0 of Object.keys(data)) {
    if (key0 !== "foo") {
      if (data[key0] !== undefined) return false
    }
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema must be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


## unevaluatedProperties with adjacent patternProperties

### Schema

```json
{
  "type": "object",
  "patternProperties": { "^foo": { "type": "string" } },
  "unevaluatedProperties": false
}
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^foo", "u");
const validate = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  for (const key0 of Object.keys(data)) {
    if (pattern0.test(key0)) {
      if (data[key0] !== undefined) {
        if (!(typeof data[key0] === "string")) return false
      }
    }
  }
  for (const key1 of Object.keys(data)) {
    if (!pattern0.test(key1)) {
      if (data[key1] !== undefined) return false
    }
  }
  return true
};
return validate
```

##### Strong mode notices

 * `Should start with ^ and end with $: "^foo" at #`


## unevaluatedProperties with adjacent additionalProperties

### Schema

```json
{
  "type": "object",
  "properties": { "foo": { "type": "string" } },
  "additionalProperties": true,
  "unevaluatedProperties": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const validate = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema must be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


## unevaluatedProperties with nested properties

### Schema

```json
{
  "type": "object",
  "properties": { "foo": { "type": "string" } },
  "allOf": [{ "properties": { "bar": { "type": "string" } } }],
  "unevaluatedProperties": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const validate = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  if (data.bar !== undefined && hasOwn(data, "bar")) {
    if (!(typeof data.bar === "string")) return false
  }
  for (const key0 of Object.keys(data)) {
    if (key0 !== "foo" && key0 !== "bar") {
      if (data[key0] !== undefined) return false
    }
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema must be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


## unevaluatedProperties with nested patternProperties

### Schema

```json
{
  "type": "object",
  "properties": { "foo": { "type": "string" } },
  "allOf": [{ "patternProperties": { "^bar": { "type": "string" } } }],
  "unevaluatedProperties": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const pattern0 = new RegExp("^bar", "u");
const validate = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  for (const key0 of Object.keys(data)) {
    if (pattern0.test(key0)) {
      if (data[key0] !== undefined) {
        if (!(typeof data[key0] === "string")) return false
      }
    }
  }
  for (const key1 of Object.keys(data)) {
    if (key1 !== "foo" && !pattern0.test(key1)) {
      if (data[key1] !== undefined) return false
    }
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema must be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


## unevaluatedProperties with nested additionalProperties

### Schema

```json
{
  "type": "object",
  "properties": { "foo": { "type": "string" } },
  "allOf": [{ "additionalProperties": true }],
  "unevaluatedProperties": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const validate = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema must be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


## unevaluatedProperties with nested unevaluatedProperties

### Schema

```json
{
  "type": "object",
  "properties": { "foo": { "type": "string" } },
  "allOf": [{ "unevaluatedProperties": true }],
  "unevaluatedProperties": { "type": "string", "maxLength": 2 }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const validate = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  return true
};
return validate
```

### Warnings

 * `Unprocessed keywords: ["unevaluatedProperties"] at #`


## unevaluatedProperties with anyOf

### Schema

```json
{
  "type": "object",
  "properties": { "foo": { "type": "string" } },
  "anyOf": [
    { "properties": { "bar": { "const": "bar" } }, "required": ["bar"] },
    { "properties": { "baz": { "const": "baz" } }, "required": ["baz"] },
    { "properties": { "quux": { "const": "quux" } }, "required": ["quux"] }
  ],
  "unevaluatedProperties": false
}
```

### Code

**FAILED TO COMPILE**

### Errors

 * `Dynamic unevaluated is not implemented`


## unevaluatedProperties with oneOf

### Schema

```json
{
  "type": "object",
  "properties": { "foo": { "type": "string" } },
  "oneOf": [
    { "properties": { "bar": { "const": "bar" } }, "required": ["bar"] },
    { "properties": { "baz": { "const": "baz" } }, "required": ["baz"] }
  ],
  "unevaluatedProperties": false
}
```

### Code

**FAILED TO COMPILE**

### Errors

 * `Dynamic unevaluated is not implemented`


## unevaluatedProperties with not

### Schema

```json
{
  "type": "object",
  "properties": { "foo": { "type": "string" } },
  "not": {
    "not": { "properties": { "bar": { "const": "bar" } }, "required": ["bar"] }
  },
  "unevaluatedProperties": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const validate = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  const sub0 = (() => {
    const sub1 = (() => {
      if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
      if (!(data.bar === "bar")) return false
      return true
    })()
    if (sub1) return false
    return true
  })()
  if (sub0) return false
  for (const key0 of Object.keys(data)) {
    if (key0 !== "foo") {
      if (data[key0] !== undefined) return false
    }
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema must be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


## unevaluatedProperties with if/then/else

### Schema

```json
{
  "type": "object",
  "if": { "properties": { "foo": { "const": "then" } }, "required": ["foo"] },
  "then": {
    "properties": { "bar": { "type": "string" } },
    "required": ["bar"]
  },
  "else": {
    "properties": { "baz": { "type": "string" } },
    "required": ["baz"]
  },
  "unevaluatedProperties": false
}
```

### Code

**FAILED TO COMPILE**

### Errors

 * `Dynamic unevaluated is not implemented`


## unevaluatedProperties with dependentSchemas

### Schema

```json
{
  "type": "object",
  "properties": { "foo": { "type": "string" } },
  "dependentSchemas": {
    "foo": { "properties": { "bar": { "const": "bar" } }, "required": ["bar"] }
  },
  "unevaluatedProperties": false
}
```

### Code

**FAILED TO COMPILE**

### Errors

 * `Dynamic unevaluated is not implemented`


## unevaluatedProperties with boolean schemas

### Schema

```json
{
  "type": "object",
  "properties": { "foo": { "type": "string" } },
  "allOf": [true],
  "unevaluatedProperties": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const validate = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  for (const key0 of Object.keys(data)) {
    if (key0 !== "foo") {
      if (data[key0] !== undefined) return false
    }
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema must be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


## unevaluatedProperties with $ref

### Schema

```json
{
  "type": "object",
  "$ref": "#/$defs/bar",
  "properties": { "foo": { "type": "string" } },
  "unevaluatedProperties": false,
  "$defs": { "bar": { "properties": { "bar": { "type": "string" } } } }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!(typeof data.bar === "string")) return false
    }
  }
  return true
};
const validate = function validate(data, recursive) {
  if (!ref0(data, recursive)) return false
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  for (const key0 of Object.keys(data)) {
    if (key0 !== "bar" && key0 !== "foo") {
      if (data[key0] !== undefined) return false
    }
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## unevaluatedProperties can't see inside cousins

### Schema

```json
{
  "allOf": [
    { "properties": { "foo": true } },
    { "unevaluatedProperties": false }
  ]
}
```

### Code

```js
'use strict'
const validate = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (data[key0] !== undefined) return false
    }
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #/allOf/0`

