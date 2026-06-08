import { useProjectSession } from "@project/core";
import { X } from "lucide-react";
import { cn } from "~/lib/utils";
import { FileIcon } from "#/components/editor/FileIcon";
import type { RecentFileEntry } from "@project/core";

interface RecentFileTabProps {
	entry: RecentFileEntry;
	onClick: (filePath: string) => void;
	onClose: (filePath: string) => void;
}

export function RecentFileTab({ entry, onClick, onClose }: RecentFileTabProps) {
	const name = entry.path.split("/").pop() ?? entry.path;
	const isActive = useProjectSession((s) => s.selectedPath === entry.path);
	const isMissing = useProjectSession((s) => !s.treeSnapshot.contains(entry.path));

	return (
		<button
			className={cn(
				"group flex items-center gap-1 px-2 py-1 text-xs transition-colors bg-accent/40 h-full rounded",
				isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
				isMissing && "line-through text-destructive",
			)}
			onClick={() => onClick(entry.path)}
			onContextMenu={(e) => {
				e.preventDefault();
				onClose(entry.path);
			}}
		>
			<FileIcon path={entry.path} />
			<span className="truncate">{name}</span>
			<span
				role="button"
				tabIndex={-1}
				onClick={(e) => {
					e.stopPropagation();
					e.preventDefault();
					onClose(entry.path);
				}}
				className={cn(
					"flex ml-auto size-4 items-center justify-center rounded hover:bg-muted-foreground/20",
					isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
				)}
			>
				<X className="size-3" />
			</span>
		</button>
	);
}
