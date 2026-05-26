import type { ValidatorFn } from "./types";
import { Severity } from "./types";
import { createValidatorRegistry } from "./registry";

export const jsonSyntaxValidator: ValidatorFn = ({ path, content }) => {
  const trimmed = content.trim();
  if (!trimmed) return [];

  try {
    JSON.parse(trimmed);
    return [];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const lineMatch = message.match(/position\s+(\d+)/i);
    const lineColMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);

    let line: number | undefined;
    let column: number | undefined;

    if (lineColMatch) {
      line = parseInt(lineColMatch[1]!, 10);
      column = parseInt(lineColMatch[2]!, 10);
    } else if (lineMatch) {
      const pos = parseInt(lineMatch[1]!, 10);
      const lines = content.slice(0, pos).split("\n");
      line = lines.length;
      column = lines[lines.length - 1]!.length + 1;
    }

    return [{
      path,
      severity: Severity.error,
      messageKey: "validation.content.invalidJson",
      messageParams: { error: message },
      line,
      column,
    }];
  }
};

interface ContentEntry {
  name?: string;
  type?: string;
}

const KNOWN_CONTENT_TYPES = [
  "item",
  "block",
  "liquid",
  "unit",
  "mech",
  "turret",
  "drill",
  "conveyor",
  "router",
  "junction",
  "factory",
  "power",
  "defense",
  "distribution",
  "crafting",
  "schematic",
];

export const contentJsonValidator: ValidatorFn = ({ path, content }) => {
  const trimmed = content.trim();
  if (!trimmed) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return [{
      path,
      severity: Severity.error,
      messageKey: "validation.content.invalidJson",
    }];
  }

  const issues: ReturnType<typeof contentJsonValidator> = [];
  const entries: ContentEntry[] = Array.isArray(parsed) ? parsed : [parsed as ContentEntry];
  const seenNames = new Map<string, number>();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]!;

    if (!entry.type) {
      issues.push({
        path,
        severity: Severity.error,
        messageKey: "validation.content.missingField",
        messageParams: { index: i + 1 },
        field: "type",
      });
      continue;
    }

    if (!KNOWN_CONTENT_TYPES.includes(entry.type)) {
      issues.push({
        path,
        severity: Severity.warning,
        messageKey: "validation.content.unknownType",
        messageParams: { type: entry.type },
      });
    }

    if (entry.name) {
      if (seenNames.has(entry.name)) {
        issues.push({
          path,
          severity: Severity.error,
          messageKey: "validation.content.duplicateName",
          messageParams: { name: entry.name, firstIndex: seenNames.get(entry.name)! + 1, secondIndex: i + 1 },
        });
      } else {
        seenNames.set(entry.name, i);
      }
    }
  }

  return issues;
};

export function createDefaultValidators() {
  const registry = createValidatorRegistry();

  registry.register({
    name: "content-json",
    pattern: "content/**/*.json",
    validate: (params) => {
      const syntaxResults = jsonSyntaxValidator(params);
      if (syntaxResults.length > 0) return syntaxResults;
      return contentJsonValidator(params);
    },
  });

  registry.register({
    name: "json-syntax",
    pattern: "*.json",
    validate: jsonSyntaxValidator,
  });

  return registry;
}
