import { Field, FieldControl } from "#/components/editor/right/field/Field";
import { SchemaDescription } from "#/components/editor/right/field/SchemaDescription";
import { SchemaLabel } from "#/components/editor/right/field/SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { SpriteUploader, SpriteViewer } from "#/components/editor/right/SpritePicker";
import { useProjectSession } from "@project/core";
import { type SchemaMetadata } from "@project/schema";
import React from "react";

import { useFieldContext } from "#/components/editor/right/field/FieldContext";

export const TextureField = React.memo(function TextureField({ name, path, jsonPath, metadata }: SchemaRendererProps) {
	const filename = path.split("/").pop();

	if (!filename) {
		throw new Error("Texture field path must end with a file name");
	}

	const { name: contentName } = useFieldContext();

	let { format } = metadata as SchemaMetadata & { format?: string; fallback?: string };
	format = format || "$";

	const defaultSpritePath = path.replace("content", "sprites").replace(filename, format.replace("@", contentName)) + ".png";
	const spritePath = useProjectSession((s) => s.treeSnapshot.findContentSpritePath(format.replace("@", contentName)));

	if (format === "$") {
		return null;
	}

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<SchemaLabel name={name} metadata={metadata} />
			<span className="text-muted-foreground text-xs">{spritePath ?? defaultSpritePath}</span>
			<FieldControl>
				{spritePath !== null ? <SpriteViewer path={spritePath} /> : <SpriteUploader path={defaultSpritePath} />}
			</FieldControl>
			<SchemaDescription metadata={metadata} />
		</Field>
	);
});
