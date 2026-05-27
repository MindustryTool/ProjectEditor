export type ReplacerFunction = (this: any, key: string, value: any) => any;
export type Replacer = ReplacerFunction | (string | number)[];
export type Space = string | number;

function needsQuotes(key: string): boolean {
  if (key.length === 0) return true;
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$\-]*$/.test(key)) return true;
  if (key === "true" || key === "false" || key === "null") return true;
  return false;
}

function hasNewline(value: string): boolean {
  return value.includes("\n");
}

function getIndent(space: Space, depth: number): string {
  if (typeof space === "number") {
    return " ".repeat(Math.max(0, space) * depth);
  }
  if (typeof space === "string") {
    return space.repeat(depth);
  }
  return "";
}

function serializeValue(
  value: any,
  replacer: Replacer | null | undefined,
  space: Space | undefined,
  depth: number,
  key: string,
  ancestors: any[],
): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") {
    if (Number.isFinite(value)) return String(value);
    return "null";
  }

  if (typeof value === "string") {
    return serializeString(value, space, depth);
  }

  if (typeof value === "object") {
    if (ancestors.includes(value)) {
      return "null";
    }
    ancestors = [...ancestors, value];

    if (Array.isArray(value)) {
      return serializeArray(value, replacer, space, depth, ancestors);
    }

    if (typeof value.toJSON === "function") {
      const jsonVal = value.toJSON(key);
      if (jsonVal !== value) {
        return serializeValue(jsonVal, replacer, space, depth, key, ancestors);
      }
    }

    return serializeObject(value, replacer, space, depth, ancestors);
  }

  return "";
}

function serializeString(value: string, space: Space | undefined, _depth: number): string {
  if (hasNewline(value)) {
    return serializeMultilineString(value, space);
  }
  if (needsQuotes(value)) {
    return JSON.stringify(value);
  }
  return value;
}

function serializeMultilineString(value: string, _space: Space | undefined): string {
  const lines = value.split("\n");
  const indent = "  ";
  const indentedLines = lines.map((line) => (line.length > 0 ? indent + line : ""));
  return "'''\n" + indentedLines.join("\n") + "\n" + "'''";
}

function serializeObject(
  obj: Record<string, any>,
  replacer: Replacer | null | undefined,
  space: Space | undefined,
  depth: number,
  ancestors: any[],
): string {
  const keys = getKeys(obj, replacer);
  if (keys.length === 0) return "{}";

  const indent = getIndent(space ?? 0, depth + 1);
  const braceIndent = getIndent(space ?? 0, depth);
  const hasSpace = space !== undefined && space !== null;
  const parts: string[] = [];

  for (const k of keys) {
    const processedKey = typeof replacer === "function" ? String(k) : k;
    let val = obj[k];
    if (typeof replacer === "function") {
      val = replacer.call(obj, processedKey, val);
    }
    if (val === undefined) continue;
    if (typeof val === "function") continue;

    const serializedVal = serializeValue(val, replacer, space, depth + 1, processedKey, ancestors);
    const quotedKey = needsQuotes(processedKey) ? JSON.stringify(processedKey) : processedKey;
    if (hasSpace) {
      parts.push(`${indent}${quotedKey}: ${serializedVal}`);
    } else {
      parts.push(`${quotedKey}:${serializedVal}`);
    }
  }

  if (parts.length === 0) return "{}";

  if (hasSpace) {
    return "{\n" + parts.join(",\n") + ",\n" + braceIndent + "}";
  }
  return "{" + parts.join(",") + "," + "}";
}

function serializeArray(
  arr: any[],
  replacer: Replacer | null | undefined,
  space: Space | undefined,
  depth: number,
  ancestors: any[],
): string {
  if (arr.length === 0) return "[]";

  const indent = getIndent(space ?? 0, depth + 1);
  const braceIndent = getIndent(space ?? 0, depth);
  const hasSpace = space !== undefined && space !== null;
  const parts: string[] = [];

  for (let i = 0; i < arr.length; i++) {
    let val = arr[i];
    if (typeof replacer === "function") {
      val = replacer.call(arr, String(i), val);
    }
    if (val === undefined) {
      parts.push("null");
      continue;
    }
    const serialized = serializeValue(val, replacer, space, depth + 1, String(i), ancestors);
    if (hasSpace) {
      parts.push(`${indent}${serialized}`);
    } else {
      parts.push(serialized);
    }
  }

  if (hasSpace) {
    return "[\n" + parts.join(",\n") + ",\n" + braceIndent + "]";
  }
  return "[" + parts.join(",") + "," + "]";
}

function getKeys(obj: Record<string, any>, replacer: Replacer | null | undefined): string[] {
  if (Array.isArray(replacer)) {
    return replacer.map(String).filter((k) => k in obj);
  }
  return Object.keys(obj);
}

export function stringify(
  value: any,
  replacer?: Replacer | null,
  space?: Space,
): string {
  let processedValue = value;
  if (typeof replacer === "function") {
    processedValue = replacer.call({ "": value }, "", value);
  }
  if (processedValue === undefined) return undefined as any;
  return serializeValue(processedValue, replacer, space, 0, "", []);
}
