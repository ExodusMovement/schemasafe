interface ValidationError {
  keywordLocation: string;
  instanceLocation: string;
}

interface Validate {
  (value: any): boolean;
  errors?: ValidationError[];
}

interface ValidatorOptions {
  allErrors?: boolean;
  extraFormats?: boolean;
  includeErrors?: boolean;
}

declare const validator: (schema: object, options?: ValidatorOptions) => Validate;

export { validator, Validate, ValidationError };
