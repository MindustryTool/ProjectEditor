import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useLocalizationMenu() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	const handleCreateNewLocale = useCallback(() => {
		setOpen(true);
	}, []);

	return {
		open,
		setOpen,
		handleCreateNewLocale,
		t,
	};
}
