import { useRecentlyOpened } from "./useRecentlyOpened";
import { RecentFileTab } from "./RecentFileTab";

export function RecentlyOpenedFilesBar() {
	const { recentFiles, path, handleTabClick, handleClose, isFileMissing } = useRecentlyOpened();

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
		</div>
	);
}
