# optional/zeroTerminatedFloats

## some languages do not distinguish between different types of numeric value

### Schema

```json
{ "type": "integer" }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
return ref0
```

### Misclassified!

**This schema caused 1 misclassifications!**

