import { validator } from '../../../index'

const schema = {
  type: 'object',
  allOf: [
    {
      if: {
        properties: {
          propertyA: {
            const: 1,
          },
        },
      },
      then: {
        properties: {
          propertyB: {
            const: null,
          },
        },
      },
    },
    {
      if: {
        properties: {
          propertyA: {
            const: 2,
          },
        },
      },
      then: {
        properties: {
          propertyC: {
            const: null,
          },
        },
      },
    },
  ],
}

const myValidator = validator(schema)
