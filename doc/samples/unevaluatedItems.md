# unevaluatedItems

## unevaluatedItems true

### Schema

```json
{ "type": "array", "unevaluatedItems": true }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!Array.isArray(data)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/unevaluatedItems`


## unevaluatedItems false

### Schema

```json
{ "type": "array", "unevaluatedItems": false }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!Array.isArray(data)) return false
  if (data.length > 0) return false
  return true
};
return ref0
```


## unevaluatedItems as schema

### Schema

```json
{ "type": "array", "unevaluatedItems": { "type": "string" } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!(typeof data[i] === "string")) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/unevaluatedItems`


## unevaluatedItems with uniform items

### Schema

```json
{ "type": "array", "items": { "type": "string" }, "unevaluatedItems": false }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!(typeof data[i] === "string")) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/items`


## unevaluatedItems with tuple

### Schema

```json
{ "type": "array", "items": [{ "type": "string" }], "unevaluatedItems": false }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!Array.isArray(data)) return false
  if (data[0] !== undefined && hasOwn(data, 0)) {
    if (!(typeof data[0] === "string")) return false
  }
  if (data.length > 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/0`


## unevaluatedItems with additionalItems

### Schema

```json
{
  "type": "array",
  "items": [{ "type": "string" }],
  "additionalItems": true,
  "unevaluatedItems": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!Array.isArray(data)) return false
  if (data[0] !== undefined && hasOwn(data, 0)) {
    if (!(typeof data[0] === "string")) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/0`


## unevaluatedItems with nested tuple

### Schema

```json
{
  "type": "array",
  "items": [{ "type": "string" }],
  "allOf": [{ "items": [true, { "type": "number" }] }],
  "unevaluatedItems": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!Array.isArray(data)) return false
  if (data[0] !== undefined && hasOwn(data, 0)) {
    if (!(typeof data[0] === "string")) return false
  }
  if (data[1] !== undefined && hasOwn(data, 1)) {
    if (!(typeof data[1] === "number")) return false
  }
  if (data.length > 2) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/0`


## unevaluatedItems with nested additionalItems

### Schema

```json
{
  "type": "array",
  "allOf": [{ "items": [{ "type": "string" }], "additionalItems": true }],
  "unevaluatedItems": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!Array.isArray(data)) return false
  if (data[0] !== undefined && hasOwn(data, 0)) {
    if (!(typeof data[0] === "string")) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/allOf/0/0`


## unevaluatedItems with nested unevaluatedItems

### Schema

```json
{
  "type": "array",
  "allOf": [{ "items": [{ "type": "string" }] }, { "unevaluatedItems": true }],
  "unevaluatedItems": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!Array.isArray(data)) return false
  if (data[0] !== undefined && hasOwn(data, 0)) {
    if (!(typeof data[0] === "string")) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/allOf/0/0`


## unevaluatedItems with anyOf

### Schema

```json
{
  "type": "array",
  "items": [{ "const": "foo" }],
  "anyOf": [
    { "items": [true, { "const": "bar" }] },
    { "items": [true, true, { "const": "baz" }] }
  ],
  "unevaluatedItems": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  validate.evaluatedDynamic = null
  const evaluatedItem0 = []
  const evaluatedItems0 = [0]
  const evaluatedProps0 = [[], []]
  if (!Array.isArray(data)) return false
  if (data[0] !== undefined && hasOwn(data, 0)) {
    if (!(data[0] === "foo")) return false
  }
  const sub0 = (() => {
    if (data[1] !== undefined && hasOwn(data, 1)) {
      if (!(data[1] === "bar")) return false
    }
    return true
  })()
  const sub1 = (() => {
    if (data[2] !== undefined && hasOwn(data, 2)) {
      if (!(data[2] === "baz")) return false
    }
    return true
  })()
  if (!(sub0 || sub1)) return false
  if (sub0) evaluatedItems0.push(2)
  if (sub1) evaluatedItems0.push(3)
  if (data.length > Math.max(1, ...evaluatedItems0)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/anyOf/0/0`


## unevaluatedItems with oneOf

### Schema

