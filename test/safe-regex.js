const tape = require('tape')
const safeRegex = require('safe-regex')

const formats = require('../src/formats')

tape('safe-regex', function(t) {
  for (const type of Object.keys(formats)) {
    let key
    for (key of Object.keys(formats[type])) {
      if (formats[type][key] instanceof RegExp) {
        t.ok(safeRegex(formats[type][key]), `${key} should be a safe regex (in ${type})`)
      }
    }
  }

  t.end()
})
