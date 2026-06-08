export const SUPPORTED_LOCALES = {
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
} as const;

type SupportedLocale = keyof typeof SUPPORTED_LOCALES;

export const FLAG_MAP: Record<SupportedLocale, string> = {
	ca: "🇪🇸", // Catalonia (no official emoji, usually Spain)
	id_ID: "🇮🇩",
	da: "🇩🇰",
	de: "🇩🇪",
	et: "🇪🇪",
	en: "🇺🇸", // or 🇬🇧 depending on your preference
	es: "🇪🇸",
	eu: "🇪🇸", // Basque Country (no official emoji)
	fil: "🇵🇭",
	fr: "🇫🇷",
	it: "🇮🇹",
	lt: "🇱🇹",
	hu: "🇭🇺",
	nl: "🇳🇱",
	nl_BE: "🇧🇪",
	pl: "🇵🇱",
	pt_BR: "🇧🇷",
	pt_PT: "🇵🇹",
	ro: "🇷🇴",
	fi: "🇫🇮",
	sv: "🇸🇪",
	vi: "🇻🇳",
	tk: "🇹🇲",
	tr: "🇹🇷",
	cs: "🇨🇿",
	be: "🇧🇾",
	bg: "🇧🇬",
	ru: "🇷🇺",
	sr: "🇷🇸",
	uk_UA: "🇺🇦",
	th: "🇹🇭",
	zh_CN: "🇨🇳",
	zh_TW: "🇹🇼",
	ja: "🇯🇵",
	ko: "🇰🇷",
};

const BUNDLE_PATTERN = /^bundle(?:_([a-zA-Z_]+))?\.properties$/;

export function getLocaleFromFilename(filename: string): SupportedLocale | null {
	const match = BUNDLE_PATTERN.exec(filename);
	if (!match) return null;
	const code = match[1] as SupportedLocale;
	if (!code) return "en";
	if (code in SUPPORTED_LOCALES) {
		return code;
	}
	return null;
}

export function isBundleFilename(filename: string): boolean {
	return BUNDLE_PATTERN.test(filename);
}
