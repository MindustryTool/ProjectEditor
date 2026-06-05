import { Panel } from "@/components/editor/Panel";
import { FieldsRenderer } from "#/components/editor/right/FieldsRenderer";
import { SpritePicker } from "#/components/editor/right/SpritePicker";
import { useFileName, usePath } from "#/hooks/use-path";
import { UnitHjsonSchema } from "@project/schema";
import { Button } from "#/components/ui/button";
import { useTranslation } from "react-i18next";

interface UnitPanelProps {
	path: string;
}

export function UnitPanel({ path }: UnitPanelProps) {
	const fileName = useFileName();
	const { t } = useTranslation();
	const [originalPath, setPath] = usePath();

	const isSpriteEditor = originalPath!.startsWith("sprite:");

	return (
		<Panel>
			<div className="space-y-6 h-full w-full">
				{fileName !== null && <div className="text-lg font-bold">{fileName}</div>}
				<SpritePicker path={path} />
				{isSpriteEditor ? (
					<Button className="w-full" onClick={() => setPath(path)}>
						{t("sprite-editor.close")}
					</Button>
				) : (
					<Button className="w-full" onClick={() => setPath(`sprite:${path}`)}>
						{t("sprite-editor.open")}
					</Button>
				)}
				<FieldsRenderer path={path} schema={UnitHjsonSchema} />
			</div>
		</Panel>
	);
}
