import { stringify as hjsonStringify } from "./serializer.js";

function serializeValue(v: unknown, baseIndent?: string): string {
	const text = hjsonStringify(v, null, 2);
	if (text == null) return "";
	if (baseIndent && text.includes("\n")) {
		return reindentSerialized(text, baseIndent);
	}
	return text;
}

function reindentSerialized(text: string, baseIndent: string): string {
	const lines = text.split("\n");
	return lines.map((line, i) => (i === 0 ? line : baseIndent + line)).join("\n");
}

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
	replaceValue(original: string, newValue: unknown): string;
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
		replaceValue(original: string, newValue: unknown) {
			const baseIndent = " ".repeat(Math.max(0, start.col - 1));
			return original.slice(0, valueStart.index) + serializeValue(newValue, baseIndent) + original.slice(valueEnd.index);
		},
	};
}

export abstract class HjsonNode {
	#parent?: HjsonNode;

	abstract isObject(): this is HjsonObjectNode;
	abstract isArray(): this is HjsonArrayNode;
	abstract isValue(): this is HjsonValueNode;
	abstract isMissing(): this is HjsonMissingNode;
	abstract isString(): this is HjsonValueNode<string>;
	abstract isNumber(): this is HjsonValueNode<number>;
	abstract isBoolean(): this is HjsonValueNode<boolean>;
	abstract patchValue(original: string, key: string | number, newValue: unknown): string;

	constructor(parent?: HjsonNode) {
		this.#parent = parent;
	}

	get parent(): HjsonNode | undefined {
		return this.#parent;
	}

	valueNode(): HjsonValueNode {
		if (!this.isValue()) throw new Error(`expected value node but got ${JSON.stringify(this.valueOf())}`);
		return this;
	}

	arrayNode(): HjsonArrayNode {
		if (!this.isArray()) throw new Error(`expected array node but got ${JSON.stringify(this.valueOf())}`);
		return this;
	}

	objectNode(): HjsonObjectNode {
		if (!this.isObject()) throw new Error(`expected object node but got ${JSON.stringify(this.valueOf())}`);
		return this;
	}

	abstract get(key: string | number): HjsonNode;

	path(pathStr: string): FieldInfo | ElementInfo | undefined {
		if (!pathStr) return undefined;

		const segments = pathStr.match(/(\w+)|\[(\d+)\]/g);

		if (!segments || segments.length === 0) return undefined;
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let current: HjsonNode = this;

		for (let i = 0; i < segments.length - 1; i++) {
			const seg = segments[i]!;
			const info = seg.startsWith("[") ? current.at(Number.parseInt(seg.slice(1, -1), 10)) : current.at(seg);
			if (!info) return undefined;
			current = info.value as HjsonNode;
		}

		const last = segments[segments.length - 1]!;

		return last.startsWith("[") ? current.at(Number.parseInt(last.slice(1, -1), 10)) : current.at(last);
	}

	nodePath(pathStr: string): HjsonNode {
		const field = this.path(pathStr);
		if (field && field.value instanceof HjsonNode) {
			return field.value as HjsonNode;
		}

		return HjsonMissingNode.instance;
	}

	abstract at(value: string | number): FieldInfo | ElementInfo | undefined;

	abstract patchRemove(original: string, key: string | number): string;

	abstract info(): InfoBase | undefined;

	abstract asString(): string | undefined;
	abstract asNumber(): number | undefined;
	abstract asBoolean(): boolean | undefined;
	abstract asValue<T>(): T | undefined;

	abstract valueOf(): unknown;
	toJSON(): unknown {
		return this.valueOf();
	}

	abstract detectIndent(): string;
}

export class HjsonObjectNode extends HjsonNode {
	readonly #data: Record<string, unknown>;
	readonly #fields: Map<string, FieldInfo>;
	readonly #start?: Position;
	readonly #end?: Position;

