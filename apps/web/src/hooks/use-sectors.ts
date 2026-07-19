import { useBaseSectors } from "#/hooks/use-base-sectors";
import { useProjectSession } from "@project/core";
import { useMemo } from "react";
import type { ContentEntry } from "@project/types";
import type { ModHjsonData } from "@project/schema";

export function useSectors(metadata: ModHjsonData): ContentEntry[] {
	const projectItems = useProjectSession((s) => s.treeSnapshot.sectors);

	const data = useBaseSectors();

	return useMemo(() => {
		const items: ContentEntry[] = data.map((i) => ({
			name: i.name,
			type: "base" as const,
			path: `sectors/${i.name}`,
			contentType: "sectors",
		}));

		items.push(
			...projectItems.map((i) => ({
				name: metadata.name + "-" + i.name.replace(".json", "").replace(".hjson", ""),
				type: "project" as const,
				path: i.path,
				contentType: "sectors",
			})),
		);
		return items;
	}, [metadata.name, projectItems, data]);
}
