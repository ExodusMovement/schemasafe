# id

## Invalid use of fragments in location-independent $id

### Schema

```json
{ "$ref": "https://json-schema.org/draft/2019-09/schema" }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
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
const ref2 = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!(typeof data[i] === "string")) return false
    }
  }
  if (!unique(data)) return false
  return true
};
const format0 = new RegExp("^(?:[a-z][a-z0-9+\\-.]*:)?(?:\\/?\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\\.[a-z0-9\\-._~!$&'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)|(?:[a-z0-9\\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\\/?(?:(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)?(?:\\?(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$", "i");
const pattern0 = new RegExp("^[^#]*#?$", "u");
const format1 = new RegExp("^[a-z][a-z0-9+\\-.]*:(?:\\/?\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\\.[a-z0-9\\-._~!$&'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)|(?:[a-z0-9\\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\\/?(?:(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)(?:\\?(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$", "i");
const pattern1 = new RegExp("^[A-Za-z][-A-Za-z0-9.:_]*$", "u");
const ref3 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data["$id"] !== undefined && hasOwn(data, "$id")) {
      if (!(typeof data["$id"] === "string")) return false
      if (!format0.test(data["$id"])) return false
      if (!(pattern0.test(data["$id"]))) return false
    }
    if (data["$schema"] !== undefined && hasOwn(data, "$schema")) {
      if (!(typeof data["$schema"] === "string")) return false
      if (!format1.test(data["$schema"])) return false
    }
    if (data["$anchor"] !== undefined && hasOwn(data, "$anchor")) {
      if (!(typeof data["$anchor"] === "string")) return false
      if (!(pattern1.test(data["$anchor"]))) return false
    }
    if (data["$ref"] !== undefined && hasOwn(data, "$ref")) {
      if (!(typeof data["$ref"] === "string")) return false
      if (!format0.test(data["$ref"])) return false
    }
    if (data["$recursiveRef"] !== undefined && hasOwn(data, "$recursiveRef")) {
      if (!(typeof data["$recursiveRef"] === "string")) return false
      if (!format0.test(data["$recursiveRef"])) return false
    }
    if (data["$recursiveAnchor"] !== undefined && hasOwn(data, "$recursiveAnchor")) {
      if (!(typeof data["$recursiveAnchor"] === "boolean")) return false
      if (!(data["$recursiveAnchor"] === true)) return false
    }
    if (data["$vocabulary"] !== undefined && hasOwn(data, "$vocabulary")) {
      if (!(typeof data["$vocabulary"] === "object" && data["$vocabulary"] && !Array.isArray(data["$vocabulary"]))) return false
      for (const key2 of Object.keys(data["$vocabulary"])) {
        if (!format1.test(key2)) return false
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
        if (!(recursive || validate)(data["$defs"][key4], recursive || validate)) return false
      }
    }
  }
  return true
};
const ref5 = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  if (data.length < 1) return false
  for (let j = 0; j < data.length; j++) {
    if (data[j] !== undefined && hasOwn(data, j)) {
      if (!(recursive || ref4)(data[j], recursive)) return false
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
const ref4 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.additionalItems !== undefined && hasOwn(data, "additionalItems")) {
      if (!(recursive || validate)(data.additionalItems, recursive || validate)) return false
    }
    if (data.unevaluatedItems !== undefined && hasOwn(data, "unevaluatedItems")) {
      if (!(recursive || validate)(data.unevaluatedItems, recursive || validate)) return false
    }
    if (data.items !== undefined && hasOwn(data, "items")) {
      const sub2 = (() => {
        if (!(recursive || validate)(data.items, recursive || validate)) return false
        return true
      })()
      const sub3 = (() => {
        if (!ref5(data.items, recursive || validate)) return false
        return true
      })()
      if (!(sub2 || sub3)) return false
    }
    if (data.contains !== undefined && hasOwn(data, "contains")) {
      if (!(recursive || validate)(data.contains, recursive || validate)) return false
    }
    if (data.additionalProperties !== undefined && hasOwn(data, "additionalProperties")) {
      if (!(recursive || validate)(data.additionalProperties, recursive || validate)) return false
    }
    if (data.unevaluatedProperties !== undefined && hasOwn(data, "unevaluatedProperties")) {
      if (!(recursive || validate)(data.unevaluatedProperties, recursive || validate)) return false
    }
    if (data.properties !== undefined && hasOwn(data, "properties")) {
      if (!(typeof data.properties === "object" && data.properties && !Array.isArray(data.properties))) return false
      for (const key5 of Object.keys(data.properties)) {
        if (!(recursive || validate)(data.properties[key5], recursive || validate)) return false
      }
    }
    if (data.patternProperties !== undefined && hasOwn(data, "patternProperties")) {
      if (!(typeof data.patternProperties === "object" && data.patternProperties && !Array.isArray(data.patternProperties))) return false
      for (const key6 of Object.keys(data.patternProperties)) {
        if (!format2(key6)) return false
      }
      for (const key7 of Object.keys(data.patternProperties)) {
        if (!(recursive || validate)(data.patternProperties[key7], recursive || validate)) return false
      }
    }
    if (data.dependentSchemas !== undefined && hasOwn(data, "dependentSchemas")) {
      if (!(typeof data.dependentSchemas === "object" && data.dependentSchemas && !Array.isArray(data.dependentSchemas))) return false
      for (const key8 of Object.keys(data.dependentSchemas)) {
        if (!(recursive || validate)(data.dependentSchemas[key8], recursive || validate)) return false
      }
    }
    if (data.propertyNames !== undefined && hasOwn(data, "propertyNames")) {
      if (!(recursive || validate)(data.propertyNames, recursive || validate)) return false
    }
    if (data.if !== undefined && hasOwn(data, "if")) {
      if (!(recursive || validate)(data.if, recursive || validate)) return false
    }
    if (data.then !== undefined && hasOwn(data, "then")) {
      if (!(recursive || validate)(data.then, recursive || validate)) return false
    }
    if (data.else !== undefined && hasOwn(data, "else")) {
      if (!(recursive || validate)(data.else, recursive || validate)) return false
    }
    if (data.allOf !== undefined && hasOwn(data, "allOf")) {
      if (!ref5(data.allOf, recursive || validate)) return false
    }
    if (data.anyOf !== undefined && hasOwn(data, "anyOf")) {
      if (!ref5(data.anyOf, recursive || validate)) return false
    }
    if (data.oneOf !== undefined && hasOwn(data, "oneOf")) {
      if (!ref5(data.oneOf, recursive || validate)) return false
    }
    if (data.not !== undefined && hasOwn(data, "not")) {
      if (!(recursive || validate)(data.not, recursive || validate)) return false
    }
  }
  return true
};
const ref7 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  if (!(0 <= data)) return false
  return true
};
const ref8 = function validate(data, recursive) {
  if (!ref7(data, recursive)) return false
  return true
};
const ref9 = function validate(data, recursive) {
  if (!(data === "array" || data === "boolean" || data === "integer" || data === "null" || data === "number" || data === "object" || data === "string")) return false
  return true
};
const ref6 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
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
      if (!ref7(data.maxLength, recursive || validate)) return false
    }
    if (data.minLength !== undefined && hasOwn(data, "minLength")) {
      if (!ref8(data.minLength, recursive || validate)) return false
    }
    if (data.pattern !== undefined && hasOwn(data, "pattern")) {
      if (!(typeof data.pattern === "string")) return false
      if (!format2(data.pattern)) return false
    }
    if (data.maxItems !== undefined && hasOwn(data, "maxItems")) {
      if (!ref7(data.maxItems, recursive || validate)) return false
    }
    if (data.minItems !== undefined && hasOwn(data, "minItems")) {
      if (!ref8(data.minItems, recursive || validate)) return false
    }
    if (data.uniqueItems !== undefined && hasOwn(data, "uniqueItems")) {
      if (!(typeof data.uniqueItems === "boolean")) return false
    }
    if (data.maxContains !== undefined && hasOwn(data, "maxContains")) {
      if (!ref7(data.maxContains, recursive || validate)) return false
    }
    if (data.minContains !== undefined && hasOwn(data, "minContains")) {
      if (!ref7(data.minContains, recursive || validate)) return false
    }
    if (data.maxProperties !== undefined && hasOwn(data, "maxProperties")) {
      if (!ref7(data.maxProperties, recursive || validate)) return false
    }
    if (data.minProperties !== undefined && hasOwn(data, "minProperties")) {
      if (!ref8(data.minProperties, recursive || validate)) return false
    }
    if (data.required !== undefined && hasOwn(data, "required")) {
      if (!ref2(data.required, recursive || validate)) return false
    }
    if (data.dependentRequired !== undefined && hasOwn(data, "dependentRequired")) {
      if (!(typeof data.dependentRequired === "object" && data.dependentRequired && !Array.isArray(data.dependentRequired))) return false
      for (const key9 of Object.keys(data.dependentRequired)) {
        if (!ref2(data.dependentRequired[key9], recursive || validate)) return false
      }
    }
    if (data.enum !== undefined && hasOwn(data, "enum")) {
      if (!Array.isArray(data.enum)) return false
    }
    if (data.type !== undefined && hasOwn(data, "type")) {
      const sub4 = (() => {
        if (!ref9(data.type, recursive || validate)) return false
        return true
      })()
      const sub5 = (() => {
        if (!Array.isArray(data.type)) return false
        if (data.type.length < 1) return false
        for (let l = 0; l < data.type.length; l++) {
          if (data.type[l] !== undefined && hasOwn(data.type, l)) {
            if (!ref9(data.type[l], recursive || validate)) return false
          }
        }
        if (!unique(data.type)) return false
        return true
      })()
      if (!(sub4 || sub5)) return false
    }
  }
  return true
};
const ref10 = function validate(data, recursive) {
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
const ref11 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.format !== undefined && hasOwn(data, "format")) {
      if (!(typeof data.format === "string")) return false
    }
  }
  return true
};
const ref12 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.contentMediaType !== undefined && hasOwn(data, "contentMediaType")) {
      if (!(typeof data.contentMediaType === "string")) return false
    }
    if (data.contentEncoding !== undefined && hasOwn(data, "contentEncoding")) {
      if (!(typeof data.contentEncoding === "string")) return false
    }
    if (data.contentSchema !== undefined && hasOwn(data, "contentSchema")) {
      if (!(recursive || validate)(data.contentSchema, recursive || validate)) return false
    }
  }
  return true
};
const ref1 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.definitions !== undefined && hasOwn(data, "definitions")) {
      if (!(typeof data.definitions === "object" && data.definitions && !Array.isArray(data.definitions))) return false
      for (const key0 of Object.keys(data.definitions)) {
        if (!(recursive || validate)(data.definitions[key0], recursive || validate)) return false
      }
    }
    if (data.dependencies !== undefined && hasOwn(data, "dependencies")) {
      if (!(typeof data.dependencies === "object" && data.dependencies && !Array.isArray(data.dependencies))) return false
      for (const key1 of Object.keys(data.dependencies)) {
        const sub0 = (() => {
          if (!(recursive || validate)(data.dependencies[key1], recursive || validate)) return false
          return true
        })()
        const sub1 = (() => {
          if (!ref2(data.dependencies[key1], recursive || validate)) return false
          return true
        })()
        if (!(sub0 || sub1)) return false
      }
    }
  }
  if (!ref3(data, recursive || validate)) return false
  if (!ref4(data, recursive || validate)) return false
  if (!ref6(data, recursive || validate)) return false
  if (!ref10(data, recursive || validate)) return false
  if (!ref11(data, recursive || validate)) return false
  if (!ref12(data, recursive || validate)) return false
  return true
};
const ref0 = function validate(data, recursive) {
  if (!ref1(data, recursive)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at https://json-schema.org/draft/2019-09/schema#/properties/definitions/additionalProperties`