	constructor(
		data: Record<string, unknown>,
		fields: Map<string, FieldInfo> | Iterable<FieldInfo>,
		start?: Position,
		end?: Position,
		parent?: HjsonNode,
	) {
		super(parent);
		this.#data = data;
		if (fields instanceof Map) {
			this.#fields = fields;
		} else {
			this.#fields = new Map();
			for (const f of fields) {
				this.#fields.set(f.key, f);
			}
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

	patchRemove(original: string, key: string | number): string {
		if (typeof key !== "string") {
			throw new Error(`key must be a string: 'received '${key}'`);
		}

		return this.removeField(original, key);
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
	patchValue(original: string, key: string | number, newValue: unknown): string {
		if (typeof key !== "string") {
			throw new Error(`key must be a string: 'received '${key}'`);
		}

		const info = this.field(key);
		if (info) {
			return info.replaceValue(original, newValue!);
		}
		return this.insertField(original, key, newValue!);
	}

	removeField(original: string, key: string): string {
		const info = this.field(key);
		if (!info) return original;

		const fields = [...this.#fields.keys()];
		const idx = fields.indexOf(key);
		const totalFields = fields.length;

		if (totalFields === 1) {
			if (this.#start && this.#end && original[this.#start.index] === "{") {
				const openIdx = this.#start.index + 1;
				const closeIdx = this.#end.index;
				return original.slice(0, openIdx) + original.slice(closeIdx - 1);
			}
			return original.slice(0, info.start.index) + original.slice(info.end.index);
		}

		if (idx === 0) {
			const nextKey = fields[1]!;
			const nextInfo = this.#fields.get(nextKey)!;
			return original.slice(0, info.start.index) + original.slice(nextInfo.start.index);
		}

		let start = info.start.index - 1;
		while (start >= 0 && (original[start] === " " || original[start] === "\t" || original[start] === "\n" || original[start] === "\r")) {
			start--;
		}
		if (start >= 0 && original[start] === ",") {
			start--;
		}
		const commaEnd = start + 1;
		return original.slice(0, commaEnd) + original.slice(info.end.index);
	}

	detectIndent(): string {
		for (const fi of this.#fields.values()) {
			if (fi.start.col > 1) {
				return " ".repeat(fi.start.col - 1);
			}
		}
		return this.#emptyDetectIndent();
	}

	#emptyDetectIndent(): string {
		// Walk up parent chain to find containing field and compute correct indent
		if (this.parent instanceof HjsonObjectNode) {
			const parentObj = this.parent as HjsonObjectNode;
			for (const fi of parentObj.fields()) {
				if (fi.value === this) {
					const indentStep = detectIndentStep(parentObj, fi);
					return " ".repeat(fi.start.col - 1 + indentStep);
				}
			}
		}
		if (this.parent instanceof HjsonArrayNode) {
			const parentArr = this.parent as HjsonArrayNode;
			const arrIndent = parentArr.detectIndent();
			return " ".repeat(arrIndent.length + 2);
		}
		return "  ";
	}

	/**
	 * Inserts a new field into the original source string.
	 * If the object uses braces ({}), inserts before the closing brace.
	 * Otherwise (flat root object), appends at end.
	 */
	insertField(original: string, key: string, newValue: unknown): string {
		const indent = this.detectIndent();
		const val = serializeValue(newValue, indent);
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
				const closeBrace = original.slice(closeIdx, closeIdx + 1);
				const afterRest = original.slice(closeIdx + 1);
				const hasFields = this.#fields.size > 0;
				const braceIndent = indent.length >= 2 ? indent.slice(0, -2) : "";
				return before + (hasFields ? "," : "") + "\n" + indent + key + ": " + val + ",\n" + braceIndent + closeBrace + afterRest;
			}
		}
		// Flat root object (no braces) or no position info: append at end
		const trimmed = original.trimEnd();
		const suffix = trimmed.length > 0 && !trimmed.endsWith("\n") ? "\n" : "";
		return trimmed + suffix + `${key}: ${val}\n`;
	}
}

export interface ElementInfo<T = unknown> extends InfoBase {
	index: number;
	value: T;
	valueStart: Position;
	valueEnd: Position;
	replaceValue(original: string, newValue: unknown): string;
}

function detectIndentStep(obj: HjsonObjectNode, forField: FieldInfo): number {
	const cols: number[] = [];
	for (const fi of obj.fields()) {
		if (fi.key !== forField.key) {
			cols.push(fi.start.col);
		}
	}
	if (cols.length === 0) {
		// Single field: detect step from the object's opening brace column
		const startCol = obj.info()?.start?.col;
		if (startCol != null && startCol < forField.start.col) {
			return forField.start.col - startCol;
		}
		// Otherwise try grandparent
		const parent = obj.parent;
		if (parent instanceof HjsonObjectNode) {
			for (const fi of parent.fields()) {
				if (fi.value === obj) {
					return detectIndentStep(parent, fi);
				}
			}
		}
		return 2;
	}
	cols.sort((a, b) => a - b);
	cols.push(forField.start.col);
	cols.sort((a, b) => a - b);
	const idx = cols.indexOf(forField.start.col);
	let minStep = 2;
	if (idx > 0) {
		const prev = cols[idx - 1]!;
		minStep = Math.min(minStep, forField.start.col - prev);
	}
	if (idx < cols.length - 1) {
		const next = cols[idx + 1]!;
		minStep = Math.min(minStep, next - forField.start.col);
	}
	return Math.max(1, minStep);
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
		replaceValue(original: string, newValue: unknown) {
			const baseIndent = " ".repeat(Math.max(0, start.col - 1));
			return original.slice(0, valueStart.index) + serializeValue(newValue, baseIndent) + original.slice(valueEnd.index);
		},
	};
}

export class HjsonArrayNode extends HjsonNode {
	readonly #data: unknown[];
	readonly #elements: ElementInfo[];
	readonly #start?: Position;
	readonly #end?: Position;

