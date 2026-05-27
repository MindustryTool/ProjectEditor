import type { ValidatorFn } from "./types";
import { Severity } from "./types";
import { createValidatorRegistry } from "./registry";
import { HJSON, HJSONError } from "@project/hjson";
import { ModHjsonSchema } from "@project/validation";
import * as v from "valibot";

const jsonSyntaxValidator: ValidatorFn = ({ path, content }) => {
	const trimmed = content.trim();

	if (!trimmed) return [];

	try {
		HJSON.parse(trimmed);
		return [];
	} catch (err) {
		if (err instanceof HJSONError) {
			const { startLine, startColumn, endLine, endColumn, code, message } = err;
			return [
				{
					path,
					severity: Severity.error,
					messageKey: "validation.content.invalidJson",
					messageParams: { error: `${code}: ${message}` },
					startLine,
					startColumn,
					endLine: endLine ?? startLine,
					endColumn: endColumn ?? startColumn,
				},
			];
		}

		const message = err instanceof Error ? err.message : String(err);
		const lineMatch = message.match(/position\s+(\d+)/i);
		const lineColMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);

		let startLine = 1;
		let startColumn = 1;

		if (lineColMatch) {
			startLine = parseInt(lineColMatch[1]!, 10);
			startColumn = parseInt(lineColMatch[2]!, 10);
		} else if (lineMatch) {
			const pos = parseInt(lineMatch[1]!, 10);
			const lines = content.slice(0, pos).split("\n");
			startLine = lines.length;
			startColumn = lines[lines.length - 1]!.length + 1;
		}

		return [
			{
				path,
				severity: Severity.error,
				messageKey: "validation.content.invalidJson",
				messageParams: { error: message },
				startLine,
				startColumn,
				endLine: startLine,
				endColumn: startColumn,
			},
		];
	}
};

const modMetaValidator: ValidatorFn = ({ path, content }) => {
	try {
		const data = HJSON.parse(content);

		if (typeof data !== "object" || data === null)
			return [
				{
					path,
					severity: Severity.error,
					messageKey: "validation.content.invalidJson",
					messageParams: { error: "Mod meta is not a valid JSON object" },
					startLine: 1,
					startColumn: 1,
					endLine: 1,
					endColumn: 1,
				},
			];

		v.parse(ModHjsonSchema, data);

		return [];
	} catch (err) {
		if (v.isValiError(err)) {
			const result = [];

			for (const issue of err.issues) {
                const field = issue.path?.map((p) => p.key)?.join(".");
				result.push({
					path,
					severity: Severity.error,
					messageKey: "validation.content.invalidJson",
                    field,
					messageParams: { error: field + ": " + issue.message },
					startLine: 1,
					startColumn: 1,
					endLine: 1,
					endColumn: 1,
				});
			}

			return result;
		}

		return [
			{
				path,
				severity: Severity.error,
				messageKey: "validation.content.invalidJson",
				messageParams: { error: "Aaaaa" },
				startLine: 1,
				startColumn: 1,
				endLine: 1,
				endColumn: 1,
			},
		];
	}
};

export function createDefaultValidators() {
	const registry = createValidatorRegistry();

	registry.register({
		name: "json-syntax",
		pattern: "*.json",
		validate: jsonSyntaxValidator,
	});

	registry.register({
		name: "json-syntax",
		pattern: "*.hjson",
		validate: jsonSyntaxValidator,
	});

	registry.register({
		name: "mod-meta",
		pattern: "mod.hjson",
		validate: modMetaValidator,
	});

	return registry;
}
