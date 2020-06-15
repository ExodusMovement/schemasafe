'use strict'

const { format } = require('./safe-format')
const jaystring = require('./jaystring')

const INDENT_START = /[{[]/
const INDENT_END = /[}\]]/

module.exports = () => {
  const lines = []
  let indent = 0

  const push = (str) => {
    lines.push(' '.repeat(indent * 2) + str)
  }

  const pushLine = (line) => {
    if (INDENT_END.test(line.trim()[0])) indent--
    push(line)
    if (INDENT_START.test(line[line.length - 1])) indent++
  }

  const build = () => `return (${lines.join('\n')})`

  const processScope = (scope) => {
    const entries = Object.entries(scope)
    for (const [key, value] of entries) {
      if (!/^[a-z][a-z0-9]*$/i.test(key)) throw new Error('Unexpected scope key!')
      if (!(typeof value === 'function' || value instanceof RegExp))
        throw new Error('Unexpected scope value!')
    }
    return entries
  }

  return {
    write(fmt, ...args) {
      if (typeof fmt !== 'string') throw new Error('Format must be a string!')
      if (fmt.includes('\n')) throw new Error('Only single lines are supported')
      pushLine(args.length > 0 ? format(fmt, ...args) : fmt)
    },

    size() {
      return lines.length
    },

    block(fmt, args, close, writeBody) {
      const oldIndent = indent
      this.write(fmt, ...args)
      const length = lines.length
      writeBody()
      if (length === lines.length) {
        // no lines inside block, unwind the block
        lines.pop()
        indent = oldIndent
        return
      }
      this.write(close)
    },

    makeModule(scope = {}) {
      const scopeDefs = processScope(scope).map(([key, val]) => `const ${key} = ${jaystring(val)};`)
      return `(function() {\n'use strict'\n${scopeDefs.join('\n')}\n${build()}})();`
    },

    makeFunction(scope = {}) {
      const src = build()
      const scopeEntries = processScope(scope)
      const keys = scopeEntries.map((entry) => entry[0])
      const vals = scopeEntries.map((entry) => entry[1])
      // eslint-disable-next-line no-new-func
      return Function(...keys, `'use strict'\n${src}`)(...vals)
    },
  }
}
