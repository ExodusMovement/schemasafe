# optional/dependencies-compatibility

## single dependency

### Schema

```json
{ "dependencies": { "bar": ["foo"] } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar") && !(data.foo !== undefined && hasOwn(data, "foo"))) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## empty dependents

### Schema

```json
{ "dependencies": { "bar": [] } }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## multiple dependents required

### Schema

```json
{ "dependencies": { "quux": ["foo", "bar"] } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.quux !== undefined && hasOwn(data, "quux") && !(data.foo !== undefined && hasOwn(data, "foo") && data.bar !== undefined && hasOwn(data, "bar"))) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## dependencies with escaped characters

### Schema

```json
{ "dependencies": { "foo\nbar": ["foo\rbar"], "foo\"bar": ["foo'bar"] } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data["foo\nbar"] !== undefined && hasOwn(data, "foo\nbar") && !(data["foo\rbar"] !== undefined && hasOwn(data, "foo\rbar"))) return false
    if (data["foo\"bar"] !== undefined && hasOwn(data, "foo\"bar") && !(data["foo'bar"] !== undefined && hasOwn(data, "foo'bar"))) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## single schema dependency

### Schema

```json
{
  "dependencies": {
    "bar": {
      "properties": {
        "foo": { "type": "integer" },
        "bar": { "type": "integer" }
      }
    }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (typeof data === "object" && data && !Array.isArray(data)) {
        if (data.foo !== undefined && hasOwn(data, "foo")) {
          if (!Number.isInteger(data.foo)) return false
        }
        if (data.bar !== undefined && hasOwn(data, "bar")) {
          if (!Number.isInteger(data.bar)) return false
        }
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] if properties is used, required should be specified at #/dependencies/bar`


## boolean subschemas

### Schema

```json
{ "dependencies": { "foo": true, "bar": false } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/dependencies/foo`


## schema dependencies with escaped characters

### Schema

```json
{
  "dependencies": {
    "foo\tbar": { "minProperties": 4 },
    "foo'bar": { "required": ["foo\"bar"] }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data["foo\tbar"] !== undefined && hasOwn(data, "foo\tbar")) {
      if (typeof data === "object" && data && !Array.isArray(data)) {
        if (Object.keys(data).length < 4) return false
      }
    }
    if (data["foo'bar"] !== undefined && hasOwn(data, "foo'bar")) {
      if (typeof data === "object" && data && !Array.isArray(data)) {
        if (!(data["foo\"bar"] !== undefined && hasOwn(data, "foo\"bar"))) return false
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

