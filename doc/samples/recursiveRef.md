# recursiveRef

## $recursiveRef without $recursiveAnchor works like $ref

### Schema

```json
{
  "properties": { "foo": { "$recursiveRef": "#" } },
  "additionalProperties": false
}
```

### Code

```js
'use strict'
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const ref0 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.foo !== undefined && hasOwn(data, "foo")) {
      if (!validate(data.foo, recursive)) return false
    }
    for (const key0 of Object.keys(data)) {
      if (key0 !== "foo") return false
    }
  }
  return true
};
return ref0
```

### Warnings

 * `$recursiveRef without $recursiveAnchor at #/properties/foo`


## $recursiveRef without using nesting

### Schema

```json
{
  "$id": "http://localhost:4242/draft2019-09/recursiveRef2/schema.json",
  "$defs": {
    "myobject": {
      "$id": "myobject.json",
      "$recursiveAnchor": true,
      "anyOf": [
        { "type": "string" },
        { "type": "object", "additionalProperties": { "$recursiveRef": "#" } }
      ]
    }
  },
  "anyOf": [{ "type": "integer" }, { "$ref": "#/$defs/myobject" }]
}
```

### Code

```js
'use strict'
const ref1 = function validate(data, recursive) {
  const sub2 = (() => {
    if (!(typeof data === "string")) return false
    return true
  })()
  if (!sub2) {
    const sub3 = (() => {
      if (!(typeof data === "object" && data && !Array.isArray(data))) return false
      for (const key0 of Object.keys(data)) {
        if (!(recursive || validate)(data[key0], recursive || validate)) return false
      }
      return true
    })()
    if (!sub3) return false
  }
  return true
};
const ref0 = function validate(data, recursive) {
  const sub0 = (() => {
    if (!Number.isInteger(data)) return false
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      if (!ref1(data, recursive)) return false
      return true
    })()
    if (!sub1) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at http://localhost:4242/draft2019-09/recursiveRef2/schema.json#/anyOf/1/additionalProperties`


## $recursiveRef with nesting

### Schema

```json
{
  "$id": "http://localhost:4242/draft2019-09/recursiveRef3/schema.json",
  "$recursiveAnchor": true,
  "$defs": {
    "myobject": {
      "$id": "myobject.json",
      "$recursiveAnchor": true,
      "anyOf": [
        { "type": "string" },
        { "type": "object", "additionalProperties": { "$recursiveRef": "#" } }
      ]
    }
  },
  "anyOf": [{ "type": "integer" }, { "$ref": "#/$defs/myobject" }]
}
```

### Code

```js
'use strict'
const ref1 = function validate(data, recursive) {
  const sub2 = (() => {
    if (!(typeof data === "string")) return false
    return true
  })()
  if (!sub2) {
    const sub3 = (() => {
      if (!(typeof data === "object" && data && !Array.isArray(data))) return false
      for (const key0 of Object.keys(data)) {
        if (!(recursive || validate)(data[key0], recursive || validate)) return false
      }
      return true
    })()
    if (!sub3) return false
  }
  return true
};
const ref0 = function validate(data, recursive) {
  const sub0 = (() => {
    if (!Number.isInteger(data)) return false
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      if (!ref1(data, recursive || validate)) return false
      return true
    })()
    if (!sub1) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at http://localhost:4242/draft2019-09/recursiveRef3/schema.json#/anyOf/1/additionalProperties`


## $recursiveRef with $recursiveAnchor: false works like $ref

### Schema

```json
{
  "$id": "http://localhost:4242/draft2019-09/recursiveRef4/schema.json",
  "$recursiveAnchor": false,
  "$defs": {
    "myobject": {
      "$id": "myobject.json",
      "$recursiveAnchor": false,
      "anyOf": [
        { "type": "string" },
        { "type": "object", "additionalProperties": { "$recursiveRef": "#" } }
      ]
    }
  },
  "anyOf": [{ "type": "integer" }, { "$ref": "#/$defs/myobject" }]
}
```

### Code

```js
'use strict'
const ref1 = function validate(data, recursive) {
  const sub2 = (() => {
    if (!(typeof data === "string")) return false
    return true
  })()
  if (!sub2) {
    const sub3 = (() => {
      if (!(typeof data === "object" && data && !Array.isArray(data))) return false
      for (const key0 of Object.keys(data)) {
        if (!validate(data[key0], recursive)) return false
      }
      return true
    })()
    if (!sub3) return false
  }
  return true
};
const ref0 = function validate(data, recursive) {
  const sub0 = (() => {
    if (!Number.isInteger(data)) return false
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      if (!ref1(data, recursive)) return false
      return true
    })()
    if (!sub1) return false
  }
  return true
};
return ref0
```

### Warnings

 * `$recursiveRef without $recursiveAnchor at http://localhost:4242/draft2019-09/recursiveRef4/schema.json#/anyOf/1/additionalProperties`


