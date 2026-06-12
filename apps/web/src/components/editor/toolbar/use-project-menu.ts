import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useProjectSession, useAppStore } from "@project/core";
import { toast } from "sonner";
import { useProjectActions } from "#/hooks/use-project-actions";
import type { ProjectRecord } from "@project/schema";
import type { ProjectLanguage } from "@project/core";

export function useProjectMenu() {
	const navigate = useNavigate();
	const hasProject = useProjectSession((state) => state.projectContext !== null);
	const { close } = useProjectActions();
	const createProject = useAppStore((s) => s.createNewProject);
	const open = useAppStore((s) => s.openProject);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [importing, setImporting] = useState(false);
	const [paths, setPaths] = useState<string[]>([]);
	const listRef = useRef<HTMLDivElement>(null);

	const navigateToProject = useCallback(
		(id: string) => {
			navigate({ to: `/en/projects/${id}`, replace: true });
		},
		[navigate],
	);

	const handleImportProject = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleFileSelected = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			setImporting(true);
			setPaths([]);

			try {
				const buffer = await file.arrayBuffer();
				const project = await useAppStore.getState().importProject(buffer, (path) => {
					setPaths((prev) => [...prev, path]);
				});

				navigateToProject(project.id);
				toast.success(`Project imported successfully`);
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Failed to import project");
			} finally {
				setImporting(false);
			}

			e.target.value = "";
		},
		[navigateToProject],
	);

	const handleCreateProject = useCallback(
		async (name: string, language: ProjectLanguage) => {
			try {
				const context = await createProject(name, language);
				navigateToProject(context.project.id);
				toast.success("Project created successfully");
			} catch (e) {
				toast.error(`Failed to create project ${e}`);
			}
		},
		[createProject, navigateToProject],
	);

	const handleOpenProject = useCallback(
		async (record: ProjectRecord) => {
			await open(record);
			navigateToProject(record.id);
		},
		[open, navigateToProject],
	);

	const handleChangeProject = useCallback(
		async (record: ProjectRecord) => {
			close();
			await open(record);
			navigateToProject(record.id);
		},
		[close, open, navigateToProject],
	);

	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
		}
	}, [paths]);

	return {
		hasProject,
		close,
		fileInputRef,
		importing,
		paths,
		listRef,
		handleImportProject,
		handleFileSelected,
		handleCreateProject,
		handleOpenProject,
		handleChangeProject,
	};
}
