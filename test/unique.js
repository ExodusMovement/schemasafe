'use strict'

const tape = require('tape')
const { unique } = require('../src/scope-functions')

const genNumbers = (size) =>
  Array(size)
    .fill()
    .map((_, i) => i)
const genStrings = (size) =>
  Array(size)
    .fill()
    .map((_, i) => i.toString(32))

tape('simple', (t) => {
  t.equal(unique([0, '0']), true)
  t.equal(unique(['0', 0]), true)

  for (const a of [0, '0']) {
    for (const b of [0, '0']) {
      for (const c of [0, '0']) {
        t.equal(unique([a, b, c]), false, JSON.stringify([a, b, c]))
      }
    }
  }

  for (let i = 1; i <= 1e5; i *= 10) {
    const numbers = genNumbers(i)
    const strings = genStrings(i)
    t.equal(unique(numbers), true, `${i} unique numbers`)
    t.equal(unique(strings), true, `${i} unique strings`)
    t.equal(unique([...numbers, ...strings]), true, `${2 * i} unique numbers + strings`)
    t.equal(unique([...numbers, numbers[0]]), false, `${i} non-unique numbers, A`)
    t.equal(unique([...strings, strings[0]]), false, `${i} non-unique strings, A`)
    if (i > 1) {
      t.equal(unique(numbers.map((x) => (x / 2) | 0)), false, `${i} non-unique numbers, B`)
      t.equal(unique(strings.map((x) => x.slice(1))), false, `${i} non-unique strings, B`)
    }
    if (i <= 1e2) {
      const objects = numbers.map((x) => ({ x }))
      const arrays = numbers.map((x) => [x])
      t.equal(unique(objects), true, `${i} unique objects`)
      t.equal(unique(arrays), true, `${i} unique arrays`)
      t.equal(unique([...numbers, ...strings, ...objects, ...arrays]), true, `${4 * i} uniq mixed`)
      t.equal(unique([...objects, objects[0]]), false, `${i} non-unique objects`)
      t.equal(unique([...arrays, arrays[0]]), false, `${i} non-unique arrays`)
    }
  }

  t.end()
})
