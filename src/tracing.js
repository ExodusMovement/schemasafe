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
  ...{ properties: [], patterns: [], items: 0 },
  dyn: { properties: [], patterns: [], items: 0 },
  unknown: false,
})

// Result means that both sets A and B are correct
const andDelta = (A, B) => ({
  items: Math.max(A.items || 0, B.items || 0),
  properties: [...(A.properties || []), ...(B.properties || [])],
  patterns: [...(A.patterns || []), ...(B.patterns || [])],
  dyn: {
    items: Math.max((A.dyn || {}).items || 0, (B.dyn || {}).items || 0),
    properties: [...((A.dyn || {}).properties || []), ...((B.dyn || {}).properties || [])],
    patterns: [...((A.dyn || {}).patterns || []), ...((B.dyn || {}).patterns || [])],
  },
  unknown: A.unknown || B.unknown,
})

const regtest = (pattern, value) => new RegExp(pattern, 'u').test(value)

const orProperties = (a, rega, b, regb) => {
  if (a.includes(true)) return b
  if (b.includes(true)) return a
  const afiltered = a.filter((x) => b.includes(x) || regb.some((p) => regtest(p, x)))
  const bfiltered = b.filter((x) => rega.some((p) => regtest(p, x)))
  return [...afiltered, ...bfiltered]
}

const inProperties = (a, rega, b, regb) =>
  a.includes(true) ||
  (regb.every((x) => rega.includes(x)) &&
    b.every((x) => a.includes(x) || rega.some((p) => regtest(p, x))))

// Result means that at least one of sets A and B is correct
const orDelta = (A, B) => {
  const { items: aItems = 0, properties: aProp = [], patterns: aPattern = [] } = A
  const { items: bItems = 0, properties: bProp = [], patterns: bPattern = [] } = B
  const items = Math.min(aItems, bItems)
  const properties = orProperties(aProp, aPattern, bProp, bPattern)
  const patterns = aPattern.filter((x) => bPattern.includes(x))
  const aDyn = A.dyn || { items: 0, properties: [], patterns: [] }
  const bDyn = A.dyn || { items: 0, properties: [], patterns: [] }
  const dyn = {
    items: Math.max(aItems, bItems, aDyn.items || 0, bDyn.items || 0),
    properties: [...aProp, ...bProp, ...aDyn.properties, ...bDyn.properties],
    patterns: [...aPattern, ...bPattern, ...aDyn.patterns, ...bDyn.patterns],
  }
  return { items, properties, patterns, dyn, unknown: A.unknown || B.unknown }
}

const applyDelta = (stat, delta) => {
  if (delta.items) stat.items = Math.max(stat.items, delta.items)
  if (delta.properties) stat.properties.push(...delta.properties)
  if (delta.patterns) stat.patterns.push(...delta.patterns)
  if (delta.dyn) stat.dyn.items = Math.max(stat.dyn.items, delta.dyn.items)
  if (delta.dyn) stat.dyn.properties.push(...delta.dyn.properties)
  if (delta.dyn) stat.dyn.patterns.push(...delta.dyn.patterns)
  if (delta.unknown) stat.unknown = true
}

const isDynamic = ({ dyn, items = 0, properties = [], patterns = [], unknown }) => ({
  items: unknown || dyn.items > items,
  properties: unknown || !inProperties(properties, patterns, dyn.properties, dyn.patterns),
})

module.exports = { initTracing, andDelta, orDelta, applyDelta, isDynamic }
