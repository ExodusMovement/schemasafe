# minimum

## minimum validation

### Schema

```json
{ "minimum": 1.1 }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (typeof data === "number") {
    if (!(1.1 <= data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## minimum validation (explicit false exclusivity)

### Schema

```json
{ "minimum": 1.1, "exclusiveMinimum": false }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (typeof data === "number") {
    if (!(1.1 <= data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## exclusiveMinimum validation

### Schema

```json
{ "minimum": 1.1, "exclusiveMinimum": true }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (typeof data === "number") {
    if (!(1.1 < data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## minimum validation with signed integer

### Schema

```json
{ "minimum": -2 }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (typeof data === "number") {
    if (!(-2 <= data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

