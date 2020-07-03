# minimum

## minimum validation

### Schema

```json
{ "minimum": 1.1 }
```

### Code

```js
'use strict'
const validate = function validate(data, recursive) {
  if (typeof data === "number") {
    if (!(1.1 <= data)) return false
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## minimum validation with signed integer

### Schema

```json
{ "minimum": -2 }
```

### Code

```js
'use strict'
const validate = function validate(data, recursive) {
  if (typeof data === "number") {
    if (!(-2 <= data)) return false
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

