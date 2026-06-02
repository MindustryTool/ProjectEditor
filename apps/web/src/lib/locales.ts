import i18n from "i18next";
import { loadValibotI18n } from "#/i18n/valibot-i18n";

export const SUPPORTED_LOCALES = ["en", "vi"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(lang: string): lang is Locale {
	return SUPPORTED_LOCALES.includes(lang as Locale);
}

export function getDetectedLocale(): Locale {
	if (typeof window === "undefined") return "en";

	const stored = window.localStorage.getItem("i18nextLng");
	if (stored && isSupportedLocale(stored)) return stored;

	const navLang = navigator.language?.split("-")[0];
	if (navLang && isSupportedLocale(navLang)) return navLang;

	return "en";
}

i18n.on("languageChanged", () => {
	loadValibotI18n(i18n.language as Locale);
});

export function setLocale(lang: Locale) {
	i18n.changeLanguage(lang);
	loadValibotI18n(lang);
}
