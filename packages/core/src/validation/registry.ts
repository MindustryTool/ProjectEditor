import type { ValidatorRegistration, ValidatorRegistry } from "./types";

export function createValidatorRegistry(): ValidatorRegistry {
	const validators = new Map<string, ValidatorRegistration>();

	return {
		register(registration: ValidatorRegistration): void {
			validators.set(registration.name, registration);
		},

		unregister(name: string): void {
			validators.delete(name);
		},

		getMatches(filePath: string): ValidatorRegistration[] {
			const matches: ValidatorRegistration[] = [];
			for (const v of validators.values()) {
				if (typeof v.pattern === "function" ? v.pattern(filePath) : v.pattern.test(filePath)) {
					matches.push(v);
				}
			}
			return matches;
		},

		getAll(): ValidatorRegistration[] {
			return Array.from(validators.values());
		},
	};
}
