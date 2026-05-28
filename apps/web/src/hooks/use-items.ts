import { useBaseItems } from "#/hooks/use-base-items";
import { useProjectSession } from "@project/state";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

export type UseItemsOptions = {
	project?: boolean;
	base?: boolean;
};

export type Item = { name: string; type: "project" | "base"; path: string };

export function useItems({ project, base }: UseItemsOptions): Item[] {
	const projectItems = useProjectSession(
		useShallow((s) =>
			s.treeSnapshot.getEntries().filter((e) => e.kind === "file" && e.path.includes("content/items") && e.name.endsWith(".json")),
		),
	);

	const { data } = useBaseItems();

	return useMemo(() => {
		const items: Item[] = [];
		if (base) {
			const temp: Item[] = data?.map((i) => ({ name: i.name, type: "base", path: `items/${i.name}` })) || [];
			items.push(...temp);
		}

		if (project) {
			const temp: Item[] = projectItems.map((i) => ({ name: i.name.replace(".json", ""), type: "project", path: i.path }));
			items.push(...temp);
		}
		return items;
	}, [projectItems, data]);
}
