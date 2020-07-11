# boolean_schema

## boolean schema 'true'

### Schema

```json
true
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  return true
})
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #`


## boolean schema 'false'

### Schema

```json
false
```

### Code

```js
'use strict'

return (function validate(data, recursive) {
  return false
  return true
})
```

