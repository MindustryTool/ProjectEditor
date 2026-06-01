import { ContentImage } from "#/components/editor/ContentImage";
import { Button } from "#/components/ui/button";
import { Checkbox } from "#/components/ui/checkbox";
import { ColorPicker, ColorPickerAlpha, ColorPickerFormat, ColorPickerHue, ColorPickerSelection } from "#/components/ui/color-picker";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { ErrorBoundary } from "#/components/ui/error-boundary";
import { FormControl, FormField, FormLabel } from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { useItems } from "#/hooks/use-items";
import { useValidationStore } from "@project/state";
import { type Research } from "@project/schema";
import { HJSON } from "@project/hjson";
import type { HjsonObjectNode } from "@project/hjson";
import { HjsonNode, HjsonValueNode, HjsonArrayNode } from "@project/hjson";
import { Plus, X } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import { type ReactNode } from "react";
import {
	detectSchemaType,
	getSchemaEntries,
	getArrayItemSchema,
	hasNullishWrapper,
	getSchemaMetadata,
	type AnySchema,
} from "@project/schema";
import * as v from "valibot";

interface FieldsRendererProps {
	path: string;
	schema: AnySchema;
	node: HjsonObjectNode;
	original: string;
	onPatch: (newContent: string) => void;
}

export function FieldsRenderer({ path, schema, node, original, onPatch }: FieldsRendererProps) {
	const issues = useValidationStore((state) => state.results.resultsByPath[path]);
	const entries = getSchemaEntries(schema);

	return entries.map(([name, entrySchema]) => {
		const key = name + path;
		const type = detectSchemaType(entrySchema);
		const Renderer = schemaRenderers[type] as SchemaRenderer | undefined;

		if (Renderer === undefined) {
			return (
				<span key={key} className="text-yellow-400">
					Unknown field type {type}
				</span>
			);
		}

		const issue = issues?.filter((issue) => issue.field === name);
		const childNode = node.get(name);
		const isNullable = hasNullishWrapper(entrySchema);

		const metadata = getSchemaMetadata(entrySchema);

		if (metadata?.visibleWhen) {
			const refNode = node.get(metadata.visibleWhen.field);
			if (refNode.isMissing()) return null;
			if (refNode.isValue() && refNode.valueOf() !== metadata.visibleWhen.value) return null;
		}

		const patchValue = (newRawValue: unknown) => {
			if (v.getDefault(entrySchema) === newRawValue) {
				const newContent = node.removeField(original, name);
				onPatch(newContent);
				return;
			}

			if (newRawValue === undefined || newRawValue === null || (typeof newRawValue === "number" && isNaN(newRawValue))) {
				if (isNullable) {
					const newContent = node.removeField(original, name);
					onPatch(newContent);
					return;
				}
				const newContent = node.patchField(original, name, "null");
				onPatch(newContent);
				return;
			}
			const serialized = HJSON.stringify(newRawValue);
			const newContent = node.patchField(original, name, serialized);
			onPatch(newContent);
		};

		return (
			<ErrorBoundary key={key}>
				<Renderer
					name={name}
					node={childNode}
					original={original}
					onPatch={onPatch}
					patchValue={patchValue}
					entrySchema={entrySchema as AnySchema}
				/>
				{issue?.map((issue, index) => (
					<span key={(issue.code || "") + index} className="text-red-400">
						{issue.code}
					</span>
				)) || null}
			</ErrorBoundary>
		);
	});
}
type SchemaRenderer = (props: {
	name: string;
	node: HjsonNode;
	original: string;
	onPatch: (newContent: string) => void;
	patchValue: (newRawValue: unknown) => void;
	entrySchema: AnySchema;
}) => ReactNode;

