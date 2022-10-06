# format

## email format

### Schema

```json
{ "format": "email" }
```

### Code

```js
'use strict'
const format0 = (input) => {
    if (input.length > 318) return false
    const fast = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]{1,20}(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]{1,21}){0,2}@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,60}[a-z0-9])?){0,3}$/i
    if (fast.test(input)) return true
    if (!input.includes('@') || /(^\.|^"|\.@|\.\.)/.test(input)) return false
    const [name, host, ...rest] = input.split('@')
    if (!name || !host || rest.length !== 0 || name.length > 64 || host.length > 253) return false
    if (!/^[a-z0-9.-]+$/i.test(host) || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(name)) return false
    return host.split('.').every((part) => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(part))
  };
const ref0 = function validate(data) {
  if (typeof data === "string") {
    if (!format0(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## ipv4 format

### Schema

```json
{ "format": "ipv4" }
```

### Code

```js
'use strict'
const format0 = (ip) =>
    ip.length <= 15 &&
    /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d\d?)$/.test(ip);
const ref0 = function validate(data) {
  if (typeof data === "string") {
    if (!format0(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## ipv6 format

### Schema

```json
{ "format": "ipv6" }
```

### Code

```js
'use strict'
const format0 = (input) => {
    if (input.length > 45 || input.length < 2) return false
    let s0 = 0, s1 = 0, hex = 0, short = false, letters = false, last = 0, start = true
    for (let i = 0; i < input.length; i++) {
      const c = input.charCodeAt(i)
      if (i === 1 && last === 58 && c !== 58) return false
      if (c >= 48 && c <= 57) {
        if (++hex > 4) return false
      } else if (c === 46) {
        if (s0 > 6 || s1 >= 3 || hex === 0 || letters) return false
        s1++
        hex = 0
      } else if (c === 58) {
        if (s1 > 0 || s0 >= 7) return false
        if (last === 58) {
          if (short) return false
          short = true
        } else if (i === 0) start = false
        s0++
        hex = 0
        letters = false
      } else if ((c >= 97 && c <= 102) || (c >= 65 && c <= 70)) {
        if (s1 > 0) return false
        if (++hex > 4) return false
        letters = true
      } else return false
      last = c
    }
    if (s0 < 2 || (s1 > 0 && (s1 !== 3 || hex === 0))) return false
    if (short && input.length === 2) return true
    if (s1 > 0 && !/(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(input)) return false
    const spaces = s1 > 0 ? 6 : 7
    if (!short) return s0 === spaces && start && hex > 0
    return (start || hex > 0) && s0 < spaces
  };
const ref0 = function validate(data) {
  if (typeof data === "string") {
    if (!format0(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## hostname format

### Schema

```json
{ "format": "hostname" }
```

### Code

```js
'use strict'
const format0 = (input) => {
    if (input.length > (input.endsWith('.') ? 254 : 253)) return false
    const hostname = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*\.?$/i
    return hostname.test(input)
  };
const ref0 = function validate(data) {
  if (typeof data === "string") {
    if (!format0(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## date-time format

### Schema

```json
{ "format": "date-time" }
```

### Code

```js
'use strict'
const format0 = (input) => {
    if (input.length > 10 + 1 + 9 + 12 + 6) return false
    const full = /^\d\d\d\d-(?:0[1-9]|1[0-2])-(?:[0-2]\d|3[01])[t\s](?:2[0-3]|[0-1]\d):[0-5]\d:(?:[0-5]\d|60)(?:\.\d+)?(?:z|[+-](?:2[0-3]|[0-1]\d)(?::?[0-5]\d)?)$/i
    const feb = input[5] === '0' && input[6] === '2'
    if ((feb && input[8] === '3') || !full.test(input)) return false
    if (input[17] === '6') {
      const p = input.slice(11).match(/([0-9.]+|[^0-9.])/g)
      let hm = Number(p[0]) * 60 + Number(p[2])
      if (p[5] === '+') hm += 24 * 60 - Number(p[6] || 0) * 60 - Number(p[8] || 0)
      else if (p[5] === '-') hm += Number(p[6] || 0) * 60 + Number(p[8] || 0)
      if (hm % (24 * 60) !== 23 * 60 + 59) return false
    }
    if (feb) {
      if (/^\d\d\d\d-02-(?:[012][1-8]|[12]0|[01]9)/.test(input)) return true
      const matches = input.match(/^(\d\d\d\d)-02-29/)
      if (!matches) return false
      const year = matches[1] | 0
      return year % 16 === 0 || (year % 4 === 0 && year % 25 !== 0)
    }
    if (input[8] === '3' && input[9] === '1') return /^\d\d\d\d-(?:0[13578]|1[02])-31/.test(input)
    return /^\d\d\d\d-(?:0[13-9]|1[012])-(?:[012][1-9]|[123]0)/.test(input)
  };
const ref0 = function validate(data) {
  if (typeof data === "string") {
    if (!format0(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## uri format

### Schema

```json
{ "format": "uri" }
```

### Code

```js
'use strict'
const format0 = new RegExp("^[a-z][a-z0-9+\\-.]*:(?:\\/?\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\\.[a-z0-9\\-._~!$&'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)|(?:[a-z0-9\\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\\/?(?:(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)(?:\\?(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$", "i");
const ref0 = function validate(data) {
  if (typeof data === "string") {
    if (!format0.test(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`

