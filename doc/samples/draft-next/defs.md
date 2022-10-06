# defs

## validate definition against metaschema

### Schema

```json
{ "$ref": "https://json-schema.org/draft/next/schema" }
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
      if (!sub2) {
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
        if (!sub3) return false
      }
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
        if (!sub0) {
          const sub1 = (() => {
            if (!ref2(data.dependencies[key1], [...dynAnchors, dynLocal[0] || []])) return false
            return true
          })()
          if (!sub1) return false
        }
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

 * `[requireValidation] type should be specified at https://json-schema.org/draft/next/schema#/properties/definitions/additionalProperties`

