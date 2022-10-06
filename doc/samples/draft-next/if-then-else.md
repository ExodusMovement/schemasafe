# if-then-else

## ignore if without then or else

### Schema

```json
{ "if": { "const": 0 } }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  const sub0 = (() => {
    if (!(data === 0)) return false
    return true
  })()
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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
  const sub0 = (() => {
    if (typeof data === "number") {
      if (!(0 > data)) return false
    }
    return true
  })()
  if (sub0) {
    if (typeof data === "number") {
      if (!(-10 <= data)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## if and else without then

### Schema

```json
{ "if": { "exclusiveMaximum": 0 }, "else": { "multipleOf": 2 } }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
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

 * `[requireValidation] type should be specified at #`


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
const ref0 = function validate(data) {
  const sub0 = (() => {
    if (typeof data === "number") {
      if (!(0 > data)) return false
    }
    return true
  })()
  if (sub0) {
    if (typeof data === "number") {
      if (!(-10 <= data)) return false
    }
  }
  else {
    if (typeof data === "number") {
      if (data % 2 !== 0) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


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
const ref0 = function validate(data) {
  const sub0 = (() => {
    if (typeof data === "number") {
      if (!(0 > data)) return false
    }
    return true
  })()
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
const ref0 = function validate(data) {
  if (!(data === "then")) return false
  return true
};
return ref0
```

### Warnings

 * `some checks are never reachable at #`


## if with boolean schema false

### Schema

```json
{ "if": false, "then": { "const": "then" }, "else": { "const": "else" } }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(data === "else")) return false
  return true
};
return ref0
```

### Warnings

 * `some checks are never reachable at #`


## if appears at the end when serialized (keyword processing sequence)

### Schema

```json
{
  "then": { "const": "yes" },
  "else": { "const": "other" },
  "if": { "maxLength": 4 }
}
```

### Code

```js
'use strict'
const stringLength = (string) =>
  /[\uD800-\uDFFF]/.test(string) ? [...string].length : string.length;
const ref0 = function validate(data) {
  const sub0 = (() => {
    if (typeof data === "string") {
      if (data.length > 4 && stringLength(data) > 4) return false
    }
    return true
  })()
  if (sub0) {
    if (!(data === "yes")) return false
  }
  else {
    if (!(data === "other")) return false
  }
  return true
};
return ref0
```

