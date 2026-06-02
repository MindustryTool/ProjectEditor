import { useProjectSession } from "@project/state";
import { useTranslation } from "react-i18next";

export function StatusBarLeft() {
	const { t } = useTranslation();
	const projectName = useProjectSession((state) => state.projectContext?.project.name ?? "");

	return (
		<>
			<span>{t("status-bar.project", { name: projectName })}</span>
			<span className="text-muted-foreground">|</span>
			<span>{t("status-bar.files", { count: 0 })}</span>
		</>
	);
}