	constructor(data: unknown[], elements: ElementInfo[], start?: Position, end?: Position, parent?: HjsonNode) {
		super(parent);
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

	patchRemove(original: string, index: number | string): string {
		if (typeof index !== "number") {
			throw new Error(`index must be a number: 'received '${index}'`);
		}

		return this.removeElement(original, index);
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

	detectIndent(): string {
		const firstEl = this.#elements[0];
		if (firstEl && firstEl.start.col > 1) {
			return " ".repeat(firstEl.start.col - 1);
		}
		// Empty array fallback: walk parent chain
		if (this.parent instanceof HjsonObjectNode) {
			const parentObj = this.parent as HjsonObjectNode;
			for (const fi of parentObj.fields()) {
				if (fi.value === this) {
					const indentStep = detectIndentStep(parentObj, fi);
					return " ".repeat(fi.start.col - 1 + indentStep);
				}
			}
		}
		if (this.parent instanceof HjsonArrayNode) {
			const parentArr = this.parent as HjsonArrayNode;
			const parentIndent = parentArr.detectIndent();
			return " ".repeat(parentIndent.length + 2);
		}
		return "  ";
	}

	#isInline(_original: string): boolean {
		if (!this.#start || this.#elements.length === 0) return true;
		return this.#elements[0]!.start.row === this.#start.row;
	}

	patchValue(original: string, key: string | number, newValue: unknown): string {
		if (typeof key !== "number") {
			throw new Error(`key must be a number: 'received '${key}'`);
		}

		const el = this.#elements[key];
		if (!el) {
			return original;
		}

		return el.replaceValue(original, newValue!);
	}

	insertElement(original: string, index: number, newValue: unknown): string {
		const len = this.#elements.length;
		if (index < 0 || index > len) return original;

		if (len === 0) {
			const openIdx = this.#start!.index + 1;
			const closeIdx = this.#end!.index;
			const elIndent = this.detectIndent();
			const val = serializeValue(newValue, elIndent);
			const bracketIndent = elIndent.length >= 2 ? elIndent.slice(0, -2) : "";
			return original.slice(0, openIdx) + "\n" + elIndent + val + ",\n" + bracketIndent + original.slice(closeIdx - 1);
		}

		const isMultiline = !this.#isInline(original);
		const indent = this.detectIndent();
		const val = serializeValue(newValue, indent);
		const sep = isMultiline ? ",\n" + indent : ", ";

		if (index === 0) {
			const insIdx = this.#elements[0]!.start.index;
			return original.slice(0, insIdx) + val + sep + original.slice(insIdx);
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
			if (isMultiline) {
				const bracketIndent = indent.length >= 2 ? indent.slice(0, -2) : "";
				return original.slice(0, insIdx) + ",\n" + indent + val + ",\n" + bracketIndent + original.slice(closeIdx);
			}
			return original.slice(0, insIdx) + ", " + val + original.slice(insIdx);
		}

		const insIdx = this.#elements[index]!.start.index;
		return original.slice(0, insIdx) + val + sep + original.slice(insIdx);
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
}

export class HjsonValueNode<T = unknown> extends HjsonNode {
	readonly #value: T;
	readonly #start: Position;
	readonly #end: Position;

	constructor(value: T, start: Position, end: Position, parent?: HjsonNode) {
		super(parent);
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

	patchRemove(original: string, key: string | number): string {
		if (this.parent) {
			return this.parent.patchRemove(original, key);
		}

		return original.slice(0, this.#start.index) + original.slice(this.#end.index);
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

	/** 2-arg form: patch value directly (no key needed) */
	patchValue(original: string, newValue: unknown): string;
	/** 3-arg form: standard patch with key context */
	patchValue(original: string, key: string | number, newValue: unknown): string;
	patchValue(original: string, key: string | number | unknown, newValue?: unknown): string {
		const val = arguments.length <= 2 ? key : newValue;
		if (val === undefined) {
			return original.slice(0, this.#start.index) + original.slice(this.#end.index);
		}
		const baseIndent = " ".repeat(Math.max(0, this.#start.col - 1));
		return original.slice(0, this.#start.index) + serializeValue(val, baseIndent) + original.slice(this.#end.index);
	}

	detectIndent(): string {
		return "";
	}
}

export class HjsonMissingNode extends HjsonNode {
	static readonly instance = new HjsonMissingNode();

	private constructor(parent?: HjsonNode) {
		super(parent);
	}

	patchValue(_original: string, _key: string | number, _newValue: unknown): string {
		throw new Error("Cannot patch missing node");
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

	patchRemove(_original: string, _key: string | number): string {
		throw new Error("Missing node cannot be removed");
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

	detectIndent(): string {
		return "";
	}
}

export type HjsonResult<T> = T extends Record<string, unknown> ? HjsonObjectNode : T extends unknown[] ? HjsonArrayNode : HjsonValueNode<T>;
