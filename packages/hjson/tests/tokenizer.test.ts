import { describe, it, expect } from "vitest";
import { Tokenizer, HJSONError, type Token } from "@project/hjson";

function tokens(input: string): Token[] {
  const t = new Tokenizer(input);
  const result: Token[] = [];
  while (true) {
    const tok = t.next();
    result.push(tok);
    if (tok.type === "EOF") break;
  }
  return result;
}

describe("Tokenizer", () => {
  describe("symbol tokens", () => {
    it("tokenizes curly braces", () => {
      const toks = tokens("{}");
      expect(toks[0]!.type).toBe("{");
      expect(toks[1]!.type).toBe("}");
    });

    it("tokenizes square brackets", () => {
      const toks = tokens("[]");
      expect(toks[0]!.type).toBe("[");
      expect(toks[1]!.type).toBe("]");
    });

    it("tokenizes colon", () => {
      const toks = tokens(":");
      expect(toks[0]!.type).toBe(":");
    });

    it("tokenizes comma", () => {
      const toks = tokens(",");
      expect(toks[0]!.type).toBe(",");
    });
  });

  describe("whitespace", () => {
    it("skips whitespace between tokens", () => {
      const toks = tokens("  {  \n  }  ");
      expect(toks[0]!.type).toBe("{");
      expect(toks[1]!.type).toBe("}");
    });

    it("tracks row and col correctly", () => {
      const t = new Tokenizer("\n\n{");
      const tok = t.next();
      expect(tok.row).toBe(3);
      expect(tok.col).toBe(1);
    });
  });

  describe("comments", () => {
    it("skips single-line // comments", () => {
      const toks = tokens("{ // comment\n }");
      expect(toks[0]!.type).toBe("{");
      expect(toks[1]!.type).toBe("}");
    });

    it("skips multi-line /* */ comments", () => {
      const toks = tokens("{ /* comment */ }");
      expect(toks[0]!.type).toBe("{");
      expect(toks[1]!.type).toBe("}");
    });

    it("skips # comments", () => {
      const toks = tokens("{ # line comment\n }");
      expect(toks[0]!.type).toBe("{");
      expect(toks[1]!.type).toBe("}");
    });
  });

  describe("quoted strings", () => {
    it("reads double-quoted strings", () => {
      const toks = tokens('"hello"');
      expect(toks[0]!.type).toBe("string");
      expect(toks[0]!.value).toBe("hello");
    });

    it("reads single-quoted strings", () => {
      const toks = tokens("'hello'");
      expect(toks[0]!.type).toBe("string");
      expect(toks[0]!.value).toBe("hello");
    });

    it("handles escape sequences", () => {
      const toks = tokens('"\\n\\t\\\\"');
      expect(toks[0]!.value).toBe("\n\t\\");
    });

    it("handles unicode escapes", () => {
      const toks = tokens('"\\u0041"');
      expect(toks[0]!.value).toBe("A");
    });
  });

  describe("multi-line strings", () => {
    it("reads multi-line strings with '''", () => {
      const input = "'''\nhello\nworld\n'''";
      const toks = tokens(input);
      expect(toks[0]!.type).toBe("string");
      expect(toks[0]!.value).toBe("hello\nworld");
    });

    it("strips leading indent from multi-line strings", () => {
      const input = "'''\n  hello\n  world\n  '''";
      const toks = tokens(input);
      expect(toks[0]!.value).toBe("hello\nworld");
    });
  });

  describe("unquoted strings", () => {
    it("reads bare words", () => {
      const toks = tokens("hello");
      expect(toks[0]!.type).toBe("string");
      expect(toks[0]!.value).toBe("hello");
    });

    it("reads multi-word unquoted strings with spaces", () => {
      const toks = tokens("hello world");
      expect(toks[0]!.type).toBe("string");
      expect(toks[0]!.value).toBe("hello world");
    });

    it('reads digit-prefixed unquoted string: 4.4.1-duct', () => {
      const toks = tokens("4.4.1-duct");
      expect(toks[0]!.type).toBe("string");
      expect(toks[0]!.value).toBe("4.4.1-duct");
    });

    it('reads digit-prefixed unquoted string: 12.34.56', () => {
      const toks = tokens("12.34.56");
      expect(toks[0]!.type).toBe("string");
      expect(toks[0]!.value).toBe("12.34.56");
    });

    it('reads digit-prefixed unquoted string: 123abc', () => {
      const toks = tokens("123abc");
      expect(toks[0]!.type).toBe("string");
      expect(toks[0]!.value).toBe("123abc");
    });
  });

  describe("numbers", () => {
    it("reads integers", () => {
      const toks = tokens("42");
      expect(toks[0]!.type).toBe("number");
      expect(toks[0]!.value).toBe("42");
    });

    it("reads negative numbers", () => {
      const toks = tokens("-10");
      expect(toks[0]!.type).toBe("number");
      expect(toks[0]!.value).toBe("-10");
    });

    it("reads floats", () => {
      const toks = tokens("3.14");
      expect(toks[0]!.type).toBe("number");
      expect(toks[0]!.value).toBe("3.14");
    });

    it("reads exponent notation", () => {
      const toks = tokens("5e2");
      expect(toks[0]!.type).toBe("number");
      expect(toks[0]!.value).toBe("5e2");
    });

    it("reads hex numbers", () => {
      const toks = tokens("0xFF");
      expect(toks[0]!.type).toBe("number");
      expect(toks[0]!.value).toBe("0xFF");
    });

    it("reads leading-zero integer as string: 0023", () => {
      const toks = tokens("0023");
      expect(toks[0]!.type).toBe("string");
      expect(toks[0]!.value).toBe("0023");
    });

    it("reads leading-zero integer as string: 00042", () => {
      const toks = tokens("00042");
      expect(toks[0]!.type).toBe("string");
      expect(toks[0]!.value).toBe("00042");
    });

    it("reads negative leading-zero integer as string: -007", () => {
      const toks = tokens("-007");
      expect(toks[0]!.type).toBe("string");
      expect(toks[0]!.value).toBe("-007");
    });

    it("reads positive leading-zero integer as string: +007", () => {
      const toks = tokens("+007");
      expect(toks[0]!.type).toBe("string");
      expect(toks[0]!.value).toBe("+007");
    });

    it("reads leading-zero float as number: 0.5", () => {
      const toks = tokens("0.5");
      expect(toks[0]!.type).toBe("number");
      expect(toks[0]!.value).toBe("0.5");
    });

    it("reads leading-zero float as number: 0.0", () => {
      const toks = tokens("0.0");
      expect(toks[0]!.type).toBe("number");
      expect(toks[0]!.value).toBe("0.0");
    });

    it("reads single zero as number", () => {
      const toks = tokens("0");
      expect(toks[0]!.type).toBe("number");
      expect(toks[0]!.value).toBe("0");
    });
  });

  describe("keywords", () => {
    it("reads true keyword as boolean", () => {
      const toks = tokens("true");
      expect(toks[0]!.type).toBe("boolean");
      expect(toks[0]!.value).toBe("true");
    });

    it("reads false keyword as boolean", () => {
      const toks = tokens("false");
      expect(toks[0]!.type).toBe("boolean");
      expect(toks[0]!.value).toBe("false");
    });

    it("reads null keyword", () => {
      const toks = tokens("null");
      expect(toks[0]!.type).toBe("null");
      expect(toks[0]!.value).toBe("null");
    });
  });

  describe("peek / next / expect API", () => {
    it("peek returns token without consuming it", () => {
      const t = new Tokenizer("42");
      const p1 = t.peek();
      const p2 = t.peek();
      expect(p1).toBe(p2);
      expect(p1.value).toBe("42");
      const n = t.next();
      expect(n).toBe(p1);
    });

    it("expect consumes and returns token of expected type", () => {
      const t = new Tokenizer("true");
      const tok = t.expect("boolean");
      expect(tok.value).toBe("true");
    });

    it("expect throws on unexpected type", () => {
      const t = new Tokenizer("42");
      expect(() => t.expect("boolean")).toThrow();
    });
  });

  describe("edge cases", () => {
    it("handles empty input", () => {
      const toks = tokens("");
      expect(toks).toHaveLength(1);
      expect(toks[0]!.type).toBe("EOF");
    });

    it("tracks position correctly", () => {
      const t = new Tokenizer('{\n  "key": val\n}');
      const t1 = t.next();
      expect(t1.type).toBe("{");
      expect(t1.row).toBe(1);
      expect(t1.col).toBe(1);

      const t2 = t.next();
      expect(t2.type).toBe("string");
      expect(t2.value).toBe("key");
      expect(t2.row).toBe(2);
      expect(t2.col).toBe(3);

      const t3 = t.next();
      expect(t3.type).toBe(":");
      expect(t3.row).toBe(2);
      expect(t3.col).toBe(8);

      const t4 = t.next();
      expect(t4.type).toBe("string");
      expect(t4.value).toBe("val");
      expect(t4.row).toBe(2);

      const t5 = t.next();
      expect(t5.type).toBe("}");
    });

    it("collects inputFragment on error", () => {
      const t = new Tokenizer("{@}");
      t.next();
      let caught: unknown;
      try {
        t.next();
      }       catch (e: unknown) {
        caught = e as HJSONError;
      }
      expect(caught).toBeDefined();
      expect((caught as HJSONError).inputFragment).toContain("@");
    });
  });
});
