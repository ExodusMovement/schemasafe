'use strict'

const { format, safe, safeand, safeor } = require('./safe-format')
const genfun = require('./generate-function')
const { toPointer, resolveReference, joinPath } = require('./pointer')
const formats = require('./formats')
const functions = require('./scope-functions')
const KNOWN_KEYWORDS = require('./known-keywords')

// for building into the validation function
const types = new Map(
  Object.entries({
    any: () => format('true'),
    null: (name) => format('%s === null', name),
    boolean: (name) => format('typeof %s === "boolean"', name),
    array: (name) => format('Array.isArray(%s)', name),
    object: (n) => format('typeof %s === "object" && %s && !Array.isArray(%s)', n, n, n),
    number: (name) => format('typeof %s === "number"', name),
    integer: (name) => format('Number.isInteger(%s)', name),
    string: (name) => format('typeof %s === "string"', name),
  })
)

// for checking schema parts in consume()
const schemaTypes = new Map(
  Object.entries({
    boolean: (arg) => typeof arg === 'boolean',
    array: (arg) => Array.isArray(arg),
    object: (arg) => typeof arg === 'object' && arg && !Array.isArray(arg),
    finite: (arg) => Number.isFinite(arg),
    integer: (arg) => Number.isInteger(arg),
    natural: (arg) => Number.isInteger(arg) && arg >= 0,
    string: (arg) => typeof arg === 'string',
    jsonval: (arg) => functions.deepEqual(arg, JSON.parse(JSON.stringify(arg))),
  })
)

const scopeCache = Symbol('cache')

// Order is important, newer at the top!
const schemaVersions = [
  'https://json-schema.org/draft/2019-09/schema',
  'https://json-schema.org/draft-07/schema',
  'https://json-schema.org/draft-06/schema',
  'https://json-schema.org/draft-04/schema',
  'https://json-schema.org/draft-03/schema',
]

// Helper methods for semi-structured paths
const propvar = (name, key) => ({ parent: name, keyname: key }) // property by variable
const propimm = (name, val) => ({ parent: name, keyval: val }) // property by immediate value
const buildName = ({ name, parent, keyval, keyname }) => {
  if (name) {
    if (parent || keyval || keyname) throw new Error('name can be used only stand-alone')
    return name // top-level
  }
  if (keyval && keyname) throw new Error('Can not use key value and name at the same time')
  if (!parent) throw new Error('Can not use property of undefined parent!')
  if (parent && keyval !== undefined) {
    if (!['string', 'number'].includes(typeof keyval)) throw new Error('Invalid property path')
    return format('%s[%j]', parent, keyval)
  } else if (parent && keyname) {
    return format('%s[%s]', parent, keyname)
  }
  /* c8 ignore next */
  throw new Error('Unreachable')
}

