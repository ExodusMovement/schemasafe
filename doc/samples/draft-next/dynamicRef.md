# dynamicRef

## A $dynamicRef to a $dynamicAnchor in the same schema resource behaves like a normal $ref to an $anchor

### Schema

```json
{
  "$id": "https://test.json-schema.org/dynamicRef-dynamicAnchor-same-schema/root",
  "type": "array",
  "items": { "$dynamicRef": "#items" },
  "$defs": { "foo": { "$dynamicAnchor": "items", "type": "string" } }
}
```

### Code

```js
'use strict'
const ref1 = function validate(data, dynAnchors) {
  if (!(typeof data === "string")) return false
  return true
};
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const dynamicResolve = (anchors, id) => (anchors.filter((x) => x[id])[0] || {})[id];
const ref0 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#items"] = ref1
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!(dynamicResolve(dynAnchors || [], "#items") || ref1)(data[i], [...dynAnchors, dynLocal[0] || []])) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #/items`


## A $ref to a $dynamicAnchor in the same schema resource behaves like a normal $ref to an $anchor

### Schema

```json
{
  "$id": "https://test.json-schema.org/ref-dynamicAnchor-same-schema/root",
  "type": "array",
  "items": { "$ref": "#items" },
  "$defs": { "foo": { "$dynamicAnchor": "items", "type": "string" } }
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
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!ref1(data[i])) return false
    }
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireStringValidation] pattern, format or contentSchema should be specified for strings, use pattern: ^[\s\S]*$ to opt-out at #/items`


## A $dynamicRef resolves to the first $dynamicAnchor still in scope that is encountered when the schema is evaluated

### Schema

```json
{
  "$id": "https://test.json-schema.org/typical-dynamic-resolution/root",
  "$ref": "list",
  "$defs": {
    "foo": { "$dynamicAnchor": "items", "type": "string" },
    "list": {
      "$id": "list",
      "type": "array",
      "items": { "$dynamicRef": "#items" }
    }
  }
}
```

### Code

```js
'use strict'
const ref1 = function validate(data, dynAnchors) {
  if (!(typeof data === "string")) return false
  return true
};
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const dynamicResolve = (anchors, id) => (anchors.filter((x) => x[id])[0] || {})[id];
const ref2 = function validate(data, dynAnchors) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!dynamicResolve(dynAnchors || [], "#items")(data[i], dynAnchors)) return false
    }
  }
  return true
};
const ref0 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#items"] = ref1
  if (!ref2(data, [...dynAnchors, dynLocal[0] || []])) return false
  return true
};
return ref0
```

### Warnings

 * `$dynamicRef bookending resolution failed (even though not required) at https://test.json-schema.org/typical-dynamic-resolution/root#/items`


## A $dynamicRef with intermediate scopes that don't include a matching $dynamicAnchor does not affect dynamic scope resolution

### Schema

```json
{
  "$id": "https://test.json-schema.org/dynamic-resolution-with-intermediate-scopes/root",
  "$ref": "intermediate-scope",
  "$defs": {
    "foo": { "$dynamicAnchor": "items", "type": "string" },
    "intermediate-scope": { "$id": "intermediate-scope", "$ref": "list" },
    "list": {
      "$id": "list",
      "type": "array",
      "items": { "$dynamicRef": "#items" }
    }
  }
}
```

### Code

```js
'use strict'
const ref1 = function validate(data, dynAnchors) {
  if (!(typeof data === "string")) return false
  return true
};
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const dynamicResolve = (anchors, id) => (anchors.filter((x) => x[id])[0] || {})[id];
const ref3 = function validate(data, dynAnchors) {
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!dynamicResolve(dynAnchors || [], "#items")(data[i], dynAnchors)) return false
    }
  }
  return true
};
const ref2 = function validate(data, dynAnchors) {
  if (!ref3(data, dynAnchors)) return false
  return true
};
const ref0 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#items"] = ref1
  if (!ref2(data, [...dynAnchors, dynLocal[0] || []])) return false
  return true
};
return ref0
```

### Warnings

 * `$dynamicRef bookending resolution failed (even though not required) at https://test.json-schema.org/dynamic-resolution-with-intermediate-scopes/root#/items`


## An $anchor with the same name as a $dynamicAnchor is not used for dynamic scope resolution

### Schema

```json
{
  "$id": "https://test.json-schema.org/dynamic-resolution-ignores-anchors/root",
  "$ref": "list",
  "$defs": {
    "foo": { "$anchor": "items", "type": "string" },
    "list": {
      "$id": "list",
      "type": "array",
      "items": { "$dynamicRef": "#items" },
      "$defs": { "items": { "$dynamicAnchor": "items" } }
    }
  }
}
```

### Code

