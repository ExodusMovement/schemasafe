'use strict'

const fs = require('fs')
const path = require('path')
const { processTest } = require('./json-schema-test')

const files = process.argv.slice(2)
for (const file of files) {
  if (!file.endsWith('.json')) throw new Error(`Not a JSON: ${file}`)
  const content = fs.readFileSync(path.resolve(file), 'utf-8')
  processTest('', file, JSON.parse(content), () => false, () => false)
}
