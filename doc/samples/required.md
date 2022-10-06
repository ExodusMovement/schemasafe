# required

## required validation

### Schema

```json
{ "properties": { "foo": {}, "bar": {} }, "required": ["foo"] }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] empty rules node is not allowed at #/properties/foo`


## required default validation

### Schema

```json
{ "properties": { "foo": {} } }
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

 * `[requireValidation] empty rules node is not allowed at #/properties/foo`


## required with empty array

### Schema

```json
{ "properties": { "foo": {} }, "required": [] }
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

 * `[requireValidation] empty rules node is not allowed at #/properties/foo`


## required with escaped characters

### Schema

```json
{
  "required": [
    "foo\nbar",
    "foo\"bar",
    "foo\\bar",
    "foo\rbar",
    "foo\tbar",
    "foo\fbar"
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data["foo\nbar"] !== undefined && hasOwn(data, "foo\nbar"))) return false
    if (!(data["foo\"bar"] !== undefined && hasOwn(data, "foo\"bar"))) return false
    if (!(data["foo\\bar"] !== undefined && hasOwn(data, "foo\\bar"))) return false
    if (!(data["foo\rbar"] !== undefined && hasOwn(data, "foo\rbar"))) return false
    if (!(data["foo\tbar"] !== undefined && hasOwn(data, "foo\tbar"))) return false
    if (!(data["foo\fbar"] !== undefined && hasOwn(data, "foo\fbar"))) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## required properties whose names are Javascript object property names

### Schema

```json
{ "required": ["__proto__", "toString", "constructor"] }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data["__proto__"] !== undefined && hasOwn(data, "__proto__"))) return false
    if (!(data.toString !== undefined && hasOwn(data, "toString"))) return false
    if (!(data.constructor !== undefined && hasOwn(data, "constructor"))) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

