# uniqueItems

## uniqueItems validation

### Schema

```json
{ "uniqueItems": true }
```

### Code

```js
'use strict'
const unique = (array) => {
  const objects = []
  const primitives = array.length > 20 ? new Set() : null
  let primitivesCount = 0
  let pos = 0
  for (const item of array) {
    if (typeof item === 'object') {
      objects.push(item)
    } else if (primitives) {
      primitives.add(item)
      if (primitives.size !== ++primitivesCount) return false
    } else {
      if (array.indexOf(item, pos + 1) !== -1) return false
    }
    pos++
  }
  for (let i = 1; i < objects.length; i++)
    for (let j = 0; j < i; j++) if (deepEqual(objects[i], objects[j])) return false
  return true
};
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
    const keyset2 = new Set([...keys, ...keys2])
    return keyset2.size === keys.length && keys.every((key) => deepEqual(obj[key], obj2[key]))
  }
  return false
};
const ref0 = function validate(data, recursive) {
  if (Array.isArray(data)) {
    if (!unique(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`


## uniqueItems with an array of items

### Schema

```json
{ "items": [{ "type": "boolean" }, { "type": "boolean" }], "uniqueItems": true }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const unique = (array) => {
  const objects = []
  const primitives = array.length > 20 ? new Set() : null
  let primitivesCount = 0
  let pos = 0
  for (const item of array) {
    if (typeof item === 'object') {
      objects.push(item)
    } else if (primitives) {
      primitives.add(item)
      if (primitives.size !== ++primitivesCount) return false
    } else {
      if (array.indexOf(item, pos + 1) !== -1) return false
    }
    pos++
  }
  for (let i = 1; i < objects.length; i++)
    for (let j = 0; j < i; j++) if (deepEqual(objects[i], objects[j])) return false
  return true
};
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
    const keyset2 = new Set([...keys, ...keys2])
    return keyset2.size === keys.length && keys.every((key) => deepEqual(obj[key], obj2[key]))
  }
  return false
};
const ref0 = function validate(data, recursive) {
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(typeof data[0] === "boolean")) return false
    }
    if (data[1] !== undefined && hasOwn(data, 1)) {
      if (!(typeof data[1] === "boolean")) return false
    }
    if (!unique(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`


## uniqueItems with an array of items and additionalItems=false

### Schema

```json
{
  "items": [{ "type": "boolean" }, { "type": "boolean" }],
  "uniqueItems": true,
  "additionalItems": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const unique = (array) => {
  const objects = []
  const primitives = array.length > 20 ? new Set() : null
  let primitivesCount = 0
  let pos = 0
  for (const item of array) {
    if (typeof item === 'object') {
      objects.push(item)
    } else if (primitives) {
      primitives.add(item)
      if (primitives.size !== ++primitivesCount) return false
    } else {
      if (array.indexOf(item, pos + 1) !== -1) return false
    }
    pos++
  }
  for (let i = 1; i < objects.length; i++)
    for (let j = 0; j < i; j++) if (deepEqual(objects[i], objects[j])) return false
  return true
};
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
    const keyset2 = new Set([...keys, ...keys2])
    return keyset2.size === keys.length && keys.every((key) => deepEqual(obj[key], obj2[key]))
  }
  return false
};
const ref0 = function validate(data, recursive) {
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(typeof data[0] === "boolean")) return false
    }
    if (data[1] !== undefined && hasOwn(data, 1)) {
      if (!(typeof data[1] === "boolean")) return false
    }
    if (data.length > 2) return false
    if (!unique(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`


## uniqueItems=false validation

### Schema

```json
{ "uniqueItems": false }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`


## uniqueItems=false with an array of items

### Schema

```json
{
  "items": [{ "type": "boolean" }, { "type": "boolean" }],
  "uniqueItems": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(typeof data[0] === "boolean")) return false
    }
    if (data[1] !== undefined && hasOwn(data, 1)) {
      if (!(typeof data[1] === "boolean")) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`


## uniqueItems=false with an array of items and additionalItems=false

### Schema

```json
{
  "items": [{ "type": "boolean" }, { "type": "boolean" }],
  "uniqueItems": false,
  "additionalItems": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(typeof data[0] === "boolean")) return false
    }
    if (data[1] !== undefined && hasOwn(data, 1)) {
      if (!(typeof data[1] === "boolean")) return false
    }
    if (data.length > 2) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`

