import { useBaseItems } from "#/hooks/use-base-items";
import { useProjectSession } from "@project/core";
import { useMemo } from "react";
import type { ContentEntry } from "@project/types";
import type { ModHjsonData } from "@project/schema";

export function useItems(metadata: ModHjsonData): ContentEntry[] {
	const projectItems = useProjectSession((s) => s.treeSnapshot.items);

	const { data } = useBaseItems();

	return useMemo(() => {
		const items: ContentEntry[] = [];
		if (data) {
			items.push(
				...(data?.map((i) => ({
					name: i.name,
					type: "base" as const,
					path: `items/${i.name}`,
					contentType: "items",
				})) || []),
			);
		}

		items.push(
			...projectItems.map((i) => ({
				name: metadata.name + "-" + i.name.replace(".json", ""),
				type: "project" as const,
				path: i.path,
				contentType: "items",
			})),
		);

		return items;
	}, [projectItems, data, metadata.name]);
}
