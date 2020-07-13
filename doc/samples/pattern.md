# pattern

## pattern validation

### Schema

```json
{ "pattern": "^a*$" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^a*$", "u");
const ref0 = function validate(data, recursive) {
  if (typeof data === "string") {
    if (!pattern0.test(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## pattern is not anchored

### Schema

```json
{ "pattern": "a+" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("a+", "u");
const ref0 = function validate(data, recursive) {
  if (typeof data === "string") {
    if (!pattern0.test(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

