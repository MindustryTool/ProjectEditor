export type StateFilter = "all" | "translated" | "untranslated" | "invalid";

export interface BundleRow {
	id: number;
	key: string;
	value: string;
	existsInBundle: boolean;
	isInvalid: boolean;
}
