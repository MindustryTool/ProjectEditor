import { Panel } from "@/components/editor/Panel";
import { FieldsRenderer } from "#/components/editor/panel/FieldRenderer";
import { useFileName } from "#/hooks/use-path";
import { StatusHjsonSchema } from "@project/schema";

interface StatusPanelProps {
	path: string;
}

export function StatusPanel({ path }: StatusPanelProps) {
	const fileName = useFileName();

	return (
		<Panel>
			<div className="space-y-6 h-full w-full">
				{fileName !== null && <div className="text-lg font-bold">{fileName}</div>}
				<FieldsRenderer path={path} schema={StatusHjsonSchema} />
			</div>
		</Panel>
	);
}
