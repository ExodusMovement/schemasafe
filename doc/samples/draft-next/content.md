# content

## validation of string-encoded content based on media type

### Schema

```json
{ "contentMediaType": "application/json" }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  return true
};
return ref0
```

### Warnings

 * `"content*" keywords are disabled by default per spec, enable with { contentValidation = true } option (see doc/Options.md for more info) at #`


## validation of binary string-encoding

### Schema

```json
{ "contentEncoding": "base64" }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  return true
};
return ref0
```

### Warnings

 * `"content*" keywords are disabled by default per spec, enable with { contentValidation = true } option (see doc/Options.md for more info) at #`


## validation of binary-encoded media type documents

### Schema

```json
{ "contentMediaType": "application/json", "contentEncoding": "base64" }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  return true
};
return ref0
```

### Warnings

 * `"content*" keywords are disabled by default per spec, enable with { contentValidation = true } option (see doc/Options.md for more info) at #`


## validation of binary-encoded media type documents with schema

### Schema

```json
{
  "contentMediaType": "application/json",
  "contentEncoding": "base64",
  "contentSchema": {
    "type": "object",
    "required": ["foo"],
    "properties": { "foo": { "type": "string" } }
  }
}
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  return true
};
return ref0
```

### Warnings

 * `"content*" keywords are disabled by default per spec, enable with { contentValidation = true } option (see doc/Options.md for more info) at #`

