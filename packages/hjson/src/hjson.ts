import { Parser, type HJSONParseOptions } from "./parser.js";
import { format, type HJSONFormatOptions } from "./formatter.js";
import { stringify } from "./serializer.js";
import type { HjsonNode } from "./structured.js";

export type Reviver = (this: unknown, key: string, value: unknown) => unknown;
export type ReplacerFunction = (this: unknown, key: string, value: unknown) => unknown;
export type Replacer = ReplacerFunction | (string | number)[];
export type Space = string | number;
export type { HJSONParseOptions, HJSONFormatOptions };

const cache: { content: string; node: HjsonNode; hit: number; time: number }[] = [];

export const HJSON = {
	parseWithCache(content: string) {
		content = content || "{}";
		let existing = undefined;

		for (let i = cache.length - 1; i >= 0; i--) {
			const item = cache[i]!;
			if (item.content === content) {
				existing = item;
				break;
			}
		}

		if (existing) {
			existing.hit++;
			return existing.node;
		}

		const node = HJSON.parseStructured(content);
		cache.push({ content, node, hit: 0, time: Date.now() });

		if (cache.length > 1000) {
			cache.sort((a, b) => {
				if (a.hit !== b.hit) {
					return b.hit - a.hit;
				}
				return a.time - b.time;
			});
			cache.shift();
		}

		return node;
	},

	parse<T = unknown>(text: string, reviver?: Reviver, options?: HJSONParseOptions): T {
		return Parser.parse(text, reviver, options) as T;
	},

	parseAsync<T = unknown>(text: string, reviver?: Reviver, options?: HJSONParseOptions): Promise<T> {
		return Parser.parseAsync(text, reviver, options) as Promise<T>;
	},

	parseStructured(text: string, reviver?: Reviver, options?: HJSONParseOptions): HjsonNode {
		return Parser.parse(text, reviver, { ...options, structured: true }) as HjsonNode;
	},

	parseStructuredAsync(text: string, reviver?: Reviver, options?: HJSONParseOptions): Promise<HjsonNode> {
		return Parser.parseAsync(text, reviver, { ...options, structured: true }) as Promise<HjsonNode>;
	},

	format(text: string, options?: HJSONFormatOptions): string {
		return format(text, options);
	},

	stringify(value: unknown, replacer?: Replacer | null, space: Space = 2): string {
		return stringify(value, replacer, space);
	},

	patch(write: (content: string | ((prev: string | null) => string)) => string) {
		return (jsonPath: string, updater: (node: HjsonNode, original: string, key: string | number, root: HjsonNode) => string) => {
			return write((content: string | null) => {
				if (content === null) {
					throw new Error("Attempting to write into unloaded file");
				}

				let root = HJSON.parseWithCache(content);

				const segments = jsonPath
					.split(/[.\]\[]/)
					.filter((s) => s.trim().length > 0)
					.map((s) => {
						const num = Number(s);
						return Number.isInteger(num) && String(num) === s ? num : s;
					});

				if (segments.length === 0) {
					throw new Error(`jsonPath is empty: ${jsonPath}`);
				}

				if (segments.length === 1) {
					return updater(root, content, segments[0]!, root);
				}

				while (true) {
					let parent = root;
					let modified = false;

					for (let i = 0; i < segments.length - 1; i++) {
						const currentKey = segments[i]!;
						const nextKey = segments[i + 1]!;

						const child = parent.get(currentKey);

						const container = typeof nextKey === "number" ? [] : {};

						if (child.isMissing()) {
							if (parent.isObject() && typeof currentKey === "string") {
								content = parent.insertField(content!, currentKey, container);
							} else if (parent.isArray() && typeof currentKey === "number") {
								content = parent.insertElement(content!, currentKey, container);
							} else {
								throw new Error(`Invalid key '${currentKey}' for parent type '${parent.constructor.name}'`);
							}

							root = HJSON.parseWithCache(content);
							modified = true;
							break;
						}

						if (child.isValue() && i < segments.length - 1) {
							if (parent.isObject() && typeof currentKey === "string") {
								content = parent.patchValue(content!, currentKey, container);
							} else if (parent.isArray() && typeof currentKey === "number") {
								content = parent.patchValue(content!, currentKey, container);
							} else {
								throw new Error(`Cannot replace value node at '${segments.slice(0, i + 1).join(".")}'`);
							}

							root = HJSON.parseWithCache(content);
							modified = true;
							break;
						}

						parent = child;
					}

					if (modified) {
						continue;
					}

					const key = segments[segments.length - 1]!;

					return updater(parent, content, key, root);
				}
			});
		};
	},
};
