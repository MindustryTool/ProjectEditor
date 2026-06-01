import { useProjectSession, useCurrentProject } from "@project/state";
import { useMemo } from "react";
import type { ContentEntry } from "./use-blocks";
import { useBaseSounds } from "#/hooks/use-base-sounds";

export function useSounds(): ContentEntry[] {
	const projectItems = useProjectSession((s) => s.treeSnapshot.sounds);

	const { data } = useBaseSounds();
	const { fs } = useCurrentProject();

	return useMemo(() => {
		const items: ContentEntry[] = [];
		if (data) {
			items.push(
				...data.map((i) => ({
					name: i.name,
					type: "base" as const,
					path: `sounds/${i.name}`,
					contentType: "sounds",
					getContent: async () => {
						throw new Error("Should not be called");
					},
				})),
			);
		}
		items.push(
			...projectItems.map((i) => ({
				name: i.name.substring(0, i.name.lastIndexOf(".")),
				type: "project" as const,
				path: i.path,
				contentType: "sounds",
				getContent: async () => fs.readTextFile(i.path),
			})),
		);
		return items;
	}, [projectItems, data, fs]);
}
