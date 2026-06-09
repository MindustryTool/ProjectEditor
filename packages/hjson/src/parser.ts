import { Tokenizer, type Token } from "./tokenizer.js";
import type { HjsonNode, ObjectNode, ArrayNode, StringNode, NumberNode, BooleanNode, NullNode, MemberNode } from "./ast.js";
import { HJSONError, HJSONErrorCode } from "./errors.js";
import type { HjsonNode as HjsonStructuredNode } from "./structured.js";
import {
	HjsonObjectNode,
	HjsonArrayNode,
	HjsonValueNode,
	createFieldInfo,
	createElementInfo,
	type FieldInfo,
	type ElementInfo,
} from "./structured.js";

export interface HJSONParseOptions {
	legacyRoot?: boolean;
	structured?: boolean;
}

export interface HJSONPreservedSegment {
	start: { row: number; col: number; index: number };
	end: { row: number; col: number; index: number };
	text: string;
}

export interface HJSONTolerantStructuredResult {
	node?: HjsonStructuredNode;
	issues: HJSONError[];
	preservedSegments: HJSONPreservedSegment[];
}

const MAX_DEPTH = 512;

function getEndPosition(input: string): { row: number; col: number; index: number } {
	let row = 1;
	let col = 1;

	for (let i = 0; i < input.length; i++) {
		const ch = input[i]!;
		if (ch === "\r") {
			if (input[i + 1] === "\n") {
				i++;
			}
			row++;
			col = 1;
			continue;
		}
		if (ch === "\n") {
			row++;
			col = 1;
			continue;
		}
		col++;
	}

	return { row, col, index: input.length };
}

export class Parser {
	private tokenizer: Tokenizer;
	private options: HJSONParseOptions;
	private depth = 0;

	constructor(input: string, options: HJSONParseOptions = {}) {
		this.tokenizer = new Tokenizer(input);
		this.options = options;
	}

	parse(): HjsonNode {
		this.depth = 0;
		const token = this.tokenizer.peek();

		if (token.type === "EOF") {
			return this.makeNull(token);
		}

		if (token.type === "{") {
			return this.parseObject();
		}

		if (token.type === "[") {
			return this.parseValue();
		}

		if (
			this.options.legacyRoot !== false &&
			(token.type === "string" || token.type === "number" || token.type === "null" || token.type === "boolean")
		) {
			const obj = this.parseRootObject();
			if (obj) return obj;
		}

		return this.parseValue();
	}

	private parseRootObject(): ObjectNode | null {
		const members: MemberNode[] = [];
		const startRow = this.tokenizer.peek().row;
		const startCol = this.tokenizer.peek().col;
		const startIdx = this.tokenizer.peek().index;

		const seenKeys = new Map<string, Token>();

		while (true) {
			const tok = this.tokenizer.peek();

			if (tok.type === "EOF" || tok.type === "}") {
				break;
			}

			if (tok.type === ",") {
				this.tokenizer.next();
				continue;
			}

			const member = this.parseMember(seenKeys);
			members.push(member);

			const afterTok = this.tokenizer.peek();
			if (afterTok.type === ",") {
				this.tokenizer.next();
			}
		}

		if (members.length === 0) return null;

		const endTok = this.tokenizer.peek();
		return {
			kind: "object",
			loc: {
				start: { row: startRow, col: startCol, index: startIdx },
				end: { row: endTok.row, col: endTok.col + (endTok.endIndex - endTok.index), index: endTok.endIndex },
			},
			members,
		};
	}

	private makeNull(tok: Token): NullNode {
		return {
			kind: "null",
			loc: {
				start: { row: tok.row, col: tok.col, index: tok.index },
				end: { row: tok.row, col: tok.col, index: tok.index },
			},
			value: null,
		};
	}

