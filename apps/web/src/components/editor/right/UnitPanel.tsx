import { FieldsRenderer } from "#/components/editor/right/FieldsRenderer";
import { usePath } from "#/hooks/use-path";
import { UnitHjsonSchema } from "@project/schema";
import { Button } from "#/components/ui/button";
import { useTranslation } from "react-i18next";
import { useProjectSession } from "@project/core";

interface UnitPanelProps {
	path: string;
}

export function UnitPanel({ path }: UnitPanelProps) {
	const { t } = useTranslation();
	const [entry, setPath] = usePath();
	const setTab = useProjectSession((s) => s.setSelectedTab);

	const isSpriteEditor = entry?.type === "sprite";

	return (
		<>
			<div className="p-2 border-b">
				{isSpriteEditor ? (
					<Button className="w-full" onClick={() => setPath({ path, type: "text", jsonPath: null })}>
						{t("position-editor.close")}
					</Button>
				) : (
					<Button
						className="w-full"
						onClick={() => {
							setTab("editor");
							setPath({ path, type: "sprite", jsonPath: null });
						}}
					>
						{t("position-editor.open")}
					</Button>
				)}
			</div>
			<FieldsRenderer path={path} schema={UnitHjsonSchema} />
		</>
	);
}
