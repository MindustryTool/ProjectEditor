import { useBaseStatuses } from "#/hooks/use-base-statuses";
import { useProjectSession, useCurrentProject } from "@project/state";
import { useMemo } from "react";
import type { ContentEntry } from "./use-blocks";

export function useStatuses(): ContentEntry[] {
	const projectItems = useProjectSession((s) => s.treeSnapshot.statuses);

	const { data } = useBaseStatuses();
	const { fs } = useCurrentProject();

	return useMemo(() => {
		const items: ContentEntry[] = [];
		if (data) {
			items.push(
				...data.map((i) => ({
					name: i.name,
					type: "base" as const,
					path: `statuses/${i.name}`,
					contentType: "statuses",
					getContent: async () => "",
				})),
			);
		}
		items.push(
			...projectItems.map((i) => ({
				name: i.name.replace(".json", ""),
				type: "project" as const,
				path: i.path,
				contentType: "statuses",
				getContent: async () => fs.readTextFile(i.path),
			})),
		);
		return items;
	}, [projectItems, data, fs]);
}