const schemaRenderers: Record<string, SchemaRenderer> = {
	string: ({ name, node, patchValue, entrySchema }) => {
		const value = node.isString() ? node.valueOf() : v.getDefault(entrySchema);
		return (
			<FormField>
				<FormLabel>{name}</FormLabel>
				<FormControl>
					<Input value={value} onChange={(v) => patchValue(v.currentTarget.value)} />
				</FormControl>
			</FormField>
		);
	},
	number: ({ name, node, patchValue, entrySchema }) => {
		const value = node.isNumber() ? node.valueOf() : v.getDefault(entrySchema);
		return (
			<FormField>
				<FormLabel>{name}</FormLabel>
				<FormControl>
					<Input value={value} onChange={(v) => patchValue(v.currentTarget.valueAsNumber)} type="number" />
				</FormControl>
			</FormField>
		);
	},
	boolean: ({ name, node, patchValue, entrySchema }) => {
		const checked = node.isBoolean() ? node.valueOf() : v.getDefault(entrySchema);
		return (
			<FormField>
				<FormControl className="flex-row flex gap-1">
					<Checkbox checked={checked} onCheckedChange={(value) => patchValue(value === true)} />
					<FormLabel>{name}</FormLabel>
				</FormControl>
			</FormField>
		);
	},
	"hex-color": ({ name, node, patchValue, entrySchema }) => {
		let value = node.isString() ? node.valueOf() : v.getDefault(entrySchema);
		value = value?.startsWith("#") ? value : "#" + value;

		return (
			<FormField>
				<FormLabel>{name}</FormLabel>
				<FormControl>
					<div className="flex items-center gap-2">
						<Popover>
							<PopoverTrigger
								className="h-16 w-full relative cursor-pointer rounded border border-border bg-transparent p-0"
								style={{ backgroundColor: value }}
							>
								<span className="text-sm absolute left-1 bottom-1">{value}</span>
							</PopoverTrigger>
							<PopoverContent className="w-64 p-3" side="bottom" align="start">
								<ColorPicker value={value} onChange={(val) => patchValue(val)}>
									<ColorPickerSelection className="h-40 rounded-lg" />
									<ColorPickerHue />
									<ColorPickerAlpha />
									<ColorPickerFormat />
								</ColorPicker>
							</PopoverContent>
						</Popover>
					</div>
				</FormControl>
			</FormField>
		);
	},
	research: ResearchField,
	array: ({ name, node, original, onPatch, entrySchema }) => {
		if (!node.isArray()) return null;
		const arrNode = node as HjsonArrayNode;
		const items = arrNode.elements();
		const itemSchema = getArrayItemSchema(entrySchema);
		const itemType = itemSchema ? detectSchemaType(itemSchema) : null;

		function handleRemove(index: number) {
			const newContent = arrNode.removeElement(original, index);
			onPatch(newContent);
		}

		function handleItemChange(index: number, rawValue: unknown) {
			const serialized = HJSON.stringify(rawValue);
			const newContent = arrNode.patchElement(original, index, serialized);
			onPatch(newContent);
		}

		function handleAdd() {
			const serialized = itemSchema ? HJSON.stringify(defaultForDetectedType(itemSchema)) : '""';
			const newContent = arrNode.insertElement(original, items.length, serialized);
			onPatch(newContent);
		}

		return (
			<FormField>
				<FormLabel>{name}</FormLabel>
				<FormControl>
					<div className="flex flex-col gap-2">
						{items.length === 0 && <span className="text-muted-foreground text-sm italic">(empty)</span>}
						{items.map((el, index) => (
							<div key={index} className="flex items-center gap-2">
								<div className="flex-1">
									<SchemaArrayItemEditor
										value={el.value}
										itemType={itemType}
										itemSchema={itemSchema}
										onChange={(v) => handleItemChange(index, v)}
									/>
								</div>
								<Button className="size-9 shrink-0" type="button" variant="outline" onClick={() => handleRemove(index)}>
									<X />
								</Button>
							</div>
						))}
						<Button type="button" variant="outline" size="sm" onClick={handleAdd}>
							<Plus /> Add
						</Button>
					</div>
				</FormControl>
			</FormField>
		);
	},
	object: ({ name, node, original, onPatch, entrySchema }) => {
		if (!node.isObject()) return null;
		const objNode = node as HjsonObjectNode;

		return (
			<FormField>
				<FormLabel>{name}</FormLabel>
				<FormControl>
					<div className="pl-4 border-l-2 border-border space-y-2">
						<FieldsRenderer path={name} schema={entrySchema} node={objNode} original={original} onPatch={onPatch} />
					</div>
				</FormControl>
			</FormField>
		);
	},
};

