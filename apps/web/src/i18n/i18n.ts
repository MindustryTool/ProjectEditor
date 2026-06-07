import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

let initPromise: Promise<void> | null = null;

const translations = import.meta.glob("./locales/*/translation.ts");

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
			resourcesToBackend(async (language: string) => {
				const loader = translations[`./locales/${language}/translation.ts`];

				if (!loader) {
					throw new Error(`Unsupported language: ${language}`);
				}

				const result = await loader();

				return (result as { default: Record<string, string> }).default;
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
