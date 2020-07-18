'use strict'

const tape = require('tape')
const path = require('path')
const { readFileSync } = require('fs')
const { initTracing, andDelta: And, orDelta: Or, isDynamic } = require('../src/tracing')

const input = readFileSync(path.join(__dirname, 'tracing.input.txt'), 'utf-8')
  .trim()
  .split('\n')
const parse = (str) => {
  const obj = JSON.parse(str)
  // items can be Infinty, but that goes as null in JSON (items can't be null)
  if (obj.items === null) obj.items = Infinity
  if (obj.dyn && obj.dyn.items === null) obj.dyn.items = Infinity
  for (const key of ['type', 'properties', 'patterns', 'required']) if (obj[key]) obj[key].sort()
  return obj
}
const stringify = (obj) => JSON.stringify(obj)
const equal = (a, ...rest) => rest.every((b) => stringify(a) === stringify(b)) // key order is also the same

const parsed = input.map(parse)

/* Note that this doesn't behave like logical operations, it represents information about constraints.
  * The difference is in `Or` operation, e.g:
  *   * And(T, x) = Or(F, x) = x, where `T` is an always-passing constraint
  *   * And(F, x) = F, where `F` is a never-passing constraint
  *   * Or(T, x?) = And(T, x?), where `x?` is `Or(T, x)`. `Or(T, x)` is not always equal to `T`.
  *   * Or(T, x?) = Or(F, x?), from the above logic
  */
const T = And({}, {})
const F = And({}, { type: [] })
const S = { properties: ['x'], items: 1 }
// const A = { properties: [true], items: Infinity }

const zeroOrder = () => {
  if (!equal(T, T) || !equal(F, F) || equal(T, F)) return false
  if (!equal(T, T, T) || equal(T, T, F) || equal(T, F, T) || equal(F, T, T)) return false
  if (!equal(F, F, F) || equal(F, F, T) || equal(F, T, F) || equal(T, F, F)) return false
  for (const t of [{}, And({}, {}), Or({}, {})]) if (!equal(And({}, t), Or({}, T), T)) return false
  for (const f of [{ type: [] }, And({}, { type: [] })])
    if (!equal(And({}, f), And(T, f), F)) return false
  const [dt, df, dor] = [isDynamic(T), isDynamic(F), isDynamic(Or(T, S))]
  if (dt.properties || dt.items || df.properties || df.items || !dor.properties || !dor.items)
    return false
  return true
}

const firstOrder = () => {
  for (const x of parsed) {
    const eq = And({}, x) // equivalent
    for (const y of [x, eq]) {
      if (!x.unknown && (isDynamic(y).items || isDynamic(y).properties)) return false
      const mb = Or({}, y) // `y?`
      for (const res of [And(y, T), And(T, y), And(y, y), Or(y, eq), Or(y, x), Or(F, y), Or(y, F)])
        if (!equal(res, eq)) return false
      for (const res of [Or(y, T), Or(T, y), Or(mb, T), Or(T, mb), And(T, mb), And(mb, T)])
        if (!equal(res, mb)) return false
      for (const res of [Or(mb, mb), And(mb, mb), Or(mb, y), Or(y, mb), Or(F, mb), Or(mb, F)])
        if (!equal(res, mb)) return false
      for (const res of [And(y, F), And(F, y), And(mb, F), And(F, mb)])
        if (!equal(res, F)) return false
    }
  }
  return true
}

const secondOrder = () => {
  for (const x of parsed) {
    for (const y of parsed) {
      const and = And(x, y)
      const or = Or(x, y)
      if (!equal(And(y, x), and)) return false
      if (!equal(Or(y, x), or)) return false
      for (const z of [x, y, and, or]) if (!equal(and, And(and, z), And(z, and))) return false
      for (const z of [x, y, or, and]) if (!equal(or, Or(or, z), Or(z, or))) return false
    }
  }
  return true
}

const inputRecheck = () => input.map(parse).every((x, i) => equal(parsed[i], x))

tape('tracing', (t) => {
  t.deepEqual(initTracing(), And({}, {}), 'init')
  t.equal(zeroOrder(), true, 'zero order operations sanity')
  t.equal(firstOrder(), true, 'first order operations sanity')
  t.equal(secondOrder(), true, 'second order operations sanity')
  t.equal(inputRecheck(), true, 'input was not corrupted')
  t.end()
})
