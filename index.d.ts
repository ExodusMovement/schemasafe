// This typings are experimental and known to be incomplete.
// Help wanted at https://github.com/ExodusMovement/schemasafe/issues/130

type Schema = object;

interface ValidationError {
  keywordLocation: string;
  instanceLocation: string;
}

interface Validate {
  (value: any): boolean;
  errors?: ValidationError[];
  toModule: () => string;
  toJSON: () => Schema;
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
  formats?: object;
  weakFormats?: boolean;
  extraFormats?: boolean;
  schemas?: Map<string, Schema> | Array<Schema> | object;
}

interface ParseResult {
  valid: boolean;
  value?: any;
  error?: string;
  errors?: ValidationError[];
}

interface Parse {
  (value: string): ParseResult;
  toModule: () => string;
  toJSON: () => Schema;
}

declare const validator: (schema: Schema, options?: ValidatorOptions) => Validate;

declare const parser: (schema: Schema, options?: ValidatorOptions) => Parse;

export { validator, parser, Validate, ValidationError, ValidatorOptions, ParseResult, Parse };
