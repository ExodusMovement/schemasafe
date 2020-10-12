// This typings are experimental and known to be incomplete.
// Help wanted at https://github.com/ExodusMovement/schemasafe/issues/130

interface ValidationError {
  keywordLocation: string;
  instanceLocation: string;
}

interface Validate {
  (value: any): boolean;
  errors?: ValidationError[];
  toModule: () => string;
  toJSON: () => any;
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
  jsonCheck?: boolean;
  $schemaDefault?: string | null;
  formats?: any; // FIXME
  weakFormats?: boolean;
  extraFormats?: boolean;
  schemas?: any; // FIXME
}

interface ParseResult {
  valid: boolean;
  value?: any;
  error?: string;
  errors?: ValidationError[];
}

interface Parse {
  (value: any): ParseResult;
  toModule: () => string;
  toJSON: () => any;
}

declare const validator: (schema: object, options?: ValidatorOptions) => Validate;

declare const parser: (schema: object, options?: ValidatorOptions) => Parse;

export { validator, parser, Validate, ValidationError, ValidatorOptions, ParseResult, Parse };
