'use strict'

const path = require('path')
const origExports = require('../..')

// This is a bit evil, but used only in tests to avoid code duplication
// and polluting the main index.js file

const id = path.join(__dirname, '../../src/index.js')
const indexModule = require.cache[id] // extract index.js module to override it

// Sanity check
if (origExports !== indexModule.exports) throw new Error('Unexpected!')

const { validator: validatorOrig, parser: parserOrig } = origExports

const wrap = (method) =>
  function(...args) {
    const validate = method(...args)
    if (!validate) return validate
    // eslint-disable-next-line no-new-func
    const wrapped = new Function(`return ${validate.toModule()}`)()
    wrapped.toModule = (...argsTo) => validate.toModule(...argsTo)
    wrapped.toJSON = (...argsTo) => validate.toJSON(...argsTo)
    return wrapped
  }

const validator = wrap(validatorOrig)
const parser = wrap(parserOrig)

indexModule.exports = { validator, parser }
