import { FieldsRenderer } from "./FieldsRenderer";
import { ModHjsonSchema } from "@project/schema";

export function ModHjsonPanel({ path }: { path: string }) {
	return <FieldsRenderer path={path} schema={ModHjsonSchema} />;
}
