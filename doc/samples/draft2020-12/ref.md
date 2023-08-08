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
{ "prefixItems": [{ "type": "integer" }, { "$ref": "#/prefixItems/0" }] }
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
  "$defs": {
    "tilde~field": { "type": "integer" },
    "slash/field": { "type": "integer" },
    "percent%field": { "type": "integer" }
  },
  "properties": {
    "tilde": { "$ref": "#/$defs/tilde~0field" },
    "slash": { "$ref": "#/$defs/slash~1field" },
    "percent": { "$ref": "#/$defs/percent%25field" }
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
  "$defs": {
    "a": { "type": "integer" },
    "b": { "$ref": "#/$defs/a" },
    "c": { "$ref": "#/$defs/b" }
  },
  "$ref": "#/$defs/c"
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


## ref applies alongside sibling keywords

### Schema

```json
{
  "$defs": { "reffed": { "type": "array" } },
  "properties": { "foo": { "$ref": "#/$defs/reffed", "maxItems": 2 } }
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
      if (data.foo.length > 2) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] items rule should be specified at #/properties/foo`


## remote ref, containing refs itself

### Schema

```json
{ "$ref": "https://json-schema.org/draft/2020-12/schema" }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const dynamicResolve = (anchors, id) => (anchors.filter((x) => x[id])[0] || {})[id];
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
const ref2 = function validate(data, dynAnchors) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!(typeof data[i] === "string")) return false
    }
  }
  if (!unique(data)) return false
  return true
};
const pattern0 = new RegExp("^[A-Za-z_][-A-Za-z0-9._]*$", "u");
const ref3 = function validate(data, dynAnchors) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
const format0 = new RegExp("^(?:[a-z][a-z0-9+\\-.]*:)?(?:\\/?\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\\.[a-z0-9\\-._~!$&'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)|(?:[a-z0-9\\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\\/?(?:(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)?(?:\\?(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$", "i");
const ref4 = function validate(data, dynAnchors) {
  if (!(typeof data === "string")) return false
  if (!format0.test(data)) return false
  return true
};
const pattern1 = new RegExp("^[^#]*#?$", "u");
const format1 = new RegExp("^[a-z][a-z0-9+\\-.]*:(?:\\/?\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\\.[a-z0-9\\-._~!$&'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)|(?:[a-z0-9\\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\\/?(?:(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)(?:\\?(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$", "i");
const ref6 = function validate(data, dynAnchors) {
  if (!(typeof data === "string")) return false
  if (!format1.test(data)) return false
  return true
};
const ref5 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#meta"] = validate
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data["$id"] !== undefined && hasOwn(data, "$id")) {
      if (!ref4(data["$id"], [...dynAnchors, dynLocal[0] || []])) return false
      if (!(pattern1.test(data["$id"]))) return false
    }
    if (data["$schema"] !== undefined && hasOwn(data, "$schema")) {
      if (!ref6(data["$schema"], [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data["$ref"] !== undefined && hasOwn(data, "$ref")) {
      if (!ref4(data["$ref"], [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data["$anchor"] !== undefined && hasOwn(data, "$anchor")) {
      if (!ref3(data["$anchor"], [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data["$dynamicRef"] !== undefined && hasOwn(data, "$dynamicRef")) {
      if (!ref4(data["$dynamicRef"], [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data["$dynamicAnchor"] !== undefined && hasOwn(data, "$dynamicAnchor")) {
      if (!ref3(data["$dynamicAnchor"], [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data["$vocabulary"] !== undefined && hasOwn(data, "$vocabulary")) {
      if (!(typeof data["$vocabulary"] === "object" && data["$vocabulary"] && !Array.isArray(data["$vocabulary"]))) return false
      for (const key2 of Object.keys(data["$vocabulary"])) {
        if (!ref6(key2, [...dynAnchors, dynLocal[0] || []])) return false
      }
      for (const key3 of Object.keys(data["$vocabulary"])) {
        if (!(typeof data["$vocabulary"][key3] === "boolean")) return false
      }
    }
    if (data["$comment"] !== undefined && hasOwn(data, "$comment")) {
      if (!(typeof data["$comment"] === "string")) return false
    }
    if (data["$defs"] !== undefined && hasOwn(data, "$defs")) {
      if (!(typeof data["$defs"] === "object" && data["$defs"] && !Array.isArray(data["$defs"]))) return false
      for (const key4 of Object.keys(data["$defs"])) {
        if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data["$defs"][key4], [...dynAnchors, dynLocal[0] || []])) return false
      }
    }
  }
  return true
};
const ref8 = function validate(data, dynAnchors) {
  if (!Array.isArray(data)) return false
  if (data.length < 1) return false
  for (let j = 0; j < data.length; j++) {
    if (data[j] !== undefined && hasOwn(data, j)) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || ref7)(data[j], dynAnchors)) return false
    }
  }
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
const ref7 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#meta"] = validate
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.prefixItems !== undefined && hasOwn(data, "prefixItems")) {
      if (!ref8(data.prefixItems, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.items !== undefined && hasOwn(data, "items")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.items, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.contains !== undefined && hasOwn(data, "contains")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.contains, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.additionalProperties !== undefined && hasOwn(data, "additionalProperties")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.additionalProperties, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.properties !== undefined && hasOwn(data, "properties")) {
      if (!(typeof data.properties === "object" && data.properties && !Array.isArray(data.properties))) return false
      for (const key5 of Object.keys(data.properties)) {
        if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.properties[key5], [...dynAnchors, dynLocal[0] || []])) return false
      }
    }
    if (data.patternProperties !== undefined && hasOwn(data, "patternProperties")) {
      if (!(typeof data.patternProperties === "object" && data.patternProperties && !Array.isArray(data.patternProperties))) return false
      for (const key6 of Object.keys(data.patternProperties)) {
        if (!format2(key6)) return false
      }
      for (const key7 of Object.keys(data.patternProperties)) {
        if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.patternProperties[key7], [...dynAnchors, dynLocal[0] || []])) return false
      }
    }
    if (data.dependentSchemas !== undefined && hasOwn(data, "dependentSchemas")) {
      if (!(typeof data.dependentSchemas === "object" && data.dependentSchemas && !Array.isArray(data.dependentSchemas))) return false
      for (const key8 of Object.keys(data.dependentSchemas)) {
        if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.dependentSchemas[key8], [...dynAnchors, dynLocal[0] || []])) return false
      }
    }
    if (data.propertyNames !== undefined && hasOwn(data, "propertyNames")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.propertyNames, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.if !== undefined && hasOwn(data, "if")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.if, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.then !== undefined && hasOwn(data, "then")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.then, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.else !== undefined && hasOwn(data, "else")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.else, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.allOf !== undefined && hasOwn(data, "allOf")) {
      if (!ref8(data.allOf, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.anyOf !== undefined && hasOwn(data, "anyOf")) {
      if (!ref8(data.anyOf, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.oneOf !== undefined && hasOwn(data, "oneOf")) {
      if (!ref8(data.oneOf, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.not !== undefined && hasOwn(data, "not")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.not, [...dynAnchors, dynLocal[0] || []])) return false
    }
  }
  return true
};
const ref9 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#meta"] = validate
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.unevaluatedItems !== undefined && hasOwn(data, "unevaluatedItems")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.unevaluatedItems, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.unevaluatedProperties !== undefined && hasOwn(data, "unevaluatedProperties")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.unevaluatedProperties, [...dynAnchors, dynLocal[0] || []])) return false
    }
  }
  return true
};
const ref11 = function validate(data, dynAnchors) {
  if (!(data === "array" || data === "boolean" || data === "integer" || data === "null" || data === "number" || data === "object" || data === "string")) return false
  return true
};
const ref12 = function validate(data, dynAnchors) {
  if (!Number.isInteger(data)) return false
  if (!(0 <= data)) return false
  return true
};
const ref13 = function validate(data, dynAnchors) {
  if (!ref12(data, dynAnchors)) return false
  return true
};
const ref10 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#meta"] = validate
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.type !== undefined && hasOwn(data, "type")) {
      const sub2 = (() => {
        if (!ref11(data.type, [...dynAnchors, dynLocal[0] || []])) return false
        return true
      })()
      const sub3 = (() => {
        if (!Array.isArray(data.type)) return false
        if (data.type.length < 1) return false
        for (let k = 0; k < data.type.length; k++) {
          if (data.type[k] !== undefined && hasOwn(data.type, k)) {
            if (!ref11(data.type[k], [...dynAnchors, dynLocal[0] || []])) return false
          }
        }
        if (!unique(data.type)) return false
        return true
      })()
      if (!(sub2 || sub3)) return false
    }
    if (data.enum !== undefined && hasOwn(data, "enum")) {
      if (!Array.isArray(data.enum)) return false
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
      if (!ref12(data.maxLength, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.minLength !== undefined && hasOwn(data, "minLength")) {
      if (!ref13(data.minLength, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.pattern !== undefined && hasOwn(data, "pattern")) {
      if (!(typeof data.pattern === "string")) return false
      if (!format2(data.pattern)) return false
    }
    if (data.maxItems !== undefined && hasOwn(data, "maxItems")) {
      if (!ref12(data.maxItems, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.minItems !== undefined && hasOwn(data, "minItems")) {
      if (!ref13(data.minItems, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.uniqueItems !== undefined && hasOwn(data, "uniqueItems")) {
      if (!(typeof data.uniqueItems === "boolean")) return false
    }
    if (data.maxContains !== undefined && hasOwn(data, "maxContains")) {
      if (!ref12(data.maxContains, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.minContains !== undefined && hasOwn(data, "minContains")) {
      if (!ref12(data.minContains, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.maxProperties !== undefined && hasOwn(data, "maxProperties")) {
      if (!ref12(data.maxProperties, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.minProperties !== undefined && hasOwn(data, "minProperties")) {
      if (!ref13(data.minProperties, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.required !== undefined && hasOwn(data, "required")) {
      if (!ref2(data.required, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.dependentRequired !== undefined && hasOwn(data, "dependentRequired")) {
      if (!(typeof data.dependentRequired === "object" && data.dependentRequired && !Array.isArray(data.dependentRequired))) return false
      for (const key9 of Object.keys(data.dependentRequired)) {
        if (!ref2(data.dependentRequired[key9], [...dynAnchors, dynLocal[0] || []])) return false
      }
    }
  }
  return true
};
const ref14 = function validate(data, dynAnchors) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.title !== undefined && hasOwn(data, "title")) {
      if (!(typeof data.title === "string")) return false
    }
    if (data.description !== undefined && hasOwn(data, "description")) {
      if (!(typeof data.description === "string")) return false
    }
    if (data.deprecated !== undefined && hasOwn(data, "deprecated")) {
      if (!(typeof data.deprecated === "boolean")) return false
    }
    if (data.readOnly !== undefined && hasOwn(data, "readOnly")) {
      if (!(typeof data.readOnly === "boolean")) return false
    }
    if (data.writeOnly !== undefined && hasOwn(data, "writeOnly")) {
      if (!(typeof data.writeOnly === "boolean")) return false
    }
    if (data.examples !== undefined && hasOwn(data, "examples")) {
      if (!Array.isArray(data.examples)) return false
    }
  }
  return true
};
const ref15 = function validate(data, dynAnchors) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.format !== undefined && hasOwn(data, "format")) {
      if (!(typeof data.format === "string")) return false
    }
  }
  return true
};
const ref16 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#meta"] = validate
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.contentEncoding !== undefined && hasOwn(data, "contentEncoding")) {
      if (!(typeof data.contentEncoding === "string")) return false
    }
    if (data.contentMediaType !== undefined && hasOwn(data, "contentMediaType")) {
      if (!(typeof data.contentMediaType === "string")) return false
    }
    if (data.contentSchema !== undefined && hasOwn(data, "contentSchema")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.contentSchema, [...dynAnchors, dynLocal[0] || []])) return false
    }
  }
  return true
};
const ref1 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#meta"] = validate
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.definitions !== undefined && hasOwn(data, "definitions")) {
      if (!(typeof data.definitions === "object" && data.definitions && !Array.isArray(data.definitions))) return false
      for (const key0 of Object.keys(data.definitions)) {
        if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.definitions[key0], [...dynAnchors, dynLocal[0] || []])) return false
      }
    }
    if (data.dependencies !== undefined && hasOwn(data, "dependencies")) {
      if (!(typeof data.dependencies === "object" && data.dependencies && !Array.isArray(data.dependencies))) return false
      for (const key1 of Object.keys(data.dependencies)) {
        const sub0 = (() => {
          if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.dependencies[key1], [...dynAnchors, dynLocal[0] || []])) return false
          return true
        })()
        const sub1 = (() => {
          if (!ref2(data.dependencies[key1], [...dynAnchors, dynLocal[0] || []])) return false
          return true
        })()
        if (!(sub0 || sub1)) return false
      }
    }
    if (data["$recursiveAnchor"] !== undefined && hasOwn(data, "$recursiveAnchor")) {
      if (!ref3(data["$recursiveAnchor"], [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data["$recursiveRef"] !== undefined && hasOwn(data, "$recursiveRef")) {
      if (!ref4(data["$recursiveRef"], [...dynAnchors, dynLocal[0] || []])) return false
    }
  }
  if (!ref5(data, [...dynAnchors, dynLocal[0] || []])) return false
  if (!ref7(data, [...dynAnchors, dynLocal[0] || []])) return false
  if (!ref9(data, [...dynAnchors, dynLocal[0] || []])) return false
  if (!ref10(data, [...dynAnchors, dynLocal[0] || []])) return false
  if (!ref14(data, [...dynAnchors, dynLocal[0] || []])) return false
  if (!ref15(data, [...dynAnchors, dynLocal[0] || []])) return false
  if (!ref16(data, [...dynAnchors, dynLocal[0] || []])) return false
  return true
};
const ref0 = function validate(data, dynAnchors) {
  if (!ref1(data, dynAnchors)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at https://json-schema.org/draft/2020-12/schema#/properties/definitions/additionalProperties`


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
  "properties": { "$ref": { "$ref": "#/$defs/is-string" } },
  "$defs": { "is-string": { "type": "string" } }
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
{ "$ref": "#/$defs/bool", "$defs": { "bool": true } }
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
{ "$ref": "#/$defs/bool", "$defs": { "bool": false } }
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
  "$id": "http://localhost:1234/draft2020-12/tree",
  "description": "tree of nodes",
  "type": "object",
  "properties": {
    "meta": { "type": "string" },
    "nodes": { "type": "array", "items": { "$ref": "node" } }
  },
  "required": ["meta", "nodes"],
  "$defs": {
    "node": {
      "$id": "http://localhost:1234/draft2020-12/node",
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
  "properties": { "foo\"bar": { "$ref": "#/$defs/foo%22bar" } },
  "$defs": { "foo\"bar": { "type": "number" } }
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


## ref creates new scope when adjacent to keywords

### Schema

```json
{
  "$defs": { "A": { "unevaluatedProperties": false } },
  "properties": { "prop1": { "type": "string" } },
  "$ref": "#/$defs/A"
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key0 of Object.keys(data)) return false
  }
  return true
};
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.prop1 !== undefined && hasOwn(data, "prop1")) {
      if (!(typeof data.prop1 === "string")) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/properties/prop1`


## naive replacement of $ref with its destination is not correct

### Schema

```json
{
  "$defs": { "a_string": { "type": "string" } },
  "enum": [{ "$ref": "#/$defs/a_string" }]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data) && Object.keys(data).length === 1 && hasOwn(data, "$ref") && data["$ref"] === "#/$defs/a_string")) return false
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
      "$defs": { "inner": { "properties": { "bar": { "type": "string" } } } },
      "$ref": "#/$defs/inner"
    }
  },
  "$ref": "schema-relative-uri-defs2.json"
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref2 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!(typeof data.bar === "string")) return false
    }
  }
  return true
};
const ref1 = function validate(data) {
  if (!ref2(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!ref2(data.foo)) return false
    }
  }
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
      "$defs": { "inner": { "properties": { "bar": { "type": "string" } } } },
      "$ref": "#/$defs/inner"
    }
  },
  "$ref": "schema-refs-absolute-uris-defs2.json"
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref2 = function validate(data) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.bar !== undefined && hasOwn(data, "bar")) {
      if (!(typeof data.bar === "string")) return false
    }
  }
  return true
};
const ref1 = function validate(data) {
  if (!ref2(data)) return false
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!ref2(data.foo)) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at http://example.com/schema-refs-absolute-uris-defs2.json#/properties/bar`


## $id must be resolved against nearest parent, not just immediate parent

### Schema

```json
{
  "$id": "http://example.com/a.json",
  "$defs": {
    "x": {
      "$id": "http://example.com/b/c.json",
      "not": { "$defs": { "y": { "$id": "d.json", "type": "number" } } }
    }
  },
  "allOf": [{ "$ref": "http://example.com/b/d.json" }]
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


## order of evaluation: $id and $ref

### Schema

```json
{
  "$comment": "$id must be evaluated before $ref to get the proper $ref destination",
  "$id": "https://example.com/draft2020-12/ref-and-id1/base.json",
  "$ref": "int.json",
  "$defs": {
    "bigint": {
      "$comment": "canonical uri: https://example.com/ref-and-id1/int.json",
      "$id": "int.json",
      "maximum": 10
    },
    "smallint": {
      "$comment": "canonical uri: https://example.com/ref-and-id1-int.json",
      "$id": "/draft2020-12/ref-and-id1-int.json",
      "maximum": 2
    }
  }
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  if (typeof data === "number") {
    if (!(10 >= data)) return false
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

 * `[requireValidation] type should be specified at #`


## order of evaluation: $id and $anchor and $ref

### Schema

```json
{
  "$comment": "$id must be evaluated before $ref to get the proper $ref destination",
  "$id": "https://example.com/draft2020-12/ref-and-id2/base.json",
  "$ref": "#bigint",
  "$defs": {
    "bigint": {
      "$comment": "canonical uri: /ref-and-id2/base.json#/$defs/bigint; another valid uri for this location: /ref-and-id2/base.json#bigint",
      "$anchor": "bigint",
      "maximum": 10
    },
    "smallint": {
      "$comment": "canonical uri: https://example.com/ref-and-id2#/$defs/smallint; another valid uri for this location: https://example.com/ref-and-id2/#bigint",
      "$id": "https://example.com/draft2020-12/ref-and-id2/",
      "$anchor": "bigint",
      "maximum": 2
    }
  }
}
```

### Code

```js
'use strict'
const ref1 = function validate(data) {
  if (typeof data === "number") {
    if (!(10 >= data)) return false
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

 * `[requireValidation] type should be specified at #`


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
  "properties": { "foo": { "$ref": "#/$defs/bar" } },
  "$defs": { "bar": { "type": "string" } }
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
  "properties": { "foo": { "$ref": "#/$defs/bar" } },
  "$defs": { "bar": { "type": "string" } }
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
  "properties": { "foo": { "$ref": "#/$defs/bar" } },
  "$defs": { "bar": { "type": "string" } }
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
  "properties": { "foo": { "$ref": "#/$defs/bar" } },
  "$defs": { "bar": { "type": "string" } }
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


## URN base URI with f-component

### Schema

```json
{
  "$comment": "RFC 8141 §2.3.3, but we don't allow fragments",
  "$ref": "https://json-schema.org/draft/2020-12/schema"
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const dynamicResolve = (anchors, id) => (anchors.filter((x) => x[id])[0] || {})[id];
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
const ref2 = function validate(data, dynAnchors) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!(typeof data[i] === "string")) return false
    }
  }
  if (!unique(data)) return false
  return true
};
const pattern0 = new RegExp("^[A-Za-z_][-A-Za-z0-9._]*$", "u");
const ref3 = function validate(data, dynAnchors) {
  if (!(typeof data === "string")) return false
  if (!pattern0.test(data)) return false
  return true
};
const format0 = new RegExp("^(?:[a-z][a-z0-9+\\-.]*:)?(?:\\/?\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\\.[a-z0-9\\-._~!$&'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)|(?:[a-z0-9\\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\\/?(?:(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)?(?:\\?(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$", "i");
const ref4 = function validate(data, dynAnchors) {
  if (!(typeof data === "string")) return false
  if (!format0.test(data)) return false
  return true
};
const pattern1 = new RegExp("^[^#]*#?$", "u");
const format1 = new RegExp("^[a-z][a-z0-9+\\-.]*:(?:\\/?\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\\.[a-z0-9\\-._~!$&'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)|(?:[a-z0-9\\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\\/?(?:(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)(?:\\?(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$", "i");
const ref6 = function validate(data, dynAnchors) {
  if (!(typeof data === "string")) return false
  if (!format1.test(data)) return false
  return true
};
const ref5 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#meta"] = validate
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data["$id"] !== undefined && hasOwn(data, "$id")) {
      if (!ref4(data["$id"], [...dynAnchors, dynLocal[0] || []])) return false
      if (!(pattern1.test(data["$id"]))) return false
    }
    if (data["$schema"] !== undefined && hasOwn(data, "$schema")) {
      if (!ref6(data["$schema"], [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data["$ref"] !== undefined && hasOwn(data, "$ref")) {
      if (!ref4(data["$ref"], [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data["$anchor"] !== undefined && hasOwn(data, "$anchor")) {
      if (!ref3(data["$anchor"], [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data["$dynamicRef"] !== undefined && hasOwn(data, "$dynamicRef")) {
      if (!ref4(data["$dynamicRef"], [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data["$dynamicAnchor"] !== undefined && hasOwn(data, "$dynamicAnchor")) {
      if (!ref3(data["$dynamicAnchor"], [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data["$vocabulary"] !== undefined && hasOwn(data, "$vocabulary")) {
      if (!(typeof data["$vocabulary"] === "object" && data["$vocabulary"] && !Array.isArray(data["$vocabulary"]))) return false
      for (const key2 of Object.keys(data["$vocabulary"])) {
        if (!ref6(key2, [...dynAnchors, dynLocal[0] || []])) return false
      }
      for (const key3 of Object.keys(data["$vocabulary"])) {
        if (!(typeof data["$vocabulary"][key3] === "boolean")) return false
      }
    }
    if (data["$comment"] !== undefined && hasOwn(data, "$comment")) {
      if (!(typeof data["$comment"] === "string")) return false
    }
    if (data["$defs"] !== undefined && hasOwn(data, "$defs")) {
      if (!(typeof data["$defs"] === "object" && data["$defs"] && !Array.isArray(data["$defs"]))) return false
      for (const key4 of Object.keys(data["$defs"])) {
        if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data["$defs"][key4], [...dynAnchors, dynLocal[0] || []])) return false
      }
    }
  }
  return true
};
const ref8 = function validate(data, dynAnchors) {
  if (!Array.isArray(data)) return false
  if (data.length < 1) return false
  for (let j = 0; j < data.length; j++) {
    if (data[j] !== undefined && hasOwn(data, j)) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || ref7)(data[j], dynAnchors)) return false
    }
  }
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
const ref7 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#meta"] = validate
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.prefixItems !== undefined && hasOwn(data, "prefixItems")) {
      if (!ref8(data.prefixItems, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.items !== undefined && hasOwn(data, "items")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.items, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.contains !== undefined && hasOwn(data, "contains")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.contains, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.additionalProperties !== undefined && hasOwn(data, "additionalProperties")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.additionalProperties, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.properties !== undefined && hasOwn(data, "properties")) {
      if (!(typeof data.properties === "object" && data.properties && !Array.isArray(data.properties))) return false
      for (const key5 of Object.keys(data.properties)) {
        if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.properties[key5], [...dynAnchors, dynLocal[0] || []])) return false
      }
    }
    if (data.patternProperties !== undefined && hasOwn(data, "patternProperties")) {
      if (!(typeof data.patternProperties === "object" && data.patternProperties && !Array.isArray(data.patternProperties))) return false
      for (const key6 of Object.keys(data.patternProperties)) {
        if (!format2(key6)) return false
      }
      for (const key7 of Object.keys(data.patternProperties)) {
        if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.patternProperties[key7], [...dynAnchors, dynLocal[0] || []])) return false
      }
    }
    if (data.dependentSchemas !== undefined && hasOwn(data, "dependentSchemas")) {
      if (!(typeof data.dependentSchemas === "object" && data.dependentSchemas && !Array.isArray(data.dependentSchemas))) return false
      for (const key8 of Object.keys(data.dependentSchemas)) {
        if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.dependentSchemas[key8], [...dynAnchors, dynLocal[0] || []])) return false
      }
    }
    if (data.propertyNames !== undefined && hasOwn(data, "propertyNames")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.propertyNames, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.if !== undefined && hasOwn(data, "if")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.if, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.then !== undefined && hasOwn(data, "then")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.then, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.else !== undefined && hasOwn(data, "else")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.else, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.allOf !== undefined && hasOwn(data, "allOf")) {
      if (!ref8(data.allOf, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.anyOf !== undefined && hasOwn(data, "anyOf")) {
      if (!ref8(data.anyOf, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.oneOf !== undefined && hasOwn(data, "oneOf")) {
      if (!ref8(data.oneOf, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.not !== undefined && hasOwn(data, "not")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.not, [...dynAnchors, dynLocal[0] || []])) return false
    }
  }
  return true
};
const ref9 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#meta"] = validate
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.unevaluatedItems !== undefined && hasOwn(data, "unevaluatedItems")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.unevaluatedItems, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.unevaluatedProperties !== undefined && hasOwn(data, "unevaluatedProperties")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.unevaluatedProperties, [...dynAnchors, dynLocal[0] || []])) return false
    }
  }
  return true
};
const ref11 = function validate(data, dynAnchors) {
  if (!(data === "array" || data === "boolean" || data === "integer" || data === "null" || data === "number" || data === "object" || data === "string")) return false
  return true
};
const ref12 = function validate(data, dynAnchors) {
  if (!Number.isInteger(data)) return false
  if (!(0 <= data)) return false
  return true
};
const ref13 = function validate(data, dynAnchors) {
  if (!ref12(data, dynAnchors)) return false
  return true
};
const ref10 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#meta"] = validate
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.type !== undefined && hasOwn(data, "type")) {
      const sub2 = (() => {
        if (!ref11(data.type, [...dynAnchors, dynLocal[0] || []])) return false
        return true
      })()
      const sub3 = (() => {
        if (!Array.isArray(data.type)) return false
        if (data.type.length < 1) return false
        for (let k = 0; k < data.type.length; k++) {
          if (data.type[k] !== undefined && hasOwn(data.type, k)) {
            if (!ref11(data.type[k], [...dynAnchors, dynLocal[0] || []])) return false
          }
        }
        if (!unique(data.type)) return false
        return true
      })()
      if (!(sub2 || sub3)) return false
    }
    if (data.enum !== undefined && hasOwn(data, "enum")) {
      if (!Array.isArray(data.enum)) return false
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
      if (!ref12(data.maxLength, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.minLength !== undefined && hasOwn(data, "minLength")) {
      if (!ref13(data.minLength, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.pattern !== undefined && hasOwn(data, "pattern")) {
      if (!(typeof data.pattern === "string")) return false
      if (!format2(data.pattern)) return false
    }
    if (data.maxItems !== undefined && hasOwn(data, "maxItems")) {
      if (!ref12(data.maxItems, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.minItems !== undefined && hasOwn(data, "minItems")) {
      if (!ref13(data.minItems, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.uniqueItems !== undefined && hasOwn(data, "uniqueItems")) {
      if (!(typeof data.uniqueItems === "boolean")) return false
    }
    if (data.maxContains !== undefined && hasOwn(data, "maxContains")) {
      if (!ref12(data.maxContains, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.minContains !== undefined && hasOwn(data, "minContains")) {
      if (!ref12(data.minContains, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.maxProperties !== undefined && hasOwn(data, "maxProperties")) {
      if (!ref12(data.maxProperties, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.minProperties !== undefined && hasOwn(data, "minProperties")) {
      if (!ref13(data.minProperties, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.required !== undefined && hasOwn(data, "required")) {
      if (!ref2(data.required, [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data.dependentRequired !== undefined && hasOwn(data, "dependentRequired")) {
      if (!(typeof data.dependentRequired === "object" && data.dependentRequired && !Array.isArray(data.dependentRequired))) return false
      for (const key9 of Object.keys(data.dependentRequired)) {
        if (!ref2(data.dependentRequired[key9], [...dynAnchors, dynLocal[0] || []])) return false
      }
    }
  }
  return true
};
const ref14 = function validate(data, dynAnchors) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.title !== undefined && hasOwn(data, "title")) {
      if (!(typeof data.title === "string")) return false
    }
    if (data.description !== undefined && hasOwn(data, "description")) {
      if (!(typeof data.description === "string")) return false
    }
    if (data.deprecated !== undefined && hasOwn(data, "deprecated")) {
      if (!(typeof data.deprecated === "boolean")) return false
    }
    if (data.readOnly !== undefined && hasOwn(data, "readOnly")) {
      if (!(typeof data.readOnly === "boolean")) return false
    }
    if (data.writeOnly !== undefined && hasOwn(data, "writeOnly")) {
      if (!(typeof data.writeOnly === "boolean")) return false
    }
    if (data.examples !== undefined && hasOwn(data, "examples")) {
      if (!Array.isArray(data.examples)) return false
    }
  }
  return true
};
const ref15 = function validate(data, dynAnchors) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.format !== undefined && hasOwn(data, "format")) {
      if (!(typeof data.format === "string")) return false
    }
  }
  return true
};
const ref16 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#meta"] = validate
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.contentEncoding !== undefined && hasOwn(data, "contentEncoding")) {
      if (!(typeof data.contentEncoding === "string")) return false
    }
    if (data.contentMediaType !== undefined && hasOwn(data, "contentMediaType")) {
      if (!(typeof data.contentMediaType === "string")) return false
    }
    if (data.contentSchema !== undefined && hasOwn(data, "contentSchema")) {
      if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.contentSchema, [...dynAnchors, dynLocal[0] || []])) return false
    }
  }
  return true
};
const ref1 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#meta"] = validate
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.definitions !== undefined && hasOwn(data, "definitions")) {
      if (!(typeof data.definitions === "object" && data.definitions && !Array.isArray(data.definitions))) return false
      for (const key0 of Object.keys(data.definitions)) {
        if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.definitions[key0], [...dynAnchors, dynLocal[0] || []])) return false
      }
    }
    if (data.dependencies !== undefined && hasOwn(data, "dependencies")) {
      if (!(typeof data.dependencies === "object" && data.dependencies && !Array.isArray(data.dependencies))) return false
      for (const key1 of Object.keys(data.dependencies)) {
        const sub0 = (() => {
          if (!(dynamicResolve(dynAnchors || [], "#meta") || validate)(data.dependencies[key1], [...dynAnchors, dynLocal[0] || []])) return false
          return true
        })()
        const sub1 = (() => {
          if (!ref2(data.dependencies[key1], [...dynAnchors, dynLocal[0] || []])) return false
          return true
        })()
        if (!(sub0 || sub1)) return false
      }
    }
    if (data["$recursiveAnchor"] !== undefined && hasOwn(data, "$recursiveAnchor")) {
      if (!ref3(data["$recursiveAnchor"], [...dynAnchors, dynLocal[0] || []])) return false
    }
    if (data["$recursiveRef"] !== undefined && hasOwn(data, "$recursiveRef")) {
      if (!ref4(data["$recursiveRef"], [...dynAnchors, dynLocal[0] || []])) return false
    }
  }
  if (!ref5(data, [...dynAnchors, dynLocal[0] || []])) return false
  if (!ref7(data, [...dynAnchors, dynLocal[0] || []])) return false
  if (!ref9(data, [...dynAnchors, dynLocal[0] || []])) return false
  if (!ref10(data, [...dynAnchors, dynLocal[0] || []])) return false
  if (!ref14(data, [...dynAnchors, dynLocal[0] || []])) return false
  if (!ref15(data, [...dynAnchors, dynLocal[0] || []])) return false
  if (!ref16(data, [...dynAnchors, dynLocal[0] || []])) return false
  return true
};
const ref0 = function validate(data, dynAnchors) {
  if (!ref1(data, dynAnchors)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at https://json-schema.org/draft/2020-12/schema#/properties/definitions/additionalProperties`


## URN base URI with URN and JSON pointer ref

### Schema

```json
{
  "$id": "urn:uuid:deadbeef-1234-0000-0000-4321feebdaed",
  "properties": {
    "foo": {
      "$ref": "urn:uuid:deadbeef-1234-0000-0000-4321feebdaed#/$defs/bar"
    }
  },
  "$defs": { "bar": { "type": "string" } }
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
  "$defs": { "bar": { "$anchor": "something", "type": "string" } }
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


## URN ref with nested pointer ref

### Schema

```json
{
  "$ref": "urn:uuid:deadbeef-4321-ffff-ffff-1234feebdaed",
  "$defs": {
    "foo": {
      "$id": "urn:uuid:deadbeef-4321-ffff-ffff-1234feebdaed",
      "$defs": { "bar": { "type": "string" } },
      "$ref": "#/$defs/bar"
    }
  }
}
```

### Code

```js
'use strict'
const ref2 = function validate(data) {
  if (!(typeof data === "string")) return false
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

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #`


## ref to if

### Schema

```json
{
  "$ref": "http://example.com/ref/if",
  "if": { "$id": "http://example.com/ref/if", "type": "integer" }
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
  const sub0 = (() => {
    return true
  })()
  return true
};
return ref0
```

### Warnings

 * `Unprocessed keywords: ["if"] at #`


## ref to then

### Schema

```json
{
  "$ref": "http://example.com/ref/then",
  "then": { "$id": "http://example.com/ref/then", "type": "integer" }
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

### Warnings

 * `Unprocessed keywords: ["then"] at #`


## ref to else

### Schema

```json
{
  "$ref": "http://example.com/ref/else",
  "else": { "$id": "http://example.com/ref/else", "type": "integer" }
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

### Warnings

 * `Unprocessed keywords: ["else"] at #`


## ref with absolute-path-reference

### Schema

```json
{
  "$id": "http://example.com/ref/absref.json",
  "$defs": {
    "a": {
      "$id": "http://example.com/ref/absref/foobar.json",
      "type": "number"
    },
    "b": { "$id": "http://example.com/absref/foobar.json", "type": "string" }
  },
  "$ref": "/absref/foobar.json"
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
  "$defs": { "foo": { "type": "number" } },
  "$ref": "#/$defs/foo"
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
  "$defs": { "foo": { "type": "number" } },
  "$ref": "#/$defs/foo"
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
  "$defs": { "": { "$defs": { "": { "type": "number" } } } },
  "allOf": [{ "$ref": "#/$defs//$defs/" }]
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