```js
'use strict'
const ref2 = function validate(data, dynAnchors) {
  return true
};
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const dynamicResolve = (anchors, id) => (anchors.filter((x) => x[id])[0] || {})[id];
const ref1 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#items"] = ref2
  if (!Array.isArray(data)) return false
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== undefined && hasOwn(data, i)) {
      if (!(dynamicResolve(dynAnchors || [], "#items") || ref2)(data[i], [...dynAnchors, dynLocal[0] || []])) return false
    }
  }
  return true
};
const ref0 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  if (!ref1(data, [...dynAnchors, dynLocal[0] || []])) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at https://test.json-schema.org/dynamic-resolution-ignores-anchors/root#/items`


## A $dynamicRef that initially resolves to a schema with a matching $dynamicAnchor resolves to the first $dynamicAnchor in the dynamic scope

### Schema

```json
{
  "$id": "https://test.json-schema.org/relative-dynamic-reference/root",
  "$dynamicAnchor": "meta",
  "type": "object",
  "properties": { "foo": { "const": "pass" } },
  "$ref": "extended",
  "$defs": {
    "extended": {
      "$id": "extended",
      "$dynamicAnchor": "meta",
      "type": "object",
      "properties": { "bar": { "$ref": "bar" } }
    },
    "bar": {
      "$id": "bar",
      "type": "object",
      "properties": { "baz": { "$dynamicRef": "extended#meta" } }
    }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const dynamicResolve = (anchors, id) => (anchors.filter((x) => x[id])[0] || {})[id];
const ref2 = function validate(data, dynAnchors) {
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.baz !== undefined && hasOwn(data, "baz")) {
    if (!(dynamicResolve(dynAnchors || [], "#meta") || ref1)(data.baz, dynAnchors)) return false
  }
  return true
};
const ref1 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#meta"] = validate
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.bar !== undefined && hasOwn(data, "bar")) {
    if (!ref2(data.bar, [...dynAnchors, dynLocal[0] || []])) return false
  }
  return true
};
const ref0 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#meta"] = validate
  if (!ref1(data, [...dynAnchors, dynLocal[0] || []])) return false
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.foo !== undefined && hasOwn(data, "foo")) {
    if (!(data.foo === "pass")) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at https://test.json-schema.org/relative-dynamic-reference/root#/properties/baz`


## multiple dynamic paths to the $dynamicRef keyword

### Schema

```json
{
  "$id": "https://test.json-schema.org/dynamic-ref-with-multiple-paths/main",
  "propertyDependencies": {
    "kindOfList": {
      "numbers": { "$ref": "numberList" },
      "strings": { "$ref": "stringList" }
    }
  },
  "$defs": {
    "genericList": {
      "$id": "genericList",
      "properties": { "list": { "items": { "$dynamicRef": "#itemType" } } }
    },
    "numberList": {
      "$id": "numberList",
      "$defs": {
        "itemType": { "$dynamicAnchor": "itemType", "type": "number" }
      },
      "$ref": "genericList"
    },
    "stringList": {
      "$id": "stringList",
      "$defs": {
        "itemType": { "$dynamicAnchor": "itemType", "type": "string" }
      },
      "$ref": "genericList"
    }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref2 = function validate(data, dynAnchors) {
  if (!(typeof data === "number")) return false
  return true
};
const dynamicResolve = (anchors, id) => (anchors.filter((x) => x[id])[0] || {})[id];
const ref3 = function validate(data, dynAnchors) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.list !== undefined && hasOwn(data, "list")) {
      if (Array.isArray(data.list)) {
        for (let i = 0; i < data.list.length; i++) {
          if (data.list[i] !== undefined && hasOwn(data.list, i)) {
            if (!dynamicResolve(dynAnchors || [], "#itemType")(data.list[i], dynAnchors)) return false
          }
        }
      }
    }
  }
  return true
};
const ref1 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#itemType"] = ref2
  if (!ref3(data, [...dynAnchors, dynLocal[0] || []])) return false
  return true
};
const ref5 = function validate(data, dynAnchors) {
  if (!(typeof data === "string")) return false
  return true
};
const ref4 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#itemType"] = ref5
  if (!ref3(data, [...dynAnchors, dynLocal[0] || []])) return false
  return true
};
const ref0 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.kindOfList !== undefined && hasOwn(data, "kindOfList")) {
      if (data.kindOfList === "numbers") {
        if (!ref1(data, [...dynAnchors, dynLocal[0] || []])) return false
      }
      if (data.kindOfList === "strings") {
        if (!ref4(data, [...dynAnchors, dynLocal[0] || []])) return false
      }
    }
  }
  return true
};
return ref0
```

