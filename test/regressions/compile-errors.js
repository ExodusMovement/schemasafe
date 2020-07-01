'use strict'

const tape = require('tape')
const { inspect } = require('util')
const { validator } = require('../../')

tape('Schema should be an object', (t) => {
  for (const arg of [undefined, null, [], 0, 42, Infinity, /regexp/, 'string', Buffer.alloc(0)])
    t.throws(() => validator(arg), /Schema is not an object/, `Throws on ${inspect(arg)}`)

  for (const arg of [false, true, {}])
    t.doesNotThrow(() => validator(arg), `Does not throw on ${inspect(arg)}`)

  t.end()
})
