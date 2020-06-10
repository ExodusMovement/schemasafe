'use strict'

function toPointer(path) {
  if (path.length === 0) return ''
  return `#/${path.map((part) => `${part}`.replace(/~/g, '~0').replace(/\//g, '~1')).join('/')}`
}

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

function get(obj, pointer, objpath) {
  if (typeof obj !== 'object') throw new Error('Invalid input object')
  if (typeof pointer !== 'string') throw new Error('Invalid JSON pointer')
  const parts = pointer.split('/')
  if (!['', '#'].includes(parts.shift())) throw new Error('Invalid JSON pointer')
  if (parts.length === 0) return obj

  for (const part of parts) {
    if (typeof part !== 'string') throw new Error('Invalid JSON pointer')
    const prop = untilde(part)
    if (typeof obj !== 'object') return undefined
    if (!obj.hasOwnProperty(prop)) return undefined
    obj = obj[prop]
    if (objpath) objpath.push(obj)
  }
  if (objpath) objpath.pop() // does not include head or result
  return obj
}

const protocolRegex = /^https?:\/\//

function joinPath(base, sub) {
  if (typeof base !== 'string' || typeof sub !== 'string') throw new Error('Unexpected path!')
  if (sub.length === 0) return base
  base = base.replace(/#.*/, '')
  if (sub.startsWith('#')) return `${base}${sub}`
  if (!base.includes('/') || protocolRegex.test(sub)) return sub
  if (protocolRegex.test(base)) return `${new URL(sub, base)}`
  if (sub.startsWith('/')) return sub
  return `${base.replace(/\/?[^/]*$/, '')}/${sub}`
}

function objpath2path(objpath) {
  const ids = objpath.map((obj) => (obj && (obj.$id || obj.id)) || '')
  return ids.filter((id) => id).reduce(joinPath, '')
}

function resolveReference(root, additionalSchemas, ptr) {
  const results = []

  const [main, hash = ''] = ptr.split('#')
  const local = decodeURI(hash).replace(/\/$/, '')

  // Find in self by id path
  const visit = (sub, path) => {
    if (!sub || typeof sub !== 'object') return
    const id = sub.$id || sub.id
    if (id && typeof id === 'string') {
      path = joinPath(path, id)
      if (path === ptr || (path === main && local === '')) {
        results.push([sub, root, ptr])
      } else if (path === main && local[0] === '/') {
        const objpath = []
        const res = get(sub, local, objpath)
        if (res !== undefined) results.push([res, root, joinPath(path, objpath2path(objpath))])
      }
    }
    for (const k of Object.keys(sub)) visit(sub[k], path)
  }
  visit(root, '')

  // Find in self by pointer
  if (main === '' && (local[0] === '/' || local === '')) {
    const objpath = []
    const res = get(root, local, objpath)
    if (res !== undefined) results.push([res, root, objpath2path(objpath)])
  }

  // Find in additional schemas
  if (additionalSchemas.hasOwnProperty(main))
    results.push(...resolveReference(additionalSchemas[main], additionalSchemas, `#${hash}`))

  // Full refs to additional schemas
  if (additionalSchemas.hasOwnProperty(ptr))
    results.push([additionalSchemas[ptr], additionalSchemas, ptr])
  const altname = ptr.replace(/^#/, '').replace(/\/$/, '') // is-my-json-valid test
  if (altname !== ptr && additionalSchemas.hasOwnProperty(altname))
    results.push([additionalSchemas[altname], additionalSchemas, ptr])

  return results
}

module.exports = { toPointer, get, joinPath, resolveReference }
