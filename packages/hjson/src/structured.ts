export interface Position {
	row: number;
	col: number;
	index: number;
}

export interface InfoBase {
	start: Position;
	end: Position;
}

export interface FieldInfo<T = unknown> extends InfoBase {
	key: string;
	value: T;
	valueStart: Position;
	valueEnd: Position;
	replaceValue(original: string, newValue: string): string;
}

export function createFieldInfo<T>(
	key: string,
	value: T,
	start: Position,
	end: Position,
	valueStart: Position,
	valueEnd: Position,
): FieldInfo<T> {
	return {
		key,
		value,
		start,
		end,
		valueStart,
		valueEnd,
		replaceValue(original: string, newValue: string) {
			return original.slice(0, valueStart.index) + newValue + original.slice(valueEnd.index);
		},
	};
}

export abstract class HjsonNode {
	abstract isObject(): this is HjsonObjectNode;
	abstract isArray(): this is HjsonArrayNode;
	abstract isValue(): this is HjsonValueNode;
	abstract isMissing(): this is HjsonMissingNode;
	abstract isString(): this is HjsonValueNode<string>;
	abstract isNumber(): this is HjsonValueNode<number>;
	abstract isBoolean(): this is HjsonValueNode<boolean>;

	abstract get(key: string | number): HjsonNode;

	path(pathStr: string): FieldInfo | ElementInfo | undefined {
		if (!pathStr) return undefined;
		const segments = pathStr.match(/(\w+)|\[(\d+)\]/g);
		if (!segments || segments.length === 0) return undefined;
		let node: HjsonNode = this;
		for (let i = 0; i < segments.length - 1; i++) {
			const seg = segments[i]!;
			const info = seg.startsWith("[")
				? node.at(Number.parseInt(seg.slice(1, -1), 10))
				: node.at(seg);
			if (!info) return undefined;
			node = info.value as HjsonNode;
		}
		const last = segments[segments.length - 1]!;
		return last.startsWith("[")
			? node.at(Number.parseInt(last.slice(1, -1), 10))
			: node.at(last);
	}

	abstract at(value: string | number): FieldInfo | ElementInfo | undefined;

	abstract info(): InfoBase | undefined;

	abstract asString(): string | undefined;
	abstract asNumber(): number | undefined;
	abstract asBoolean(): boolean | undefined;
	abstract asValue<T>(): T | undefined;

	abstract valueOf(): unknown;
	toJSON(): unknown {
		return this.valueOf();
	}
}

export class HjsonObjectNode extends HjsonNode {
	readonly #data: Record<string, unknown>;
	readonly #fields: Map<string, FieldInfo>;
	readonly #start?: Position;
	readonly #end?: Position;

	constructor(data: Record<string, unknown>, fields: Iterable<FieldInfo>, start?: Position, end?: Position) {
		super();
		this.#data = data;
		this.#fields = new Map();
		for (const f of fields) {
			this.#fields.set(f.key, f);
		}
		this.#start = start;
		this.#end = end;
	}

	isObject(): this is HjsonObjectNode {
		return true;
	}
	isArray(): this is HjsonArrayNode {
		return false;
	}
	isValue(): this is HjsonValueNode {
		return false;
	}
	isMissing(): this is HjsonMissingNode {
		return false;
	}
	isString(): this is HjsonValueNode<string> {
		return false;
	}
	isNumber(): this is HjsonValueNode<number> {
		return false;
	}
	isBoolean(): this is HjsonValueNode<boolean> {
		return false;
	}

	get(key: string | number): HjsonNode {
		if (typeof key === "string") {
			const info = this.#fields.get(key);
			if (info && info.value instanceof HjsonNode) {
				return info.value;
			}
		}
		return HjsonMissingNode.instance;
	}

	at(value: string | number): FieldInfo | undefined {
		if (typeof value === "string") {
			return this.#fields.get(value);
		}
		return undefined;
	}

