const path = require('path')
const validator = require('.')

// This is a bit evil, but used only in tests to avoid code duplication
// and polluting the main index.js file

const id = path.join(__dirname, 'index.js')
const indexModule = require.cache[id] // extract index.js module to override it

// Sanity check
if (validator !== indexModule.exports) throw new Error('Unexpected!')

indexModule.exports = function(...args) {
  const validate = validator(...args)
  if (!validate) return validate
  // eslint-disable-next-line no-new-func
  const wrapped = new Function(`return ${validate.toModule()}`)()
  wrapped.toModule = (...args) => validate.toModule(...args)
  wrapped.toJSON = (...args) => validate.toJSON(...args)
  return wrapped
}

indexModule.exports.filter = validator.filter // does not have module API
