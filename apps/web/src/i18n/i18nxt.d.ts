import "i18next";
import type { en as enCommon } from "./locales/en/common";
import type { en as enSchema } from "./locales/en/schema";

declare module "i18next" {
	interface CustomTypeOptions {
		defaultNS: "common";
		resources: {
			common: typeof enCommon;
			schema: typeof enSchema;
		};
	}
}
