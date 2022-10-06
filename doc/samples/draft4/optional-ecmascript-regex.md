# optional/ecmascript-regex

## ECMA 262 regex $ does not match trailing newline

### Schema

```json
{ "type": "string", "pattern": "^abc$" }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (!(typeof data === "string")) return false
  if (!(data === "abc")) return false
  return true
};
return ref0
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
const ref0 = function validate(data) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return ref0
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
const ref0 = function validate(data) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return ref0
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
const ref0 = function validate(data) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return ref0
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
const ref0 = function validate(data) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return ref0
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
const ref0 = function validate(data) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return ref0
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
const ref0 = function validate(data) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return ref0
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
const ref0 = function validate(data) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return ref0
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
const ref0 = function validate(data) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return ref0
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
const ref0 = function validate(data) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
return ref0
```


## patterns always use unicode semantics with pattern

### Schema

```json
{ "pattern": "\\p{Letter}cole" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("\\p{Letter}cole", "u");
const ref0 = function validate(data) {
  if (typeof data === "string") {
    if (!pattern0.test(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `Should start with ^ and end with $: "\\p{Letter}cole" at #`


## \w in patterns matches [A-Za-z0-9_], not unicode letters

### Schema

```json
{ "pattern": "\\wcole" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("\\wcole", "u");
const ref0 = function validate(data) {
  if (typeof data === "string") {
    if (!pattern0.test(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `Should start with ^ and end with $: "\\wcole" at #`


## pattern with ASCII ranges

### Schema

```json
{ "pattern": "[a-z]cole" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("[a-z]cole", "u");
const ref0 = function validate(data) {
  if (typeof data === "string") {
    if (!pattern0.test(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `Should start with ^ and end with $: "[a-z]cole" at #`


## \d in pattern matches [0-9], not unicode digits

### Schema

```json
{ "pattern": "^\\d+$" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^\\d+$", "u");
const ref0 = function validate(data) {
  if (typeof data === "string") {
    if (!pattern0.test(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## pattern with non-ASCII digits

### Schema

```json
{ "pattern": "^\\p{digit}+$" }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^\\p{digit}+$", "u");
const ref0 = function validate(data) {
  if (typeof data === "string") {
    if (!pattern0.test(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[complexityChecks] maxLength should be specified for pattern: "^\\p{digit}+$" at #`


## patterns always use unicode semantics with patternProperties

### Schema

```json
{
  "type": "object",
  "patternProperties": { "\\p{Letter}cole": {} },
  "additionalProperties": false
}
```

### Code

```js
'use strict'
const pattern0 = new RegExp("\\p{Letter}cole", "u");
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  for (const key1 of Object.keys(data)) {
    if (!pattern0.test(key1)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `Should start with ^ and end with $: "\\p{Letter}cole" at #`


## \w in patternProperties matches [A-Za-z0-9_], not unicode letters

### Schema

```json
{
  "type": "object",
  "patternProperties": { "\\wcole": {} },
  "additionalProperties": false
}
```

### Code

```js
'use strict'
const pattern0 = new RegExp("\\wcole", "u");
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  for (const key1 of Object.keys(data)) {
    if (!pattern0.test(key1)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `Should start with ^ and end with $: "\\wcole" at #`


## patternProperties with ASCII ranges

### Schema

```json
{
  "type": "object",
  "patternProperties": { "[a-z]cole": {} },
  "additionalProperties": false
}
```

### Code

```js
'use strict'
const pattern0 = new RegExp("[a-z]cole", "u");
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  for (const key1 of Object.keys(data)) {
    if (!pattern0.test(key1)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `Should start with ^ and end with $: "[a-z]cole" at #`


## \d in patternProperties matches [0-9], not unicode digits

### Schema

```json
{
  "type": "object",
  "patternProperties": { "^\\d+$": {} },
  "additionalProperties": false
}
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^\\d+$", "u");
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  for (const key1 of Object.keys(data)) {
    if (!pattern0.test(key1)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] empty rules node is not allowed at #/patternProperties/^\d+$`


## patternProperties with non-ASCII digits

### Schema

```json
{
  "type": "object",
  "patternProperties": { "^\\p{digit}+$": {} },
  "additionalProperties": false
}
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^\\p{digit}+$", "u");
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  for (const key1 of Object.keys(data)) {
    if (!pattern0.test(key1)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[complexityChecks] maxLength should be specified for pattern: "^\\p{digit}+$" at #`

