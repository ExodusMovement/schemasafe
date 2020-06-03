const tape = require('tape')
const validator = require('../../')

tape('unique is not confused by type mismatch', (t) => {
  const validate = validator({ type: 'array', uniqueItems: true })

  t.ok(validate([1, 2]), 'unique items in array')
  t.ok(validate([1, '2']), 'unique items in array, different types')
  t.notOk(validate([1, 1]), 'not unique items in array')
  t.ok(validate([1, '1']), 'unique items in array because of different types')
  t.ok(validate([{}, '{}']), 'unique items in array because of different types, object form')
  t.notOk(validate([{ a: 1, b: 2 }, { b: 2, a: 1 }]), 'objects are non-unique despite key order')

  t.end()
})
