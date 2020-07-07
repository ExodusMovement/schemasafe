'use strict'

const { format, safe, safeand, safeor } = require('./safe-format')
const genfun = require('./generate-function')
const { resolveReference, joinPath, buildSchemas } = require('./pointer')
const formats = require('./formats')
const functions = require('./scope-functions')
const KNOWN_KEYWORDS = require('./known-keywords')

// for building into the validation function
const types = new Map(
  Object.entries({
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

const vocab2019 = ['core', 'applicator', 'validation', 'meta-data', 'format', 'content']
const knownVocabularies = vocab2019.map((v) => `https://json-schema.org/draft/2019-09/vocab/${v}`)

const noopRegExps = new Set(['^[\\s\\S]*$', '^[\\S\\s]*$', '^[^]*$', '', '.*'])

// Helper methods for semi-structured paths
const propvar = (parent, keyname, inKeys = false) => Object.freeze({ parent, keyname, inKeys }) // property by variable
const propimm = (parent, keyval, checked = false) => Object.freeze({ parent, keyval, checked }) // property by immediate value
const buildName = ({ name, parent, keyval, keyname }) => {
  if (name) {
    if (parent || keyval || keyname) throw new Error('name can be used only stand-alone')
    return name // top-level
  }
  if (!parent) throw new Error('Can not use property of undefined parent!')
  const parentName = buildName(parent)
  if (keyval !== undefined) {
    if (keyname) throw new Error('Can not use key value and name together')
    if (!['string', 'number'].includes(typeof keyval)) throw new Error('Invalid property path')
    if (/^[a-z][a-z0-9_]*$/i.test(keyval)) return format('%s.%s', parentName, safe(keyval))
    return format('%s[%j]', parentName, keyval)
  } else if (keyname) {
    return format('%s[%s]', parentName, keyname)
  }
  /* c8 ignore next */
  throw new Error('Unreachable')
}

const jsonProtoKeys = new Set(
  [].concat(
    ...[Object, Array, String, Number, Boolean].map((c) => Object.getOwnPropertyNames(c.prototype))
  )
)

const rootMeta = new WeakMap()
const compile = (schema, root, opts, scope, basePathRoot) => {
  const {
    mode = 'default',
    useDefaults = false,
    removeAdditional = false, // supports additionalProperties: false and additionalItems: false
    includeErrors: optIncludeErrors = false,
    allErrors: optAllErrors = false,
    reflectErrorsValue = false,
    dryRun = false,
    allowUnusedKeywords = opts.mode === 'lax',
    requireValidation = opts.mode === 'strong',
    requireStringValidation = opts.mode === 'strong',
    complexityChecks = opts.mode === 'strong',
    unmodifiedPrototypes = false, // assumes no mangled Object/Array prototypes
    isJSON = false, // assume input to be JSON, which e.g. makes undefined impossible
    $schemaDefault = null,
    formats: optFormats = {},
    weakFormats = opts.mode !== 'strong',
    extraFormats = false,
    schemas, // always a Map, produced at wrapper
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
  if (mode === 'strong' && (!requireValidation || !requireStringValidation || !complexityChecks))
    throw new Error('Strong mode demands require(String)Validation and complexityChecks')
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

  const buildPath = (prop) => {
    const path = []
    let curr = prop
    while (curr) {
      if (!curr.name) path.unshift(curr)
      curr = curr.parent || curr.errorParent
    }

    // fast case when there are no variables inside path
    if (path.every((part) => part.keyval !== undefined))
      return format('%j', functions.toPointer(path.map((part) => part.keyval)))

    // slow case with variables
    const first = path[0].keyname ? format('%s', path[0].keyname) : format('%j', path[0].keyval)
    const next = (code, { keyname, keyval }) =>
      keyname ? format('%s, %s', code, keyname) : format('%s, %j', code, keyval)
    scope.toPointer = functions.toPointer
    return format('toPointer([%s])', path.slice(1).reduce(next, first))
  }

  const present = (location) => {
    const name = buildName(location) // also checks for sanity, do not remove
    const { parent, keyval, keyname, inKeys, checked } = location
    /* c8 ignore next */
    if (checked || (inKeys && isJSON)) throw new Error('Unreachable: useless check for undefined')
    if (inKeys) return format('%s !== undefined', name)
    if (parent && keyname) {
      scope.hasOwn = functions.hasOwn
      return format('%s !== undefined && hasOwn(%s, %s)', name, buildName(parent), keyname)
    } else if (parent && keyval !== undefined) {
      // numbers must be converted to strings for this check, hence `${keyval}` in check below
      if (unmodifiedPrototypes && isJSON && !jsonProtoKeys.has(`${keyval}`))
        return format('%s !== undefined', name)
      scope.hasOwn = functions.hasOwn
      return format('%s !== undefined && hasOwn(%s, %j)', name, buildName(parent), keyval)
    }
    /* c8 ignore next */
    throw new Error('Unreachable: present() check without parent')
  }

  const fun = genfun()
  fun.write('function validate(data) {')
  // Since undefined is not a valid JSON value, we coerce to null and other checks will catch this
  fun.write('if (data === undefined) data = null')
  if (optIncludeErrors) fun.write('validate.errors = null')
  fun.write('let errors = 0')

  const getMeta = () => rootMeta.get(root) || {}
  const basePathStack = basePathRoot ? [basePathRoot] : []
  const visit = (allErrors, includeErrors, history, current, node, schemaPath) => {
    // e.g. top-level data and property names, OR already checked by present() in history, OR in keys and not undefined
    const definitelyPresent =
      !current.parent || history.includes(current) || current.checked || (current.inKeys && isJSON)

    const name = buildName(current)
    const currPropVar = (...args) => propvar(current, ...args)
    const currPropImm = (...args) => propimm(current, ...args)

    const error = ({ path = [], prop = current }) => {
      const schemaP = functions.toPointer([...schemaPath, ...path])
      const dataP = buildPath(prop)
      if (includeErrors === true) {
        const errorJS = reflectErrorsValue
          ? format('{ schemaPath: %j, dataPath: %s, value: %s }', schemaP, dataP, buildName(prop))
          : format('{ schemaPath: %j, dataPath: %s }', schemaP, dataP)
        if (allErrors) {
          fun.write('if (validate.errors === null) validate.errors = []')
          fun.write('validate.errors.push(%s)', errorJS)
        } else {
          // Array assignment is significantly faster, do not refactor the two branches
          fun.write('validate.errors = [%s]', errorJS)
        }
      }
      if (allErrors) {
        fun.write('errors++')
      } else {
        fun.write('return false')
      }
    }
    const errorIf = (fmt, args, errorArgs) => {
      const condition = format(fmt, ...args)
      if (includeErrors === false) {
        // in this case, we can fast-track and inline this to generate more readable code
        if (allErrors) {
          fun.write('if (%s) errors++', condition)
        } else {
          fun.write('if (%s) return false', condition)
        }
      } else {
        fun.write('if (%s) {', condition)
        error(errorArgs)
        fun.write('}')
      }
    }

    const fail = (msg, value) => {
      const comment = value !== undefined ? ` ${JSON.stringify(value)}` : ''
      throw new Error(`${msg}${comment} at ${functions.toPointer(schemaPath)}`)
    }
    const enforce = (ok, ...args) => ok || fail(...args)
    const enforceValidation = (msg) => enforce(!requireValidation, `[requireValidation] ${msg}`)
    const subPath = (...args) => [...schemaPath, ...args]

    if (typeof node === 'boolean') {
      if (node === true) {
        // any is valid
        enforceValidation('schema = true is not allowed')
      } else if (definitelyPresent) {
        // node === false always fails in this case
        error({})
      } else {
        // node === false
        errorIf('%s', [present(current)], {})
      }
      return
    }

    enforce(node && Object.getPrototypeOf(node) === Object.prototype, 'Schema is not an object')
    for (const key of Object.keys(node))
      enforce(KNOWN_KEYWORDS.includes(key) || allowUnusedKeywords, 'Keyword not supported:', key)

    if (Object.keys(node).length === 0) {
      enforceValidation('empty rules node encountered')
      return // nothing to validate here, basically the same as node === true
    }

    const unused = new Set(Object.keys(node))
    const consume = (prop, ...ruleTypes) => {
      enforce(unused.has(prop), 'Unexpected double consumption:', prop)
      enforce(functions.hasOwn(node, prop), 'Is not an own property:', prop)
      enforce(ruleTypes.every((t) => schemaTypes.has(t)), 'Invalid type used in consume')
      enforce(ruleTypes.some((t) => schemaTypes.get(t)(node[prop])), 'Type not expected:', prop)
      unused.delete(prop)
    }

    const finish = () => {
      if (!definitelyPresent) fun.write('}') // undefined check
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
      if (node.$vocabulary) {
        for (const [vocab, flag] of Object.entries(node.$vocabulary)) {
          if (flag === false) continue
          enforce(flag === true && knownVocabularies.includes(vocab), 'Unknown vocabulary:', vocab)
        }
        consume('$vocabulary', 'object')
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
    if (definitelyPresent) {
      if (defaultIsPresent) fail('Can not apply default value here (e.g. at root)')
      if (node.required === true || node.required === false)
        fail('Can not apply boolean required here (e.g. at root)')
    } else if (defaultIsPresent || booleanRequired) {
      fun.write('if (!(%s)) {', present(current))
      if (defaultIsPresent) {
        fun.write('%s = %j', name, node.default)
        consume('default', 'jsonval')
      }
      if (booleanRequired) {
        if (node.required === true) {
          if (!defaultIsPresent) error({ path: ['required'] })
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
      const resolved = resolveReference(root, schemas, node.$ref, basePath())
      const [sub, subRoot, path] = resolved[0] || []
      if (sub || sub === false) {
        let n = cache.ref.get(sub)
        if (!n) {
          n = gensym('ref')
          cache.ref.set(sub, n)
          let fn = null // resolve cyclic dependencies
          scope[n] = (...args) => fn(...args)
          fn = compile(sub, subRoot, opts, scope, path)
          scope[n] = fn
        }
        errorIf('!%s(%s)', [n, name], { path: ['$ref'] })
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

    const hasSubValidation =
      node.$ref || ['allOf', 'anyOf', 'oneOf'].some((key) => Array.isArray(node[key]))

    const typeArray =
      node.type === undefined ? null : Array.isArray(node.type) ? node.type : [node.type]
    for (const t of typeArray || [])
      enforce(typeof t === 'string' && types.has(t), 'Unknown type:', t)
    // typeArray === null means no type validation, which is required if we don't have const or enum
    if (typeArray === null && node.const === undefined && !node.enum && !hasSubValidation)
      enforceValidation('type is required')

    const typeApplicable = (...possibleTypes) =>
      typeArray === null || typeArray.some((x) => possibleTypes.includes(x))

    const compare = (variableName, value) => {
      if (value && typeof value === 'object') {
        scope.deepEqual = functions.deepEqual
        return format('deepEqual(%s, %j)', variableName, value)
      }
      return format('(%s === %j)', variableName, value)
    }

    const enforceRegex = (source, target = node) => {
      enforce(typeof source === 'string', 'Invalid pattern:', source)
      if (requireValidation || requireStringValidation)
        enforce(/^\^.*\$$/.test(source), 'Should start with ^ and end with $:', source)
      if (complexityChecks && ((source.match(/[{+*]/g) || []).length > 1 || /\)[{+*]/.test(source)))
        enforce(target.maxLength !== undefined, 'maxLength should be specified for:', source)
    }

    const maybeWrap = (shouldWrap, fmt, args, close, writeBody) => {
      if (!shouldWrap) return writeBody()
      fun.block(fmt, args, close, writeBody)
    }

    // Those checks will need to be skipped if another error is set in this block before those ones
    const prev =
      allErrors && (node.uniqueItems || node.pattern || node.patternProperties || node.format)
        ? gensym('prev')
        : null
    const prevWrap = (shouldWrap, writeBody) =>
      maybeWrap(prev !== null && shouldWrap, 'if (errors === %s) {', [prev], '}', writeBody)

    // Can not be used before undefined check above! The one performed by present()
    const rule = (...args) => visit(allErrors, includeErrors, [...history, current], ...args)
    const subrule = (...args) => {
      const result = gensym('sub')
      fun.write('const %s = (() => {', result)
      fun.write('let errors = 0') // scoped error flag, should be unused due to !includeErrors
      visit(false, false, [...history, current], ...args)
      fun.write('return errors === 0')
      fun.write('})()')
      return result
    }

    /* Checks inside blocks are independent, they are happening on the same code depth */

    const checkNumbers = () => {
      const applyMinMax = (value, operator, errorArgs) => {
        enforce(Number.isFinite(value), 'Invalid minimum or maximum:', value)
        errorIf('!(%d %c %s)', [value, operator, name], errorArgs)
      }

      if (Number.isFinite(node.exclusiveMinimum)) {
        applyMinMax(node.exclusiveMinimum, '<', { path: ['exclusiveMinimum'] })
        consume('exclusiveMinimum', 'finite')
      } else if (node.minimum !== undefined) {
        applyMinMax(node.minimum, node.exclusiveMinimum ? '<' : '<=', { path: ['minimum'] })
        consume('minimum', 'finite')
        if (typeof node.exclusiveMinimum === 'boolean') consume('exclusiveMinimum', 'boolean')
      }

      if (Number.isFinite(node.exclusiveMaximum)) {
        applyMinMax(node.exclusiveMaximum, '>', { path: ['exclusiveMaximum'] })
        consume('exclusiveMaximum', 'finite')
      } else if (node.maximum !== undefined) {
        applyMinMax(node.maximum, node.exclusiveMaximum ? '>' : '>=', { path: ['maximum'] })
        consume('maximum', 'finite')
        if (typeof node.exclusiveMaximum === 'boolean') consume('exclusiveMaximum', 'boolean')
      }

      const multipleOf = node.multipleOf === undefined ? 'divisibleBy' : 'multipleOf' // draft3 support
      if (node[multipleOf] !== undefined) {
        enforce(Number.isFinite(node[multipleOf]), `Invalid ${multipleOf}:`, node[multipleOf])
        scope.isMultipleOf = functions.isMultipleOf
        errorIf('!isMultipleOf(%s, %d)', [name, node[multipleOf]], { path: ['isMultipleOf'] })
        consume(multipleOf, 'finite')
      }
    }

    const checkStrings = () => {
      if (node.maxLength !== undefined) {
        enforce(Number.isFinite(node.maxLength), 'Invalid maxLength:', node.maxLength)
        scope.stringLength = functions.stringLength
        const args = [name, node.maxLength, name, node.maxLength]
        errorIf('%s.length > %d && stringLength(%s) > %d', args, { path: ['maxLength'] })
        consume('maxLength', 'natural')
      }

      if (node.minLength !== undefined) {
        enforce(Number.isFinite(node.minLength), 'Invalid minLength:', node.minLength)
        scope.stringLength = functions.stringLength
        const args = [name, node.minLength, name, node.minLength]
        errorIf('%s.length < %d || stringLength(%s) < %d', args, { path: ['minLength'] })
        consume('minLength', 'natural')
      }

      prevWrap(true, () => {
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
              errorIf('!%s.test(%s)', [n, name], { path: ['format'] })
            } else {
              errorIf('!%s(%s)', [n, name], { path: ['format'] })
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
          if (!noopRegExps.has(node.pattern)) {
            const p = patterns(node.pattern)
            errorIf('!%s.test(%s)', [p, name], { path: ['pattern'] })
          }
          consume('pattern', 'string')
        }
      })

      const stringValidated = node.format || node.pattern || hasSubValidation
      if (typeApplicable('string') && requireStringValidation && !stringValidated) {
        fail('pattern or format must be specified for strings, use pattern: ^[\\s\\S]*$ to opt-out')
      }
    }

    const checkArrays = () => {
      if (node.maxItems !== undefined) {
        enforce(Number.isFinite(node.maxItems), 'Invalid maxItems:', node.maxItems)
        if (Array.isArray(node.items) && node.items.length > node.maxItems)
          fail(`Invalid maxItems: ${node.maxItems} is less than items array length`)
        errorIf('%s.length > %d', [name, node.maxItems], { path: ['maxItems'] })
        consume('maxItems', 'natural')
      }

      if (node.minItems !== undefined) {
        enforce(Number.isFinite(node.minItems), 'Invalid minItems:', node.minItems)
        // can be higher that .items length with additionalItems
        errorIf('%s.length < %d', [name, node.minItems], { path: ['minItems'] })
        consume('minItems', 'natural')
      }

      if (node.items || node.items === false) {
        if (Array.isArray(node.items)) {
          for (let p = 0; p < node.items.length; p++)
            rule(currPropImm(p), node.items[p], subPath(`${p}`))
        } else {
          const i = genloop()
          fun.block('for (let %s = 0; %s < %s.length; %s++) {', [i, i, name, i], '}', () => {
            const prop = currPropVar(i, unmodifiedPrototypes) // own property in Array if proto not mangled
            rule(prop, node.items, subPath('items'))
          })
        }
        consume('items', 'object', 'array', 'boolean')
      } else if (typeApplicable('array') && !hasSubValidation) {
        enforceValidation('items rule must be specified')
      }

      if (!Array.isArray(node.items)) {
        // additionalItems is allowed, but ignored per some spec tests in this case!
        // We do nothing and let it throw except for in allowUnusedKeywords mode
        // As a result, this is not allowed by default, only in allowUnusedKeywords mode
      } else if (node.additionalItems === false) {
        const limit = node.items.length
        if (removeAdditional) {
          fun.write('if (%s.length > %d) %s.length = %d', name, limit, name, limit)
        } else {
          errorIf('%s.length > %d', [name, limit], { path: ['additionalItems'] })
        }
        consume('additionalItems', 'boolean')
      } else if (node.additionalItems) {
        const i = genloop()
        const offset = node.items.length
        fun.block('for (let %s = %d; %s < %s.length; %s++) {', [i, offset, i, name, i], '}', () => {
          const prop = currPropVar(i, unmodifiedPrototypes) // own property in Array if proto not mangled
          rule(prop, node.additionalItems, subPath('additionalItems'))
        })
        consume('additionalItems', 'object', 'boolean')
      } else if (node.items.length === node.maxItems) {
        // No additional items are possible
      } else {
        enforceValidation('additionalItems rule must be specified for fixed arrays')
      }

      if (node.contains || node.contains === false) {
        const passes = gensym('passes')
        fun.write('let %s = 0', passes)

        const i = genloop()
        fun.block('for (let %s = 0; %s < %s.length; %s++) {', [i, i, name, i], '}', () => {
          const prop = currPropVar(i, unmodifiedPrototypes) // own property in Array if proto not mangled
          fun.write('if (%s) %s++', subrule(prop, node.contains, subPath('contains')), passes)
        })

        if (Number.isFinite(node.minContains)) {
          errorIf('%s < %d', [passes, node.minContains], { path: ['minContains'] })
          consume('minContains', 'natural')
        } else {
          errorIf('%s < 1', [passes], { path: ['contains'] })
        }

        if (Number.isFinite(node.maxContains)) {
          errorIf('%s > %d', [passes, node.maxContains], { path: ['maxContains'] })
          consume('maxContains', 'natural')
        }

        consume('contains', 'object', 'boolean')
      }

      const uniqueIsSimple = () => {
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
      prevWrap(true, () => {
        if (node.uniqueItems === true) {
          if (complexityChecks)
            enforce(uniqueIsSimple(), 'maxItems should be specified for non-primitive uniqueItems')
          scope.unique = functions.unique
          scope.deepEqual = functions.deepEqual
          errorIf('!unique(%s)', [name], { path: ['uniqueItems'] })
          consume('uniqueItems', 'boolean')
        } else if (node.uniqueItems === false) {
          consume('uniqueItems', 'boolean')
        }
      })
    }

    const checkObjects = () => {
      if (node.maxProperties !== undefined) {
        enforce(Number.isFinite(node.maxProperties), 'Invalid maxProperties:', node.maxProperties)
        errorIf('Object.keys(%s).length > %d', [name, node.maxProperties], {
          path: ['maxProperties'],
        })
        consume('maxProperties', 'natural')
      }

      if (node.minProperties !== undefined) {
        enforce(Number.isFinite(node.minProperties), 'Invalid minProperties:', node.minProperties)
        errorIf('Object.keys(%s).length < %d', [name, node.minProperties], {
          path: ['minProperties'],
        })
        consume('minProperties', 'natural')
      }

      if (typeof node.propertyNames === 'object' || typeof node.propertyNames === 'boolean') {
        const key = gensym('key')
        fun.block('for (const %s of Object.keys(%s)) {', [key, name], '}', () => {
          const names = node.propertyNames
          const nameSchema = typeof names === 'object' ? { type: 'string', ...names } : names
          const sub = currPropVar(key, true) // always own property, from Object.keys
          rule({ name: key, errorParent: sub }, nameSchema, subPath('propertyNames'))
        })
        consume('propertyNames', 'object', 'boolean')
      }
      if (typeof node.additionalProperties === 'object' && typeof node.propertyNames !== 'object') {
        enforceValidation('wild-card additionalProperties requires propertyNames')
      }

      if (Array.isArray(node.required)) {
        for (const req of node.required) {
          const prop = currPropImm(req)
          errorIf('!(%s)', [present(prop)], { path: ['required'], prop })
        }
        consume('required', 'array')
      }

      for (const dependencies of ['dependencies', 'dependentRequired', 'dependentSchemas']) {
        if (node[dependencies]) {
          for (const key of Object.keys(node[dependencies])) {
            let deps = node[dependencies][key]
            if (typeof deps === 'string') deps = [deps]

            const exists = (k) => present(currPropImm(k))
            const item = currPropImm(key)

            if (Array.isArray(deps) && dependencies !== 'dependentSchemas') {
              const condition = safeand(...deps.map(exists))
              errorIf('%s && !(%s)', [present(item), condition], { path: [dependencies, key] })
            } else if (
              (typeof deps === 'object' || typeof deps === 'boolean') &&
              dependencies !== 'dependentRequired'
            ) {
              fun.block('if (%s) {', [present(item)], '}', () => {
                rule(current, deps, subPath(dependencies, key))
              })
            } else {
              fail(`Unexpected ${dependencies} entry`)
            }
          }
          consume(dependencies, 'object')
        }
      }

      if (typeof node.properties === 'object') {
        for (const p of Object.keys(node.properties)) {
          // if allErrors is false, we can skip present check for required properties validated above
          const checked = !allErrors && Array.isArray(node.required) && node.required.includes(p)
          rule(currPropImm(p, checked), node.properties[p], subPath('properties', p))
        }
        consume('properties', 'object')
      }

      prevWrap(node.patternProperties, () => {
        if (node.patternProperties) {
          const key = gensym('key')
          fun.block('for (const %s of Object.keys(%s)) {', [key, name], '}', () => {
            for (const p of Object.keys(node.patternProperties)) {
              enforceRegex(p, node.propertyNames || {})
              fun.block('if (%s.test(%s)) {', [patterns(p), key], '}', () => {
                const sub = currPropVar(key, true) // always own property, from Object.keys
                rule(sub, node.patternProperties[p], subPath('patternProperties', p))
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
                if (removeAdditional) {
                  fun.write('delete %s[%s]', name, key)
                } else {
                  error({ path: ['additionalProperties'], prop: currPropVar(key) })
                }
              } else {
                const sub = currPropVar(key, true) // always own property, from Object.keys
                rule(sub, node.additionalProperties, subPath('additionalProperties'))
              }
            })
          })
          consume('additionalProperties', 'object', 'boolean')
        } else if (typeApplicable('object') && !hasSubValidation) {
          enforceValidation('additionalProperties rule must be specified')
        }
      })
    }

    const checkConst = () => {
      if (node.const !== undefined) {
        errorIf('!%s', [compare(name, node.const)], { path: ['const'] })
        consume('const', 'jsonval')
        return true
      } else if (node.enum) {
        enforce(Array.isArray(node.enum), 'Invalid enum')
        const condition = safeor(...node.enum.map((value) => compare(name, value)))
        errorIf('!(%s)', [condition], { path: ['enum'] })
        consume('enum', 'array')
        return true
      }
      return false
    }

    const checkGeneric = () => {
      if (node.not || node.not === false) {
        const sub = subrule(current, node.not, subPath('not'))
        errorIf('%s', [sub], { path: ['not'] })
        consume('not', 'object', 'boolean')
      }

      const thenOrElse = node.then || node.then === false || node.else || node.else === false
      if ((node.if || node.if === false) && thenOrElse) {
        const sub = subrule(current, node.if, subPath('if'))
        fun.write('if (!%s) {', sub)
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

      if (node.allOf !== undefined) {
        enforce(Array.isArray(node.allOf), 'Invalid allOf')
        node.allOf.forEach((sch, key) => rule(current, sch, subPath('allOf', key)))
        consume('allOf', 'array')
      }

      if (node.anyOf !== undefined) {
        enforce(Array.isArray(node.anyOf), 'Invalid anyOf')
        for (const sch of node.anyOf) fun.write('if (!%s) {', subrule(current, sch, schemaPath))
        error({ path: ['anyOf'] })
        node.anyOf.forEach(() => fun.write('}'))
        consume('anyOf', 'array')
      }

      if (node.oneOf !== undefined) {
        enforce(Array.isArray(node.oneOf), 'Invalid oneOf')
        const passes = gensym('passes')
        fun.write('let %s = 0', passes)
        for (const sch of node.oneOf)
          fun.write('if (%s) %s++', subrule(current, sch, schemaPath), passes)
        errorIf('%s !== 1', [passes], { path: ['oneOf'] })
        consume('oneOf', 'array')
      }
    }

    const typeWrap = (checkBlock, validTypes, queryType) => {
      const [funSize, unusedSize] = [fun.size(), unused.size]
      const alwaysValidType = typeArray && typeArray.every((type) => validTypes.includes(type))
      maybeWrap(!alwaysValidType, 'if (%s) {', [queryType], '}', checkBlock)
      // enforce check that non-applicable blocks are empty and no rules were applied
      if (funSize !== fun.size() || unusedSize !== unused.size)
        enforce(typeApplicable(...validTypes), `Unexpected rules in type`, node.type)
    }

    /* Actual post-$ref validation happens here */

    const needTypeValidation = typeArray !== null
    if (needTypeValidation) {
      const typeValidate = safeor(...typeArray.map((t) => types.get(t)(name)))
      errorIf('!(%s)', [typeValidate], { path: ['type'] })
    }
    if (node.type !== undefined) consume('type', 'string', 'array')

    // If type validation was needed and did not return early, wrap this inside an else clause.
    maybeWrap(needTypeValidation && allErrors, 'else {', [], '}', () => {
      if (prev !== null) fun.write('let %s = errors', prev)
      if (checkConst()) {
        // const/enum shouldn't have any other validation rules except for already checked type/$ref
        enforce(unused.size === 0, 'Unexpected keywords mixed with const or enum:', [...unused])
        return
      }
      typeWrap(checkNumbers, ['number', 'integer'], types.get('number')(name))
      typeWrap(checkStrings, ['string'], types.get('string')(name))
      typeWrap(checkArrays, ['array'], types.get('array')(name))
      typeWrap(checkObjects, ['object'], types.get('object')(name))
      checkGeneric()
    })

    finish()
  }

  visit(optAllErrors, optIncludeErrors, [], { name: safe('data') }, schema, [])

  fun.write('return errors === 0')
  fun.write('}')

  if (dryRun) return

  const validate = fun.makeFunction(scope)
  validate.toModule = () => fun.makeModule(scope)
  validate.toJSON = () => schema
  return validate
}

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
    const message = validate.errors
      ? validate.errors.map((err) => `${err.schemaPath} ${err.message}`).join('\n')
      : ''
    const error = new Error(`JSON validation error${message ? `: ${message}` : ''}`)
    error.errors = validate.errors
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
