import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const EMPTY_ARRAY = [];

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const cache = new WeakMap<ArrayBuffer, string>();

const registry = new FinalizationRegistry<string>((url) => {
	URL.revokeObjectURL(url);
});

export function getImageUrl(data: ArrayBuffer): string {
	let url = cache.get(data);

	if (url === undefined) {
		url = URL.createObjectURL(new Blob([data], { type: "image/png" }));

		cache.set(data, url);
		registry.register(data, url);
	}

	return url;
}

export function levenshtein<T>(items: T[], extractor: (item: T) => string, filter: string, limit?: number): T[] {
	return items
		.map((item) => ({
			score: levenshteinDistance(extractor(item), filter),
			item,
		}))
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map((item) => item.item);
}

function levenshteinDistance(a: string, b: string): number {
	a = a.toLowerCase();
	b = b.toLowerCase();

	const m = a.length;
	const n = b.length;

	const DELETE_COST = 1;
	const INSERT_COST = 2;
	const REPLACE_COST = 5;

	const STARTS_WITH_BONUS = 50;
	const CONTAINS_BONUS = 20;

	const matrix = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));

	for (let i = 0; i <= m; i++) {
		matrix[i]![0] = i * DELETE_COST;
	}

	for (let j = 0; j <= n; j++) {
		matrix[0]![j] = j * INSERT_COST;
	}

	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : REPLACE_COST;

			matrix[i]![j] = Math.min(matrix[i - 1]![j]! + DELETE_COST, matrix[i]![j - 1]! + INSERT_COST, matrix[i - 1]![j - 1]! + cost);
		}
	}

	let score = -matrix[m]![n]!;

	if (a.startsWith(b)) {
		score += STARTS_WITH_BONUS;
	} else if (a.includes(b)) {
		score += CONTAINS_BONUS;
	}

	return score;
}
