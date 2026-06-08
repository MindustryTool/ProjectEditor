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

		if (cache.length > 100) {
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
};
