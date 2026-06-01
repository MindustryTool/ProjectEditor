import { Panel } from "@/components/editor/Panel";
import { FieldsRenderer } from "#/components/editor/panel/FieldRenderer";
import { useFileString } from "@project/state";
import { SpritePicker } from "#/components/editor/panel/SpritePicker";
import { useFileName } from "#/hooks/use-path";
import { HJSON, HjsonObjectNode } from "@project/hjson";
import { ItemHjsonSchema } from "@project/schema";
import { useProjectContext } from "#/components/editor/ProjectProvider";

interface ItemPanelProps {
	path: string;
}

export function ItemPanel({ path }: ItemPanelProps) {
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
				<SpritePicker path={path} />
				{result && result instanceof HjsonObjectNode && (
					<FieldsRenderer path={path} schema={ItemHjsonSchema(result, contents)} node={result} original={data} onPatch={write} />
				)}
			</div>
		</Panel>
	);
}