	info(): InfoBase | undefined {
		if (this.#start && this.#end) {
			return { start: this.#start, end: this.#end };
		}
		return undefined;
	}

	asString(): string | undefined {
		return undefined;
	}
	asNumber(): number | undefined {
		return undefined;
	}
	asBoolean(): boolean | undefined {
		return undefined;
	}
	asValue<T>(): T | undefined {
		return this.#data as unknown as T;
	}

	valueOf(): Record<string, unknown> {
		return this.#data;
	}

	field(key: string): FieldInfo | undefined {
		return this.#fields.get(key);
	}

	fields(): IterableIterator<FieldInfo> {
		return this.#fields.values();
	}

	/**
	 * Patches a field in the original source string.
	 * If the field exists, it uses replaceValue.
	 * If not, it uses insertField.
	 */
	patchField(original: string, key: string, newValue: string): string {
		const info = this.field(key);
		if (info) {
			return info.replaceValue(original, newValue);
		}
		return this.insertField(original, key, newValue);
	}

	#findPrecedingComment(original: string, fromIndex: number): { text: string; start: number; end: number } | undefined {
		let i = fromIndex - 1;
		while (i >= 0 && (original[i] === " " || original[i] === "\t")) {
			i--;
		}
		if (i >= 0 && original[i] === "\n") {
			i--;
			while (i >= 0 && original[i] !== "\n") {
				if (original[i] === "#") {
					const start = i;
					let end = start;
					while (end < original.length && original[end] !== "\n") {
						end++;
					}
					return { text: original.slice(start, end), start, end };
				}
				i--;
			}
		}
		return undefined;
	}

	patchComment(original: string, key: string, newComment: string): string {
		const info = this.field(key);
		if (!info) return original;

		const existing = this.#findPrecedingComment(original, info.start.index);
		if (existing) {
			return original.slice(0, existing.start) + newComment + original.slice(existing.end);
		}

		const indent = info.start.col > 1 ? " ".repeat(info.start.col - 1) : "";
		const prefix = indent ? newComment + "\n" + indent : newComment + "\n";
		return original.slice(0, info.start.index) + prefix + original.slice(info.start.index);
	}

	#detectIndent(): string {
		for (const fi of this.#fields.values()) {
			if (fi.start.col > 1) {
				return " ".repeat(fi.start.col - 1);
			}
		}
		return "  ";
	}

	/**
	 * Inserts a new field into the original source string.
	 * If the object uses braces ({}), inserts before the closing brace.
	 * Otherwise (flat root object), appends at end.
	 */
	insertField(original: string, key: string, newValue: string): string {
		if (this.#end) {
			const closeIdx = this.#end.index - 1;
			if (closeIdx >= 0 && original[closeIdx] === "}") {
				let i = closeIdx - 1;
				while (i >= 0 && (original[i] === " " || original[i] === "\t" || original[i] === "\n" || original[i] === "\r")) {
					i--;
				}
				if (i >= 0 && original[i] === ",") {
					i--;
				}
				const before = original.slice(0, i + 1);
				const after = original.slice(closeIdx);
				const indent = this.#detectIndent();
				const hasFields = this.#fields.size > 0;
				return before + (hasFields ? "," : "") + "\n" + indent + key + ": " + newValue + "\n" + after;
			}
		}
		// Flat root object (no braces) or no position info: append at end
		const trimmed = original.trimEnd();
		const suffix = trimmed.length > 0 && !trimmed.endsWith("\n") ? "\n" : "";
		return trimmed + suffix + `${key}: ${newValue}\n`;
	}
}

export interface ElementInfo<T = unknown> extends InfoBase {
	index: number;
	value: T;
	valueStart: Position;
	valueEnd: Position;
	replaceValue(original: string, newValue: string): string;
}

export function createElementInfo<T>(
	index: number,
	value: T,
	start: Position,
	end: Position,
	valueStart: Position,
	valueEnd: Position,
): ElementInfo<T> {
	return {
		index,
		value,
		start,
		end,
		valueStart,
		valueEnd,
		replaceValue(original: string, newValue: string) {
			return original.slice(0, valueStart.index) + newValue + original.slice(valueEnd.index);
		},
	};
}

export class HjsonArrayNode extends HjsonNode {
	readonly #data: unknown[];
	readonly #elements: ElementInfo[];
	readonly #start?: Position;
	readonly #end?: Position;

