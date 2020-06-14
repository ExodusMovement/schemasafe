'use strict'

const tape = require('tape')
const safeRegex = require('safe-regex')

const formats = require('../src/formats')

tape('safe-regex', function(t) {
  for (const type of Object.keys(formats)) {
    let key
    for (key of Object.keys(formats[type])) {
      const format = formats[type][key]
      if (format instanceof RegExp) {
        t.ok(safeRegex(format), `${key} should be a safe regex (in ${type})`)
        t.ok(format.source.startsWith('^'), `${key} should start with ^ (in ${type})`)
        t.ok(format.source.endsWith('$'), `${key} should end with $ (in ${type})`)
      }
    }
  }

  t.end()
})
