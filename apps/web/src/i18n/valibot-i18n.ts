import { setGlobalConfig } from "valibot";

const VALIBOT_LOCALE_IMPORTS: Record<string, () => Promise<unknown>> = {
	vi: () => import("@valibot/i18n/vi"),
};

let currentLocale: string | undefined;

export async function loadValibotI18n(locale: string): Promise<void> {
	if (locale === currentLocale) return;

	if (locale !== "en" && VALIBOT_LOCALE_IMPORTS[locale]) {
		await VALIBOT_LOCALE_IMPORTS[locale]();
        console.log("Loaded locale", locale)
	}

	setGlobalConfig({ lang: locale });
	currentLocale = locale;
}
