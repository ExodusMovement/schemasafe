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
return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## required default validation

### Schema

```json
{ "properties": { "foo": {} } }
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


## required with empty array

### Schema

```json
{ "properties": { "foo": {} }, "required": [] }
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
return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data["foo\nbar"] !== undefined && hasOwn(data, "foo\nbar"))) return false
    if (!(data["foo\"bar"] !== undefined && hasOwn(data, "foo\"bar"))) return false
    if (!(data["foo\\bar"] !== undefined && hasOwn(data, "foo\\bar"))) return false
    if (!(data["foo\rbar"] !== undefined && hasOwn(data, "foo\rbar"))) return false
    if (!(data["foo\tbar"] !== undefined && hasOwn(data, "foo\tbar"))) return false
    if (!(data["foo\fbar"] !== undefined && hasOwn(data, "foo\fbar"))) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

