import createValidator = require('../')

/** Static assertion that `value` has type `T` */
// Disable tslint here b/c the generic is used to let us do a type coercion and
// validate that coercion works for the type value "passed into" the function.
// tslint:disable-next-line:no-unnecessary-generics
function assertType<T>(value: T): void {}

const input = null as unknown

const nullValidator = createValidator({ type: 'null' })
assertType<{ type: 'null' }>(nullValidator.toJSON())

if (nullValidator(input)) {
  assertType<null>(input)
}

assertType<createValidator.ValidationError[]>(nullValidator.errors)
assertType<createValidator.ValidationError>(nullValidator.errors[0])
assertType<string>(nullValidator.errors[0].field)
assertType<string>(nullValidator.errors[0].message)
assertType<string>(nullValidator.errors[0].type)
assertType<unknown>(nullValidator.errors[0].value)

const numberValidator = createValidator({ type: 'number' })
assertType<{ type: 'number' }>(numberValidator.toJSON())

if (numberValidator(input)) {
  assertType<number>(input)
}

const stringValidator = createValidator({ type: 'string' })
assertType<{ type: 'string' }>(stringValidator.toJSON())

if (stringValidator(input)) {
  assertType<string>(input)
}

const personValidator = createValidator({
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' },
  },
  required: [
    'name'
  ]
})

if (personValidator(input)) {
  assertType<string>(input.name)
  if (typeof input.age !== 'undefined') assertType<number>(input.age)
  if (typeof input.age !== 'number') assertType<undefined>(input.age)
}

const namesValidator = createValidator({
  type: 'array',
  items: { type: 'string' }
})

if (namesValidator(input)) {
  assertType<number>(input.length)
  assertType<string>(input[0])
}

const boxValidator = createValidator({
  type: 'object',
  properties: {
    name: { type: 'string' },
    items: { type: 'array', items: { type: 'boolean' } },
  },
  required: [
    'name',
    'items',
  ]
})

if (boxValidator(input)) {
  assertType<string>(input.name)
  assertType<number>(input.items.length)
  assertType<boolean>(input.items[0])
}

const matrixValidator = createValidator({
  type: 'array',
  items: {
    type: 'array',
    items: {
      type: 'number'
    }
  }
})

if (matrixValidator(input)) {
  assertType<number>(input[0][0])
}

const userValidator = createValidator({
  type: 'object',
  properties: {
    name: { type: 'string' },
    items: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'name',
    'items',
  ]
})

if (userValidator(input)) {
  assertType<string>(input.name)
  assertType<number>(input.items.length)
  assertType<string>(input.items[0])
}

const user2Validator = createValidator({
  type: 'object',
  properties: {
    name: {
      type: 'object',
      properties: {
        first: { type: 'string' },
        last: { type: 'string' },
      },
      required: [
        'last' as 'last'
      ]
    },
    items: {
      type: 'array',
      items: { type: 'string' },
    }
  },
  required: [
    'name'
  ]
})

if (user2Validator(input)) {
  assertType<{ first: string | undefined, last: string }>(input.name)
  if (typeof input.name.first !== 'undefined') assertType<string>(input.name.first)
  if (typeof input.name.first !== 'string') assertType<undefined>(input.name.first)
  assertType<string>(input.name.last)

  if (input.items !== undefined) {
    assertType<number>(input.items.length)
    assertType<string>(input.items[0])
  }
}

const booleanValidator = createValidator({
  enum: [true, false]
})

if (booleanValidator(input)) {
  assertType<boolean>(input)
}

const specificValuesValidator = createValidator({
  enum: [
    true as true,
    1000 as 1000,
    'XX' as 'XX'
  ]
})

if (specificValuesValidator(input)) {
  if (input !== true && input !== 1000) assertType<'XX'>(input)
  if (input !== 1000 && input !== 'XX') assertType<true>(input)
  if (input !== 'XX' && input !== true) assertType<1000>(input)
}

const metricValidator = createValidator({
  type: 'object',
  properties: {
    name: { type: 'string', enum: ['page-view' as 'page-view'] },
    page: { type: 'string', minLength: 0 }
  },
  required: [
    'name',
    'page'
  ]
})

if (metricValidator(input)) {
  assertType<'page-view'>(input.name)
  assertType<string>(input.page)
}

const noRequiredFieldsValidator = createValidator({
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: { type: 'string' },
    c: { type: 'string' }
  }
})

if (noRequiredFieldsValidator(input)) {
  if (typeof input.a !== 'string') assertType<undefined>(input.a)
  if (typeof input.b !== 'string') assertType<undefined>(input.b)
  if (typeof input.c !== 'string') assertType<undefined>(input.c)
  if (typeof input.a !== 'undefined') assertType<string>(input.a)
  if (typeof input.b !== 'undefined') assertType<string>(input.b)
  if (typeof input.c !== 'undefined') assertType<string>(input.c)
}