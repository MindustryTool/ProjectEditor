export type ItemDto = {
	name: string;
	type: "project" | "base";
	path: string;
	contentType: string;
};

export type BlockDto = {
	name: string;
	type: "project" | "base";
	path: string;
	contentType: string;
};

export type LiquidDto = {
	name: string;
	type: "project" | "base";
	path: string;
	contentType: string;
};

export type SectorDto = {
	name: string;
	type: "project" | "base";
	path: string;
	contentType: string;
};

export type StatusDto = {
	name: string;
	type: "project" | "base";
	path: string;
	contentType: string;
};

export type UnitDto = {
	name: string;
	type: "project" | "base";
	path: string;
	contentType: string;
};

export type ProjectContents = {
	getItems(): ItemDto[];
	getBlocks(): BlockDto[];
	getLiquids(): LiquidDto[];
	getSectors(): SectorDto[];
	getStatuses(): StatusDto[];
	getUnits(): UnitDto[];
};

export function findContent(name: string, context: ProjectContents) {
	const items = context.getItems();

	const item = items.find((i) => i.name === name);

	if (item) {
		return item;
	}

	const blocks = context.getBlocks();
	const block = blocks.find((b) => b.name === name);
	if (block) {
		return block;
	}

	const liquids = context.getLiquids();
	const liquid = liquids.find((l) => l.name === name);
	if (liquid) {
		return liquid;
	}

	const sectors = context.getSectors();
	const sector = sectors.find((s) => s.name === name);
	if (sector) {
		return sector;
	}

	const statuses = context.getStatuses();
	const status = statuses.find((s) => s.name === name);
	if (status) {
		return status;
	}

	const units = context.getUnits();
	const unit = units.find((u) => u.name === name);
	if (unit) {
		return unit;
	}

	return null;
}
