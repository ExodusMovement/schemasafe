# propertyDependencies

## propertyDependencies doesn't act on non-objects

### Schema

```json
{ "propertyDependencies": { "foo": { "bar": false } } }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  return true
};
return ref0
```

### Warnings

 * `Keyword not supported: "propertyDependencies" at #`


## propertyDependencies doesn't act on non-string property values

### Schema

```json
{ "propertyDependencies": { "foo": { "bar": false } } }
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  return true
};
return ref0
```

### Warnings

 * `Keyword not supported: "propertyDependencies" at #`


## multiple options selects the right one

### Schema

```json
{
  "propertyDependencies": {
    "foo": {
      "bar": { "minProperties": 2, "maxProperties": 2 },
      "baz": { "maxProperties": 1 },
      "qux": true,
      "quux": false
    }
  }
}
```

### Code

```js
'use strict'
const ref0 = function validate(data) {
  return true
};
return ref0
```

### Warnings

 * `Keyword not supported: "propertyDependencies" at #`

### Misclassified!

**This schema caused 4 misclassifications!**

