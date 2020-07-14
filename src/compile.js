'use strict'

const { format, safe, safeand, safeor, safenot } = require('./safe-format')
const genfun = require('./generate-function')
const { resolveReference, joinPath } = require('./pointer')
const formats = require('./formats')
const functions = require('./scope-functions')
const { scopeMethods } = require('./scope-utils')
const { buildName, types, jsHelpers } = require('./javascript')
const { knownKeywords, schemaVersions, knownVocabularies } = require('./known-keywords')
const { initTracing, andDelta, orDelta, applyDelta, isDynamic, inProperties } = require('./tracing')

const noopRegExps = new Set(['^[\\s\\S]*$', '^[\\S\\s]*$', '^[^]*$', '', '.*', '^', '$'])

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

// Helper methods for semi-structured paths
const propvar = (parent, keyname, inKeys = false, number = false) =>
  Object.freeze({ parent, keyname, inKeys, number }) // property by variable
const propimm = (parent, keyval, checked = false) => Object.freeze({ parent, keyval, checked }) // property by immediate value

const evaluatedStatic = Symbol('evaluatedStatic')
const optDynamic = Symbol('optDynamic')

const rootMeta = new WeakMap()
const compileSchema = (schema, root, opts, scope, basePathRoot) => {
  const {
    mode = 'default',
    useDefaults = false,
    removeAdditional = false, // supports additionalProperties: false and additionalItems: false
    includeErrors = false,
    allErrors = false,
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
  if (!includeErrors && allErrors) throw new Error('allErrors requires includeErrors to be enabled')

  const { gensym, getref, genref, genformat } = scopeMethods(scope)

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

    // Be very careful while refactoring, this code significantly affects includeErrors performance
    // It attempts to construct fast code presentation for paths, e.g. "#/abc/"+pointerPart(key0)+"/items/"+i0
    const stringParts = ['#']
    const stringJoined = () => {
      const value = stringParts.map(functions.pointerPart).join('/')
      stringParts.length = 0
      return value
    }
    let res = null
    for (const { keyname, keyval, number } of path) {
      if (keyname) {
        if (!number) scope.pointerPart = functions.pointerPart
        const value = number ? keyname : format('pointerPart(%s)', keyname)
        const str = `${stringJoined()}/`
        res = res ? format('%s+%j+%s', res, str, value) : format('%j+%s', str, value)
      } else if (keyval) stringParts.push(keyval)
    }
    return stringParts.length > 0 ? format('%s+%j', res, `/${stringJoined()}`) : res
  }

  const funname = genref(schema)
  let validate = null // resolve cyclic dependencies
  const wrap = (...args) => {
    const res = validate(...args)
    wrap.errors = validate.errors
    return res
  }
  scope[funname] = wrap

  const fun = genfun()
  fun.write('function validate(data, recursive) {')
  if (includeErrors) fun.write('validate.errors = null')
  if (allErrors) fun.write('let errorCount = 0')
  if (opts[optDynamic]) fun.write('validate.evaluatedDynamic = null')

  const helpers = jsHelpers(fun, scope, propvar, { unmodifiedPrototypes, isJSON }, noopRegExps)
  const { present, forObjectKeys, forArray, patternTest, compare } = helpers

  const recursiveAnchor = schema && schema.$recursiveAnchor === true
  const getMeta = () => rootMeta.get(root) || {}
  const basePathStack = basePathRoot ? [basePathRoot] : []
  const visit = (errors, history, current, node, schemaPath, trace = {}) => {
    // e.g. top-level data and property names, OR already checked by present() in history, OR in keys and not undefined
    const isSub = history.length > 0 && history[history.length - 1].prop === current
    const queryCurrent = () => history.filter((h) => h.prop === current)
    const definitelyPresent =
      !current.parent || current.checked || (current.inKeys && isJSON) || queryCurrent().length > 0

    const name = buildName(current)
    const currPropImm = (...args) => propimm(current, ...args)

    const error = ({ path = [], prop = current, source, suberr }) => {
      const schemaP = functions.toPointer([...schemaPath, ...path])
      const dataP = includeErrors ? buildPath(prop) : null
      if (includeErrors === true && errors && source) {
        // we can include absoluteKeywordLocation later, perhaps
        scope.errorMerge = functions.errorMerge
        const args = [source, schemaP, dataP]
        if (allErrors) {
          fun.write('if (validate.errors === null) validate.errors = []')
          fun.write('validate.errors.push(...%s.map(e => errorMerge(e, %j, %s)))', ...args)
        } else {
          fun.write('validate.errors = [errorMerge(%s[0], %j, %s)]', ...args)
        }
      } else if (includeErrors === true && errors) {
        const errorJS = format('{ keywordLocation: %j, instanceLocation: %s }', schemaP, dataP)
        if (allErrors) {
          fun.write('if (%s === null) %s = []', errors, errors)
          fun.write('%s.push(%s)', errors, errorJS)
        } else {
          // Array assignment is significantly faster, do not refactor the two branches
          fun.write('%s = [%s]', errors, errorJS)
        }
      }
      if (allErrors) fun.write('errorCount++')
      else fun.write('return false')
      if (suberr) mergeerror(suberr)
    }
    const errorIf = (condition, errorArgs) => {
      if (includeErrors === true && errors) fun.if(condition, () => error(errorArgs))
      else fun.write('if (%s) return false', condition) // fast-track and inline for more readable code
    }

    const fail = (msg, value) => {
      const comment = value !== undefined ? ` ${JSON.stringify(value)}` : ''
      throw new Error(`${msg}${comment} at ${functions.toPointer(schemaPath)}`)
    }
    const enforce = (ok, ...args) => ok || fail(...args)
    const laxMode = (ok, ...args) => enforce(mode === 'lax' || ok, ...args)
    const enforceMinMax = (a, b) => laxMode(!(node[b] < node[a]), `Invalid ${a} / ${b} combination`)
    const enforceValidation = (msg, suffix = 'must be specified') =>
      enforce(!requireValidation, `[requireValidation] ${msg} ${suffix}`)
    const subPath = (...args) => [...schemaPath, ...args]

    // evaluated tracing
    const stat = initTracing()
    const evaluateDelta = (delta) => applyDelta(stat, delta)

    if (typeof node === 'boolean') {
      if (node === true) {
        // any is valid
        enforceValidation('schema = true', 'is not allowed')
        return { stat } // nothing is evaluated for true
      } else if (definitelyPresent) {
        // node === false always fails in this case
        error({})
      } else {
        // node === false
        errorIf(present(current), {})
      }
      evaluateDelta({ properties: [true], items: Infinity, type: [] }) // everything is evaluated for false
      return { stat }
    }

    enforce(node && Object.getPrototypeOf(node) === Object.prototype, 'Schema is not an object')
    for (const key of Object.keys(node))
      enforce(knownKeywords.includes(key) || allowUnusedKeywords, 'Keyword not supported:', key)

    if (Object.keys(node).length === 0) {
      enforceValidation('empty rules node', 'encountered')
      return { stat } // nothing to validate here, basically the same as node === true
    }

    const unused = new Set(Object.keys(node))
    const consume = (prop, ...ruleTypes) => {
      enforce(unused.has(prop), 'Unexpected double consumption:', prop)
      enforce(functions.hasOwn(node, prop), 'Is not an own property:', prop)
      enforce(ruleTypes.every((t) => schemaTypes.has(t)), 'Invalid type used in consume')
      enforce(ruleTypes.some((t) => schemaTypes.get(t)(node[prop])), 'Unexpected type for', prop)
      unused.delete(prop)
    }
    const get = (prop, ...ruleTypes) => {
      if (node[prop] !== undefined) consume(prop, ...ruleTypes)
      return node[prop]
    }
    const handle = (prop, ruleTypes, handler, errorArgs = {}) => {
      if (node[prop] === undefined) return false
      // opt-out on null is explicit in both places here, don't set default
      consume(prop, ...ruleTypes)
      if (handler !== null) {
        const condition = handler(node[prop])
        if (condition !== null) errorIf(condition, { path: [prop], ...errorArgs })
      }
      return true
    }

    const finish = (local) => {
      if (!definitelyPresent) fun.write('}') // undefined check
      enforce(unused.size === 0 || allowUnusedKeywords, 'Unprocessed keywords:', [...unused])
      return { stat, local } // return statically evaluated
    }

    if (node === root) {
      const $schema = get('$schema', 'string') || $schemaDefault
      if ($schema) {
        const version = $schema.replace(/^http:\/\//, 'https://').replace(/#$/, '')
        enforce(schemaVersions.includes(version), 'Unexpected schema version:', version)
        const schemaIsOlderThan = (ver) =>
          schemaVersions.indexOf(version) >
          schemaVersions.indexOf(`https://json-schema.org/${ver}/schema`)
        rootMeta.set(root, {
          exclusiveRefs: schemaIsOlderThan('draft/2019-09'),
        })
      }
      handle('$vocabulary', ['object'], ($vocabulary) => {
        for (const [vocab, flag] of Object.entries($vocabulary)) {
          if (flag === false) continue
          enforce(flag === true && knownVocabularies.includes(vocab), 'Unknown vocabulary:', vocab)
        }
        return null
      })
    }

    if (node === schema && recursiveAnchor) handle('$recursiveAnchor', ['boolean'], null) // already applied

    handle('description', ['string'], null) // unused, meta-only
    handle('title', ['string'], null) // unused, meta-only
    handle('$comment', ['string'], null) // unused, meta-only
    handle('examples', ['array'], null) // unused, meta-only

    handle('$defs', ['object'], null) || handle('definitions', ['object'], null) // defs are allowed, those are validated on usage

    const basePath = () => (basePathStack.length > 0 ? basePathStack[basePathStack.length - 1] : '')
    const setId = ($id) => {
      basePathStack.push(joinPath(basePath(), $id))
      return null
    }
    handle('$id', ['string'], setId) || handle('id', ['string'], setId)
    handle('$anchor', ['string'], null) // $anchor is used only for ref resolution, on usage

    if (node.default !== undefined && useDefaults) {
      if (definitelyPresent) fail('Can not apply default value here (e.g. at root)')
      fun.write('if (%s) {', safenot(present(current)))
      fun.write('%s = %j', name, get('default', 'jsonval'))
      fun.write('} else {')
    } else {
      handle('default', ['jsonval'], null) // unused
      if (!definitelyPresent) fun.write('if (%s) {', present(current))
    }

    // evaluated: declare dynamic
    const needUnevaluated = (rule) =>
      opts[optDynamic] && (node[rule] || node[rule] === false || node === schema)
    const local = Object.freeze({
      items: needUnevaluated('unevaluatedItems') ? gensym('evaluatedItems') : null,
      properties: needUnevaluated('unevaluatedProperties') ? gensym('evaluatedProps') : null,
      patterns: needUnevaluated('unevaluatedProperties') ? gensym('evaluatedPatterns') : null,
    })
    if (local.items) fun.write('const %s = [0]', local.items)
    if (local.properties) fun.write('const %s = [], %s = []', local.properties, local.patterns)
    const dyn = Object.freeze({
      items: local.items || trace.items,
      properties: local.properties || trace.properties,
      patterns: local.patterns || trace.patterns,
    })
    const canSkipDynamic = () =>
      (!dyn.items || stat.items === Infinity) &&
      ((!dyn.properties && !dyn.patterns) || stat.properties.includes(true))
    const evaluateDeltaDynamic = (delta) => {
      // Skips applying those that have already been proved statically
      if (dyn.items && delta.items > stat.items) fun.write('%s.push(%d)', dyn.items, delta.items)
      const inStat = (properties, patterns) => inProperties(stat, { properties, patterns })
      const properties = delta.properties.filter((x) => !inStat([x], []))
      const patterns = delta.patterns.filter((x) => !inStat([], [x]))
      if (dyn.properties && properties.length > 0) {
        if (properties.includes(true)) fun.write('%s.push(true)', dyn.properties)
        else fun.write('%s.push(...%j)', dyn.properties, properties)
      }
      if (dyn.patterns && patterns.length > 0 && !properties.includes(true))
        fun.write('%s.push(...%s)', dyn.patterns, patterns)
    }

    const applyRef = (n, errorArgs) => {
      // Allow recursion to here only if $recursiveAnchor is true, else skip from deep recursion
      const recursive = recursiveAnchor ? format('recursive || validate') : format('recursive')
      const res = gensym('res')
      if (includeErrors || !canSkipDynamic()) {
        const err = gensym('err') // Save and restore errors in case of recursion (if needed)
        const suberr = gensym('suberr')
        if (includeErrors) fun.write('const %s = validate.errors', err)
        fun.write('const %s = %s(%s, %s)', res, n, name, recursive)
        if (includeErrors) fun.write('const %s = %s.errors', suberr, n)
        if (includeErrors) fun.write('validate.errors = %s', err)
        errorIf(safenot(res), { ...errorArgs, source: suberr })
      } else {
        errorIf(format('!%s(%s, %s)', n, name, recursive), errorArgs)
      }
      // evaluated: propagate static from ref to current, skips cyclic
      const delta = (scope[n] && scope[n][evaluatedStatic]) || { unknown: true } // assume unknown if ref is cyclic
      evaluateDelta(delta)
      // evaluated: propagate dynamic from ref to current
      fun.if(res, () => {
        if (dyn.items && isDynamic(stat).items && isDynamic(delta).items)
          fun.write('%s.push(...%s.evaluatedDynamic[0])', dyn.items, n)
        if (isDynamic(stat).properties && isDynamic(delta).properties) {
          if (dyn.properties) fun.write('%s.push(...%s.evaluatedDynamic[1])', dyn.properties, n)
          if (dyn.patterns) fun.write('%s.push(...%s.evaluatedDynamic[2])', dyn.patterns, n)
        }
      })
    }
    handle('$ref', ['string'], ($ref) => {
      const resolved = resolveReference(root, schemas, node.$ref, basePath())
      const [sub, subRoot, path] = resolved[0] || []
      if (!sub && sub !== false) fail('failed to resolve $ref:', node.$ref)
      const n = getref(sub) || compileSchema(sub, subRoot, opts, scope, path)
      applyRef(n, { path: ['$ref'] })
      return null
    })
    if (node.$ref && getMeta().exclusiveRefs) {
      enforce(!opts[optDynamic], 'unevaluated* is supported only on draft2019-09 schemas and above')
      return finish() // ref overrides any sibling keywords for older schemas
    }
    handle('$recursiveRef', ['string'], ($recursiveRef) => {
      enforce($recursiveRef === '#', 'Behavior of $recursiveRef is defined only for "#"')
      // Apply deep recursion from here only if $recursiveAnchor is true, else just run self
      const n = recursiveAnchor ? format('(recursive || validate)') : format('validate')
      applyRef(n, { path: ['$recursiveRef'] })
      return null
    })

    /* Preparation and methods, post-$ref validation will begin at the end of the function */

    const typeArray =
      node.type === undefined ? null : Array.isArray(node.type) ? node.type : [node.type]
    for (const t of typeArray || [])
      enforce(typeof t === 'string' && types.has(t), 'Unknown type:', t)

    // This is used for typechecks, null means * here
    const allIn = (arr, valid) => {
      /* c8 ignore next */
      if (!Array.isArray(valid) || valid.length === 0) throw new Error('Unreachable')
      return arr && arr.every((s) => valid.includes(s)) // all arr entries are in valid
    }
    const someIn = (arr, possible) => {
      /* c8 ignore next */
      if (!Array.isArray(possible) || possible.length === 0) throw new Error('Unreachable')
      return arr === null || arr.some((x) => possible.includes(x)) // at least one arr entry is in possible
    }

    const parentCheckedType = (...valid) => queryCurrent().some((h) => allIn(h.stat.type, valid))
    const definitelyType = (...valid) => allIn(stat.type, valid) || parentCheckedType(...valid)
    const typeApplicable = (...possible) =>
      someIn(stat.type, possible) && queryCurrent().every((h) => someIn(h.stat.type, possible))

    const enforceRegex = (source, target = node) => {
      enforce(typeof source === 'string', 'Invalid pattern:', source)
      if (requireValidation || requireStringValidation)
        enforce(/^\^.*\$$/.test(source), 'Should start with ^ and end with $:', source)
      if (complexityChecks && ((source.match(/[{+*]/g) || []).length > 1 || /\)[{+*]/.test(source)))
        enforce(target.maxLength !== undefined, 'maxLength should be specified for:', source)
    }

    // Those checks will need to be skipped if another error is set in this block before those ones
    const haveComplex = node.uniqueItems || node.pattern || node.patternProperties || node.format
    const prev = allErrors && haveComplex ? gensym('prev') : null
    const prevWrap = (shouldWrap, writeBody) => {
      if (prev === null || !shouldWrap) writeBody()
      else fun.if(format('errorCount === %s', prev), writeBody)
    }

    // Can not be used before undefined check above! The one performed by present()
    const rule = (...args) => visit(errors, [...history, { stat, prop: current }], ...args).stat
    const subrule = (suberr, ...args) => {
      const sub = gensym('sub')
      fun.write('const %s = (() => {', sub)
      if (allErrors) fun.write('let errorCount = 0') // scoped error counter
      const { stat: delta } = visit(suberr, [...history, { stat, prop: current }], ...args)
      if (allErrors) {
        fun.write('return errorCount === 0')
      } else fun.write('return true')
      fun.write('})()')
      return { sub, delta }
    }

    const suberror = () => {
      const suberr = includeErrors && allErrors ? gensym('suberr') : null
      if (suberr) fun.write('let %s = null', suberr)
      return suberr
    }
    const mergeerror = (suberr) => {
      if (!suberr) return
      // suberror can be null e.g. on failed empty contains
      const args = [errors, suberr, errors, suberr, suberr, errors, suberr]
      fun.write('if (%s && %s) { %s.push(...%s) } else if (%s) %s = %s', ...args)
    }

    // Extracted single additional(Items/Properties) rules, for reuse with unevaluated(Items/Properties)
    const additionalItems = (rulePath, limit) => {
      handle(rulePath, ['object', 'boolean'], (ruleValue) => {
        if (ruleValue === false) {
          if (!removeAdditional) return format('%s.length > %s', name, limit)
          fun.write('if (%s.length > %s) %s.length = %s', name, limit, name, limit)
          return null
        }
        forArray(current, limit, (prop) => rule(prop, ruleValue, subPath(rulePath)))
        return null
      })
      evaluateDelta({ items: Infinity })
    }
    const additionalProperties = (rulePath, condition) => {
      handle(rulePath, ['object', 'boolean'], (ruleValue) => {
        forObjectKeys(current, (sub, key) => {
          fun.if(condition(key), () => {
            if (ruleValue === false && removeAdditional) fun.write('delete %s[%s]', name, key)
            else rule(sub, ruleValue, subPath(rulePath))
          })
        })
        return null
      })
      evaluateDelta({ properties: [true] })
    }
    const additionalCondition = (key, properties, patternProperties) =>
      safeand(
        ...[...new Set(properties)].map((p) => format('%s !== %j', key, p)),
        ...[...new Set(patternProperties)].map((p) => safenot(patternTest(p, key)))
      )

    /* Checks inside blocks are independent, they are happening on the same code depth */

    const checkNumbers = () => {
      const minMax = (value, operator) => format('!(%d %c %s)', value, operator, name) // don't remove negation, accounts for NaN

      if (Number.isFinite(node.exclusiveMinimum)) {
        handle('exclusiveMinimum', ['finite'], (min) => minMax(min, '<'))
      } else {
        handle('minimum', ['finite'], (min) => minMax(min, node.exclusiveMinimum ? '<' : '<='))
        handle('exclusiveMinimum', ['boolean'], null) // handled above
      }

      if (Number.isFinite(node.exclusiveMaximum)) {
        handle('exclusiveMaximum', ['finite'], (max) => minMax(max, '>'))
        enforceMinMax('minimum', 'exclusiveMaximum')
        enforceMinMax('exclusiveMinimum', 'exclusiveMaximum')
      } else if (node.maximum !== undefined) {
        handle('maximum', ['finite'], (max) => minMax(max, node.exclusiveMaximum ? '>' : '>='))
        handle('exclusiveMaximum', ['boolean'], null) // handled above
        enforceMinMax('minimum', 'maximum')
        enforceMinMax('exclusiveMinimum', 'maximum')
      }

      const multipleOf = node.multipleOf === undefined ? 'divisibleBy' : 'multipleOf' // draft3 support
      handle(multipleOf, ['finite'], (value) => {
        enforce(value > 0, `Invalid ${multipleOf}:`, value)
        if (Number.isInteger(value)) return format('%s %% %d !== 0', name, value)
        scope.isMultipleOf = functions.isMultipleOf
        const [last, exp] = `${value}`.replace(/.*\./, '').split('e-')
        const e = last.length + (exp ? Number(exp) : 0)
        const args = [name, value, e, Math.round(value * Math.pow(10, e))] // precompute for performance
        return format('!isMultipleOf(%s, %d, 1e%d, %d)', ...args)
      })
    }

    const checkStrings = () => {
      handle('maxLength', ['natural'], (max) => {
        scope.stringLength = functions.stringLength
        return format('%s.length > %d && stringLength(%s) > %d', name, max, name, max)
      })
      handle('minLength', ['natural'], (min) => {
        scope.stringLength = functions.stringLength
        return format('%s.length < %d || stringLength(%s) < %d', name, min, name, min)
      })
      enforceMinMax('minLength', 'maxLength')

      prevWrap(true, () => {
        const checkFormat = (fmtname, target, formatsObj = fmts) => {
          const known = typeof fmtname === 'string' && functions.hasOwn(formatsObj, fmtname)
          enforce(known, 'Unrecognized format used:', fmtname)
          const formatImpl = formatsObj[fmtname]
          const valid = formatImpl instanceof RegExp || typeof formatImpl === 'function'
          enforce(valid, 'Invalid format used:', fmtname)
          const n = genformat(formatImpl)
          if (formatImpl instanceof RegExp) {
            // built-in formats are fine, check only ones from options
            if (functions.hasOwn(optFormats, fmtname)) enforceRegex(formatImpl.source)
            return format('!%s.test(%s)', n, target)
          }
          return format('!%s(%s)', n, target)
        }

        handle('format', ['string'], (value) => {
          evaluateDelta({ fullstring: true })
          return checkFormat(value, name)
        })

        handle('pattern', ['string'], (pattern) => {
          enforceRegex(pattern)
          if (noopRegExps.has(pattern)) return null
          evaluateDelta({ fullstring: true })
          return safenot(patternTest(pattern, name))
        })

        enforce(node.contentSchema !== false, 'contentSchema cannot be set to false')
        if (node.contentEncoding || node.contentMediaType || node.contentSchema) {
          const dec = gensym('dec')
          if (node.contentMediaType) fun.write('let %s = %s', dec, name)

          if (node.contentEncoding === 'base64') {
            errorIf(checkFormat('base64', name, formats.extra), { path: ['contentEncoding'] })
            if (node.contentMediaType) {
              scope.deBase64 = functions.deBase64
              fun.write('try {')
              fun.write('%s = deBase64(%s)', dec, dec)
            }
            consume('contentEncoding', 'string')
          } else enforce(!node.contentEncoding, 'Unknown contentEncoding:', node.contentEncoding)

          let json = false
          if (node.contentMediaType === 'application/json') {
            fun.write('try {')
            fun.write('%s = JSON.parse(%s)', dec, dec)
            json = true
            consume('contentMediaType', 'string')
          } else enforce(!node.contentMediaType, 'Unknown contentMediaType:', node.contentMediaType)

          if (node.contentSchema) {
            enforce(json, 'contentSchema requires contentMediaType application/json')
            const decprop = Object.freeze({ name: dec, errorParent: current })
            rule(decprop, node.contentSchema, subPath('contentSchema')) // TODO: isJSON true for speed?
            consume('contentSchema', 'object', 'array')
            evaluateDelta({ fullstring: true })
          }
          if (node.contentMediaType) {
            fun.write('} catch (e) {')
            error({ path: ['contentMediaType'] })
            fun.write('}')
            if (node.contentEncoding) {
              fun.write('} catch (e) {')
              error({ path: ['contentEncoding'] })
              fun.write('}')
            }
          }
        }
      })
    }

    const checkArrays = () => {
      handle('maxItems', ['natural'], (max) => {
        if (Array.isArray(node.items) && node.items.length > max)
          fail(`Invalid maxItems: ${max} is less than items array length`)
        return format('%s.length > %d', name, max)
      })
      handle('minItems', ['natural'], (min) => format('%s.length < %d', name, min)) // can be higher that .items length with additionalItems
      enforceMinMax('minItems', 'maxItems')

      handle('items', ['object', 'array', 'boolean'], (items) => {
        if (Array.isArray(items)) {
          for (let p = 0; p < items.length; p++) rule(currPropImm(p), items[p], subPath(`${p}`))
          evaluateDelta({ items: items.length })
        } else {
          forArray(current, format('0'), (prop) => rule(prop, items, subPath('items')))
          evaluateDelta({ items: Infinity })
        }
        return null
      })

      if (!Array.isArray(node.items)) {
        // additionalItems is allowed, but ignored per some spec tests in this case!
        // We do nothing and let it throw except for in allowUnusedKeywords mode
        // As a result, this is not allowed by default, only in allowUnusedKeywords mode
      } else if (node.additionalItems || node.additionalItems === false) {
        additionalItems('additionalItems', format('%d', node.items.length))
      } else if (node.items.length === node.maxItems) {
        // No additional items are possible
      }

      handle('contains', ['object', 'boolean'], () => {
        const passes = gensym('passes')
        fun.write('let %s = 0', passes)

        const suberr = suberror()
        forArray(current, format('0'), (prop) => {
          const { sub } = subrule(suberr, prop, node.contains, subPath('contains'))
          fun.write('if (%s) %s++', sub, passes)
          // evaluateDelta({ unknown: true }) // draft2020: contains counts towards evaluatedItems
        })

        if (!handle('minContains', ['natural'], (mn) => format('%s < %d', passes, mn), { suberr }))
          errorIf(format('%s < 1', passes), { path: ['contains'], suberr })

        handle('maxContains', ['natural'], (max) => format('%s > %d', passes, max))
        enforceMinMax('minContains', 'maxContains')

        return null
      })

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
        handle('uniqueItems', ['boolean'], (uniqueItems) => {
          if (uniqueItems === false) return null
          if (complexityChecks)
            enforce(uniqueIsSimple(), 'maxItems should be specified for non-primitive uniqueItems')
          scope.unique = functions.unique
          scope.deepEqual = functions.deepEqual
          return format('!unique(%s)', name)
        })
      })
    }

    const checkObjects = () => {
      const propertiesCount = format('Object.keys(%s).length', name)
      handle('maxProperties', ['natural'], (max) => format('%s > %d', propertiesCount, max))
      handle('minProperties', ['natural'], (min) => format('%s < %d', propertiesCount, min))
      enforceMinMax('minProperties', 'maxProperties')

      handle('propertyNames', ['object', 'boolean'], (names) => {
        forObjectKeys(current, (sub, key) => {
          const nameSchema = typeof names === 'object' ? { type: 'string', ...names } : names
          const nameprop = Object.freeze({ name: key, errorParent: sub, type: 'string' })
          rule(nameprop, nameSchema, subPath('propertyNames'))
        })
        return null
      })

      // if allErrors is false, we can skip present check for required properties validated before
      const checked = (p) =>
        !allErrors &&
        (stat.required.includes(p) || queryCurrent().some((h) => h.stat.required.includes(p)))

      handle('required', ['array'], (required) => {
        for (const req of required) {
          if (checked(req)) continue
          const prop = currPropImm(req)
          errorIf(safenot(present(prop)), { path: ['required'], prop })
        }
        evaluateDelta({ required })
        return null
      })

      for (const dependencies of ['dependencies', 'dependentRequired', 'dependentSchemas']) {
        handle(dependencies, ['object'], (value) => {
          for (const key of Object.keys(value)) {
            let deps = value[key]
            if (typeof deps === 'string') deps = [deps]
            const item = currPropImm(key, checked(key))
            if (Array.isArray(deps) && dependencies !== 'dependentSchemas') {
              const clauses = deps.filter((k) => !checked(k)).map((k) => present(currPropImm(k)))
              const condition = safenot(safeand(...clauses))
              const errorArgs = { path: [dependencies, key] }
              if (clauses.length === 0) {
                // nothing to do
              } else if (item.checked) {
                errorIf(condition, errorArgs)
                evaluateDelta({ required: deps })
              } else {
                errorIf(safeand(present(item), condition), errorArgs)
              }
            } else if (
              ((typeof deps === 'object' && !Array.isArray(deps)) || typeof deps === 'boolean') &&
              dependencies !== 'dependentRequired'
            ) {
              const body = () => {
                const delta = rule(current, deps, subPath(dependencies, key), dyn)
                evaluateDelta(orDelta({}, delta))
                evaluateDeltaDynamic(delta)
              }
              if (item.checked) body()
              else fun.if(present(item), body)
            } else fail(`Unexpected ${dependencies} entry`)
          }
          return null
        })
      }

      handle('properties', ['object'], (properties) => {
        for (const p of Object.keys(properties))
          rule(currPropImm(p, checked(p)), properties[p], subPath('properties', p))
        evaluateDelta({ properties: Object.keys(properties || {}) })
        return null
      })

      prevWrap(node.patternProperties, () => {
        handle('patternProperties', ['object'], (patternProperties) => {
          forObjectKeys(current, (sub, key) => {
            for (const p of Object.keys(patternProperties)) {
              enforceRegex(p, node.propertyNames || {})
              fun.if(patternTest(p, key), () => {
                rule(sub, patternProperties[p], subPath('patternProperties', p))
              })
            }
          })
          evaluateDelta({ patterns: Object.keys(patternProperties || {}) })
          return null
        })
        if (node.additionalProperties || node.additionalProperties === false) {
          const properties = Object.keys(node.properties || {})
          const patternProperties = Object.keys(node.patternProperties || {})
          const condition = (key) => additionalCondition(key, properties, patternProperties)
          additionalProperties('additionalProperties', condition)
        }
      })
    }

    const checkConst = () => {
      if (handle('const', ['jsonval'], (val) => safenot(compare(name, val)))) return true
      return handle('enum', ['array'], (vals) => {
        const objects = vals.filter((value) => value && typeof value === 'object')
        const primitive = vals.filter((value) => !(value && typeof value === 'object'))
        return safenot(safeor(...[...primitive, ...objects].map((value) => compare(name, value))))
      })
    }

    const checkGeneric = () => {
      handle('not', ['object', 'boolean'], (not) => subrule(null, current, not, subPath('not')).sub)

      const thenOrElse = node.then || node.then === false || node.else || node.else === false
      if ((node.if || node.if === false) && thenOrElse) {
        const { sub, delta: deltaIf } = subrule(null, current, node.if, subPath('if'), dyn)
        let deltaElse, deltaThen
        fun.write('if (%s) {', safenot(sub))
        if (node.else || node.else === false) {
          deltaElse = rule(current, node.else, subPath('else'), dyn)
          evaluateDeltaDynamic(deltaElse)
          consume('else', 'object', 'boolean')
        } else deltaElse = {}
        if (node.then || node.then === false) {
          fun.write('} else {')
          deltaThen = rule(current, node.then, subPath('then'), dyn)
          evaluateDeltaDynamic(andDelta(deltaIf, deltaThen))
          consume('then', 'object', 'boolean')
        } else deltaThen = {}
        fun.write('}')
        evaluateDelta(orDelta(deltaElse, andDelta(deltaIf, deltaThen)))
        consume('if', 'object', 'boolean')
      }

      handle('allOf', ['array'], (allOf) => {
        for (const [key, sch] of Object.entries(allOf))
          evaluateDelta(rule(current, sch, subPath('allOf', key), dyn))
        return null
      })

      handle('anyOf', ['array'], (anyOf) => {
        const suberr = suberror()
        if (anyOf.length > 0 && !canSkipDynamic()) {
          // In this case, all have to be checked to gather evaluated properties
          const entries = Object.entries(anyOf).map(([key, sch]) =>
            subrule(suberr, current, sch, subPath('anyOf', key), dyn)
          )
          evaluateDelta(entries.reduce((acc, cur) => orDelta(acc, cur.delta), {}))
          const condition = safenot(safeor(...entries.map(({ sub }) => sub)))
          errorIf(condition, { path: ['anyOf'], suberr })
          for (const { delta, sub } of entries) fun.if(sub, () => evaluateDeltaDynamic(delta))
          return null
        }
        let delta
        for (const [key, sch] of Object.entries(anyOf)) {
          const { sub, delta: deltaVariant } = subrule(suberr, current, sch, subPath('anyOf', key))
          fun.write('if (%s) {', safenot(sub))
          delta = delta ? orDelta(delta, deltaVariant) : deltaVariant
        }
        if (anyOf.length > 0) evaluateDelta(delta)
        error({ path: ['anyOf'], suberr })
        anyOf.forEach(() => fun.write('}'))
        return null
      })

      handle('oneOf', ['array'], (oneOf) => {
        const passes = gensym('passes')
        fun.write('let %s = 0', passes)
        const suberr = suberror()
        let delta
        let i = 0
        const entries = Object.entries(oneOf).map(([key, sch]) => {
          if (!includeErrors && i++ > 1) errorIf(format('%s > 1', passes), { path: ['oneOf'] })
          const entry = subrule(suberr, current, sch, subPath('oneOf', key), dyn)
          fun.write('if (%s) %s++', entry.sub, passes)
          delta = delta ? orDelta(delta, entry.delta) : entry.delta
          return entry
        })
        if (oneOf.length > 0) evaluateDelta(delta)
        errorIf(format('%s !== 1', passes), { path: ['oneOf'] })
        fun.if(format('%s === 0', passes), () => mergeerror(suberr)) // if none matched, dump all errors
        for (const entry of entries) fun.if(entry.sub, () => evaluateDeltaDynamic(entry.delta))
        return null
      })
    }

    const typeWrap = (checkBlock, validTypes, queryType) => {
      const [funSize, unusedSize] = [fun.size(), unused.size]
      if (definitelyType(...validTypes)) checkBlock()
      else fun.if(queryType, checkBlock)
      // enforce check that non-applicable blocks are empty and no rules were applied
      if (funSize !== fun.size() || unusedSize !== unused.size)
        enforce(typeApplicable(...validTypes), `Unexpected rules in type`, node.type)
    }

    // Unevaluated validation
    const checkArraysFinal = () => {
      if (stat.items === Infinity) {
        // Everything is statically evaluated, so this check is unreachable. Allow only 'false' rule here.
        if (node.unevaluatedItems === false) consume('unevaluatedItems', 'boolean')
      } else if (node.unevaluatedItems || node.unevaluatedItems === false) {
        if (isDynamic(stat).items) {
          if (!opts[optDynamic]) throw new Error('Dynamic unevaluated tracing is not enabled')
          additionalItems('unevaluatedItems', format('Math.max(%d, ...%s)', stat.items, dyn.items))
        } else {
          additionalItems('unevaluatedItems', format('%d', stat.items))
        }
      }
    }
    const checkObjectsFinal = () => {
      prevWrap(node.patternProperties, () => {
        if (stat.properties.includes(true)) {
          // Everything is statically evaluated, so this check is unreachable. Allow only 'false' rule here.
          if (node.unevaluatedProperties === false) consume('unevaluatedProperties', 'boolean')
        } else if (node.unevaluatedProperties || node.unevaluatedProperties === false) {
          const sawStatic = (key) => additionalCondition(key, stat.properties, stat.patterns)
          if (isDynamic(stat).properties) {
            if (!opts[optDynamic]) throw new Error('Dynamic unevaluated tracing is not enabled')
            scope.propertyIn = functions.propertyIn
            const condition = (key) => {
              const args = [sawStatic(key), key, dyn.properties, dyn.patterns]
              return format('%s && !propertyIn(%s, %s, %s)', ...args)
            }
            additionalProperties('unevaluatedProperties', condition)
          } else {
            additionalProperties('unevaluatedProperties', sawStatic)
          }
        }
      })
    }

    /* Actual post-$ref validation happens below */

    const performValidation = () => {
      if (prev !== null) fun.write('let %s = errorCount', prev)
      if (checkConst()) {
        // const/enum shouldn't have any other validation rules except for already checked type/$ref
        enforce(unused.size === 0, 'Unexpected keywords mixed with const or enum:', [...unused])
        const typeKeys = [...types.keys()] // we don't extract type from const/enum, it's enough that we know that it's present
        evaluateDelta({ properties: [true], items: Infinity, type: typeKeys, fullstring: true }) // everything is evaluated for const
        return
      }

      typeWrap(checkNumbers, ['number', 'integer'], types.get('number')(name))
      typeWrap(checkStrings, ['string'], types.get('string')(name))
      typeWrap(checkArrays, ['array'], types.get('array')(name))
      typeWrap(checkObjects, ['object'], types.get('object')(name))
      checkGeneric()

      // evaluated: apply static + dynamic
      typeWrap(checkArraysFinal, ['array'], types.get('array')(name))
      typeWrap(checkObjectsFinal, ['object'], types.get('object')(name))

      // evaluated: propagate dynamic to parent dynamic (aka trace)
      if (isDynamic(stat).items && trace.items && local.items)
        fun.write('%s.push(...%s)', trace.items, local.items)
      if (isDynamic(stat).properties) {
        if (trace.properties && local.properties)
          fun.write('%s.push(...%s)', trace.properties, local.properties)
        if (trace.patterns && local.patterns)
          fun.write('%s.push(...%s)', trace.patterns, local.patterns)
      }
      // evaluated: static to parent is merged via return value
    }

    const typeExact = (type) => typeArray && typeArray.length === 1 && typeArray[0] === type
    if (current.type)
      enforce(typeExact(current.type), 'Only one type is allowed here:', current.type)
    const needTypeValidate = !current.type && typeArray !== null && !parentCheckedType(...typeArray)
    if (needTypeValidate) {
      const filteredTypes = typeArray.filter((t) => typeApplicable(t))
      if (filteredTypes.length === 0) fail('No valid types possible')
      const typeInvalid = safenot(safeor(...filteredTypes.map((t) => types.get(t)(name))))
      errorIf(typeInvalid, { path: ['type'] })
    }
    evaluateDelta({ type: typeArray })
    if (node.type !== undefined) consume('type', 'string', 'array')

    // If type validation was needed and did not return early, wrap this inside an else clause.
    if (needTypeValidate && allErrors) fun.block('else {', [], '}', performValidation)
    else performValidation()

    if (!isSub) {
      if (!stat.type) enforceValidation('type')
      if (typeApplicable('array') && stat.items !== Infinity)
        enforceValidation(node.items ? 'additionalItems or unevaluatedItems' : 'items rule')
      if (typeApplicable('object') && !stat.properties.includes(true))
        enforceValidation('additionalProperties or unevaluatedProperties')
      if (typeof node.propertyNames !== 'object')
        for (const sub of ['additionalProperties', 'unevaluatedProperties'])
          if (node[sub]) enforceValidation(`wild-card ${sub}`, 'requires propertyNames')
      if (!stat.fullstring && requireStringValidation) {
        const stringWarning = 'pattern, format or contentSchema must be specified for strings'
        fail(`[requireStringValidation] ${stringWarning}, use pattern: ^[\\s\\S]*$ to opt-out`)
      }
    } else {
      const n0 = schemaPath[schemaPath.length - 1]
      const n1 = schemaPath[schemaPath.length - 2]
      const allowed0 = ['not', 'if', 'then', 'else']
      const allowed1 = ['oneOf', 'anyOf', 'allOf', 'dependencies', 'dependentSchemas']
      // Sanity check, unreachable, double-check that we came from expected path
      enforce(allowed0.includes(n0) || allowed1.includes(n1), 'Unexpected')
    }

    return finish(local)
  }

  const { stat, local } = visit(format('validate.errors'), [], { name: safe('data') }, schema, [])

  // evaluated: return dynamic for refs
  if (opts[optDynamic] && (isDynamic(stat).items || isDynamic(stat).properties)) {
    if (!local) throw new Error('Failed to trace dynamic properties') // Unreachable
    const args = [local.items, local.properties, local.patterns]
    fun.write('validate.evaluatedDynamic = [%s, %s, %s]', ...args)
  }

  if (allErrors) {
    fun.write('return errorCount === 0')
  } else fun.write('return true')
  fun.write('}')

  if (dryRun) return

  validate = fun.makeFunction(scope)
  validate[evaluatedStatic] = stat
  delete scope[funname] // more logical key order
  scope[funname] = validate
  return funname
}

const compile = (schema, opts) => {
  try {
    const scope = Object.create(null)
    return { scope, ref: compileSchema(schema, schema, opts, scope) }
  } catch (e) {
    // For performance, we try to build the schema without dynamic tracing first, then re-run with
    // it enabled if needed. Enabling it without need can give up to about 40% performance drop.
    if (e.message === 'Dynamic unevaluated tracing is not enabled') {
      const scope = Object.create(null)
      return { scope, ref: compileSchema(schema, schema, { ...opts, [optDynamic]: true }, scope) }
    }
    throw e
  }
}

module.exports = { compile }
