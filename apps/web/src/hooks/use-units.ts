import { useBaseUnits } from "#/hooks/use-base-units";
import { useProjectSession, useCurrentProject } from "@project/state";
import { useMemo } from "react";
import type { ContentEntry } from "./use-blocks";

export function useUnits(): ContentEntry[] {
	const projectItems = useProjectSession((s) => s.treeSnapshot.units);

	const { data } = useBaseUnits();
	const { fs } = useCurrentProject();

	return useMemo(() => {
		const items: ContentEntry[] = [];
		if (data) {
			items.push(
				...data.map((i) => ({
					name: i.name,
					type: "base" as const,
					path: `units/${i.name}`,
					contentType: "units",
					getContent: async () => "",
				})),
			);
		}
		items.push(
			...projectItems.map((i) => ({
				name: i.name.replace(".json", ""),
				type: "project" as const,
				path: i.path,
				contentType: "units",
				getContent: async () => fs.readTextFile(i.path),
			})),
		);
		return items;
	}, [projectItems, data, fs]);
}
