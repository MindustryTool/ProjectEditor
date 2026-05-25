export const Severity = {
  error: 0,
  warning: 1,
  info: 2,
  deprecated: 3,
} as const;

export type SeverityLevel = (typeof Severity)[keyof typeof Severity];

export function severityLabel(level: SeverityLevel): string {
  switch (level) {
    case Severity.error:
      return "error";
    case Severity.warning:
      return "warning";
    case Severity.info:
      return "info";
    case Severity.deprecated:
      return "deprecated";
  }
}

export function isErrorOrWarning(level: SeverityLevel): boolean {
  return level <= Severity.warning;
}

export interface ValidationResult {
  path: string;
  severity: SeverityLevel;
  messageKey: string;
  messageParams?: Record<string, string | number>;
  line?: number;
  column?: number;
  code?: string;
}

export type ValidatorFn = (params: {
  path: string;
  content: string;
}) => ValidationResult[];

export interface ValidatorRegistration {
  name: string;
  pattern: string;
  validate: ValidatorFn;
}

export interface ValidatorRegistry {
  register(registration: ValidatorRegistration): void;
  unregister(name: string): void;
  getMatches(filePath: string): ValidatorRegistration[];
  getAll(): ValidatorRegistration[];
}

export interface ValidationSummary {
  total: number;
  errors: number;
  warnings: number;
  infos: number;
  deprecated: number;
}

export interface ValidationStore {
  resultsByPath: Record<string, ValidationResult[]>;
  summary: ValidationSummary;
  setResults(path: string, results: ValidationResult[]): void;
  clearResults(path: string): void;
  clearAll(): void;
}
