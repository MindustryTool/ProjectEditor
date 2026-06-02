import { FieldsRenderer } from "./FieldRenderer";
import { ModHjsonSchema } from "@project/schema";
import { Panel } from "@/components/editor/Panel";
import { useFileName } from "#/hooks/use-path";

export function ModHjsonPanel({ path }: { path: string }) {
	const fileName = useFileName();

	return (
		<Panel>
			<div className="space-y-6 h-full w-full">
				{fileName !== null && <div className="text-lg font-bold">{fileName}</div>}
				<FieldsRenderer path={path} schema={ModHjsonSchema} />
			</div>
		</Panel>
	);
}
