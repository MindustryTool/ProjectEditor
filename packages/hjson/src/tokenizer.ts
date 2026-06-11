import { HJSONError, HJSONErrorCode } from "./errors.js";

export type TokenType = "string" | "number" | "boolean" | "null" | "{" | "}" | "[" | "]" | ":" | "," | "EOF";

export interface Token {
	type: TokenType;
	value: string;
	row: number;
	col: number;
	index: number;
	endIndex: number;
}

const digits = new Set("0123456789");
const hexDigits = new Set("0123456789abcdefABCDEF");
const whitespaceChars = new Set(" \t\r\n");
const newlineChars = new Set("\r\n");

function isDigit(ch: string): boolean {
	return digits.has(ch);
}

function isIdentStart(ch: string): boolean {
	return /[a-zA-Z_$]/.test(ch);
}

function isIdentPart(ch: string): boolean {
	return /[a-zA-Z0-9_$\-]/.test(ch);
}

function isUnquotedStringChar(ch: string): boolean {
	if (isIdentPart(ch)) return true;
	if (ch === " " || ch === "\t") return true;
	return "+./".includes(ch);
}

function isUnquotedStringBody(ch: string): boolean {
	return isIdentPart(ch) || "+./".includes(ch);
}

function isLeadingZeroNumber(numStr: string): boolean {
	let s = numStr;
	if (s.startsWith("-") || s.startsWith("+")) {
		s = s.slice(1);
	}
	if (s.length < 2) return false;
	if (s.startsWith("0x") || s.startsWith("0X")) return false;
	return s.startsWith("0") && isDigit(s[1]!);
}

export class Tokenizer {
	private input: string;
	private pos: number;
	private row: number;
	private col: number;
	private peeked: Token | null = null;

	constructor(input: string) {
		this.input = input;
		this.pos = 0;
		this.row = 1;
		this.col = 1;
	}

	private advance(): void {
		if (this.pos < this.input.length) {
			if (newlineChars.has(this.input[this.pos]!)) {
				if (this.input[this.pos] === "\r" && this.pos + 1 < this.input.length && this.input[this.pos + 1] === "\n") {
					this.pos++;
					this.col++;
				}
				this.row++;
				this.col = 1;
			} else {
				this.col++;
			}
			this.pos++;
		}
	}

	private error(code: HJSONErrorCode, message?: string): never {
		throw new HJSONError(code, {
			startLine: this.row,
			startColumn: this.col,
			endLine: this.row,
			endColumn: this.col + 1,
			index: this.pos,
			inputFragment: this.input.slice(Math.max(0, this.pos), this.pos + 20),
			message,
		});
	}

	skipWhitespace(): void {
		while (this.pos < this.input.length && whitespaceChars.has(this.input[this.pos]!)) {
			this.advance();
		}
	}

	skipComment(): boolean {
		if (this.pos >= this.input.length) return false;
		if (this.input[this.pos] === "/") {
			const next = this.pos + 1 < this.input.length ? this.input[this.pos + 1] : "\0";
			if (next === "/") {
				while (this.pos < this.input.length && !newlineChars.has(this.input[this.pos]!)) {
					this.advance();
				}
				return true;
			}
			if (next === "*") {
				this.advance();
				this.advance();
				while (this.pos < this.input.length) {
					if (this.input[this.pos] === "*" && this.pos + 1 < this.input.length && this.input[this.pos + 1] === "/") {
						this.advance();
						this.advance();
						return true;
					}
					this.advance();
				}
				this.error(HJSONErrorCode.UnexpectedEndOfInput, "Unterminated multi-line comment");
			}
		}
		if (this.input[this.pos] === "#") {
			while (this.pos < this.input.length && !newlineChars.has(this.input[this.pos]!)) {
				this.advance();
			}
			return true;
		}
		return false;
	}

	skipWhitespaceAndComments(): void {
		while (true) {
			this.skipWhitespace();
			if (this.pos >= this.input.length) break;
			const savedPos = this.pos;
			if (!this.skipComment()) break;
			if (this.pos === savedPos) break;
		}
	}

