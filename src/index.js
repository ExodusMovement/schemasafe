'use strict'

const genfun = require('./generate-function')
const { buildSchemas } = require('./pointer')
const { compile } = require('./compile')
const functions = require('./scope-functions')

const validator = (schema, { jsonCheck = false, isJSON = false, schemas, ...opts } = {}) => {
  if (jsonCheck && isJSON) throw new Error('Can not specify both isJSON and jsonCheck options')
  const options = { ...opts, schemas: buildSchemas(schemas || []), isJSON: isJSON || jsonCheck }
  const scope = Object.create(null)
  const actualValidate = compile(schema, schema, options, scope)
  if (!jsonCheck || opts.dryRun) return actualValidate

  // jsonCheck wrapper implementation below
  scope.deepEqual = functions.deepEqual
  scope.actualValidate = actualValidate
  const fun = genfun()
  fun.write('function validate(data) {')
  if (opts.includeErrors) {
    fun.write('if (!deepEqual(data, JSON.parse(JSON.stringify(data)))) {')
    fun.write('validate.errors = [{schemaPath:"#",dataPath:"#",message:"not JSON compatible"}]')
    fun.write('return false')
    fun.write('}')
    fun.write('const res = actualValidate(data)')
    fun.write('validate.errors = actualValidate.errors')
    fun.write('return res')
  } else {
    fun.write('return deepEqual(data, JSON.parse(JSON.stringify(data))) && actualValidate(data)')
  }
  fun.write('}')

  const validate = fun.makeFunction(scope)
  validate.toModule = () => fun.makeModule(scope)
  validate.toJSON = () => schema
  return validate
}

const parser = function(schema, opts = {}) {
  // strong mode is default in parser
  if (functions.hasOwn(opts, 'jsonCheck') || functions.hasOwn(opts, 'isJSON'))
    throw new Error('jsonCheck and isJSON options are not applicable in parser mode')
  const validate = validator(schema, { mode: 'strong', ...opts, jsonCheck: false, isJSON: true })
  const parse = (src) => {
    if (typeof src !== 'string') throw new Error('Invalid type!')
    const data = JSON.parse(src)
    if (validate(data)) return data
    const reason = validate.errors ? validate.errors[0] : null
    const keyword = reason && reason.schemaPath ? reason.schemaPath.replace(/.*\//, '') : '??'
    const explanation = reason ? ` for ${keyword} at ${reason.dataPath}` : ''
    const error = new Error(`JSON validation failed${explanation}`)
    if (validate.errors) error.errors = validate.errors
    throw error
  }
  parse.toModule = () =>
    [
      '(function(src) {',
      `const validate = ${validate.toModule()}`,
      `const parse = ${parse}\n`,
      'return parse(src)',
      '});',
    ].join('\n')
  return parse
}

module.exports = { validator, parser }
