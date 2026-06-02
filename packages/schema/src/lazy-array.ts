import * as v from "valibot";

type BaseSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

interface LazyArrayIssue extends v.BaseIssue<unknown> {
	kind: "schema";
	type: "array";
	expected: "Array";
}

export interface LazyArraySchema<
	TItem extends BaseSchema,
	TMessage extends v.ErrorMessage<LazyArrayIssue> | undefined,
> extends v.BaseSchema<v.InferInput<TItem>[], v.InferOutput<TItem>[], LazyArrayIssue | v.InferIssue<TItem>> {
	type: "array";
	reference: typeof lazyArray;
	expects: "Array";
	item: TItem;
	getter: (index: number) => TItem;
	message: TMessage;
}

export function lazyArray<const TItem extends BaseSchema>(getter: (index: number) => TItem): LazyArraySchema<TItem, undefined>;
export function lazyArray<const TItem extends BaseSchema, const TMessage extends v.ErrorMessage<LazyArrayIssue> | undefined>(
	getter: (index: number) => TItem,
	message: TMessage,
): LazyArraySchema<TItem, TMessage>;
export function lazyArray(
	getter: (index: number) => BaseSchema,
	message?: v.ErrorMessage<LazyArrayIssue>,
): LazyArraySchema<BaseSchema, v.ErrorMessage<LazyArrayIssue> | undefined> {
	return {
		kind: "schema",
		type: "array",
		reference: lazyArray,
		expects: "Array",
		async: false,
		get item() {
			return getter(0);
		},
		getter,
		message,
		get "~standard"() {
			return v._getStandardProps(this);
		},
		"~run"(dataset, config) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				// @ts-expect-error Valibot mutates dataset in custom schemas.
				dataset.typed = true;
				dataset.value = [];
				for (let key = 0; key < input.length; key++) {
					const value = input[key];
					const itemDataset = this.getter(key)["~run"]({ value }, config);
					if (itemDataset.issues) {
						const pathItem: v.ArrayPathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value,
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) {
								issue.path.unshift(pathItem);
							} else {
								// @ts-expect-error Valibot mutates issue path in built-in array schema too.
								issue.path = [pathItem];
							}
							// @ts-expect-error Valibot mutates dataset issues in built-in array schema too.
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) {
							// @ts-expect-error Valibot mutates dataset issues in built-in array schema too.
							dataset.issues = itemDataset.issues;
						}
						if (config.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) {
						dataset.typed = false;
					}
					// @ts-expect-error Valibot mutates dataset value in built-in array schema too.
					dataset.value.push(itemDataset.value);
				}
			} else {
				v._addIssue(this, "type", dataset, config);
			}
			// @ts-expect-error Custom schema mutates dataset same as Valibot built-ins.
			return dataset as v.OutputDataset<unknown[], LazyArrayIssue | v.BaseIssue<unknown>>;
		},
	};
}