### Warnings

 * `$dynamicRef bookending resolution failed (even though not required) at https://test.json-schema.org/dynamic-ref-with-multiple-paths/main#/properties/list/items`


## after leaving a dynamic scope, it is not used by a $dynamicRef

### Schema

```json
{
  "$id": "https://test.json-schema.org/dynamic-ref-leaving-dynamic-scope/main",
  "if": {
    "$id": "first_scope",
    "$defs": {
      "thingy": {
        "$comment": "this is first_scope#thingy",
        "$dynamicAnchor": "thingy",
        "type": "number"
      }
    }
  },
  "then": {
    "$id": "second_scope",
    "$ref": "start",
    "$defs": {
      "thingy": {
        "$comment": "this is second_scope#thingy, the final destination of the $dynamicRef",
        "$dynamicAnchor": "thingy",
        "type": "null"
      }
    }
  },
  "$defs": {
    "start": {
      "$comment": "this is the landing spot from $ref",
      "$id": "start",
      "$dynamicRef": "inner_scope#thingy"
    },
    "thingy": {
      "$comment": "this is the first stop for the $dynamicRef",
      "$id": "inner_scope",
      "$dynamicAnchor": "thingy",
      "type": "string"
    }
  }
}
```

### Code

```js
'use strict'
const ref1 = function validate(data, dynAnchors) {
  if (!(typeof data === "number")) return false
  return true
};
const ref2 = function validate(data, dynAnchors) {
  if (!(data === null)) return false
  return true
};
const ref4 = function validate(data, dynAnchors) {
  if (!(typeof data === "string")) return false
  return true
};
const dynamicResolve = (anchors, id) => (anchors.filter((x) => x[id])[0] || {})[id];
const ref3 = function validate(data, dynAnchors) {
  if (!(dynamicResolve(dynAnchors || [], "#thingy") || ref4)(data, dynAnchors)) return false
  return true
};
const ref0 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  const sub0 = (() => {
    dynLocal.unshift({})
    dynLocal[0]["#thingy"] = ref1
    dynLocal.shift()
    return true
  })()
  if (sub0) {
    dynLocal.unshift({})
    dynLocal[0]["#thingy"] = ref2
    if (!ref3(data, [...dynAnchors, dynLocal[0] || []])) return false
    dynLocal.shift()
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at #`


## strict-tree schema, guards against misspelled properties

### Schema

```json
{
  "$id": "http://localhost:1234/draft-next/strict-tree.json",
  "$dynamicAnchor": "node",
  "$ref": "tree.json",
  "unevaluatedProperties": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const dynamicResolve = (anchors, id) => (anchors.filter((x) => x[id])[0] || {})[id];
const ref1 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#node"] = validate
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (data.children !== undefined && hasOwn(data, "children")) {
    if (!Array.isArray(data.children)) return false
    for (let i = 0; i < data.children.length; i++) {
      if (data.children[i] !== undefined && hasOwn(data.children, i)) {
        if (!(dynamicResolve(dynAnchors || [], "#node") || validate)(data.children[i], [...dynAnchors, dynLocal[0] || []])) return false
      }
    }
  }
  return true
};
const ref0 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#node"] = validate
  if (!ref1(data, [...dynAnchors, dynLocal[0] || []])) return false
  for (const key0 of Object.keys(data)) {
    if (key0 !== "children" && key0 !== "data") return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at http://localhost:1234/draft-next/tree.json#/properties/data`


## tests for implementation dynamic anchor and reference link

### Schema

```json
{
  "$id": "http://localhost:1234/draft-next/strict-extendible.json",
  "$ref": "extendible-dynamic-ref.json",
  "$defs": {
    "elements": {
      "$dynamicAnchor": "elements",
      "properties": { "a": true },
      "required": ["a"],
      "additionalProperties": false
    }
  }
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data, dynAnchors) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data.a !== undefined && hasOwn(data, "a"))) return false
    for (const key0 of Object.keys(data)) {
      if (key0 !== "a") return false
    }
  }
  return true
};
const ref3 = function validate(data, dynAnchors) {
  return true
};
const dynamicResolve = (anchors, id) => (anchors.filter((x) => x[id])[0] || {})[id];
const ref2 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#elements"] = ref3
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (!(data.elements !== undefined && hasOwn(data, "elements"))) return false
  if (!Array.isArray(data.elements)) return false
  for (let i = 0; i < data.elements.length; i++) {
    if (data.elements[i] !== undefined && hasOwn(data.elements, i)) {
      if (!(dynamicResolve(dynAnchors || [], "#elements") || ref3)(data.elements[i], [...dynAnchors, dynLocal[0] || []])) return false
    }
  }
  for (const key1 of Object.keys(data)) {
    if (key1 !== "elements") return false
  }
  return true
};
const ref0 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#elements"] = ref1
  if (!ref2(data, [...dynAnchors, dynLocal[0] || []])) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at http://localhost:1234/draft-next/strict-extendible.json#/properties/a`


