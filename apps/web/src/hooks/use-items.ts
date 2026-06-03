import { useBaseItems } from "#/hooks/use-base-items";
import { useProjectSession } from "@project/core";
import { useMemo } from "react";
import type { ContentEntry } from "./use-blocks";

export type UseItemsOptions = {
	project?: boolean;
	base?: boolean;
};

export function useItems({ project, base }: UseItemsOptions): ContentEntry[] {
	const projectItems = useProjectSession((s) => s.treeSnapshot.items);

	const { data } = useBaseItems();

	return useMemo(() => {
		const items: ContentEntry[] = [];
		if (base) {
			items.push(
				...(data?.map((i) => ({
					name: i.name,
					type: "base" as const,
					path: `items/${i.name}`,
					contentType: "items",
				})) || []),
			);
		}

		if (project) {
			items.push(
				...projectItems.map((i) => ({
					name: i.name.replace(".json", ""),
					type: "project" as const,
					path: i.path,
					contentType: "items",
				})),
			);
		}
		return items;
	}, [projectItems, data, project, base]);
}
