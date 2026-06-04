import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useValidationStore, useAppStore, useCurrentProject, type ValidationBatchFile, type ValidationResult } from "@project/core";
import { useShallow } from "zustand/react/shallow";
import { usePath } from "#/hooks/use-path";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import { useParams } from "@tanstack/react-router";
import { validationService } from "#/services/validation-service";

export interface ValidationContextValue {
	validateFile: (path: string, getContent: () => Promise<string>) => Promise<void>;
	validateFiles: (files: ValidationBatchFile[]) => Promise<Record<string, ValidationResult[]> | null>;
}

const ValidationFileContext = createContext<ValidationContextValue | null>(null);

export function useValidationContext(): ValidationContextValue {
	const ctx = useContext(ValidationFileContext);

	if (!ctx) throw new Error("useValidationContext() must be used within a ValidationProvider");

	return ctx;
}

export function ValidationProvider({ children }: { children: ReactNode }) {
	const [path] = usePath();
	const { lang } = useParams({ strict: false });
	const projectContext = useCurrentProject();
	const projectId = projectContext.project.id;
	const { contents } = useProjectContext();
	const validationDelayMs = useAppStore(useShallow((s) => s.settings.validation.validationDelayMs));

	useEffect(() => {
		validationService.contents = contents;
	}, [contents]);

	useEffect(() => {
		validationService.lang = lang;
	}, [lang]);

	useEffect(() => {
		validationService.validationDelayMs = validationDelayMs;
	}, [validationDelayMs]);

	useEffect(() => {
		void validationService.ensureWorker();
	}, []);

	useEffect(() => {
		const events = projectContext.events;

		const unsubWrite = events.on("file:write", (event) => {
			validationService.scheduleValidation(projectId, event.path);
		});

		const unsubCreate = events.on("file:create", (event) => {
			validationService.scheduleValidation(projectId, event.path);
		});

		const unsubDelete = events.on("file:delete", (event) => {
			validationService.cancelPending(event.path, projectId);
			useValidationStore.getState().clearResults(event.path);
		});

		return () => {
			unsubWrite();
			unsubCreate();
			unsubDelete();
			validationService.clearAllTimers();
		};
	}, [projectContext, projectId]);

	useEffect(() => {
		if (path && projectId) {
			validationService.scheduleValidation(projectId, path);
		}
	}, [path, projectId]);

	useEffect(() => {
		for (const path of Object.keys(useValidationStore.getState().results.resultsByPath)) {
			validationService.scheduleValidation(projectId, path);
		}
	}, [projectId]);

	const ctxValue = useMemo<ValidationContextValue>(
		() => ({
			validateFile: validationService.validateFile,
			validateFiles: validationService.validateFiles,
		}),
		[],
	);

	return <ValidationFileContext.Provider value={ctxValue}>{children}</ValidationFileContext.Provider>;
}
