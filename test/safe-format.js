'use strict'

const tape = require('tape')
const { format, safe } = require('../src/safe-format')

tape('format throws on invalid data', (t) => {
  t.throws(() => format('', 4), /Unexpected arguments count/)
  t.throws(() => format('%d %d', 4), /Unexpected arguments count/)
  t.throws(() => format('%d', 4, 2), /Unexpected arguments count/)
  t.doesNotThrow(() => format('%d %d', 4, 2))

  // %s - safe strings aka code
  t.throws(() => format('%s', 4), /Expected a safe string/)
  t.throws(() => format('%s', Infinity), /Expected a safe string/)
  t.throws(() => format('%s', 'id'), /Expected a safe string/)
  t.throws(() => format('%s', '<'), /Expected a safe string/)
  t.throws(() => format('%s', '>='), /Expected a safe string/)
  t.throws(() => format('%s', {}), /Expected a safe string/)
  t.throws(() => format('%s', /xx/), /Expected a safe string/)
  t.doesNotThrow(() => format('%s', safe('id')))

  // %d - numbers, including special
  t.throws(() => format('%r', 4), /Expected a RegExp/)
  t.throws(() => format('%r', Infinity), /Expected a RegExp/)
  t.throws(() => format('%r', 'id'), /Expected a RegExp/)
  t.throws(() => format('%r', '<'), /Expected a RegExp/)
  t.throws(() => format('%r', '>='), /Expected a RegExp/)
  t.throws(() => format('%r', {}), /Expected a RegExp/)
  t.doesNotThrow(() => format('%r', /xx/))
  t.throws(() => format('%r', safe('id')), /Expected a RegExp/)

  // %d - numbers, including special
  t.doesNotThrow(() => format('%d', 4))
  t.doesNotThrow(() => format('%d', Infinity))
  t.throws(() => format('%d', 'id'), /Expected a number/)
  t.throws(() => format('%d', '<'), /Expected a number/)
  t.throws(() => format('%d', '>='), /Expected a number/)
  t.throws(() => format('%d', {}), /Expected a number/)
  t.throws(() => format('%d', /xx/), /Expected a number/)
  t.throws(() => format('%d', safe('id')), /Expected a number/)

  // %j - js literal values and objects aka JSON + primitives
  t.doesNotThrow(() => format('%j', 4))
  t.doesNotThrow(() => format('%j', Infinity))
  t.doesNotThrow(() => format('%j', 'id'))
  t.doesNotThrow(() => format('%j', '<'))
  t.doesNotThrow(() => format('%j', '>='))
  t.doesNotThrow(() => format('%j', {}))
  t.throws(() => format('%j', /xx/), /Unexpected object/)
  t.throws(() => format('%j', safe('id')), /Unexpected object/)

  // %c: - compare operators
  t.throws(() => format('%c', 4), /Expected a compare op/)
  t.throws(() => format('%c', Infinity), /Expected a compare op/)
  t.throws(() => format('%c', 'id'), /Expected a compare op/)
  t.doesNotThrow(() => format('%c', '<'))
  t.doesNotThrow(() => format('%c', '>='))
  t.throws(() => format('%c', {}), /Expected a compare op/)
  t.throws(() => format('%c', /xx/), /Expected a compare op/)
  t.throws(() => format('%c', safe('id')), /Expected a compare op/)

  // %w: - identation size
  t.doesNotThrow(() => format('%w', 4))
  t.doesNotThrow(() => format('%w', 0))
  t.throws(() => format('%w', -4), /Expected a non-negative integer/)
  t.throws(() => format('%w', Infinity))
  t.throws(() => format('%w', 'id'), /Expected a non-negative integer/)
  t.throws(() => format('%w', '<'), /Expected a non-negative integer/)
  t.throws(() => format('%w', '>='), /Expected a non-negative integer/)
  t.throws(() => format('%w', {}), /Expected a non-negative integer/)
  t.throws(() => format('%w', /xx/), /Expected a non-negative integer/)
  t.throws(() => format('%w', safe('id')), /Expected a non-negative integer/)

  t.end()
})
