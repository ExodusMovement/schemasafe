# Linter mode

**[Experimental]**

`@exodus/schemasafe` can also function in a linter mode, collecting all schema
errors instead of throwing on the first one.

Usage:

```cjs
const { lint } = require('@exodus/schemasafe')
const fs = require('fs')
const path = require('path')

const dir = 'schemas/json'
const files = fs.readdirSync(dir).sort().map(x => path.join(dir, x))
const schemas = files.map(x => [x, JSON.parse(fs.readFileSync(x, 'utf-8'))])

for (const [name, schema] of schemas) {
  const errors = lint(schema) // lint(schema, { mode: 'strong' })
  for (const e of errors) {
    console.log(`${name}: ${e.message}`)
  }
}
```

Other [options](./Options.md) are similar to `parser()` and `validator()` modes.

**Warning:** Exact output messages/details are experimental and might change in
non-major versions.
