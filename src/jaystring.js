const isArrowFnWithParensRegex = /^\([^)]*\) *=>/
const isArrowFnWithoutParensRegex = /^[^=]*=>/

const stringify = {
  string: (s) => JSON.stringify(s),
  number: (n) => String(n),
  boolean: (b) => String(b),
  undefined: () => 'undefined',
  array: (array) => `[${array.map(jaystring).join(',')}]`,
  date: (date) => `new Date(${date.getTime()})`,

  function: (func) => {
    if (Object.getPrototypeOf(func) !== Function.prototype)
      throw new Error('Can not stringify a function with unexpected prototype')

    const stringified = func.toString()
    if (func.prototype) return stringified // normal function
    if (isArrowFnWithParensRegex.test(stringified) || isArrowFnWithoutParensRegex.test(stringified))
      return stringified // Arrow function

    // Shortened ES6 object method declaration
    return `function ${stringified}`
  },

  object: (obj) => {
    if (obj === null) return 'null'
    const proto = Object.getPrototypeOf(obj)

    if (Array.isArray(obj) && proto === Array.prototype) return stringify.array(obj)
    if (obj instanceof Date && proto === Date.prototype) return stringify.date(obj)
    if (obj instanceof RegExp && proto === RegExp.prototype) return String(obj)

    if (proto === Object.prototype || proto === null) {
      const parts = Object.entries(obj)
      return `{${parts.map(([key, val]) => `${JSON.stringify(key)}:${jaystring(val)}`).join(',')}}`
    }

    throw new Error('Can not stringify an object with unexpected prototype')
  },

  symbol: (symbol) => `Symbol(${JSON.stringify(symbol.description)})`,
}

function jaystring(item) {
  const type = typeof item
  const toString = stringify.hasOwnProperty(type) ? stringify[type] : null
  if (!toString) throw new Error(`Cannot stringify ${item} - unknown type ${typeof item}`)
  return toString(item)
}

module.exports = jaystring
