import { useRecentlyOpened } from "./useRecentlyOpened";
import { RecentFileTab } from "./RecentFileTab";
import { Trash } from "lucide-react";

export function RecentlyOpenedFilesBar() {
	const { recentFiles, path, handleTabClick, handleClose, isFileMissing, handleClear } = useRecentlyOpened();

	if (recentFiles.length === 0) return null;

	return (
		<div className="flex items-center gap-px overflow-x-auto py-0.5">
			{recentFiles.map((entry) => (
				<RecentFileTab
					key={entry.path}
					entry={entry}
					isActive={entry.path === path}
					isMissing={isFileMissing(entry.path)}
					onClick={handleTabClick}
					onClose={handleClose}
				/>
			))}
			{recentFiles.length > 2 && (
				<button
					className="h-full flex items-center gap-1 px-2 py-1 text-xs transition-colors bg-accent/40 text-destructive"
					onClick={handleClear}
				>
					<Trash className="size-3" />
				</button>
			)}
		</div>
	);
}
