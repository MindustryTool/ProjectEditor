import { useBaseSprites } from "#/hooks/use-base-sprites";
import { useProjectSession, useCurrentProject } from "@project/core";
import { useMemo } from "react";
import type { ContentEntry } from "./use-blocks";

export function useSprites(): ContentEntry[] {
	const projectItems = useProjectSession((s) => s.treeSnapshot.sprites);

	const { data } = useBaseSprites();
	const { fs } = useCurrentProject();

	return useMemo(() => {
		const items: ContentEntry[] = [];

		if (data) {
			items.push(
				...data.map((i) => ({
					name: i.name,
					type: "base" as const,
					path: `sprites/${i.name}`,
					contentType: "sprites",
					getContent: async () => "",
				})),
			);
		}

		projectItems.forEach((i) => {
			if (i.name.endsWith(".png")) {
				items.push({
					name: i.name.substring(0, i.name.lastIndexOf(".")),
					type: "project" as const,
					path: i.path,
					contentType: "sprites",
					getContent: async () => fs.readTextFile(i.path),
				});
			}
		});

		return items;
	}, [projectItems, data, fs]);
}
