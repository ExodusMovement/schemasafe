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
  const objects = []
  const primitives = new Set()
  let primitivesCount = 0
  for (const item of array) {
    if (typeof item === 'object') {
      objects.push(item)
    } else {
      primitives.add(item)
      if (primitives.size !== ++primitivesCount) return false
    }
  }
  for (let i = 1; i < objects.length; i++)
    for (let j = 0; j < i; j++) if (deepEqual(objects[i], objects[j])) return false
  return true
};
const deepEqual = (obj, obj2) => {
  if (obj === obj2) return true
  if (!obj || !obj2 || typeof obj !== typeof obj2) return false

  const proto = Object.getPrototypeOf(obj)
  if (proto !== Object.getPrototypeOf(obj2)) return false

  if (proto === Array.prototype) {
    if (!Array.isArray(obj) || !Array.isArray(obj2)) return false
    if (obj.length !== obj2.length) return false
    return obj.every((x, i) => deepEqual(x, obj2[i]))
  } else if (proto === Object.prototype) {
    const [keys, keys2] = [Object.keys(obj), Object.keys(obj2)]
    if (keys.length !== keys2.length) return false
    const keyset2 = new Set(keys2)
    return keys.every((key) => keyset2.has(key) && deepEqual(obj[key], obj2[key]))
  }
  return false
};
const ref1 = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!(typeof data[i] === "string")) return false
    }
  }
  if (!unique(data)) return false
  return true
};
const pointerPart = (s) => (/~\//.test(s) ? `${s}`.replace(/~/g, '~0').replace(/\//g, '~1') : s);
const format0 = new RegExp("^(?:|(?:|[a-z][a-z0-9+-.]*:)\\/?\\/)(?:|[^\\\\\\s#][^\\s#]*)(?:|#[^\\\\\\s]*)$", "i");
const pattern0 = new RegExp("^[^#]*#?$", "u");
const format1 = new RegExp("^[a-z][a-z0-9+-.]*:[^\\s]*$", "i");
const pattern1 = new RegExp("^[A-Za-z][-A-Za-z0-9.:_]*$", "u");
const ref2 = function validate(data, recursive) {
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
        if (data["$vocabulary"][key3] !== undefined) {
          if (!(typeof data["$vocabulary"][key3] === "boolean")) return false
        }
      }
    }
    if (data["$comment"] !== undefined && hasOwn(data, "$comment")) {
      if (!(typeof data["$comment"] === "string")) return false
    }
    if (data["$defs"] !== undefined && hasOwn(data, "$defs")) {
      if (!(typeof data["$defs"] === "object" && data["$defs"] && !Array.isArray(data["$defs"]))) return false
      for (const key4 of Object.keys(data["$defs"])) {
        if (data["$defs"][key4] !== undefined) {
          if (!(recursive || validate)(data["$defs"][key4], recursive || validate)) return false
        }
      }
    }
  }
  return true
};
const ref4 = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  if (data.length < 1) return false
  for (let j = 0; j < data.length; j++) {
    if (data[j] !== undefined && hasOwn(data, j)) {
      if (!validate(data[j], recursive)) return false
    }
  }
  return true
};
const format2 = (str) => {
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
const ref3 = function validate(data, recursive) {
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
      if (!sub2) {
        const sub3 = (() => {
          if (!ref4(data.items, recursive || validate)) return false
          return true
        })()
        if (!sub3) {
          return false
        }
      }
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
        if (data.properties[key5] !== undefined) {
          if (!(recursive || validate)(data.properties[key5], recursive || validate)) return false
        }
      }
    }
    if (data.patternProperties !== undefined && hasOwn(data, "patternProperties")) {
      if (!(typeof data.patternProperties === "object" && data.patternProperties && !Array.isArray(data.patternProperties))) return false
      for (const key6 of Object.keys(data.patternProperties)) {
        if (!format2(key6)) return false
      }
      for (const key7 of Object.keys(data.patternProperties)) {
        if (data.patternProperties[key7] !== undefined) {
          if (!(recursive || validate)(data.patternProperties[key7], recursive || validate)) return false
        }
      }
    }
    if (data.dependentSchemas !== undefined && hasOwn(data, "dependentSchemas")) {
      if (!(typeof data.dependentSchemas === "object" && data.dependentSchemas && !Array.isArray(data.dependentSchemas))) return false
      for (const key8 of Object.keys(data.dependentSchemas)) {
        if (data.dependentSchemas[key8] !== undefined) {
          if (!(recursive || validate)(data.dependentSchemas[key8], recursive || validate)) return false
        }
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
      if (!ref4(data.allOf, recursive || validate)) return false
    }
    if (data.anyOf !== undefined && hasOwn(data, "anyOf")) {
      if (!ref4(data.anyOf, recursive || validate)) return false
    }
    if (data.oneOf !== undefined && hasOwn(data, "oneOf")) {
      if (!ref4(data.oneOf, recursive || validate)) return false
    }
    if (data.not !== undefined && hasOwn(data, "not")) {
      if (!(recursive || validate)(data.not, recursive || validate)) return false
    }
  }
  return true
};
const ref6 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  if (!(0 <= data)) return false
  return true
};
const ref7 = function validate(data, recursive) {
  if (!ref6(data, recursive)) return false
  return true
};
const ref8 = function validate(data, recursive) {
  if (!(data === "array" || data === "boolean" || data === "integer" || data === "null" || data === "number" || data === "object" || data === "string")) return false
  return true
};
const ref5 = function validate(data, recursive) {
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
      if (!ref6(data.maxLength, recursive || validate)) return false
    }
    if (data.minLength !== undefined && hasOwn(data, "minLength")) {
      if (!ref7(data.minLength, recursive || validate)) return false
    }
    if (data.pattern !== undefined && hasOwn(data, "pattern")) {
      if (!(typeof data.pattern === "string")) return false
      if (!format2(data.pattern)) return false
    }
    if (data.maxItems !== undefined && hasOwn(data, "maxItems")) {
      if (!ref6(data.maxItems, recursive || validate)) return false
    }
    if (data.minItems !== undefined && hasOwn(data, "minItems")) {
      if (!ref7(data.minItems, recursive || validate)) return false
    }
    if (data.uniqueItems !== undefined && hasOwn(data, "uniqueItems")) {
      if (!(typeof data.uniqueItems === "boolean")) return false
    }
    if (data.maxContains !== undefined && hasOwn(data, "maxContains")) {
      if (!ref6(data.maxContains, recursive || validate)) return false
    }
    if (data.minContains !== undefined && hasOwn(data, "minContains")) {
      if (!ref6(data.minContains, recursive || validate)) return false
    }
    if (data.maxProperties !== undefined && hasOwn(data, "maxProperties")) {
      if (!ref6(data.maxProperties, recursive || validate)) return false
    }
    if (data.minProperties !== undefined && hasOwn(data, "minProperties")) {
      if (!ref7(data.minProperties, recursive || validate)) return false
    }
    if (data.required !== undefined && hasOwn(data, "required")) {
      if (!ref1(data.required, recursive || validate)) return false
    }
    if (data.dependentRequired !== undefined && hasOwn(data, "dependentRequired")) {
      if (!(typeof data.dependentRequired === "object" && data.dependentRequired && !Array.isArray(data.dependentRequired))) return false
      for (const key9 of Object.keys(data.dependentRequired)) {
        if (data.dependentRequired[key9] !== undefined) {
          if (!ref1(data.dependentRequired[key9], recursive || validate)) return false
        }
      }
    }
    if (data.enum !== undefined && hasOwn(data, "enum")) {
      if (!Array.isArray(data.enum)) return false
    }
    if (data.type !== undefined && hasOwn(data, "type")) {
      const sub4 = (() => {
        if (!ref8(data.type, recursive || validate)) return false
        return true
      })()
      if (!sub4) {
        const sub5 = (() => {
          if (!Array.isArray(data.type)) return false
          if (data.type.length < 1) return false
          for (let l = 0; l < data.type.length; l++) {
            if (data.type[l] !== undefined && hasOwn(data.type, l)) {
              if (!ref8(data.type[l], recursive || validate)) return false
            }
          }
          if (!unique(data.type)) return false
          return true
        })()
        if (!sub5) {
          return false
        }
      }
    }
  }
  return true
};
const ref9 = function validate(data, recursive) {
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
const ref10 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.format !== undefined && hasOwn(data, "format")) {
      if (!(typeof data.format === "string")) return false
    }
  }
  return true
};
const ref11 = function validate(data, recursive) {
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
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.definitions !== undefined && hasOwn(data, "definitions")) {
      if (!(typeof data.definitions === "object" && data.definitions && !Array.isArray(data.definitions))) return false
      for (const key0 of Object.keys(data.definitions)) {
        if (data.definitions[key0] !== undefined) {
          if (!(recursive || validate)(data.definitions[key0], recursive || validate)) return false
        }
      }
    }
    if (data.dependencies !== undefined && hasOwn(data, "dependencies")) {
      if (!(typeof data.dependencies === "object" && data.dependencies && !Array.isArray(data.dependencies))) return false
      for (const key1 of Object.keys(data.dependencies)) {
        if (data.dependencies[key1] !== undefined) {
          const sub0 = (() => {
            if (!(recursive || validate)(data.dependencies[key1], recursive || validate)) return false
            return true
          })()
          if (!sub0) {
            const sub1 = (() => {
              if (!ref1(data.dependencies[key1], recursive || validate)) return false
              return true
            })()
            if (!sub1) {
              return false
            }
          }
        }
      }
    }
  }
  if (!ref2(data, recursive || validate)) return false
  if (!ref3(data, recursive || validate)) return false
  if (!ref5(data, recursive || validate)) return false
  if (!ref9(data, recursive || validate)) return false
  if (!ref10(data, recursive || validate)) return false
  if (!ref11(data, recursive || validate)) return false
  return true
};
const validate = function validate(data, recursive) {
  if (!ref0(data, recursive)) return false
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] wild-card additionalProperties requires propertyNames at #/properties/definitions`


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
  const objects = []
  const primitives = new Set()
  let primitivesCount = 0
  for (const item of array) {
    if (typeof item === 'object') {
      objects.push(item)
    } else {
      primitives.add(item)
      if (primitives.size !== ++primitivesCount) return false
    }
  }
  for (let i = 1; i < objects.length; i++)
    for (let j = 0; j < i; j++) if (deepEqual(objects[i], objects[j])) return false
  return true
};
const deepEqual = (obj, obj2) => {
  if (obj === obj2) return true
  if (!obj || !obj2 || typeof obj !== typeof obj2) return false

  const proto = Object.getPrototypeOf(obj)
  if (proto !== Object.getPrototypeOf(obj2)) return false

  if (proto === Array.prototype) {
    if (!Array.isArray(obj) || !Array.isArray(obj2)) return false
    if (obj.length !== obj2.length) return false
    return obj.every((x, i) => deepEqual(x, obj2[i]))
  } else if (proto === Object.prototype) {
    const [keys, keys2] = [Object.keys(obj), Object.keys(obj2)]
    if (keys.length !== keys2.length) return false
    const keyset2 = new Set(keys2)
    return keys.every((key) => keyset2.has(key) && deepEqual(obj[key], obj2[key]))
  }
  return false
};
const ref1 = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!(typeof data[i] === "string")) return false
    }
  }
  if (!unique(data)) return false
  return true
};
const pointerPart = (s) => (/~\//.test(s) ? `${s}`.replace(/~/g, '~0').replace(/\//g, '~1') : s);
const format0 = new RegExp("^(?:|(?:|[a-z][a-z0-9+-.]*:)\\/?\\/)(?:|[^\\\\\\s#][^\\s#]*)(?:|#[^\\\\\\s]*)$", "i");
const pattern0 = new RegExp("^[^#]*#?$", "u");
const format1 = new RegExp("^[a-z][a-z0-9+-.]*:[^\\s]*$", "i");
const pattern1 = new RegExp("^[A-Za-z][-A-Za-z0-9.:_]*$", "u");
const ref2 = function validate(data, recursive) {
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
        if (data["$vocabulary"][key3] !== undefined) {
          if (!(typeof data["$vocabulary"][key3] === "boolean")) return false
        }
      }
    }
    if (data["$comment"] !== undefined && hasOwn(data, "$comment")) {
      if (!(typeof data["$comment"] === "string")) return false
    }
    if (data["$defs"] !== undefined && hasOwn(data, "$defs")) {
      if (!(typeof data["$defs"] === "object" && data["$defs"] && !Array.isArray(data["$defs"]))) return false
      for (const key4 of Object.keys(data["$defs"])) {
        if (data["$defs"][key4] !== undefined) {
          if (!(recursive || validate)(data["$defs"][key4], recursive || validate)) return false
        }
      }
    }
  }
  return true
};
const ref4 = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  if (data.length < 1) return false
  for (let j = 0; j < data.length; j++) {
    if (data[j] !== undefined && hasOwn(data, j)) {
      if (!validate(data[j], recursive)) return false
    }
  }
  return true
};
const format2 = (str) => {
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
const ref3 = function validate(data, recursive) {
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
      if (!sub2) {
        const sub3 = (() => {
          if (!ref4(data.items, recursive || validate)) return false
          return true
        })()
        if (!sub3) {
          return false
        }
      }
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
        if (data.properties[key5] !== undefined) {
          if (!(recursive || validate)(data.properties[key5], recursive || validate)) return false
        }
      }
    }
    if (data.patternProperties !== undefined && hasOwn(data, "patternProperties")) {
      if (!(typeof data.patternProperties === "object" && data.patternProperties && !Array.isArray(data.patternProperties))) return false
      for (const key6 of Object.keys(data.patternProperties)) {
        if (!format2(key6)) return false
      }
      for (const key7 of Object.keys(data.patternProperties)) {
        if (data.patternProperties[key7] !== undefined) {
          if (!(recursive || validate)(data.patternProperties[key7], recursive || validate)) return false
        }
      }
    }
    if (data.dependentSchemas !== undefined && hasOwn(data, "dependentSchemas")) {
      if (!(typeof data.dependentSchemas === "object" && data.dependentSchemas && !Array.isArray(data.dependentSchemas))) return false
      for (const key8 of Object.keys(data.dependentSchemas)) {
        if (data.dependentSchemas[key8] !== undefined) {
          if (!(recursive || validate)(data.dependentSchemas[key8], recursive || validate)) return false
        }
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
      if (!ref4(data.allOf, recursive || validate)) return false
    }
    if (data.anyOf !== undefined && hasOwn(data, "anyOf")) {
      if (!ref4(data.anyOf, recursive || validate)) return false
    }
    if (data.oneOf !== undefined && hasOwn(data, "oneOf")) {
      if (!ref4(data.oneOf, recursive || validate)) return false
    }
    if (data.not !== undefined && hasOwn(data, "not")) {
      if (!(recursive || validate)(data.not, recursive || validate)) return false
    }
  }
  return true
};
const ref6 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  if (!(0 <= data)) return false
  return true
};
const ref7 = function validate(data, recursive) {
  if (!ref6(data, recursive)) return false
  return true
};
const ref8 = function validate(data, recursive) {
  if (!(data === "array" || data === "boolean" || data === "integer" || data === "null" || data === "number" || data === "object" || data === "string")) return false
  return true
};
const ref5 = function validate(data, recursive) {
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
      if (!ref6(data.maxLength, recursive || validate)) return false
    }
    if (data.minLength !== undefined && hasOwn(data, "minLength")) {
      if (!ref7(data.minLength, recursive || validate)) return false
    }
    if (data.pattern !== undefined && hasOwn(data, "pattern")) {
      if (!(typeof data.pattern === "string")) return false
      if (!format2(data.pattern)) return false
    }
    if (data.maxItems !== undefined && hasOwn(data, "maxItems")) {
      if (!ref6(data.maxItems, recursive || validate)) return false
    }
    if (data.minItems !== undefined && hasOwn(data, "minItems")) {
      if (!ref7(data.minItems, recursive || validate)) return false
    }
    if (data.uniqueItems !== undefined && hasOwn(data, "uniqueItems")) {
      if (!(typeof data.uniqueItems === "boolean")) return false
    }
    if (data.maxContains !== undefined && hasOwn(data, "maxContains")) {
      if (!ref6(data.maxContains, recursive || validate)) return false
    }
    if (data.minContains !== undefined && hasOwn(data, "minContains")) {
      if (!ref6(data.minContains, recursive || validate)) return false
    }
    if (data.maxProperties !== undefined && hasOwn(data, "maxProperties")) {
      if (!ref6(data.maxProperties, recursive || validate)) return false
    }
    if (data.minProperties !== undefined && hasOwn(data, "minProperties")) {
      if (!ref7(data.minProperties, recursive || validate)) return false
    }
    if (data.required !== undefined && hasOwn(data, "required")) {
      if (!ref1(data.required, recursive || validate)) return false
    }
    if (data.dependentRequired !== undefined && hasOwn(data, "dependentRequired")) {
      if (!(typeof data.dependentRequired === "object" && data.dependentRequired && !Array.isArray(data.dependentRequired))) return false
      for (const key9 of Object.keys(data.dependentRequired)) {
        if (data.dependentRequired[key9] !== undefined) {
          if (!ref1(data.dependentRequired[key9], recursive || validate)) return false
        }
      }
    }
    if (data.enum !== undefined && hasOwn(data, "enum")) {
      if (!Array.isArray(data.enum)) return false
    }
    if (data.type !== undefined && hasOwn(data, "type")) {
      const sub4 = (() => {
        if (!ref8(data.type, recursive || validate)) return false
        return true
      })()
      if (!sub4) {
        const sub5 = (() => {
          if (!Array.isArray(data.type)) return false
          if (data.type.length < 1) return false
          for (let l = 0; l < data.type.length; l++) {
            if (data.type[l] !== undefined && hasOwn(data.type, l)) {
              if (!ref8(data.type[l], recursive || validate)) return false
            }
          }
          if (!unique(data.type)) return false
          return true
        })()
        if (!sub5) {
          return false
        }
      }
    }
  }
  return true
};
const ref9 = function validate(data, recursive) {
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
const ref10 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.format !== undefined && hasOwn(data, "format")) {
      if (!(typeof data.format === "string")) return false
    }
  }
  return true
};
const ref11 = function validate(data, recursive) {
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
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.definitions !== undefined && hasOwn(data, "definitions")) {
      if (!(typeof data.definitions === "object" && data.definitions && !Array.isArray(data.definitions))) return false
      for (const key0 of Object.keys(data.definitions)) {
        if (data.definitions[key0] !== undefined) {
          if (!(recursive || validate)(data.definitions[key0], recursive || validate)) return false
        }
      }
    }
    if (data.dependencies !== undefined && hasOwn(data, "dependencies")) {
      if (!(typeof data.dependencies === "object" && data.dependencies && !Array.isArray(data.dependencies))) return false
      for (const key1 of Object.keys(data.dependencies)) {
        if (data.dependencies[key1] !== undefined) {
          const sub0 = (() => {
            if (!(recursive || validate)(data.dependencies[key1], recursive || validate)) return false
            return true
          })()
          if (!sub0) {
            const sub1 = (() => {
              if (!ref1(data.dependencies[key1], recursive || validate)) return false
              return true
            })()
            if (!sub1) {
              return false
            }
          }
        }
      }
    }
  }
  if (!ref2(data, recursive || validate)) return false
  if (!ref3(data, recursive || validate)) return false
  if (!ref5(data, recursive || validate)) return false
  if (!ref9(data, recursive || validate)) return false
  if (!ref10(data, recursive || validate)) return false
  if (!ref11(data, recursive || validate)) return false
  return true
};
const validate = function validate(data, recursive) {
  if (!ref0(data, recursive)) return false
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] wild-card additionalProperties requires propertyNames at #/properties/definitions`


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
  const objects = []
  const primitives = new Set()
  let primitivesCount = 0
  for (const item of array) {
    if (typeof item === 'object') {
      objects.push(item)
    } else {
      primitives.add(item)
      if (primitives.size !== ++primitivesCount) return false
    }
  }
  for (let i = 1; i < objects.length; i++)
    for (let j = 0; j < i; j++) if (deepEqual(objects[i], objects[j])) return false
  return true
};
const deepEqual = (obj, obj2) => {
  if (obj === obj2) return true
  if (!obj || !obj2 || typeof obj !== typeof obj2) return false

  const proto = Object.getPrototypeOf(obj)
  if (proto !== Object.getPrototypeOf(obj2)) return false

  if (proto === Array.prototype) {
    if (!Array.isArray(obj) || !Array.isArray(obj2)) return false
    if (obj.length !== obj2.length) return false
    return obj.every((x, i) => deepEqual(x, obj2[i]))
  } else if (proto === Object.prototype) {
    const [keys, keys2] = [Object.keys(obj), Object.keys(obj2)]
    if (keys.length !== keys2.length) return false
    const keyset2 = new Set(keys2)
    return keys.every((key) => keyset2.has(key) && deepEqual(obj[key], obj2[key]))
  }
  return false
};
const ref1 = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!(typeof data[i] === "string")) return false
    }
  }
  if (!unique(data)) return false
  return true
};
const pointerPart = (s) => (/~\//.test(s) ? `${s}`.replace(/~/g, '~0').replace(/\//g, '~1') : s);
const format0 = new RegExp("^(?:|(?:|[a-z][a-z0-9+-.]*:)\\/?\\/)(?:|[^\\\\\\s#][^\\s#]*)(?:|#[^\\\\\\s]*)$", "i");
const pattern0 = new RegExp("^[^#]*#?$", "u");
const format1 = new RegExp("^[a-z][a-z0-9+-.]*:[^\\s]*$", "i");
const pattern1 = new RegExp("^[A-Za-z][-A-Za-z0-9.:_]*$", "u");
const ref2 = function validate(data, recursive) {
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
        if (data["$vocabulary"][key3] !== undefined) {
          if (!(typeof data["$vocabulary"][key3] === "boolean")) return false
        }
      }
    }
    if (data["$comment"] !== undefined && hasOwn(data, "$comment")) {
      if (!(typeof data["$comment"] === "string")) return false
    }
    if (data["$defs"] !== undefined && hasOwn(data, "$defs")) {
      if (!(typeof data["$defs"] === "object" && data["$defs"] && !Array.isArray(data["$defs"]))) return false
      for (const key4 of Object.keys(data["$defs"])) {
        if (data["$defs"][key4] !== undefined) {
          if (!(recursive || validate)(data["$defs"][key4], recursive || validate)) return false
        }
      }
    }
  }
  return true
};
const ref4 = function validate(data, recursive) {
  if (!Array.isArray(data)) return false
  if (data.length < 1) return false
  for (let j = 0; j < data.length; j++) {
    if (data[j] !== undefined && hasOwn(data, j)) {
      if (!validate(data[j], recursive)) return false
    }
  }
  return true
};
const format2 = (str) => {
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
const ref3 = function validate(data, recursive) {
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
      if (!sub2) {
        const sub3 = (() => {
          if (!ref4(data.items, recursive || validate)) return false
          return true
        })()
        if (!sub3) {
          return false
        }
      }
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
        if (data.properties[key5] !== undefined) {
          if (!(recursive || validate)(data.properties[key5], recursive || validate)) return false
        }
      }
    }
    if (data.patternProperties !== undefined && hasOwn(data, "patternProperties")) {
      if (!(typeof data.patternProperties === "object" && data.patternProperties && !Array.isArray(data.patternProperties))) return false
      for (const key6 of Object.keys(data.patternProperties)) {
        if (!format2(key6)) return false
      }
      for (const key7 of Object.keys(data.patternProperties)) {
        if (data.patternProperties[key7] !== undefined) {
          if (!(recursive || validate)(data.patternProperties[key7], recursive || validate)) return false
        }
      }
    }
    if (data.dependentSchemas !== undefined && hasOwn(data, "dependentSchemas")) {
      if (!(typeof data.dependentSchemas === "object" && data.dependentSchemas && !Array.isArray(data.dependentSchemas))) return false
      for (const key8 of Object.keys(data.dependentSchemas)) {
        if (data.dependentSchemas[key8] !== undefined) {
          if (!(recursive || validate)(data.dependentSchemas[key8], recursive || validate)) return false
        }
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
      if (!ref4(data.allOf, recursive || validate)) return false
    }
    if (data.anyOf !== undefined && hasOwn(data, "anyOf")) {
      if (!ref4(data.anyOf, recursive || validate)) return false
    }
    if (data.oneOf !== undefined && hasOwn(data, "oneOf")) {
      if (!ref4(data.oneOf, recursive || validate)) return false
    }
    if (data.not !== undefined && hasOwn(data, "not")) {
      if (!(recursive || validate)(data.not, recursive || validate)) return false
    }
  }
  return true
};
const ref6 = function validate(data, recursive) {
  if (!Number.isInteger(data)) return false
  if (!(0 <= data)) return false
  return true
};
const ref7 = function validate(data, recursive) {
  if (!ref6(data, recursive)) return false
  return true
};
const ref8 = function validate(data, recursive) {
  if (!(data === "array" || data === "boolean" || data === "integer" || data === "null" || data === "number" || data === "object" || data === "string")) return false
  return true
};
const ref5 = function validate(data, recursive) {
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
      if (!ref6(data.maxLength, recursive || validate)) return false
    }
    if (data.minLength !== undefined && hasOwn(data, "minLength")) {
      if (!ref7(data.minLength, recursive || validate)) return false
    }
    if (data.pattern !== undefined && hasOwn(data, "pattern")) {
      if (!(typeof data.pattern === "string")) return false
      if (!format2(data.pattern)) return false
    }
    if (data.maxItems !== undefined && hasOwn(data, "maxItems")) {
      if (!ref6(data.maxItems, recursive || validate)) return false
    }
    if (data.minItems !== undefined && hasOwn(data, "minItems")) {
      if (!ref7(data.minItems, recursive || validate)) return false
    }
    if (data.uniqueItems !== undefined && hasOwn(data, "uniqueItems")) {
      if (!(typeof data.uniqueItems === "boolean")) return false
    }
    if (data.maxContains !== undefined && hasOwn(data, "maxContains")) {
      if (!ref6(data.maxContains, recursive || validate)) return false
    }
    if (data.minContains !== undefined && hasOwn(data, "minContains")) {
      if (!ref6(data.minContains, recursive || validate)) return false
    }
    if (data.maxProperties !== undefined && hasOwn(data, "maxProperties")) {
      if (!ref6(data.maxProperties, recursive || validate)) return false
    }
    if (data.minProperties !== undefined && hasOwn(data, "minProperties")) {
      if (!ref7(data.minProperties, recursive || validate)) return false
    }
    if (data.required !== undefined && hasOwn(data, "required")) {
      if (!ref1(data.required, recursive || validate)) return false
    }
    if (data.dependentRequired !== undefined && hasOwn(data, "dependentRequired")) {
      if (!(typeof data.dependentRequired === "object" && data.dependentRequired && !Array.isArray(data.dependentRequired))) return false
      for (const key9 of Object.keys(data.dependentRequired)) {
        if (data.dependentRequired[key9] !== undefined) {
          if (!ref1(data.dependentRequired[key9], recursive || validate)) return false
        }
      }
    }
    if (data.enum !== undefined && hasOwn(data, "enum")) {
      if (!Array.isArray(data.enum)) return false
    }
    if (data.type !== undefined && hasOwn(data, "type")) {
      const sub4 = (() => {
        if (!ref8(data.type, recursive || validate)) return false
        return true
      })()
      if (!sub4) {
        const sub5 = (() => {
          if (!Array.isArray(data.type)) return false
          if (data.type.length < 1) return false
          for (let l = 0; l < data.type.length; l++) {
            if (data.type[l] !== undefined && hasOwn(data.type, l)) {
              if (!ref8(data.type[l], recursive || validate)) return false
            }
          }
          if (!unique(data.type)) return false
          return true
        })()
        if (!sub5) {
          return false
        }
      }
    }
  }
  return true
};
const ref9 = function validate(data, recursive) {
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
const ref10 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.format !== undefined && hasOwn(data, "format")) {
      if (!(typeof data.format === "string")) return false
    }
  }
  return true
};
const ref11 = function validate(data, recursive) {
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
const ref0 = function validate(data, recursive) {
  if (!(typeof data === "object" && data && !Array.isArray(data) || typeof data === "boolean")) return false
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.definitions !== undefined && hasOwn(data, "definitions")) {
      if (!(typeof data.definitions === "object" && data.definitions && !Array.isArray(data.definitions))) return false
      for (const key0 of Object.keys(data.definitions)) {
        if (data.definitions[key0] !== undefined) {
          if (!(recursive || validate)(data.definitions[key0], recursive || validate)) return false
        }
      }
    }
    if (data.dependencies !== undefined && hasOwn(data, "dependencies")) {
      if (!(typeof data.dependencies === "object" && data.dependencies && !Array.isArray(data.dependencies))) return false
      for (const key1 of Object.keys(data.dependencies)) {
        if (data.dependencies[key1] !== undefined) {
          const sub0 = (() => {
            if (!(recursive || validate)(data.dependencies[key1], recursive || validate)) return false
            return true
          })()
          if (!sub0) {
            const sub1 = (() => {
              if (!ref1(data.dependencies[key1], recursive || validate)) return false
              return true
            })()
            if (!sub1) {
              return false
            }
          }
        }
      }
    }
  }
  if (!ref2(data, recursive || validate)) return false
  if (!ref3(data, recursive || validate)) return false
  if (!ref5(data, recursive || validate)) return false
  if (!ref9(data, recursive || validate)) return false
  if (!ref10(data, recursive || validate)) return false
  if (!ref11(data, recursive || validate)) return false
  return true
};
const validate = function validate(data, recursive) {
  if (!ref0(data, recursive)) return false
  return true
};
return validate
```

##### Strong mode notices

 * `[requireValidation] wild-card additionalProperties requires propertyNames at #/properties/definitions`

