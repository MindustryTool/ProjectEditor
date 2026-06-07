import type { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { useValidationStore } from "@project/core";
import { useShallow } from "zustand/react/shallow";

interface TreeNodeLabelProps {
	name: string | ReactNode;
	currentPath: string;
	isFolder: boolean;
}

export function TreeNodeLabel({ name, currentPath, isFolder }: TreeNodeLabelProps) {
	const errorCount = useValidationStore(useShallow((s) => s.results.getRollup()[currentPath]?.error ?? 0));
	const warningCount = useValidationStore(useShallow((s) => s.results.getRollup()[currentPath]?.warning ?? 0));

	const className =
		errorCount > 0
			? "text-red-400 underline decoration-wavy"
			: !isFolder && warningCount > 0 && errorCount === 0
				? "text-yellow-400 underline decoration-wavy"
				: "text-foreground";

	return <span className={cn("flex-1 truncate", className)}>{name}</span>;
}
