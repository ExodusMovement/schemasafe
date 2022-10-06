# const

## const validation

### Schema

```json
{ "const": 2 }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(data === 2)) return false
  return true
};
return ref0
```


## const with object

### Schema

```json
{ "const": { "foo": "bar", "baz": "bax" } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data) && Object.keys(data).length === 2 && hasOwn(data, "foo") && hasOwn(data, "baz") && data["foo"] === "bar" && data["baz"] === "bax")) return false
  return true
};
return ref0
```


## const with array

### Schema

```json
{ "const": [{ "foo": "bar" }] }
```

### Code

```js
'use strict'
const deepEqual = (obj, obj2) => {
  if (obj === obj2) return true
  if (!obj || !obj2 || typeof obj !== typeof obj2) return false
  if (obj !== obj2 && typeof obj !== 'object') return false

  const proto = Object.getPrototypeOf(obj)
  if (proto !== Object.getPrototypeOf(obj2)) return false

  if (proto === Array.prototype) {
    if (!Array.isArray(obj) || !Array.isArray(obj2)) return false
    if (obj.length !== obj2.length) return false
    return obj.every((x, i) => deepEqual(x, obj2[i]))
  } else if (proto === Object.prototype) {
    const [keys, keys2] = [Object.keys(obj), Object.keys(obj2)]
    if (keys.length !== keys2.length) return false
    const keyset2 = new Set([...keys, ...keys2])
    return keyset2.size === keys.length && keys.every((key) => deepEqual(obj[key], obj2[key]))
  }
  return false
};
const ref0 = function validate(data) {
  if (!(Array.isArray(data) && deepEqual(data, [{"foo":"bar"}]))) return false
  return true
};
return ref0
```


## const with null

### Schema

```json
{ "const": null }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(data === null)) return false
  return true
};
return ref0
```


## const with false does not match 0

### Schema

```json
{ "const": false }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(data === false)) return false
  return true
};
return ref0
```


## const with true does not match 1

### Schema

```json
{ "const": true }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(data === true)) return false
  return true
};
return ref0
```


## const with [false] does not match [0]

### Schema

```json
{ "const": [false] }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(Array.isArray(data) && data.length === 1 && data[0] === false)) return false
  return true
};
return ref0
```


## const with [true] does not match [1]

### Schema

```json
{ "const": [true] }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(Array.isArray(data) && data.length === 1 && data[0] === true)) return false
  return true
};
return ref0
```


## const with {"a": false} does not match {"a": 0}

### Schema

```json
{ "const": { "a": false } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data) && Object.keys(data).length === 1 && hasOwn(data, "a") && data["a"] === false)) return false
  return true
};
return ref0
```


## const with {"a": true} does not match {"a": 1}

### Schema

```json
{ "const": { "a": true } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data) && Object.keys(data).length === 1 && hasOwn(data, "a") && data["a"] === true)) return false
  return true
};
return ref0
```


## const with 0 does not match other zero-like types

### Schema

```json
{ "const": 0 }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(data === 0)) return false
  return true
};
return ref0
```


## const with 1 does not match true

### Schema

```json
{ "const": 1 }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(data === 1)) return false
  return true
};
return ref0
```


## const with -2.0 matches integer and float types

### Schema

```json
{ "const": -2 }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(data === -2)) return false
  return true
};
return ref0
```


## float and integers are equal up to 64-bit representation limits

### Schema

```json
{ "const": 9007199254740992 }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(data === 9007199254740992)) return false
  return true
};
return ref0
```


## nul characters in strings

### Schema

```json
{ "const": "hello\u0000there" }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(data === "hello\u0000there")) return false
  return true
};
return ref0
```