## $recursiveRef with no $recursiveAnchor works like $ref

### Schema

```json
{
  "$id": "http://localhost:4242/draft2019-09/recursiveRef5/schema.json",
  "$defs": {
    "myobject": {
      "$id": "myobject.json",
      "$recursiveAnchor": false,
      "anyOf": [
        { "type": "string" },
        { "type": "object", "additionalProperties": { "$recursiveRef": "#" } }
      ]
    }
  },
  "anyOf": [{ "type": "integer" }, { "$ref": "#/$defs/myobject" }]
}
```

### Code

```js
'use strict'
const ref1 = function validate(data, recursive) {
  const sub2 = (() => {
    if (!(typeof data === "string")) return false
    return true
  })()
  if (!sub2) {
    const sub3 = (() => {
      if (!(typeof data === "object" && data && !Array.isArray(data))) return false
      for (const key0 of Object.keys(data)) {
        if (!validate(data[key0], recursive)) return false
      }
      return true
    })()
    if (!sub3) return false
  }
  return true
};
const ref0 = function validate(data, recursive) {
  const sub0 = (() => {
    if (!Number.isInteger(data)) return false
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      if (!ref1(data, recursive)) return false
      return true
    })()
    if (!sub1) return false
  }
  return true
};
return ref0
```

### Warnings

 * `$recursiveRef without $recursiveAnchor at http://localhost:4242/draft2019-09/recursiveRef5/schema.json#/anyOf/1/additionalProperties`


## $recursiveRef with no $recursiveAnchor in the initial target schema resource

### Schema

```json
{
  "$id": "http://localhost:4242/draft2019-09/recursiveRef6/base.json",
  "$recursiveAnchor": true,
  "anyOf": [
    { "type": "boolean" },
    {
      "type": "object",
      "additionalProperties": {
        "$id": "http://localhost:4242/draft2019-09/recursiveRef6/inner.json",
        "$comment": "there is no $recursiveAnchor: true here, so we do NOT recurse to the base",
        "anyOf": [
          { "type": "integer" },
          { "type": "object", "additionalProperties": { "$recursiveRef": "#" } }
        ]
      }
    }
  ]
}
```

### Code

```js
'use strict'
const ref1 = function validate(data, recursive) {
  const sub4 = (() => {
    if (!Number.isInteger(data)) return false
    return true
  })()
  if (!sub4) {
    const sub5 = (() => {
      if (!(typeof data === "object" && data && !Array.isArray(data))) return false
      for (const key2 of Object.keys(data)) {
        if (!validate(data[key2], recursive)) return false
      }
      return true
    })()
    if (!sub5) return false
  }
  return true
};
const ref0 = function validate(data, recursive) {
  const sub0 = (() => {
    if (!(typeof data === "boolean")) return false
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      if (!(typeof data === "object" && data && !Array.isArray(data))) return false
      for (const key0 of Object.keys(data)) {
        const sub2 = (() => {
          if (!(Number.isInteger(data[key0]))) return false
          return true
        })()
        if (!sub2) {
          const sub3 = (() => {
            if (!(typeof data[key0] === "object" && data[key0] && !Array.isArray(data[key0]))) return false
            for (const key1 of Object.keys(data[key0])) {
              if (!ref1(data[key0][key1], recursive || validate)) return false
            }
            return true
          })()
          if (!sub3) return false
        }
      }
      return true
    })()
    if (!sub1) return false
  }
  return true
};
return ref0
```

### Warnings

 * `$recursiveRef without $recursiveAnchor at #/anyOf/1/additionalProperties/anyOf/1/additionalProperties`


## $recursiveRef with no $recursiveAnchor in the outer schema resource

### Schema

```json
{
  "$id": "http://localhost:4242/draft2019-09/recursiveRef7/base.json",
  "anyOf": [
    { "type": "boolean" },
    {
      "type": "object",
      "additionalProperties": {
        "$id": "http://localhost:4242/draft2019-09/recursiveRef7/inner.json",
        "$recursiveAnchor": true,
        "anyOf": [
          { "type": "integer" },
          { "type": "object", "additionalProperties": { "$recursiveRef": "#" } }
        ]
      }
    }
  ]
}
```

### Code

