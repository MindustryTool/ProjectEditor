import { useBaseBlocks } from "#/hooks/use-base-blocks";
import { useProjectSession } from "@project/core";
import { useMemo } from "react";

export type ContentEntry = {
	name: string;
	type: "project" | "base";
	path: string;
	contentType: string;
};

export function useBlocks(): ContentEntry[] {
	const projectItems = useProjectSession((s) => s.treeSnapshot.blocks);

	const { data } = useBaseBlocks();

	return useMemo(() => {
		const items: ContentEntry[] = [];
		if (data) {
			items.push(
				...data.map((i) => ({
					name: i.name,
					type: "base" as const,
					path: `blocks/${i.name}`,
					contentType: "blocks",
				})),
			);
		}
		items.push(
			...projectItems.map((i) => ({
				name: i.name.replace(".json", ""),
				type: "project" as const,
				path: i.path,
				contentType: "blocks",
			})),
		);
		return items;
	}, [projectItems, data]);
}