const rootMeta = new WeakMap()
const compile = (schema, root, opts, scope, basePathRoot) => {
  const {
    mode = 'default',
    useDefaults = false,
    includeErrors: optIncludeErrors = false,
    allErrors: optAllErrors = false,
    verboseErrors = false,
    dryRun = false,
    allowUnusedKeywords = opts.mode === 'lax',
    requireValidation = opts.mode === 'strong',
    complexityChecks = opts.mode === 'strong',
    $schemaDefault = null,
    formats: optFormats = {},
    weakFormats = opts.mode !== 'strong',
    extraFormats = false,
    schemas = {},
    ...unknown
  } = opts
  const fmts = {
    ...formats.core,
    ...(weakFormats ? formats.weak : {}),
    ...(extraFormats ? formats.extra : {}),
    ...optFormats,
  }
  if (Object.keys(unknown).length !== 0)
    throw new Error(`Unknown options: ${Object.keys(unknown).join(', ')}`)

  if (!['strong', 'lax', 'default'].includes(mode)) throw new Error(`Invalid mode: ${mode}`)
  if (mode === 'strong' && (!requireValidation || !complexityChecks))
    throw new Error('Strong mode demands requireValidation and complexityChecks')
  if (mode === 'strong' && (weakFormats || allowUnusedKeywords))
    throw new Error('Strong mode forbids weakFormats and allowUnusedKeywords')

  if (!scope[scopeCache])
    scope[scopeCache] = { sym: new Map(), ref: new Map(), format: new Map(), pattern: new Map() }
  const cache = scope[scopeCache] // cache meta info for known scope variables, per meta type

  const gensym = (name) => {
    if (!cache.sym.get(name)) cache.sym.set(name, 0)
    const index = cache.sym.get(name)
    cache.sym.set(name, index + 1)
    return safe(`${name}${index}`)
  }

  const patterns = (p) => {
    if (cache.pattern.has(p)) return cache.pattern.get(p)
    const n = gensym('pattern')
    scope[n] = new RegExp(p, 'u')
    cache.pattern.set(p, n)
    return n
  }

  const vars = 'ijklmnopqrstuvxyz'.split('')
  const genloop = () => {
    const v = vars.shift()
    vars.push(v + v[0])
    return safe(v)
  }

  const present = (location) => {
    const name = buildName(location) // also checks for sanity, do not remove
    const { parent, keyval, keyname } = location
    if (parent) {
      scope.hasOwn = functions.hasOwn
      if (keyval) {
        return format('%s !== undefined && hasOwn(%s, %j)', name, parent, keyval)
      } else if (keyname) {
        return format('%s !== undefined && hasOwn(%s, %s)', name, parent, keyname)
      }
    }
    return format('%s !== undefined', name)
  }

  const fun = genfun()
  fun.write('function validate(data) {')
  // Since undefined is not a valid JSON value, we coerce to null and other checks will catch this
  fun.write('if (data === undefined) data = null')
  if (optIncludeErrors) fun.write('validate.errors = null')
  fun.write('let errors = 0')

  const getMeta = () => rootMeta.get(root) || {}
  const basePathStack = basePathRoot ? [basePathRoot] : []
  const visit = (allErrors, includeErrors, current, node, schemaPath) => {
    const name = buildName(current)
    const rule = (...args) => visit(allErrors, includeErrors, ...args)
    const subrule = (...args) => visit(true, false, ...args)
    const writeErrorObject = (error) => {
      if (allErrors) {
        fun.write('if (validate.errors === null) validate.errors = []')
        fun.write('validate.errors.push(%s)', error)
      } else {
        // Array assignment is significantly faster, do not refactor the two branches
        fun.write('validate.errors = [%s]', error)
        fun.write('return false')
      }
    }
    const error = (msg, prop, value) => {
      if (includeErrors === true) {
        const leanError = { field: prop || name, message: msg }
        if (verboseErrors) {
          const type = node.type || 'any'
          const fullError = { ...leanError, type, schemaPath: toPointer(schemaPath) }
          writeErrorObject(format('{ ...%j, value: %s }', fullError, value || name))
        } else {
          writeErrorObject(format('%j', leanError))
        }
      }
      if (allErrors) {
        fun.write('errors++')
      } else {
        fun.write('return false')
      }
    }
    const errorIf = (fmt, args, ...errorArgs) => {
      fun.write('if (%s) {', format(fmt, ...args))
      error(...errorArgs)
      fun.write('}')
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
        errorIf('%s', [present(current)], 'is unexpected')
      }
      return
    }

    enforce(Object.getPrototypeOf(node) === Object.prototype, 'Schema is not an object')
    for (const key of Object.keys(node))
      enforce(KNOWN_KEYWORDS.includes(key) || allowUnusedKeywords, 'Keyword not supported:', key)

    const unused = new Set(Object.keys(node))
    const consume = (prop, ...ruleTypes) => {
      enforce(unused.has(prop), 'Unexpected double consumption:', prop)
      enforce(functions.hasOwn(node, prop), 'Is not an own property:', prop)
      enforce(ruleTypes.every((t) => schemaTypes.has(t)), 'Invalid type used in consume')
      enforce(ruleTypes.some((t) => schemaTypes.get(t)(node[prop])), 'Type not expected:', prop)
      unused.delete(prop)
    }

    const isTopLevel = !current.parent // e.g. top-level data and property names
    const finish = () => {
      if (!isTopLevel) fun.write('}') // undefined check
      enforce(unused.size === 0 || allowUnusedKeywords, 'Unprocessed keywords:', [...unused])
    }

    if (node === root) {
      const $schema = node.$schema || $schemaDefault
      if (node.$schema) {
        if (typeof node.$schema !== 'string') throw new Error('Unexpected $schema')
        consume('$schema', 'string')
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

    if (typeof node.description === 'string') consume('description', 'string') // unused, meta-only
    if (typeof node.title === 'string') consume('title', 'string') // unused, meta-only
    if (typeof node.$comment === 'string') consume('$comment', 'string') // unused, meta-only
    if (Array.isArray(node.examples)) consume('examples', 'array') // unused, meta-only

    // defining defs are allowed, those are validated on usage
    if (typeof node.$defs === 'object') {
      consume('$defs', 'object')
    } else if (typeof node.definitions === 'object') {
      consume('definitions', 'object')
    }

    const basePath = () => (basePathStack.length > 0 ? basePathStack[basePathStack.length - 1] : '')
    if (typeof node.$id === 'string') {
      basePathStack.push(joinPath(basePath(), node.$id))
      consume('$id', 'string')
    } else if (typeof node.id === 'string') {
      basePathStack.push(joinPath(basePath(), node.id))
      consume('id', 'string')
    }

    const booleanRequired = getMeta().booleanRequired && typeof node.required === 'boolean'
    if (node.default !== undefined && !useDefaults) consume('default', 'jsonval') // unused in this case
    const defaultIsPresent = node.default !== undefined && useDefaults // will consume on use
    if (isTopLevel) {
      // top-level data is coerced to null above, or is an object key, it can't be undefined
      if (defaultIsPresent) fail('Can not apply default value at root')
      if (node.required === true || node.required === false)
        fail('Can not apply boolean required at root')
    } else if (defaultIsPresent || booleanRequired) {
      fun.write('if (!(%s)) {', present(current))
      if (defaultIsPresent) {
        fun.write('%s = %j', name, node.default)
        consume('default', 'jsonval')
      }
      if (booleanRequired) {
        if (node.required === true) {
          if (!defaultIsPresent) error('is required')
          consume('required', 'boolean')
        } else if (node.required === false) {
          consume('required', 'boolean')
        }
      }
      fun.write('} else {')
    } else {
      fun.write('if (%s) {', present(current))
    }

    if (node.$ref) {
      const resolved = resolveReference(root, schemas || {}, node.$ref, basePath())
      const [sub, subRoot, path] = resolved[0] || []
      if (sub || sub === false) {
        let n = cache.ref.get(sub)
        if (!n) {
          n = gensym('ref')
          cache.ref.set(sub, n)
          let fn = null // resolve cyclic dependencies
          scope[n] = (...args) => fn(...args)
          fn = compile(sub, subRoot, { ...opts, includeErrors: false }, scope, path)
          scope[n] = fn
        }
        errorIf('!%s(%s)', [n, name], 'referenced schema does not match')
      } else {
        fail('failed to resolve $ref:', node.$ref)
      }
      consume('$ref', 'string')

      if (getMeta().exclusiveRefs) {
        // ref overrides any sibling keywords for older schemas
        finish()
        return
      }
    }

    /* Preparation and methods, post-$ref validation will begin at the end of the function */

    const { type } = node
    if (!type) enforceValidation('type is required')
    if (type !== undefined && typeof type !== 'string' && !Array.isArray(type))
      fail('Unexpected type')

    const typeArray = type ? (Array.isArray(type) ? type : [type]) : ['any']
    for (const t of typeArray) {
      enforce(typeof t === 'string' && types.has(t), 'Unknown type:', t)
      if (t === 'any') enforceValidation('type = any is not allowed')
    }

    const typeApplicable = (...possibleTypes) =>
      typeArray.includes('any') || typeArray.some((x) => possibleTypes.includes(x))

    const makeCompare = (variableName, complex) => {
      if (complex) {
        scope.deepEqual = functions.deepEqual
        return (e) => format('deepEqual(%s, %j)', variableName, e)
      }
      return (e) => format('(%s === %j)', variableName, e)
    }

    const enforceRegex = (pattern, target = node) => {
      enforce(typeof pattern === 'string', 'Invalid pattern:', pattern)
      if (requireValidation)
        enforce(/^\^.*\$$/.test(pattern), 'Should start with ^ and end with $:', pattern)
      if (complexityChecks && (pattern.match(/[{+*]/g) || []).length > 1)
        enforce(target.maxLength !== undefined, 'maxLength should be specified for:', pattern)
    }

    /* Checks inside blocks are independent, they are happening on the same code depth */

    const checkNumbers = () => {
      const applyMinMax = (value, operator, message) => {
        enforce(Number.isFinite(value), 'Invalid minimum or maximum:', value)
        errorIf('!(%d %c %s)', [value, operator, name], message)
      }

      if (Number.isFinite(node.exclusiveMinimum)) {
        applyMinMax(node.exclusiveMinimum, '<', 'is less than exclusiveMinimum')
        consume('exclusiveMinimum', 'finite')
      } else if (node.minimum !== undefined) {
        applyMinMax(node.minimum, node.exclusiveMinimum ? '<' : '<=', 'is less than minimum')
        consume('minimum', 'finite')
        if (typeof node.exclusiveMinimum === 'boolean') consume('exclusiveMinimum', 'boolean')
      }

      if (Number.isFinite(node.exclusiveMaximum)) {
        applyMinMax(node.exclusiveMaximum, '>', 'is more than exclusiveMaximum')
        consume('exclusiveMaximum', 'finite')
      } else if (node.maximum !== undefined) {
        applyMinMax(node.maximum, node.exclusiveMaximum ? '>' : '>=', 'is more than maximum')
        consume('maximum', 'finite')
        if (typeof node.exclusiveMaximum === 'boolean') consume('exclusiveMaximum', 'boolean')
      }

      const multipleOf = node.multipleOf === undefined ? 'divisibleBy' : 'multipleOf' // draft3 support
      if (node[multipleOf] !== undefined) {
        enforce(Number.isFinite(node[multipleOf]), `Invalid ${multipleOf}:`, node[multipleOf])
        scope.isMultipleOf = functions.isMultipleOf
        errorIf('!isMultipleOf(%s, %d)', [name, node[multipleOf]], 'has a remainder')
        consume(multipleOf, 'finite')
      }
    }

    const checkStrings = () => {
      if (node.maxLength !== undefined) {
        enforce(Number.isFinite(node.maxLength), 'Invalid maxLength:', node.maxLength)
        scope.stringLength = functions.stringLength
        errorIf('stringLength(%s) > %d', [name, node.maxLength], 'has longer length than allowed')
        consume('maxLength', 'natural')
      }

      if (node.minLength !== undefined) {
        enforce(Number.isFinite(node.minLength), 'Invalid minLength:', node.minLength)
        scope.stringLength = functions.stringLength
        errorIf('stringLength(%s) < %d', [name, node.minLength], 'has less length than allowed')
        consume('minLength', 'natural')
      }

      if (node.format && functions.hasOwn(fmts, node.format)) {
        const formatImpl = fmts[node.format]
        if (formatImpl instanceof RegExp || typeof formatImpl === 'function') {
          let n = cache.format.get(formatImpl)
          if (!n) {
            n = gensym('format')
            scope[n] = formatImpl
            cache.format.set(formatImpl, n)
          }
          if (formatImpl instanceof RegExp) {
            // built-in formats are fine, check only ones from options
            if (functions.hasOwn(optFormats, node.format)) enforceRegex(formatImpl.source)
            errorIf('!%s.test(%s)', [n, name], `must be ${node.format} format`)
          } else {
            errorIf('!%s(%s)', [n, name], `must be ${node.format} format`)
          }
        } else {
          fail('Unrecognized format used:', node.format)
        }
        consume('format', 'string')
      } else {
        enforce(!node.format, 'Unrecognized format used:', node.format)
      }

      if (node.pattern) {
        enforceRegex(node.pattern)
        const p = patterns(node.pattern)
        errorIf('!%s.test(%s)', [p, name], 'pattern mismatch')
        consume('pattern', 'string')
      }
    }

    const checkArrays = () => {
      if (node.maxItems !== undefined) {
        enforce(Number.isFinite(node.maxItems), 'Invalid maxItems:', node.maxItems)
        if (Array.isArray(node.items) && node.items.length > node.maxItems)
          fail(`Invalid maxItems: ${node.maxItems} is less than items array length`)
        errorIf('%s.length > %d', [name, node.maxItems], 'has more items than allowed')
        consume('maxItems', 'natural')
      }

      if (node.minItems !== undefined) {
        enforce(Number.isFinite(node.minItems), 'Invalid minItems:', node.minItems)
        // can be higher that .items length with additionalItems
        errorIf('%s.length < %d', [name, node.minItems], 'has less items than allowed')
        consume('minItems', 'natural')
      }

      if (node.items || node.items === false) {
        if (Array.isArray(node.items)) {
          for (let p = 0; p < node.items.length; p++)
            rule(propimm(name, p), node.items[p], subPath(`${p}`))
        } else {
          const i = genloop()
          fun.block('for (let %s = 0; %s < %s.length; %s++) {', [i, i, name, i], '}', () => {
            rule(propvar(name, i), node.items, subPath('items'))
          })
        }
        consume('items', 'object', 'array', 'boolean')
      } else if (typeApplicable('array')) {
        enforceValidation('items rule must be specified')
      }

      if (!Array.isArray(node.items)) {
        // additionalItems is allowed, but ignored per some spec tests in this case!
        // We do nothing and let it throw except for in allowUnusedKeywords mode
        // As a result, this is not allowed by default, only in allowUnusedKeywords mode
      } else if (node.additionalItems === false) {
        errorIf('%s.length > %d', [name, node.items.length], 'has additional items')
        consume('additionalItems', 'boolean')
      } else if (node.additionalItems) {
        const i = genloop()
        const offset = node.items.length
        fun.block('for (let %s = %d; %s < %s.length; %s++) {', [i, offset, i, name, i], '}', () => {
          rule(propvar(name, i), node.additionalItems, subPath('additionalItems'))
        })
        consume('additionalItems', 'object', 'boolean')
      } else if (node.items.length === node.maxItems) {
        // No additional items are possible
      } else {
        enforceValidation('additionalItems rule must be specified for fixed arrays')
      }

      if (node.contains || node.contains === false) {
        const prev = gensym('prev')
        const passes = gensym('passes')
        fun.write('let %s = 0', passes)

        const i = genloop()
        fun.write('for (let %s = 0; %s < %s.length; %s++) {', i, i, name, i)
        fun.write('const %s = errors', prev)
        subrule(propvar(name, i), node.contains, subPath('contains'))
        fun.write('if (%s === errors) {', prev)
        fun.write('%s++', passes)
        fun.write('} else {')
        fun.write('errors = %s', prev)
        fun.write('}')
        fun.write('}')

        if (Number.isFinite(node.minContains)) {
          errorIf('%s < %d', [passes, node.minContains], 'array contains too few matching items')
          consume('minContains', 'natural')
        } else {
          errorIf('%s < 1', [passes], 'array does not contain a match')
        }

        if (Number.isFinite(node.maxContains)) {
          errorIf('%s > %d', [passes, node.maxContains], 'array contains too many matching items')
          consume('maxContains', 'natural')
        }

        consume('contains', 'object', 'boolean')
      }

      const isSimpleForUnique = () => {
        if (node.maxItems !== undefined) return true
        if (typeof node.items === 'object') {
          if (Array.isArray(node.items) && node.additionalItems === false) return true
          if (!Array.isArray(node.items) && node.items.type) {
            const itemTypes = Array.isArray(node.items.type) ? node.items.type : [node.items.type]
            const primitiveTypes = ['null', 'boolean', 'number', 'integer', 'string']
            if (itemTypes.every((itemType) => primitiveTypes.includes(itemType))) return true
          }
        }
        return false
      }
      if (node.uniqueItems === true) {
        if (complexityChecks)
          enforce(isSimpleForUnique(), 'maxItems should be specified for non-primitive uniqueItems')
        scope.unique = functions.unique
        scope.deepEqual = functions.deepEqual
        errorIf('!unique(%s)', [name], 'must be unique')
        consume('uniqueItems', 'boolean')
      } else if (node.uniqueItems === false) {
        consume('uniqueItems', 'boolean')
      }
    }

    const checkObjects = () => {
      if (node.maxProperties !== undefined) {
        enforce(Number.isFinite(node.maxProperties), 'Invalid maxProperties:', node.maxProperties)
        errorIf('Object.keys(%s).length > %d', [name, node.maxProperties], 'too many properties')
        consume('maxProperties', 'natural')
      }

      if (node.minProperties !== undefined) {
        enforce(Number.isFinite(node.minProperties), 'Invalid minProperties:', node.minProperties)
        errorIf('Object.keys(%s).length < %d', [name, node.minProperties], 'too few properties')
        consume('minProperties', 'natural')
      }

      if (typeof node.propertyNames === 'object' || typeof node.propertyNames === 'boolean') {
        const key = gensym('key')
        fun.block('for (const %s of Object.keys(%s)) {', [key, name], '}', () => {
          const names = node.propertyNames
          const nameSchema = typeof names === 'object' ? { type: 'string', ...names } : names
          rule({ name: key }, nameSchema, subPath('propertyNames'))
        })
        consume('propertyNames', 'object', 'boolean')
      }
      if (typeof node.additionalProperties === 'object' && typeof node.propertyNames !== 'object') {
        enforceValidation('wild-card additionalProperties requires propertyNames')
      }

      if (Array.isArray(node.required)) {
        for (const req of node.required) {
          const prop = propimm(name, req)
          errorIf('!(%s)', [present(prop)], 'is required', buildName(prop))
        }
        consume('required', 'array')
      }

      const dependencies = node.dependencies === undefined ? 'dependentRequired' : 'dependencies'
      if (node[dependencies]) {
        for (const key of Object.keys(node[dependencies])) {
          let deps = node[dependencies][key]
          if (typeof deps === 'string') deps = [deps]

          const exists = (k) => present(propimm(name, k))
          const item = propimm(name, key)

          if (Array.isArray(deps)) {
            const condition = safeand(...deps.map(exists))
            errorIf('%s && !(%s)', [present(item), condition], 'dependencies not set')
          } else if (typeof deps === 'object' || typeof deps === 'boolean') {
            fun.block('if (%s) {', [present(item)], '}', () => {
              rule(current, deps, subPath(dependencies, key))
            })
          } else {
            fail('Unexpected dependencies entry')
          }
        }
        consume(dependencies, 'object')
      }

      if (typeof node.properties === 'object') {
        for (const p of Object.keys(node.properties)) {
          rule(propimm(name, p), node.properties[p], subPath('properties', p))
        }
        consume('properties', 'object')
      }

      if (node.patternProperties) {
        const key = gensym('key')
        fun.block('for (const %s of Object.keys(%s)) {', [key, name], '}', () => {
          for (const p of Object.keys(node.patternProperties)) {
            enforceRegex(p, node.propertyNames || {})
            fun.block('if (%s.test(%s)) {', [patterns(p), key], '}', () => {
              rule(propvar(name, key), node.patternProperties[p], subPath('patternProperties', p))
            })
          }
        })
        consume('patternProperties', 'object')
      }

      if (node.additionalProperties || node.additionalProperties === false) {
        const key = gensym('key')
        const toCompare = (p) => format('%s !== %j', key, p)
        const toTest = (p) => format('!%s.test(%s)', patterns(p), key)
        const additionalProp = safeand(
          ...Object.keys(node.properties || {}).map(toCompare),
          ...Object.keys(node.patternProperties || {}).map(toTest)
        )
        fun.block('for (const %s of Object.keys(%s)) {', [key, name], '}', () => {
          fun.block('if (%s) {', [additionalProp], '}', () => {
            if (node.additionalProperties === false) {
              error('has additional properties', null, format('%j + %s', `${name}.`, key))
            } else {
              rule(propvar(name, key), node.additionalProperties, subPath('additionalProperties'))
            }
          })
        })
        consume('additionalProperties', 'object', 'boolean')
      } else if (typeApplicable('object')) {
        enforceValidation('additionalProperties rule must be specified')
      }
    }

    const checkGeneric = () => {
      if (node.const !== undefined) {
        const complex = typeof node.const === 'object'
        const compare = makeCompare(name, complex)
        errorIf('!%s', [compare(node.const)], 'must be const value')
        consume('const', 'jsonval')
      } else if (node.enum) {
        enforce(Array.isArray(node.enum), 'Invalid enum')
        const complex = node.enum.some((e) => typeof e === 'object')
        const compare = makeCompare(name, complex)
        errorIf('!(%s)', [safeor(...node.enum.map(compare))], 'must be an enum value')
        consume('enum', 'array')
      }

      if (node.not || node.not === false) {
        const prev = gensym('prev')
        fun.write('const %s = errors', prev)
        subrule(current, node.not, subPath('not'))
        fun.write('if (%s === errors) {', prev)
        error('negative schema matches')
        fun.write('} else {')
        fun.write('errors = %s', prev)
        fun.write('}')
        consume('not', 'object', 'boolean')
      }

      const thenOrElse = node.then || node.then === false || node.else || node.else === false
      if ((node.if || node.if === false) && thenOrElse) {
        const prev = gensym('prev')
        fun.write('const %s = errors', prev)
        subrule(current, node.if, subPath('if'))
        fun.write('if (%s !== errors) {', prev)
        fun.write('errors = %s', prev)
        if (node.else || node.else === false) {
          rule(current, node.else, subPath('else'))
          consume('else', 'object', 'boolean')
        }
        if (node.then || node.then === false) {
          fun.write('} else {')
          rule(current, node.then, subPath('then'))
          consume('then', 'object', 'boolean')
        }
        fun.write('}')
        consume('if', 'object', 'boolean')
      }

      if (node.allOf) {
        enforce(Array.isArray(node.allOf), 'Invalid allOf')
        node.allOf.forEach((sch, key) => {
          rule(current, sch, subPath('allOf', key))
        })
        consume('allOf', 'array')
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
          subrule(current, sch, schemaPath)
        })
        node.anyOf.forEach((sch, i) => {
          if (i) fun.write('}')
        })
        fun.write('if (%s !== errors) {', prev)
        fun.write('errors = %s', prev)
        error('no schemas match')
        fun.write('}')
        consume('anyOf', 'array')
      }

      if (node.oneOf && node.oneOf.length) {
        enforce(Array.isArray(node.oneOf), 'Invalid oneOf')
        const prev = gensym('prev')
        const passes = gensym('passes')
        fun.write('const %s = errors', prev)
        fun.write('let %s = 0', passes)
        for (const sch of node.oneOf) {
          subrule(current, sch, schemaPath)
          fun.write('if (%s === errors) {', prev)
          fun.write('%s++', passes)
          fun.write('} else {')
          fun.write('errors = %s', prev)
          fun.write('}')
        }
        errorIf('%s !== 1', [passes], 'no (or more than one) schemas match')
        consume('oneOf', 'array')
      }
    }

    const maybeWrap = (shouldWrap, fmt, args, close, writeBody) => {
      if (!shouldWrap) return writeBody()
      fun.block(fmt, args, close, writeBody)
    }

    const typeWrap = (checkBlock, validTypes, queryType) => {
      const [funSize, unusedSize] = [fun.size(), unused.size]
      maybeWrap(!validTypes.includes(type), 'if (%s) {', [queryType], '}', checkBlock)
      // enforce check that non-applicable blocks are empty and no rules were applied
      if (funSize !== fun.size() || unusedSize !== unused.size)
        enforce(typeApplicable(...validTypes), `Unexpected rules in type`, type)
    }

    /* Actual post-$ref validation happens here */

    const typeValidate = safeor(...typeArray.map((t) => types.get(t)(name)))
    const needTypeValidation = `${typeValidate}` !== 'true'
    if (needTypeValidation) {
      fun.write('if (!(%s)) {', typeValidate)
      error('is the wrong type')
    }
    if (type) consume('type', 'string', 'array')

    // If type validation was needed, we should wrap this inside an else clause.
    // No need to close, type validation would always close at the end if it's used.
    maybeWrap(needTypeValidation, '} else {', [], '', () => {
      typeWrap(checkNumbers, ['number', 'integer'], types.get('number')(name))
      typeWrap(checkStrings, ['string'], types.get('string')(name))
      typeWrap(checkArrays, ['array'], types.get('array')(name))
      typeWrap(checkObjects, ['object'], types.get('object')(name))
      checkGeneric()
    })

    if (needTypeValidation) fun.write('}') // type check

    finish()
  }

  visit(optAllErrors, optIncludeErrors, { name: safe('data') }, schema, [])

  fun.write('return errors === 0')
  fun.write('}')

  if (dryRun) return

  const validate = fun.makeFunction(scope)
  validate.toModule = () => fun.makeModule(scope)
  validate.toJSON = () => schema
  return validate
}

const validator = (schema, opts = {}) => compile(schema, schema, opts, Object.create(null))

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

module.exports = { validator, parser }
