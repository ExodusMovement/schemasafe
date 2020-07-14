# if-then-else

## ignore if without then or else

### Schema

```json
{ "if": { "const": 0 } }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  return true
};
return ref0
```

### Warnings

 * `Unprocessed keywords: ["if"] at #`


## ignore then without if

### Schema

```json
{ "then": { "const": 0 } }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  return true
};
return ref0
```

### Warnings

 * `Unprocessed keywords: ["then"] at #`


## ignore else without if

### Schema

```json
{ "else": { "const": 0 } }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  return true
};
return ref0
```

### Warnings

 * `Unprocessed keywords: ["else"] at #`


## if and then without else

### Schema

```json
{ "if": { "exclusiveMaximum": 0 }, "then": { "minimum": -10 } }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  const sub0 = (() => {
    if (typeof data === "number") {
      if (!(0 > data)) return false
    }
    return true
  })()
  if (!sub0) {
  } else {
    if (typeof data === "number") {
      if (!(-10 <= data)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`


## if and else without then

### Schema

```json
{ "if": { "exclusiveMaximum": 0 }, "else": { "multipleOf": 2 } }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  const sub0 = (() => {
    if (typeof data === "number") {
      if (!(0 > data)) return false
    }
    return true
  })()
  if (!sub0) {
    if (typeof data === "number") {
      if (data % 2 !== 0) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`


## validate against correct branch, then vs else

### Schema

```json
{
  "if": { "exclusiveMaximum": 0 },
  "then": { "minimum": -10 },
  "else": { "multipleOf": 2 }
}
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  const sub0 = (() => {
    if (typeof data === "number") {
      if (!(0 > data)) return false
    }
    return true
  })()
  if (!sub0) {
    if (typeof data === "number") {
      if (data % 2 !== 0) return false
    }
  } else {
    if (typeof data === "number") {
      if (!(-10 <= data)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type must be specified at #`


## non-interference across combined schemas

### Schema

```json
{
  "allOf": [
    { "if": { "exclusiveMaximum": 0 } },
    { "then": { "minimum": -10 } },
    { "else": { "multipleOf": 2 } }
  ]
}
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  return true
};
return ref0
```

### Warnings

 * `Unprocessed keywords: ["if"] at #/allOf/0`


## if with boolean schema true

### Schema

```json
{ "if": true, "then": { "const": "then" }, "else": { "const": "else" } }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  const sub0 = (() => {
    return true
  })()
  if (!sub0) {
    if (!(data === "else")) return false
  } else {
    if (!(data === "then")) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/if`


## if with boolean schema false

### Schema

```json
{ "if": false, "then": { "const": "then" }, "else": { "const": "else" } }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  const sub0 = (() => {
    return false
    return true
  })()
  if (!sub0) {
    if (!(data === "else")) return false
  } else {
    if (!(data === "then")) return false
  }
  return true
};
return ref0
```

