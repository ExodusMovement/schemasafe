# anyOf

## anyOf

### Schema

```json
{ "anyOf": [{ "type": "integer" }, { "minimum": 2 }] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  const sub0 = (() => {
    if (!Number.isInteger(data)) return false
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      if (typeof data === "number") {
        if (!(2 <= data)) return false
      }
      return true
    })()
    if (!sub1) {
      return false
    }
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #/anyOf/1`


## anyOf with base schema

### Schema

```json
{ "type": "string", "anyOf": [{ "maxLength": 2 }, { "minLength": 4 }] }
```

### Code

```js
'use strict'
const stringLength = (string) =>
  /[\uD800-\uDFFF]/.test(string) ? [...string].length : string.length;
return (function validate(data, recursive) {
  if (!(typeof data === "string")) return false
  const sub0 = (() => {
    if (data.length > 2 && stringLength(data) > 2) return false
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      if (data.length < 4 || stringLength(data) < 4) return false
      return true
    })()
    if (!sub1) {
      return false
    }
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #/anyOf/0`


## anyOf with boolean schemas, all true

### Schema

```json
{ "anyOf": [true, true] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  const sub0 = (() => {
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      return true
    })()
    if (!sub1) {
      return false
    }
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/anyOf/0`


## anyOf with boolean schemas, some true

### Schema

```json
{ "anyOf": [true, false] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  const sub0 = (() => {
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      return false
      return true
    })()
    if (!sub1) {
      return false
    }
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/anyOf/0`


## anyOf with boolean schemas, all false

### Schema

```json
{ "anyOf": [false, false] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  const sub0 = (() => {
    return false
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      return false
      return true
    })()
    if (!sub1) {
      return false
    }
  }
  return true
})
```


## anyOf complex types

### Schema

```json
{
  "anyOf": [
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
  const sub0 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
      if (!Number.isInteger(data.bar)) return false
    }
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      if (typeof data === "object" && data && !Array.isArray(data)) {
        if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
        if (!(typeof data.foo === "string")) return false
      }
      return true
    })()
    if (!sub1) {
      return false
    }
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #/anyOf/0`


## anyOf with one empty schema

### Schema

```json
{ "anyOf": [{ "type": "number" }, {}] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  const sub0 = (() => {
    if (!(typeof data === "number")) return false
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      return true
    })()
    if (!sub1) {
      return false
    }
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] empty rules node encountered at #/anyOf/1`


## nested anyOf, to check validation semantics

### Schema

```json
{ "anyOf": [{ "anyOf": [{ "type": "null" }] }] }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  const sub0 = (() => {
    const sub1 = (() => {
      if (!(data === null)) return false
      return true
    })()
    if (!sub1) {
      return false
    }
    return true
  })()
  if (!sub0) {
    return false
  }
  return true
})
```

