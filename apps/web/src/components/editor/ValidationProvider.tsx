import { useEffect } from "react";
import { useValidationStore, useAppStore, useCurrentProject } from "@project/core";
import { useShallow } from "zustand/react/shallow";
import { usePath } from "#/hooks/use-path";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import { useParams } from "@tanstack/react-router";
import { validationService } from "#/services/validation-service";

export function ValidationProvider() {
	const [path] = usePath();
	const { lang } = useParams({ strict: false });
	const projectContext = useCurrentProject();
	const projectId = projectContext.project.id;
	const { contents } = useProjectContext();
	const validationDelayMs = useAppStore(useShallow((s) => s.settings.validation.validationDelayMs));

	useEffect(() => {
		validationService.contents = contents;
		validationService.revalidateFiles(projectId);
	}, [contents, projectId]);

	useEffect(() => {
		validationService.lang = lang;
		validationService.revalidateFiles(projectId);
	}, [lang, projectId]);

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
		if (path?.path && projectId) {
			validationService.scheduleValidation(projectId, path.path);
		}
	}, [path?.path, projectId]);

	return null;
}
