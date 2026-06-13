import { useBaseSprites } from "#/hooks/use-base-sprites";
import { useProjectSession } from "@project/core";
import { useMemo } from "react";
import type { ContentEntry } from "@project/types";

export function useSprites(): ContentEntry[] {
	const projectItems = useProjectSession((s) => s.treeSnapshot.sprites);

	const data = useBaseSprites();

	return useMemo(() => {
		const items: ContentEntry[] = data.map((i) => {
			const name = i.split("/").pop()!;

			return {
				name,
				type: "base" as const,
				path: `sprites/${i}`,
				contentType: "sprites",
			};
		});

		projectItems.forEach((i) => {
			if (i.name.endsWith(".png")) {
				items.push({
					name: i.name.substring(0, i.name.lastIndexOf(".")),
					type: "project" as const,
					path: i.path,
					contentType: "sprites",
				});
			}
		});

		return items;
	}, [projectItems, data]);
}