	constructor(data: unknown[], elements: ElementInfo[], start?: Position, end?: Position) {
		super();
		this.#data = data;
		this.#elements = elements;
		this.#start = start;
		this.#end = end;
	}

	isObject(): this is HjsonObjectNode {
		return false;
	}
	isArray(): this is HjsonArrayNode {
		return true;
	}
	isValue(): this is HjsonValueNode {
		return false;
	}
	isMissing(): this is HjsonMissingNode {
		return false;
	}
	isString(): this is HjsonValueNode<string> {
		return false;
	}
	isNumber(): this is HjsonValueNode<number> {
		return false;
	}
	isBoolean(): this is HjsonValueNode<boolean> {
		return false;
	}

	get(key: string | number): HjsonNode {
		if (typeof key === "number") {
			const el = this.#elements[key];
			if (el && el.value instanceof HjsonNode) {
				return el.value;
			}
		}
		return HjsonMissingNode.instance;
	}

	at(value: string | number): ElementInfo | undefined {
		if (typeof value === "number") {
			return this.#elements[value];
		}
		return undefined;
	}

	info(): InfoBase | undefined {
		if (this.#start && this.#end) {
			return { start: this.#start, end: this.#end };
		}
		return undefined;
	}

	asString(): string | undefined {
		return undefined;
	}
	asNumber(): number | undefined {
		return undefined;
	}
	asBoolean(): boolean | undefined {
		return undefined;
	}
	asValue<T>(): T | undefined {
		return this.#data as unknown as T;
	}

	valueOf(): unknown[] {
		return this.#data;
	}

	elements(): ElementInfo[] {
		return this.#elements;
	}

	#detectIndent(): string {
		const firstEl = this.#elements[0];
		if (firstEl && firstEl.start.col > 1) {
			return " ".repeat(firstEl.start.col - 1);
		}
		return "  ";
	}

	#isInline(_original: string): boolean {
		if (!this.#start || this.#elements.length === 0) return true;
		return this.#elements[0]!.start.row === this.#start.row;
	}

	patchElement(original: string, index: number, newValue: string): string {
		const el = this.#elements[index];
		if (!el) return original;
		return el.replaceValue(original, newValue);
	}

	insertElement(original: string, index: number, newValue: string): string {
		const len = this.#elements.length;
		if (index < 0 || index > len) return original;

		if (len === 0) {
			const openIdx = this.#start!.index + 1;
			const closeIdx = this.#end!.index;
			return original.slice(0, openIdx) + newValue + original.slice(closeIdx - 1);
		}

		const isMultiline = !this.#isInline(original);
		const indent = this.#detectIndent();
		const sep = isMultiline ? ",\n" + indent : ", ";

		if (index === 0) {
			const insIdx = this.#elements[0]!.start.index;
			return original.slice(0, insIdx) + newValue + sep + original.slice(insIdx);
		}

		if (index === len) {
			const closeIdx = this.#end!.index - 1;
			let insIdx = closeIdx;
			while (insIdx > this.#start!.index + 1) {
				const c = original[insIdx - 1];
				if (c === " " || c === "\t" || c === "\n" || c === "\r") {
					insIdx--;
					continue;
				}
				if (c === ",") {
					insIdx--;
				}
				break;
			}
			return original.slice(0, insIdx) + sep + newValue + original.slice(insIdx);
		}

		const insIdx = this.#elements[index]!.start.index;
		return original.slice(0, insIdx) + newValue + sep + original.slice(insIdx);
	}

	removeElement(original: string, index: number): string {
		const len = this.#elements.length;
		if (index < 0 || index >= len) return original;

		if (len === 1) {
			const openIdx = this.#start!.index + 1;
			const closeIdx = this.#end!.index;
			return original.slice(0, openIdx) + original.slice(closeIdx - 1);
		}

		const el = this.#elements[index];

		if (index === 0) {
			const nextStart = this.#elements[1]!.start.index;
			return original.slice(0, el!.start.index) + original.slice(nextStart);
		}

		let start = el!.start.index - 1;
		while (start >= 0 && (original[start] === " " || original[start] === "\t" || original[start] === "\n" || original[start] === "\r")) {
			start--;
		}
		if (start >= 0 && original[start] === ",") {
			start--;
		}
		const commaEnd = start + 1;
		return original.slice(0, commaEnd) + original.slice(el!.end.index);
	}

