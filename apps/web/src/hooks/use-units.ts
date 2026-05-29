import { useBaseUnits } from "#/hooks/use-base-units";
import { useProjectSession, useCurrentProject } from "@project/state";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { ContentEntry } from "./use-blocks";

export function useUnits(): ContentEntry[] {
	const projectItems = useProjectSession(
		useShallow((s) =>
			s.treeSnapshot.getEntries().filter((e) => e.kind === "file" && e.path.includes("content/units") && e.name.endsWith(".json")),
		),
	);

	const { data } = useBaseUnits();
	const { fs } = useCurrentProject();

	return useMemo(() => {
		const items: ContentEntry[] = [];
		if (data) {
			items.push(...data.map((i) => ({
				name: i.name,
				type: "base" as const,
				path: `units/${i.name}`,
				contentType: "units",
				getContent: async () => "",
			})));
		}
		items.push(...projectItems.map((i) => ({
			name: i.name.replace(".json", ""),
			type: "project" as const,
			path: i.path,
			contentType: "units",
			getContent: async () => fs.readTextFile(i.path),
		})));
		return items;
	}, [projectItems, data, fs]);
}
