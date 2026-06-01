import type { ProjectContents } from "@project/core";
import type { ValidationResult, ValidatorRegistry } from "./types";

export interface ValidationRunner {
	validate(path: string, content: () => Promise<string>, context: ProjectContents): Promise<ValidationResult[]>;
	validateAll(
		files: { path: string; content: () => Promise<string> }[],
		context: ProjectContents,
	): Promise<Record<string, ValidationResult[]>>;
}

export function createValidationRunner(registry: ValidatorRegistry): ValidationRunner {
	async function validate(path: string, content: () => Promise<string>, context: ProjectContents): Promise<ValidationResult[]> {
		const validators = registry.getMatches(path);

		if (validators.length === 0) return [];

		let resolvedContent: string;
		try {
			resolvedContent = await content();
		} catch (err) {
			return [
				{
					path,
					severity: 0,
					messageKey: err instanceof Error ? err.message : "Unknown error",
					startLine: 1,
					startColumn: 1,
				},
			];
		}

		if (resolvedContent === null) {
			throw new Error("Content is null");
		}

		const results: ValidationResult[] = [];

		for (const v of validators) {
			try {
				const start = Date.now();
				const validatorResults = v.validate({ path, content: resolvedContent, context });
				results.push(...validatorResults);
				const duration = Date.now() - start;
				console.log({ task: "Validate", name: v.name, path, finish: true, duration: `${duration.toString()}ms` });
			} catch (err) {
				results.push({
					path,
					severity: 0,
					messageKey: "validation.internal.validatorError",
					messageParams: { name: v.name, error: String(err) },
					startLine: 1,
					startColumn: 1,
					endLine: 1,
					endColumn: 1,
				});
			}
		}

		return results;
	}

	async function validateAll(
		files: { path: string; content: () => Promise<string> }[],
		context: ProjectContents,
	): Promise<Record<string, ValidationResult[]>> {
		const allResults: Record<string, ValidationResult[]> = {};
		for (const file of files) {
			allResults[file.path] = await validate(file.path, file.content, context);
		}
		return allResults;
	}

	return { validate, validateAll };
}
