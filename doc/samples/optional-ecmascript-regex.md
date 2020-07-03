# optional/ecmascript-regex

## ECMA 262 regex non-compliance

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


## ECMA 262 regex $ does not match trailing newline

### Schema

```json
{ "type": "string", "pattern": "^abc$" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^abc$", "u");
const validate = function validate(data, recursive) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return validate
```


## ECMA 262 regex converts \t to horizontal tab

### Schema

```json
{ "type": "string", "pattern": "^\\t$" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^\\t$", "u");
const validate = function validate(data, recursive) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return validate
```


## ECMA 262 regex escapes control codes with \c and upper letter

### Schema

```json
{ "type": "string", "pattern": "^\\cC$" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^\\cC$", "u");
const validate = function validate(data, recursive) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return validate
```


## ECMA 262 regex escapes control codes with \c and lower letter

### Schema

```json
{ "type": "string", "pattern": "^\\cc$" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^\\cc$", "u");
const validate = function validate(data, recursive) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return validate
```


## ECMA 262 \d matches ascii digits only

### Schema

```json
{ "type": "string", "pattern": "^\\d$" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^\\d$", "u");
const validate = function validate(data, recursive) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return validate
```


## ECMA 262 \D matches everything but ascii digits

### Schema

```json
{ "type": "string", "pattern": "^\\D$" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^\\D$", "u");
const validate = function validate(data, recursive) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return validate
```


## ECMA 262 \w matches ascii letters only

### Schema

```json
{ "type": "string", "pattern": "^\\w$" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^\\w$", "u");
const validate = function validate(data, recursive) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return validate
```


## ECMA 262 \W matches everything but ascii letters

### Schema

```json
{ "type": "string", "pattern": "^\\W$" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^\\W$", "u");
const validate = function validate(data, recursive) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return validate
```


## ECMA 262 \s matches whitespace

### Schema

```json
{ "type": "string", "pattern": "^\\s$" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^\\s$", "u");
const validate = function validate(data, recursive) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return validate
```


## ECMA 262 \S matches everything but whitespace

### Schema

```json
{ "type": "string", "pattern": "^\\S$" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^\\S$", "u");
const validate = function validate(data, recursive) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return validate
```

