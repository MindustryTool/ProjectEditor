import { useProjectStore } from "@project/state";
import { useTranslation } from "react-i18next";

export function StatusBarLeft() {
	const { t } = useTranslation();
	const projectName = useProjectStore((state) => state.projectContext?.project.name ?? "");

	return (
		<>
			<span>{t("statusBar.project", { name: projectName })}</span>
			<span className="text-muted-foreground">|</span>
			<span>{t("statusBar.files", { count: 0 })}</span>
		</>
	);
}
