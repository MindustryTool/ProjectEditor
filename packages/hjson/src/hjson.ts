import { Parser, type HJSONParseOptions } from "./parser.js";
import { stringify } from "./serializer.js";
import type { HjsonNode } from "./structured.js";

export type Reviver = (this: any, key: string, value: any) => any;
export type ReplacerFunction = (this: any, key: string, value: any) => any;
export type Replacer = ReplacerFunction | (string | number)[];
export type Space = string | number;
export type { HJSONParseOptions };

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

	stringify(value: any, replacer?: Replacer | null, space?: Space): string {
		return stringify(value, replacer, space);
	},
};
