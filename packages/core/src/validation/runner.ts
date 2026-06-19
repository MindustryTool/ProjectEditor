import type { ProjectContents } from "@project/types";
import { ValidationCode, type ValidationResult, type ValidatorRegistry } from "./types";

export interface ValidationRunner {
	validate(path: string, content: () => Promise<string>, context: ProjectContents): Promise<ValidationResult[]>;
}

export function createValidationRunner(registry: ValidatorRegistry): ValidationRunner {
	async function validate(path: string, content: () => Promise<string>, context: ProjectContents): Promise<ValidationResult[]> {
		const start = Date.now();
		const validators = registry.getMatches(path);

		if (validators.length === 0) return [];

		let resolvedContent: string;
		try {
			resolvedContent = await content();
		} catch (err) {
			return [
				{
					path,
					severity: "error",
					code: ValidationCode.INTERNAL_ERROR,
					messageKey: err instanceof Error ? err.message : "Unknown error",
					startLine: 1,
					startColumn: 1,
                    duration: Date.now() - start,
				},
			];
		}

		if (resolvedContent === null) {
			throw new Error("Content is null");
		}

		const results: ValidationResult[] = [];

		for (const v of validators) {
			try {
				const validatorResults = await v.validate({ path, content: resolvedContent, context });
				results.push(...validatorResults);
			} catch (err) {
				results.push({
					path,
					severity: "error",
					messageKey: "validation.internal.validator-error",
					code: ValidationCode.INTERNAL_ERROR,
					messageParams: { name: v.name, error: String(err) },
					startLine: 1,
					startColumn: 1,
					endLine: 1,
					endColumn: 1,
                    duration: Date.now() - start,
				});
			}
		}

		const duration = Date.now() - start;
		if (duration > 50) {
			console.log({ task: "Validate", path, duration: `${duration.toString()}ms` });
		}

		return results;
	}

	return { validate };
}
