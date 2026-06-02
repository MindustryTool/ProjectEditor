import { useTranslation } from "react-i18next";

export function StatusBarCenter() {
	const { t } = useTranslation();

	return <span>{t("status-bar.ready")}</span>;
}
