import { create } from "zustand";
import type { ValidationResult, ValidationStore } from "./types";
import { ValidationResults } from "./types";

export const useValidationStore = create<ValidationStore>()((set) => ({
	results: new ValidationResults(),

	setResults(path: string, results: ValidationResult[]): void {
		set((state) => ({
			results: state.results.setResults(path, results),
		}));
	},

	clearResults(path: string): void {
		set((state) => ({
			results: state.results.clearResults(path),
		}));
	},

	clearAll(): void {
		set({ results: new ValidationResults() });
	},
}));
