import { useBaseUnits } from "#/hooks/use-base-units";
import { useProjectSession } from "@project/core";
import { useMemo } from "react";
import type { ContentEntry } from "./use-blocks";

export function useUnits(): ContentEntry[] {
	const projectItems = useProjectSession((s) => s.treeSnapshot.units);

	const { data } = useBaseUnits();

	return useMemo(() => {
		const items: ContentEntry[] = [];
		if (data) {
			items.push(
				...data.map((i) => ({
					name: i.name,
					type: "base" as const,
					path: `units/${i.name}`,
					contentType: "units",
				})),
			);
		}
		items.push(
			...projectItems.map((i) => ({
				name: i.name.replace(".json", ""),
				type: "project" as const,
				path: i.path,
				contentType: "units",
			})),
		);
		return items;
	}, [projectItems, data]);
}
