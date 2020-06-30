'use strict'

const tape = require('tape')
const { validator } = require('../../')

tape('unmodifiedPrototypes without isJSON does not cause pollution on class instances', (t) => {
  const schema = { properties: { foo: { properties: { bar: { default: 'polluted' } } } } }

  class X {}
  X.prototype.foo = {}

  validator(schema, { useDefaults: true })(new X())
  t.strictEqual(X.prototype.foo.bar, undefined, 'does not pollute class prototoype')

  validator(schema, { useDefaults: true, unmodifiedPrototypes: true })(new X())
  t.strictEqual(X.prototype.foo.bar, undefined, 'unmodifiedPrototypes does not affect non-JSON')

  // note that the behavior is different if input is assumed to be JSON via `isJSON: true`

  t.end()
})
