const jaystring = require('./jaystring')
const genfun = require('./generate-function')
const { toPointer, resolveReference, joinPath } = require('./pointer')
const formats = require('./formats')
const KNOWN_KEYWORDS = require('./known-keywords')

// name is assumed to be already processed and can contain complex paths
const genobj = (name, property) => {
  if (!['string', 'number'].includes(typeof property)) throw new Error('Invalid property path')
  return `${name}[${JSON.stringify(property)}]`
}

const types = {}
types.any = () => 'true'
types.null = (name) => `${name} === null`
types.boolean = (name) => `typeof ${name} === "boolean"`
types.array = (name) => `Array.isArray(${name})`
types.object = (name) => `typeof ${name} === "object" && ${name} && !Array.isArray(${name})`
types.number = (name) => `typeof ${name} === "number"`
types.integer = (name) => `Number.isInteger(${name})`
types.string = (name) => `typeof ${name} === "string"`

const unique = (array) => {
  const objects = []
  const primitives = new Set()
  let primitivesCount = 0
  for (const item of array) {
    if (typeof item === 'object') {
      objects.push(item)
    } else {
      primitives.add(item)
      if (primitives.size !== ++primitivesCount) return false
    }
  }
  for (let i = 1; i < objects.length; i++)
    for (let j = 0; j < i; j++) if (deepEqual(objects[i], objects[j])) return false
  return true
}

const isMultipleOf = (value, multipleOf) => {
  if (typeof multipleOf !== 'number' || !Number.isFinite(value))
    throw new Error('multipleOf is not a number')
  if (typeof value !== 'number' || !Number.isFinite(value)) return false
  if (value === 0) return true
  if (multipleOf === 0) return false
  const digitsAfterDot = (number) => {
    if ((number | 0) === number) return 0
    return String(number)
      .split('.')
      .pop().length
  }
  const digits = digitsAfterDot(multipleOf)
  if (digits === 0) return value % multipleOf === 0
  const valueDigits = digitsAfterDot(value)
  if (valueDigits > digits) return false
  const factor = Math.pow(10, digits)
  return Math.round(factor * value) % Math.round(factor * multipleOf) === 0
}

// supports only JSON-stringifyable objects, defaults to false for unsupported
// also uses ===, not Object.is, i.e. 0 === -0, NaN !== NaN
// symbols and non-enumerable properties are ignored!
const deepEqual = (obj, obj2) => {
  if (obj === obj2) return true
  if (!obj || !obj2 || typeof obj !== typeof obj2) return false

  const proto = Object.getPrototypeOf(obj)
  if (proto !== Object.getPrototypeOf(obj2)) return false

  if (proto === Array.prototype) {
    if (!Array.isArray(obj) || !Array.isArray(obj2)) return false
    if (obj.length !== obj2.length) return false
    return obj.every((x, i) => deepEqual(x, obj2[i]))
  } else if (proto === Object.prototype) {
    const [keys, keys2] = [Object.keys(obj), Object.keys(obj2)]
    if (keys.length !== keys2.length) return false
    const keyset2 = new Set(keys2)
    return keys.every((key) => keyset2.has(key) && deepEqual(obj[key], obj2[key]))
  }
  return false
}

// for correct Unicode code points processing
// https://mathiasbynens.be/notes/javascript-unicode#accounting-for-astral-symbols
const stringLength = (string) => [...string].length

const scopeSyms = Symbol('syms')
const scopeRefCache = Symbol('refcache')
const scopeFormatCache = Symbol('formatcache')

// Order is important, newer at the top!
const schemaVersions = [
  'https://json-schema.org/draft/2019-09/schema',
  'https://json-schema.org/draft-07/schema',
  'https://json-schema.org/draft-06/schema',
  'https://json-schema.org/draft-04/schema',
  'https://json-schema.org/draft-03/schema',
]

