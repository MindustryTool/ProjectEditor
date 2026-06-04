import { useBaseBlocks } from "#/hooks/use-base-blocks";
import { useProjectSession, type ContentEntry } from "@project/core";
import type { ModHjsonData } from "@project/schema";
import { useMemo } from "react";

export function useBlocks(metadata: ModHjsonData): ContentEntry[] {
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
				name: metadata.name + "-" + i.name.replace(".json", ""),
				type: "project" as const,
				path: i.path,
				contentType: "blocks",
			})),
		);
		return items;
	}, [metadata.name, projectItems, data]);
}
