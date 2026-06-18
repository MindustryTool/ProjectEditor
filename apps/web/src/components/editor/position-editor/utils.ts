import { HJSON } from "@project/hjson";

function precision(value: number, precision: number) {
	return Math.round(value * 10 ** precision) / 10 ** precision;
}

export function updatePositionData(data: string, xPath: string, yPath: string, x: number, y: number): string | null {
	const result = HJSON.parseWithCache(data)
		.path(xPath)
		?.replaceValue(data, precision(x, 4));
	if (!result) return null;
	return (
		HJSON.parseWithCache(result)
			.path(yPath)
			?.replaceValue(result, precision(y, 4)) ?? null
	);
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
