import type { ValidationResult, ValidatorFn, ValidatorRegistration } from "./types";
import { createValidatorRegistry } from "./registry";
import { HJSON, HJSONError, HjsonObjectNode } from "@project/hjson";
import { ItemHjsonSchema, LiquidHjsonSchema, ModHjsonSchema, SectorHjsonSchema, StatusHjsonSchema, UnitHjsonSchema } from "@project/schema";
import * as v from "valibot";
import { findUnknownProperties } from "./utils";
import type { SchemaFn } from "@project/schema";

const defaultValidatorRegistrations: readonly ValidatorRegistration[] = [
	{
		name: "hjson-syntax",
		pattern: (path) => path.endsWith(".json") || path.endsWith(".hjson"),
		validate: jsonSyntaxValidator,
	},
	{
		name: "mod-meta",
		pattern: (path) => path.endsWith("mod.hjson") || path.endsWith("mod.json"),
		validate: createValibotValidator(ModHjsonSchema),
	},
	{
		name: "items-hjson",
		pattern: (path) => path.startsWith("content/item") || (path.endsWith(".json") && path.endsWith(".hjson")),
		validate: createValibotValidator(ItemHjsonSchema),
	},
	{
		name: "liquids-hjson",
		pattern: (path) => path.startsWith("content/liquid") || (path.endsWith(".json") && path.endsWith(".hjson")),
		validate: createValibotValidator(LiquidHjsonSchema),
	},
	{
		name: "sectors-hjson",
		pattern: (path) => path.startsWith("content/sector") || (path.endsWith(".json") && path.endsWith(".hjson")),
		validate: createValibotValidator(SectorHjsonSchema),
	},
	{
		name: "statuses-hjson",
		pattern: (path) => path.startsWith("content/status") || (path.endsWith(".json") && path.endsWith(".hjson")),
		validate: createValibotValidator(StatusHjsonSchema),
	},
	{
		name: "units-hjson",
		pattern: (path) => path.startsWith("content/unit") || (path.endsWith(".json") && path.endsWith(".hjson")),
		validate: createValibotValidator(UnitHjsonSchema),
	},
];

function matches(registration: ValidatorRegistration, path: string): boolean {
	return typeof registration.pattern === "function" ? registration.pattern(path) : registration.pattern.test(path);
}

export function hasDefaultValidatorMatch(path: string): boolean {
	return defaultValidatorRegistrations.some((registration) => matches(registration, path));
}

export function createDefaultValidators() {
	const registry = createValidatorRegistry();

	for (const registration of defaultValidatorRegistrations) {
		registry.register(registration);
	}

	return registry;
}

function jsonSyntaxValidator({ path, content }: Parameters<ValidatorFn>[0]): ValidationResult[] {
	const trimmed = content.trim();

	if (!trimmed) return [];

	try {
		HJSON.parseWithCache(trimmed);
		return [];
	} catch (err) {
		if (err instanceof HJSONError) {
			const { startLine, startColumn, endLine, endColumn, code, message } = err;

			return [
				{
					path,
					severity: "error",
					messageKey: "validation.content.invalid-json",
					messageParams: { error: `${code}: ${message}` },
					startLine,
					startColumn,
					endLine,
					endColumn,
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
				severity: "error",
				messageKey: "validation.content.invalid-json",
				messageParams: { error: message },
				startLine,
				startColumn,
				endLine: startLine,
				endColumn: startColumn,
			},
		];
	}
}

function createValibotValidator<const T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
	schema: T | SchemaFn<T>,
): ValidatorFn {
	return ({ path, content, context }) => {
		const data = HJSON.parseWithCache(content);
		const resolved = typeof schema === "function" ? schema(data, context) : schema;
		const { success, issues } = v.safeParse(resolved, data.valueOf());
		const problems: ValidationResult[] = [];

		if (!success) {
			const resolveFieldData = (fieldData: ReturnType<typeof data.get>, path: (string | number)[]) => {
				for (const key of path.filter((p) => p !== undefined || p !== null || p !== "")) {
					const nested = fieldData.get(key);
					if (nested) {
						fieldData = nested;
					} else {
						break;
					}
				}
				return fieldData;
			};

			for (const issue of issues) {
				const field = issue.path?.map((p) => p.key)?.join(".") || "";

				const fieldPath = issue.path?.map((p) => p.key as string) || [];
				const fieldData = resolveFieldData(data, fieldPath);

				const fieldInfo = fieldData.info();

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

				problems.push({
					path,
					severity: "error",
					messageKey: "validation.content.invalid-field",
					field,
					messageParams: { field, error: issue.message },
					startLine,
					startColumn,
					endLine,
					endColumn,
				});

				if (issue.issues) {
					for (const subIssue of issue.issues) {
						const subIssueFieldPath = [...fieldPath, ...(subIssue.path?.map((p) => p.key as string) || [])];
						const subFieldData = resolveFieldData(data, subIssueFieldPath);
						const subFieldInfo = subFieldData.info();

						let subStartLine = 1;
						let subStartColumn = 1;
						let subEndLine = 1;
						let subEndColumn = 1;

						if (subFieldInfo) {
							subStartLine = subFieldInfo.start.row;
							subStartColumn = subFieldInfo.start.col;
							subEndLine = subFieldInfo.end.row;
							subEndColumn = subFieldInfo.end.col;
						}

						const field = subIssue.path?.map((p) => p.key)?.join(".") || "";

						problems.push({
							path,
							severity: "error",
							messageKey: "validation.content.invalid-field",
							field,
							messageParams: { field, error: subIssue.message },
							startLine: subStartLine,
							startColumn: subStartColumn,
							endLine: subEndLine,
							endColumn: subEndColumn,
						});
					}
				}
			}
		}

		if (data instanceof HjsonObjectNode) {
			const unknownPaths = findUnknownProperties(resolved, data.valueOf());

			for (const path of unknownPaths) {
				const field = data.path(path);

				problems.push({
					path,
					severity: "warning",
					messageKey: "validation.content.unknown-field",
					messageParams: { error: `Unknown field ${path}` },
					startLine: field?.start.row ?? 1,
					startColumn: field?.start.col ?? 1,
					endLine: field?.end?.row ?? 1,
					endColumn: field?.end?.col ?? 1,
				});
			}
		}

		return problems;
	};
}