	private parseObject(): ObjectNode {
		if (this.depth > MAX_DEPTH) {
			const tok = this.tokenizer.peek();
			throw new HJSONError(HJSONErrorCode.MaximumDepthExceeded, {
				startLine: tok.row,
				startColumn: tok.col,
				index: tok.index,
				inputFragment: "",
			});
		}

		this.depth++;
		const openTok = this.tokenizer.next();
		const members: MemberNode[] = [];
		const seenKeys = new Map<string, Token>();

		while (true) {
			this.tokenizer.skipWhitespaceAndComments();
			const tok = this.tokenizer.peek();

			if (tok.type === "}") {
				break;
			}

			if (tok.type === ",") {
				this.tokenizer.next();
				continue;
			}

			if (tok.type === "EOF") {
				throw new HJSONError(HJSONErrorCode.UnexpectedEndOfInput, {
					startLine: openTok.row,
					startColumn: openTok.col,
					index: openTok.index,
					inputFragment: "",
				});
			}

			const member = this.parseMember(seenKeys);
			members.push(member);

			this.tokenizer.skipWhitespaceAndComments();
			const afterTok = this.tokenizer.peek();
			if (afterTok.type === ",") {
				this.tokenizer.next();
			}
		}

		const closeTok = this.tokenizer.next();
		this.depth--;

		return {
			kind: "object",
			loc: {
				start: { row: openTok.row, col: openTok.col, index: openTok.index },
				end: { row: closeTok.row, col: closeTok.col + (closeTok.endIndex - closeTok.index), index: closeTok.endIndex },
			},
			members,
		};
	}

	private parseMember(seenKeys: Map<string, Token>): MemberNode {
		const keyToken = this.parseKey();
		const keyStr = keyToken.value;

		const existing = seenKeys.get(keyStr);
		if (existing) {
			throw new HJSONError(HJSONErrorCode.DuplicateKey, {
				startLine: keyToken.row,
				startColumn: keyToken.col,
				endLine: keyToken.row,
				endColumn: keyToken.col + keyToken.value.length,
				index: keyToken.index,
				inputFragment: keyStr,
				message: `Duplicate key "${keyStr}" (first occurrence at ${existing.row}:${existing.col})`,
			});
		}
		seenKeys.set(keyStr, keyToken);

		this.tokenizer.skipWhitespaceAndComments();
		const colonTok = this.tokenizer.peek();
		if (colonTok.type === ":") {
			this.tokenizer.next();
		} else if (colonTok.type !== "}" && colonTok.type !== "," && colonTok.type !== "EOF" && colonTok.type !== "]") {
			this.tokenizer.expect(":");
		}

		this.tokenizer.skipWhitespaceAndComments();
		const value = this.parseValue();

		return {
			kind: "member",
			loc: {
				start: { row: keyToken.row, col: keyToken.col, index: keyToken.index },
				end: value.loc.end,
			},
			key: {
				kind: "string",
				loc: {
					start: { row: keyToken.row, col: keyToken.col, index: keyToken.index },
					end: { row: keyToken.row, col: keyToken.col + keyToken.value.length, index: keyToken.index + keyToken.value.length },
				},
				value: keyStr,
			},
			value,
		};
	}

	private parseKey(): Token {
		const tok = this.tokenizer.peek();

		if (tok.type === "string" || tok.type === "number") {
			return this.tokenizer.next();
		}

		if (tok.type === "null" || tok.type === "boolean") {
			return this.tokenizer.next();
		}

		if (tok.type === "{") {
			this.tokenizer.next();
			return { type: "string" as const, value: "{", row: tok.row, col: tok.col, index: tok.index, endIndex: tok.index + 1 };
		}

		if (tok.type === "[") {
			this.tokenizer.next();
			return { type: "string" as const, value: "[", row: tok.row, col: tok.col, index: tok.index, endIndex: tok.index + 1 };
		}

		if (tok.type === "}") {
			return { type: "string" as const, value: "", row: tok.row, col: tok.col, index: tok.index, endIndex: tok.index };
		}

		return this.tokenizer.next();
	}

	private parseValue(): HjsonNode {
		this.tokenizer.skipWhitespaceAndComments();
		const tok = this.tokenizer.peek();

		switch (tok.type) {
			case "{":
				return this.parseObject();
			case "[":
				return this.parseArray();
			case "string":
				return this.parseStringNode();
			case "number":
				return this.parseNumberNode();
			case "boolean":
				return this.parseBooleanNode();
			case "null":
				return this.parseNullNode();
			case "EOF":
				throw new HJSONError(HJSONErrorCode.ExpectedValue, {
					startLine: tok.row,
					startColumn: tok.col,
					index: tok.index,
					inputFragment: "",
				});
			default:
				throw new HJSONError(HJSONErrorCode.UnexpectedToken, {
					startLine: tok.row,
					startColumn: tok.col,
					endLine: tok.row,
					endColumn: tok.col + tok.value.length,
					index: tok.index,
					inputFragment: tok.value,
				});
		}
	}

