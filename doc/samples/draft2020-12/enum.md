# enum

## simple enum validation

### Schema

```json
{ "enum": [1, 2, 3] }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(data === 1 || data === 2 || data === 3)) return false
  return true
};
return ref0
```


## heterogeneous enum validation

### Schema

```json
{ "enum": [6, "foo", [], true, { "foo": 12 }] }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!(data === 6 || data === "foo" || data === true || Array.isArray(data) && data.length === 0 || typeof data === "object" && data && !Array.isArray(data) && Object.keys(data).length === 1 && hasOwn(data, "foo") && data["foo"] === 12)) return false
  return true
};
return ref0
```


## heterogeneous enum-with-null validation

### Schema

```json
{ "enum": [6, null] }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(data === 6 || data === null)) return false
  return true
};
return ref0
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
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(data.foo === "foo")) return false
  }
  if (!(data.bar === "bar")) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] additionalProperties or unevaluatedProperties should be specified at #`


## enum with escaped characters

### Schema

```json
{ "enum": ["foo\nbar", "foo\rbar"] }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(data === "foo\nbar" || data === "foo\rbar")) return false
  return true
};
return ref0
```


## enum with false does not match 0

### Schema

```json
{ "enum": [false] }
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


## enum with true does not match 1

### Schema

```json
{ "enum": [true] }
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


## enum with 0 does not match false

### Schema

```json
{ "enum": [0] }
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


## enum with 1 does not match true

### Schema

```json
{ "enum": [1] }
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


## nul characters in strings

### Schema

```json
{ "enum": ["hello\u0000there"] }
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

