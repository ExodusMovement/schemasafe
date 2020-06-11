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
      const scopeSource = Object.entries(scope)
        .map(([key, value]) => `const ${key} = ${jaystring(value)};`)
        .join('\n')
      return `(function() {\n${scopeSource}\n${build()}})();`
    },

    makeFunction(scope = {}) {
      const src = build()
      const keys = Object.keys(scope)
      const vals = keys.map((key) => scope[key])
      // eslint-disable-next-line no-new-func
      return Function(...keys, src)(...vals)
    },
  }
}