const rootMeta = new WeakMap()
const compile = (schema, root, opts, scope, basePathRoot) => {
  const {
    mode = 'default',
    applyDefault = false,
    includeErrors: optIncludeErrors = false,
    allErrors: optAllErrors = false,
    verboseErrors = false,
    dryRun = false,
    allowUnusedKeywords = opts.mode === 'lax',
    requireValidation = opts.mode === 'strong',
    $schemaDefault = null,
    formats: optFormats = {},
    schemas = {},
    ...unknown
  } = opts
  const fmts = Object.assign({}, formats, optFormats)
  if (Object.keys(unknown).length !== 0)
    throw new Error(`Unknown options: ${Object.keys(unknown).join(', ')}`)

  if (!['strong', 'lax', 'default'].includes(mode)) throw new Error(`Invalid mode: ${mode}`)
  if (mode === 'strong' && (!requireValidation || allowUnusedKeywords))
    throw new Error('Strong mode demands requireValidation and no allowUnusedKeywords')

  if (!scope) scope = Object.create(null)
  if (!scope[scopeRefCache]) scope[scopeRefCache] = new Map()
  const refCache = scope[scopeRefCache]
  if (!scope[scopeFormatCache]) scope[scopeFormatCache] = new Map()
  const formatCache = scope[scopeFormatCache]
  if (!scope[scopeSyms]) scope[scopeSyms] = new Map()
  const syms = scope[scopeSyms]
  const gensym = (name) => {
    if (!syms.get(name)) syms.set(name, 0)
    const index = syms.get(name)
    syms.set(name, index + 1)
    return name + index
  }

  const reversePatterns = {}
  const patterns = (p) => {
    if (reversePatterns[p]) return reversePatterns[p]
    const n = gensym('pattern')
    scope[n] = new RegExp(p, 'u')
    reversePatterns[p] = n
    return n
  }

  const vars = 'ijklmnopqrstuvxyz'.split('')
  const genloop = () => {
    const v = vars.shift()
    vars.push(v + v[0])
    return v
  }

  const fun = genfun()
  fun.write('function validate(data) {')
  // Since undefined is not a valid JSON value, we coerce to null and other checks will catch this
  fun.write('if (data === undefined) data = null')
  if (optIncludeErrors) fun.write('validate.errors = null')
  fun.write('let errors = 0')

  const getMeta = () => rootMeta.get(root) || {}
  const basePathStack = basePathRoot ? [basePathRoot] : []
  const visit = (allErrors, includeErrors, name, node, schemaPath) => {
    const rule = (...args) => visit(allErrors, includeErrors, ...args)
    const subrule = (...args) => visit(true, false, ...args)
    const writeErrorObject = (format, ...params) => {
      if (allErrors) {
        fun.write('if (validate.errors === null) validate.errors = []')
        fun.write(`validate.errors.push(${format})`, ...params)
      } else {
        // Array assignment is significantly faster, do not refactor the two branches
        fun.write(`validate.errors = [${format}]`, ...params)
        fun.write('return false')
      }
    }
    const error = (msg, prop, value) => {
      if (includeErrors === true) {
        const errorObject = { field: prop || name, message: msg }
        if (verboseErrors) {
          const type = node.type || 'any'
          Object.assign(errorObject, { type, schemaPath: toPointer(schemaPath) })
          writeErrorObject('{ ...%s, value: %s }', JSON.stringify(errorObject), value || name)
        } else {
          writeErrorObject('%s', JSON.stringify(errorObject))
        }
      }
      if (allErrors) {
        fun.write('errors++')
      } else {
        fun.write('return false')
      }
    }

    const fail = (msg, value) => {
      const comment = value !== undefined ? ` ${JSON.stringify(value)}` : ''
      throw new Error(`${msg}${comment} at ${toPointer(schemaPath)}`)
    }
    const enforce = (ok, ...args) => ok || fail(...args)
    const enforceValidation = (msg) => enforce(!requireValidation, `[requireValidation] ${msg}`)
    const subPath = (...args) => [...schemaPath, ...args]

    if (typeof node === 'boolean') {
      if (node === true) {
        // any is valid
        enforceValidation('schema = true is not allowed')
      } else {
        // node === false
        fun.write('if (%s !== undefined) {', name)
        error('is unexpected')
        fun.write('}')
      }
      return
    }

    enforce(Object.getPrototypeOf(node) === Object.prototype, 'Schema is not an object')
    for (const key of Object.keys(node))
      enforce(KNOWN_KEYWORDS.includes(key) || allowUnusedKeywords, 'Keyword not supported:', key)

    const unused = new Set(Object.keys(node))
    const consume = (property) => {
      enforce(unused.has(property), 'Unexpected double consumption:', property)
      unused.delete(property)
    }

    const isTopLevel = name === 'data'
    const finish = () => {
      if (!isTopLevel) fun.write('}') // undefined check
      enforce(unused.size === 0 || allowUnusedKeywords, 'Unprocessed keywords:', [...unused])
    }

    if (node === root) {
      const $schema = node.$schema || $schemaDefault
      if (node.$schema) {
        if (typeof node.$schema !== 'string') throw new Error('Unexpected $schema')
        consume('$schema')
      }
      if ($schema) {
        const version = $schema.replace(/^http:\/\//, 'https://').replace(/#$/, '')
        enforce(schemaVersions.includes(version), 'Unexpected schema version:', version)
        const schemaIsOlderThan = (ver) =>
          schemaVersions.indexOf(version) >
          schemaVersions.indexOf(`https://json-schema.org/${ver}/schema`)
        rootMeta.set(root, {
          exclusiveRefs: schemaIsOlderThan('draft/2019-09'),
          booleanRequired: schemaIsOlderThan('draft-04'),
        })
      }
    }

    if (typeof node.description === 'string') consume('description') // unused, meta-only
    if (typeof node.title === 'string') consume('title') // unused, meta-only
    if (typeof node.$comment === 'string') consume('$comment') // unused, meta-only
    if (Array.isArray(node.examples)) consume('examples') // unused, meta-only

    // defining defs are allowed, those are validated on usage
    if (typeof node.$defs === 'object') {
      consume('$defs')
    } else if (typeof node.definitions === 'object') {
      consume('definitions')
    }

    const basePath = () => (basePathStack.length > 0 ? basePathStack[basePathStack.length - 1] : '')
    if (typeof node.$id === 'string') {
      basePathStack.push(joinPath(basePath(), node.$id))
      consume('$id')
    } else if (typeof node.id === 'string') {
      basePathStack.push(joinPath(basePath(), node.id))
      consume('id')
    }

    const booleanRequired = getMeta().booleanRequired && typeof node.required === 'boolean'
    if (isTopLevel) {
      // top-level data is coerced to null above, it can't be undefined
      if (node.default !== undefined) {
        enforce(!applyDefault, 'Can not apply default value at root')
        consume('default')
      }
      if (node.required === true || node.required === false)
        fail('Can not apply boolean required at root')
    } else if (node.default !== undefined || booleanRequired) {
      fun.write('if (%s === undefined) {', name)
      let defaultApplied = false
      if (node.default !== undefined) {
        if (applyDefault) {
          fun.write('%s = %s', name, jaystring(node.default))
          defaultApplied = true
        }
        consume('default')
      }
      if (booleanRequired) {
        if (node.required === true) {
          if (!defaultApplied) error('is required')
          consume('required')
        } else if (node.required === false) {
          consume('required')
        }
      }
      fun.write('} else {')
    } else {
      fun.write('if (%s !== undefined) {', name)
    }

    if (node.$ref) {
      const resolved = resolveReference(root, schemas || {}, joinPath(basePath(), node.$ref))
      const [sub, subRoot, path] = resolved[0] || []
      if (sub || sub === false) {
        let n = refCache.get(sub)
        if (!n) {
          n = gensym('ref')
          refCache.set(sub, n)
          let fn = null // resolve cyclic dependencies
          scope[n] = (...args) => fn(...args)
          fn = compile(sub, subRoot, { ...opts, includeErrors: false }, scope, path)
          scope[n] = fn
        }
        fun.write('if (!(%s(%s))) {', n, name)
        error('referenced schema does not match')
        fun.write('}')
      } else {
        fail('failed to resolve $ref:', node.$ref)
      }
      consume('$ref')

      if (getMeta().exclusiveRefs) {
        // ref overrides any sibling keywords for older schemas
        finish()
        return
      }
    }

    const { type } = node
    if (!type) enforceValidation('type is required')
    if (type !== undefined && typeof type !== 'string' && !Array.isArray(type))
      fail('Unexpected type')

    const typeArray = type ? (Array.isArray(type) ? type : [type]) : []
    for (const t of typeArray) {
      enforce(typeof t === 'string' && types.hasOwnProperty(t), 'Unknown type:', t)
      if (t === 'any') enforceValidation('type = any is not allowed')
    }

    const typeValidate = typeArray.map((t) => types[t](name)).join(' || ') || 'true'
    if (typeValidate !== 'true') {
      fun.write('if (!(%s)) {', typeValidate)
      error('is the wrong type')
      fun.write('} else {')
    }
    if (type) consume('type')

    /* All checks below are expected to be independent, they are happening on the same code depth */

    const typeApplicable = (...types) =>
      !type || typeArray.includes('any') || typeArray.some((x) => types.includes(x))
    const validateTypeApplicable = (...types) =>
      enforce(typeApplicable(...types), 'Unexpected field in type', type)

    const makeCompare = (name, complex) => {
      if (complex) {
        scope.deepEqual = deepEqual
        return (e) => `deepEqual(${name}, ${JSON.stringify(e)})`
      }
      return (e) => `(${name} === ${JSON.stringify(e)})`
    }

    // Numbers

    const applyMinMax = (value, operator, message) => {
      enforce(Number.isFinite(value), 'Invalid minimum or maximum:', value)
      validateTypeApplicable('number', 'integer')
      if (type !== 'number' && type !== 'integer') fun.write('if (%s) {', types.number(name))

      fun.write('if (!(%d %s %s)) {', value, operator, name)
      error(message)
      fun.write('}')

      if (type !== 'number' && type !== 'integer') fun.write('}')
    }

    if (Number.isFinite(node.exclusiveMinimum)) {
      applyMinMax(node.exclusiveMinimum, '<', 'is less than exclusiveMinimum')
      consume('exclusiveMinimum')
    } else if (node.minimum !== undefined) {
      applyMinMax(node.minimum, node.exclusiveMinimum ? '<' : '<=', 'is less than minimum')
      consume('minimum')
      if (typeof node.exclusiveMinimum === 'boolean') consume('exclusiveMinimum')
    }

    if (Number.isFinite(node.exclusiveMaximum)) {
      applyMinMax(node.exclusiveMaximum, '>', 'is more than exclusiveMaximum')
      consume('exclusiveMaximum')
    } else if (node.maximum !== undefined) {
      applyMinMax(node.maximum, node.exclusiveMaximum ? '>' : '>=', 'is more than maximum')
      consume('maximum')
      if (typeof node.exclusiveMaximum === 'boolean') consume('exclusiveMaximum')
    }

    const multipleOf = node.multipleOf === undefined ? 'divisibleBy' : 'multipleOf' // draft3 support
    if (node[multipleOf] !== undefined) {
      enforce(Number.isFinite(node[multipleOf]), `Invalid ${multipleOf}:`, node[multipleOf])
      validateTypeApplicable('number', 'integer')
      if (type !== 'number' && type !== 'integer') fun.write('if (%s) {', types.number(name))

      scope.isMultipleOf = isMultipleOf
      fun.write('if (!isMultipleOf(%s, %d)) {', name, node[multipleOf])

      error('has a remainder')
      fun.write('}')

      if (type !== 'number' && type !== 'integer') fun.write('}')
      consume(multipleOf)
    }

    // Strings

    if (node.maxLength !== undefined) {
      enforce(Number.isFinite(node.maxLength), 'Invalid maxLength:', node.maxLength)
      validateTypeApplicable('string')
      if (type !== 'string') fun.write('if (%s) {', types.string(name))

      scope.stringLength = stringLength
      fun.write('if (stringLength(%s) > %d) {', name, node.maxLength)
      error('has longer length than allowed')
      fun.write('}')

      if (type !== 'string') fun.write('}')
      consume('maxLength')
    }

    if (node.minLength !== undefined) {
      enforce(Number.isFinite(node.minLength), 'Invalid minLength:', node.minLength)
      validateTypeApplicable('string')
      if (type !== 'string') fun.write('if (%s) {', types.string(name))

      scope.stringLength = stringLength
      fun.write('if (stringLength(%s) < %d) {', name, node.minLength)
      error('has less length than allowed')
      fun.write('}')

      if (type !== 'string') fun.write('}')
      consume('minLength')
    }

    if (node.format && fmts.hasOwnProperty(node.format)) {
      validateTypeApplicable('string')
      if (type !== 'string') fun.write('if (%s) {', types.string(name))
      const format = fmts[node.format]
      if (format instanceof RegExp || typeof format === 'function') {
        let n = formatCache.get(format)
        if (!n) {
          n = gensym('format')
          scope[n] = format
          formatCache.set(format, n)
        }
        const condition = format instanceof RegExp ? '!%s.test(%s)' : '!%s(%s)'
        fun.write(`if (${condition}) {`, n, name)
        error(`must be ${node.format} format`)
        fun.write('}')
      } else {
        fail('Unrecognized format used:', node.format)
      }
      if (type !== 'string') fun.write('}')
      consume('format')
    } else {
      enforce(!node.format, 'Unrecognized format used:', node.format)
    }

    if (node.pattern) {
      const p = patterns(node.pattern)
      validateTypeApplicable('string')
      if (type !== 'string') fun.write('if (%s) {', types.string(name))
      fun.write('if (!(%s.test(%s))) {', p, name)
      error('pattern mismatch')
      fun.write('}')
      if (type !== 'string') fun.write('}')
      consume('pattern')
    }

    // Arrays

    if (node.maxItems !== undefined) {
      enforce(Number.isFinite(node.maxItems), 'Invalid maxItems:', node.maxItems)
      if (Array.isArray(node.items) && node.items.length > node.maxItems)
        fail(`Invalid maxItems: ${node.maxItems} is less than items array length`)
      validateTypeApplicable('array')
      if (type !== 'array') fun.write('if (%s) {', types.array(name))

      fun.write('if (%s.length > %d) {', name, node.maxItems)
      error('has more items than allowed')
      fun.write('}')

      if (type !== 'array') fun.write('}')
      consume('maxItems')
    }

    if (node.minItems !== undefined) {
      enforce(Number.isFinite(node.minItems), 'Invalid minItems:', node.minItems)
      // can be higher that .items length with additionalItems
      validateTypeApplicable('array')
      if (type !== 'array') fun.write('if (%s) {', types.array(name))

      fun.write('if (%s.length < %d) {', name, node.minItems)
      error('has less items than allowed')
      fun.write('}')

      if (type !== 'array') fun.write('}')
      consume('minItems')
    }

    if (node.items || node.items === false) {
      validateTypeApplicable('array')
      if (type !== 'array') fun.write('if (%s) {', types.array(name))

      if (Array.isArray(node.items)) {
        for (let p = 0; p < node.items.length; p++) {
          if (Array.isArray(type) && type.indexOf('null') !== -1)
            fun.write('if (%s !== null) {', name)
          rule(genobj(name, p), node.items[p], subPath(`${p}`))
          if (Array.isArray(type) && type.indexOf('null') !== -1) fun.write('}')
        }
      } else {
        const i = genloop()
        fun.write('for (let %s = 0; %s < %s.length; %s++) {', i, i, name, i)
        rule(`${name}[${i}]`, node.items, subPath('items'))
        fun.write('}')
      }

      if (type !== 'array') fun.write('}')
      consume('items')
    } else if (typeApplicable('array')) {
      enforceValidation('items rule must be specified')
    }

    if (!Array.isArray(node.items)) {
      // additionalItems is allowed, but ignored per some spec tests in this case!
      // We do nothing and let it throw except for in allowUnusedKeywords mode
      // As a result, this is not allowed by default, only in allowUnusedKeywords mode
    } else if (node.additionalItems === false) {
      validateTypeApplicable('array')
      if (type !== 'array') fun.write('if (%s) {', types.array(name))
      fun.write('if (%s.length > %d) {', name, node.items.length)
      error('has additional items')
      fun.write('}')
      if (type !== 'array') fun.write('}')
      consume('additionalItems')
    } else if (node.additionalItems) {
      validateTypeApplicable('array')
      if (type !== 'array') fun.write('if (%s) {', types.array(name))
      const i = genloop()
      fun.write('for (let %s = %d; %s < %s.length; %s++) {', i, node.items.length, i, name, i)
      rule(`${name}[${i}]`, node.additionalItems, subPath('additionalItems'))
      fun.write('}')
      if (type !== 'array') fun.write('}')
      consume('additionalItems')
    } else if (node.items.length === node.maxItems) {
      // No additional items are possible
    } else {
      enforceValidation('additionalItems rule must be specified for fixed arrays')
    }

    if (node.contains || node.contains === false) {
      validateTypeApplicable('array')
      if (type !== 'array') fun.write('if (%s) {', types.array(name))

      const prev = gensym('prev')
      const passes = gensym('passes')
      fun.write('let %s = 0', passes)

      const i = genloop()
      fun.write('for (let %s = 0; %s < %s.length; %s++) {', i, i, name, i)
      fun.write('const %s = errors', prev)
      subrule(`${name}[${i}]`, node.contains, subPath('contains'))
      fun.write('if (%s === errors) {', prev)
      fun.write('%s++', passes)
      fun.write('} else {')
      fun.write('errors = %s', prev)
      fun.write('}')
      fun.write('}')

      if (Number.isFinite(node.minContains)) {
        fun.write('if (%s < %d) {', passes, node.minContains)
        error('array contains too few matching items')
        fun.write('}')
        consume('minContains')
      } else {
        fun.write('if (%s < 1) {', passes)
        error('array does not contain a match')
        fun.write('}')
      }

      if (Number.isFinite(node.maxContains)) {
        fun.write('if (%s > %d) {', passes, node.maxContains)
        error('array contains too many matching items')
        fun.write('}')
        consume('maxContains')
      }

      if (type !== 'array') fun.write('}')
      consume('contains')
    }

    if (node.uniqueItems === true) {
      validateTypeApplicable('array')
      if (type !== 'array') fun.write('if (%s) {', types.array(name))
      scope.unique = unique
      scope.deepEqual = deepEqual
      fun.write('if (!(unique(%s))) {', name)
      error('must be unique')
      fun.write('}')
      if (type !== 'array') fun.write('}')
      consume('uniqueItems')
    } else if (node.uniqueItems === false) {
      consume('uniqueItems')
    }

    // Objects

    if (node.maxProperties !== undefined) {
      enforce(Number.isFinite(node.maxProperties), 'Invalid maxProperties:', node.maxProperties)
      validateTypeApplicable('object')
      if (type !== 'object') fun.write('if (%s) {', types.object(name))

      fun.write('if (Object.keys(%s).length > %d) {', name, node.maxProperties)
      error('has more properties than allowed')
      fun.write('}')

      if (type !== 'object') fun.write('}')
      consume('maxProperties')
    }

    if (node.minProperties !== undefined) {
      enforce(Number.isFinite(node.minProperties), 'Invalid minProperties:', node.minProperties)
      validateTypeApplicable('object')
      if (type !== 'object') fun.write('if (%s) {', types.object(name))

      fun.write('if (Object.keys(%s).length < %d) {', name, node.minProperties)
      error('has less properties than allowed')
      fun.write('}')

      if (type !== 'object') fun.write('}')
      consume('minProperties')
    }

    if (typeof node.propertyNames === 'object' || typeof node.propertyNames === 'boolean') {
      validateTypeApplicable('object')
      if (type !== 'object') fun.write('if (%s) {', types.object(name))
      const key = gensym('key')
      fun.write('for (const %s of Object.keys(%s)) {', key, name)
      const nameSchema =
        typeof node.propertyNames === 'object'
          ? { type: 'string', ...node.propertyNames }
          : node.propertyNames
      rule(key, nameSchema, subPath('propertyNames'))
      fun.write('}')
      if (type !== 'object') fun.write('}')
      consume('propertyNames')
    }
    if (typeof node.additionalProperties === 'object' && typeof node.propertyNames !== 'object') {
      enforceValidation('wild-card additionalProperties requires propertyNames')
    }

    if (Array.isArray(node.required)) {
      validateTypeApplicable('object')
      if (type !== 'object') fun.write('if (%s) {', types.object(name))
      for (const req of node.required) {
        const prop = genobj(name, req)
        fun.write('if (%s === undefined) {', prop)
        error('is required', prop)
        fun.write('}')
      }
      if (type !== 'object') fun.write('}')
      consume('required')
    }

    if (node.dependencies) {
      validateTypeApplicable('object')
      if (type !== 'object') fun.write('if (%s) {', types.object(name))

      for (const key of Object.keys(node.dependencies)) {
        let deps = node.dependencies[key]
        if (typeof deps === 'string') deps = [deps]

        const exists = (k) => `${genobj(name, k)} !== undefined`
        const item = genobj(name, key)

        if (Array.isArray(deps)) {
          const condition = deps.map(exists).join(' && ') || 'true'
          fun.write('if (%s !== undefined && !(%s)) {', item, condition)
          error('dependencies not set')
          fun.write('}')
        } else if (typeof deps === 'object' || typeof deps === 'boolean') {
          fun.write('if (%s !== undefined) {', item)
          rule(name, deps, subPath('dependencies', key))
          fun.write('}')
        } else {
          fail('Unexpected dependencies entry')
        }
      }

      if (type !== 'object') fun.write('}')
      consume('dependencies')
    }

    if (typeof node.properties === 'object') {
      validateTypeApplicable('object')
      for (const p of Object.keys(node.properties)) {
        if (Array.isArray(type) && type.indexOf('null') !== -1)
          fun.write('if (%s !== null) {', name)

        rule(genobj(name, p), node.properties[p], subPath('properties', p))

        if (Array.isArray(type) && type.indexOf('null') !== -1) fun.write('}')
      }
      consume('properties')
    }

    if (node.patternProperties) {
      validateTypeApplicable('object')
      if (type !== 'object') fun.write('if (%s) {', types.object(name))
      const key = gensym('key')
      fun.write('for (const %s of Object.keys(%s)) {', key, name)

      for (const p of Object.keys(node.patternProperties)) {
        fun.write('if (%s.test(%s)) {', patterns(p), key)
        rule(`${name}[${key}]`, node.patternProperties[p], subPath('patternProperties', p))
        fun.write('}')
      }

      fun.write('}')
      if (type !== 'object') fun.write('}')
      consume('patternProperties')
    }

    if (node.additionalProperties || node.additionalProperties === false) {
      validateTypeApplicable('object')
      if (type !== 'object') fun.write('if (%s) {', types.object(name))

      const key = gensym('key')

      const toCompare = (p) => `${key} !== ${JSON.stringify(p)}`
      const toTest = (p) => `!${patterns(p)}.test(${key})`

      const additionalProp =
        Object.keys(node.properties || {})
          .map(toCompare)
          .concat(Object.keys(node.patternProperties || {}).map(toTest))
          .join(' && ') || 'true'

      fun.write('for (const %s of Object.keys(%s)) {', key, name)
      fun.write('if (%s) {', additionalProp)

      if (node.additionalProperties === false) {
        error('has additional properties', null, `${JSON.stringify(`${name}.`)} + ${key}`)
      } else {
        rule(`${name}[${key}]`, node.additionalProperties, subPath('additionalProperties'))
      }

      fun.write('}')
      fun.write('}')

      if (type !== 'object') fun.write('}')
      consume('additionalProperties')
    } else if (typeApplicable('object')) {
      enforceValidation('additionalProperties rule must be specified')
    }

    // Generic

    if (node.const !== undefined) {
      const complex = typeof node.const === 'object'
      const compare = makeCompare(name, complex)
      fun.write('if (!%s) {', compare(node.const))
      error('must be const value')
      fun.write('}')
      consume('const')
    } else if (node.enum) {
      enforce(Array.isArray(node.enum), 'Invalid enum')
      const complex = node.enum.some((e) => typeof e === 'object')
      const compare = makeCompare(name, complex)
      fun.write('if (!(%s)) {', node.enum.map(compare).join(' || '))
      error('must be an enum value')
      fun.write('}')
      consume('enum')
    }

    if (node.not || node.not === false) {
      const prev = gensym('prev')
      fun.write('const %s = errors', prev)
      subrule(name, node.not, subPath('not'))
      fun.write('if (%s === errors) {', prev)
      error('negative schema matches')
      fun.write('} else {')
      fun.write('errors = %s', prev)
      fun.write('}')
      consume('not')
    }

    const thenOrElse = node.then || node.then === false || node.else || node.else === false
    if ((node.if || node.if === false) && thenOrElse) {
      const prev = gensym('prev')
      fun.write('const %s = errors', prev)
      subrule(name, node.if, subPath('if'))
      fun.write('if (%s !== errors) {', prev)
      fun.write('errors = %s', prev)
      if (node.else || node.else === false) {
        rule(name, node.else, subPath('else'))
        consume('else')
      }
      if (node.then || node.then === false) {
        fun.write('} else {')
        rule(name, node.then, subPath('then'))
        consume('then')
      }
      fun.write('}')
      consume('if')
    }

    if (node.allOf) {
      enforce(Array.isArray(node.allOf), 'Invalid allOf')
      node.allOf.forEach((sch, key) => {
        rule(name, sch, subPath('allOf', key))
      })
      consume('allOf')
    }

    if (node.anyOf && node.anyOf.length) {
      enforce(Array.isArray(node.anyOf), 'Invalid anyOf')
      const prev = gensym('prev')

      node.anyOf.forEach((sch, i) => {
        if (i === 0) {
          fun.write('const %s = errors', prev)
        } else {
          fun.write('if (errors !== %s) {', prev)
          fun.write('errors = %s', prev)
        }
        subrule(name, sch, schemaPath)
      })
      node.anyOf.forEach((sch, i) => {
        if (i) fun.write('}')
      })
      fun.write('if (%s !== errors) {', prev)
      error('no schemas match')
      fun.write('}')
      consume('anyOf')
    }

    if (node.oneOf && node.oneOf.length) {
      enforce(Array.isArray(node.oneOf), 'Invalid oneOf')
      const prev = gensym('prev')
      const passes = gensym('passes')

      fun.write('const %s = errors', prev)
      fun.write('let %s = 0', passes)

      for (const sch of node.oneOf) {
        subrule(name, sch, schemaPath)
        fun.write('if (%s === errors) {', prev)
        fun.write('%s++', passes)
        fun.write('} else {')
        fun.write('errors = %s', prev)
        fun.write('}')
      }

      fun.write('if (%s !== 1) {', passes)
      error('no (or more than one) schemas match')
      fun.write('}')
      consume('oneOf')
    }

    if (typeValidate !== 'true') fun.write('}') // type check
    finish()
  }

  visit(optAllErrors, optIncludeErrors, 'data', schema, [])

  fun.write('return errors === 0')
  fun.write('}')

  if (dryRun) return

  const validate = fun.makeFunction(scope)
  validate.toModule = () => fun.makeModule(scope)
  validate.toJSON = () => schema
  return validate
}

const validator = function(schema, opts = {}) {
  if (typeof schema === 'string') schema = JSON.parse(schema)
  return compile(schema, schema, opts)
}

const parser = function(schema, opts = {}) {
  // strong mode is default in parser
  const validate = validator(schema, { mode: 'strong', ...opts })
  const parse = (src) => {
    if (typeof src !== 'string') throw new Error('Invalid type!')
    const data = JSON.parse(src)
    if (validate(data)) return data
    const message = validate.errors
      ? validate.errors.map((err) => `${err.field} ${err.message}`).join('\n')
      : ''
    throw new Error(`JSON validation error${message ? `: ${message}` : ''}`)
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

module.exports = validator
Object.assign(module.exports, { validator, parser })
