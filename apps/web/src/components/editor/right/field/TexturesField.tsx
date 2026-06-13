import { Field, FieldControl } from "#/components/editor/right/field/Field";
import { SchemaDescription } from "#/components/editor/right/field/SchemaDescription";
import { SchemaLabel } from "#/components/editor/right/field/SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { SpriteUploader, SpriteViewer } from "#/components/editor/right/SpritePicker";
import { Button } from "#/components/ui/button";
import { useProjectSession } from "@project/core";
import { type SchemaMetadata } from "@project/schema";
import React from "react";
import { useState } from "react";

export const TexturesField = React.memo(function TexturesField({ name, path, jsonPath, metadata }: SchemaRendererProps) {
	const [render, setRender] = useState(3);
	const filename = path.split("/").pop();

	if (!filename) {
		throw new Error("Texture field path must end with a file name");
	}

	const contentName = filename.split(".")[0];
	if (!contentName) {
		throw new Error("Texture field path must end with a file name");
	}

	let { format } = metadata as SchemaMetadata & { format?: string };
	const { length } = metadata as SchemaMetadata & { length?: number[] | number };

	format = format || "$";

	if (!length) {
		throw new Error("Texture field length must be specified");
	}

	const spritePath = path.replace("contents", "sprites").replace(filename, format.replace("@", contentName)) + ".png";

	const spritePaths = Array.isArray(length)
		? generatePattern(spritePath, length)
		: Array.from({ length }).map((_, index) => spritePath.replace("#", index.toString()));

	if (format === "$") {
		return null;
	}

	if (!format.includes("#")) {
		throw new Error("Texture field format must contain # placeholder");
	}

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<SchemaLabel name={name} metadata={metadata} />
			<FieldControl className="space-y-2 text-muted-foreground text-xs">
				{spritePaths.map((spritePath, index) => (index >= render ? null : <Item key={index} spritePath={spritePath} />))}
				{render !== spritePaths.length && (
					<Button className="w-full" onClick={() => setRender(spritePaths.length)}>
						Show all (+{spritePaths.length - render})
					</Button>
				)}
			</FieldControl>
			<SchemaDescription metadata={metadata} />
		</Field>
	);
});

function Item({ spritePath }: { spritePath: string }) {
	const exists = useProjectSession((s) => spritePath !== null && s.treeSnapshot.getEntry(spritePath) !== undefined);
	const filename = spritePath.split("/").pop();

	if (!filename) {
		throw new Error("Texture field path must end with a file name");
	}

	return (
		<div className="space-y-2">
			<span className="text-xs">{filename}</span>
			{exists ? <SpriteViewer path={spritePath} /> : <SpriteUploader path={spritePath} />}
		</div>
	);
}

function generatePattern(pattern: string, dimensions: number[]): string[] {
	const result: string[] = [];

	function walk(indices: number[]): void {
		if (indices.length === dimensions.length) {
			let i = 0;
			result.push(pattern.replace(/#/g, () => String(indices[i++])));
			return;
		}

		for (let j = 0; j < dimensions[indices.length]!; j++) {
			indices.push(j);
			walk(indices);
			indices.pop();
		}
	}

	walk([]);
	return result;
}
