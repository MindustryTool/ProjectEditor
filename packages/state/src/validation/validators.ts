import type { ValidatorFn } from "./types";
import { Severity } from "./types";
import { createValidatorRegistry } from "./registry";
import { HJSON, HJSONError, StructuredObjectNode } from "@project/hjson";
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

const createValibotValidator: (schema: Parameters<typeof v.parse>[0]) => ValidatorFn = (schema) => {
	return ({ path, content }) => {
		const data = HJSON.parseStructured(content) as StructuredObjectNode;
		try {
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

			v.parse(schema, data.valueOf());

			return [];
		} catch (err) {
			if (v.isValiError(err)) {
				const result = [];

				for (const issue of err.issues) {
					const field = issue.path?.map((p) => p.key)?.join(".") || "";
					const fieldInfo = data.field(field);

					let startLine = 1;
					let startColumn = 1;
					let endLine = 1;
					let endColumn = 1;

					if (fieldInfo) {
						startLine = fieldInfo.start.row;
						startColumn = fieldInfo.start.col;
						endLine = fieldInfo.end.row;
						endColumn = fieldInfo.end.col;
					}

					result.push({
						path,
						severity: Severity.error,
						messageKey: "validation.content.invalidJson",
						field,
						messageParams: { error: field + ": " + issue.message },
						startLine,
						startColumn,
						endLine,
						endColumn,
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
};

const modMetaValidator: ValidatorFn = createValibotValidator(ModHjsonSchema);

export function createDefaultValidators() {
	const registry = createValidatorRegistry();

	registry.register({
		name: "hjson-syntax",
		pattern: (path) => path.endsWith(".json") || path.endsWith(".hjson"),
		validate: jsonSyntaxValidator,
	});

	registry.register({
		name: "mod-meta",
		pattern: (path) => path.endsWith("mod.hjson") || path.endsWith("mod.json"),
		validate: modMetaValidator,
	});

	return registry;
}
