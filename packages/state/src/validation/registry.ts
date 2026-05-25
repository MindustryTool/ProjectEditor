import type { ValidatorRegistration, ValidatorRegistry } from "./types";

export function createValidatorRegistry(): ValidatorRegistry {
  const validators = new Map<string, ValidatorRegistration>();

  function matchGlob(pattern: string, filePath: string): boolean {
    const regexStr = pattern
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, "[^/]*")
      .replace(/\?/g, "[^/]");
    return new RegExp(`^${regexStr}$`).test(filePath);
  }

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
        if (matchGlob(v.pattern, filePath)) {
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
