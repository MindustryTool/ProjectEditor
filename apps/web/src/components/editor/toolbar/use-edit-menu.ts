import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAppStore, useFileString, useProjectSession } from "@project/core";
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

	return {
		path,
		canFormat,
		handleFormat,
	};
}
