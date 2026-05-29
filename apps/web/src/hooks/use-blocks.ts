import { useBaseBlocks } from "#/hooks/use-base-blocks";
import { useProjectSession, useCurrentProject } from "@project/state";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

export type ContentEntry = {
	name: string;
	type: "project" | "base";
	path: string;
	contentType: string;
	getContent: () => Promise<unknown>;
};

export function useBlocks(): ContentEntry[] {
	const projectItems = useProjectSession(
		useShallow((s) =>
			s.treeSnapshot.getEntries().filter((e) => e.kind === "file" && e.path.includes("content/blocks") && e.name.endsWith(".json")),
		),
	);

	const { data } = useBaseBlocks();
	const { fs } = useCurrentProject();

	return useMemo(() => {
		const items: ContentEntry[] = [];
		if (data) {
			items.push(...data.map((i) => ({
				name: i.name,
				type: "base" as const,
				path: `blocks/${i.name}`,
				contentType: "blocks",
				getContent: async () => "",
			})));
		}
		items.push(...projectItems.map((i) => ({
			name: i.name.replace(".json", ""),
			type: "project" as const,
			path: i.path,
			contentType: "blocks",
			getContent: async () => fs.readTextFile(i.path),
		})));
		return items;
	}, [projectItems, data, fs]);
}
