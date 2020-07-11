# allOf

## allOf

### Schema

```json
{
  "allOf": [
    { "properties": { "bar": { "type": "integer" } }, "required": ["bar"] },
    { "properties": { "foo": { "type": "string" } }, "required": ["foo"] }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
    if (!(Number.isInteger(data.bar))) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
    if (!(typeof data.foo === "string")) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #/allOf/0`


## allOf with base schema

### Schema

```json
{
  "properties": { "bar": { "type": "integer" } },
  "required": ["bar"],
  "allOf": [
    { "properties": { "foo": { "type": "string" } }, "required": ["foo"] },
    { "properties": { "baz": { "type": "null" } }, "required": ["baz"] }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
return (function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
    if (!(Number.isInteger(data.bar))) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
    if (!(typeof data.foo === "string")) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data.baz !== undefined && hasOwn(data, "baz"))) return false
    if (!(data.baz === null)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #/allOf/0`


## allOf simple types

### Schema

```json
{ "allOf": [{ "maximum": 30 }, { "minimum": 20 }] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (typeof data === "number") {
    if (!(30 >= data)) return false
  }
  if (typeof data === "number") {
    if (!(20 <= data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #/allOf/0`


## allOf with boolean schemas, all true

### Schema

```json
{ "allOf": [true, true] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  return true
})
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/allOf/0`


## allOf with boolean schemas, some false

### Schema

```json
{ "allOf": [true, false] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  return false
  return true
})
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/allOf/0`


## allOf with boolean schemas, all false

### Schema

```json
{ "allOf": [false, false] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  return false
  return false
  return true
})
```


## allOf with one empty schema

### Schema

```json
{ "allOf": [{}] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  return true
})
```

##### Strong mode notices

 * `[requireValidation] empty rules node encountered at #/allOf/0`


## allOf with two empty schemas

### Schema

```json
{ "allOf": [{}, {}] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  return true
})
```

##### Strong mode notices

 * `[requireValidation] empty rules node encountered at #/allOf/0`


## allOf with the first empty schema

### Schema

```json
{ "allOf": [{}, { "type": "number" }] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (!(typeof data === "number")) return false
  return true
})
```

##### Strong mode notices

 * `[requireValidation] empty rules node encountered at #/allOf/0`


## allOf with the last empty schema

### Schema

```json
{ "allOf": [{ "type": "number" }, {}] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (!(typeof data === "number")) return false
  return true
})
```

##### Strong mode notices

 * `[requireValidation] empty rules node encountered at #/allOf/1`


## nested allOf, to check validation semantics

### Schema

```json
{ "allOf": [{ "allOf": [{ "type": "null" }] }] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (!(data === null)) return false
  return true
})
```


## allOf combined with anyOf, oneOf

### Schema

```json
{
  "allOf": [{ "multipleOf": 2 }],
  "anyOf": [{ "multipleOf": 3 }],
  "oneOf": [{ "multipleOf": 5 }]
}
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (typeof data === "number") {
    if (data % 2 !== 0) return false
  }
  const sub0 = (() => {
    if (typeof data === "number") {
      if (data % 3 !== 0) return false
    }
    return true
  })()
  if (!sub0) {
    return false
  }
  let passes0 = 0
  const sub1 = (() => {
    if (typeof data === "number") {
      if (data % 5 !== 0) return false
    }
    return true
  })()
  if (sub1) passes0++
  if (passes0 !== 1) return false
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #/allOf/0`

