const path = require('path')
const orig = require('.')

// This is a bit evil, but used only in tests to avoid code duplication
// and polluting the main index.js file

const id = path.join(__dirname, 'src/index.js')
const indexModule = require.cache[id] // extract index.js module to override it

// Sanity check
if (orig !== indexModule.exports) throw new Error('Unexpected!')

const { validator: validatorOrig, parser: parserOrig } = orig

const wrap = (orig) =>
  function(...args) {
    const validate = orig(...args)
    if (!validate) return validate
    // eslint-disable-next-line no-new-func
    const wrapped = new Function(`return ${validate.toModule()}`)()
    wrapped.toModule = (...args) => validate.toModule(...args)
    wrapped.toJSON = (...args) => validate.toJSON(...args)
    return wrapped
  }

const validator = wrap(validatorOrig)
const parser = wrap(parserOrig)

indexModule.exports = validator
Object.assign(indexModule.exports, { validator, parser })
