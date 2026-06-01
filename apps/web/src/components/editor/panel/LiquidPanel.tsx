import { Panel } from "@/components/editor/Panel";
import { FieldsRenderer } from "#/components/editor/panel/FieldRenderer";
import { useFileString } from "@project/state";
import { SpritePicker } from "#/components/editor/panel/SpritePicker";
import { useFileName } from "#/hooks/use-path";
import { HJSON, HjsonObjectNode } from "@project/hjson";
import { LiquidHjsonSchema } from "@project/schema";

interface LiquidPanelProps {
	path: string;
}

export function LiquidPanel({ path }: LiquidPanelProps) {
	const { data, isLoading, write } = useFileString(path);
	const fileName = useFileName();

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
					<FieldsRenderer path={path} schema={LiquidHjsonSchema} node={result} original={data} onPatch={write} />
				)}
			</div>
		</Panel>
	);
}
