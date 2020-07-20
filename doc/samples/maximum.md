# maximum

## maximum validation

### Schema

```json
{ "maximum": 3 }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (typeof data === "number") {
    if (!(3 >= data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## maximum validation with unsigned integer

### Schema

```json
{ "maximum": 300 }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (typeof data === "number") {
    if (!(300 >= data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

