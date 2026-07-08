import { FieldsRenderer } from "#/components/editor/right/FieldsRenderer";
import { PlanetHjsonSchema } from "@project/schema";

interface PlanetPanelProps {
    path: string;
}

export function PlanetPanel({ path }: PlanetPanelProps) {
    return <FieldsRenderer path={path} schema={PlanetHjsonSchema} />;
}
