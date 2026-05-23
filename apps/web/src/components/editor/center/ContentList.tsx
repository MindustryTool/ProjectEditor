import { useCurrentProject } from "@project/state";
import type { FileEntry } from "@project/fs";
import { useEffect, useState } from "react";

export function ContentList({ path }: { path: string }) {
	const context = useCurrentProject();
	const [files, setFiles] = useState<FileEntry[]>([]);

	useEffect(() => {
		context.fs
			.listFiles(path)
			.then((files) => {
				setFiles(files);
			})
			.catch(() => {
				setFiles([]);
			});
	}, [path]);

	return (
		<div>
			{files.map((entry) => (
				<div key={entry.path}>{entry.name}</div>
			))}
		</div>
	);
}
