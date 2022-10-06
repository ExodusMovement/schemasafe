# infinite-loop-detection

## evaluating the same schema location against the same data location twice is not a sign of an infinite loop

### Schema

```json
{
  "definitions": { "int": { "type": "integer" } },
  "allOf": [
    { "properties": { "foo": { "$ref": "#/definitions/int" } } },
    { "additionalProperties": { "$ref": "#/definitions/int" } }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!ref1(data.foo)) return false
    }
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (!ref1(data[key0])) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] if properties is used, required should be specified at #/allOf/0`

