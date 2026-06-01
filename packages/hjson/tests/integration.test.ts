import { describe, it, expect } from "vitest";
import { HJSON } from "@project/hjson";

describe("Integration: real-world scenarios", () => {
  it("parses a config file with comments, unquoted keys, trailing commas", () => {
    const input = `
      // Application configuration
      {
        name: "my-app",
        version: "2.0.0",
        debug: false,
        database: {
          host: localhost,
          port: 5432,
          credentials: {
            user: admin,
            /* password is set by env */
          },
        },
        features: [
          "auth",
          "logging",
          "analytics",
        ],
      }
    `;
    const result = HJSON.parse(input);
    expect(result.name).toBe("my-app");
    expect(result.version).toBe("2.0.0");
    expect(result.debug).toBe(false);
    expect(result.database.host).toBe("localhost");
    expect(result.database.port).toBe(5432);
    expect(result.database.credentials.user).toBe("admin");
    expect(result.features).toEqual(["auth", "logging", "analytics"]);
  });

  it("parses unquoted string values with spaces", () => {
    const input = '{description: hello world, status: active}';
    const result = HJSON.parse(input);
    expect(result.description).toBe("hello world");
    expect(result.status).toBe("active");
  });

  it("parses multi-line string values", () => {
    const input = "{\n  message: '''\n    Line 1\n    Line 2\n    Line 3\n    '''\n}";
    const result = HJSON.parse(input);
    expect(result.message).toBe("Line 1\nLine 2\nLine 3");
  });

  it("parses various number formats", () => {
    const input = '{int: 255, hex: 0xFF, float: -3.14, exp: 1.5e3}';
    const result = HJSON.parse(input);
    expect(result.int).toBe(255);
    expect(result.hex).toBe(255);
    expect(result.float).toBe(-3.14);
    expect(result.exp).toBe(1500);
  });

  it("parses root-level object without braces (key-value pairs)", () => {
    const input = "host: server.example.com\nport: 8080\nssl: true";
    const result = HJSON.parse(input);
    expect(result.host).toBe("server.example.com");
    expect(result.port).toBe(8080);
    expect(result.ssl).toBe(true);
  });

  it("round-trips a complex nested structure", () => {
    const original = {
      string: "hello",
      number: 42,
      float: 3.14,
      bool: true,
      nullVal: null,
      array: [1, "two", false, null, { nested: "object" }],
      object: {
        deep: {
          deeper: "value",
          list: [1, 2, 3],
        },
      },
    };
    const serialized = HJSON.stringify(original, null, 2);
    const parsed = HJSON.parse(serialized);
    expect(parsed).toEqual(original);
  });

  it("stringify produces valid HJSON that can be re-parsed", () => {
    const original = { key: "value", arr: [1, 2] };
    const serialized = HJSON.stringify(original, null, 2);
    expect(() => HJSON.parse(serialized)).not.toThrow();
    const parsed = HJSON.parse(serialized);
    expect(parsed).toEqual(original);
  });

  it("handles empty inputs gracefully", () => {
    const result = HJSON.parse("{}");
    expect(result).toEqual({});
    const result2 = HJSON.parse("[]");
    expect(result2).toEqual([]);
  });

  it("handles # line comments", () => {
    const input = "{ # this is a comment\n  key: val\n}";
    const result = HJSON.parse(input);
    expect(result.key).toBe("val");
  });

  it("provides typed error with code, startLine, startColumn, index", () => {
    try {
      HJSON.parse("{invalid: @bad}");
    } catch (e: unknown) {
      expect(e.code).toBeDefined();
      expect(typeof e.startLine).toBe("number");
      expect(typeof e.startColumn).toBe("number");
      expect(typeof e.index).toBe("number");
      expect(e.inputFragment).toBeDefined();
    }
  });
});
