'use strict'

/* This file implements operations for static tracing of evaluated items/properties, which is also
 * used to determine whether dynamic evaluated tracing is required or the schema can be compiled
 * with only statical checks.
 */

const initTracing = () => ({ properties: [], patterns: [], items: 0, dynamic: false })

const andDelta = (A, B) => ({
  items: Math.max(A.items || 0, B.items || 0),
  properties: [...(A.properties || []), ...(B.properties || [])],
  patterns: [...(A.patterns || []), ...(B.patterns || [])],
  dynamic: A.dynamic || B.dynamic,
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

const orDelta = (A, B) => {
  const { items: aItems = 0, properties: aProp = [], patterns: aPattern = [] } = A
  const { items: bItems = 0, properties: bProp = [], patterns: bPattern = [] } = B
  const items = Math.min(aItems, bItems)
  const properties = orProperties(aProp, aPattern, bProp, bPattern)
  const patterns = aPattern.filter((x) => bPattern.includes(x))
  const propertiesMismatch =
    !inProperties(properties, patterns, aProp, aPattern) ||
    !inProperties(properties, patterns, bProp, bPattern)
  const dynamic = A.dynamic || B.dynamic || aItems !== bItems || propertiesMismatch
  return { items, properties, patterns, dynamic }
}

const applyDelta = (stat, delta) => {
  if (delta.items) stat.items = Math.max(stat.items, delta.items)
  if (delta.properties) stat.properties.push(...delta.properties)
  if (delta.patterns) stat.patterns.push(...delta.patterns)
  if (delta.dynamic) stat.dynamic = true
}

module.exports = { initTracing, andDelta, orDelta, applyDelta }
