import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { en } from "./locales/en/translation";
import { vi } from "./locales/vi/translation";

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: { translation: en },
			vi: { translation: vi },
		},
		fallbackLng: "en",
		detection: {
			order: ["path", "localStorage", "navigator", "htmlTag"],
			lookupFromPathIndex: 0,
			caches: ["localStorage"],
		},
		interpolation: {
			escapeValue: false,
		},
	});

export type TranslationKey = keyof typeof en;

export default i18n;
