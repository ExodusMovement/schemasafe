const { format: utilFormat } = require('util')
const jaystring = require('jaystring')

const INDENT_START = /[{[]/
const INDENT_END = /[}\]]/

module.exports = function() {
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

  return {
    write(fmt, ...args) {
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
    },

    makeRawSource() {
      return lines.join('\n')
    },

    makeModule(scope = {}) {
      const scopeSource = Object.entries(scope)
        .map(([key, value]) => `const ${key} = ${jaystring(value)};`)
        .join('\n')
      return `(function() {\n${scopeSource}\nreturn (${this.makeRawSource()})})();`
    },

    makeFunction(scope = {}) {
      const src = `return (${this.makeRawSource()})`
      const keys = Object.keys(scope)
      const vals = keys.map((key) => scope[key])
      // eslint-disable-next-line no-new-func
      return Function(...keys, src)(...vals)
    },
  }
}
