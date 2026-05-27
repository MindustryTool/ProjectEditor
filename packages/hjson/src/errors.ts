export const HJSONErrorCode = {
  UnexpectedToken: "UNEXPECTED_TOKEN",
  UnterminatedString: "UNTERMINATED_STRING",
  UnterminatedMultilineString: "UNTERMINATED_MULTILINE_STRING",
  ExpectedValue: "EXPECTED_VALUE",
  ExpectedCommaOrClosingBrace: "EXPECTED_COMMA_OR_CLOSING_BRACE",
  DuplicateKey: "DUPLICATE_KEY",
  InvalidNumber: "INVALID_NUMBER",
  UnexpectedEndOfInput: "UNEXPECTED_END_OF_INPUT",
  ExpectedColon: "EXPECTED_COLON",
  InvalidEscapeSequence: "INVALID_ESCAPE_SEQUENCE",
  MaximumDepthExceeded: "MAXIMUM_DEPTH_EXCEEDED",
} as const;

export type HJSONErrorCode = (typeof HJSONErrorCode)[keyof typeof HJSONErrorCode];

const errorMessages: Record<HJSONErrorCode, string> = {
  [HJSONErrorCode.UnexpectedToken]: "Unexpected token",
  [HJSONErrorCode.UnterminatedString]: "Unterminated string literal",
  [HJSONErrorCode.UnterminatedMultilineString]: "Unterminated multi-line string",
  [HJSONErrorCode.ExpectedValue]: "Expected a value",
  [HJSONErrorCode.ExpectedCommaOrClosingBrace]: "Expected comma or closing brace/bracket",
  [HJSONErrorCode.DuplicateKey]: "Duplicate object key",
  [HJSONErrorCode.InvalidNumber]: "Invalid number format",
  [HJSONErrorCode.UnexpectedEndOfInput]: "Unexpected end of input",
  [HJSONErrorCode.ExpectedColon]: "Expected colon",
  [HJSONErrorCode.InvalidEscapeSequence]: "Invalid escape sequence in string",
  [HJSONErrorCode.MaximumDepthExceeded]: "Maximum nesting depth exceeded",
};

export class HJSONError extends SyntaxError {
  readonly code: HJSONErrorCode;
  readonly row: number;
  readonly col: number;
  readonly index: number;
  readonly inputFragment: string;

  constructor(
    code: HJSONErrorCode,
    options: {
      row: number;
      col: number;
      index: number;
      inputFragment: string;
      message?: string;
    },
  ) {
    const baseMessage = errorMessages[code];
    const detail = options.message ?? formatErrorSnippet(options.inputFragment);
    super(`${baseMessage} at ${options.row}:${options.col} — ${detail}`);

    this.name = "HJSONError";
    this.code = code;
    this.row = options.row;
    this.col = options.col;
    this.index = options.index;
    this.inputFragment = options.inputFragment;
  }
}

function formatErrorSnippet(input: string): string {
  const trimmed = input.replace(/\n/g, "\\n");
  if (trimmed.length > 40) {
    return `"${trimmed.slice(0, 40)}..."`;
  }
  return `"${trimmed}"`;
}
