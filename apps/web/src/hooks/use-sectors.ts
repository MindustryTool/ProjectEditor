import { useBaseSectors } from "#/hooks/use-base-sectors";
import { useProjectSession, useCurrentProject } from "@project/state";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { ContentEntry } from "./use-blocks";

export function useSectors(): ContentEntry[] {
	const projectItems = useProjectSession(
		useShallow((s) =>
			s.treeSnapshot.getEntries().filter((e) => e.kind === "file" && e.path.includes("content/sectors") && e.name.endsWith(".json")),
		),
	);

	const { data } = useBaseSectors();
	const { fs } = useCurrentProject();

	return useMemo(() => {
		const items: ContentEntry[] = [];
		if (data) {
			items.push(...data.map((i) => ({
				name: i.name,
				type: "base" as const,
				path: `sectors/${i.name}`,
				contentType: "sectors",
				getContent: async () => "",
			})));
		}
		items.push(...projectItems.map((i) => ({
			name: i.name.replace(".json", ""),
			type: "project" as const,
			path: i.path,
			contentType: "sectors",
			getContent: async () => fs.readTextFile(i.path),
		})));
		return items;
	}, [projectItems, data, fs]);
}
