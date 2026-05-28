export interface Position {
	row: number;
	col: number;
	index: number;
}

export interface InfoBase {
	start: Position;
	end: Position;
}

export interface FieldInfo extends InfoBase {
	key: string;
	value: any;
	valueStart: Position;
	valueEnd: Position;
	/**
	 * Patches the field's value in the original source string.
	 */
	replaceValue(original: string, newValue: string): string;
}

/**
 * Creates a FieldInfo object with the required properties and methods.
 */
export function createFieldInfo(
	key: string,
	value: any,
	start: Position,
	end: Position,
	valueStart: Position,
	valueEnd: Position,
): FieldInfo {
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
			node = info.value;
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

	abstract valueOf(): any;
	toJSON(): any {
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

export interface ElementInfo extends InfoBase {
	index: number;
	value: any;
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
}

export class HjsonValueNode extends HjsonNode {
	readonly #value: any;
	readonly #start: Position;
	readonly #end: Position;

	constructor(value: any, start: Position, end: Position) {
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

	asValue<T>(): T | undefined {
		return this.#value as T;
	}

	valueOf(): any {
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

	valueOf(): any {
		return undefined;
	}
}

export type HjsonResult<T> =
	T extends Record<string, unknown> ? HjsonObjectNode : T extends unknown[] ? HjsonArrayNode : HjsonValueNode;
