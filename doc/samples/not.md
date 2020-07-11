# not

## not

### Schema

```json
{ "not": { "type": "integer" } }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  const sub0 = (() => {
    if (!Number.isInteger(data)) return false
    return true
  })()
  if (sub0) return false
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## not multiple types

### Schema

```json
{ "not": { "type": ["integer", "boolean"] } }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  const sub0 = (() => {
    if (!(Number.isInteger(data) || typeof data === "boolean")) return false
    return true
  })()
  if (sub0) return false
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## not more complex schema

### Schema

```json
{ "not": { "type": "object", "properties": { "foo": { "type": "string" } } } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
return (function validate(data, recursive) {
  const sub0 = (() => {
    if (!(typeof data === "object" && data && !Array.isArray(data))) return false
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!(typeof data.foo === "string")) return false
    }
    return true
  })()
  if (sub0) return false
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## forbidden property

### Schema

```json
{ "properties": { "foo": { "not": {} } } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      const sub0 = (() => {
        return true
      })()
      if (sub0) return false
    }
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## not with boolean schema true

### Schema

```json
{ "not": true }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  const sub0 = (() => {
    return true
  })()
  if (sub0) return false
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## not with boolean schema false

### Schema

```json
{ "not": false }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  const sub0 = (() => {
    return false
    return true
  })()
  if (sub0) return false
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

