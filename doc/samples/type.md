# type

## integer type matches integers

### Schema

```json
{ "type": "integer" }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  return true
};
return ref0
```


## number type matches numbers

### Schema

```json
{ "type": "number" }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "number")) return false
  return true
};
return ref0
```


## string type matches strings

### Schema

```json
{ "type": "string" }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "string")) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema must be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #`


## object type matches objects

### Schema

```json
{ "type": "object" }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] additionalProperties rule must be specified at #`


## array type matches arrays

### Schema

```json
{ "type": "array" }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] items rule must be specified at #`


## boolean type matches booleans

### Schema

```json
{ "type": "boolean" }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "boolean")) return false
  return true
};
return ref0
```


## null type matches only the null object

### Schema

```json
{ "type": "null" }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!(data === null)) return false
  return true
};
return ref0
```


## multiple types can be specified in an array

### Schema

```json
{ "type": ["integer", "string"] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!(Number.isInteger(data) || typeof data === "string")) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema must be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #`


## type as array with one item

### Schema

```json
{ "type": ["string"] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "string")) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema must be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #`


## type: array or object

### Schema

```json
{ "type": ["array", "object"] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!(Array.isArray(data) || typeof data === "object" && data && !Array.isArray(data))) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] items rule must be specified at #`


## type: array, object or null

### Schema

```json
{ "type": ["array", "object", "null"] }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (!(Array.isArray(data) || typeof data === "object" && data && !Array.isArray(data) || data === null)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] items rule must be specified at #`

