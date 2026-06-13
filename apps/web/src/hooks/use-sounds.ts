import { useProjectSession } from "@project/core";
import { useMemo } from "react";
import type { ContentEntry } from "@project/types";
import { useBaseSounds } from "#/hooks/use-base-sounds";

export function useSounds(): ContentEntry[] {
	const projectItems = useProjectSession((s) => s.treeSnapshot.sounds);

	const data = useBaseSounds();

	return useMemo(() => {
		const items: ContentEntry[] = data.map((i) => ({
			name: i.name,
			type: "base" as const,
			path: i.path || `sounds/${i.name}`,
			contentType: "sounds",
		}));

		items.push(
			...projectItems.map((i) => ({
				name: i.name.substring(0, i.name.lastIndexOf(".")),
				type: "project" as const,
				path: i.path,
				contentType: "sounds",
			})),
		);
		return items;
	}, [projectItems, data]);
}
