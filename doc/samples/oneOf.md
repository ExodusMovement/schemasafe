# oneOf

## oneOf

### Schema

```json
{ "oneOf": [{ "type": "integer" }, { "minimum": 2 }] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  let passes0 = 0
  const sub0 = (() => {
    if (!Number.isInteger(data)) return false
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    if (typeof data === "number") {
      if (!(2 <= data)) return false
    }
    return true
  })()
  if (sub1) passes0++
  if (passes0 > 1) return false
  if (passes0 !== 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #/oneOf/1`


## oneOf with base schema

### Schema

```json
{ "type": "string", "oneOf": [{ "minLength": 2 }, { "maxLength": 4 }] }
```

### Code

```js
'use strict'
const stringLength = (string) =>
  /[\uD800-\uDFFF]/.test(string) ? [...string].length : string.length;
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "string")) return false
  let passes0 = 0
  const sub0 = (() => {
    if (data.length < 2 || stringLength(data) < 2) return false
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    if (data.length > 4 && stringLength(data) > 4) return false
    return true
  })()
  if (sub1) passes0++
  if (passes0 > 1) return false
  if (passes0 !== 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #/oneOf/0`


## oneOf with boolean schemas, all true

### Schema

```json
{ "oneOf": [true, true, true] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  let passes0 = 0
  const sub0 = (() => {
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    return true
  })()
  if (sub1) passes0++
  if (passes0 > 1) return false
  const sub2 = (() => {
    return true
  })()
  if (sub2) passes0++
  if (passes0 > 1) return false
  if (passes0 !== 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/oneOf/0`


## oneOf with boolean schemas, one true

### Schema

```json
{ "oneOf": [true, false, false] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  let passes0 = 0
  const sub0 = (() => {
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    return false
    return true
  })()
  if (sub1) passes0++
  if (passes0 > 1) return false
  const sub2 = (() => {
    return false
    return true
  })()
  if (sub2) passes0++
  if (passes0 > 1) return false
  if (passes0 !== 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/oneOf/0`


## oneOf with boolean schemas, more than one true

### Schema

```json
{ "oneOf": [true, true, false] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  let passes0 = 0
  const sub0 = (() => {
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    return true
  })()
  if (sub1) passes0++
  if (passes0 > 1) return false
  const sub2 = (() => {
    return false
    return true
  })()
  if (sub2) passes0++
  if (passes0 > 1) return false
  if (passes0 !== 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/oneOf/0`


## oneOf with boolean schemas, all false

### Schema

```json
{ "oneOf": [false, false, false] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  let passes0 = 0
  const sub0 = (() => {
    return false
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    return false
    return true
  })()
  if (sub1) passes0++
  if (passes0 > 1) return false
  const sub2 = (() => {
    return false
    return true
  })()
  if (sub2) passes0++
  if (passes0 > 1) return false
  if (passes0 !== 1) return false
  return true
};
return ref0
```


## oneOf complex types

### Schema

```json
{
  "oneOf": [
    { "properties": { "bar": { "type": "integer" } }, "required": ["bar"] },
    { "properties": { "foo": { "type": "string" } }, "required": ["foo"] }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  let passes0 = 0
  const sub0 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
      if (!Number.isInteger(data.bar)) return false
    }
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
      if (!(typeof data.foo === "string")) return false
    }
    return true
  })()
  if (sub1) passes0++
  if (passes0 > 1) return false
  if (passes0 !== 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #/oneOf/0`


## oneOf with empty schema

### Schema

```json
{ "oneOf": [{ "type": "number" }, {}] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  let passes0 = 0
  const sub0 = (() => {
    if (!(typeof data === "number")) return false
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    return true
  })()
  if (sub1) passes0++
  if (passes0 > 1) return false
  if (passes0 !== 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] empty rules node encountered at #/oneOf/1`


## oneOf with required

### Schema

```json
{
  "type": "object",
  "oneOf": [{ "required": ["foo", "bar"] }, { "required": ["foo", "baz"] }]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  let passes0 = 0
  const sub0 = (() => {
    if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
    if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
    if (!(data.baz !== undefined && hasOwn(data, "baz"))) return false
    return true
  })()
  if (sub1) passes0++
  if (passes0 > 1) return false
  if (passes0 !== 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #/oneOf/0`


## oneOf with missing optional property

### Schema

```json
{
  "oneOf": [
    { "properties": { "bar": true, "baz": true }, "required": ["bar"] },
    { "properties": { "foo": true }, "required": ["foo"] }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  let passes0 = 0
  const sub0 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.bar !== undefined && hasOwn(data, "bar"))) return false
    }
    return true
  })()
  if (sub0) passes0++
  const sub1 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      if (!(data.foo !== undefined && hasOwn(data, "foo"))) return false
    }
    return true
  })()
  if (sub1) passes0++
  if (passes0 > 1) return false
  if (passes0 !== 1) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #/oneOf/0`


## nested oneOf, to check validation semantics

### Schema

```json
{ "oneOf": [{ "oneOf": [{ "type": "null" }] }] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  let passes0 = 0
  const sub0 = (() => {
    let passes1 = 0
    const sub1 = (() => {
      if (!(data === null)) return false
      return true
    })()
    if (sub1) passes1++
    if (passes1 !== 1) return false
    return true
  })()
  if (sub0) passes0++
  if (passes0 !== 1) return false
  return true
};
return ref0
```

