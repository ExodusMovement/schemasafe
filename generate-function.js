const { format: utilFormat } = require('util')
const jaystring = require('jaystring')

const INDENT_START = /[{[]/
const INDENT_END = /[}\]]/

const genfun = function() {
  const lines = []
  let indent = 0

  const push = function(str) {
    lines.push(' '.repeat(indent * 2) + str)
  }

  const pushLine = function(line) {
    if (INDENT_END.test(line.trim()[0]) && INDENT_START.test(line[line.length - 1])) {
      indent--
      push(line)
      indent++
      return
    }
    if (INDENT_START.test(line[line.length - 1])) {
      push(line)
      indent++
      return
    }
    if (INDENT_END.test(line.trim()[0])) {
      indent--
      push(line)
      return
    }

    push(line)
  }

  const builder = {}

  builder.write = function(fmt, ...args) {
    if (typeof fmt !== 'string') throw new Error('Format must be a string!')
    if (args.length === 1 && fmt.indexOf('\n') > -1) {
      // multiple lines with no parameters, push them separately for correct indent
      const lines = fmt.trim().split('\n')
      for (const line of lines) {
        pushLine(line.trim())
      }
    } else {
      // format + parameters case
      pushLine(utilFormat(fmt, ...args))
    }
  }

  builder.toString = function() {
    return lines.join('\n')
  }

  builder.toModule = function(scope) {
    if (!scope) scope = {}

    const scopeSource = Object.entries(scope)
      .map(function([key, value]) {
        return `var ${key} = ${jaystring(value)};`
      })
      .join('\n')

    return `(function() {\n${scopeSource}\nreturn (${builder.toString()})})();`
  }

  builder.toFunction = function(scope) {
    if (!scope) scope = {}

    const src = `return (${builder.toString()})`

    const keys = Object.keys(scope).map(function(key) {
      return key
    })

    const vals = keys.map(function(key) {
      return scope[key]
    })

    return Function.apply(null, keys.concat(src)).apply(null, vals)
  }

  return builder
}

module.exports = genfun