## Valid use of empty fragments in location-independent $id

### Schema

```json
{ "$ref": "https://json-schema.org/draft/2019-09/schema" }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
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
const ref2 = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!(typeof data[i] === "string")) return false
    }
  }
  if (!unique(data)) return false
  return true
};
const format0 = new RegExp("^(?:[a-z][a-z0-9+\\-.]*:)?(?:\\/?\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\\.[a-z0-9\\-._~!$&'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)|(?:[a-z0-9\\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\\/?(?:(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)?(?:\\?(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$", "i");
const pattern0 = new RegExp("^[^#]*#?$", "u");
const format1 = new RegExp("^[a-z][a-z0-9+\\-.]*:(?:\\/?\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\\.[a-z0-9\\-._~!$&'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)|(?:[a-z0-9\\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\\/?(?:(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)(?:\\?(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$", "i");
const pattern1 = new RegExp("^[A-Za-z][-A-Za-z0-9.:_]*$", "u");
const ref3 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data["$id"] !== undefined && hasOwn(data, "$id")) {
      if (!(typeof data["$id"] === "string")) return false
      if (!format0.test(data["$id"])) return false
      if (!(pattern0.test(data["$id"]))) return false
    }
    if (data["$schema"] !== undefined && hasOwn(data, "$schema")) {
      if (!(typeof data["$schema"] === "string")) return false
      if (!format1.test(data["$schema"])) return false
    }
    if (data["$anchor"] !== undefined && hasOwn(data, "$anchor")) {
      if (!(typeof data["$anchor"] === "string")) return false
      if (!(pattern1.test(data["$anchor"]))) return false
    }
    if (data["$ref"] !== undefined && hasOwn(data, "$ref")) {
      if (!(typeof data["$ref"] === "string")) return false
      if (!format0.test(data["$ref"])) return false
    }
    if (data["$recursiveRef"] !== undefined && hasOwn(data, "$recursiveRef")) {
      if (!(typeof data["$recursiveRef"] === "string")) return false
      if (!format0.test(data["$recursiveRef"])) return false
    }
    if (data["$recursiveAnchor"] !== undefined && hasOwn(data, "$recursiveAnchor")) {
      if (!(typeof data["$recursiveAnchor"] === "boolean")) return false
      if (!(data["$recursiveAnchor"] === true)) return false
    }
    if (data["$vocabulary"] !== undefined && hasOwn(data, "$vocabulary")) {
      if (!(typeof data["$vocabulary"] === "object" && data["$vocabulary"] && !Array.isArray(data["$vocabulary"]))) return false
      for (const key2 of Object.keys(data["$vocabulary"])) {
        if (!format1.test(key2)) return false
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
        if (!(recursive || validate)(data["$defs"][key4], recursive || validate)) return false
      }
    }
  }
  return true
};
const ref5 = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  if (data.length < 1) return false
  for (let j = 0; j < data.length; j++) {
    if (data[j] !== undefined && hasOwn(data, j)) {
      if (!(recursive || ref4)(data[j], recursive)) return false
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
const ref4 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.additionalItems !== undefined && hasOwn(data, "additionalItems")) {
      if (!(recursive || validate)(data.additionalItems, recursive || validate)) return false
    }
    if (data.unevaluatedItems !== undefined && hasOwn(data, "unevaluatedItems")) {
      if (!(recursive || validate)(data.unevaluatedItems, recursive || validate)) return false
    }
    if (data.items !== undefined && hasOwn(data, "items")) {
      const sub2 = (() => {
        if (!(recursive || validate)(data.items, recursive || validate)) return false
        return true
      })()
      const sub3 = (() => {
        if (!ref5(data.items, recursive || validate)) return false
        return true
      })()
      if (!(sub2 || sub3)) return false
    }
    if (data.contains !== undefined && hasOwn(data, "contains")) {
      if (!(recursive || validate)(data.contains, recursive || validate)) return false
    }
    if (data.additionalProperties !== undefined && hasOwn(data, "additionalProperties")) {
      if (!(recursive || validate)(data.additionalProperties, recursive || validate)) return false
    }
    if (data.unevaluatedProperties !== undefined && hasOwn(data, "unevaluatedProperties")) {
      if (!(recursive || validate)(data.unevaluatedProperties, recursive || validate)) return false
    }
    if (data.properties !== undefined && hasOwn(data, "properties")) {
      if (!(typeof data.properties === "object" && data.properties && !Array.isArray(data.properties))) return false
      for (const key5 of Object.keys(data.properties)) {
        if (!(recursive || validate)(data.properties[key5], recursive || validate)) return false
      }
    }
    if (data.patternProperties !== undefined && hasOwn(data, "patternProperties")) {
      if (!(typeof data.patternProperties === "object" && data.patternProperties && !Array.isArray(data.patternProperties))) return false
      for (const key6 of Object.keys(data.patternProperties)) {
        if (!format2(key6)) return false
      }
      for (const key7 of Object.keys(data.patternProperties)) {
        if (!(recursive || validate)(data.patternProperties[key7], recursive || validate)) return false
      }
    }
    if (data.dependentSchemas !== undefined && hasOwn(data, "dependentSchemas")) {
      if (!(typeof data.dependentSchemas === "object" && data.dependentSchemas && !Array.isArray(data.dependentSchemas))) return false
      for (const key8 of Object.keys(data.dependentSchemas)) {
        if (!(recursive || validate)(data.dependentSchemas[key8], recursive || validate)) return false
      }
    }
    if (data.propertyNames !== undefined && hasOwn(data, "propertyNames")) {
      if (!(recursive || validate)(data.propertyNames, recursive || validate)) return false
    }
    if (data.if !== undefined && hasOwn(data, "if")) {
      if (!(recursive || validate)(data.if, recursive || validate)) return false
    }
    if (data.then !== undefined && hasOwn(data, "then")) {
      if (!(recursive || validate)(data.then, recursive || validate)) return false
    }
    if (data.else !== undefined && hasOwn(data, "else")) {
      if (!(recursive || validate)(data.else, recursive || validate)) return false
    }
    if (data.allOf !== undefined && hasOwn(data, "allOf")) {
      if (!ref5(data.allOf, recursive || validate)) return false
    }
    if (data.anyOf !== undefined && hasOwn(data, "anyOf")) {
      if (!ref5(data.anyOf, recursive || validate)) return false
    }
    if (data.oneOf !== undefined && hasOwn(data, "oneOf")) {
      if (!ref5(data.oneOf, recursive || validate)) return false
    }
    if (data.not !== undefined && hasOwn(data, "not")) {
      if (!(recursive || validate)(data.not, recursive || validate)) return false
    }
  }
  return true
};
const ref7 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  if (!(0 <= data)) return false
  return true
};
const ref8 = function validate(data, recursive) {
  if (!ref7(data, recursive)) return false
  return true
};
const ref9 = function validate(data, recursive) {
  if (!(data === "array" || data === "boolean" || data === "integer" || data === "null" || data === "number" || data === "object" || data === "string")) return false
  return true
};
const ref6 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
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
      if (!ref7(data.maxLength, recursive || validate)) return false
    }
    if (data.minLength !== undefined && hasOwn(data, "minLength")) {
      if (!ref8(data.minLength, recursive || validate)) return false
    }
    if (data.pattern !== undefined && hasOwn(data, "pattern")) {
      if (!(typeof data.pattern === "string")) return false
      if (!format2(data.pattern)) return false
    }
    if (data.maxItems !== undefined && hasOwn(data, "maxItems")) {
      if (!ref7(data.maxItems, recursive || validate)) return false
    }
    if (data.minItems !== undefined && hasOwn(data, "minItems")) {
      if (!ref8(data.minItems, recursive || validate)) return false
    }
    if (data.uniqueItems !== undefined && hasOwn(data, "uniqueItems")) {
      if (!(typeof data.uniqueItems === "boolean")) return false
    }
    if (data.maxContains !== undefined && hasOwn(data, "maxContains")) {
      if (!ref7(data.maxContains, recursive || validate)) return false
    }
    if (data.minContains !== undefined && hasOwn(data, "minContains")) {
      if (!ref7(data.minContains, recursive || validate)) return false
    }
    if (data.maxProperties !== undefined && hasOwn(data, "maxProperties")) {
      if (!ref7(data.maxProperties, recursive || validate)) return false
    }
    if (data.minProperties !== undefined && hasOwn(data, "minProperties")) {
      if (!ref8(data.minProperties, recursive || validate)) return false
    }
    if (data.required !== undefined && hasOwn(data, "required")) {
      if (!ref2(data.required, recursive || validate)) return false
    }
    if (data.dependentRequired !== undefined && hasOwn(data, "dependentRequired")) {
      if (!(typeof data.dependentRequired === "object" && data.dependentRequired && !Array.isArray(data.dependentRequired))) return false
      for (const key9 of Object.keys(data.dependentRequired)) {
        if (!ref2(data.dependentRequired[key9], recursive || validate)) return false
      }
    }
    if (data.enum !== undefined && hasOwn(data, "enum")) {
      if (!Array.isArray(data.enum)) return false
    }
    if (data.type !== undefined && hasOwn(data, "type")) {
      const sub4 = (() => {
        if (!ref9(data.type, recursive || validate)) return false
        return true
      })()
      const sub5 = (() => {
        if (!Array.isArray(data.type)) return false
        if (data.type.length < 1) return false
        for (let l = 0; l < data.type.length; l++) {
          if (data.type[l] !== undefined && hasOwn(data.type, l)) {
            if (!ref9(data.type[l], recursive || validate)) return false
          }
        }
        if (!unique(data.type)) return false
        return true
      })()
      if (!(sub4 || sub5)) return false
    }
  }
  return true
};
const ref10 = function validate(data, recursive) {
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
const ref11 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.format !== undefined && hasOwn(data, "format")) {
      if (!(typeof data.format === "string")) return false
    }
  }
  return true
};
const ref12 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.contentMediaType !== undefined && hasOwn(data, "contentMediaType")) {
      if (!(typeof data.contentMediaType === "string")) return false
    }
    if (data.contentEncoding !== undefined && hasOwn(data, "contentEncoding")) {
      if (!(typeof data.contentEncoding === "string")) return false
    }
    if (data.contentSchema !== undefined && hasOwn(data, "contentSchema")) {
      if (!(recursive || validate)(data.contentSchema, recursive || validate)) return false
    }
  }
  return true
};
const ref1 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.definitions !== undefined && hasOwn(data, "definitions")) {
      if (!(typeof data.definitions === "object" && data.definitions && !Array.isArray(data.definitions))) return false
      for (const key0 of Object.keys(data.definitions)) {
        if (!(recursive || validate)(data.definitions[key0], recursive || validate)) return false
      }
    }
    if (data.dependencies !== undefined && hasOwn(data, "dependencies")) {
      if (!(typeof data.dependencies === "object" && data.dependencies && !Array.isArray(data.dependencies))) return false
      for (const key1 of Object.keys(data.dependencies)) {
        const sub0 = (() => {
          if (!(recursive || validate)(data.dependencies[key1], recursive || validate)) return false
          return true
        })()
        const sub1 = (() => {
          if (!ref2(data.dependencies[key1], recursive || validate)) return false
          return true
        })()
        if (!(sub0 || sub1)) return false
      }
    }
  }
  if (!ref3(data, recursive || validate)) return false
  if (!ref4(data, recursive || validate)) return false
  if (!ref6(data, recursive || validate)) return false
  if (!ref10(data, recursive || validate)) return false
  if (!ref11(data, recursive || validate)) return false
  if (!ref12(data, recursive || validate)) return false
  return true
};
const ref0 = function validate(data, recursive) {
  if (!ref1(data, recursive)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at https://json-schema.org/draft/2019-09/schema#/properties/definitions/additionalProperties`


