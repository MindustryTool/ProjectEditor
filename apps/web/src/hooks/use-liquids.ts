import { useBaseLiquids } from "#/hooks/use-base-liquids";
import { useProjectSession, useCurrentProject } from "@project/core";
import { useMemo } from "react";
import type { ContentEntry } from "./use-blocks";

export function useLiquids(): ContentEntry[] {
	const projectItems = useProjectSession((s) => s.treeSnapshot.liquids);

	const { data } = useBaseLiquids();
	const { fs } = useCurrentProject();

	return useMemo(() => {
		const items: ContentEntry[] = [];
		if (data) {
			items.push(
				...data.map((i) => ({
					name: i.name,
					type: "base" as const,
					path: `liquids/${i.name}`,
					contentType: "liquids",
					getContent: async () => "",
				})),
			);
		}
		items.push(
			...projectItems.map((i) => ({
				name: i.name.replace(".json", ""),
				type: "project" as const,
				path: i.path,
				contentType: "liquids",
				getContent: async () => fs.readTextFile(i.path),
			})),
		);
		return items;
	}, [projectItems, data, fs]);
}
