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
	startLine: number;
	startColumn: number;
	endLine?: number;
	endColumn?: number;
	field?: string;
	code?: string;
}

export type ItemDto = {
	name: string;
};

export type ValidationContext = {
	getItems(): ItemDto[];
};

export type ValidatorFn = (params: { path: string; content: string; context: ValidationContext }) => ValidationResult[];

export interface ValidatorRegistration {
	name: string;
	pattern: RegExp | ((path: string) => boolean);
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
	results: ValidationResults;
	setResults(path: string, results: ValidationResult[]): void;
	clearResults(path: string): void;
	clearAll(): void;
}

function computeSummary(resultsByPath: Record<string, ValidationResult[]>): ValidationSummary {
	let errors = 0;
	let warnings = 0;
	let infos = 0;
	let deprecated = 0;

	for (const results of Object.values(resultsByPath)) {
		for (const r of results) {
			if (r.severity === Severity.error) errors++;
			else if (r.severity === Severity.warning) warnings++;
			else if (r.severity === Severity.info) infos++;
			else if (r.severity === Severity.deprecated) deprecated++;
		}
	}

	return {
		total: errors + warnings + infos + deprecated,
		errors,
		warnings,
		infos,
		deprecated,
	};
}

function computeRollup(resultsByPath: Record<string, ValidationResult[]>): Record<string, { error: number; warning: number }> {
	const result: Record<string, { error: number; warning: number }> = {};
	for (const [path, results] of Object.entries(resultsByPath)) {
		const segments = path.split("/").filter(Boolean);

		let currentPath = "";
		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i];
			if (i > 0) currentPath += "/";
			currentPath += segment;

			if (result[currentPath] == null) result[currentPath] = { error: 0, warning: 0 };

			const errors = results.filter((r) => r.severity === Severity.error).length;
			const warnings = results.filter((r) => r.severity === Severity.warning).length;
			result[currentPath]!.error += errors;
			result[currentPath]!.warning += warnings;
		}
	}
	return result;
}

export class ValidationResults {
	readonly resultsByPath: Record<string, ValidationResult[]>;
	readonly summary: ValidationSummary;
	private readonly _rollup: Record<string, { error: number; warning: number }>;

	constructor(resultsByPath?: Record<string, ValidationResult[]>) {
		this.resultsByPath = resultsByPath ?? {};
		this.summary = computeSummary(this.resultsByPath);
		this._rollup = computeRollup(this.resultsByPath);
	}

	setResults(path: string, results: ValidationResult[]): ValidationResults {
		return new ValidationResults({ ...this.resultsByPath, [path]: results });
	}

	clearResults(path: string): ValidationResults {
		if (!(path in this.resultsByPath)) return this;
		const rest = { ...this.resultsByPath };
			delete rest[path];
			return new ValidationResults(rest);
	}

	clearAll(): ValidationResults {
		return new ValidationResults();
	}

	getRollup(): Record<string, { error: number; warning: number }> {
		return this._rollup;
	}
}
