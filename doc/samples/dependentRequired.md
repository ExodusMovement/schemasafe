# dependentRequired

## single dependency

### Schema

```json
{ "dependentRequired": { "bar": ["foo"] } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar") && !(data.foo !== undefined && hasOwn(data, "foo"))) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## empty dependents

### Schema

```json
{ "dependentRequired": { "bar": [] } }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## multiple dependents required

### Schema

```json
{ "dependentRequired": { "quux": ["foo", "bar"] } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.quux !== undefined && hasOwn(data, "quux") && !(data.foo !== undefined && hasOwn(data, "foo") && data.bar !== undefined && hasOwn(data, "bar"))) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## dependencies with escaped characters

### Schema

```json
{ "dependentRequired": { "foo\nbar": ["foo\rbar"], "foo\"bar": ["foo'bar"] } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data["foo\nbar"] !== undefined && hasOwn(data, "foo\nbar") && !(data["foo\rbar"] !== undefined && hasOwn(data, "foo\rbar"))) return false
    if (data["foo\"bar"] !== undefined && hasOwn(data, "foo\"bar") && !(data["foo'bar"] !== undefined && hasOwn(data, "foo'bar"))) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

