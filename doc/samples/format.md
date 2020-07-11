# format

## validation of e-mail addresses

### Schema

```json
{ "format": "email" }
```

### Code

```js
'use strict'
const format0 = (input) => {
    if (input[0] === '"') return false
    const [name, host, ...rest] = input.split('@')
    if (!name || !host || rest.length !== 0 || name.length > 64 || host.length > 253) return false
    if (name[0] === '.' || name.endsWith('.') || name.includes('..')) return false
    if (!/^[a-z0-9.-]+$/i.test(host) || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(name)) return false
    return host.split('.').every((part) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(part))
  };
return (function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0(data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## validation of IDN e-mail addresses

### Schema

```json
{ "format": "idn-email" }
```

### Code

**FAILED TO COMPILE**

### Errors

 * `Unrecognized format used: "idn-email" at #`


## validation of regexes

### Schema

```json
{ "format": "regex" }
```

### Code

```js
'use strict'
const format0 = (str) => {
    if (str.length > 1e5) return false
    const Z_ANCHOR = /[^\\]\\Z/
    if (Z_ANCHOR.test(str)) return false
    try {
      new RegExp(str)
      return true
    } catch (e) {
      return false
    }
  };
return (function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0(data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## validation of IP addresses

### Schema

```json
{ "format": "ipv4" }
```

### Code

```js
'use strict'
const format0 = (input) =>
    input.length <= 15 &&
    /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(input);
return (function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0(data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## validation of IPv6 addresses

### Schema

```json
{ "format": "ipv6" }
```

### Code

```js
'use strict'
const format0 = (input) =>
    input.length <= 45 &&
    /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i.test(
      input
    );
return (function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0(data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## validation of IDN hostnames

### Schema

```json
{ "format": "idn-hostname" }
```

### Code

**FAILED TO COMPILE**

### Errors

 * `Unrecognized format used: "idn-hostname" at #`


## validation of hostnames

### Schema

```json
{ "format": "hostname" }
```

### Code

```js
'use strict'
const format0 = (input) => {
    const host = input.endsWith('.') ? input.slice(0, input.length - 1) : input
    if (host.length > 253) return false
    if (!/^[a-z0-9.-]+$/i.test(host)) return false
    return host.split('.').every((part) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(part))
  };
return (function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0(data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## validation of date strings

### Schema

```json
{ "format": "date" }
```

### Code

```js
'use strict'
const format0 = (input) => input.length === 10 && /^\d{4}-(?:0[1-9]|1[0-2])-[0-3]\d$/.test(input);
return (function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0(data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## validation of date-time strings

### Schema

```json
{ "format": "date-time" }
```

### Code

```js
'use strict'
const format0 = (input) =>
    input.length <= 10 + 1 + 9 + 12 + 6 &&
    /^\d{4}-(?:0[1-9]|1[0-2])-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i.test(
      input
    );
return (function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0(data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## validation of time strings

### Schema

```json
{ "format": "time" }
```

### Code

```js
'use strict'
const format0 = (input) =>
    input.length <= 9 + 12 + 6 &&
    /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i.test(input);
return (function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0(data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## validation of JSON pointers

### Schema

```json
{ "format": "json-pointer" }
```

### Code

```js
'use strict'
const format0 = new RegExp("^(?:|\\/(?:[^~]|~0|~1)*)$", "");
return (function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0.test(data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## validation of relative JSON pointers

### Schema

```json
{ "format": "relative-json-pointer" }
```

### Code

```js
'use strict'
const format0 = new RegExp("^(?:0|[1-9][0-9]*)(?:|#|\\/(?:[^~]|~0|~1)*)$", "");
return (function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0.test(data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## validation of IRIs

### Schema

```json
{ "format": "iri" }
```

### Code

**FAILED TO COMPILE**

### Errors

 * `Unrecognized format used: "iri" at #`


## validation of IRI references

### Schema

```json
{ "format": "iri-reference" }
```

### Code

**FAILED TO COMPILE**

### Errors

 * `Unrecognized format used: "iri-reference" at #`


## validation of URIs

### Schema

```json
{ "format": "uri" }
```

### Code

```js
'use strict'
const format0 = new RegExp("^[a-z][a-z0-9+-.]*:[^\\s]*$", "i");
return (function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0.test(data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## validation of URI references

### Schema

```json
{ "format": "uri-reference" }
```

### Code

```js
'use strict'
const format0 = new RegExp("^(?:|(?:|[a-z][a-z0-9+-.]*:)\\/?\\/)(?:|[^\\\\\\s#][^\\s#]*)(?:|#[^\\\\\\s]*)$", "i");
return (function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0.test(data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## validation of URI templates

### Schema

```json
{ "format": "uri-template" }
```

### Code

```js
'use strict'
const format0 = new RegExp("^(?:[^\\x00-\\x20\"'<>%\\\\^`{|}]|%[0-9a-f]{2}|\\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\\*)?)*\\})*$", "i");
return (function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0.test(data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## validation of UUIDs

### Schema

```json
{ "format": "uuid" }
```

### Code

```js
'use strict'
const format0 = new RegExp("^(?:urn:uuid:)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", "i");
return (function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0.test(data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`


## validation of durations

### Schema

```json
{ "format": "duration" }
```

### Code

```js
'use strict'
const format0 = (input) =>
    input.length > 1 &&
    input.length < 80 &&
    (/^P\d+([.,]\d+)?W$/.test(input) ||
      (/^P[\dYMDTHMS]*(\d[.,]\d+)?[YMDHMS]$/.test(input) &&
        /^P([.,\d]+Y)?([.,\d]+M)?([.,\d]+D)?(T([.,\d]+H)?([.,\d]+M)?([.,\d]+S)?)?$/.test(input)));
return (function validate(data, recursive) {
  if (typeof data === "string") {
    if (!format0(data)) return false
  }
  return true
})
```

##### Strong mode notices

 * `[requireValidation] type is required at #`