function ResearchField({ name, node, original, onPatch, patchValue }: Parameters<SchemaRenderer>[0]) {
	const items = useItems({ project: true, base: true });

	function getCurrentValue(): Research | string | null {
		if (node.isValue()) {
			const val = (node as HjsonValueNode<unknown>).valueOf();
			return typeof val === "string" || (val && typeof val === "object") ? (val as Research | string) : null;
		}
		if (node.isObject()) {
			return (node as HjsonObjectNode).valueOf() as unknown as Research;
		}
		return null;
	}

	const currentValue = getCurrentValue();

	const parent =
		(!currentValue
			? ""
			: typeof currentValue === "string"
				? currentValue
				: (((currentValue as Record<string, unknown>)?.parent as string) ?? "")) || "";
	const requirements = (
		!currentValue
			? []
			: typeof currentValue === "string"
				? []
				: (((currentValue as Record<string, unknown>)?.requirements as string[]) ?? [])
	) as string[];

	const addedReq = requirements.map((requirement: string) => requirement.split("/")[0]!);

	function handleChange(newParent: string, newRequirements: string[]) {
		if (node.isObject()) {
			const researchNode = node as HjsonObjectNode;
			const parentChanged = newParent !== parent;
			const reqsChanged = newRequirements.length !== requirements.length || newRequirements.some((r, i) => r !== requirements[i]);

			if (parentChanged && !reqsChanged) {
				const newContent = researchNode.patchField(original, "parent", HJSON.stringify(newParent));
				onPatch(newContent);
				return;
			}
			if (reqsChanged && !parentChanged && newRequirements.length > 0) {
				const reqField = researchNode.field("requirements");
				const arrNode = reqField?.value instanceof HjsonArrayNode ? reqField.value : null;
				if (arrNode) {
					let content = original;
					if (newRequirements.length === requirements.length) {
						for (let i = 0; i < newRequirements.length; i++) {
							if (newRequirements[i] !== requirements[i]) {
								content = arrNode.patchElement(content, i, HJSON.stringify(newRequirements[i]));
								break;
							}
						}
					} else if (newRequirements.length === requirements.length + 1) {
						for (let i = 0; i < newRequirements.length; i++) {
							if (i >= requirements.length || newRequirements[i] !== requirements[i]) {
								content = arrNode.insertElement(content, i, HJSON.stringify(newRequirements[i]));
								break;
							}
						}
					} else if (newRequirements.length === requirements.length - 1) {
						for (let i = 0; i < requirements.length; i++) {
							if (i >= newRequirements.length || requirements[i] !== newRequirements[i]) {
								content = arrNode.removeElement(content, i);
								break;
							}
						}
					}
					if (content !== original) {
						onPatch(content);
						return;
					}
				}
			}
		}
		if (!newParent && newRequirements.length === 0) {
			patchValue(undefined);
		} else if (newRequirements.length > 0) {
			patchValue({ parent: newParent, requirements: newRequirements });
		} else {
			patchValue(newParent);
		}
	}

	function handleAddNewReq() {
		const notAdded = items.find((item) => {
			for (const requirement of requirements) {
				if (requirement.startsWith(item.name + "/")) {
					return false;
				}
			}
			return true;
		});
		handleChange(parent, [...requirements, notAdded?.name + "/" + 10]);
	}

	function handleRemoveReq(index: number) {
		handleChange(
			parent,
			requirements.filter((_: unknown, i: number) => i !== index),
		);
	}

	function handleUpdateReq(index: number, item: string, number: number) {
		handleChange(
			parent,
			requirements.map((r: string, i: number) => (i === index ? item + "/" + number : r)),
		);
	}

	return (
		<>
			<FormField>
				<FormLabel>{name}</FormLabel>
				<FormControl>
					<Input value={parent} onChange={(v) => handleChange(v.currentTarget.value, requirements)} />
				</FormControl>
			</FormField>
			{requirements.map((requirement: string, index: number) => {
				const parts = requirement.split("/");
				const itemName = parts[0]!;
				const reqNumber = Number(parts[1]);

				const selectedItem = items.find((i) => i.name === itemName);

				return (
					<FormField key={index}>
						<FormControl className="flex gap-1">
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="outline" size="icon">
										{selectedItem ? <ContentImage className="p-1" entry={selectedItem} /> : itemName}
									</Button>
								</DialogTrigger>
								<DialogContent className="w-sm" showCloseButton={false}>
									<VisuallyHidden.Root>
										<DialogTitle />
										<DialogDescription />
									</VisuallyHidden.Root>
									<ToggleGroup
										className="grid w-full grid-cols-[repeat(auto-fill,minmax(32px,1fr))] gap-1"
										type="single"
										value={itemName}
										onValueChange={(v) => (v ? handleUpdateReq(index, v, reqNumber) : handleRemoveReq(index))}
									>
										{items
											.filter((i) => i.name !== itemName && !addedReq.includes(i.name))
											.map((item) => (
												<ToggleGroupItem key={item.name} value={item.name}>
													<ContentImage entry={item} />
												</ToggleGroupItem>
											))}
									</ToggleGroup>
								</DialogContent>
							</Dialog>
							<Input
								type="number"
								value={reqNumber}
								onChange={(v) => handleUpdateReq(index, itemName, Number(v.currentTarget.valueAsNumber))}
							/>
							<Button className="text-destructive" variant="outline" size="icon" onClick={() => handleRemoveReq(index)}>
								<X />
							</Button>
						</FormControl>
					</FormField>
				);
			})}
			<Button className="w-full" variant="outline" onClick={handleAddNewReq}>
				<Plus />
			</Button>
		</>
	);
}

function getSchemaRenderer(type: string | null): SchemaRenderer {
	if (type) {
		const r = schemaRenderers[type];
		if (r) return r;
	}
	return schemaRenderers.string!;
}

function SchemaArrayItemEditor({
	value,
	itemType,
	itemSchema,
	onChange,
}: {
	value: unknown;
	itemType: string | null;
	itemSchema: AnySchema | null;
	onChange: (v: unknown) => void;
}) {
	const renderer = getSchemaRenderer(itemType);
	const node =
		value instanceof HjsonNode ? value : new HjsonValueNode<unknown>(value, { row: 0, col: 0, index: 0 }, { row: 0, col: 0, index: 0 });
	const name = itemType || "string";

	return (
		<ErrorBoundary key={name}>
			{renderer({
				name,
				node,
				original: "",
				onPatch: () => {},
				patchValue: (v) => onChange(v),
				entrySchema: itemSchema ?? (null as unknown as AnySchema),
			})}
		</ErrorBoundary>
	);
}

function defaultForDetectedType(schema: AnySchema): unknown {
	const type = detectSchemaType(schema);
	switch (type) {
		case "string":
		case "hex-color":
			return "";
		case "number":
			return 0;
		case "boolean":
			return false;
		case "research":
			return "";
		default:
			return "";
	}
}
