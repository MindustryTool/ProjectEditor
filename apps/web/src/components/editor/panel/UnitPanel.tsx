import { Panel } from "@/components/editor/Panel";
import { FieldsRenderer } from "#/components/editor/panel/FieldsRenderer";
import { SpritePicker } from "#/components/editor/panel/SpritePicker";
import { useFileName } from "#/hooks/use-path";
import { UnitHjsonSchema } from "@project/schema";

interface UnitPanelProps {
	path: string;
}

export function UnitPanel({ path }: UnitPanelProps) {
	const fileName = useFileName();

	return (
		<Panel>
			<div className="space-y-6 h-full w-full">
				{fileName !== null && <div className="text-lg font-bold">{fileName}</div>}
				<SpritePicker path={path} />
				<FieldsRenderer path={path} schema={UnitHjsonSchema} />
			</div>
		</Panel>
	);
}
