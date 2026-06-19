import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAppStore, useFileString, useProjectSession, useUndoRedoStore } from "@project/core";
import { usePath } from "#/hooks/use-path";
import { canFormatFilePath, formatFileContent } from "#/lib/format-file-content";

export function useEditMenu() {
	const { t } = useTranslation();
	const [pathEntry] = usePath();
	const path = pathEntry?.path ?? null;
	const { data, write } = useFileString(path ?? "");
	const settings = useAppStore((s) => s.settings);
	const projectId = useProjectSession((s) => s.projectContext?.project.id);
	const canFormat = path ? canFormatFilePath(path) : false;

	const canUndo = useUndoRedoStore((s) => (projectId && path ? s.canUndo(projectId, path) : false));
	const canRedo = useUndoRedoStore((s) => (projectId && path ? s.canRedo(projectId, path) : false));

	const handleUndo = useCallback(() => {
		if (!projectId || !path) return;
		useUndoRedoStore.getState().undo(projectId, path);
	}, [projectId, path]);

	const handleRedo = useCallback(() => {
		if (!projectId || !path) return;
		useUndoRedoStore.getState().redo(projectId, path);
	}, [projectId, path]);

	const handleFormat = useCallback(() => {
		if (!projectId || !path || !canFormatFilePath(path)) {
			return;
		}

		if (!data) {
			return;
		}

		try {
			const formatted = formatFileContent(path, data, { indent: settings.tabSize });
			write(formatted);
			toast.success(t("edit-menu.format-success", "Formatted successfully"));
		} catch (error) {
			toast.error(
				t("edit-menu.format-failed", {
					error: error instanceof Error ? error.message : String(error),
				}),
			);
		}
	}, [projectId, path, data, settings.tabSize, write, t]);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.target as Element)?.closest("input, textarea, select")) return;

			if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
				e.preventDefault();
				if (projectId && path) {
					useUndoRedoStore.getState().undo(projectId, path);
				}
				return;
			}

			if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
				e.preventDefault();
				if (projectId && path) {
					useUndoRedoStore.getState().redo(projectId, path);
				}
				return;
			}

			if ((e.ctrlKey || e.metaKey) && e.key === "y") {
				e.preventDefault();
				if (projectId && path) {
					useUndoRedoStore.getState().redo(projectId, path);
				}
				return;
			}
		};

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [projectId, path]);

	return {
		path,
		canFormat,
		canUndo,
		canRedo,
		handleUndo,
		handleRedo,
		handleFormat,
	};
}
