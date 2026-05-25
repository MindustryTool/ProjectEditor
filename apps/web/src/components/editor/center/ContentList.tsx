import { useCurrentProject } from "@project/state";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { File, Folder } from "lucide-react";
import { CreateNewContentDialog } from "#/components/editor/center/CreateNewContentDialog";
import { resolveJsonContentImage } from "~/lib/utils";

export function ContentList({ path }: { path: string }) {
	const context = useCurrentProject();
	const queryClient = useQueryClient();
	const [, setPath] = useQueryState("path");

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["files", path],
		queryFn: () => context.fs.listFiles(path),
		refetchOnMount: "always",
	});

	useEffect(() => {
		context.events.on("file:changed", () => {
			queryClient.invalidateQueries({ queryKey: ["files", path] });
		});
	}, [path]);

	if (isLoading) {
		return null;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2 p-2 w-full mb-auto">
			<CreateNewContentDialog />
			{data?.map((entry) => (
				<button
					key={entry.path}
					onClick={() => setPath(entry.path)}
					className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 hover:bg-accent transition-colors"
				>
					{entry.kind === "directory" ? (
						<Folder className="h-8 w-8 text-amber-500" />
					) : entry.name.endsWith(".json") ? (
						<img
							src={resolveJsonContentImage(entry.path) ?? ""}
							alt=""
							className="h-8 w-8 object-contain"
							onError={(e) => {
								(e.target as HTMLImageElement).style.display = "none";
							}}
						/>
					) : (
						<File className="h-8 w-8 text-muted-foreground" />
					)}
					<span className="text-xs text-center truncate w-full">{entry.name}</span>
				</button>
			))}
		</div>
	);
}
