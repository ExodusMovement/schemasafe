# optional/cross-draft

## refs to future drafts are processed as future drafts

### Schema

```json
{
  "type": "array",
  "$ref": "http://localhost:1234/draft2020-12/prefixItems.json"
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(typeof data[0] === "string")) return false
    }
  }
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  if (!Array.isArray(data)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at http://localhost:1234/draft2020-12/prefixItems.json#/0`


## refs to historic drafts are processed as historic drafts

### Schema

```json
{
  "type": "object",
  "allOf": [
    { "properties": { "foo": true } },
    { "$ref": "http://localhost:1234/draft7/ignore-dependentRequired.json" }
  ]
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  return true
};
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (!ref1(data)) return false
  return true
};
return ref0
```

### Warnings

 * `Unprocessed keywords: ["dependentRequired"] at http://localhost:1234/draft7/ignore-dependentRequired.json#`

