import type { ValidationContext, ValidationResult, ValidatorRegistry } from "./types";

export interface ValidationRunner {
	validate(path: string, content: string, context: ValidationContext): ValidationResult[];
	validateAll(files: { path: string; content: string }[], context: ValidationContext): Record<string, ValidationResult[]>;
}

export function createValidationRunner(registry: ValidatorRegistry): ValidationRunner {
	function validate(path: string, content: string, context: ValidationContext): ValidationResult[] {
		const validators = registry.getMatches(path);
		const results: ValidationResult[] = [];

		for (const v of validators) {
			try {
				const validatorResults = v.validate({ path, content, context });
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

	function validateAll(files: { path: string; content: string }[], context: ValidationContext): Record<string, ValidationResult[]> {
		const allResults: Record<string, ValidationResult[]> = {};
		for (const file of files) {
			allResults[file.path] = validate(file.path, file.content, context);
		}
		return allResults;
	}

	return { validate, validateAll };
}
