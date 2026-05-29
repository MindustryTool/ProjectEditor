export function getItemTemplate(name: string): string {
	return JSON.stringify(
		{
			name,
			hardness: 1,
			cost: 1,
			color: "#ffffff",
			research: { parent: "", requirements: [] },
		},
		null,
		2,
	);
}

export function getBlockTemplate(name: string): string {
	return JSON.stringify(
		{
			name,
			health: 200,
			size: 1,
			requirements: [],
			category: "crafting",
			research: { parent: "", requirements: [] },
		},
		null,
		2,
	);
}

export function getUnitTemplate(name: string): string {
	return JSON.stringify(
		{
			name,
			health: 200,
			speed: 1,
			hitSize: 8,
			armor: 1,
			research: { parent: "", requirements: [] },
		},
		null,
		2,
	);
}

export function getEffectTemplate(name: string): string {
	return JSON.stringify(
		{
			name,
		},
		null,
		2,
	);
}