	private parseArray(): ArrayNode {
		if (this.depth > MAX_DEPTH) {
			const tok = this.tokenizer.peek();
			throw new HJSONError(HJSONErrorCode.MaximumDepthExceeded, {
				startLine: tok.row,
				startColumn: tok.col,
				index: tok.index,
				inputFragment: "",
			});
		}

		this.depth++;
		const openTok = this.tokenizer.next();
		const elements: HjsonNode[] = [];

		while (true) {
			this.tokenizer.skipWhitespaceAndComments();
			const tok = this.tokenizer.peek();

			if (tok.type === "]") {
				break;
			}

			if (tok.type === ",") {
				this.tokenizer.next();
				continue;
			}

			if (tok.type === "EOF") {
				throw new HJSONError(HJSONErrorCode.UnexpectedEndOfInput, {
					startLine: openTok.row,
					startColumn: openTok.col,
					index: openTok.index,
					inputFragment: "",
				});
			}

			const value = this.parseValue();
			elements.push(value);

			this.tokenizer.skipWhitespaceAndComments();
			const afterTok = this.tokenizer.peek();
			if (afterTok.type === ",") {
				this.tokenizer.next();
			}
		}

		const closeTok = this.tokenizer.next();
		this.depth--;

		return {
			kind: "array",
			loc: {
				start: { row: openTok.row, col: openTok.col, index: openTok.index },
				end: { row: closeTok.row, col: closeTok.col + (closeTok.endIndex - closeTok.index), index: closeTok.endIndex },
			},
			elements,
		};
	}

	private parseStringNode(): StringNode {
		const tok = this.tokenizer.next();
		return {
			kind: "string",
			loc: {
				start: { row: tok.row, col: tok.col, index: tok.index },
				end: { row: tok.row, col: tok.col + (tok.endIndex - tok.index), index: tok.endIndex },
			},
			value: tok.value,
		};
	}

	private parseNumberNode(): NumberNode {
		const tok = this.tokenizer.next();
		const raw = tok.value;
		let value: number;

		if (raw.startsWith("0x") || raw.startsWith("0X")) {
			value = Number.parseInt(raw, 16);
		} else {
			value = Number(raw);
		}

		if (!Number.isFinite(value)) {
			throw new HJSONError(HJSONErrorCode.InvalidNumber, {
				startLine: tok.row,
				startColumn: tok.col,
				endLine: tok.row,
				endColumn: tok.col + raw.length,
				index: tok.index,
				inputFragment: raw,
			});
		}

		return {
			kind: "number",
			loc: {
				start: { row: tok.row, col: tok.col, index: tok.index },
				end: { row: tok.row, col: tok.col + (tok.endIndex - tok.index), index: tok.endIndex },
			},
			value,
			raw,
		};
	}

	private parseBooleanNode(): BooleanNode {
		const tok = this.tokenizer.next();
		return {
			kind: "boolean",
			loc: {
				start: { row: tok.row, col: tok.col, index: tok.index },
				end: { row: tok.row, col: tok.col + (tok.endIndex - tok.index), index: tok.endIndex },
			},
			value: tok.value === "true",
		};
	}

	private parseNullNode(): NullNode {
		const tok = this.tokenizer.next();
		return {
			kind: "null",
			loc: {
				start: { row: tok.row, col: tok.col, index: tok.index },
				end: { row: tok.row, col: tok.col + (tok.endIndex - tok.index), index: tok.endIndex },
			},
			value: null,
		};
	}

	toJSValue(node: HjsonNode, reviver?: (key: string, value: unknown) => unknown): unknown {
		return this.convertNode(node, "", reviver);
	}

	private convertNode(node: HjsonNode, keyHint: string, reviver?: (key: string, value: unknown) => unknown): unknown {
		switch (node.kind) {
			case "null":
				return reviver ? reviver(keyHint, null) : null;
			case "boolean":
				return reviver ? reviver(keyHint, node.value) : node.value;
			case "number":
				return reviver ? reviver(keyHint, node.value) : node.value;
			case "string":
				return reviver ? reviver(keyHint, node.value) : node.value;
			case "array": {
				const arr = node.elements.map((el, i) => this.convertNode(el, String(i), reviver));
				return reviver ? reviver(keyHint, arr) : arr;
			}
			case "object": {
				const obj: Record<string, unknown> = {};
				for (const member of node.members) {
					const key = member.key.value;
					const val = this.convertNode(member.value, key, reviver);
					if (val !== undefined) {
						obj[key] = val;
					}
				}
				return reviver ? reviver(keyHint, obj) : obj;
			}
			default:
				return null;
		}
	}

