'use strict'

const tape = require('tape')
const genfun = require('../src/generate-function')

tape('generate-function', (t) => {
  t.doesNotThrow(() => {
    const fun = genfun()
    fun.write('function foo(x) {')
    fun.write('return x * %d', 2)
    fun.write('}')
    fun.makeFunction()
    fun.makeModule()
  }, 'Does not throws on valid')

  t.throws(
    () => {
      const fun = genfun()
      fun.write('function foo(x) {')
      fun.write('return x * %d', 2)
      fun.makeFunction()
    },
    /Unexpected indent/,
    'Throws on invalid {} balance, -'
  )

  t.throws(
    () => {
      const fun = genfun()
      fun.write('function foo(x) {')
      fun.write('return x * %d', 2)
      fun.write('}')
      fun.write('}')
      fun.makeFunction()
    },
    /Unexpected indent/,
    'Throws on invalid {} balance, +'
  )

  t.throws(
    () => {
      const fun = genfun()
      fun.write('function foo(x) {')
      fun.write('return x * %d\n}', 2)
      fun.makeFunction()
    },
    /Only single lines/,
    'Throws on multi-line format to keep the lines separate'
  )

  t.throws(
    () => {
      const fun = genfun()
      fun.write('function foo(x) {')
      fun.write({}) // eslint-disable-line no-restricted-syntax
      fun.write('}')
      fun.makeFunction()
    },
    /Format must be a string/,
    'Format must be a string'
  )

  t.end()
})