## Unnormalized $ids are allowed but discouraged

### Schema

```json
{ "$ref": "https://json-schema.org/draft/2019-09/schema" }
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
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
const ref2 = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!(typeof data[i] === "string")) return false
    }
  }
  if (!unique(data)) return false
  return true
};
const format0 = new RegExp("^(?:[a-z][a-z0-9+\\-.]*:)?(?:\\/?\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\\.[a-z0-9\\-._~!$&'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)|(?:[a-z0-9\\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\\/?(?:(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)?(?:\\?(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$", "i");
const pattern0 = new RegExp("^[^#]*#?$", "u");
const format1 = new RegExp("^[a-z][a-z0-9+\\-.]*:(?:\\/?\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+\\.[a-z0-9\\-._~!$&'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d\\d?)|(?:[a-z0-9\\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\\/?(?:(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)(?:\\?(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$", "i");
const pattern1 = new RegExp("^[A-Za-z][-A-Za-z0-9.:_]*$", "u");
const ref3 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data["$id"] !== undefined && hasOwn(data, "$id")) {
      if (!(typeof data["$id"] === "string")) return false
      if (!format0.test(data["$id"])) return false
      if (!(pattern0.test(data["$id"]))) return false
    }
    if (data["$schema"] !== undefined && hasOwn(data, "$schema")) {
      if (!(typeof data["$schema"] === "string")) return false
      if (!format1.test(data["$schema"])) return false
    }
    if (data["$anchor"] !== undefined && hasOwn(data, "$anchor")) {
      if (!(typeof data["$anchor"] === "string")) return false
      if (!(pattern1.test(data["$anchor"]))) return false
    }
    if (data["$ref"] !== undefined && hasOwn(data, "$ref")) {
      if (!(typeof data["$ref"] === "string")) return false
      if (!format0.test(data["$ref"])) return false
    }
    if (data["$recursiveRef"] !== undefined && hasOwn(data, "$recursiveRef")) {
      if (!(typeof data["$recursiveRef"] === "string")) return false
      if (!format0.test(data["$recursiveRef"])) return false
    }
    if (data["$recursiveAnchor"] !== undefined && hasOwn(data, "$recursiveAnchor")) {
      if (!(typeof data["$recursiveAnchor"] === "boolean")) return false
      if (!(data["$recursiveAnchor"] === true)) return false
    }
    if (data["$vocabulary"] !== undefined && hasOwn(data, "$vocabulary")) {
      if (!(typeof data["$vocabulary"] === "object" && data["$vocabulary"] && !Array.isArray(data["$vocabulary"]))) return false
      for (const key2 of Object.keys(data["$vocabulary"])) {
        if (!format1.test(key2)) return false
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
        if (!(recursive || validate)(data["$defs"][key4], recursive || validate)) return false
      }
    }
  }
  return true
};
const ref5 = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  if (data.length < 1) return false
  for (let j = 0; j < data.length; j++) {
    if (data[j] !== undefined && hasOwn(data, j)) {
      if (!(recursive || ref4)(data[j], recursive)) return false
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
const ref4 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.additionalItems !== undefined && hasOwn(data, "additionalItems")) {
      if (!(recursive || validate)(data.additionalItems, recursive || validate)) return false
    }
    if (data.unevaluatedItems !== undefined && hasOwn(data, "unevaluatedItems")) {
      if (!(recursive || validate)(data.unevaluatedItems, recursive || validate)) return false
    }
    if (data.items !== undefined && hasOwn(data, "items")) {
      const sub2 = (() => {
        if (!(recursive || validate)(data.items, recursive || validate)) return false
        return true
      })()
      const sub3 = (() => {
        if (!ref5(data.items, recursive || validate)) return false
        return true
      })()
      if (!(sub2 || sub3)) return false
    }
    if (data.contains !== undefined && hasOwn(data, "contains")) {
      if (!(recursive || validate)(data.contains, recursive || validate)) return false
    }
    if (data.additionalProperties !== undefined && hasOwn(data, "additionalProperties")) {
      if (!(recursive || validate)(data.additionalProperties, recursive || validate)) return false
    }
    if (data.unevaluatedProperties !== undefined && hasOwn(data, "unevaluatedProperties")) {
      if (!(recursive || validate)(data.unevaluatedProperties, recursive || validate)) return false
    }
    if (data.properties !== undefined && hasOwn(data, "properties")) {
      if (!(typeof data.properties === "object" && data.properties && !Array.isArray(data.properties))) return false
      for (const key5 of Object.keys(data.properties)) {
        if (!(recursive || validate)(data.properties[key5], recursive || validate)) return false
      }
    }
    if (data.patternProperties !== undefined && hasOwn(data, "patternProperties")) {
      if (!(typeof data.patternProperties === "object" && data.patternProperties && !Array.isArray(data.patternProperties))) return false
      for (const key6 of Object.keys(data.patternProperties)) {
        if (!format2(key6)) return false
      }
      for (const key7 of Object.keys(data.patternProperties)) {
        if (!(recursive || validate)(data.patternProperties[key7], recursive || validate)) return false
      }
    }
    if (data.dependentSchemas !== undefined && hasOwn(data, "dependentSchemas")) {
      if (!(typeof data.dependentSchemas === "object" && data.dependentSchemas && !Array.isArray(data.dependentSchemas))) return false
      for (const key8 of Object.keys(data.dependentSchemas)) {
        if (!(recursive || validate)(data.dependentSchemas[key8], recursive || validate)) return false
      }
    }
    if (data.propertyNames !== undefined && hasOwn(data, "propertyNames")) {
      if (!(recursive || validate)(data.propertyNames, recursive || validate)) return false
    }
    if (data.if !== undefined && hasOwn(data, "if")) {
      if (!(recursive || validate)(data.if, recursive || validate)) return false
    }
    if (data.then !== undefined && hasOwn(data, "then")) {
      if (!(recursive || validate)(data.then, recursive || validate)) return false
    }
    if (data.else !== undefined && hasOwn(data, "else")) {
      if (!(recursive || validate)(data.else, recursive || validate)) return false
    }
    if (data.allOf !== undefined && hasOwn(data, "allOf")) {
      if (!ref5(data.allOf, recursive || validate)) return false
    }
    if (data.anyOf !== undefined && hasOwn(data, "anyOf")) {
      if (!ref5(data.anyOf, recursive || validate)) return false
    }
    if (data.oneOf !== undefined && hasOwn(data, "oneOf")) {
      if (!ref5(data.oneOf, recursive || validate)) return false
    }
    if (data.not !== undefined && hasOwn(data, "not")) {
      if (!(recursive || validate)(data.not, recursive || validate)) return false
    }
  }
  return true
};
const ref7 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  if (!(0 <= data)) return false
  return true
};
const ref8 = function validate(data, recursive) {
  if (!ref7(data, recursive)) return false
  return true
};
const ref9 = function validate(data, recursive) {
  if (!(data === "array" || data === "boolean" || data === "integer" || data === "null" || data === "number" || data === "object" || data === "string")) return false
  return true
};
const ref6 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
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
      if (!ref7(data.maxLength, recursive || validate)) return false
    }
    if (data.minLength !== undefined && hasOwn(data, "minLength")) {
      if (!ref8(data.minLength, recursive || validate)) return false
    }
    if (data.pattern !== undefined && hasOwn(data, "pattern")) {
      if (!(typeof data.pattern === "string")) return false
      if (!format2(data.pattern)) return false
    }
    if (data.maxItems !== undefined && hasOwn(data, "maxItems")) {
      if (!ref7(data.maxItems, recursive || validate)) return false
    }
    if (data.minItems !== undefined && hasOwn(data, "minItems")) {
      if (!ref8(data.minItems, recursive || validate)) return false
    }
    if (data.uniqueItems !== undefined && hasOwn(data, "uniqueItems")) {
      if (!(typeof data.uniqueItems === "boolean")) return false
    }
    if (data.maxContains !== undefined && hasOwn(data, "maxContains")) {
      if (!ref7(data.maxContains, recursive || validate)) return false
    }
    if (data.minContains !== undefined && hasOwn(data, "minContains")) {
      if (!ref7(data.minContains, recursive || validate)) return false
    }
    if (data.maxProperties !== undefined && hasOwn(data, "maxProperties")) {
      if (!ref7(data.maxProperties, recursive || validate)) return false
    }
    if (data.minProperties !== undefined && hasOwn(data, "minProperties")) {
      if (!ref8(data.minProperties, recursive || validate)) return false
    }
    if (data.required !== undefined && hasOwn(data, "required")) {
      if (!ref2(data.required, recursive || validate)) return false
    }
    if (data.dependentRequired !== undefined && hasOwn(data, "dependentRequired")) {
      if (!(typeof data.dependentRequired === "object" && data.dependentRequired && !Array.isArray(data.dependentRequired))) return false
      for (const key9 of Object.keys(data.dependentRequired)) {
        if (!ref2(data.dependentRequired[key9], recursive || validate)) return false
      }
    }
    if (data.enum !== undefined && hasOwn(data, "enum")) {
      if (!Array.isArray(data.enum)) return false
    }
    if (data.type !== undefined && hasOwn(data, "type")) {
      const sub4 = (() => {
        if (!ref9(data.type, recursive || validate)) return false
        return true
      })()
      const sub5 = (() => {
        if (!Array.isArray(data.type)) return false
        if (data.type.length < 1) return false
        for (let l = 0; l < data.type.length; l++) {
          if (data.type[l] !== undefined && hasOwn(data.type, l)) {
            if (!ref9(data.type[l], recursive || validate)) return false
          }
        }
        if (!unique(data.type)) return false
        return true
      })()
      if (!(sub4 || sub5)) return false
    }
  }
  return true
};
const ref10 = function validate(data, recursive) {
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
const ref11 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.format !== undefined && hasOwn(data, "format")) {
      if (!(typeof data.format === "string")) return false
    }
  }
  return true
};
const ref12 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.contentMediaType !== undefined && hasOwn(data, "contentMediaType")) {
      if (!(typeof data.contentMediaType === "string")) return false
    }
    if (data.contentEncoding !== undefined && hasOwn(data, "contentEncoding")) {
      if (!(typeof data.contentEncoding === "string")) return false
    }
    if (data.contentSchema !== undefined && hasOwn(data, "contentSchema")) {
      if (!(recursive || validate)(data.contentSchema, recursive || validate)) return false
    }
  }
  return true
};
const ref1 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.definitions !== undefined && hasOwn(data, "definitions")) {
      if (!(typeof data.definitions === "object" && data.definitions && !Array.isArray(data.definitions))) return false
      for (const key0 of Object.keys(data.definitions)) {
        if (!(recursive || validate)(data.definitions[key0], recursive || validate)) return false
      }
    }
    if (data.dependencies !== undefined && hasOwn(data, "dependencies")) {
      if (!(typeof data.dependencies === "object" && data.dependencies && !Array.isArray(data.dependencies))) return false
      for (const key1 of Object.keys(data.dependencies)) {
        const sub0 = (() => {
          if (!(recursive || validate)(data.dependencies[key1], recursive || validate)) return false
          return true
        })()
        const sub1 = (() => {
          if (!ref2(data.dependencies[key1], recursive || validate)) return false
          return true
        })()
        if (!(sub0 || sub1)) return false
      }
    }
  }
  if (!ref3(data, recursive || validate)) return false
  if (!ref4(data, recursive || validate)) return false
  if (!ref6(data, recursive || validate)) return false
  if (!ref10(data, recursive || validate)) return false
  if (!ref11(data, recursive || validate)) return false
  if (!ref12(data, recursive || validate)) return false
  return true
};
const ref0 = function validate(data, recursive) {
  if (!ref1(data, recursive)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at https://json-schema.org/draft/2019-09/schema#/properties/definitions/additionalProperties`


