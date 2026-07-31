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

export type Sprite = {
	name: string;
};

export type Effect = {
	name: string;
};

export type ContentEntry = {
	name: string;
	type: "project" | "base";
	path: string;
	contentType: string;
};

export type Sound = {
	name: string;
};

export type Weather = {
	name: string;
	type: "project" | "base";
	path: string;
	contentType: string;
};



export interface ProjectContents {
	readonly items: readonly Item[];
	readonly blocks: readonly Block[];
	readonly liquids: readonly Liquid[];
	readonly sectors: readonly Sector[];
	readonly statuses: readonly Status[];
	readonly units: readonly Unit[];
	readonly sprites: readonly Sprite[];
	readonly effects: readonly Effect[];
    readonly sounds: readonly Sound[];
	readonly weathers: readonly Weather[];
	readonly name: string;
}
