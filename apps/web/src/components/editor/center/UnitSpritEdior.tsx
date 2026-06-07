import { SpriteEditor } from "#/components/editor/center/SpriteEditor";
import { UnitHjsonSchema } from "@project/schema";

export function UnitSpriteEditor({ striped }: { striped: string }) {
	return <SpriteEditor path={striped} schema={UnitHjsonSchema} />;
}
