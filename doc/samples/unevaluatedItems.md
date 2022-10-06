# unevaluatedItems

## unevaluatedItems true

### Schema

```json
{ "unevaluatedItems": true }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/unevaluatedItems`


## unevaluatedItems false

### Schema

```json
{ "unevaluatedItems": false }
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

 * `[requireValidation] type should be specified at #`


## unevaluatedItems as schema

### Schema

```json
{ "unevaluatedItems": { "type": "string" } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined && hasOwn(data, i)) {
        if (!(typeof data[i] === "string")) return false
      }
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
{ "items": { "type": "string" }, "unevaluatedItems": false }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined && hasOwn(data, i)) {
        if (!(typeof data[i] === "string")) return false
      }
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
{ "items": [{ "type": "string" }], "unevaluatedItems": false }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(typeof data[0] === "string")) return false
    }
  }
  if (Array.isArray(data)) {
    if (data.length > 1) return false
  }
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
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(typeof data[0] === "string")) return false
    }
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
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(typeof data[0] === "string")) return false
    }
  }
  if (Array.isArray(data)) {
    if (data[1] !== undefined && hasOwn(data, 1)) {
      if (!(typeof data[1] === "number")) return false
    }
  }
  if (Array.isArray(data)) {
    if (data.length > 2) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/0`


## unevaluatedItems with nested items

### Schema

```json
{
  "unevaluatedItems": { "type": "boolean" },
  "anyOf": [{ "items": { "type": "string" } }, true]
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
  const sub0 = (() => {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        if (data[i] !== undefined && hasOwn(data, i)) {
          if (!(typeof data[i] === "string")) return false
        }
      }
    }
    return true
  })()
  if (sub0) evaluatedItems0.push(Infinity)
  if (Array.isArray(data)) {
    for (let j = Math.max(0, ...evaluatedItems0); j < data.length; j++) {
      if (data[j] !== undefined && hasOwn(data, j)) {
        if (!(typeof data[j] === "boolean")) return false
      }
    }
  }
  return true
};
return ref0
```

### Warnings

 * `some checks are never reachable at #/unevaluatedItems`


## unevaluatedItems with nested items and additionalItems

### Schema

```json
{
  "allOf": [{ "items": [{ "type": "string" }], "additionalItems": true }],
  "unevaluatedItems": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(typeof data[0] === "string")) return false
    }
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
  "allOf": [{ "items": [{ "type": "string" }] }, { "unevaluatedItems": true }],
  "unevaluatedItems": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(typeof data[0] === "string")) return false
    }
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
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(data[0] === "foo")) return false
    }
  }
  const sub0 = (() => {
    if (Array.isArray(data)) {
      if (data[1] !== undefined && hasOwn(data, 1)) {
        if (!(data[1] === "bar")) return false
      }
    }
    return true
  })()
  const sub1 = (() => {
    if (Array.isArray(data)) {
      if (data[2] !== undefined && hasOwn(data, 2)) {
        if (!(data[2] === "baz")) return false
      }
    }
    return true
  })()
  if (!(sub0 || sub1)) return false
  if (sub0) evaluatedItems0.push(2)
  if (sub1) evaluatedItems0.push(3)
  if (Array.isArray(data)) {
    if (data.length > Math.max(1, ...evaluatedItems0)) return false
  }
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
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(data[0] === "foo")) return false
    }
  }
  let passes0 = 0
  const sub0 = (() => {
    if (Array.isArray(data)) {
      if (data[1] !== undefined && hasOwn(data, 1)) {
        if (!(data[1] === "bar")) return false
      }
    }
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    if (Array.isArray(data)) {
      if (data[1] !== undefined && hasOwn(data, 1)) {
        if (!(data[1] === "baz")) return false
      }
    }
    return true
  })()
  if (sub1) passes0++
  if (passes0 !== 1) return false
  if (Array.isArray(data)) {
    if (data.length > 2) return false
  }
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
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(data[0] === "foo")) return false
    }
  }
  const sub0 = (() => {
    const sub1 = (() => {
      if (Array.isArray(data)) {
        if (data[1] !== undefined && hasOwn(data, 1)) {
          if (!(data[1] === "bar")) return false
        }
      }
      return true
    })()
    if (sub1) return false
    return true
  })()
  if (sub0) return false
  if (Array.isArray(data)) {
    if (data.length > 1) return false
  }
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
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(data[0] === "foo")) return false
    }
  }
  const sub0 = (() => {
    if (Array.isArray(data)) {
      if (data[1] !== undefined && hasOwn(data, 1)) {
        if (!(data[1] === "bar")) return false
      }
    }
    return true
  })()
  if (sub0) {
    if (Array.isArray(data)) {
      if (data[2] !== undefined && hasOwn(data, 2)) {
        if (!(data[2] === "then")) return false
      }
    }
    evaluatedItems0.push(3)
  }
  else {
    if (Array.isArray(data)) {
      if (data[3] !== undefined && hasOwn(data, 3)) {
        if (!(data[3] === "else")) return false
      }
    }
    evaluatedItems0.push(4)
  }
  if (Array.isArray(data)) {
    if (data.length > Math.max(3, ...evaluatedItems0)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/if/0`


## unevaluatedItems with boolean schemas

### Schema

```json
{ "allOf": [true], "unevaluatedItems": false }
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

 * `[requireValidation] schema = true is not allowed at #/allOf/0`


## unevaluatedItems with $ref

### Schema

```json
{
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
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(typeof data[0] === "string")) return false
    }
  }
  if (Array.isArray(data)) {
    if (data.length > 2) return false
  }
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
  "properties": {
    "foo": { "items": [{ "type": "string" }], "unevaluatedItems": false }
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
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (Array.isArray(data.foo)) {
        if (data.foo[0] !== undefined && hasOwn(data.foo, 0)) {
          if (!(typeof data.foo[0] === "string")) return false
        }
      }
      if (Array.isArray(data.foo)) {
        if (data.foo.length > 1) return false
      }
    }
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (Array.isArray(data.foo)) {
        if (data.foo[1] !== undefined && hasOwn(data.foo, 1)) {
          if (!(typeof data.foo[1] === "string")) return false
        }
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo/0`


## non-array instances are valid

### Schema

```json
{ "unevaluatedItems": false }
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

 * `[requireValidation] type should be specified at #`


## unevaluatedItems with null instance elements

### Schema

```json
{ "unevaluatedItems": { "type": "null" } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined && hasOwn(data, i)) {
        if (!(data[i] === null)) return false
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

