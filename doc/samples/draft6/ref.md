# ref

## root pointer ref

### Schema

```json
{ "properties": { "foo": { "$ref": "#" } }, "additionalProperties": false }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!validate(data.foo)) return false
    }
    for (const key0 of Object.keys(data)) {
      if (key0 !== "foo") return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #/properties/foo`


## relative pointer ref to object

### Schema

```json
{
  "properties": {
    "foo": { "type": "integer" },
    "bar": { "$ref": "#/properties/foo" }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!Number.isInteger(data.foo)) return false
    }
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!ref1(data.bar)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## relative pointer ref to array

### Schema

```json
{ "items": [{ "type": "integer" }, { "$ref": "#/items/0" }] }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (Array.isArray(data)) {
    if (data[0] !== undefined && hasOwn(data, 0)) {
      if (!(Number.isInteger(data[0]))) return false
    }
    if (data[1] !== undefined && hasOwn(data, 1)) {
      if (!ref1(data[1])) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## escaped pointer ref

### Schema

```json
{
  "definitions": {
    "tilde~field": { "type": "integer" },
    "slash/field": { "type": "integer" },
    "percent%field": { "type": "integer" }
  },
  "properties": {
    "tilde": { "$ref": "#/definitions/tilde~0field" },
    "slash": { "$ref": "#/definitions/slash~1field" },
    "percent": { "$ref": "#/definitions/percent%25field" }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref2 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref3 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.tilde !== undefined && hasOwn(data, "tilde")) {
      if (!ref1(data.tilde)) return false
    }
    if (data.slash !== undefined && hasOwn(data, "slash")) {
      if (!ref2(data.slash)) return false
    }
    if (data.percent !== undefined && hasOwn(data, "percent")) {
      if (!ref3(data.percent)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## nested refs

### Schema

```json
{
  "definitions": {
    "a": { "type": "integer" },
    "b": { "$ref": "#/definitions/a" },
    "c": { "$ref": "#/definitions/b" }
  },
  "allOf": [{ "$ref": "#/definitions/c" }]
}
```

### Code

```js
'use strict'
const ref3 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref2 = function validate(data) {
  if (!ref3(data)) return false
  return true
};
const ref1 = function validate(data) {
  if (!ref2(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```


## ref overrides any sibling keywords

### Schema

```json
{
  "definitions": { "reffed": { "type": "array" } },
  "properties": { "foo": { "$ref": "#/definitions/reffed", "maxItems": 2 } }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!Array.isArray(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!ref1(data.foo)) return false
    }
  }
  return true
};
return ref0
```

### Warnings

 * `Unprocessed keywords: ["maxItems"] at #/properties/foo`


## $ref prevents a sibling $id from changing the base uri

### Schema

```json
{
  "$id": "http://localhost:1234/sibling_id/base/",
  "definitions": {
    "foo": {
      "$id": "http://localhost:1234/sibling_id/foo.json",
      "type": "string"
    },
    "base_foo": {
      "$comment": "this canonical uri is http://localhost:1234/sibling_id/base/foo.json",
      "$id": "foo.json",
      "type": "number"
    }
  },
  "allOf": [
    {
      "$comment": "$ref resolves to http://localhost:1234/sibling_id/base/foo.json, not http://localhost:1234/sibling_id/foo.json",
      "$id": "http://localhost:1234/sibling_id/",
      "$ref": "foo.json"
    }
  ]
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  if (!(typeof data === "number")) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```

### Warnings

 * `Unprocessed keywords: ["$id"] at #/allOf/0`


## remote ref, containing refs itself

### Schema

```json
{ "$ref": "http://json-schema.org/draft-06/schema#" }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const format0 = new RegExp("^(?:[a-z][a-z0-9+\\-.]*:)?(?:\\/?\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\\.[a-z0-9\\-._~!$&'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)|(?:[a-z0-9\\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\\/?(?:(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)?(?:\\?(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$", "i");
const format1 = new RegExp("^[a-z][a-z0-9+\\-.]*:(?:\\/?\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\\.[a-z0-9\\-._~!$&'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)|(?:[a-z0-9\\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\\/?(?:(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)(?:\\?(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$", "i");
const ref2 = function validate(data) {
  if (!Number.isInteger(data)) return false
  if (!(0 <= data)) return false
  return true
};
const ref3 = function validate(data) {
  if (!ref2(data)) return false
  return true
};
const format2 = (str) => {
    if (str.length > 1e5) return false
    const Z_ANCHOR = /[^\\]\\Z/
    if (Z_ANCHOR.test(str)) return false
    try {
      new RegExp(str, 'u')
      return true
    } catch (e) {
      return false
    }
  };
const ref4 = function validate(data) {
  if (!Array.isArray(data)) return false
  if (data.length < 1) return false
  for (let j = 0; j < data.length; j++) {
    if (data[j] !== undefined && hasOwn(data, j)) {
      if (!ref1(data[j])) return false
    }
  }
  return true
};
const unique = (array) => {
  if (array.length < 2) return true
  if (array.length === 2) return !deepEqual(array[0], array[1])
  const objects = []
  const primitives = array.length > 20 ? new Set() : null
  let primitivesCount = 0
  let pos = 0
  for (const item of array) {
    if (typeof item === 'object') {
      objects.push(item)
    } else if (primitives) {
      primitives.add(item)
      if (primitives.size !== ++primitivesCount) return false
    } else {
      if (array.indexOf(item, pos + 1) !== -1) return false
    }
    pos++
  }
  for (let i = 1; i < objects.length; i++)
    for (let j = 0; j < i; j++) if (deepEqual(objects[i], objects[j])) return false
  return true
};
const deepEqual = (obj, obj2) => {
  if (obj === obj2) return true
  if (!obj || !obj2 || typeof obj !== typeof obj2) return false
  if (obj !== obj2 && typeof obj !== 'object') return false

  const proto = Object.getPrototypeOf(obj)
  if (proto !== Object.getPrototypeOf(obj2)) return false

  if (proto === Array.prototype) {
    if (!Array.isArray(obj) || !Array.isArray(obj2)) return false
    if (obj.length !== obj2.length) return false
    return obj.every((x, i) => deepEqual(x, obj2[i]))
  } else if (proto === Object.prototype) {
    const [keys, keys2] = [Object.keys(obj), Object.keys(obj2)]
    if (keys.length !== keys2.length) return false
    const keyset2 = new Set([...keys, ...keys2])
    return keyset2.size === keys.length && keys.every((key) => deepEqual(obj[key], obj2[key]))
  }
  return false
};
const ref5 = function validate(data) {
  if (!Array.isArray(data)) return false
  for (let k = 0; k < data.length; k++) {
    if (data[k] !== undefined && hasOwn(data, k)) {
      if (!(typeof data[k] === "string")) return false
    }
  }
  if (!unique(data)) return false
  return true
};
const ref6 = function validate(data) {
  if (!(data === "array" || data === "boolean" || data === "integer" || data === "null" || data === "number" || data === "object" || data === "string")) return false
  return true
};
const ref1 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data["$id"] !== undefined && hasOwn(data, "$id")) {
      if (!(typeof data["$id"] === "string")) return false
      if (!format0.test(data["$id"])) return false
    }
    if (data["$schema"] !== undefined && hasOwn(data, "$schema")) {
      if (!(typeof data["$schema"] === "string")) return false
      if (!format1.test(data["$schema"])) return false
    }
    if (data["$ref"] !== undefined && hasOwn(data, "$ref")) {
      if (!(typeof data["$ref"] === "string")) return false
      if (!format0.test(data["$ref"])) return false
    }
    if (data.title !== undefined && hasOwn(data, "title")) {
      if (!(typeof data.title === "string")) return false
    }
    if (data.description !== undefined && hasOwn(data, "description")) {
      if (!(typeof data.description === "string")) return false
    }
    if (data.examples !== undefined && hasOwn(data, "examples")) {
      if (!Array.isArray(data.examples)) return false
    }
    if (data.multipleOf !== undefined && hasOwn(data, "multipleOf")) {
      if (!(typeof data.multipleOf === "number")) return false
      if (!(0 < data.multipleOf)) return false
    }
    if (data.maximum !== undefined && hasOwn(data, "maximum")) {
      if (!(typeof data.maximum === "number")) return false
    }
    if (data.exclusiveMaximum !== undefined && hasOwn(data, "exclusiveMaximum")) {
      if (!(typeof data.exclusiveMaximum === "number")) return false
    }
    if (data.minimum !== undefined && hasOwn(data, "minimum")) {
      if (!(typeof data.minimum === "number")) return false
    }
    if (data.exclusiveMinimum !== undefined && hasOwn(data, "exclusiveMinimum")) {
      if (!(typeof data.exclusiveMinimum === "number")) return false
    }
    if (data.maxLength !== undefined && hasOwn(data, "maxLength")) {
      if (!ref2(data.maxLength)) return false
    }
    if (data.minLength !== undefined && hasOwn(data, "minLength")) {
      if (!ref3(data.minLength)) return false
    }
    if (data.pattern !== undefined && hasOwn(data, "pattern")) {
      if (!(typeof data.pattern === "string")) return false
      if (!format2(data.pattern)) return false
    }
    if (data.additionalItems !== undefined && hasOwn(data, "additionalItems")) {
      if (!validate(data.additionalItems)) return false
    }
    if (data.items !== undefined && hasOwn(data, "items")) {
      const sub0 = (() => {
        if (!validate(data.items)) return false
        return true
      })()
      if (!sub0) {
        const sub1 = (() => {
          if (!ref4(data.items)) return false
          return true
        })()
        if (!sub1) return false
      }
    }
    if (data.maxItems !== undefined && hasOwn(data, "maxItems")) {
      if (!ref2(data.maxItems)) return false
    }
    if (data.minItems !== undefined && hasOwn(data, "minItems")) {
      if (!ref3(data.minItems)) return false
    }
    if (data.uniqueItems !== undefined && hasOwn(data, "uniqueItems")) {
      if (!(typeof data.uniqueItems === "boolean")) return false
    }
    if (data.contains !== undefined && hasOwn(data, "contains")) {
      if (!validate(data.contains)) return false
    }
    if (data.maxProperties !== undefined && hasOwn(data, "maxProperties")) {
      if (!ref2(data.maxProperties)) return false
    }
    if (data.minProperties !== undefined && hasOwn(data, "minProperties")) {
      if (!ref3(data.minProperties)) return false
    }
    if (data.required !== undefined && hasOwn(data, "required")) {
      if (!ref5(data.required)) return false
    }
    if (data.additionalProperties !== undefined && hasOwn(data, "additionalProperties")) {
      if (!validate(data.additionalProperties)) return false
    }
    if (data.definitions !== undefined && hasOwn(data, "definitions")) {
      if (!(typeof data.definitions === "object" && data.definitions && !Array.isArray(data.definitions))) return false
      for (const key0 of Object.keys(data.definitions)) {
        if (!validate(data.definitions[key0])) return false
      }
    }
    if (data.properties !== undefined && hasOwn(data, "properties")) {
      if (!(typeof data.properties === "object" && data.properties && !Array.isArray(data.properties))) return false
      for (const key1 of Object.keys(data.properties)) {
        if (!validate(data.properties[key1])) return false
      }
    }
    if (data.patternProperties !== undefined && hasOwn(data, "patternProperties")) {
      if (!(typeof data.patternProperties === "object" && data.patternProperties && !Array.isArray(data.patternProperties))) return false
      for (const key2 of Object.keys(data.patternProperties)) {
        if (!validate(data.patternProperties[key2])) return false
      }
    }
    if (data.dependencies !== undefined && hasOwn(data, "dependencies")) {
      if (!(typeof data.dependencies === "object" && data.dependencies && !Array.isArray(data.dependencies))) return false
      for (const key3 of Object.keys(data.dependencies)) {
        const sub2 = (() => {
          if (!validate(data.dependencies[key3])) return false
          return true
        })()
        if (!sub2) {
          const sub3 = (() => {
            if (!ref5(data.dependencies[key3])) return false
            return true
          })()
          if (!sub3) return false
        }
      }
    }
    if (data.propertyNames !== undefined && hasOwn(data, "propertyNames")) {
      if (!validate(data.propertyNames)) return false
    }
    if (data.enum !== undefined && hasOwn(data, "enum")) {
      if (!Array.isArray(data.enum)) return false
      if (data.enum.length < 1) return false
      if (!unique(data.enum)) return false
    }
    if (data.type !== undefined && hasOwn(data, "type")) {
      const sub4 = (() => {
        if (!ref6(data.type)) return false
        return true
      })()
      if (!sub4) {
        const sub5 = (() => {
          if (!Array.isArray(data.type)) return false
          if (data.type.length < 1) return false
          for (let l = 0; l < data.type.length; l++) {
            if (data.type[l] !== undefined && hasOwn(data.type, l)) {
              if (!ref6(data.type[l])) return false
            }
          }
          if (!unique(data.type)) return false
          return true
        })()
        if (!sub5) return false
      }
    }
    if (data.format !== undefined && hasOwn(data, "format")) {
      if (!(typeof data.format === "string")) return false
    }
    if (data.allOf !== undefined && hasOwn(data, "allOf")) {
      if (!ref4(data.allOf)) return false
    }
    if (data.anyOf !== undefined && hasOwn(data, "anyOf")) {
      if (!ref4(data.anyOf)) return false
    }
    if (data.oneOf !== undefined && hasOwn(data, "oneOf")) {
      if (!ref4(data.oneOf)) return false
    }
    if (data.not !== undefined && hasOwn(data, "not")) {
      if (!validate(data.not)) return false
    }
  }
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at http://json-schema.org/draft-06/schema#/properties/title`


## property named $ref that is not a reference

### Schema

```json
{ "properties": { "$ref": { "type": "string" } } }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data["$ref"] !== undefined && hasOwn(data, "$ref")) {
      if (!(typeof data["$ref"] === "string")) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/$ref`


## property named $ref, containing an actual $ref

### Schema

```json
{
  "properties": { "$ref": { "$ref": "#/definitions/is-string" } },
  "definitions": { "is-string": { "type": "string" } }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data["$ref"] !== undefined && hasOwn(data, "$ref")) {
      if (!ref1(data["$ref"])) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/$ref`


## $ref to boolean schema true

### Schema

```json
{ "allOf": [{ "$ref": "#/definitions/bool" }], "definitions": { "bool": true } }
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #`


## $ref to boolean schema false

### Schema

```json
{
  "allOf": [{ "$ref": "#/definitions/bool" }],
  "definitions": { "bool": false }
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```


## Recursive references between schemas

### Schema

```json
{
  "$id": "http://localhost:1234/tree",
  "description": "tree of nodes",
  "type": "object",
  "properties": {
    "meta": { "type": "string" },
    "nodes": { "type": "array", "items": { "$ref": "node" } }
  },
  "required": ["meta", "nodes"],
  "definitions": {
    "node": {
      "$id": "http://localhost:1234/node",
      "description": "node",
      "type": "object",
      "properties": {
        "value": { "type": "number" },
        "subtree": { "$ref": "tree" }
      },
      "required": ["value"]
    }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (!(data.value !== undefined && hasOwn(data, "value"))) return false
  if (!(typeof data.value === "number")) return false
  if (data.subtree !== undefined && hasOwn(data, "subtree")) {
    if (!ref0(data.subtree)) return false
  }
  return true
};
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (!(data.meta !== undefined && hasOwn(data, "meta"))) return false
  if (!(data.nodes !== undefined && hasOwn(data, "nodes"))) return false
  if (!(typeof data.meta === "string")) return false
  if (!Array.isArray(data.nodes)) return false
  for (let i = 0; i < data.nodes.length; i++) {
    if (data.nodes[i] !== undefined && hasOwn(data.nodes, i)) {
      if (!ref1(data.nodes[i])) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/meta`


## refs with quote

### Schema

```json
{
  "properties": { "foo\"bar": { "$ref": "#/definitions/foo%22bar" } },
  "definitions": { "foo\"bar": { "type": "number" } }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!(typeof data === "number")) return false
  return true
};
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data["foo\"bar"] !== undefined && hasOwn(data, "foo\"bar")) {
      if (!ref1(data["foo\"bar"])) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## Location-independent identifier

### Schema

```json
{
  "allOf": [{ "$ref": "#foo" }],
  "definitions": { "A": { "$id": "#foo", "type": "integer" } }
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```


## Reference an anchor with a non-relative URI

### Schema

```json
{
  "$id": "https://example.com/schema-with-anchor",
  "allOf": [{ "$ref": "https://example.com/schema-with-anchor#foo" }],
  "definitions": { "A": { "$id": "#foo", "type": "integer" } }
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```


## Location-independent identifier with base URI change in subschema

### Schema

```json
{
  "$id": "http://localhost:1234/root",
  "allOf": [{ "$ref": "http://localhost:1234/nested.json#foo" }],
  "definitions": {
    "A": {
      "$id": "nested.json",
      "definitions": { "B": { "$id": "#foo", "type": "integer" } }
    }
  }
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  if (!Number.isInteger(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```


## naive replacement of $ref with its destination is not correct

### Schema

```json
{
  "definitions": { "a_string": { "type": "string" } },
  "enum": [{ "$ref": "#/definitions/a_string" }]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data) && Object.keys(data).length === 1 && hasOwn(data, "$ref") && data["$ref"] === "#/definitions/a_string")) return false
  return true
};
return ref0
```


## refs with relative uris and defs

### Schema

```json
{
  "$id": "http://example.com/schema-relative-uri-defs1.json",
  "properties": {
    "foo": {
      "$id": "schema-relative-uri-defs2.json",
      "definitions": {
        "inner": { "properties": { "bar": { "type": "string" } } }
      },
      "allOf": [{ "$ref": "#/definitions/inner" }]
    }
  },
  "allOf": [{ "$ref": "schema-relative-uri-defs2.json" }]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!(typeof data.bar === "string")) return false
    }
  }
  return true
};
const ref2 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!ref1(data.foo)) return false
    }
  }
  if (!ref2(data)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at http://example.com/schema-relative-uri-defs2.json#/properties/bar`


## relative refs with absolute uris and defs

### Schema

```json
{
  "$id": "http://example.com/schema-refs-absolute-uris-defs1.json",
  "properties": {
    "foo": {
      "$id": "http://example.com/schema-refs-absolute-uris-defs2.json",
      "definitions": {
        "inner": { "properties": { "bar": { "type": "string" } } }
      },
      "allOf": [{ "$ref": "#/definitions/inner" }]
    }
  },
  "allOf": [{ "$ref": "schema-refs-absolute-uris-defs2.json" }]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!(typeof data.bar === "string")) return false
    }
  }
  return true
};
const ref2 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!ref1(data.foo)) return false
    }
  }
  if (!ref2(data)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at http://example.com/schema-refs-absolute-uris-defs2.json#/properties/bar`


## simple URN base URI with $ref via the URN

### Schema

```json
{
  "$comment": "URIs do not have to have HTTP(s) schemes",
  "$id": "urn:uuid:deadbeef-1234-ffff-ffff-4321feebdaed",
  "minimum": 30,
  "properties": {
    "foo": { "$ref": "urn:uuid:deadbeef-1234-ffff-ffff-4321feebdaed" }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (typeof data === "number") {
    if (!(30 <= data)) return false
  }
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!validate(data.foo)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #/properties/foo`


## simple URN base URI with JSON pointer

### Schema

```json
{
  "$comment": "URIs do not have to have HTTP(s) schemes",
  "$id": "urn:uuid:deadbeef-1234-00ff-ff00-4321feebdaed",
  "properties": { "foo": { "$ref": "#/definitions/bar" } },
  "definitions": { "bar": { "type": "string" } }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!ref1(data.foo)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


## URN base URI with NSS

### Schema

```json
{
  "$comment": "RFC 8141 §2.2",
  "$id": "urn:example:1/406/47452/2",
  "properties": { "foo": { "$ref": "#/definitions/bar" } },
  "definitions": { "bar": { "type": "string" } }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!ref1(data.foo)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


## URN base URI with r-component

### Schema

```json
{
  "$comment": "RFC 8141 §2.3.1",
  "$id": "urn:example:foo-bar-baz-qux?+CCResolve:cc=uk",
  "properties": { "foo": { "$ref": "#/definitions/bar" } },
  "definitions": { "bar": { "type": "string" } }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!ref1(data.foo)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


## URN base URI with q-component

### Schema

```json
{
  "$comment": "RFC 8141 §2.3.2",
  "$id": "urn:example:weather?=op=map&lat=39.56&lon=-104.85&datetime=1969-07-21T02:56:15Z",
  "properties": { "foo": { "$ref": "#/definitions/bar" } },
  "definitions": { "bar": { "type": "string" } }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!ref1(data.foo)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


## URN base URI with URN and JSON pointer ref

### Schema

```json
{
  "$id": "urn:uuid:deadbeef-1234-0000-0000-4321feebdaed",
  "properties": {
    "foo": {
      "$ref": "urn:uuid:deadbeef-1234-0000-0000-4321feebdaed#/definitions/bar"
    }
  },
  "definitions": { "bar": { "type": "string" } }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!ref1(data.foo)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


## URN base URI with URN and anchor ref

### Schema

```json
{
  "$id": "urn:uuid:deadbeef-1234-ff00-00ff-4321feebdaed",
  "properties": {
    "foo": { "$ref": "urn:uuid:deadbeef-1234-ff00-00ff-4321feebdaed#something" }
  },
  "definitions": { "bar": { "$id": "#something", "type": "string" } }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref0 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!ref1(data.foo)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/foo`


## ref with absolute-path-reference

### Schema

```json
{
  "$id": "http://example.com/ref/absref.json",
  "definitions": {
    "a": {
      "$id": "http://example.com/ref/absref/foobar.json",
      "type": "number"
    },
    "b": { "$id": "http://example.com/absref/foobar.json", "type": "string" }
  },
  "allOf": [{ "$ref": "/absref/foobar.json" }]
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #`


## $id with file URI still resolves pointers - *nix

### Schema

```json
{
  "$id": "file:///folder/file.json",
  "definitions": { "foo": { "type": "number" } },
  "allOf": [{ "$ref": "#/definitions/foo" }]
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  if (!(typeof data === "number")) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```


## $id with file URI still resolves pointers - windows

### Schema

```json
{
  "$id": "file:///c:/folder/file.json",
  "definitions": { "foo": { "type": "number" } },
  "allOf": [{ "$ref": "#/definitions/foo" }]
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  if (!(typeof data === "number")) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```


## empty tokens in $ref json-pointer

### Schema

```json
{
  "definitions": { "": { "definitions": { "": { "type": "number" } } } },
  "allOf": [{ "$ref": "#/definitions//definitions/" }]
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  if (!(typeof data === "number")) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```

