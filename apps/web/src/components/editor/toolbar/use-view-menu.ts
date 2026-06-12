import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useAppStore } from "@project/core";
import { SUPPORTED_LOCALES, type Locale } from "#/lib/locales";
import { useTheme } from "#/components/ThemeProvider";

export type Theme = "light" | "dark" | "system";

export const locales = [
	{ code: "en", label: "English" },
	{ code: "vi", label: "Tiếng Việt" },
] as const;

export function useViewMenu() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const { theme, setTheme } = useTheme();
	const updateSettings = useAppStore((s) => s.updateSettings);

	function handleThemeChange(mode: Theme) {
		setTheme(mode);
		updateSettings({ theme: mode });
	}

	function handleLanguageChange(code: Locale) {
		const segments = location.pathname.split("/").filter(Boolean);
		if (SUPPORTED_LOCALES.includes(segments[0] as Locale)) {
			segments[0] = code;
		} else {
			segments.unshift(code);
		}
		navigate({ to: `/${segments.join("/")}`, replace: true });
	}

	const currentLocale = locales.find((l) => location.pathname.startsWith(`/${l.code}`))?.code || "en";

	return {
		theme,
		locales,
		currentLocale,
		handleThemeChange,
		handleLanguageChange,
		t,
	};
}
