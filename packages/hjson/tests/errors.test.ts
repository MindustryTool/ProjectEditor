import { describe, it, expect } from "vitest";
import { HJSONError, HJSONErrorCode } from "../src/errors.js";

describe("HJSONErrorCode", () => {
  it("has all expected error codes as const values", () => {
    expect(HJSONErrorCode.UnexpectedToken).toBe("UNEXPECTED_TOKEN");
    expect(HJSONErrorCode.UnterminatedString).toBe("UNTERMINATED_STRING");
    expect(HJSONErrorCode.UnterminatedMultilineString).toBe("UNTERMINATED_MULTILINE_STRING");
    expect(HJSONErrorCode.ExpectedValue).toBe("EXPECTED_VALUE");
    expect(HJSONErrorCode.ExpectedCommaOrClosingBrace).toBe("EXPECTED_COMMA_OR_CLOSING_BRACE");
    expect(HJSONErrorCode.DuplicateKey).toBe("DUPLICATE_KEY");
    expect(HJSONErrorCode.InvalidNumber).toBe("INVALID_NUMBER");
    expect(HJSONErrorCode.UnexpectedEndOfInput).toBe("UNEXPECTED_END_OF_INPUT");
    expect(HJSONErrorCode.ExpectedColon).toBe("EXPECTED_COLON");
    expect(HJSONErrorCode.InvalidEscapeSequence).toBe("INVALID_ESCAPE_SEQUENCE");
    expect(HJSONErrorCode.MaximumDepthExceeded).toBe("MAXIMUM_DEPTH_EXCEEDED");
  });

  it("HJSONErrorCode type is a strict string union", () => {
    const code: HJSONErrorCode = HJSONErrorCode.UnexpectedToken;
    expect(typeof code).toBe("string");
  });
});

describe("HJSONError", () => {
  it("creates error with UnexpectedToken code at correct position", () => {
    const err = new HJSONError(HJSONErrorCode.UnexpectedToken, {
      startLine: 1,
      startColumn: 6,
      index: 5,
      inputFragment: "@invalid",
    });
    expect(err.code).toBe(HJSONErrorCode.UnexpectedToken);
    expect(err.startLine).toBe(1);
    expect(err.startColumn).toBe(6);
    expect(err.index).toBe(5);
    expect(err.inputFragment).toBe("@invalid");
    expect(err.name).toBe("HJSONError");
  });

  it("extends SyntaxError", () => {
    const err = new HJSONError(HJSONErrorCode.UnexpectedToken, {
      startLine: 0,
      startColumn: 0,
      index: 0,
      inputFragment: "",
    });
    expect(err).toBeInstanceOf(SyntaxError);
    expect(err).toBeInstanceOf(Error);
  });

  it("includes human-readable message with position and snippet", () => {
    const err = new HJSONError(HJSONErrorCode.UnterminatedString, {
      startLine: 2,
      startColumn: 10,
      index: 25,
      inputFragment: '"unclosed',
    });
    expect(err.message).toContain("Unterminated string literal");
    expect(err.message).toContain("2:10");
    expect(err.message).toContain('"unclosed"');
  });

  it("throws with UnterminatedString code", () => {
    const err = new HJSONError(HJSONErrorCode.UnterminatedString, {
      startLine: 1,
      startColumn: 5,
      index: 5,
      inputFragment: '"unclosed',
    });
    expect(err.code).toBe(HJSONErrorCode.UnterminatedString);
  });

  it("throws with UnterminatedMultilineString code", () => {
    const err = new HJSONError(HJSONErrorCode.UnterminatedMultilineString, {
      startLine: 1,
      startColumn: 5,
      index: 5,
      inputFragment: "'''\nhello",
    });
    expect(err.code).toBe(HJSONErrorCode.UnterminatedMultilineString);
  });

  it("throws with ExpectedValue code", () => {
    const err = new HJSONError(HJSONErrorCode.ExpectedValue, {
      startLine: 0,
      startColumn: 0,
      index: 0,
      inputFragment: "",
    });
    expect(err.code).toBe(HJSONErrorCode.ExpectedValue);
  });

  it("throws with ExpectedCommaOrClosingBrace code", () => {
    const err = new HJSONError(HJSONErrorCode.ExpectedCommaOrClosingBrace, {
      startLine: 1,
      startColumn: 8,
      index: 8,
      inputFragment: "a: 1 b: 2",
    });
    expect(err.code).toBe(HJSONErrorCode.ExpectedCommaOrClosingBrace);
  });

  it("throws with DuplicateKey code", () => {
    const err = new HJSONError(HJSONErrorCode.DuplicateKey, {
      startLine: 1,
      startColumn: 5,
      index: 5,
      inputFragment: "a: 1, a: 2",
    });
    expect(err.code).toBe(HJSONErrorCode.DuplicateKey);
  });

  it("throws with InvalidNumber code", () => {
    const err = new HJSONError(HJSONErrorCode.InvalidNumber, {
      startLine: 1,
      startColumn: 4,
      index: 4,
      inputFragment: "12.34.56",
    });
    expect(err.code).toBe(HJSONErrorCode.InvalidNumber);
  });

  it("throws with UnexpectedEndOfInput code", () => {
    const err = new HJSONError(HJSONErrorCode.UnexpectedEndOfInput, {
      startLine: 1,
      startColumn: 4,
      index: 4,
      inputFragment: "{a: ",
    });
    expect(err.code).toBe(HJSONErrorCode.UnexpectedEndOfInput);
  });

  it("includes inputFragment with surrounding characters", () => {
    const err = new HJSONError(HJSONErrorCode.UnexpectedToken, {
      startLine: 1,
      startColumn: 6,
      index: 5,
      inputFragment: "@invalid",
    });
    expect(err.inputFragment).toBe("@invalid");
  });

  it("has readonly properties on the error instance", () => {
    const err = new HJSONError(HJSONErrorCode.InvalidNumber, {
      startLine: 1,
      startColumn: 4,
      index: 4,
      inputFragment: "12.34.56",
    });
    expect(err.code).toBe(HJSONErrorCode.InvalidNumber);
    expect(err.startLine).toBe(1);
    expect(err.startColumn).toBe(4);
    expect(err.index).toBe(4);
  });

  it("endLine and endColumn default to start values when not provided", () => {
    const err = new HJSONError(HJSONErrorCode.UnexpectedToken, {
      startLine: 2,
      startColumn: 3,
      index: 10,
      inputFragment: "@bad",
    });
    expect(err.endLine).toBe(2);
    expect(err.endColumn).toBe(3);
  });

  it("endLine and endColumn are set when explicitly provided", () => {
    const err = new HJSONError(HJSONErrorCode.InvalidNumber, {
      startLine: 1,
      startColumn: 4,
      endLine: 1,
      endColumn: 12,
      index: 4,
      inputFragment: "12.34.56",
    });
    expect(err.endLine).toBe(1);
    expect(err.endColumn).toBe(12);
  });
});
