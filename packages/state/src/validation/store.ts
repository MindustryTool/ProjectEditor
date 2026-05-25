import { create } from "zustand";
import type { ValidationResult, ValidationStore, ValidationSummary } from "./types";

function computeSummary(resultsByPath: Record<string, ValidationResult[]>): ValidationSummary {
  let errors = 0;
  let warnings = 0;
  let infos = 0;
  let deprecated = 0;

  for (const results of Object.values(resultsByPath)) {
    for (const r of results) {
      if (r.severity === 0) errors++;
      else if (r.severity === 1) warnings++;
      else if (r.severity === 2) infos++;
      else if (r.severity === 3) deprecated++;
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

export const useValidationStore = create<ValidationStore>((set) => ({
  resultsByPath: {},
  summary: { total: 0, errors: 0, warnings: 0, infos: 0, deprecated: 0 },

  setResults(path: string, results: ValidationResult[]): void {
    set((state) => {
      const next = { ...state.resultsByPath, [path]: results };
      return { resultsByPath: next, summary: computeSummary(next) };
    });
  },

  clearResults(path: string): void {
    set((state) => {
      const { [path]: _, ...rest } = state.resultsByPath;
      return { resultsByPath: rest, summary: computeSummary(rest) };
    });
  },

  clearAll(): void {
    set({ resultsByPath: {}, summary: { total: 0, errors: 0, warnings: 0, infos: 0, deprecated: 0 } });
  },
}));
