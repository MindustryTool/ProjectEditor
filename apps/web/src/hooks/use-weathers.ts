import { useBaseWeathers } from "#/hooks/use-base-weathers";
import { useProjectSession } from "@project/core";
import { useMemo } from "react";
import type { ContentEntry } from "@project/types";
import type { ModHjsonData } from "@project/schema";

export function useWeathers(metadata: ModHjsonData): ContentEntry[] {
	const projectItems = useProjectSession((s) => s.treeSnapshot.weathers);

	const data = useBaseWeathers();

	return useMemo(() => {
		const items: ContentEntry[] = data.map((i) => ({
			name: i.name,
			type: "base" as const,
			path: `weathers/${i.name}`,
			contentType: "weathers",
		}));

		items.push(
			...projectItems.map((i) => ({
				name: metadata.name + "-" + i.name.replace(".json", "").replace(".hjson", ""),
				type: "project" as const,
				path: i.path,
				contentType: "weathers",
			})),
		);
		return items;
	}, [metadata.name, projectItems, data]);
}
