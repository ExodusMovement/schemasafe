'use strict'

const tape = require('tape')
const { validator } = require('../../')

tape('regression #177', (t) => {
  const variants = [{ type: 'object' }, {}]

  for (const l0 of variants) {
    for (const l1a of variants) {
      for (const l1b of variants) {
        for (const l2a of variants) {
          for (const l2b of variants) {
            if (!l0.type && !l1a.type) continue
            if (!l0.type && !l1b.type && !l2a.type) continue
            if (!l0.type && !l1b.type && !l2b.type) continue

            if (l0.type && (!l2a.type || !l2b.type)) continue // Bug, fixed by #179

            t.doesNotThrow(() => {
              const validate = validator({
                required: ['type'],
                discriminator: { propertyName: 'type' },
                ...l0,
                properties: {
                  type: {
                    enum: ['noop', 'foo'],
                  },
                },
                oneOf: [
                  {
                    ...l1a,
                    properties: { type: { const: 'noop' } },
                  },
                  {
                    ...l1b,
                    required: ['method'],
                    discriminator: { propertyName: 'method' },
                    properties: {
                      type: { const: 'foo' },
                      method: {
                        enum: ['bar', 'buzz'],
                      },
                    },
                    oneOf: [
                      {
                        ...l2a,
                        properties: {
                          method: { const: 'bar' },
                        },
                      },
                      {
                        ...l2b,
                        properties: {
                          method: { const: 'buzz' },
                        },
                      },
                    ],
                  },
                ],
              })

              t.notOk(validate({}), '{}')
              t.ok(validate({ type: 'noop' }), "{ type: 'noop' }")
              t.notOk(validate({ type: 'no' }), "{ type: 'no' }")
              t.notOk(validate({ type: 'bar' }), "{ type: 'bar' }")
              t.notOk(validate({ type: 'foo' }), "{ type: 'foo' }")
              t.ok(validate({ type: 'foo', method: 'bar' }), "{ type: 'foo', method: 'bar' }")
              t.notOk(validate({ type: 'foo', method: 'fuzz' }), "{ type: 'foo', method: 'fuzz' }")
            }, JSON.stringify([l0, l1a, l1b, l2a, l2b]))
          }
        }
      }
    }
  }

  t.end()
})
