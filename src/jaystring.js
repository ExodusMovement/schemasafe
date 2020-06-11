const isArrowFnWithParensRegex = /^\([^)]*\) *=>/
const isArrowFnWithoutParensRegex = /^[^=]*=>/

// Supports only functions and regexps, for scope

function jaystring(item) {
  if (typeof item === 'function') {
    if (Object.getPrototypeOf(item) !== Function.prototype)
      throw new Error('Can not stringify a function with unexpected prototype')

    const stringified = `${item}`
    if (item.prototype) {
      if (!/^function[ (]/.test(stringified)) throw new Error('Unexpected function')
      return stringified // normal function
    }
    if (isArrowFnWithParensRegex.test(stringified) || isArrowFnWithoutParensRegex.test(stringified))
      return stringified // Arrow function

    // Shortened ES6 object method declaration
    throw new Error('Can stringify only either normal or arrow functions')
  } else if (typeof item === 'object') {
    const proto = Object.getPrototypeOf(item)
    if (item instanceof RegExp && proto === RegExp.prototype) return String(item)
    throw new Error('Can not stringify an object with unexpected prototype')
  }
  throw new Error(`Cannot stringify ${item} - unknown type ${typeof item}`)
}

module.exports = jaystring
