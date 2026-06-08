export type BundleEntryType = "comment" | "entry" | "invalid" | "blank";

export interface BundleEntry {
	type: BundleEntryType;
	key?: string;
	value?: string;
	raw: string;
}

export interface BundleFile {
	entries: BundleEntry[];
}
