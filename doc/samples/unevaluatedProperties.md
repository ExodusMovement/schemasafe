# unevaluatedProperties

## unevaluatedProperties true

### Schema

```json
{ "type": "object", "unevaluatedProperties": true }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/unevaluatedProperties`


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
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  for (const key0 of Object.keys(data)) {
    if (!(typeof data[key0] === "string")) return false
    if (data[key0].length < 3 || stringLength(data[key0]) < 3) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/unevaluatedProperties`


## unevaluatedProperties false

### Schema

```json
{ "type": "object", "unevaluatedProperties": false }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  for (const key0 of Object.keys(data)) return false
  return true
};
return ref0
```


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
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  for (const key0 of Object.keys(data)) {
    if (key0 !== "foo") return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


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
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  for (const key0 of Object.keys(data)) {
    if (key0.startsWith("foo")) {
      if (!(typeof data[key0] === "string")) return false
    }
  }
  for (const key1 of Object.keys(data)) {
    if (!(key1.startsWith("foo"))) return false
  }
  return true
};
return ref0
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
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


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
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  if (data.bar !== undefined && hasOwn(data, "bar")) {
    if (!(typeof data.bar === "string")) return false
  }
  for (const key0 of Object.keys(data)) {
    if (key0 !== "bar" && key0 !== "foo") return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


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
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  for (const key0 of Object.keys(data)) {
    if (key0.startsWith("bar")) {
      if (!(typeof data[key0] === "string")) return false
    }
  }
  for (const key1 of Object.keys(data)) {
    if (key1 !== "foo" && !(key1.startsWith("bar"))) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


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
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


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
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  return true
};
return ref0
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

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const propertyIn = (key, [properties, patterns]) =>
  properties.includes(true) ||
  properties.some((prop) => prop === key) ||
  patterns.some((pattern) => new RegExp(pattern, 'u').test(key));
const ref0 = function validate(data, recursive) {
  validate.evaluatedDynamic = null
  const evaluatedItems0 = [0]
  const evaluatedProps0 = [[], []]
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  const sub0 = (() => {
    if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
    if (!(data.bar === "bar")) return false
    return true
  })()
  const sub1 = (() => {
    if (!(data.baz !== undefined && hasOwn(data, "baz"))) return false
    if (!(data.baz === "baz")) return false
    return true
  })()
  const sub2 = (() => {
    if (!(data.quux !== undefined && hasOwn(data, "quux"))) return false
    if (!(data.quux === "quux")) return false
    return true
  })()
  if (!(sub0 || sub1 || sub2)) return false
  if (sub0) evaluatedProps0[0].push(...["bar"])
  if (sub1) evaluatedProps0[0].push(...["baz"])
  if (sub2) evaluatedProps0[0].push(...["quux"])
  for (const key0 of Object.keys(data)) {
    if (key0 !== "foo" && !propertyIn(key0, evaluatedProps0)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


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

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const propertyIn = (key, [properties, patterns]) =>
  properties.includes(true) ||
  properties.some((prop) => prop === key) ||
  patterns.some((pattern) => new RegExp(pattern, 'u').test(key));
const ref0 = function validate(data, recursive) {
  validate.evaluatedDynamic = null
  const evaluatedItems0 = [0]
  const evaluatedProps0 = [[], []]
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  let passes0 = 0
  const sub0 = (() => {
    if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
    if (!(data.bar === "bar")) return false
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    if (!(data.baz !== undefined && hasOwn(data, "baz"))) return false
    if (!(data.baz === "baz")) return false
    return true
  })()
  if (sub1) passes0++
  if (passes0 !== 1) return false
  if (sub0) evaluatedProps0[0].push(...["bar"])
  if (sub1) evaluatedProps0[0].push(...["baz"])
  for (const key0 of Object.keys(data)) {
    if (key0 !== "foo" && !propertyIn(key0, evaluatedProps0)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


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
const ref0 = function validate(data, recursive) {
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
    if (key0 !== "foo") return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


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

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const propertyIn = (key, [properties, patterns]) =>
  properties.includes(true) ||
  properties.some((prop) => prop === key) ||
  patterns.some((pattern) => new RegExp(pattern, 'u').test(key));
const ref0 = function validate(data, recursive) {
  validate.evaluatedDynamic = null
  const evaluatedItems0 = [0]
  const evaluatedProps0 = [[], []]
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  const sub0 = (() => {
    if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
    if (!(data.foo === "then")) return false
    return true
  })()
  if (sub0) {
    if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
    if (!(typeof data.bar === "string")) return false
    evaluatedProps0[0].push(...["bar","foo"])
  }
  else {
    if (!(data.baz !== undefined && hasOwn(data, "baz"))) return false
    if (!(typeof data.baz === "string")) return false
    evaluatedProps0[0].push(...["baz"])
  }
  for (const key0 of Object.keys(data)) {
    if (true && !propertyIn(key0, evaluatedProps0)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/then/properties/bar`


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

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const propertyIn = (key, [properties, patterns]) =>
  properties.includes(true) ||
  properties.some((prop) => prop === key) ||
  patterns.some((pattern) => new RegExp(pattern, 'u').test(key));
