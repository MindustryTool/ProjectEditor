import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en as enCommon } from "./locales/en/common";
import { en as enSchema } from "./locales/en/schema";
import { vi as viCommon } from "./locales/vi/common";
import { vi as viSchema } from "./locales/vi/schema";

i18n.use(initReactI18next).init({
	resources: {
		en: { common: enCommon, schema: enSchema },
		vi: { common: viCommon, schema: viSchema },
	},
	lng: "en",
	fallbackLng: "en",
	defaultNS: "common",
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
