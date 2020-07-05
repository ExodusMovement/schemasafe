'use strict'

/* This file implements operations for static tracing of evaluated items/properties, which is also
 * used to determine whether dynamic evaluated tracing is required or the schema can be compiled
 * with only statical checks.
 *
 * That is done by keeping track of evaluated and potentially evaluated and accounting to that
 * while doing merges and intersections.
 *
 * isDynamic() checks that all potentially evaluated are also definitely evaluated, seperately
 * for items and properties, for use with unevaluatedItems and unevaluatedProperties.
 */

const initTracing = () => ({
  ...{ properties: [], patterns: [], required: [], items: 0, type: null, fullstring: false },
  dyn: { properties: [], patterns: [], items: 0 },
  unknown: false,
})

const wrap = (A) => ({ ...initTracing(), ...A }) // sets default empty values
const wrapFun = (f) => (...args) => f(...args.map(wrap))
const stringValidated = (A) => A.fullstring || (A.type && !A.type.includes('string'))

// Result means that both sets A and B are correct
const andDelta = wrapFun((A, B) => ({
  items: Math.max(A.items, B.items),
  properties: [...A.properties, ...B.properties],
  patterns: [...A.patterns, ...B.patterns],
  required: [...A.required, ...B.required],
  type: A.type && B.type ? [...new Set([...A.type, ...B.type])] : null,
  fullstring: stringValidated(A) || stringValidated(B),
  dyn: {
    items: Math.max(A.dyn.items, B.dyn.items),
    properties: [...A.dyn.properties, ...B.dyn.properties],
    patterns: [...A.dyn.patterns, ...B.dyn.patterns],
  },
  unknown: A.unknown || B.unknown,
}))

const regtest = (pattern, value) => new RegExp(pattern, 'u').test(value)

const orProperties = ({ properties: a, patterns: rega }, { properties: b, patterns: regb }) => {
  if (a.includes(true)) return b
  if (b.includes(true)) return a
  const afiltered = a.filter((x) => b.includes(x) || regb.some((p) => regtest(p, x)))
  const bfiltered = b.filter((x) => rega.some((p) => regtest(p, x)))
  return [...afiltered, ...bfiltered]
}

const inProperties = ({ properties: a, patterns: rega }, { properties: b, patterns: regb }) =>
  a.includes(true) ||
  (regb.every((x) => rega.includes(x)) &&
    b.every((x) => a.includes(x) || rega.some((p) => regtest(p, x))))

// Result means that at least one of sets A and B is correct
const orDelta = wrapFun((A, B) => ({
  items: Math.min(A.items, B.items),
  properties: orProperties(A, B),
  patterns: A.patterns.filter((x) => B.patterns.includes(x)),
  required: A.required.filter((x) => B.required.includes(x)),
  type: A.type && B.type ? A.type.filter((x) => B.type.includes(x)) : null,
  fullstring: stringValidated(A) && stringValidated(B),
  dyn: {
    items: Math.max(A.items, B.items, A.dyn.items, B.dyn.items),
    properties: [...A.properties, ...B.properties, ...A.dyn.properties, ...B.dyn.properties],
    patterns: [...A.patterns, ...B.patterns, ...A.dyn.patterns, ...B.dyn.patterns],
  },
  unknown: A.unknown || B.unknown,
}))

const applyDelta = (stat, delta) => {
  if (delta.items) stat.items = Math.max(stat.items, delta.items)
  if (delta.properties) stat.properties.push(...delta.properties)
  if (delta.patterns) stat.patterns.push(...delta.patterns)
  if (delta.required) stat.required.push(...delta.required)
  if (delta.type)
    stat.type = stat.type ? stat.type.filter((x) => delta.type.includes(x)) : delta.type
  if (delta.fullstring || (stat.type && !stat.type.includes('string'))) stat.fullstring = true
  if (delta.dyn) stat.dyn.items = Math.max(stat.dyn.items, delta.dyn.items)
  if (delta.dyn) stat.dyn.properties.push(...delta.dyn.properties)
  if (delta.dyn) stat.dyn.patterns.push(...delta.dyn.patterns)
  if (delta.unknown) stat.unknown = true
}

const isDynamic = wrapFun(({ unknown, items, dyn, ...stat }) => ({
  items: items !== Infinity && (unknown || dyn.items > items),
  properties: !stat.properties.includes(true) && (unknown || !inProperties(stat, dyn)),
}))

module.exports = { initTracing, andDelta, orDelta, applyDelta, isDynamic, inProperties }
