import { useBaseStatuses } from "#/hooks/use-base-statuses";
import { useProjectSession } from "@project/core";
import { useMemo } from "react";
import type { ContentEntry } from "@project/types";
import type { ModHjsonData } from "@project/schema";

export function useStatuses(metadata: ModHjsonData): ContentEntry[] {
	const projectItems = useProjectSession((s) => s.treeSnapshot.statuses);

	const { data } = useBaseStatuses();


	return useMemo(() => {
		const items: ContentEntry[] = [];
		if (data) {
			items.push(
				...data.map((i) => ({
					name: i.name,
					type: "base" as const,
					path: `statuses/${i.name}`,
					contentType: "statuses",
				})),
			);
		}
		items.push(
			...projectItems.map((i) => ({
				name: metadata.name + "-" + i.name.replace(".json", ""),
				type: "project" as const,
				path: i.path,
				contentType: "statuses",
			})),
		);
		return items;
	}, [metadata.name, projectItems, data]);
}
