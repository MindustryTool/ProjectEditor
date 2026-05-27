export interface Position {
	row: number;
	col: number;
	index: number;
}

export interface FieldInfo {
	key: string;
	value: any;
	start: Position;
	end: Position;
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

export abstract class StructuredNode {
	abstract isObject(): this is StructuredObjectNode;
	abstract isArray(): this is StructuredArrayNode;
	abstract isValue(): this is StructuredValueNode;
	abstract isMissing(): this is MissingNode;

	abstract get(key: string): StructuredNode;
	abstract at(index: number): StructuredNode;

	abstract asString(): string | undefined;
	abstract asNumber(): number | undefined;
	abstract asBoolean(): boolean | undefined;
	abstract asValue<T>(): T | undefined;

	abstract valueOf(): any;
	toJSON(): any {
		return this.valueOf();
	}
}

export class StructuredObjectNode extends StructuredNode {
	readonly #data: Record<string, unknown>;
	readonly #fields: Map<string, FieldInfo>;

	constructor(data: Record<string, unknown>, fields: Iterable<FieldInfo>) {
		super();
		this.#data = data;
		this.#fields = new Map();
		for (const f of fields) {
			this.#fields.set(f.key, f);
		}
	}

	isObject(): this is StructuredObjectNode {
		return true;
	}
	isArray(): this is StructuredArrayNode {
		return false;
	}
	isValue(): this is StructuredValueNode {
		return false;
	}
	isMissing(): this is MissingNode {
		return false;
	}

	get(key: string): StructuredNode {
		const info = this.#fields.get(key);
		if (info && info.value instanceof StructuredNode) {
			return info.value;
		}
		return MissingNode.instance;
	}

	at(_index: number): StructuredNode {
		return MissingNode.instance;
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

	/**
	 * Inserts a new field at the end of the original source string.
	 */
	insertField(original: string, key: string, newValue: string): string {
		const suffix = original.length > 0 && !original.endsWith("\n") ? "\n" : "";
		return original + suffix + `${key}: ${newValue}\n`;
	}
}

export interface ElementInfo {
	index: number;
	value: any;
	start: Position;
	end: Position;
}

export class StructuredArrayNode extends StructuredNode {
	readonly #data: unknown[];
	readonly #elements: ElementInfo[];

	constructor(data: unknown[], elements: ElementInfo[]) {
		super();
		this.#data = data;
		this.#elements = elements;
	}

	isObject(): this is StructuredObjectNode {
		return false;
	}
	isArray(): this is StructuredArrayNode {
		return true;
	}
	isValue(): this is StructuredValueNode {
		return false;
	}
	isMissing(): this is MissingNode {
		return false;
	}

	get(_key: string): StructuredNode {
		return MissingNode.instance;
	}

	at(index: number): StructuredNode {
		const info = this.#elements[index];
		if (info && info.value instanceof StructuredNode) {
			return info.value;
		}
		return MissingNode.instance;
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

export class StructuredValueNode extends StructuredNode {
	readonly #value: any;
	readonly #start: Position;
	readonly #end: Position;

	constructor(value: any, start: Position, end: Position) {
		super();
		this.#value = value;
		this.#start = start;
		this.#end = end;
	}

	isObject(): this is StructuredObjectNode {
		return false;
	}
	isArray(): this is StructuredArrayNode {
		return false;
	}
	isValue(): this is StructuredValueNode {
		return true;
	}
	isMissing(): this is MissingNode {
		return false;
	}

	get(_key: string): StructuredNode {
		return MissingNode.instance;
	}
	at(_index: number): StructuredNode {
		return MissingNode.instance;
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

export class MissingNode extends StructuredNode {
	static readonly instance = new MissingNode();

	private constructor() {
		super();
	}

	isObject(): this is StructuredObjectNode {
		return false;
	}
	isArray(): this is StructuredArrayNode {
		return false;
	}
	isValue(): this is StructuredValueNode {
		return false;
	}
	isMissing(): this is MissingNode {
		return true;
	}

	get(_key: string): StructuredNode {
		return this;
	}
	at(_index: number): StructuredNode {
		return this;
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

/**
 * @deprecated Use StructuredObjectNode instead
 */
export const StructuredObject = StructuredObjectNode;
export type StructuredObject = StructuredObjectNode;

export type StructuredResult<T> =
	T extends Record<string, unknown> ? StructuredObjectNode : T extends unknown[] ? StructuredArrayNode : StructuredValueNode;
