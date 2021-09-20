# patternProperties

## patternProperties validates properties matching a regex

### Schema

```json
{ "patternProperties": { "f.*o": { "type": "integer" } } }
```

### Code

```js
'use strict'
const pattern0 = new RegExp("f.*o", "u");
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (pattern0.test(key0)) {
        if (!(Number.isInteger(data[key0]))) return false
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `Should start with ^ and end with $: "f.*o" at #`


## multiple simultaneous patternProperties are validated

### Schema

```json
{
  "patternProperties": {
    "a*": { "type": "integer" },
    "aaa*": { "maximum": 20 }
  }
}
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (!(Number.isInteger(data[key0]))) return false
      if (key0.includes("aa")) {
        if (typeof data[key0] === "number") {
          if (!(20 >= data[key0])) return false
        }
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `Should start with ^ and end with $: "a*" at #`


## regexes are not anchored by default and are case sensitive

### Schema

```json
{
  "patternProperties": {
    "[0-9]{2,}": { "type": "boolean" },
    "X_": { "type": "string" }
  }
}
```

### Code

```js
'use strict'
const pattern0 = new RegExp("[0-9]{2,}", "u");
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (pattern0.test(key0)) {
        if (!(typeof data[key0] === "boolean")) return false
      }
      if (key0.includes("X_")) {
        if (!(typeof data[key0] === "string")) return false
      }
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `Should start with ^ and end with $: "[0-9]{2,}" at #`


## patternProperties with boolean schemas

### Schema

```json
{ "patternProperties": { "f.*": true, "b.*": false } }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) {
      if (key0.includes("b")) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `Should start with ^ and end with $: "f.*" at #`

