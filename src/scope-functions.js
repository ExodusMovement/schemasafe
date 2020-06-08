'use strict'

// for correct Unicode code points processing
// https://mathiasbynens.be/notes/javascript-unicode#accounting-for-astral-symbols
const stringLength = (string) => [...string].length

const isMultipleOf = (value, multipleOf) => {
  if (typeof multipleOf !== 'number' || !Number.isFinite(value))
    throw new Error('multipleOf is not a number')
  if (typeof value !== 'number' || !Number.isFinite(value)) return false
  if (value === 0) return true
  if (multipleOf === 0) return false
  const digitsAfterDot = (number) => {
    if ((number | 0) === number) return 0
    return String(number)
      .split('.')
      .pop().length
  }
  const digits = digitsAfterDot(multipleOf)
  if (digits === 0) return value % multipleOf === 0
  const valueDigits = digitsAfterDot(value)
  if (valueDigits > digits) return false
  const factor = Math.pow(10, digits)
  return Math.round(factor * value) % Math.round(factor * multipleOf) === 0
}

// supports only JSON-stringifyable objects, defaults to false for unsupported
// also uses ===, not Object.is, i.e. 0 === -0, NaN !== NaN
// symbols and non-enumerable properties are ignored!
const deepEqual = (obj, obj2) => {
  if (obj === obj2) return true
  if (!obj || !obj2 || typeof obj !== typeof obj2) return false

  const proto = Object.getPrototypeOf(obj)
  if (proto !== Object.getPrototypeOf(obj2)) return false

  if (proto === Array.prototype) {
    if (!Array.isArray(obj) || !Array.isArray(obj2)) return false
    if (obj.length !== obj2.length) return false
    return obj.every((x, i) => deepEqual(x, obj2[i]))
  } else if (proto === Object.prototype) {
    const [keys, keys2] = [Object.keys(obj), Object.keys(obj2)]
    if (keys.length !== keys2.length) return false
    const keyset2 = new Set(keys2)
    return keys.every((key) => keyset2.has(key) && deepEqual(obj[key], obj2[key]))
  }
  return false
}

const unique = (array) => {
  const objects = []
  const primitives = new Set()
  let primitivesCount = 0
  for (const item of array) {
    if (typeof item === 'object') {
      objects.push(item)
    } else {
      primitives.add(item)
      if (primitives.size !== ++primitivesCount) return false
    }
  }
  for (let i = 1; i < objects.length; i++)
    for (let j = 0; j < i; j++) if (deepEqual(objects[i], objects[j])) return false
  return true
}

module.exports = { stringLength, isMultipleOf, deepEqual, unique }
