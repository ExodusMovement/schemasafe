'use strict'

function untilde(string) {
  if (!string.includes('~')) return string
  return string.replace(/~[01]/g, (match) => {
    switch (match) {
      case '~1':
        return '/'
      case '~0':
        return '~'
    }
    throw new Error(`Invalid tilde escape: ${match}`)
  })
}

function get(obj, pointer) {
  if (typeof obj !== 'object') throw new Error('Invalid input object')
  if (typeof pointer !== 'string') throw new Error('Invalid JSON pointer')
  const parts = pointer.split('/')
  if (parts.shift() !== '') throw new Error('Invalid JSON pointer')
  if (parts.length === 0) return obj

  for (const part of parts) {
    if (typeof part !== 'string') throw new Error('Invalid JSON pointer')
    const prop = untilde(part)
    if (typeof obj !== 'object') return undefined
    if (!obj.hasOwnProperty(prop)) return undefined
    obj = obj[prop]
  }
  return obj
}

function resolveReference(root, additionalSchemas, ptr) {
  const visit = function(sub) {
    if (sub && (sub.id || sub.$id) === ptr) return sub
    if (typeof sub !== 'object' || !sub) return null
    return Object.keys(sub).reduce(function(res, k) {
      return res || visit(sub[k])
    }, null)
  }

  const res = visit(root)
  if (res) return res

  ptr = ptr.replace(/^#/, '')
  ptr = ptr.replace(/\/$/, '')

  try {
    return get(root, decodeURI(ptr))
  } catch (err) {
    // do nothing
  }

  const end = ptr.indexOf('#')
  // external reference
  if (end === 0) {
    return additionalSchemas[ptr]
  } else if (end === -1) {
    return additionalSchemas[ptr]
  } else {
    const ext = ptr.slice(0, end)
    const fragment = ptr.slice(end).replace(/^#/, '')
    try {
      return get(additionalSchemas[ext], fragment)
    } catch (err) {
      // do nothing
    }
  }

  // null or undefined values will throw an error on usage
  return null
}

module.exports = { get, resolveReference }
