# optional/content

## validation of string-encoded content based on media type

### Schema

```json
{ "contentMediaType": "application/json" }
```

### Code

```js
'use strict'
const validate = function validate(data, recursive) {
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
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## validation of binary string-encoding

### Schema

```json
{ "contentEncoding": "base64" }
```

### Code

```js
'use strict'
const format0 = (input) => input.length % 4 === 0 && /^[a-z0-9+/]*={0,3}$/i.test(input);
const validate = function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0(data)) return false
  }
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


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
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  const map = Array(128)
  chars.split('').forEach((c, i) => (map[c.charCodeAt(0)] = i.toString(4).padStart(3, 0)))
  let tmp = ''
  const bytes = new Uint8Array(Math.floor((string.length * 3) / 4))
  let filled = 0
  for (let i = 0; i < string.length; i++) {
    tmp += map[string.charCodeAt(i)] || ''
    if (tmp.length >= 4) {
      bytes[filled++] = parseInt(tmp.slice(0, 4), 4)
      tmp = tmp.slice(4)
    }
  }
  const view = new Uint8Array(bytes.buffer, bytes.byteOffset, Math.min(filled, bytes.length))
  return new TextDecoder('utf-8').decode(view)
};
const validate = function validate(data, recursive) {
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
return validate
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

