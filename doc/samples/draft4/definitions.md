# definitions

## validate definition against metaschema

### Schema

```json
{ "$ref": "http://json-schema.org/draft-04/schema#" }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref2 = function validate(data) {
  if (!Number.isInteger(data)) return false
  if (!(0 <= data)) return false
  return true
};
const ref3 = function validate(data) {
  if (!ref2(data)) return false
  return true
};
const format0 = (str) => {
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
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!ref1(data[i])) return false
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
  if (data.length < 1) return false
  for (let j = 0; j < data.length; j++) {
    if (data[j] !== undefined && hasOwn(data, j)) {
      if (!(typeof data[j] === "string")) return false
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
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.exclusiveMaximum !== undefined && hasOwn(data, "exclusiveMaximum") && !(data.maximum !== undefined && hasOwn(data, "maximum"))) return false
  if (data.exclusiveMinimum !== undefined && hasOwn(data, "exclusiveMinimum") && !(data.minimum !== undefined && hasOwn(data, "minimum"))) return false
  if (data.id !== undefined && hasOwn(data, "id")) {
    if (!(typeof data.id === "string")) return false
  }
  if (data["$schema"] !== undefined && hasOwn(data, "$schema")) {
    if (!(typeof data["$schema"] === "string")) return false
  }
  if (data.title !== undefined && hasOwn(data, "title")) {
    if (!(typeof data.title === "string")) return false
  }
  if (data.description !== undefined && hasOwn(data, "description")) {
    if (!(typeof data.description === "string")) return false
  }
  if (data.multipleOf !== undefined && hasOwn(data, "multipleOf")) {
    if (!(typeof data.multipleOf === "number")) return false
    if (!(0 < data.multipleOf)) return false
  }
  if (data.maximum !== undefined && hasOwn(data, "maximum")) {
    if (!(typeof data.maximum === "number")) return false
  }
  if (data.exclusiveMaximum !== undefined && hasOwn(data, "exclusiveMaximum")) {
    if (!(typeof data.exclusiveMaximum === "boolean")) return false
  }
  if (data.minimum !== undefined && hasOwn(data, "minimum")) {
    if (!(typeof data.minimum === "number")) return false
  }
  if (data.exclusiveMinimum !== undefined && hasOwn(data, "exclusiveMinimum")) {
    if (!(typeof data.exclusiveMinimum === "boolean")) return false
  }
  if (data.maxLength !== undefined && hasOwn(data, "maxLength")) {
    if (!ref2(data.maxLength)) return false
  }
  if (data.minLength !== undefined && hasOwn(data, "minLength")) {
    if (!ref3(data.minLength)) return false
  }
  if (data.pattern !== undefined && hasOwn(data, "pattern")) {
    if (!(typeof data.pattern === "string")) return false
    if (!format0(data.pattern)) return false
  }
  if (data.additionalItems !== undefined && hasOwn(data, "additionalItems")) {
    const sub0 = (() => {
      if (!(typeof data.additionalItems === "boolean")) return false
      return true
    })()
    if (!sub0) {
      const sub1 = (() => {
        if (!validate(data.additionalItems)) return false
        return true
      })()
      if (!sub1) return false
    }
  }
  if (data.items !== undefined && hasOwn(data, "items")) {
    const sub2 = (() => {
      if (!validate(data.items)) return false
      return true
    })()
    if (!sub2) {
      const sub3 = (() => {
        if (!ref4(data.items)) return false
        return true
      })()
      if (!sub3) return false
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
    const sub4 = (() => {
      if (!(typeof data.additionalProperties === "boolean")) return false
      return true
    })()
    if (!sub4) {
      const sub5 = (() => {
        if (!validate(data.additionalProperties)) return false
        return true
      })()
      if (!sub5) return false
    }
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
      const sub6 = (() => {
        if (!validate(data.dependencies[key3])) return false
        return true
      })()
      if (!sub6) {
        const sub7 = (() => {
          if (!ref5(data.dependencies[key3])) return false
          return true
        })()
        if (!sub7) return false
      }
    }
  }
  if (data.enum !== undefined && hasOwn(data, "enum")) {
    if (!Array.isArray(data.enum)) return false
    if (data.enum.length < 1) return false
    if (!unique(data.enum)) return false
  }
  if (data.type !== undefined && hasOwn(data, "type")) {
    const sub8 = (() => {
      if (!ref6(data.type)) return false
      return true
    })()
    if (!sub8) {
      const sub9 = (() => {
        if (!Array.isArray(data.type)) return false
        if (data.type.length < 1) return false
        for (let k = 0; k < data.type.length; k++) {
          if (data.type[k] !== undefined && hasOwn(data.type, k)) {
            if (!ref6(data.type[k])) return false
          }
        }
        if (!unique(data.type)) return false
        return true
      })()
      if (!sub9) return false
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
  return true
};
const ref0 = function validate(data) {
  if (!ref1(data)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at http://json-schema.org/draft-04/schema#/properties/id`

