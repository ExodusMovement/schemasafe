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
 *
 * WARNING: it is important that this doesn't produce invalid information. i.e.:
 *  * Extra properties or patterns, too high items
 *  * Missing dyn.properties or dyn.patterns, too low dyn.items
 *  * Extra fullstring flag or required entries
 *  * Missing types, if type is present
 *  * Missing unknown
 *
 * The other way around is non-optimal but safe.
 *
 * null means any type (i.e. any type is possible, not validated)
 * true in properties means any property (i.e. all properties were evaluated)
 */

const initTracing = () => ({
  ...{ properties: [], patterns: [], required: [], items: 0, type: null, fullstring: false },
  dyn: { properties: [], patterns: [], items: 0 },
  unknown: false,
})

const merge = (a, b = []) => [...new Set([...a, ...b])]
const intersect = (a, b) => a.filter((x) => b.includes(x))
const wrap = (A) => ({ ...initTracing(), ...A }) // sets default empty values
const wrapFun = (f) => (...args) => f(...args.map(wrap))
const noType = (A, type) => A.type && !A.type.includes(type)
const stringValidated = (A) => A.fullstring || noType(A, 'string')

// Result means that both sets A and B are correct
// type is intersected, lists of known properties are merged
const andDelta = wrapFun((A, B) => ({
  items: Math.max(A.items, B.items),
  properties: merge(A.properties, B.properties),
  patterns: merge(A.patterns, B.patterns),
  required: merge(A.required, B.required),
  type: A.type && B.type ? intersect(A.type, B.type) : A.type || B.type || null,
  fullstring: stringValidated(A) || stringValidated(B),
  dyn: {
    items: Math.max(A.dyn.items, B.dyn.items),
    properties: merge(A.dyn.properties, B.dyn.properties),
    patterns: merge(A.dyn.patterns, B.dyn.patterns),
  },
  unknown: A.unknown || B.unknown,
}))

const regtest = (pattern, value) => new RegExp(pattern, 'u').test(value)

const orProperties = (A, B) => {
  const { properties: a, patterns: rega } = A
  const { properties: b, patterns: regb } = B
  if (noType(A, 'object') || a.includes(true)) return b
  if (noType(B, 'object') || b.includes(true)) return a
  const afiltered = a.filter((x) => b.includes(x) || regb.some((p) => regtest(p, x)))
  const bfiltered = b.filter((x) => rega.some((p) => regtest(p, x)))
  return [...afiltered, ...bfiltered]
}

const inProperties = ({ properties: a, patterns: rega }, { properties: b, patterns: regb }) =>
  a.includes(true) ||
  (regb.every((x) => rega.includes(x)) &&
    b.every((x) => a.includes(x) || rega.some((p) => regtest(p, x))))

// Result means that at least one of sets A and B is correct
// type is merged, lists of known properties are intersected
const orDelta = wrapFun((A, B) => ({
  items: Math.min(A.items, B.items),
  properties: orProperties(A, B),
  patterns: A.patterns.filter((x) => B.patterns.includes(x)),
  required: A.required.filter((x) => B.required.includes(x)),
  type: A.type && B.type ? merge(A.type, B.type) : null,
  fullstring: stringValidated(A) && stringValidated(B),
  dyn: {
    items: Math.max(A.items, B.items, A.dyn.items, B.dyn.items),
    properties: merge(merge(A.properties, B.properties), merge(A.dyn.properties, B.dyn.properties)),
    patterns: merge(merge(A.patterns, B.patterns), merge(A.dyn.patterns, B.dyn.patterns)),
  },
  unknown: A.unknown || B.unknown,
}))

// Acts as andDelta, perhaps merge the impls?
const applyDelta = (stat, delta) => {
  if (delta.items) stat.items = Math.max(stat.items, delta.items)
  if (delta.properties) stat.properties = merge(stat.properties, delta.properties)
  if (delta.patterns) stat.patterns = merge(stat.patterns, delta.patterns)
  if (delta.required) stat.required = merge(stat.required, delta.required)
  if (delta.type) stat.type = stat.type ? intersect(stat.type, delta.type) : delta.type
  if (delta.fullstring || noType(stat, 'string')) stat.fullstring = true
  if (delta.dyn) stat.dyn.items = Math.max(stat.dyn.items, delta.dyn.items)
  if (delta.dyn) stat.dyn.properties = merge(stat.dyn.properties, delta.dyn.properties)
  if (delta.dyn) stat.dyn.patterns = merge(stat.dyn.patterns, delta.dyn.patterns)
  if (delta.unknown) stat.unknown = true
}

const isDynamic = wrapFun(({ unknown, items, dyn, ...stat }) => ({
  items: items !== Infinity && (unknown || dyn.items > items),
  properties: !stat.properties.includes(true) && (unknown || !inProperties(stat, dyn)),
}))

module.exports = { initTracing, andDelta, orDelta, applyDelta, isDynamic, inProperties }
