import { Panel } from "@/components/editor/Panel";
import { FieldsRenderer } from "#/components/editor/right/FieldsRenderer";
import { SpritePicker } from "#/components/editor/right/SpritePicker";
import { useFileName } from "#/hooks/use-path";
import { ItemHjsonSchema } from "@project/schema";

interface ItemPanelProps {
	path: string;
}

export function ItemPanel({ path }: ItemPanelProps) {
	const fileName = useFileName();

	return (
		<Panel>
			<div className="space-y-6 h-full w-full">
				{fileName !== null && <div className="text-lg font-bold">{fileName}</div>}
				<SpritePicker path={path} />
				<FieldsRenderer path={path} schema={ItemHjsonSchema} />
			</div>
		</Panel>
	);
}
