import type { ValidationContext, ValidationResult, ValidatorFn } from "./types";
import { Severity } from "./types";
import { createValidatorRegistry } from "./registry";
import { HJSON, HJSONError, StructuredObjectNode } from "@project/hjson";
import { ItemHjsonSchema, ModHjsonSchema } from "@project/validation";
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

function createValibotValidator<T extends Parameters<typeof v.parse>[0]>(
	schema: T,
	validator?: (c: {
		path: string;
		content: string;
		context: ValidationContext;
		result: v.InferOutput<T>;
		node: StructuredObjectNode;
	}) => ValidationResult[],
): ValidatorFn {
	return ({ path, content, context }) => {
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

			const result = v.parse(schema, data.valueOf());

			if (validator) {
				return validator({ path, content, context, result, node: data });
			}

			return [];
		} catch (err) {
			if (v.isValiError(err)) {
				const result = [];

				for (const issue of err.issues) {
					const field = issue.path?.map((p) => p.key)?.join(".") || "";
					let fieldData: ReturnType<typeof data.get> = data;

					for (const field of issue.path || []) {
						const nested = fieldData.get(field.key as string | number);
						if (nested) {
							fieldData = nested;
						} else {
							break;
						}
					}

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
}

const modMetaValidator: ValidatorFn = createValibotValidator(ModHjsonSchema);
const itemHjsonValidator: ValidatorFn = createValibotValidator(ItemHjsonSchema, ({ path, context, result, node }) => {
	const items = context.getItems();
	const research = result.research;
	const issues: ValidationResult[] = [];

	if (!research) {
		return [];
	}

	const researchField = node.get("research")!;

	if (typeof research === "string") {
		const item = items.find((i) => i.name === research);

		if (!item) {
			issues.push({
				path,
				severity: Severity.error,
				messageKey: "validation.content.invalidJson",
				messageParams: { error: `Item ${result.research} not found` },
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
			const item = items.find((i) => i.name === parent);

			if (!item) {
				issues.push({
					path,
					severity: Severity.error,
					messageKey: "validation.content.invalidJson",
					messageParams: { error: `Item ${parent} not found` },
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
			for (let i = 0; i < requirement.length; i++) {
				const req = requirement[i]!;
				const reqField = requirementsField.get(i)!;
				const item = items.find((i) => i.name === req.itemName);

				if (!item) {
					issues.push({
						path,
						severity: Severity.error,
						messageKey: "validation.content.invalidJson",
						messageParams: { error: `Item ${req.itemName} not found` },
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
});

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

	return registry;
}