const ref0 = function validate(data, recursive) {
  validate.evaluatedDynamic = null
  const evaluatedItems0 = [0]
  const evaluatedProps0 = [[], []]
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
    if (!(data.bar === "bar")) return false
    evaluatedProps0[0].push(...["bar"])
  }
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  for (const key0 of Object.keys(data)) {
    if (key0 !== "foo" && !propertyIn(key0, evaluatedProps0)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


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
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  for (const key0 of Object.keys(data)) {
    if (key0 !== "foo") return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


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
const ref1 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!(typeof data.bar === "string")) return false
    }
  }
  return true
};
const ref0 = function validate(data, recursive) {
  if (!ref1(data, recursive)) return false
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  for (const key0 of Object.keys(data)) {
    if (key0 !== "bar" && key0 !== "foo") return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/bar`


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
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/allOf/0/properties/foo`


## nested unevaluatedProperties, outer false, inner true, properties outside

### Schema

```json
{
  "type": "object",
  "properties": { "foo": { "type": "string" } },
  "allOf": [{ "unevaluatedProperties": true }],
  "unevaluatedProperties": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


## nested unevaluatedProperties, outer false, inner true, properties inside

### Schema

```json
{
  "type": "object",
  "allOf": [
    {
      "properties": { "foo": { "type": "string" } },
      "unevaluatedProperties": true
    }
  ],
  "unevaluatedProperties": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/allOf/0/properties/foo`


## nested unevaluatedProperties, outer true, inner false, properties outside

### Schema

```json
{
  "type": "object",
  "properties": { "foo": { "type": "string" } },
  "allOf": [{ "unevaluatedProperties": false }],
  "unevaluatedProperties": true
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  for (const key0 of Object.keys(data)) return false
  return true
};
return ref0
```

### Warnings

 * `Unprocessed keywords: ["unevaluatedProperties"] at #`


## nested unevaluatedProperties, outer true, inner false, properties inside

### Schema

```json
{
  "type": "object",
  "allOf": [
    {
      "properties": { "foo": { "type": "string" } },
      "unevaluatedProperties": false
    }
  ],
  "unevaluatedProperties": true
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  for (const key0 of Object.keys(data)) {
    if (key0 !== "foo") return false
  }
  return true
};
return ref0
```

### Warnings

 * `Unprocessed keywords: ["unevaluatedProperties"] at #`


## cousin unevaluatedProperties, true and false, true with properties

### Schema

```json
{
  "type": "object",
  "allOf": [
    {
      "properties": { "foo": { "type": "string" } },
      "unevaluatedProperties": true
    },
    { "unevaluatedProperties": false }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  for (const key1 of Object.keys(data)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/allOf/0/properties/foo`


## cousin unevaluatedProperties, true and false, false with properties

### Schema

```json
{
  "type": "object",
  "allOf": [
    { "unevaluatedProperties": true },
    {
      "properties": { "foo": { "type": "string" } },
      "unevaluatedProperties": false
    }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "string")) return false
  }
  for (const key1 of Object.keys(data)) {
    if (key1 !== "foo") return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/allOf/0/unevaluatedProperties`

