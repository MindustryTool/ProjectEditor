import type { ValidationContext, ValidationResult, ValidatorFn } from "./types";
import { Severity } from "./types";
import { createValidatorRegistry } from "./registry";
import type { HjsonNode } from "@project/hjson";
import { HJSON, HJSONError, HjsonObjectNode } from "@project/hjson";
import { ItemHjsonSchema, LiquidHjsonSchema, ModHjsonSchema, type ResearchSchema } from "@project/schema";
import * as v from "valibot";
import { findUnknownProperties } from "./utils";

const jsonSyntaxValidator: ValidatorFn = ({ path, content }) => {
	const trimmed = content.trim();

	if (!trimmed) return [];

	try {
		HJSON.parse(trimmed);
		return [];
	} catch (err) {
		if (err instanceof HJSONError) {
			const { startLine, startColumn, endLine, endColumn, code, message } = err;

			console.log({ startLine, startColumn, endLine, endColumn, code, message });

			return [
				{
					path,
					severity: Severity.error,
					messageKey: "validation.content.invalidJson",
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

type PostValidatorFn<T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>> = (c: {
	path: string;
	content: string;
	context: ValidationContext;
	result: v.InferOutput<T>;
	node: HjsonNode;
}) => ValidationResult[];

function createValibotValidator<const T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
	schema: T,
	validator?: PostValidatorFn<T>,
): ValidatorFn {
	return ({ path, content, context }) => {
		const data = HJSON.parseStructured(content);
		const { success, output: result, issues } = v.safeParse(schema, data.valueOf());

		if (!success) {
			const result = [];

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

						result.push({
							path,
							severity: Severity.error,
							messageKey: "validation.content.invalidJson",
							field: subIssue.path?.map((p) => p.key)?.join(".") || "",
							messageParams: { error: subIssue.message },
							startLine: subStartLine,
							startColumn: subStartColumn,
							endLine: subEndLine,
							endColumn: subEndColumn,
						});
					}
				}
			}

			return result;
		}

		const problems = [];

		if (validator) {
			problems.push(...validator({ path, content, context, result, node: data }));
		}

		if (data instanceof HjsonObjectNode) {
			const unknownPaths = findUnknownProperties(schema, data.valueOf());

			for (const path of unknownPaths) {
				const field = data.path(path);

				problems.push({
					path,
					severity: Severity.warning,
					messageKey: "validation.content.invalidJson",
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

function findContent(name: string, context: ValidationContext) {
	const items = context.getItems();

	const item = items.find((i) => i.name === name);

	if (item) {
		return item;
	}

	const blocks = context.getBlocks();
	const block = blocks.find((b) => b.name === name);
	if (block) {
		return block;
	}

	const liquids = context.getLiquids();
	const liquid = liquids.find((l) => l.name === name);
	if (liquid) {
		return liquid;
	}

	const sectors = context.getSectors();
	const sector = sectors.find((s) => s.name === name);
	if (sector) {
		return sector;
	}

	const statuses = context.getStatuses();
	const status = statuses.find((s) => s.name === name);
	if (status) {
		return status;
	}

	const units = context.getUnits();
	const unit = units.find((u) => u.name === name);
	if (unit) {
		return unit;
	}

	return null;
}

const researchValidator: PostValidatorFn<typeof ResearchSchema> = ({ path, context, result, node }) => {
	const research = result;
	const issues: ValidationResult[] = [];

	if (!research) {
		return [];
	}

	const researchField = node.get("research")!;

	if (typeof research === "string") {
		const content = findContent(research, context);

		if (!content) {
			issues.push({
				path,
				severity: Severity.error,
				messageKey: "validation.content.invalidJson",
				messageParams: { error: `Content ${research} not found` },
				startLine: researchField.info()!.start.row,
				startColumn: researchField.info()!.start.col,
				endLine: researchField.info()!.end.row,
				endColumn: researchField.info()!.end.col,
			});
		}
	} else if (typeof research === "object") {
		const parent = research.parent;
		const parentField = researchField.get("parent")!;

		if (parent) {
			const content = findContent(parent, context);

			if (!content) {
				issues.push({
					path,
					severity: Severity.error,
					messageKey: "validation.content.invalidJson",
					messageParams: { error: `Content ${parent} not found` },
					startLine: parentField.info()!.start.row,
					startColumn: parentField.info()!.start.col,
					endLine: parentField.info()!.end.row,
					endColumn: parentField.info()!.end.col,
				});
			}
		}
		const requirement = research.requirements;
		const requirementsField = researchField.get("requirements")!;

		if (requirement) {
			const items = context.getItems();
			for (let i = 0; i < requirement.length; i++) {
				const req = requirement[i]!;
				const reqField = requirementsField.get(i)!;
				const parts = req.split("/");
				const itemName = parts[0];
				const item = items.find((i) => i.name === itemName);

				if (!item) {
					issues.push({
						path,
						severity: Severity.error,
						messageKey: "validation.content.invalidJson",
						messageParams: { error: `Item ${itemName} not found` },
						startLine: reqField.info()!.start.row,
						startColumn: reqField.info()!.start.col,
						endLine: reqField.info()!.end.row,
						endColumn: reqField.info()!.end.col,
					});
				}
			}
		}
	}

	return issues;
};

const modMetaValidator: ValidatorFn = createValibotValidator(ModHjsonSchema);
const itemHjsonValidator: ValidatorFn = createValibotValidator(ItemHjsonSchema, (result) =>
	researchValidator({ ...result, result: result.result.research }),
);
const liquidHjsonValidator: ValidatorFn = createValibotValidator(LiquidHjsonSchema, (result) =>
	researchValidator({ ...result, result: result.result.research }),
);

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

	registry.register({
		name: "items-hjson",
		pattern: (path) => path.startsWith("content/item") || (path.endsWith(".json") && path.endsWith(".hjson")),
		validate: itemHjsonValidator,
	});

	registry.register({
		name: "liquids-hjson",
		pattern: (path) => path.startsWith("content/liquid") || (path.endsWith(".json") && path.endsWith(".hjson")),
		validate: liquidHjsonValidator,
	});

	return registry;
}
