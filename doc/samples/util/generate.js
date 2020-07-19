'use strict'

const { readdirSync, readFileSync, writeFileSync } = require('fs')
const path = require('path')
const { format: prettify } = require('prettier')
const { validator } = require('../../../')
const schemas = require('../../../test/util/schemas')

const version = 'draft2019-09'
const dir = path.join(__dirname, '../../../test/JSON-Schema-Test-Suite/tests', version)

function processSchema(block) {
  const errors = new Set()
  const warnings = new Set()
  const notices = new Set()
  const { description, comment } = block
  for (const mode of ['strong', 'default', 'lax']) {
    try {
      const $schemaDefault = 'http://json-schema.org/draft/2019-09/schema#'
      const opts = { schemas, mode, isJSON: true, $schemaDefault }
      const validate = validator(block.schema, opts)
      const mistakes = block.tests.filter((test) => validate(test.data) !== test.valid).length
      const ok = mistakes === 0
      const source = validate
        .toModule()
        .replace(/^\(function\(\) {\n/, '')
        .replace(/\}\)\(\);$/, '')
      for (const msg of warnings) notices.delete(msg)
      for (const msg of errors) warnings.delete(msg)
      return { description, comment, source, mode, ok, errors, warnings, notices, mistakes }
    } catch (e) {
      if (mode === 'lax') errors.add(e.message)
      if (mode === 'default') warnings.add(e.message)
      if (mode === 'strong') notices.add(e.message)
    }
  }
  for (const msg of warnings) notices.delete(msg)
  for (const msg of errors) warnings.delete(msg)
  return { description, comment, errors, warnings, notices }
}

const results = []
const readdir = (sub) =>
  readdirSync(path.join(dir, sub))
    .sort()
    .map((x) => path.join(sub, x))
for (const file of [...readdir(''), ...readdir('optional')]) {
  if (file.endsWith('.json')) {
    const id = file.replace(/\.json$/, '')
    if (!/^[a-z0-9_/-]+$/i.test(id)) throw new Error('Unexpected')
    const content = readFileSync(path.join(dir, file))
    const stat = { id, schemas: 0, errors: 0, warnings: 0, notices: 0, mistakes: 0 }
    const contents = [`# ${id}`, '']
    for (const block of JSON.parse(content)) {
      const entry = processSchema(block)
      contents.push(`## ${entry.description}`, '')
      const schemaJson = prettify(JSON.stringify(block.schema), { parser: 'json' }).trim()
      contents.push(`### Schema`, '', `\`\`\`json`, schemaJson, `\`\`\``, '')
      contents.push('### Code', '')
      if (entry.source) {
        contents.push(`\`\`\`js`, entry.source, `\`\`\``, '')
      } else {
        contents.push('**FAILED TO COMPILE**', '')
      }
      if (entry.errors.size > 0) {
        stat.errors++
        contents.push('### Errors', '', ...[...entry.errors].map((e) => ` * \`${e}\``), '')
      }
      if (entry.warnings.size > 0) {
        stat.warnings++
        if (entry.errors.size === 0)
          contents.push('### Warnings', '', ...[...entry.warnings].map((e) => ` * \`${e}\``), '')
      }
      if (entry.notices.size > 0) {
        stat.notices++
        if (entry.errors.size === 0 && entry.warnings.size === 0) {
          contents.push('##### Strong mode notices', '')
          contents.push(...[...entry.notices].map((e) => ` * \`${e}\``), '')
        }
      }
      if (entry.mistakes > 0) {
        stat.mistakes++
        contents.push('### Misclassified!', '')
        contents.push(`**This schema caused ${entry.mistakes} misclassifications!**`, '')
      }
      stat.schemas++
      contents.push('')
    }
    const md = `${id.replace(/\//g, '-')}.md`
    writeFileSync(md, contents.join('\n'))
    stat.name = `[${id}](./${md})`
    // console.log(JSON.stringify(stat))
    results.push(stat)
  }
}

const head = {
  name: 'Name',
  schemas: 'Total',
  errors: 'Failed to compile',
  warnings: 'Warnings',
  // notices: 'Notices',
  mistakes: 'Misclassified',
}
const columns = Object.keys(head)
const widths = columns.map((col) =>
  Math.max(...[head, ...results].map((row) => String(row[col]).length))
)
const wrapRow = (row, s = ' ') =>
  `|${s}${columns
    .map((col, i) => String((Array.isArray(row) ? row[i] : row[col]) || '-').padEnd(widths[i], s))
    .join(`${s}|${s}`)}${s}|`

const indexContents = ['# Samples', '']
indexContents.push(`Based on JSON Schema Test Suite for \`${version}\`.`, '')

indexContents.push(`
### Disambiguation

 * **Failed to compile** — schemas that did not compile in any mode.

 * **Warnings** — schemas that did not compile in the \`default\` mode, but compiled in \`lax\`
   mode.

   JSON Schema spec allows usage of ineffective or unknown keywords, which is considered a mistake
   by \`@exodus/schemasafe\` by default. \`lax\` mode lifts that coherence check.

 * **Misclassified** — schemas that classified at least one test value incorrectly, i.e. gave
   \`true\` where testsuite expected \`false\` or vice versa.
`)

indexContents.push('## Results', '')
indexContents.push(wrapRow(head))
indexContents.push(wrapRow([...columns].fill(''), '-'))
for (const row of results) indexContents.push(wrapRow(row))

indexContents.push(`
### Notes

\`{ isJSON: true }\` option is used for better clarity, and that also corresponds to the main
expected usage pattern of this module. Without it, there would be additional checks for
\`!== undefined\`, which can be fast-tracked if we know that the input came from \`JSON.parse()\`.
`)

writeFileSync(`README.md`, indexContents.join('\n'))
