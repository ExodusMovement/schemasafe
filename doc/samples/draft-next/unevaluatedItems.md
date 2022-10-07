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
{ "prefixItems": [{ "type": "string" }], "unevaluatedItems": false }
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


## unevaluatedItems with items

### Schema

```json
{
  "prefixItems": [{ "type": "string" }],
  "items": true,
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
  "prefixItems": [{ "type": "string" }],
  "allOf": [{ "prefixItems": [true, { "type": "number" }] }],
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
      if (evaluatedItem0.includes(j)) continue
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


## unevaluatedItems with nested prefixItems and items

### Schema

```json
{
  "allOf": [{ "prefixItems": [{ "type": "string" }], "items": true }],
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
  "allOf": [
    { "prefixItems": [{ "type": "string" }] },
    { "unevaluatedItems": true }
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
  "prefixItems": [{ "const": "foo" }],
  "anyOf": [
    { "prefixItems": [true, { "const": "bar" }] },
    { "prefixItems": [true, true, { "const": "baz" }] }
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
    for (let i = Math.max(1, ...evaluatedItems0); i < data.length; i++) {
      if (evaluatedItem0.includes(i)) continue
      if (data[i] !== undefined && hasOwn(data, i)) return false
    }
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
  "prefixItems": [{ "const": "foo" }],
  "oneOf": [
    { "prefixItems": [true, { "const": "bar" }] },
    { "prefixItems": [true, { "const": "baz" }] }
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
  "prefixItems": [{ "const": "foo" }],
  "not": { "not": { "prefixItems": [true, { "const": "bar" }] } },
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
  "prefixItems": [{ "const": "foo" }],
  "if": { "prefixItems": [true, { "const": "bar" }] },
  "then": { "prefixItems": [true, true, { "const": "then" }] },
  "else": { "prefixItems": [true, true, true, { "const": "else" }] },
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
    for (let i = Math.max(3, ...evaluatedItems0); i < data.length; i++) {
      if (evaluatedItem0.includes(i)) continue
      if (data[i] !== undefined && hasOwn(data, i)) return false
    }
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
  "prefixItems": [{ "type": "string" }],
  "unevaluatedItems": false,
  "$defs": { "bar": { "prefixItems": [true, { "type": "string" }] } }
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
{ "allOf": [{ "prefixItems": [true] }, { "unevaluatedItems": false }] }
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
    "foo": { "prefixItems": [{ "type": "string" }], "unevaluatedItems": false }
  },
  "anyOf": [
    { "properties": { "foo": { "prefixItems": [true, { "type": "string" }] } } }
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


## unevaluatedItems depends on adjacent contains

### Schema

```json
{
  "prefixItems": [true],
  "contains": { "type": "string" },
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
    let passes0 = 0
    for (let i = 0; i < data.length; i++) {
      const sub0 = (() => {
        if (data[i] !== undefined && hasOwn(data, i)) {
          if (!(typeof data[i] === "string")) return false
        }
        return true
      })()
      if (sub0) {
        passes0++
        evaluatedItem0.push(i)
      }
    }
    if (passes0 < 1) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    let passes1 = 0
    for (const key0 of Object.keys(data)) {
      const sub1 = (() => {
        if (!(typeof data[key0] === "string")) return false
        return true
      })()
      if (sub1) {
        passes1++
        evaluatedProps0[0].push(key0)
      }
    }
    if (passes1 < 1) return false
  }
  if (Array.isArray(data)) {
    for (let j = Math.max(1, ...evaluatedItems0); j < data.length; j++) {
      if (evaluatedItem0.includes(j)) continue
      if (data[j] !== undefined && hasOwn(data, j)) return false
    }
  }
  validate.evaluatedDynamic = [evaluatedItem0, evaluatedItems0, evaluatedProps0]
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/0`


## unevaluatedItems depends on multiple nested contains

### Schema

```json
{
  "allOf": [
    { "contains": { "multipleOf": 2 } },
    { "contains": { "multipleOf": 3 } }
  ],
  "unevaluatedItems": { "multipleOf": 5 }
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
    let passes0 = 0
    for (let i = 0; i < data.length; i++) {
      const sub0 = (() => {
        if (data[i] !== undefined && hasOwn(data, i)) {
          if (typeof data[i] === "number") {
            if (data[i] % 2 !== 0) return false
          }
        }
        return true
      })()
      if (sub0) {
        passes0++
        evaluatedItem0.push(i)
      }
    }
    if (passes0 < 1) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    let passes1 = 0
    for (const key0 of Object.keys(data)) {
      const sub1 = (() => {
        if (typeof data[key0] === "number") {
          if (data[key0] % 2 !== 0) return false
        }
        return true
      })()
      if (sub1) {
        passes1++
        evaluatedProps0[0].push(key0)
      }
    }
    if (passes1 < 1) return false
  }
  if (Array.isArray(data)) {
    let passes2 = 0
    for (let j = 0; j < data.length; j++) {
      const sub2 = (() => {
        if (data[j] !== undefined && hasOwn(data, j)) {
          if (typeof data[j] === "number") {
            if (data[j] % 3 !== 0) return false
          }
        }
        return true
      })()
      if (sub2) {
        passes2++
        evaluatedItem0.push(j)
      }
    }
    if (passes2 < 1) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    let passes3 = 0
    for (const key1 of Object.keys(data)) {
      const sub3 = (() => {
        if (typeof data[key1] === "number") {
          if (data[key1] % 3 !== 0) return false
        }
        return true
      })()
      if (sub3) {
        passes3++
        evaluatedProps0[0].push(key1)
      }
    }
    if (passes3 < 1) return false
  }
  if (Array.isArray(data)) {
    for (let k = Math.max(0, ...evaluatedItems0); k < data.length; k++) {
      if (evaluatedItem0.includes(k)) continue
      if (data[k] !== undefined && hasOwn(data, k)) {
        if (typeof data[k] === "number") {
          if (data[k] % 5 !== 0) return false
        }
      }
    }
  }
  validate.evaluatedDynamic = [evaluatedItem0, evaluatedItems0, evaluatedProps0]
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #/allOf/0/contains`


## unevaluatedItems and contains interact to control item dependency relationship

### Schema

```json
{
  "if": { "contains": { "const": "a" } },
  "then": {
    "if": { "contains": { "const": "b" } },
    "then": { "if": { "contains": { "const": "c" } } }
  },
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
  const sub0 = (() => {
    if (Array.isArray(data)) {
      let passes0 = 0
      for (let i = 0; i < data.length; i++) {
        const sub1 = (() => {
          if (data[i] !== undefined && hasOwn(data, i)) {
            if (!(data[i] === "a")) return false
          }
          return true
        })()
        if (sub1) {
          passes0++
          evaluatedItem0.push(i)
        }
      }
      if (passes0 < 1) return false
    }
    if (typeof data === "object" && data && !Array.isArray(data)) {
      let passes1 = 0
      for (const key0 of Object.keys(data)) {
        const sub2 = (() => {
          if (!(data[key0] === "a")) return false
          return true
        })()
        if (sub2) {
          passes1++
          evaluatedProps0[0].push(key0)
        }
      }
      if (passes1 < 1) return false
    }
    return true
  })()
  if (sub0) {
    const sub3 = (() => {
      if (Array.isArray(data)) {
        let passes2 = 0
        for (let j = 0; j < data.length; j++) {
          const sub4 = (() => {
            if (data[j] !== undefined && hasOwn(data, j)) {
              if (!(data[j] === "b")) return false
            }
            return true
          })()
          if (sub4) {
            passes2++
            evaluatedItem0.push(j)
          }
        }
        if (passes2 < 1) return false
      }
      if (typeof data === "object" && data && !Array.isArray(data)) {
        let passes3 = 0
        for (const key1 of Object.keys(data)) {
          const sub5 = (() => {
            if (!(data[key1] === "b")) return false
            return true
          })()
          if (sub5) {
            passes3++
            evaluatedProps0[0].push(key1)
          }
        }
        if (passes3 < 1) return false
      }
      return true
    })()
    if (sub3) {
      const sub6 = (() => {
        if (Array.isArray(data)) {
          let passes4 = 0
          for (let k = 0; k < data.length; k++) {
            const sub7 = (() => {
              if (data[k] !== undefined && hasOwn(data, k)) {
                if (!(data[k] === "c")) return false
              }
              return true
            })()
            if (sub7) {
              passes4++
              evaluatedItem0.push(k)
            }
          }
          if (passes4 < 1) return false
        }
        if (typeof data === "object" && data && !Array.isArray(data)) {
          let passes5 = 0
          for (const key2 of Object.keys(data)) {
            const sub8 = (() => {
              if (!(data[key2] === "c")) return false
              return true
            })()
            if (sub8) {
              passes5++
              evaluatedProps0[0].push(key2)
            }
          }
          if (passes5 < 1) return false
        }
        return true
      })()
    }
  }
  if (Array.isArray(data)) {
    for (let l = Math.max(0, ...evaluatedItems0); l < data.length; l++) {
      if (evaluatedItem0.includes(l)) continue
      if (data[l] !== undefined && hasOwn(data, l)) return false
    }
  }
  validate.evaluatedDynamic = [evaluatedItem0, evaluatedItems0, evaluatedProps0]
  return true
};
return ref0
```

### Warnings

 * `Unprocessed keywords: ["if"] at #/then/then`


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

