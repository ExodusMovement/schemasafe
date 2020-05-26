const genobj = require('generate-object-property')
const jaystring = require('jaystring')
const genfun = require('./generate-function')
const jsonpointer = require('jsonpointer')
const formats = require('./formats')
const KNOWN_KEYWORDS = require('./known-keywords')

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

const isMultipleOf = function(name, multipleOf) {
  let res
  const factor =
    (multipleOf | 0) !== multipleOf
      ? Math.pow(
          10,
          multipleOf
            .toString()
            .split('.')
            .pop().length
        )
      : 1
  if (factor > 1) {
    const factorName =
      (name | 0) !== name
        ? Math.pow(
            10,
            name
              .toString()
              .split('.')
              .pop().length
          )
        : 1
    if (factorName > factor) res = true
    else res = Math.round(factor * name) % (factor * multipleOf)
  } else res = name % multipleOf
  return !res
}

const compile = function(schema, cache, root, reporter, opts) {
  const fmts = opts ? Object.assign({}, formats, opts.formats) : formats
  const scope = { unique: unique, formats: fmts, isMultipleOf: isMultipleOf }
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

    let properties = node.properties
    let type = node.type
    let tuple = false

    if (Array.isArray(node.items)) {
      // tuple type
      properties = {...node.items}
      type = 'array'
      tuple = true
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
    }

    if (node.required === true) {
      indent++
      fun.write('if (%s === undefined) {', name)
      error('is required')
      fun.write('} else {')
    } else {
      indent++
      fun.write('if (%s !== undefined) {', name)
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
      }
    }

    if (node.format && fmts.hasOwnProperty(node.format)) {
      if (type !== 'string' && formats[node.format]) fun.write('if (%s) {', types.string(name))
      const n = gensym('format')
      scope[n] = fmts[node.format]

      if (scope[n] instanceof RegExp || typeof scope[n] === 'function') {
        const condition = scope[n] instanceof RegExp ? '!%s.test(%s)' : '!%s(%s)'
        fun.write(`if (${condition}) {`, n, name)
        error(`must be ${node.format} format`)
        fun.write('}')
      } else if (typeof scope[n] === 'object') {
        visit(name, scope[n], reporter, filter, schemaPath.concat('format'))
      }

      if (type !== 'string' && formats[node.format]) fun.write('}')
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
    }

    if (node.uniqueItems) {
      if (type !== 'array') fun.write('if (%s) {', types.array(name))
      fun.write('if (!(unique(%s))) {', name)
      error('must be unique')
      fun.write('}')
      if (type !== 'array') fun.write('}')
    }

    if (node.enum) {
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
    }

    if (node.dependencies) {
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
        }
        if (typeof deps === 'object') {
          fun.write('if (%s !== undefined) {', genobj(name, key))
          visit(name, deps, reporter, filter, schemaPath.concat(['dependencies', key]))
          fun.write('}')
        }
      }

      if (type !== 'object') fun.write('}')
    }

    if (node.additionalProperties || node.additionalProperties === false) {
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
    }

    if (node.items && !tuple) {
      if (type !== 'array') fun.write('if (%s) {', types.array(name))

      const i = genloop()
      fun.write('for (var %s = 0; %s < %s.length; %s++) {', i, i, name, i)
      visit(`${name}[${i}]`, node.items, reporter, filter, schemaPath.concat('items'))
      fun.write('}')

      if (type !== 'array') fun.write('}')
    }

    if (node.patternProperties) {
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
    }

    if (node.pattern) {
      const p = patterns(node.pattern)
      if (type !== 'string') fun.write('if (%s) {', types.string(name))
      fun.write('if (!(%s.test(%s))) {', p, name)
      error('pattern mismatch')
      fun.write('}')
      if (type !== 'string') fun.write('}')
    }

    if (node.allOf) {
      node.allOf.forEach(function(sch, key) {
        visit(name, sch, reporter, filter, schemaPath.concat(['allOf', key]))
      })
    }

    if (node.anyOf && node.anyOf.length) {
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
    }

    if (node.oneOf && node.oneOf.length) {
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
    }

    if (node.multipleOf !== undefined) {
      if (type !== 'number' && type !== 'integer') fun.write('if (%s) {', types.number(name))

      fun.write('if (!isMultipleOf(%s, %d)) {', name, node.multipleOf)

      error('has a remainder')
      fun.write('}')

      if (type !== 'number' && type !== 'integer') fun.write('}')
    }

    if (node.maxProperties !== undefined) {
      if (type !== 'object') fun.write('if (%s) {', types.object(name))

      fun.write('if (Object.keys(%s).length > %d) {', name, node.maxProperties)
      error('has more properties than allowed')
      fun.write('}')

      if (type !== 'object') fun.write('}')
    }

    if (node.minProperties !== undefined) {
      if (type !== 'object') fun.write('if (%s) {', types.object(name))

      fun.write('if (Object.keys(%s).length < %d) {', name, node.minProperties)
      error('has less properties than allowed')
      fun.write('}')

      if (type !== 'object') fun.write('}')
    }

    if (node.maxItems !== undefined) {
      if (type !== 'array') fun.write('if (%s) {', types.array(name))

      fun.write('if (%s.length > %d) {', name, node.maxItems)
      error('has more items than allowed')
      fun.write('}')

      if (type !== 'array') fun.write('}')
    }

    if (node.minItems !== undefined) {
      if (type !== 'array') fun.write('if (%s) {', types.array(name))

      fun.write('if (%s.length < %d) {', name, node.minItems)
      error('has less items than allowed')
      fun.write('}')

      if (type !== 'array') fun.write('}')
    }

    if (node.maxLength !== undefined) {
      if (type !== 'string') fun.write('if (%s) {', types.string(name))

      fun.write('if (%s.length > %d) {', name, node.maxLength)
      error('has longer length than allowed')
      fun.write('}')

      if (type !== 'string') fun.write('}')
    }

    if (node.minLength !== undefined) {
      if (type !== 'string') fun.write('if (%s) {', types.string(name))

      fun.write('if (%s.length < %d) {', name, node.minLength)
      error('has less length than allowed')
      fun.write('}')

      if (type !== 'string') fun.write('}')
    }

    if (node.minimum !== undefined) {
      if (type !== 'number' && type !== 'integer') fun.write('if (%s) {', types.number(name))

      fun.write('if (%s %s %d) {', name, node.exclusiveMinimum ? '<=' : '<', node.minimum)
      error('is less than minimum')
      fun.write('}')

      if (type !== 'number' && type !== 'integer') fun.write('}')
    }

    if (node.maximum !== undefined) {
      if (type !== 'number' && type !== 'integer') fun.write('if (%s) {', types.number(name))

      fun.write('if (%s %s %d) {', name, node.exclusiveMaximum ? '>=' : '>', node.maximum)
      error('is more than maximum')
      fun.write('}')

      if (type !== 'number' && type !== 'integer') fun.write('}')
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
  }

  visit('data', schema, reporter, opts && opts.filter, [])

  fun.write('return errors === 0')
  fun.write('}')

  const filteredScope = filterScope(fun.makeRawSource(), scope)

  const validate = fun.makeFunction(filteredScope)
  validate.toModule = function() {
    return fun.makeModule(filteredScope)
  }
  validate.errors = null

  if (Object.defineProperty) {
    Object.defineProperty(validate, 'error', {
      get: function() {
        if (!validate.errors) return ''
        return validate.errors
          .map(function(err) {
            return `${err.field} ${err.message}`
          })
          .join('\n')
      },
    })
  }

  validate.toJSON = function() {
    return schema
  }

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

// Improve performance of generated IIFE modules by filtering unneeded scope
function filterScope(source, scope) {
  const filtered = {}
  for (const key of Object.keys(scope)) {
    if (source.includes(key)) {
      filtered[key] = scope[key]
    }
  }
  return filtered
}
