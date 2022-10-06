# vocabulary

## schema that uses custom metaschema with with no validation vocabulary

### Schema

```json
{
  "$id": "https://schema/using/no/validation",
  "$schema": "http://localhost:1234/draft2019-09/metaschema-no-validation.json",
  "properties": { "badProperty": false, "numberProperty": { "minimum": 10 } }
}
```

### Code

**FAILED TO COMPILE**

### Errors

 * `Unexpected schema version: "https://localhost:1234/draft2019-09/metaschema-no-validation.json" at #`

