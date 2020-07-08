'use strict'

const tape = require('tape')
const { inspect } = require('util')
const jaystring = require('../src/jaystring')

function foo(bar) {
  return bar
}

tape('valid', (t) => {
  for (const [source, string] of [
    [() => {}, '() => {}'],
    [(x) => x * 2, '(x) => x * 2'],
    [function() {}, 'function() {}'],
    [foo, 'function foo(bar) {\n  return bar\n}'],
    [/x/, 'new RegExp("x", "")'],
    [new RegExp('x\\/', 'i'), 'new RegExp("x\\\\/", "i")'],
    [/x/g, 'new RegExp("x", "g")'],
  ]) {
    t.strictEqual(`${jaystring(source)}`, string, string)
  }

  t.end()
})

tape('invalid', (t) => {
  for (const source of [0, {}, [], { foo() {} }.foo])
    t.throws(() => jaystring(source), /Can not stringify:/, inspect(source))

  t.end()
})
