import { FieldsRenderer } from "#/components/editor/right/FieldsRenderer";
import { usePath } from "#/hooks/use-path";
import { UnitHjsonSchema } from "@project/schema";
import { Button } from "#/components/ui/button";
import { useTranslation } from "react-i18next";

interface UnitPanelProps {
	path: string;
}

export function UnitPanel({ path }: UnitPanelProps) {
	const { t } = useTranslation();
	const [originalPath, setPath] = usePath();

	const isSpriteEditor = originalPath!.startsWith("sprite:");

	return (
		<>
			<div className="p-2 border-b">
				{isSpriteEditor ? (
					<Button className="w-full" onClick={() => setPath(path)}>
						{t("sprite-editor.close")}
					</Button>
				) : (
					<Button className="w-full" onClick={() => setPath(`sprite:${path}`)}>
						{t("sprite-editor.open")}
					</Button>
				)}
			</div>
			<FieldsRenderer path={path} schema={UnitHjsonSchema} />
		</>
	);
}
