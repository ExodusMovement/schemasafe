# propertyDependencies

## propertyDependencies doesn't act on non-objects

### Schema

```json
{ "propertyDependencies": { "foo": { "bar": false } } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (data.foo === "bar") return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## propertyDependencies doesn't act on non-string property values

### Schema

```json
{ "propertyDependencies": { "foo": { "bar": false } } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (data.foo === "bar") return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## multiple options selects the right one

### Schema

```json
{
  "propertyDependencies": {
    "foo": {
      "bar": { "minProperties": 2, "maxProperties": 2 },
      "baz": { "maxProperties": 1 },
      "qux": true,
      "quux": false
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
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (data.foo === "bar") {
        if (typeof data === "object" && data && !Array.isArray(data)) {
          if (Object.keys(data).length > 2) return false
          if (Object.keys(data).length < 2) return false
        }
      }
      if (data.foo === "baz") {
        if (typeof data === "object" && data && !Array.isArray(data)) {
          if (Object.keys(data).length > 1) return false
        }
      }
      if (data.foo === "quux") return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/propertyDependencies/foo/qux`

