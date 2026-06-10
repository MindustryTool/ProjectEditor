import { Field, FieldControl } from "#/components/editor/right/field/Field";
import { SchemaDescription } from "#/components/editor/right/field/SchemaDescription";
import { SchemaLabel } from "#/components/editor/right/field/SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { SpriteUploader, SpriteViewer } from "#/components/editor/right/SpritePicker";
import { useProjectSession } from "@project/core";
import { getSchemaMetadata, type SchemaMetadata } from "@project/schema";
import React from "react";

export const TextureField = React.memo(function TextureField({ name, path, entrySchema, jsonPath }: SchemaRendererProps) {
	const metadata = getSchemaMetadata(entrySchema);
	const filename = path.split("/").pop();
	if (!filename) {
		throw new Error("Texture field path must end with a file name");
	}

	const contentName = filename.split(".")[0];
	if (!contentName) {
		throw new Error("Texture field path must end with a file name");
	}

	const { format } = metadata as SchemaMetadata & { format: string; fallback?: string };

	if (!format) {
		throw new Error("Texture field format must be specified");
	}

	if (!format.includes("@")) {
		throw new Error("Texture field format must contain @ placeholder");
	}

	const spritePath = path.replace("contents", "sprites").replace(filename, format.replace("@", contentName)) + ".png";
	const exists = useProjectSession((s) => spritePath !== null && s.treeSnapshot.getEntry(spritePath) !== undefined);

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<SchemaLabel name={name} metadata={metadata} />
			<FieldControl>{exists ? <SpriteViewer path={spritePath} /> : <SpriteUploader path={spritePath} />}</FieldControl>
			<SchemaDescription metadata={metadata} />
		</Field>
	);
});
