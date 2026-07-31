import { FieldsRenderer } from "#/components/editor/right/FieldsRenderer";
import { WeatherHjsonSchema } from "@project/schema";

interface WeatherPanelProps {
	path: string;
}

export function WeatherPanel({ path }: WeatherPanelProps) {
	return <FieldsRenderer path={path} schema={WeatherHjsonSchema} />;
}
