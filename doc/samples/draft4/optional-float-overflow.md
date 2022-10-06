# optional/float-overflow

## all integers are multiples of 0.5, if overflow is handled

### Schema

```json
{ "type": "number", "multipleOf": 0.5 }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(typeof data === "number")) return false
  if (data % 0.5 !== 0) return false
  return true
};
return ref0
```

