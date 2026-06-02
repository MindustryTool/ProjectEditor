export type Item = {
	name: string;
	type: "project" | "base";
	path: string;
	contentType: string;
};

export type Block = {
	name: string;
	type: "project" | "base";
	path: string;
	contentType: string;
};

export type Liquid = {
	name: string;
	type: "project" | "base";
	path: string;
	contentType: string;
};

export type Sector = {
	name: string;
	type: "project" | "base";
	path: string;
	contentType: string;
};

export type Status = {
	name: string;
	type: "project" | "base";
	path: string;
	contentType: string;
};

export type Unit = {
	name: string;
	type: "project" | "base";
	path: string;
	contentType: string;
};

export type ProjectContents = {
	getItems(): Item[];
	getBlocks(): Block[];
	getLiquids(): Liquid[];
	getSectors(): Sector[];
	getStatuses(): Status[];
	getUnits(): Unit[];
};
