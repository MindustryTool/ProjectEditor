import { useBaseSectors } from "#/hooks/use-base-sectors";
import { useProjectSession, useCurrentProject } from "@project/state";
import { useMemo } from "react";
import type { ContentEntry } from "./use-blocks";

export function useSectors(): ContentEntry[] {
	const projectItems = useProjectSession(s => s.treeSnapshot.sectors);

	const { data } = useBaseSectors();
	const { fs } = useCurrentProject();

	return useMemo(() => {
		const items: ContentEntry[] = [];
		if (data) {
			items.push(...data.map((i) => ({
				name: i.name,
				type: "base" as const,
				path: `sectors/${i.name}`,
				contentType: "sectors",
				getContent: async () => "",
			})));
		}
		items.push(...projectItems.map((i) => ({
			name: i.name.replace(".json", ""),
			type: "project" as const,
			path: i.path,
			contentType: "sectors",
			getContent: async () => fs.readTextFile(i.path),
		})));
		return items;
	}, [projectItems, data, fs]);
}
