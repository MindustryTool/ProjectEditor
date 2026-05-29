import { useValidationStore } from "@project/state";
import { useTranslation } from "react-i18next";
import { FileJson, Image } from "lucide-react";

export function StatusBarRight() {
	const { t } = useTranslation();
	const validationSummary = useValidationStore((s) => s.results.summary);

	return (
		<div className="flex items-center gap-2">
			{validationSummary.errors > 0 && (
				<span className="text-red-500">{t("statusBar.validationErrors", { count: validationSummary.errors })}</span>
			)}
			{validationSummary.warnings > 0 && (
				<span className="text-yellow-500">{t("statusBar.validationWarnings", { count: validationSummary.warnings })}</span>
			)}
			<FileJson className="h-3 w-3" />
			<Image className="h-3 w-3" />
		</div>
	);
}
