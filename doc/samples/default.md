# default

## invalid type for default

### Schema

```json
{ "properties": { "foo": { "type": "integer", "default": [] } } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!(Number.isInteger(data.foo))) return false
    }
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## invalid string value for default

### Schema

```json
{
  "properties": {
    "bar": { "type": "string", "minLength": 4, "default": "bad" }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const stringLength = (string) =>
  /[\uD800-\uDFFF]/.test(string) ? [...string].length : string.length;
return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!(typeof data.bar === "string")) return false
      if (data.bar.length < 4 || stringLength(data.bar) < 4) return false
    }
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

