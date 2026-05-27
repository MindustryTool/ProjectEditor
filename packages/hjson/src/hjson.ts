import { Parser, type HJSONParseOptions } from "./parser.js";
import { stringify } from "./serializer.js";

export type Reviver = (this: any, key: string, value: any) => any;
export type ReplacerFunction = (this: any, key: string, value: any) => any;
export type Replacer = ReplacerFunction | (string | number)[];
export type Space = string | number;
export type { HJSONParseOptions };

export const HJSON = {
  parse<T = unknown>(
    text: string,
    reviver?: Reviver,
    options?: HJSONParseOptions,
  ): T {
    return Parser.parse(text, reviver, options) as T;
  },

  parseAsync<T = unknown>(
    text: string,
    reviver?: Reviver,
    options?: HJSONParseOptions,
  ): Promise<T> {
    return Parser.parseAsync(text, reviver, options) as Promise<T>;
  },

  stringify(
    value: any,
    replacer?: Replacer | null,
    space?: Space,
  ): string {
    return stringify(value, replacer, space);
  },
};
