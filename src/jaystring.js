'use strict'

const { jsval } = require('./safe-format')

const isArrowFnWithParensRegex = /^\([^)]*\) *=>/
const isArrowFnWithoutParensRegex = /^[^=]*=>/

// Supports only functions and regexps, for scope

const toJayString = Symbol.for('toJayString')

function jaystring(item) {
  if (typeof item === 'function') {
    if (item[toJayString]) return item[toJayString] // this is supported only for functions

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
    if (item instanceof RegExp && proto === RegExp.prototype) {
      // String(regex) is not ok on Node.js 10 and below: console.log(String(new RegExp('\n')))
      return `new RegExp(${jsval(item.source)}, ${jsval(item.flags)})`
    }
    throw new Error('Can not stringify an object with unexpected prototype')
  }
  throw new Error(`Cannot stringify ${item} - unknown type ${typeof item}`)
}

module.exports = jaystring