## $ref and $dynamicAnchor are independent of order - $defs first

### Schema

```json
{
  "$id": "http://localhost:1234/draft-next/strict-extendible-allof-defs-first.json",
  "allOf": [
    { "$ref": "extendible-dynamic-ref.json" },
    {
      "$defs": {
        "elements": {
          "$dynamicAnchor": "elements",
          "properties": { "a": true },
          "required": ["a"],
          "additionalProperties": false
        }
      }
    }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data, dynAnchors) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data.a !== undefined && hasOwn(data, "a"))) return false
    for (const key0 of Object.keys(data)) {
      if (key0 !== "a") return false
    }
  }
  return true
};
const ref3 = function validate(data, dynAnchors) {
  return true
};
const dynamicResolve = (anchors, id) => (anchors.filter((x) => x[id])[0] || {})[id];
const ref2 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#elements"] = ref3
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (!(data.elements !== undefined && hasOwn(data, "elements"))) return false
  if (!Array.isArray(data.elements)) return false
  for (let i = 0; i < data.elements.length; i++) {
    if (data.elements[i] !== undefined && hasOwn(data.elements, i)) {
      if (!(dynamicResolve(dynAnchors || [], "#elements") || ref3)(data.elements[i], [...dynAnchors, dynLocal[0] || []])) return false
    }
  }
  for (const key1 of Object.keys(data)) {
    if (key1 !== "elements") return false
  }
  return true
};
const ref0 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#elements"] = ref1
  if (!ref2(data, [...dynAnchors, dynLocal[0] || []])) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at http://localhost:1234/draft-next/strict-extendible-allof-defs-first.json#/properties/a`


## $ref and $dynamicAnchor are independent of order - $ref first

### Schema

```json
{
  "$id": "http://localhost:1234/draft-next/strict-extendible-allof-ref-first.json",
  "allOf": [
    {
      "$defs": {
        "elements": {
          "$dynamicAnchor": "elements",
          "properties": { "a": true },
          "required": ["a"],
          "additionalProperties": false
        }
      }
    },
    { "$ref": "extendible-dynamic-ref.json" }
  ]
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref1 = function validate(data, dynAnchors) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (!(data.a !== undefined && hasOwn(data, "a"))) return false
    for (const key0 of Object.keys(data)) {
      if (key0 !== "a") return false
    }
  }
  return true
};
const ref3 = function validate(data, dynAnchors) {
  return true
};
const dynamicResolve = (anchors, id) => (anchors.filter((x) => x[id])[0] || {})[id];
const ref2 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#elements"] = ref3
  if (!(typeof data === "object" && data && !Array.isArray(data))) return false
  if (!(data.elements !== undefined && hasOwn(data, "elements"))) return false
  if (!Array.isArray(data.elements)) return false
  for (let i = 0; i < data.elements.length; i++) {
    if (data.elements[i] !== undefined && hasOwn(data.elements, i)) {
      if (!(dynamicResolve(dynAnchors || [], "#elements") || ref3)(data.elements[i], [...dynAnchors, dynLocal[0] || []])) return false
    }
  }
  for (const key1 of Object.keys(data)) {
    if (key1 !== "elements") return false
  }
  return true
};
const ref0 = function validate(data, dynAnchors = []) {
  const dynLocal = [{}]
  dynLocal[0]["#elements"] = ref1
  if (!ref2(data, [...dynAnchors, dynLocal[0] || []])) return false
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] schema = true is not allowed at http://localhost:1234/draft-next/strict-extendible-allof-ref-first.json#/properties/a`


## $dynamicAnchor inside propertyDependencies

### Schema

```json
{
  "$id": "http://localhost:1234/draft-next/dynamicanchor-in-propertydependencies.json",
  "$defs": {
    "inner": {
      "$id": "inner",
      "$dynamicAnchor": "foo",
      "type": "object",
      "properties": { "expectedTypes": { "type": "string" } },
      "additionalProperties": { "$dynamicRef": "#foo" }
    }
  },
  "propertyDependencies": {
    "expectedTypes": {
      "strings": {
        "$id": "east",
        "$ref": "inner",
        "$defs": { "foo": { "$dynamicAnchor": "foo", "type": "string" } }
      },
      "integers": {
        "$id": "west",
        "$ref": "inner",
        "$defs": { "foo": { "$dynamicAnchor": "foo", "type": "integer" } }
      }
    }
  }
}
```

### Code

**FAILED TO COMPILE**

### Errors

 * `Unexpected $dynamicAnchor resolution: foo at #/propertyDependencies/expectedTypes/strings`

