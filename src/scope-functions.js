'use strict'

// for correct Unicode code points processing
// https://mathiasbynens.be/notes/javascript-unicode#accounting-for-astral-symbols
const stringLength = (string) =>
  /[\uD800-\uDFFF]/.test(string) ? [...string].length : string.length

// A isMultipleOf B: shortest decimal denoted as A % shortest decimal denoted as B === 0
// Optimized, sanity checks and precomputation are outside of this method
const isMultipleOf = (value, divisor, factor, factorMultiple) => {
  if (value % divisor === 0) return true
  const multiple = value * factor
  if (multiple % factorMultiple === 0) return true
  const normal = Math.floor(multiple + 0.5)
  return normal / factor === value && normal % factorMultiple === 0
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

// Fast in Node.js, awful in browsers, no reason to optimize now. Work-around: polyfill Buffer
const deBase64 = (string) => {
  if (typeof Buffer !== 'undefined') return Buffer.from(string, 'base64').toString('utf-8')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  const map = Array(128)
  chars.split('').forEach((c, i) => (map[c.charCodeAt(0)] = i.toString(4).padStart(3, 0)))
  let tmp = ''
  const bytes = new Uint8Array(Math.floor((string.length * 3) / 4))
  let filled = 0
  for (let i = 0; i < string.length; i++) {
    tmp += map[string.charCodeAt(i)] || ''
    if (tmp.length >= 4) {
      bytes[filled++] = parseInt(tmp.slice(0, 4), 4)
      tmp = tmp.slice(4)
    }
  }
  const view = new Uint8Array(bytes.buffer, bytes.byteOffset, Math.min(filled, bytes.length))
  return new TextDecoder('utf-8').decode(view)
}

const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty)
// special handling for stringification
hasOwn[Symbol.for('toJayString')] = 'Function.prototype.call.bind(Object.prototype.hasOwnProperty)'

// Used for error generation. Affects error performance, optimized
const pointerPart = (s) => (/~\//.test(s) ? `${s}`.replace(/~/g, '~0').replace(/\//g, '~1') : s)
const toPointer = (path) => (path.length === 0 ? '#' : `#/${path.map(pointerPart).join('/')}`)

const errorMerge = ({ keywordLocation, instanceLocation, ...more }, schemaBase, dataBase) => ({
  keywordLocation: `${schemaBase}${keywordLocation.slice(1)}`,
  instanceLocation: `${dataBase}${instanceLocation.slice(1)}`,
  ...more,
})

const errorUtils = { toPointer, pointerPart, errorMerge }
module.exports = { stringLength, isMultipleOf, deepEqual, unique, deBase64, hasOwn, ...errorUtils }
