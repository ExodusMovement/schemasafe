# default

## invalid type for default

### Schema

```json
{ "properties": { "foo": { "type": "integer", "default": [] } } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!Number.isInteger(data.foo)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## invalid string value for default

### Schema

```json
{
  "properties": {
    "bar": { "type": "string", "minLength": 4, "default": "bad" }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const stringLength = (string) =>
  /[\uD800-\uDFFF]/.test(string) ? [...string].length : string.length;
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!(typeof data.bar === "string")) return false
      if (data.bar.length < 4 || stringLength(data.bar) < 4) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/bar`


## the default keyword does not do anything if the property is missing

### Schema

```json
{
  "type": "object",
  "properties": { "alpha": { "type": "number", "maximum": 3, "default": 5 } }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.alpha !== undefined && hasOwn(data, "alpha")) {
    if (!(typeof data.alpha === "number")) return false
    if (!(3 >= data.alpha)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] additionalProperties or unevaluatedProperties should be specified at #`

