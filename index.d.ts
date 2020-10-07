interface ValidationError {
  keywordLocation: string;
  instanceLocation: string;
}

interface Validate {
  (value: any): boolean;
  errors?: ValidationError[];
}

interface ValidatorOptions {
  mode?: string,
  useDefaults?: boolean;
  removeAdditional?: boolean;
  includeErrors?: boolean;
  allErrors?: boolean;
  dryRun?: boolean;
  allowUnusedKeywords?: boolean;
  allowUnreachable?: boolean;
  requireSchema?: boolean;
  requireValidation?: boolean;
  requireStringValidation?: boolean;
  forbidNoopValues?: boolean;
  complexityChecks?: boolean;
  unmodifiedPrototypes?: boolean;
  isJSON?: boolean;
  $schemaDefault?: string | null;
  formats?: any; // FIXME
  weakFormats?: boolean;
  extraFormats?: boolean;
  schemas?: any; // FIXME
}

declare const validator: (schema: object, options?: ValidatorOptions) => Validate;

export { validator, Validate, ValidationError, ValidatorOptions };
