'use strict'

const tape = require('tape')
const { randomBytes } = require('crypto')
const { deBase64 } = require('../src/scope-functions')

const arr = (size) => Array(size).fill()
const strings = [
  ...arr(1000).map((_, i) => i),
  ...arr(100).map(() => Math.floor(10 * 1024 * Math.random())),
].map((size) => randomBytes(size).toString('utf-8'))

const encoded = strings.map((string) => Buffer.from(string, 'utf8').toString('base64'))

const measure = (decode) => {
  const t0 = process.hrtime()
  const passed = encoded.every((b64, i) => decode(b64) === strings[i])
  const t = process.hrtime(t0)
  return { passed, time: t[0] + t[1] * 1e-9 }
}

tape('base64 decoding works', (t) => {
  const native = measure((b64) => Buffer.from(b64, 'base64').toString('utf8'))
  t.ok(native.passed, 'native passes')

  const broken = measure((b64) => b64)
  t.notOk(broken.passed, 'broken should fail')

  const fast = measure(deBase64)
  t.ok(fast.passed, 'deBase64 native passes')

  if (typeof TextDecoder === 'undefined') {
    t.skip('TextDecoder not available, skipping custom impl tests')
  } else {
    const GlobalBuffer = global.Buffer
    delete global.Buffer
    global.atob = (str) => GlobalBuffer.from(str, 'base64').toString('binary')
    t.ok(typeof Buffer === 'undefined', 'Buffer was unset')
    const slow = measure(deBase64)
    global.Buffer = GlobalBuffer
    delete global.atob
    t.ok(typeof Buffer !== 'undefined', 'Buffer was restored')
    t.ok(slow.passed, 'deBase64 custom passes')

    t.ok(slow.time / native.time < 10, 'Custom speed is acceptable')
    t.ok(slow.time / native.time > 1.5, 'Custom is not the same as fast')
    t.ok(fast.time / native.time < 2, 'Fast works at native speed')
  }

  t.end()
})
