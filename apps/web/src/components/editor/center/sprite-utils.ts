import { type TreeSnapshot } from "@project/core";
import { HJSON, type HjsonObjectNode } from "@project/hjson";
import { getArrayItemSchema, getSchemaEntries, resolveSchema, type AnySchema } from "@project/schema";

export type SpriteData = {
    name: string,
	path: string;
	mirror: boolean;
	position: {
		x: {
			value: number;
			path: string;
		};
		y: {
			value: number;
			path: string;
		};
	};
};

export function collectSpriteData(treeSnapshot: TreeSnapshot, node: HjsonObjectNode, schema: AnySchema): SpriteData[] {
	const result: SpriteData[] = [];

	function visit(value: unknown, currentSchema: AnySchema, currentPath: string) {
		currentSchema = resolveSchema(currentSchema, value);

		if (value && typeof value === "object" && !Array.isArray(value)) {
			const entries = getSchemaEntries(currentSchema);

			const obj = value as Record<string, unknown>;

			const hasName = typeof obj.name === "string";
			const hasX = typeof obj.x === "number";
			const hasY = typeof obj.y === "number";
			const filename = obj.name + ".png";
			const mirror = obj.mirror === true;

			const fileEntry = treeSnapshot.getEntries().find((item) => item.name === filename);

			if (hasName && hasX && hasY && fileEntry) {
				result.push({
                    name: obj.name as string,
					path: fileEntry.path,
					mirror,
					position: {
						x: {
							value: obj.x as number,
							path: currentPath ? `${currentPath}.x` : "x",
						},
						y: {
							value: obj.y as number,
							path: currentPath ? `${currentPath}.y` : "y",
						},
					},
				});
			}

			for (const [key, childSchema] of entries) {
				if (!(key in obj)) continue;

				visit(obj[key], childSchema, currentPath ? `${currentPath}.${key}` : key);
			}

			return;
		}

		if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i++) {
				const itemSchema = getArrayItemSchema(currentSchema, i);
				if (!itemSchema) continue;

				visit(value[i], itemSchema, `${currentPath}[${i}]`);
			}
		}
	}

	visit(node.valueOf(), schema, "");

	return result;
}

export function updateSpritePosition(data: string, xPath: string, yPath: string, x: number, y: number): string | null {
	const result = HJSON.parseWithCache(data).path(xPath)?.replaceValue(data, HJSON.stringify(x));
	if (!result) return null;
	return HJSON.parseWithCache(result).path(yPath)?.replaceValue(result, HJSON.stringify(y)) ?? null;
}

export function applyOutline(imageData: ImageData) {
	const src = imageData.data;
	const { width, height } = imageData;
	const original = new Uint8ClampedArray(src);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const idx = (y * width + x) * 4;
			if (original[idx + 3]! > 0) continue;

			let edge = false;
			for (let dy = -1; dy <= 1 && !edge; dy++) {
				for (let dx = -1; dx <= 1 && !edge; dx++) {
					if (dx === 0 && dy === 0) continue;
					const nx = x + dx;
					const ny = y + dy;
					if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
					if (original[(ny * width + nx) * 4 + 3]! > 0) {
						edge = true;
					}
				}
			}

			if (edge) {
				src[idx] = 0;
				src[idx + 1] = 0;
				src[idx + 2] = 0;
				src[idx + 3] = 255;
			}
		}
	}
}
