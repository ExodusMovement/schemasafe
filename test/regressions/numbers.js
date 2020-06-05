const tape = require('tape')
const validator = require('../../')

tape('number', (t) => {
  const validate = validator({ type: 'number' })

  t.ok(validate(0), '0 is a number')
  t.ok(validate(Infinity), 'Infinity is a number')
  t.ok(validate(NaN), 'NaN is a number')
  t.notOk(validate('1'), 'string is not a number')
  t.ok(validate(1), '1 is a number')
  t.ok(validate(1.5), '1.5 is a number')
  t.ok(validate(Number.MAX_SAFE_INTEGER), 'MAX_SAFE_INTEGER is a number')
  t.ok(validate(2 * Number.MAX_SAFE_INTEGER), '2 * MAX_SAFE_INTEGER is a number')

  t.end()
})

tape('integer', (t) => {
  const validate = validator({ type: 'integer' })

  t.ok(validate(0), '0 is an integer')
  t.notOk(validate(Infinity), 'Infinity is not an integer')
  t.notOk(validate(NaN), 'NaN is not an integer')
  t.notOk(validate('1'), 'string is not an integer')
  t.ok(validate(1), '1 is an integer')
  t.notOk(validate(1.5), '1.5 is not an integer')
  t.ok(validate(Number.MAX_SAFE_INTEGER), 'MAX_SAFE_INTEGER is an integer')
  t.ok(validate(2 * Number.MAX_SAFE_INTEGER), '2 * MAX_SAFE_INTEGER is an integer')

  t.end()
})

tape('maximum', (t) => {
  const validate = validator({ maximum: 1 })

  t.ok(validate(0), '0 <= 1')
  t.notOk(validate(Infinity), '!(Infinity <= 1)')
  t.notOk(validate(NaN), '!(NaN <= 1)')
  t.ok(validate('1'), 'string is not a number so is allowed unless type is checked')
  t.ok(validate(1), '1 <= 1')
  t.notOk(validate(1.5), '!(1.5 <= 1)')
  t.notOk(validate(Number.MAX_SAFE_INTEGER), '!(MAX_SAFE_INTEGER <= 1)')
  t.notOk(validate(2 * Number.MAX_SAFE_INTEGER), '!(2 * MAX_SAFE_INTEGER <= 1)')

  t.end()
})

tape('minimum', (t) => {
  const validate = validator({ minimum: 1 })

  t.notOk(validate(0), '!(0 >= 1)')
  t.ok(validate(Infinity), 'Infinity >= 1')
  t.notOk(validate(NaN), '!(NaN >= 1)')
  t.ok(validate('1'), 'string is not a number so is allowed unless type is checked')
  t.ok(validate(1), '1 >= 1')
  t.ok(validate(1.5), '1.5 >= 1')
  t.ok(validate(Number.MAX_SAFE_INTEGER), 'MAX_SAFE_INTEGER >= 1')
  t.ok(validate(2 * Number.MAX_SAFE_INTEGER), '2 * MAX_SAFE_INTEGER >= 1')

  t.end()
})