```json
{
  "type": "array",
  "items": [{ "const": "foo" }],
  "oneOf": [
    { "items": [true, { "const": "bar" }] },
    { "items": [true, { "const": "baz" }] }
  ],
  "unevaluatedItems": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!Array.isArray(data)) return false
  if (data[0] !== undefined && hasOwn(data, 0)) {
    if (!(data[0] === "foo")) return false
  }
  let passes0 = 0
  const sub0 = (() => {
    if (data[1] !== undefined && hasOwn(data, 1)) {
      if (!(data[1] === "bar")) return false
    }
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    if (data[1] !== undefined && hasOwn(data, 1)) {
      if (!(data[1] === "baz")) return false
    }
    return true
  })()
  if (sub1) passes0++
  if (passes0 !== 1) return false
  if (data.length > 2) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/oneOf/0/0`


## unevaluatedItems with not

### Schema

```json
{
  "type": "array",
  "items": [{ "const": "foo" }],
  "not": { "not": { "items": [true, { "const": "bar" }] } },
  "unevaluatedItems": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!Array.isArray(data)) return false
  if (data[0] !== undefined && hasOwn(data, 0)) {
    if (!(data[0] === "foo")) return false
  }
  const sub0 = (() => {
    const sub1 = (() => {
      if (data[1] !== undefined && hasOwn(data, 1)) {
        if (!(data[1] === "bar")) return false
      }
      return true
    })()
    if (sub1) return false
    return true
  })()
  if (sub0) return false
  if (data.length > 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/not/not/0`


## unevaluatedItems with if/then/else

### Schema

```json
{
  "type": "array",
  "items": [{ "const": "foo" }],
  "if": { "items": [true, { "const": "bar" }] },
  "then": { "items": [true, true, { "const": "then" }] },
  "else": { "items": [true, true, true, { "const": "else" }] },
  "unevaluatedItems": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  validate.evaluatedDynamic = null
  const evaluatedItem0 = []
  const evaluatedItems0 = [0]
  const evaluatedProps0 = [[], []]
  if (!Array.isArray(data)) return false
  if (data[0] !== undefined && hasOwn(data, 0)) {
    if (!(data[0] === "foo")) return false
  }
  const sub0 = (() => {
    if (data[1] !== undefined && hasOwn(data, 1)) {
      if (!(data[1] === "bar")) return false
    }
    return true
  })()
  if (sub0) {
    if (data[2] !== undefined && hasOwn(data, 2)) {
      if (!(data[2] === "then")) return false
    }
    evaluatedItems0.push(3)
  }
  else {
    if (data[3] !== undefined && hasOwn(data, 3)) {
      if (!(data[3] === "else")) return false
    }
    evaluatedItems0.push(4)
  }
  if (data.length > Math.max(3, ...evaluatedItems0)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/if/0`


## unevaluatedItems with boolean schemas

### Schema

```json
{ "type": "array", "allOf": [true], "unevaluatedItems": false }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!Array.isArray(data)) return false
  if (data.length > 0) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/allOf/0`


## unevaluatedItems with $ref

### Schema

```json
{
  "type": "array",
  "$ref": "#/$defs/bar",
  "items": [{ "type": "string" }],
  "unevaluatedItems": false,
  "$defs": { "bar": { "items": [true, { "type": "string" }] } }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (Array.isArray(data)) {
    if (data[1] !== undefined && hasOwn(data, 1)) {
      if (!(typeof data[1] === "string")) return false
    }
  }
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  if (!Array.isArray(data)) return false
  if (data[0] !== undefined && hasOwn(data, 0)) {
    if (!(typeof data[0] === "string")) return false
  }
  if (data.length > 2) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/0`


## unevaluatedItems can't see inside cousins

### Schema

```json
{ "allOf": [{ "items": [true] }, { "unevaluatedItems": false }] }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    if (data.length > 0) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/allOf/0/0`


## item is evaluated in an uncle schema to unevaluatedItems

### Schema

```json
{
  "type": "object",
  "properties": {
    "foo": {
      "type": "array",
      "items": [{ "type": "string" }],
      "unevaluatedItems": false
    }
  },
  "anyOf": [
    { "properties": { "foo": { "items": [true, { "type": "string" }] } } }
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
    if (!Array.isArray(data.foo)) return false
    if (data.foo[0] !== undefined && hasOwn(data.foo, 0)) {
      if (!(typeof data.foo[0] === "string")) return false
    }
    if (data.foo.length > 1) return false
  }
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (Array.isArray(data.foo)) {
      if (data.foo[1] !== undefined && hasOwn(data.foo, 1)) {
        if (!(typeof data.foo[1] === "string")) return false
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo/0`

