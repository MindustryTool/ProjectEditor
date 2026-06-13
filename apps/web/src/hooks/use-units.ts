import { useBaseUnits } from "#/hooks/use-base-units";
import { useProjectSession } from "@project/core";
import { useMemo } from "react";
import type { ContentEntry } from "@project/types";
import type { ModHjsonData } from "@project/schema";

export function useUnits(metadata: ModHjsonData): ContentEntry[] {
	const projectItems = useProjectSession((s) => s.treeSnapshot.units);

	const data = useBaseUnits();

	return useMemo(() => {
		const items: ContentEntry[] = data.map((i) => ({
			name: i.name,
			type: "base" as const,
			path: `units/${i.name}`,
			contentType: "units",
		}));

		items.push(
			...projectItems.map((i) => ({
				name: metadata.name + "-" + i.name.replace(".json", ""),
				type: "project" as const,
				path: i.path,
				contentType: "units",
			})),
		);
		return items;
	}, [metadata.name, projectItems, data]);
}
