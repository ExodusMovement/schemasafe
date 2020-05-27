const jaystring = require('jaystring')
const genfun = require('./generate-function')
const jsonpointer = require('jsonpointer')
const formats = require('./formats')
const KNOWN_KEYWORDS = require('./known-keywords')

// name is assumed to be already processed and can contain complex paths
const genobj = (name, property) => {
  if (!['string', 'number'].includes(typeof property)) throw new Error('Invalid property path')
  return `${name}[${JSON.stringify(property)}]`
}

const get = function(obj, additionalSchemas, ptr) {
  const visit = function(sub) {
    if (sub && sub.id === ptr) return sub
    if (typeof sub !== 'object' || !sub) return null
    return Object.keys(sub).reduce(function(res, k) {
      return res || visit(sub[k])
    }, null)
  }

  const res = visit(obj)
  if (res) return res

  ptr = ptr.replace(/^#/, '')
  ptr = ptr.replace(/\/$/, '')

  try {
    return jsonpointer.get(obj, decodeURI(ptr))
  } catch (err) {
    const end = ptr.indexOf('#')
    let other
    // external reference
    if (end !== 0) {
      // fragment doesn't exist.
      if (end === -1) {
        other = additionalSchemas[ptr]
      } else {
        const ext = ptr.slice(0, end)
        other = additionalSchemas[ext]
        const fragment = ptr.slice(end).replace(/^#/, '')
        try {
          return jsonpointer.get(other, fragment)
        } catch (err) {
          // do nothing
        }
      }
    } else {
      other = additionalSchemas[ptr]
    }
    return other || null
  }
}

const formatName = function(field) {
  field = JSON.stringify(field)
  // Commented out code from original vanilla version because it allows a code execution
  // exploit from a maliciously crafted schema.
  // var pattern = /\[([^\[\]"]+)\]/
  // while (pattern.test(field)) field = field.replace(pattern, '."+$1+"')
  return field
}

const types = {}
types.any = () => 'true'
types.null = (name) => `${name} === null`
types.boolean = (name) => `typeof ${name} === "boolean"`
types.array = (name) => `Array.isArray(${name})`
types.object = (name) => `typeof ${name} === "object" && ${name} && !Array.isArray(${name})`
types.number = (name) => `typeof ${name} === "number" && isFinite(${name})`
types.integer = (name) =>
  `typeof ${name} === "number" && (Math.floor(${name}) === ${name} || ${name} > 9007199254740992 || ${name} < -9007199254740992)`
types.string = (name) => `typeof ${name} === "string"`

const unique = function(array) {
  const list = []
  for (let i = 0; i < array.length; i++) {
    list.push(typeof array[i] === 'object' ? JSON.stringify(array[i]) : array[i])
  }
  for (let i = 1; i < list.length; i++) {
    if (list.indexOf(list[i]) !== i) return false
  }
  return true
}

const isMultipleOf = function(value, multipleOf) {
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

// for correct Unicode code points processing
// https://mathiasbynens.be/notes/javascript-unicode#accounting-for-astral-symbols
const stringLength = (string) => [...string].length

const compile = function(schema, cache, root, reporter, opts) {
  const fmts = opts ? Object.assign({}, formats, opts.formats) : formats
  const scope = Object.create(null)
  const verbose = opts ? !!opts.verbose : false
  const greedy = opts && opts.greedy !== undefined ? opts.greedy : false

  const syms = new Map()
  const gensym = (name) => {
    if (!syms.get(name)) syms.set(name, 0)
    const index = syms.get(name)
    syms.set(name, index + 1)
    return name + index
  }

  const reversePatterns = {}
  const patterns = function(p) {
    if (reversePatterns[p]) return reversePatterns[p]
    const n = gensym('pattern')
    scope[n] = new RegExp(p)
    reversePatterns[p] = n
    return n
  }

  const vars = 'ijklmnopqrstuvxyz'.split('')
  const genloop = function() {
    const v = vars.shift()
    vars.push(v + v[0])
    return v
  }

  const fun = genfun()
  fun.write('function validate(data) {')
  // Since undefined is not a valid JSON value, we coerce to null and other checks will catch this
  fun.write('if (data === undefined) data = null')
  fun.write('validate.errors = null')
  fun.write('var errors = 0')

  const visit = function(name, node, reporter, filter, schemaPath) {
    if (node.constructor.toString() === Object.toString()) {
      for (const keyword of Object.keys(node)) {
        if (!KNOWN_KEYWORDS.includes(keyword)) {
          throw new Error(`Keyword not supported: ${keyword}`)
        }
      }
    }

    const unprocessed = new Set(Object.keys(node))
    const consume = (property, required = true) => {
      if (required && !unprocessed.has(property))
        throw new Error(`Unexpected double consumption: ${property}`)
      unprocessed.delete(property)
    }

    let properties = node.properties
    let type = node.type
    let tuple = false

    if (type && typeof type !== 'string' && !Array.isArray(type)) {
      // TODO: optionally enforce type being present?
      throw new Error('Unexpected type')
    }
    if (type) consume('type') // checked below after overwrites

    const validateTypeApplicable = (...types) => {
      if (!type) return // no type enforced
      if (typeof type === 'string') {
        if (!types.includes(type))
          throw new Error(`Unexpected field in type=${type}`)
      } else if (Array.isArray(type)) {
        if (!type.some(x => types.includes(x)))
          throw new Error(`Unexpected field in types: ${type.join(', ')}`)
      } else throw new Error('Unexpected type')
    }

    if (Array.isArray(node.items)) {
      // tuple type
      if (type && type !== 'array') throw new Error(`Unexpected type with items: ${type}`)
      type = 'array'
      tuple = true
      properties = { ...node.items }
      consume('items')
    } else if (properties) {
      consume('properties')
    }

    let indent = 0
    const error = function(msg, prop, value) {
      fun.write('errors++')
      if (reporter === true) {
        fun.write('if (validate.errors === null) validate.errors = []')
        if (verbose) {
          fun.write(
            'validate.errors.push({field:%s,message:%s,value:%s,type:%s,schemaPath:%s})',
            formatName(prop || name),
            JSON.stringify(msg),
            value || name,
            JSON.stringify(type),
            JSON.stringify(schemaPath)
          )
        } else {
          fun.write(
            'validate.errors.push({field:%s,message:%s})',
            formatName(prop || name),
            JSON.stringify(msg)
          )
        }
      }
    }

    if (node.default !== undefined) {
      indent++
      fun.write('if (%s === undefined) {', name)
      fun.write('%s = %s', name, jaystring(node.default))
      fun.write('} else {')
      consume('default')
    }

    if (node.required === true) {
      indent++
      fun.write('if (%s === undefined) {', name)
      error('is required')
      fun.write('} else {')
      consume('required')
    } else {
      indent++
      fun.write('if (%s !== undefined) {', name)
      if (node.required === false) consume('required')
    }

    const valid =
      []
        .concat(type)
        .map(function(t) {
          if (t && !types.hasOwnProperty(t)) {
            throw new Error(`Unknown type: ${t}`)
          }

          return types[t || 'any'](name)
        })
        .join(' || ') || 'true'

    if (valid !== 'true') {
      indent++
      fun.write('if (!(%s)) {', valid)
      error('is the wrong type')
      fun.write('} else {')
    }

    if (tuple) {
      if (node.additionalItems === false) {
        fun.write('if (%s.length > %d) {', name, node.items.length)
        error('has additional items')
        fun.write('}')
        consume('additionalItems')
      } else if (node.additionalItems) {
        const i = genloop()
        fun.write('for (var %s = %d; %s < %s.length; %s++) {', i, node.items.length, i, name, i)
        visit(
          `${name}[${i}]`,
          node.additionalItems,
          reporter,
          filter,
          schemaPath.concat('additionalItems')
        )
        fun.write('}')
        consume('additionalItems')
      }
    } else {
      // WARNING, it's allowed, but ignored per spec tests in this case!
      // TODO: do not allow in strong mode
      consume('additionalItems', false)
    }

    if (node.format && fmts.hasOwnProperty(node.format)) {
      validateTypeApplicable('string')
      if (type !== 'string' && formats[node.format]) fun.write('if (%s) {', types.string(name))
      const format = fmts[node.format]
      if (format instanceof RegExp || typeof format === 'function') {
        const condition = format instanceof RegExp ? '!%s.test(%s)' : '!%s(%s)'
        const n = gensym('format')
        scope[n] = format
        fun.write(`if (${condition}) {`, n, name)
        error(`must be ${node.format} format`)
        fun.write('}')
      } else if (typeof format === 'object') {
        visit(name, format, reporter, filter, schemaPath.concat('format'))
      }

      if (type !== 'string' && formats[node.format]) fun.write('}')
      consume('format')
    } else if (node.format) {
      throw new Error('Unrecognized format used')
    }

    if (Array.isArray(node.required)) {
      const checkRequired = function(req) {
        const prop = genobj(name, req)
        fun.write('if (%s === undefined) {', prop)
        error('is required', prop)
        fun.write('missing++')
        fun.write('}')
      }
      fun.write('if ((%s)) {', type !== 'object' ? types.object(name) : 'true')
      fun.write('var missing = 0')
      node.required.map(checkRequired)
      fun.write('}')
      if (!greedy) {
        fun.write('if (missing === 0) {')
        indent++
      }
      consume('required')
    }

    if (node.uniqueItems === true) {
      validateTypeApplicable('array')
      if (type !== 'array') fun.write('if (%s) {', types.array(name))
      scope.unique = unique
      fun.write('if (!(unique(%s))) {', name)
      error('must be unique')
      fun.write('}')
      if (type !== 'array') fun.write('}')
      consume('uniqueItems')
    } else if (node.uniqueItems === false) {
      consume('uniqueItems')
    }

    if (node.enum) {
      if (!Array.isArray(node.enum)) throw new Error('Invalid enum')

      const complex = node.enum.some(function(e) {
        return typeof e === 'object'
      })

      const compare = complex
        ? function(e) {
            return `JSON.stringify(${name})` + ` !== JSON.stringify(${JSON.stringify(e)})`
          }
        : function(e) {
            return `${name} !== ${JSON.stringify(e)}`
          }

      fun.write('if (%s) {', node.enum.map(compare).join(' && ') || 'false')
      error('must be an enum value')
      fun.write('}')
      consume('enum')
    }

    if (node.dependencies) {
      validateTypeApplicable('object')
      if (type !== 'object') fun.write('if (%s) {', types.object(name))

      for (const key of Object.keys(node.dependencies)) {
        let deps = node.dependencies[key]
        if (typeof deps === 'string') deps = [deps]

        const exists = function(k) {
          return `${genobj(name, k)} !== undefined`
        }

        if (Array.isArray(deps)) {
          fun.write(
            'if (%s !== undefined && !(%s)) {',
            genobj(name, key),
            deps.map(exists).join(' && ') || 'true'
          )
          error('dependencies not set')
          fun.write('}')
        } else if (typeof deps === 'object') {
          fun.write('if (%s !== undefined) {', genobj(name, key))
          visit(name, deps, reporter, filter, schemaPath.concat(['dependencies', key]))
          fun.write('}')
        } else {
          throw new Error('Unexpected dependencies entry')
        }
      }

      if (type !== 'object') fun.write('}')
      consume('dependencies')
    }

    if (node.additionalProperties || node.additionalProperties === false) {
      validateTypeApplicable('object')
      if (type !== 'object') fun.write('if (%s) {', types.object(name))

      const i = genloop()
      const keys = gensym('keys')

      const toCompare = function(p) {
        return `${keys}[${i}] !== ${JSON.stringify(p)}`
      }

      const toTest = function(p) {
        return `!${patterns(p)}.test(${keys}[${i}])`
      }

      const additionalProp =
        Object.keys(properties || {})
          .map(toCompare)
          .concat(Object.keys(node.patternProperties || {}).map(toTest))
          .join(' && ') || 'true'

      fun.write('var %s = Object.keys(%s)', keys, name)
      fun.write('for (var %s = 0; %s < %s.length; %s++) {', i, i, keys, i)
      fun.write('if (%s) {', additionalProp)

      if (node.additionalProperties === false) {
        if (filter) fun.write('delete %s', `${name}[${keys}[${i}]]`)
        error('has additional properties', null, `${JSON.stringify(`${name}.`)} + ${keys}[${i}]`)
      } else {
        visit(
          `${name}[${keys}[${i}]]`,
          node.additionalProperties,
          reporter,
          filter,
          schemaPath.concat(['additionalProperties'])
        )
      }

      fun.write('}')
      fun.write('}')

      if (type !== 'object') fun.write('}')
      consume('additionalProperties')
    }

    if (node.$ref) {
      const sub = get(root, (opts && opts.schemas) || {}, node.$ref)
      if (sub) {
        let fn = cache[node.$ref]
        if (!fn) {
          cache[node.$ref] = function proxy(data) {
            return fn(data)
          }
          fn = compile(sub, cache, root, false, opts)
        }
        const n = gensym('ref')
        scope[n] = fn
        fun.write('if (!(%s(%s))) {', n, name)
        error('referenced schema does not match')
        fun.write('}')
      }
      consume('$ref')
    }

    if (node.not) {
      const prev = gensym('prev')
      fun.write('var %s = errors', prev)
      visit(name, node.not, false, filter, schemaPath.concat('not'))
      fun.write('if (%s === errors) {', prev)
      error('negative schema matches')
      fun.write('} else {')
      fun.write('errors = %s', prev)
      fun.write('}')
      consume('not')
    }

    if (node.items && !tuple) {
      validateTypeApplicable('array')
      if (type !== 'array') fun.write('if (%s) {', types.array(name))

      const i = genloop()
      fun.write('for (var %s = 0; %s < %s.length; %s++) {', i, i, name, i)
      visit(`${name}[${i}]`, node.items, reporter, filter, schemaPath.concat('items'))
      fun.write('}')

      if (type !== 'array') fun.write('}')
      consume('items')
    }

    if (node.patternProperties) {
      validateTypeApplicable('object')
      if (type !== 'object') fun.write('if (%s) {', types.object(name))
      const keys = gensym('keys')
      const i = genloop()
      fun.write('var %s = Object.keys(%s)', keys, name)
      fun.write('for (var %s = 0; %s < %s.length; %s++) {', i, i, keys, i)

      for (const key of Object.keys(node.patternProperties)) {
        const p = patterns(key)
        fun.write('if (%s.test(%s)) {', p, `${keys}[${i}]`)
        visit(
          `${name}[${keys}[${i}]]`,
          node.patternProperties[key],
          reporter,
          filter,
          schemaPath.concat(['patternProperties', key])
        )
        fun.write('}')
      }

      fun.write('}')
      if (type !== 'object') fun.write('}')
      consume('patternProperties')
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

    if (node.allOf) {
      if (!Array.isArray(node.allOf)) throw new Error('Invalid allOf')
      node.allOf.forEach(function(sch, key) {
        visit(name, sch, reporter, filter, schemaPath.concat(['allOf', key]))
      })
      consume('allOf')
    }

    if (node.anyOf && node.anyOf.length) {
      if (!Array.isArray(node.anyOf)) throw new Error('Invalid anyOf')
      const prev = gensym('prev')

      node.anyOf.forEach(function(sch, i) {
        if (i === 0) {
          fun.write('var %s = errors', prev)
        } else {
          fun.write('if (errors !== %s) {', prev)
          fun.write('errors = %s', prev)
        }
        visit(name, sch, false, false, schemaPath)
      })
      node.anyOf.forEach(function(sch, i) {
        if (i) fun.write('}')
      })
      fun.write('if (%s !== errors) {', prev)
      error('no schemas match')
      fun.write('}')
      consume('anyOf')
    }

    if (node.oneOf && node.oneOf.length) {
      if (!Array.isArray(node.oneOf)) throw new Error('Invalid oneOf')
      const prev = gensym('prev')
      const passes = gensym('passes')

      fun.write('var %s = errors', prev)
      fun.write('var %s = 0', passes)

      node.oneOf.forEach(function(sch, i) {
        visit(name, sch, false, false, schemaPath)
        fun.write('if (%s === errors) {', prev)
        fun.write('%s++', passes)
        fun.write('} else {')
        fun.write('errors = %s', prev)
        fun.write('}')
      })

      fun.write('if (%s !== 1) {', passes)
      error('no (or more than one) schemas match')
      fun.write('}')
      consume('oneOf')
    }

    if (node.multipleOf !== undefined) {
      if (!Number.isFinite(node.multipleOf)) throw new Error('Invalid multipleOf')
      validateTypeApplicable('number', 'integer')
      if (type !== 'number' && type !== 'integer') fun.write('if (%s) {', types.number(name))

      scope.isMultipleOf = isMultipleOf
      fun.write('if (!isMultipleOf(%s, %d)) {', name, node.multipleOf)

      error('has a remainder')
      fun.write('}')

      if (type !== 'number' && type !== 'integer') fun.write('}')
      consume('multipleOf')
    }

    if (node.maxProperties !== undefined) {
      if (!Number.isFinite(node.maxProperties)) throw new Error('Invalid maxProperties')
      validateTypeApplicable('object')
      if (type !== 'object') fun.write('if (%s) {', types.object(name))

      fun.write('if (Object.keys(%s).length > %d) {', name, node.maxProperties)
      error('has more properties than allowed')
      fun.write('}')

      if (type !== 'object') fun.write('}')
      consume('maxProperties')
    }

    if (node.minProperties !== undefined) {
      if (!Number.isFinite(node.minProperties)) throw new Error('Invalid minProperties')
      validateTypeApplicable('object')
      if (type !== 'object') fun.write('if (%s) {', types.object(name))

      fun.write('if (Object.keys(%s).length < %d) {', name, node.minProperties)
      error('has less properties than allowed')
      fun.write('}')

      if (type !== 'object') fun.write('}')
      consume('minProperties')
    }

    if (node.maxItems !== undefined) {
      if (!Number.isFinite(node.maxItems)) throw new Error('Invalid maxItems')
      validateTypeApplicable('array')
      if (type !== 'array') fun.write('if (%s) {', types.array(name))

      fun.write('if (%s.length > %d) {', name, node.maxItems)
      error('has more items than allowed')
      fun.write('}')

      if (type !== 'array') fun.write('}')
      consume('maxItems')
    }

    if (node.minItems !== undefined) {
      if (!Number.isFinite(node.minItems)) throw new Error('Invalid maxItems')
      validateTypeApplicable('array')
      if (type !== 'array') fun.write('if (%s) {', types.array(name))

      fun.write('if (%s.length < %d) {', name, node.minItems)
      error('has less items than allowed')
      fun.write('}')

      if (type !== 'array') fun.write('}')
      consume('minItems')
    }

    if (node.maxLength !== undefined) {
      if (!Number.isFinite(node.maxLength)) throw new Error('Invalid maxItems')
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
      if (!Number.isFinite(node.minLength)) throw new Error('Invalid maxItems')
      validateTypeApplicable('string')
      if (type !== 'string') fun.write('if (%s) {', types.string(name))

      scope.stringLength = stringLength
      fun.write('if (stringLength(%s) < %d) {', name, node.minLength)
      error('has less length than allowed')
      fun.write('}')

      if (type !== 'string') fun.write('}')
      consume('minLength')
    }

    if (node.minimum !== undefined) {
      if (!Number.isFinite(node.minimum)) throw new Error('Invalid minimum')
      validateTypeApplicable('number', 'integer')
      if (type !== 'number' && type !== 'integer') fun.write('if (%s) {', types.number(name))

      fun.write('if (%s %s %d) {', name, node.exclusiveMinimum ? '<=' : '<', node.minimum)
      error('is less than minimum')
      fun.write('}')

      if (type !== 'number' && type !== 'integer') fun.write('}')
      consume('minimum')
      consume('exclusiveMinimum', false)
    }

    if (node.maximum !== undefined) {
      if (!Number.isFinite(node.maximum)) throw new Error('Invalid maximum')
      validateTypeApplicable('number', 'integer')
      if (type !== 'number' && type !== 'integer') fun.write('if (%s) {', types.number(name))

      fun.write('if (%s %s %d) {', name, node.exclusiveMaximum ? '>=' : '>', node.maximum)
      error('is more than maximum')
      fun.write('}')

      if (type !== 'number' && type !== 'integer') fun.write('}')
      consume('maximum')
      consume('exclusiveMaximum', false)
    }

    if (properties) {
      for (const p of Object.keys(properties)) {
        if (Array.isArray(type) && type.indexOf('null') !== -1)
          fun.write('if (%s !== null) {', name)

        visit(
          genobj(name, p),
          properties[p],
          reporter,
          filter,
          schemaPath.concat(tuple ? p : ['properties', p])
        )

        if (Array.isArray(type) && type.indexOf('null') !== -1) fun.write('}')
      }
    }

    while (indent--) fun.write('}')

    if (unprocessed.size !== 0) throw new Error(`Unsupported keywords: ${[...unprocessed].join(', ')}`)
  }

  visit('data', schema, reporter, opts && opts.filter, [])

  fun.write('return errors === 0')
  fun.write('}')

  validateScope(fun.makeRawSource(), scope)

  const validate = fun.makeFunction(scope)
  validate.toModule = () => fun.makeModule(scope)
  validate.toJSON = () => schema
  return validate
}

module.exports = function(schema, opts) {
  if (typeof schema === 'string') schema = JSON.parse(schema)
  return compile(schema, {}, schema, true, opts)
}

module.exports.filter = function(schema, opts) {
  const validate = module.exports(schema, Object.assign({}, opts, { filter: true }))
  return function(sch) {
    validate(sch)
    return sch
  }
}

function validateScope(source, scope) {
  for (const key of Object.keys(scope))
    if (!source.includes(key)) throw new Error('Unexpected unused scope variable!')
}
