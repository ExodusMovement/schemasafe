# multipleOf

## by int

### Schema

```json
{ "multipleOf": 2 }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
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
const ref0 = function validate(data) {
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
  let multiple = value * factor
  if (multiple === Infinity || multiple === -Infinity) multiple = value
  if (multiple % factorMultiple === 0) return true
  const normal = Math.floor(multiple + 0.5)
  return normal / factor === value && normal % factorMultiple === 0
};
const ref0 = function validate(data) {
  if (typeof data === "number") {
    if (!isMultipleOf(data, 0.0001, 1e4, 1)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## float division = inf

### Schema

```json
{ "type": "integer", "multipleOf": 0.123456789 }
```

### Code

```js
'use strict'
const isMultipleOf = (value, divisor, factor, factorMultiple) => {
  if (value % divisor === 0) return true
  let multiple = value * factor
  if (multiple === Infinity || multiple === -Infinity) multiple = value
  if (multiple % factorMultiple === 0) return true
  const normal = Math.floor(multiple + 0.5)
  return normal / factor === value && normal % factorMultiple === 0
};
const ref0 = function validate(data) {
  if (!Number.isInteger(data)) return false
  if (!isMultipleOf(data, 0.123456789, 1e9, 123456789)) return false
  return true
};
return ref0
```


## small multiple of large integer

### Schema

```json
{ "type": "integer", "multipleOf": 1e-8 }
```

### Code

```js
'use strict'
const isMultipleOf = (value, divisor, factor, factorMultiple) => {
  if (value % divisor === 0) return true
  let multiple = value * factor
  if (multiple === Infinity || multiple === -Infinity) multiple = value
  if (multiple % factorMultiple === 0) return true
  const normal = Math.floor(multiple + 0.5)
  return normal / factor === value && normal % factorMultiple === 0
};
const ref0 = function validate(data) {
  if (!Number.isInteger(data)) return false
  if (!isMultipleOf(data, 1e-8, 1e8, 1)) return false
  return true
};
return ref0
```

