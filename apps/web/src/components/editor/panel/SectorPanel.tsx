import { Panel } from "@/components/editor/Panel";
import { FieldsRenderer } from "#/components/editor/panel/FieldsRenderer";
import { useFileName } from "#/hooks/use-path";
import { SectorHjsonSchema } from "@project/schema";

interface SectorPanelProps {
	path: string;
}

export function SectorPanel({ path }: SectorPanelProps) {
	const fileName = useFileName();

	return (
		<Panel>
			<div className="space-y-6 h-full w-full">
				{fileName !== null && <div className="text-lg font-bold">{fileName}</div>}
				<FieldsRenderer path={path} schema={SectorHjsonSchema} />
			</div>
		</Panel>
	);
}