## $id inside an enum is not a real identifier

### Schema

```json
{
  "$defs": {
    "id_in_enum": {
      "enum": [
        {
          "$id": "https://localhost:1234/draft2019-09/id/my_identifier.json",
          "type": "null"
        }
      ]
    },
    "real_id_in_schema": {
      "$id": "https://localhost:1234/draft2019-09/id/my_identifier.json",
      "type": "string"
    },
    "zzz_id_in_const": {
      "const": {
        "$id": "https://localhost:1234/draft2019-09/id/my_identifier.json",
        "type": "null"
      }
    }
  },
  "anyOf": [
    { "$ref": "#/$defs/id_in_enum" },
    { "$ref": "https://localhost:1234/draft2019-09/id/my_identifier.json" }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data) && Object.keys(data).length === 2 && hasOwn(data, "$id") && hasOwn(data, "type") && data["$id"] === "https://localhost:1234/draft2019-09/id/my_identifier.json" && data["type"] === "null")) return false
  return true
};
const ref2 = function validate(data) {
  if (!(typeof data === "string")) return false
  return true
};
const ref0 = function validate(data) {
  const sub0 = (() => {
    if (!ref1(data)) return false
    return true
  })()
  const sub1 = (() => {
    if (!ref2(data)) return false
    return true
  })()
  if (!(sub0 || sub1)) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #`


## non-schema object containing an $id property

### Schema

```json
{
  "$defs": { "const_not_id": { "const": { "$id": "not_a_real_id" } } },
  "if": { "const": "skip not_a_real_id" },
  "then": true,
  "else": { "$ref": "#/$defs/const_not_id" }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data) {
  if (!(typeof data === "object" && data && !Array.isArray(data) && Object.keys(data).length === 1 && hasOwn(data, "$id") && data["$id"] === "not_a_real_id")) return false
  return true
};
const ref0 = function validate(data) {
  const sub0 = (() => {
    if (!(data === "skip not_a_real_id")) return false
    return true
  })()
  if (!sub0) {
    if (!ref1(data)) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at #/then`

