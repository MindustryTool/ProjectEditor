import type { ValidationContext, ValidationResult, ValidatorRegistry } from "./types";

export interface ValidationRunner {
	validate(path: string, content: () => Promise<string>, context: ValidationContext): Promise<ValidationResult[]>;
	validateAll(
		files: { path: string; content: () => Promise<string> }[],
		context: ValidationContext,
	): Promise<Record<string, ValidationResult[]>>;
}

export function createValidationRunner(registry: ValidatorRegistry): ValidationRunner {
	async function validate(path: string, content: () => Promise<string>, context: ValidationContext): Promise<ValidationResult[]> {
		const validators = registry.getMatches(path);
        
		if (validators.length === 0) return [];

		console.log(`Validate: ${path}`);

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

		const results: ValidationResult[] = [];

		for (const v of validators) {
			try {
				const validatorResults = v.validate({ path, content: resolvedContent, context });
				results.push(...validatorResults);
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
		context: ValidationContext,
	): Promise<Record<string, ValidationResult[]>> {
		const allResults: Record<string, ValidationResult[]> = {};
		for (const file of files) {
			allResults[file.path] = await validate(file.path, file.content, context);
		}
		return allResults;
	}

	return { validate, validateAll };
}