	static parse(input: string, reviver?: (key: string, value: unknown) => unknown, options?: HJSONParseOptions): unknown {
		const parser = new Parser(input, options);
		const ast = parser.parse();
		if (options?.structured) {
			return parser.toStructuredValue(ast, reviver);
		}
		return parser.toJSValue(ast, reviver);
	}

	static parseStructuredTolerant(
		input: string,
		reviver?: (key: string, value: unknown) => unknown,
		options?: HJSONParseOptions,
	): HJSONTolerantStructuredResult {
		try {
			return {
				node: Parser.parse(input, reviver, { ...options, structured: true }) as HjsonStructuredNode,
				issues: [],
				preservedSegments: [],
			};
		} catch (error) {
			if (!(error instanceof HJSONError)) {
				throw error;
			}

			return {
				issues: [error],
				preservedSegments: [
					{
						start: { row: 1, col: 1, index: 0 },
						end: getEndPosition(input),
						text: input,
					},
				],
			};
		}
	}

	toStructuredValue(node: HjsonNode, reviver?: (key: string, value: unknown) => unknown): HjsonStructuredNode {
		return this.convertNodeStructured(node, "", reviver);
	}

	private convertNodeStructured(
		node: HjsonNode,
		keyHint: string,
		reviver?: (key: string, value: unknown) => unknown,
		parent?: HjsonStructuredNode,
	): HjsonStructuredNode {
		switch (node.kind) {
			case "null":
			case "boolean":
			case "number":
			case "string": {
				const val = reviver ? reviver(keyHint, node.value) : node.value;
				return new HjsonValueNode(val, { ...node.loc.start }, { ...node.loc.end }, parent);
			}
			case "array": {
				const data: unknown[] = [];
				const elements: ElementInfo[] = [];
				const arr = new HjsonArrayNode(data, elements, { ...node.loc.start }, { ...node.loc.end }, parent);
				node.elements.forEach((el, i) => {
					const val = this.convertNodeStructured(el, String(i), reviver, arr);
					elements.push(createElementInfo(i, val, { ...el.loc.start }, { ...el.loc.end }, { ...el.loc.start }, { ...el.loc.end }));
					data.push(val.valueOf());
				});
				const finalData = reviver ? reviver(keyHint, data) : data;
				if (finalData !== data) {
					data.length = 0;
					if (Array.isArray(finalData)) {
						data.push(...finalData);
					}
				}
				return arr;
			}
			case "object": {
				const fields = new Map<string, FieldInfo>();
				const rawValues: Map<string, HjsonStructuredNode> = new Map();
				const data: Record<string, unknown> = {};

				const object = new HjsonObjectNode(data, fields, { ...node.loc.start }, { ...node.loc.end }, parent);

				for (const member of node.members) {
					const key = member.key.value;
					const val = this.convertNodeStructured(member.value, key, reviver, object);
					rawValues.set(key, val);
					data[key] = val.valueOf();
					fields.set(
						key,
						createFieldInfo(
							key,
							val,
							{ ...member.loc.start },
							{ ...member.loc.end },
							{ ...member.value.loc.start },
							{ ...member.value.loc.end },
						),
					);
				}

				const finalData = reviver ? reviver(keyHint, data) : data;
				const resultData = finalData && typeof finalData === "object" ? finalData : data;

				if (resultData !== data) {
					for (const key of Object.keys(data)) {
						delete data[key];
					}
					for (const [key, val] of Object.entries(resultData)) {
						(data as Record<string, unknown>)[key] = val;
					}
					for (const [key, newVal] of Object.entries(resultData)) {
						const oldRaw = rawValues.get(key);
						if (oldRaw && oldRaw.valueOf() !== newVal) {
							const fi = fields.get(key)!;
							fi.value = new HjsonValueNode(newVal, fi.valueStart, fi.valueEnd, object);
						}
					}
				}

				return object;
			}
			default:
				throw new Error(`Unknown node kind: ${(node as { kind: string }).kind}`);
		}
	}

	static async parseAsync(
		input: string,
		reviver?: (key: string, value: unknown) => unknown,
		options?: HJSONParseOptions,
	): Promise<unknown> {
		return new Promise((resolve, reject) => {
			queueMicrotask(() => {
				try {
					resolve(Parser.parse(input, reviver, options));
				} catch (e) {
					reject(e);
				}
			});
		});
	}
}
