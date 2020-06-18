'use strict'

class SafeString extends String {} // used for instanceof checks

const compares = new Set(['<', '>', '<=', '>='])
const escapeCode = (code) => `\\u${code.toString(16).padStart(4, '0')}`

// Supports simple js variables only, i.e. constants and JSON-stringifiable
const jsval = (val) => {
  if ([Infinity, -Infinity, NaN, undefined].includes(val)) return `${val}`
  // https://v8.dev/features/subsume-json#security, e.g. {'\u2028':0} on Node.js 8
  return JSON.stringify(val).replace(/[\u2028\u2029]/g, (char) => escapeCode(char.charCodeAt(0)))
}

const format = (fmt, ...args) => {
  const res = fmt.replace(/%[%dscj]/g, (match) => {
    if (match === '%%') return '%'
    if (args.length === 0) throw new Error('Unexpected arguments count')
    const val = args.shift()
    switch (match) {
      case '%d':
        if (typeof val === 'number') return val
        throw new Error('Expected a number')
      case '%s':
        if (val instanceof SafeString) return val
        throw new Error('Expected a safe string')
      case '%c':
        if (compares.has(val)) return val
        throw new Error('Expected a compare op')
      case '%j':
        return jsval(val)
    }
    /* c8 ignore next */
    throw new Error(`Unreachable`)
  })
  if (args.length !== 0) throw new Error('Unexpected arguments count')
  return new SafeString(res)
}

const safe = (string) => {
  if (!/^[a-z][a-z0-9]*$/.test(string)) throw new Error('Does not look like a safe id')
  return new SafeString(string)
}

// too dangereous to export, use with care
const safewrap = (fun) => (...args) => {
  if (!args.every((arg) => arg instanceof SafeString)) throw new Error('Unsafe arguments')
  return new SafeString(fun(...args))
}

const safeor = safewrap((...args) => args.join(' || ') || 'false')
const safeand = safewrap((...args) => args.join(' && ') || 'true')

module.exports = { format, safe, safeor, safeand, jsval }
