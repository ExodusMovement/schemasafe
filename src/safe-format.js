'use strict'

class SafeString extends String {} // used for instanceof checks

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
        if (['<', '>', '<=', '>='].includes(val)) return val
        throw new Error('Expected a compare op')
      case '%j':
        if ([Infinity, -Infinity, NaN, undefined].includes(val)) return `${val}`
        return JSON.stringify(val)
    }
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

module.exports = { format, safe, safeor, safeand }