	#findPrecedingComment(original: string, fromIndex: number): { text: string; start: number; end: number } | undefined {
		let i = fromIndex - 1;
		while (i >= 0 && (original[i] === " " || original[i] === "\t")) {
			i--;
		}
		if (i >= 0 && original[i] === "\n") {
			i--;
			while (i >= 0 && original[i] !== "\n") {
				if (original[i] === "#") {
					const start = i;
					let end = start;
					while (end < original.length && original[end] !== "\n") {
						end++;
					}
					return { text: original.slice(start, end), start, end };
				}
				i--;
			}
		}
		return undefined;
	}

	patchComment(original: string, index: number, newComment: string): string {
		const el = this.#elements[index];
		if (!el) return original;

		const existing = this.#findPrecedingComment(original, el.start.index);
		if (existing) {
			return original.slice(0, existing.start) + newComment + original.slice(existing.end);
		}

		// Insert new comment before the element
		const indent = this.#detectIndent();
		return original.slice(0, el.start.index) + newComment + "\n" + indent + original.slice(el.start.index);
	}
}

export class HjsonValueNode<T = unknown> extends HjsonNode {
	readonly #value: T;
	readonly #start: Position;
	readonly #end: Position;

	constructor(value: T, start: Position, end: Position) {
		super();
		this.#value = value;
		this.#start = start;
		this.#end = end;
	}

	isObject(): this is HjsonObjectNode {
		return false;
	}
	isArray(): this is HjsonArrayNode {
		return false;
	}
	isValue(): this is HjsonValueNode {
		return true;
	}
	isMissing(): this is HjsonMissingNode {
		return false;
	}
	isString(): this is HjsonValueNode<string> {
		return typeof this.#value === "string";
	}
	isNumber(): this is HjsonValueNode<number> {
		return typeof this.#value === "number";
	}
	isBoolean(): this is HjsonValueNode<boolean> {
		return typeof this.#value === "boolean";
	}

	get(_key: string | number): HjsonNode {
		return HjsonMissingNode.instance;
	}
	at(_value: string | number): undefined {
		return undefined;
	}

	info(): InfoBase {
		return { start: this.#start, end: this.#end };
	}

	asString(): string | undefined {
		return typeof this.#value === "string" ? this.#value : undefined;
	}

	asNumber(): number | undefined {
		return typeof this.#value === "number" ? this.#value : undefined;
	}

	asBoolean(): boolean | undefined {
		return typeof this.#value === "boolean" ? this.#value : undefined;
	}

	asValue<V = T>(): V | undefined {
		return this.#value as unknown as V;
	}

	valueOf(): T {
		return this.#value;
	}

	get start(): Position {
		return this.#start;
	}
	get end(): Position {
		return this.#end;
	}
}

export class HjsonMissingNode extends HjsonNode {
	static readonly instance = new HjsonMissingNode();

	private constructor() {
		super();
	}

	isObject(): this is HjsonObjectNode {
		return false;
	}
	isArray(): this is HjsonArrayNode {
		return false;
	}
	isValue(): this is HjsonValueNode {
		return false;
	}
	isMissing(): this is HjsonMissingNode {
		return true;
	}
	isString(): this is HjsonValueNode<string> {
		return false;
	}
	isNumber(): this is HjsonValueNode<number> {
		return false;
	}
	isBoolean(): this is HjsonValueNode<boolean> {
		return false;
	}

	get(_key: string | number): HjsonNode {
		return this;
	}
	at(_value: string | number): undefined {
		return undefined;
	}

	info(): undefined {
		return undefined;
	}

	asString(): string | undefined {
		return undefined;
	}
	asNumber(): number | undefined {
		return undefined;
	}
	asBoolean(): boolean | undefined {
		return undefined;
	}
	asValue<T>(): T | undefined {
		return undefined;
	}

	valueOf(): undefined {
		return undefined;
	}
}

export type HjsonResult<T> =
	T extends Record<string, unknown> ? HjsonObjectNode : T extends unknown[] ? HjsonArrayNode : HjsonValueNode<T>;
