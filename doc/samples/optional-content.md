# optional/content

## validation of string-encoded content based on media type

### Schema

```json
{ "contentMediaType": "application/json" }
```

### Code

```js
'use strict'
const ref0 = function validate(data, recursive) {
  if (typeof data === "string") {
    let dec0 = data
    try {
      dec0 = JSON.parse(dec0)
    } catch (e) {
      return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## validation of binary string-encoding

### Schema

```json
{ "contentEncoding": "base64" }
```

### Code

```js
'use strict'
const format0 = (input) => input.length % 4 === 0 && /^[a-z0-9+/]*={0,3}$/i.test(input);
const ref0 = function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## validation of binary-encoded media type documents

### Schema

```json
{ "contentMediaType": "application/json", "contentEncoding": "base64" }
```

### Code

```js
'use strict'
const format0 = (input) => input.length % 4 === 0 && /^[a-z0-9+/]*={0,3}$/i.test(input);
const deBase64 = (string) => {
  if (typeof Buffer !== 'undefined') return Buffer.from(string, 'base64').toString('utf-8')
  const b = atob(string)
  return new TextDecoder('utf-8').decode(new Uint8Array(b.length).map((_, i) => b.charCodeAt(i)))
};
const ref0 = function validate(data, recursive) {
  if (typeof data === "string") {
    let dec0 = data
    if (!format0(data)) return false
    try {
      dec0 = deBase64(dec0)
      try {
        dec0 = JSON.parse(dec0)
      } catch (e) {
        return false
      }
    } catch (e) {
      return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

