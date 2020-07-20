# multipleOf

## by int

### Schema

```json
{ "multipleOf": 2 }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (typeof data === "number") {
    if (data % 2 !== 0) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## by number

### Schema

```json
{ "multipleOf": 1.5 }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (typeof data === "number") {
    if (data % 1.5 !== 0) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## by small number

### Schema

```json
{ "multipleOf": 0.0001 }
```

### Code

```js
'use strict'
const isMultipleOf = (value, divisor, factor, factorMultiple) => {
  if (value % divisor === 0) return true
  const multiple = value * factor
  if (multiple % factorMultiple === 0) return true
  const normal = Math.floor(multiple + 0.5)
  return normal / factor === value && normal % factorMultiple === 0
};
const ref0 = function validate(data, recursive) {
  if (typeof data === "number") {
    if (!isMultipleOf(data, 0.0001, 1e4, 1)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

