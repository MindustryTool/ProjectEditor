import { Panel } from "@/components/editor/Panel";
import { FieldsRenderer } from "#/components/editor/right/FieldsRenderer";
import { SpritePicker } from "#/components/editor/right/SpritePicker";
import { useFileName } from "#/hooks/use-path";
import { BlockHjsonSchema } from "@project/schema";

interface BlockPanelProps {
	path: string;
}

export function BlockPanel({ path }: BlockPanelProps) {
	const fileName = useFileName();

	return (
		<Panel>
			<div className="space-y-6 h-full w-full">
				{fileName !== null && <div className="text-lg font-bold">{fileName}</div>}
				<SpritePicker path={path} />
				<FieldsRenderer path={path} schema={BlockHjsonSchema} />
			</div>
		</Panel>
	);
}
