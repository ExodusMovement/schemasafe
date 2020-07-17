'use strict'

const tape = require('tape')
const { buildSchemas, resolveReference } = require('../src/pointer')

const fromEntries =
  Object.fromEntries ||
  ((arr) =>
    arr.reduce((obj, [key, val]) => {
      if (key === '__proto__') throw new Error('Unexpected') // Can't have __proto__ here
      obj[key] = val
      return obj
    }, {}))

const root = {}

const url = 'https://example.com/'

// id => none
const schemasI = {
  root: {},
  one: { x: { y: {} } },
  two: { x: { $id: 'xid', y: { $id: 'yid' } } },
  three: { x: { $id: 'xid/', y: { $id: 'yid/' } } },
}
// url => none
const schemasU = fromEntries(
  Object.entries(schemasI).map(([id, schema]) => [`${url}${id}/`, schema])
)

// id => url, only for test mapping
const uschemasI = fromEntries(
  Object.entries(schemasI).map(([id, schema]) => [id, { $id: `${url}${id}/`, ...schema }])
)
// url => url
const uschemasU = fromEntries(Object.entries(uschemasI).map(([, schema]) => [schema.$id, schema]))

const test = (t, schemas, tests) => {
  const additionalSchemas = buildSchemas(schemas)
  for (const [oldRoot, ref, base, newSchema, newRoot, newBase] of tests) {
    const res = resolveReference(oldRoot, additionalSchemas, ref, base)[0]
    if (!res) {
      t.fail(`Failed to resolve ${ref}`)
      continue
    }
    t.ok(newSchema === res[0], `Schema for ${ref} matches`)
    t.ok(newRoot === res[1], `Root for ${ref} matches`)
    t.equal(res[2], newBase, `Base path for ${ref} matches`)
  }
}

const testsI = (schemas) => [
  [root, '#', '', root, root, ''],

  [root, 'one', '', schemas.one, schemas.one, 'one'],
  [root, 'one#', '', schemas.one, schemas.one, 'one'],
  [root, 'one#/x', '', schemas.one.x, schemas.one, 'one'],
  [root, 'one#/x/y', '', schemas.one.x.y, schemas.one, 'one'],

  [root, 'two', '', schemas.two, schemas.two, 'two'],
  [root, 'two#', '', schemas.two, schemas.two, 'two'],
  [root, 'two#/x', '', schemas.two.x, schemas.two, 'two'],
  [root, 'two#/x/y', '', schemas.two.x.y, schemas.two, 'xid'],
]

const testsU = (schemas) => [
  [root, '#', '', root, root, ''],

  [root, `${url}one/`, '', schemas.one, schemas.one, `${url}one/`],
  [root, `${url}one/#`, '', schemas.one, schemas.one, `${url}one/`],
  [root, `${url}one/#/x`, '', schemas.one.x, schemas.one, `${url}one/`],
  [root, `${url}one/#/x/y`, '', schemas.one.x.y, schemas.one, `${url}one/`],

  [root, `${url}three/`, '', schemas.three, schemas.three, `${url}three/`],
  [root, `${url}three/#`, '', schemas.three, schemas.three, `${url}three/`],
  [root, `${url}three/#/x`, '', schemas.three.x, schemas.three, `${url}three/`],
  [root, `${url}three/#/x/y`, '', schemas.three.x.y, schemas.three, `${url}three/xid/`],
]

tape('with a schemas object', (t) => {
  test(t, schemasI, testsI(schemasI))
  test(t, schemasU, testsU(schemasI))
  test(t, uschemasU, testsU(uschemasI))
  t.end()
})

tape('with a schemas map', (t) => {
  const map = (x) => new Map(Object.entries(x))
  test(t, map(schemasI), testsI(schemasI))
  test(t, map(schemasU), testsU(schemasI))
  test(t, map(uschemasU), testsU(uschemasI))
  t.end()
})
