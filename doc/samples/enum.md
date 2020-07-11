# enum

## simple enum validation

### Schema

```json
{ "enum": [1, 2, 3] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (!((data === 1) || (data === 2) || (data === 3))) return false
  return true
})
```


## heterogeneous enum validation

### Schema

```json
{ "enum": [6, "foo", [], true, { "foo": 12 }] }
```

### Code

```js
'use strict'
const deepEqual = (obj, obj2) => {
  if (obj === obj2) return true
  if (!obj || !obj2 || typeof obj !== typeof obj2) return false

  const proto = Object.getPrototypeOf(obj)
  if (proto !== Object.getPrototypeOf(obj2)) return false

  if (proto === Array.prototype) {
    if (!Array.isArray(obj) || !Array.isArray(obj2)) return false
    if (obj.length !== obj2.length) return false
    return obj.every((x, i) => deepEqual(x, obj2[i]))
  } else if (proto === Object.prototype) {
    const [keys, keys2] = [Object.keys(obj), Object.keys(obj2)]
    if (keys.length !== keys2.length) return false
    const keyset2 = new Set(keys2)
    return keys.every((key) => keyset2.has(key) && deepEqual(obj[key], obj2[key]))
  }
  return false
};
return (function validate(data, recursive) {
  if (!((data === 6) || (data === "foo") || (data === true) || deepEqual(data, []) || deepEqual(data, {"foo":12}))) return false
  return true
})
```


## heterogeneous enum-with-null validation

### Schema

```json
{ "enum": [6, null] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (!((data === 6) || (data === null))) return false
  return true
})
```


## enums in properties

### Schema

```json
{
  "type": "object",
  "properties": { "foo": { "enum": ["foo"] }, "bar": { "enum": ["bar"] } },
  "required": ["bar"]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
return (function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(data.foo === "foo")) return false
  }
  if (!(data.bar === "bar")) return false
  return true
})
```

##### Strong mode notices

 * `[requireValidation] additionalProperties rule must be specified at #`


## enum with escaped characters

### Schema

```json
{ "enum": ["foo\nbar", "foo\rbar"] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (!((data === "foo\nbar") || (data === "foo\rbar"))) return false
  return true
})
```


## enum with false does not match 0

### Schema

```json
{ "enum": [false] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (!(data === false)) return false
  return true
})
```


## enum with true does not match 1

### Schema

```json
{ "enum": [true] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (!(data === true)) return false
  return true
})
```


## enum with 0 does not match false

### Schema

```json
{ "enum": [0] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (!(data === 0)) return false
  return true
})
```


## enum with 1 does not match true

### Schema

```json
{ "enum": [1] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (!(data === 1)) return false
  return true
})
```


## nul characters in strings

### Schema

```json
{ "enum": ["hello\u0000there"] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (!(data === "hello\u0000there")) return false
  return true
})
```

