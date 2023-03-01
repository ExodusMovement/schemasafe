# unevaluatedProperties

## unevaluatedProperties true

### Schema

```json
{ "type": "object", "unevaluatedProperties": true }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
  validate.evaluatedDynamic = null
  const evaluatedItem0 = []
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
const ref0 = function validate(data) {
  validate.evaluatedDynamic = null
  const evaluatedItem0 = []
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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
  validate.evaluatedDynamic = null
  const evaluatedItem0 = []
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


## unevaluatedProperties with if/then/else, then not defined

### Schema

```json
{
  "type": "object",
  "if": { "properties": { "foo": { "const": "then" } }, "required": ["foo"] },
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
const ref0 = function validate(data) {
  validate.evaluatedDynamic = null
  const evaluatedItem0 = []
  const evaluatedItems0 = [0]
  const evaluatedProps0 = [[], []]
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  const sub0 = (() => {
    if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
    if (!(data.foo === "then")) return false
    return true
  })()
  if (!sub0) {
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

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/else/properties/baz`


## unevaluatedProperties with if/then/else, else not defined

### Schema

```json
{
  "type": "object",
  "if": { "properties": { "foo": { "const": "then" } }, "required": ["foo"] },
  "then": {
    "properties": { "bar": { "type": "string" } },
    "required": ["bar"]
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
const ref0 = function validate(data) {
  validate.evaluatedDynamic = null
  const evaluatedItem0 = []
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
const ref0 = function validate(data) {
  validate.evaluatedDynamic = null
  const evaluatedItem0 = []
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
const ref0 = function validate(data) {
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
const ref1 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!(typeof data.bar === "string")) return false
    }
  }
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
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
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/allOf/0/properties/foo`


## unevaluatedProperties can't see inside cousins (reverse order)

### Schema

```json
{
  "allOf": [
    { "unevaluatedProperties": false },
    { "properties": { "foo": true } }
  ]
}
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/allOf/1/properties/foo`


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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
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


## property is evaluated in an uncle schema to unevaluatedProperties

### Schema

```json
{
  "type": "object",
  "properties": {
    "foo": {
      "type": "object",
      "properties": { "bar": { "type": "string" } },
      "unevaluatedProperties": false
    }
  },
  "anyOf": [
    {
      "properties": { "foo": { "properties": { "faz": { "type": "string" } } } }
    }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(typeof data.foo === "object" && data.foo && !Array.isArray(data.foo))) return false
    if (data.foo.bar !== undefined && hasOwn(data.foo, "bar")) {
      if (!(typeof data.foo.bar === "string")) return false
    }
    for (const key0 of Object.keys(data.foo)) {
      if (key0 !== "bar") return false
    }
  }
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (typeof data.foo === "object" && data.foo && !Array.isArray(data.foo)) {
      if (data.foo.faz !== undefined && hasOwn(data.foo, "faz")) {
        if (!(typeof data.foo.faz === "string")) return false
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo/properties/bar`


## in-place applicator siblings, allOf has unevaluated

### Schema

```json
{
  "type": "object",
  "allOf": [{ "properties": { "foo": true }, "unevaluatedProperties": false }],
  "anyOf": [{ "properties": { "bar": true } }]
}
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  for (const key0 of Object.keys(data)) {
    if (key0 !== "foo") return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/allOf/0/properties/foo`


## in-place applicator siblings, anyOf has unevaluated

### Schema

```json
{
  "type": "object",
  "allOf": [{ "properties": { "foo": true } }],
  "anyOf": [{ "properties": { "bar": true }, "unevaluatedProperties": false }]
}
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  for (const key0 of Object.keys(data)) {
    if (key0 !== "bar") return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/allOf/0/properties/foo`


## unevaluatedProperties + single cyclic ref

### Schema

```json
{
  "type": "object",
  "properties": { "x": { "$ref": "#" } },
  "unevaluatedProperties": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.x !== undefined && hasOwn(data, "x")) {
    if (!validate(data.x)) return false
  }
  for (const key0 of Object.keys(data)) {
    if (key0 !== "x") return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] if properties is used, required should be specified at #`


## unevaluatedProperties + ref inside allOf / oneOf

### Schema

```json
{
  "$defs": {
    "one": { "properties": { "a": true } },
    "two": { "required": ["x"], "properties": { "x": true } }
  },
  "allOf": [
    { "$ref": "#/$defs/one" },
    { "properties": { "b": true } },
    {
      "oneOf": [
        { "$ref": "#/$defs/two" },
        { "required": ["y"], "properties": { "y": true } }
      ]
    }
  ],
  "unevaluatedProperties": false
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  validate.evaluatedDynamic = null
  const evaluatedItem1 = []
  const evaluatedItems1 = [0]
  const evaluatedProps1 = [[], []]
  return true
};
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref2 = function validate(data) {
  validate.evaluatedDynamic = null
  const evaluatedItem2 = []
  const evaluatedItems2 = [0]
  const evaluatedProps2 = [[], []]
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data.x !== undefined && hasOwn(data, "x"))) return false
  }
  return true
};
const propertyIn = (key, [properties, patterns]) =>
  properties.includes(true) ||
  properties.some((prop) => prop === key) ||
  patterns.some((pattern) => new RegExp(pattern, 'u').test(key));
const ref0 = function validate(data) {
  validate.evaluatedDynamic = null
  const evaluatedItem0 = []
  const evaluatedItems0 = [0]
  const evaluatedProps0 = [[], []]
  const res0 = ref1(data)
  if (!res0) return false
  let passes0 = 0
  const sub0 = (() => {
    const res1 = ref2(data)
    if (!res1) return false
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.y !== undefined && hasOwn(data, "y"))) return false
    }
    return true
  })()
  if (sub1) passes0++
  if (passes0 !== 1) return false
  if (sub0) evaluatedProps0[0].push(...["x"])
  if (sub1) evaluatedProps0[0].push(...["y"])
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (key0 !== "a" && key0 !== "b" && !propertyIn(key0, evaluatedProps0)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/properties/a`


## dynamic evalation inside nested refs

### Schema

```json
{
  "$defs": {
    "one": {
      "oneOf": [
        { "$ref": "#/$defs/two" },
        { "required": ["b"], "properties": { "b": true } },
        { "required": ["xx"], "patternProperties": { "x": true } },
        { "required": ["all"], "unevaluatedProperties": true }
      ]
    },
    "two": {
      "oneOf": [
        { "required": ["c"], "properties": { "c": true } },
        { "required": ["d"], "properties": { "d": true } }
      ]
    }
  },
  "oneOf": [
    { "$ref": "#/$defs/one" },
    { "required": ["a"], "properties": { "a": true } }
  ],
  "unevaluatedProperties": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref2 = function validate(data) {
  validate.evaluatedDynamic = null
  const evaluatedItem2 = []
  const evaluatedItems2 = [0]
  const evaluatedProps2 = [[], []]
  let passes2 = 0
  const sub2 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.c !== undefined && hasOwn(data, "c"))) return false
    }
    return true
  })()
  if (sub2) passes2++
  const sub3 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.d !== undefined && hasOwn(data, "d"))) return false
    }
    return true
  })()
  if (sub3) passes2++
  if (passes2 !== 1) return false
  if (sub2) evaluatedProps2[0].push(...["c"])
  if (sub3) evaluatedProps2[0].push(...["d"])
  validate.evaluatedDynamic = [evaluatedItem2, evaluatedItems2, evaluatedProps2]
  return true
};
const ref1 = function validate(data) {
  validate.evaluatedDynamic = null
  const evaluatedItem1 = []
  const evaluatedItems1 = [0]
  const evaluatedProps1 = [[], []]
  let passes1 = 0
  const sub1 = (() => {
    const res0 = ref2(data)
    if (!res0) return false
    if (res0) {
      evaluatedProps1[0].push(...ref2.evaluatedDynamic[2][0])
      evaluatedProps1[1].push(...ref2.evaluatedDynamic[2][1])
    }
    return true
  })()
  if (sub1) passes1++
  const sub4 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.b !== undefined && hasOwn(data, "b"))) return false
    }
    return true
  })()
  if (sub4) passes1++
  if (passes1 > 1) return false
  const sub5 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.xx !== undefined && hasOwn(data, "xx"))) return false
    }
    return true
  })()
  if (sub5) passes1++
  if (passes1 > 1) return false
  const sub6 = (() => {
    const evaluatedProps3 = [[], []]
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.all !== undefined && hasOwn(data, "all"))) return false
    }
    return true
  })()
  if (sub6) passes1++
  if (passes1 !== 1) return false
  if (sub4) evaluatedProps1[0].push(...["b"])
  if (sub5) evaluatedProps1[1].push(...["x"])
  if (sub6) evaluatedProps1[0].push(true)
  validate.evaluatedDynamic = [evaluatedItem1, evaluatedItems1, evaluatedProps1]
  return true
};
const propertyIn = (key, [properties, patterns]) =>
  properties.includes(true) ||
  properties.some((prop) => prop === key) ||
  patterns.some((pattern) => new RegExp(pattern, 'u').test(key));
const ref0 = function validate(data) {
  validate.evaluatedDynamic = null
  const evaluatedItem0 = []
  const evaluatedItems0 = [0]
  const evaluatedProps0 = [[], []]
  let passes0 = 0
  const sub0 = (() => {
    const res1 = ref1(data)
    if (!res1) return false
    if (res1) {
      evaluatedProps0[0].push(...ref1.evaluatedDynamic[2][0])
      evaluatedProps0[1].push(...ref1.evaluatedDynamic[2][1])
    }
    return true
  })()
  if (sub0) passes0++
  const sub7 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.a !== undefined && hasOwn(data, "a"))) return false
    }
    return true
  })()
  if (sub7) passes0++
  if (passes0 !== 1) return false
  if (sub7) evaluatedProps0[0].push(...["a"])
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key2 of Object.keys(data)) {
      if (true && !propertyIn(key2, evaluatedProps0)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/oneOf/0/properties/c`


## non-object instances are valid

### Schema

```json
{ "unevaluatedProperties": false }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## unevaluatedProperties with null valued instance properties

### Schema

```json
{ "unevaluatedProperties": { "type": "null" } }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (!(data[key0] === null)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