	readString(quote: string): string {
		let result = "";
		this.advance();
		while (this.pos < this.input.length) {
			const ch = this.input[this.pos]!;
			if (ch === quote) {
				this.advance();
				return result;
			}
			if (ch === "\\") {
				this.advance();
				if (this.pos >= this.input.length) {
					this.error(HJSONErrorCode.UnterminatedString);
				}
				const esc = this.input[this.pos]!;
				switch (esc) {
					case '"':
						result += '"';
						break;
					case "\\":
						result += "\\";
						break;
					case "/":
						result += "/";
						break;
					case "b":
						result += "\b";
						break;
					case "f":
						result += "\f";
						break;
					case "n":
						result += "\n";
						break;
					case "r":
						result += "\r";
						break;
					case "t":
						result += "\t";
						break;
					case "u": {
						let hex = "";
						for (let i = 0; i < 4; i++) {
							this.advance();
							if (this.pos >= this.input.length) {
								this.error(HJSONErrorCode.UnterminatedString);
							}
							hex += this.input[this.pos]!;
						}
						if (![...hex].every((c) => hexDigits.has(c))) {
							this.error(HJSONErrorCode.InvalidEscapeSequence, `Invalid unicode escape \\u${hex}`);
						}
						result += String.fromCodePoint(Number.parseInt(hex, 16));
						break;
					}
					default: {
						this.error(HJSONErrorCode.InvalidEscapeSequence, `Invalid escape sequence \\${esc}`);
					}
				}
				this.advance();
			} else if (newlineChars.has(ch)) {
				this.error(HJSONErrorCode.UnterminatedString);
			} else {
				result += ch;
				this.advance();
			}
		}
		this.error(HJSONErrorCode.UnterminatedString);
	}

	readMultilineString(): string {
		this.advance();
		this.advance();
		this.advance();

		if (this.pos < this.input.length && newlineChars.has(this.input[this.pos]!)) {
			this.advance();
			if (this.pos > 1 && this.input[this.pos - 2] === "\r") {
			}
		}

		const lines: string[] = [];
		let current = "";
		while (this.pos < this.input.length) {
			if (
				this.input[this.pos] === "'" &&
				this.pos + 2 < this.input.length &&
				this.input[this.pos + 1] === "'" &&
				this.input[this.pos + 2] === "'"
			) {
				this.advance();
				this.advance();
				this.advance();
				const closingLine = current;
				return this.stripMultilineIndent(lines, closingLine);
			}
			if (newlineChars.has(this.input[this.pos]!)) {
				lines.push(current);
				current = "";
				this.advance();
				if (this.pos > 0 && this.input[this.pos - 1] === "\r" && this.pos < this.input.length && this.input[this.pos] === "\n") {
				}
			} else {
				current += this.input[this.pos]!;
				this.advance();
			}
		}
		this.error(HJSONErrorCode.UnterminatedMultilineString);
	}

	private stripMultilineIndent(lines: string[], closingLine: string): string {
		const contentLines = lines.slice();

		const indent = closingLine.match(/^(\s*)/)?.[1] ?? "";

		const resultLines = contentLines.map((line) => {
			if (line.startsWith(indent)) return line.slice(indent.length);
			return line;
		});

		return resultLines.join("\n");
	}

	readUnquotedString(): string {
		let result = "";
		while (this.pos < this.input.length && isUnquotedStringChar(this.input[this.pos]!)) {
			if (this.input[this.pos] === "/") {
				const next = this.pos + 1 < this.input.length ? this.input[this.pos + 1] : "\0";
				if (next === "/" || next === "*") break;
			}
			if (whitespaceChars.has(this.input[this.pos]!)) {
				if (
					result.length > 0 &&
					(this.pos + 1 >= this.input.length ||
						this.input[this.pos + 1] === "," ||
						this.input[this.pos + 1] === "}" ||
						this.input[this.pos + 1] === "]" ||
						this.input[this.pos + 1] === ":" ||
						this.input[this.pos + 1] === "/" ||
						this.input[this.pos + 1] === "#")
				) {
					break;
				}
				result += " ";
				this.advance();
				while (this.pos < this.input.length && (this.input[this.pos] === " " || this.input[this.pos] === "\t")) {
					this.advance();
				}
			} else {
				result += this.input[this.pos]!;
				this.advance();
			}
		}
		return result.trimEnd();
	}

	readNumber(): string {
		let result = "";

		if (this.input[this.pos] === "-" || this.input[this.pos] === "+") {
			result += this.input[this.pos]!;
			this.advance();
		}

		if (this.pos < this.input.length && this.input[this.pos] === "0") {
			result += "0";
			this.advance();
			if (this.pos < this.input.length && (this.input[this.pos] === "x" || this.input[this.pos] === "X")) {
				result += this.input[this.pos]!;
				this.advance();
				if (this.pos >= this.input.length || !hexDigits.has(this.input[this.pos]!)) {
					this.error(HJSONErrorCode.InvalidNumber, "Expected hexadecimal digit after 0x");
				}
				while (this.pos < this.input.length && hexDigits.has(this.input[this.pos]!)) {
					result += this.input[this.pos]!;
					this.advance();
				}
				return result;
			}
		}

		while (this.pos < this.input.length && isDigit(this.input[this.pos]!)) {
			result += this.input[this.pos]!;
			this.advance();
		}

		if (this.pos < this.input.length && this.input[this.pos] === ".") {
			result += ".";
			this.advance();
			while (this.pos < this.input.length && isDigit(this.input[this.pos]!)) {
				result += this.input[this.pos]!;
				this.advance();
			}
		}

		if (this.pos < this.input.length && (this.input[this.pos] === "e" || this.input[this.pos] === "E")) {
			result += this.input[this.pos]!;
			this.advance();
			if (this.pos < this.input.length && (this.input[this.pos] === "-" || this.input[this.pos] === "+")) {
				result += this.input[this.pos]!;
				this.advance();
			}
			if (this.pos >= this.input.length || !isDigit(this.input[this.pos]!)) {
				this.error(HJSONErrorCode.InvalidNumber, "Expected digit after exponent");
			}
			while (this.pos < this.input.length && isDigit(this.input[this.pos]!)) {
				result += this.input[this.pos]!;
				this.advance();
			}
		}

		return result;
	}

