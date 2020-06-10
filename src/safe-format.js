'use strict'

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
        if (typeof val === 'string') return val
        throw new Error('Expected a string')
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
  return res
}

module.exports = { format }
