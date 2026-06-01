import { Panel } from "@/components/editor/Panel";
import { FieldsRenderer } from "#/components/editor/panel/FieldRenderer";
import { useFileString } from "@project/state";
import { useFileName } from "#/hooks/use-path";
import { HJSON, HjsonObjectNode } from "@project/hjson";
import { StatusHjsonSchema } from "@project/schema";
import { useProjectContext } from "#/components/editor/ProjectProvider";

interface StatusPanelProps {
	path: string;
}

export function StatusPanel({ path }: StatusPanelProps) {
	const { data, isLoading, write } = useFileString(path);
	const fileName = useFileName();
	const { contents } = useProjectContext();

	if (isLoading || data === null) {
		return null;
	}

	const result = HJSON.parseStructured(data);

	return (
		<Panel>
			<div className="space-y-6 h-full w-full">
				{fileName !== null && <div className="text-lg font-bold">{fileName}</div>}
				{result && result instanceof HjsonObjectNode && (
					<FieldsRenderer path={path} schema={StatusHjsonSchema(result, contents)} node={result} original={data} onPatch={write} />
				)}
			</div>
		</Panel>
	);
}
