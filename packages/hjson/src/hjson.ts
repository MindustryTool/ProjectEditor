import { Parser, type HJSONParseOptions } from "./parser.js";
import { format, type HJSONFormatOptions } from "./formatter.js";
import { stringify } from "./serializer.js";
import type { HjsonNode } from "./structured.js";

export type Reviver = (this: unknown, key: string, value: unknown) => unknown;
export type ReplacerFunction = (this: unknown, key: string, value: unknown) => unknown;
export type Replacer = ReplacerFunction | (string | number)[];
export type Space = string | number;
export type { HJSONParseOptions, HJSONFormatOptions };

export const HJSON = {
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

	stringify(value: unknown, replacer?: Replacer | null, space?: Space): string {
		return stringify(value, replacer, space);
	},
};
