import { useFileContent } from "@project/state";

export function JsonEditor({ path }: { path: string }) {
	const { data, update } = useFileContent(path);

	return (
		<textarea
			className="resize-none w-full h-full p-1 text-sm"
			spellCheck={false}
			value={data ?? ""}
			onChange={(e) => update(e.target.value)}
		/>
	);
}
