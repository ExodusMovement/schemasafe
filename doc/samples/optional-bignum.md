# optional/bignum

## integer

### Schema

```json
{ "type": "integer" }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (!(Number.isInteger(data))) return false
  return true
})
```


## number

### Schema

```json
{ "type": "number" }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (!(typeof data === "number")) return false
  return true
})
```


## integer

### Schema

```json
{ "type": "integer" }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (!(Number.isInteger(data))) return false
  return true
})
```


## number

### Schema

```json
{ "type": "number" }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (!(typeof data === "number")) return false
  return true
})
```


## string

### Schema

```json
{ "type": "string" }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (!(typeof data === "string")) return false
  return true
})
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema must be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #`


## integer comparison

### Schema

```json
{ "maximum": 18446744073709552000 }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (typeof data === "number") {
    if (!(18446744073709552000 >= data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## float comparison with high precision

### Schema

```json
{ "exclusiveMaximum": 9.727837981879871e26 }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (typeof data === "number") {
    if (!(9.727837981879871e+26 > data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## integer comparison

### Schema

```json
{ "minimum": -18446744073709552000 }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (typeof data === "number") {
    if (!(-18446744073709552000 <= data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## float comparison with high precision on negative numbers

### Schema

```json
{ "exclusiveMinimum": -9.727837981879871e26 }
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  if (typeof data === "number") {
    if (!(-9.727837981879871e+26 < data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

