import { useBaseLiquids } from "#/hooks/use-base-liquids";
import { useProjectSession } from "@project/core";
import { useMemo } from "react";
import type { ContentEntry } from "@project/types";
import type { ModHjsonData } from "@project/schema";

export function useLiquids(metadata: ModHjsonData): ContentEntry[] {
	const projectItems = useProjectSession((s) => s.treeSnapshot.liquids);

	const { data } = useBaseLiquids();

	return useMemo(() => {
		const items: ContentEntry[] = [];
		if (data) {
			items.push(
				...data.map((i) => ({
					name: i.name,
					type: "base" as const,
					path: `liquids/${i.name}`,
					contentType: "liquids",
				})),
			);
		}
		items.push(
			...projectItems.map((i) => ({
				name: metadata.name + "-" + i.name.replace(".json", ""),
				type: "project" as const,
				path: i.path,
				contentType: "liquids",
			})),
		);
		return items;
	}, [metadata.name, projectItems, data]);
}
