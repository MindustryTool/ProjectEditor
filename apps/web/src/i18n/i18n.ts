import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

let initPromise: Promise<void> | null = null;

export function initI18n() {
	if (i18n.isInitialized) {
		return Promise.resolve();
	}

	if (initPromise) {
		return initPromise;
	}

	try {
		new Error("initI18n");
	} catch (error) {
		console.error(error);
	}

	initPromise = i18n
		.use(initReactI18next)
		.use(
			resourcesToBackend((lng: string) => {
				switch (lng) {
					case "en":
						return import("./locales/en/translation");
					case "vi":
						return import("./locales/vi/translation");
					default:
						throw new Error(`Unsupported language: ${lng}`);
				}
			}),
		)
		.init({
			lng: "en",
			fallbackLng: "en",
			interpolation: {
				escapeValue: false,
			},
		})
		.then(() => {});

	return initPromise;
}

export default i18n;