```js
'use strict'
const ref1 = function validate(data, recursive) {
  const sub4 = (() => {
    if (!Number.isInteger(data)) return false
    return true
  })()
  if (!sub4) {
    const sub5 = (() => {
      if (!(typeof data === "object" && data && !Array.isArray(data))) return false
      for (const key2 of Object.keys(data)) {
        if (!(recursive || validate)(data[key2], recursive || validate)) return false
      }
      return true
    })()
    if (!sub5) return false
  }
  return true
};
const ref0 = function validate(data, recursive) {
  const sub0 = (() => {
    if (!(typeof data === "boolean")) return false
    return true
  })()
  if (!sub0) {
    const sub1 = (() => {
      if (!(typeof data === "object" && data && !Array.isArray(data))) return false
      for (const key0 of Object.keys(data)) {
        const sub2 = (() => {
          if (!(Number.isInteger(data[key0]))) return false
          return true
        })()
        if (!sub2) {
          const sub3 = (() => {
            if (!(typeof data[key0] === "object" && data[key0] && !Array.isArray(data[key0]))) return false
            for (const key1 of Object.keys(data[key0])) {
              if (!(recursive || ref1)(data[key0][key1], recursive || ref1)) return false
            }
            return true
          })()
          if (!sub3) return false
        }
      }
      return true
    })()
    if (!sub1) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `[requireValidation] type should be specified at http://localhost:4242/draft2019-09/recursiveRef7/base.json#/anyOf/1/additionalProperties`


## multiple dynamic paths to the $recursiveRef keyword

### Schema

```json
{
  "$id": "recursiveRef8_main.json",
  "$defs": {
    "inner": {
      "$id": "recursiveRef8_inner.json",
      "$recursiveAnchor": true,
      "title": "inner",
      "additionalProperties": { "$recursiveRef": "#" }
    }
  },
  "if": { "propertyNames": { "pattern": "^[a-m]" } },
  "then": {
    "title": "any type of node",
    "$id": "recursiveRef8_anyLeafNode.json",
    "$recursiveAnchor": true,
    "$ref": "recursiveRef8_inner.json"
  },
  "else": {
    "title": "integer node",
    "$id": "recursiveRef8_integerNode.json",
    "$recursiveAnchor": true,
    "type": ["object", "integer"],
    "$ref": "recursiveRef8_inner.json"
  }
}
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^[a-m]", "u");
const ref1 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key1 of Object.keys(data)) {
      if (!(recursive || validate)(data[key1], recursive || validate)) return false
    }
  }
  return true
};
const ref2 = function validate(data, recursive) {
  if (!ref1(data, recursive || validate)) return false
  return true
};
const ref3 = function validate(data, recursive) {
  if (!ref1(data, recursive || validate)) return false
  if (!(typeof data === "object" && data && !Array.isArray(data) || Number.isInteger(data))) return false
  return true
};
const ref0 = function validate(data, recursive) {
  const sub0 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      for (const key0 of Object.keys(data)) {
        if (!pattern0.test(key0)) return false
      }
    }
    return true
  })()
  if (sub0) {
    if (!ref1(data, recursive || ref2)) return false
  }
  else {
    if (!ref1(data, recursive || ref3)) return false
    if (!(typeof data === "object" && data && !Array.isArray(data) || Number.isInteger(data))) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `Should start with ^ and end with $: "^[a-m]" at #/if/propertyNames`


## dynamic $recursiveRef destination (not predictable at schema compile time)

### Schema

```json
{
  "$id": "main.json",
  "$defs": {
    "inner": {
      "$id": "inner.json",
      "$recursiveAnchor": true,
      "title": "inner",
      "additionalProperties": { "$recursiveRef": "#" }
    }
  },
  "if": { "propertyNames": { "pattern": "^[a-m]" } },
  "then": {
    "title": "any type of node",
    "$id": "anyLeafNode.json",
    "$recursiveAnchor": true,
    "$ref": "main.json#/$defs/inner"
  },
  "else": {
    "title": "integer node",
    "$id": "integerNode.json",
    "$recursiveAnchor": true,
    "type": ["object", "integer"],
    "$ref": "main.json#/$defs/inner"
  }
}
```

### Code

```js
'use strict'
const pattern0 = new RegExp("^[a-m]", "u");
const ref1 = function validate(data, recursive) {
  if (typeof data === "object" && data && !Array.isArray(data)) {
    for (const key1 of Object.keys(data)) {
      if (!(recursive || validate)(data[key1], recursive || validate)) return false
    }
  }
  return true
};
const ref2 = function validate(data, recursive) {
  if (!ref1(data, recursive || validate)) return false
  return true
};
const ref3 = function validate(data, recursive) {
  if (!ref1(data, recursive || validate)) return false
  if (!(typeof data === "object" && data && !Array.isArray(data) || Number.isInteger(data))) return false
  return true
};
const ref0 = function validate(data, recursive) {
  const sub0 = (() => {
    if (typeof data === "object" && data && !Array.isArray(data)) {
      for (const key0 of Object.keys(data)) {
        if (!pattern0.test(key0)) return false
      }
    }
    return true
  })()
  if (sub0) {
    if (!ref1(data, recursive || ref2)) return false
  }
  else {
    if (!ref1(data, recursive || ref3)) return false
    if (!(typeof data === "object" && data && !Array.isArray(data) || Number.isInteger(data))) return false
  }
  return true
};
return ref0
```

##### Strong mode notices

 * `Should start with ^ and end with $: "^[a-m]" at #/if/propertyNames`

