# optional/cross-draft

## refs to historic drafts are processed as historic drafts

### Schema

```json
{
  "type": "array",
  "$ref": "http://localhost:1234/draft2019-09/ignore-prefixItems.json"
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  if (!Array.isArray(data)) return false
  return true
};
return ref0
```

### Warnings

 * `Unprocessed keywords: ["prefixItems"] at http://localhost:1234/draft2019-09/ignore-prefixItems.json#`

