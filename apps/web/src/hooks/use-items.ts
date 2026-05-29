import { useBaseItems } from "#/hooks/use-base-items";
import { useProjectSession, useCurrentProject } from "@project/state";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { ContentEntry } from "./use-blocks";

export type UseItemsOptions = {
	project?: boolean;
	base?: boolean;
};

export function useItems({ project, base }: UseItemsOptions): ContentEntry[] {
	const projectItems = useProjectSession(
		useShallow((s) =>
			s.treeSnapshot.getEntries().filter((e) => e.kind === "file" && e.path.includes("content/items") && e.name.endsWith(".json")),
		),
	);

	const { data } = useBaseItems();
	const { fs } = useCurrentProject();

	return useMemo(() => {
		const items: ContentEntry[] = [];
		if (base) {
			items.push(...(data?.map((i) => ({
				name: i.name,
				type: "base" as const,
				path: `items/${i.name}`,
				contentType: "items",
				getContent: async () => "",
			})) || []));
		}

		if (project) {
			items.push(...projectItems.map((i) => ({
				name: i.name.replace(".json", ""),
				type: "project" as const,
				path: i.path,
				contentType: "items",
				getContent: async () => fs.readTextFile(i.path),
			})));
		}
		return items;
	}, [projectItems, data, fs]);
}
