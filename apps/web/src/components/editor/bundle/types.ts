export type RowState = "translated" | "untranslated" | "extra" | "missing" | "invalid";
export type StateFilter = "all" | "translated" | "untranslated" | "extra" | "missing" | "invalid";

export interface BundleRow {
	id: number;
	key: string;
	value: string;
	state: RowState;
}
