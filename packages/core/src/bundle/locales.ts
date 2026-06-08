export const SUPPORTED_LOCALES: Record<string, string> = {
	ca: "Català",
	id_ID: "Bahasa Indonesia",
	da: "Dansk",
	de: "Deutsch",
	et: "Eesti",
	en: "English",
	es: "Español",
	eu: "Euskara",
	fil: "Filipino",
	fr: "Français",
	it: "Italiano",
	lt: "Lietuvių",
	hu: "Magyar",
	nl: "Nederlands",
	nl_BE: "Nederlands (België)",
	pl: "Polski",
	pt_BR: "Português (Brasil)",
	pt_PT: "Português (Portugal)",
	ro: "Română",
	fi: "Suomi",
	sv: "Svenska",
	vi: "Tiếng Việt",
	tk: "Türkmen dili",
	tr: "Türkçe",
	cs: "Čeština",
	be: "Беларуская",
	bg: "Български",
	ru: "Русский",
	sr: "Српски",
	uk_UA: "Українська",
	th: "ไทย",
	zh_CN: "简体中文",
	zh_TW: "正體中文",
	ja: "日本語",
	ko: "한국어",
};

const BUNDLE_PATTERN = /^bundle(?:_([a-zA-Z_]+))?\.properties$/;

export function getLocaleFromFilename(filename: string): string | null {
	const match = BUNDLE_PATTERN.exec(filename);
	if (!match) return null;
	const code = match[1];
	if (!code) return "en";
	if (code in SUPPORTED_LOCALES) return code;
	return null;
}

export function isBundleFilename(filename: string): boolean {
	return BUNDLE_PATTERN.test(filename);
}
