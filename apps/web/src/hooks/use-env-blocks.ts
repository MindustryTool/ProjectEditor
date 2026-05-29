import { useBaseEnvBlocks } from "#/hooks/use-base-env-blocks";
import { useProjectSession, useCurrentProject } from "@project/state";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { ContentEntry } from "./use-blocks";

export function useEnvBlocks(): ContentEntry[] {
	const projectItems = useProjectSession(
		useShallow((s) =>
			s.treeSnapshot.getEntries().filter((e) => e.kind === "file" && e.path.includes("content/env-blocks") && e.name.endsWith(".json")),
		),
	);

	const { data } = useBaseEnvBlocks();
	const { fs } = useCurrentProject();

	return useMemo(() => {
		const items: ContentEntry[] = [];
		if (data) {
			items.push(...data.map((i) => ({
				name: i.name,
				type: "base" as const,
				path: `env-blocks/${i.name}`,
				contentType: "env-blocks",
				getContent: async () => "",
			})));
		}
		items.push(...projectItems.map((i) => ({
			name: i.name.replace(".json", ""),
			type: "project" as const,
			path: i.path,
			contentType: "env-blocks",
			getContent: async () => fs.readTextFile(i.path),
		})));
		return items;
	}, [projectItems, data, fs]);
}
