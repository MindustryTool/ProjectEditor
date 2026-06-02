import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ValidationResult, ValidationStore } from "./types";
import { ValidationResults } from "./types";

export const useValidationStore = create<ValidationStore>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "issue-store",
      partialize: (state) => ({
        resultsByPath: state.results.resultsByPath,
      }),
      merge: (persisted, current) => ({
        ...current,
        results: new ValidationResults((persisted as { resultsByPath?: Record<string, ValidationResult[]> } | undefined)?.resultsByPath),
      }),
    },
  ),
);
