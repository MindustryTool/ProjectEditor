import type { ProjectContents } from "@project/types";

export type SeverityLevel = "error" | "warning" | "info" | "deprecated";

export function severityLabel(level: string): string {
	if (level === "error" || level === "warning" || level === "info" || level === "deprecated") return level;
	return "error";
}

export function isErrorOrWarning(level: string): boolean {
	return level === "error" || level === "warning";
}

export interface ValidationResult<Tkey extends string = string> {
	path: string;
	severity: string;
	messageKey: Tkey;
	messageParams?: Record<string, unknown>;
	startLine: number;
	startColumn: number;
	endLine?: number;
	endColumn?: number;
	field?: string;
	fixs?: {
		messageKey: Tkey;
		messageParams?: Record<string, unknown>;
	}[];
	duration: number;
}

export type ValidatorFn = (params: { path: string; content: string; context: ProjectContents }) => Promise<ValidationResult[]>;

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
	[severity: string]: number;
}

export interface ValidationStore {
	results: ValidationResults;
	setResults(path: string, results: ValidationResult[]): void;
	clearResults(path: string): void;
	clearAll(): void;
}

function computeSummary(resultsByPath: Record<string, ValidationResult[]>): ValidationSummary {
	const counts: Record<string, number> = {};

	for (const results of Object.values(resultsByPath)) {
		for (const r of results) {
			const key = r.severity || "error";
			counts[key] = (counts[key] ?? 0) + 1;
		}
	}

	return {
		total: Object.values(counts).reduce((sum, c) => sum + c, 0),
		...counts,
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

			const errors = results.filter((r) => r.severity === "error").length;
			const warnings = results.filter((r) => r.severity === "warning").length;
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