	peek(): Token {
		if (this.peeked) return this.peeked;
		this.peeked = this.scan();
		return this.peeked;
	}

	next(): Token {
		const token = this.peeked ?? this.scan();
		this.peeked = null;
		return token;
	}

	expect(type: TokenType): Token {
		const token = this.next();
		if (token.type !== type) {
			this.error(HJSONErrorCode.UnexpectedToken, `Expected ${type} but got ${token.type} ("${token.value}")`);
		}
		return token;
	}

	private scan(): Token {
		this.skipWhitespaceAndComments();

		if (this.pos >= this.input.length) {
			return token("EOF", "", this.row, this.col, this.pos, this.pos);
		}

		const ch = this.input[this.pos]!;
		const startRow = this.row;
		const startCol = this.col;
		const startIdx = this.pos;

		if (ch === "'" && this.pos + 2 < this.input.length && this.input[this.pos + 1] === "'" && this.input[this.pos + 2] === "'") {
			const value = this.readMultilineString();
			return token("string", value, startRow, startCol, startIdx, this.pos);
		}

		if (ch === '"' || ch === "'") {
			const value = this.readString(ch);
			return token("string", value, startRow, startCol, startIdx, this.pos);
		}

		if (ch === "-" || ch === "+" || isDigit(ch)) {
			const savedPos = this.pos;
			const numStr = this.readNumber();
			if (numStr.length > 0 && numStr !== "-" && numStr !== "+") {
				if (this.pos < this.input.length && isUnquotedStringBody(this.input[this.pos]!)) {
					this.pos = startIdx;
					this.row = startRow;
					this.col = startCol;
					const value = this.readUnquotedString();
					if (value.length > 0) {
						return token("string", value, startRow, startCol, startIdx, this.pos);
					}
				}
				if (isLeadingZeroNumber(numStr)) {
					return token("string", numStr, startRow, startCol, startIdx, this.pos);
				}
				return token("number", numStr, startRow, startCol, startIdx, this.pos);
			}
			this.pos = savedPos;
			this.row = startRow;
			this.col = startCol;
		}

		switch (ch) {
			case "{": {
				this.advance();
				return token("{", "{", startRow, startCol, startIdx, this.pos);
			}
			case "}": {
				this.advance();
				return token("}", "}", startRow, startCol, startIdx, this.pos);
			}
			case "[": {
				this.advance();
				return token("[", "[", startRow, startCol, startIdx, this.pos);
			}
			case "]": {
				this.advance();
				return token("]", "]", startRow, startCol, startIdx, this.pos);
			}
			case ":": {
				this.advance();
				return token(":", ":", startRow, startCol, startIdx, this.pos);
			}
			case ",": {
				this.advance();
				return token(",", ",", startRow, startCol, startIdx, this.pos);
			}
		}

		if (isIdentStart(ch)) {
			const savedPos = this.pos;
			let word = "";
			while (this.pos < this.input.length && isIdentPart(this.input[this.pos]!)) {
				word += this.input[this.pos]!;
				this.advance();
			}
			if (word === "true" || word === "false") {
				return token("boolean", word, startRow, startCol, startIdx, this.pos);
			}
			if (word === "null") {
				return token("null", word, startRow, startCol, startIdx, this.pos);
			}

			this.pos = savedPos;
			this.row = startRow;
			this.col = startCol;

			const value = this.readUnquotedString();
			if (value.length > 0) {
				return token("string", value, startRow, startCol, startIdx, this.pos);
			}
		}

		if (ch === "." || ch === "+") {
			const savedPos = this.pos;
			const numStr = this.readNumber();
			if (numStr.length > 0 && numStr !== ".") {
				if (this.pos < this.input.length && isUnquotedStringBody(this.input[this.pos]!)) {
					this.pos = startIdx;
					this.row = startRow;
					this.col = startCol;
					const value = this.readUnquotedString();
					if (value.length > 0) {
						return token("string", value, startRow, startCol, startIdx, this.pos);
					}
				}
				return token("number", numStr, startRow, startCol, startIdx, this.pos);
			}
			this.pos = savedPos;
			this.row = startRow;
			this.col = startCol;
		}

		this.error(HJSONErrorCode.UnexpectedToken, `Unexpected character "${ch}"`);
	}
}

function token(type: TokenType, value: string, row: number, col: number, index: number, endIndex: number): Token {
	return { type, value, row, col, index, endIndex };
}
