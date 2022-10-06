# optional/cross-draft

## refs to future drafts are processed as future drafts

### Schema

```json
{
  "type": "object",
  "allOf": [
    { "properties": { "foo": true } },
    { "$ref": "http://localhost:1234/draft2019-09/dependentRequired.json" }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo") && !(data.bar !== undefined && hasOwn(data, "bar"))) return false
  }
  return true
};
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (!ref1(data)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/allOf/0/properties/foo`

