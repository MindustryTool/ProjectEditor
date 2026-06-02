import { ContentImage } from "#/components/editor/ContentImage";
import { Button } from "#/components/ui/button";
import { Checkbox } from "#/components/ui/checkbox";
import { ColorPicker, ColorPickerAlpha, ColorPickerFormat, ColorPickerHue, ColorPickerSelection } from "#/components/ui/color-picker";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { ErrorBoundary } from "#/components/ui/error-boundary";
import { FormControl, FormField, FormLabel, FormDescription, FormMessage } from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { useItems } from "#/hooks/use-items";
import { useFileString, useValidationStore, type ValidationResult } from "@project/core";
import { unwrapSchema, type Research } from "@project/schema";
import { HJSON } from "@project/hjson";
import type { HjsonObjectNode } from "@project/hjson";
import { HjsonNode, HjsonValueNode, HjsonArrayNode } from "@project/hjson";
import { ChevronsUpDown, Plus, Search, X } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import React, { useCallback, useMemo, useState, type ReactNode } from "react";
import {
	resolveSchema,
	detectSchemaType,
	getSchemaEntries,
	getArrayItemSchema,
	hasNullishWrapper,
	getSchemaMetadata,
	type AnySchema,
} from "@project/schema";
import * as v from "valibot";
import { useBlocks, type ContentEntry } from "#/hooks/use-blocks";
import { useUnits } from "#/hooks/use-units";
import { useLiquids } from "#/hooks/use-liquids";
import { useSectors } from "#/hooks/use-sectors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { cn, EMPTY_ARRAY } from "#/lib/utils";
import { useEffects } from "#/hooks/use-effects";
import { Spinner } from "#/components/ui/spinner";
import { ErrorDisplay } from "#/components/ui/error-display";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group";
import type { SchemaFn } from "@project/schema";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "#/components/ui/collapsible";
import { Separator } from "#/components/ui/separator";
import type { Type } from "@project/schema";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { useTranslation } from "react-i18next";

interface FieldsRendererProps {
	path: string;
	schema: AnySchema | SchemaFn;
}

export function FieldsRenderer({ path, schema }: FieldsRendererProps) {
	const { data, isLoading, write } = useFileString(path);
	const { contents } = useProjectContext();
	const issues = useValidationStore((state) => state.results.resultsByPath[path] || EMPTY_ARRAY);

	if (isLoading || data === null) {
		return null;
	}

	let node = null;
	try {
		node = HJSON.parseStructured(data);
	} catch (error) {
		console.error("Error parsing JSON:", error);
	}

	if (node === null || !node.isObject()) {
		return null;
	}

	const resolvedSchema = resolveSchema(typeof schema === "function" ? schema(node, contents) : schema, node.valueOf());
	const entries = getSchemaEntries(resolvedSchema);

	return entries.map(([name, entrySchema]) => {
		const key = name + path;
		const type = detectSchemaType(entrySchema);

		const Renderer = schemaRenderers[type];

		if (Renderer === undefined) {
			return (
				<FormControl>
					<FormLabel>{name}</FormLabel>
					<span key={key} className="text-yellow-400 text-sm">
						Unknown field type {type}
					</span>
				</FormControl>
			);
		}

		const entryIssues = issues?.filter((issue) => issue.field?.startsWith(name));
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
				const newContent = node.removeField(data, name);
				write(newContent);
				return;
			}

			if (newRawValue === undefined || newRawValue === null || (typeof newRawValue === "number" && isNaN(newRawValue))) {
				if (isNullable) {
					const newContent = node.removeField(data, name);
					write(newContent);
					return;
				}
				const newContent = node.patchField(data, name, "null");
				write(newContent);
				return;
			}
			const serialized = HJSON.stringify(newRawValue);
			const newContent = node.patchField(data, name, serialized);
			write(newContent);
		};

		return (
			<ErrorBoundary key={key}>
				<Renderer
					path={path}
					name={name}
					node={childNode}
					original={data}
					onPatch={write}
					patchValue={patchValue}
					entrySchema={entrySchema as AnySchema}
					jsonPath={name}
					issues={entryIssues}
				/>
			</ErrorBoundary>
		);
	});
}
type SchemaRenderer = (props: {
	name: string;
	path: string;
	node: HjsonNode;
	original: string;
	onPatch: (newContent: string) => void;
	patchValue: (newRawValue: unknown) => void;
	entrySchema: AnySchema;
	jsonPath?: string;
	issues: ValidationResult[];
}) => ReactNode;

const schemaRenderers: Record<Type, SchemaRenderer> = {
	string: StringField,
	number: NumberField,
	boolean: BooleanField,
	color: ColorField,
	research: ResearchField,
	effect: EffectField,
	array: ArrayField,
	object: ObjectField,
	picklist: PickListField,
	liquids: LiquidsListField,
	unknown: ({ name, entrySchema }) => (
		<p className="text-yellow-400 text-sm">
			Unknown field type for property {name}: {entrySchema.type}
		</p>
	),
};

function FieldIssue({ issues }: { issues: ValidationResult[] }) {
	const { t } = useTranslation();

	if (issues.length === 0) return null;

	return (
		<FormMessage>
			{issues.map((issue) => (t as (key: string, params?: Record<string, unknown>) => string)(issue.messageKey, issue.messageParams))}
		</FormMessage>
	);
}

function StringField({ name, node, patchValue, entrySchema, issues }: Parameters<SchemaRenderer>[0]) {
	const { t } = useTranslation();
	const _t = t as (key: string) => string;
	const value = node.isString() ? node.valueOf() : v.getDefault(entrySchema);
	const metadata = getSchemaMetadata(entrySchema);
	const label = metadata?.name ? _t(metadata.name) : name;
	const description = metadata?.description ? _t(metadata.description) : undefined;

	return (
		<FormField>
			<FormLabel>{label}</FormLabel>
			<FormControl>
				{metadata?.multiline ? (
					<Textarea value={value} onChange={(v) => patchValue(v.currentTarget.value)} />
				) : (
					<Input value={value} onChange={(v) => patchValue(v.currentTarget.value)} />
				)}
			</FormControl>
			{description && <FormDescription>{description}</FormDescription>}
			<FieldIssue issues={issues} />
		</FormField>
	);
}

function NumberField({ name, node, patchValue, entrySchema, issues }: Parameters<SchemaRenderer>[0]) {
	const { t } = useTranslation();
	const _t = t as (key: string) => string;
	const value = node.isNumber() ? node.valueOf() : v.getDefault(entrySchema);
	const metadata = getSchemaMetadata(entrySchema);
	const label = metadata?.name ? _t(metadata.name) : name;
	const description = metadata?.description ? _t(metadata.description) : undefined;

	return (
		<FormField>
			<FormLabel>{label}</FormLabel>
			<FormControl>
				<Input value={value} onChange={(v) => patchValue(v.currentTarget.valueAsNumber)} type="number" />
			</FormControl>
			{description && <FormDescription>{description}</FormDescription>}
			<FieldIssue issues={issues} />
		</FormField>
	);
}

function BooleanField({ name, node, patchValue, entrySchema, issues }: Parameters<SchemaRenderer>[0]) {
	const { t } = useTranslation();
	const _t = t as (key: string) => string;
	const checked = node.isBoolean() ? node.valueOf() : v.getDefault(entrySchema);
	const metadata = getSchemaMetadata(entrySchema);
	const label = metadata?.name ? _t(metadata.name) : name;
	const description = metadata?.description ? _t(metadata.description) : undefined;

	return (
		<FormField>
			<FormControl className="flex-row flex gap-1">
				<Checkbox checked={checked} onCheckedChange={(value) => patchValue(value === true)} />
				<FormLabel>{label}</FormLabel>
			</FormControl>
			{description && <FormDescription>{description}</FormDescription>}
			<FieldIssue issues={issues} />
		</FormField>
	);
}

function LiquidsListField({ name, node, patchValue, entrySchema, issues }: Parameters<SchemaRenderer>[0]) {
	const value = node.isString() ? node.valueOf() : v.getDefault(entrySchema) || "";
	const context = useProjectContext();
    const unwrappedSchema = unwrapSchema(entrySchema);
    
	if ("options" in unwrappedSchema && Array.isArray(unwrappedSchema.options)) {
		const options = unwrappedSchema.options
			.map((v) => String(v))
			.map((v) => context.contents.getLiquids().find((l) => l.name === v))
			.filter(Boolean)
			.map((option) => option!);

		return (
			<FormField>
				<FormLabel>{name}</FormLabel>
				<FormControl>
					<Select value={value} onValueChange={patchValue}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="None (empty file)" />
						</SelectTrigger>
						<SelectContent position="popper">
							<SelectGroup className="grid grid-cols-4">
								{options.map((option) => (
									<SelectItem key={option.name} value={option.name}>
										<ContentImage className="size-5" entry={option} />
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</FormControl>
				<FieldIssue issues={issues} />
			</FormField>
		);
	}

	throw new Error(`Unknown option ${value}, this should not happen`);
}

function PickListField({ name, node, patchValue, entrySchema, issues }: Parameters<SchemaRenderer>[0]) {
	const value = node.isString() ? node.valueOf() : v.getDefault(entrySchema) || "";
    const unwrappedSchema = unwrapSchema(entrySchema);
    
	if ("options" in unwrappedSchema && Array.isArray(unwrappedSchema.options)) {
		const options = unwrappedSchema.options.map((v) => String(v));

		return (
			<FormField>
				<FormLabel>{name}</FormLabel>
				<FormControl>
					<Select value={value} onValueChange={patchValue}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="None (empty file)" />
						</SelectTrigger>
						<SelectContent position="popper">
							<SelectGroup>
								{options.map((option) => (
									<SelectItem key={option} value={option}>
										{option}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</FormControl>
				<FieldIssue issues={issues} />
			</FormField>
		);
	}

	throw new Error(`Unknown option ${value}, this should not happen`);
}

function ColorField({ name, node, patchValue, entrySchema, issues }: Parameters<SchemaRenderer>[0]) {
	let value = node.isString() ? node.valueOf() : v.getDefault(entrySchema) || "333333";

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
							<span className="text-sm absolute left-1.5 bottom-1.5">{value}</span>
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
			<FieldIssue issues={issues} />
		</FormField>
	);
}

function ArrayField({ path, name, node, original, onPatch, patchValue, entrySchema, jsonPath, issues }: Parameters<SchemaRenderer>[0]) {
	const { t } = useTranslation();
	const _t = t as (key: string) => string;

	if (!node.isArray()) {
		patchValue([]);
		return null;
	}

	const items = node.elements();
	const itemSchema = getArrayItemSchema(entrySchema);

	if (!itemSchema) {
		throw new Error("Array schema must have item schema: " + entrySchema);
	}

	const itemType = itemSchema ? detectSchemaType(itemSchema) : null;
	const metadata = getSchemaMetadata(entrySchema);
	const label = metadata?.name ? _t(metadata.name) : name;
	const description = metadata?.description ? _t(metadata.description) : undefined;

	const handleRemove = (index: number) => {
		const newContent = node.removeElement(original, index);
		onPatch(newContent);
	};

	const handleItemChange = (index: number, rawValue: unknown) => {
		const serialized = HJSON.stringify(rawValue);
		const newContent = node.patchElement(original, index, serialized);
		onPatch(newContent);
	};

	const handleAdd = () => {
		const serialized = itemSchema ? HJSON.stringify(v.getDefault(itemSchema)) : '""';
		const newContent = node.insertElement(original, items.length, serialized);
		onPatch(newContent);
	};

	return (
		<FormField>
			<FormLabel>{label}</FormLabel>
			{description && <FormDescription>{description}</FormDescription>}
			<FormControl>
				<div className="flex flex-col gap-2">
					{items.map((el, index) => {
						const entryJsonPath = jsonPath ? `${jsonPath}[${index}]` : `[${index}]`;
						const entryIssues = issues.filter((issue) => issue.field?.startsWith(entryJsonPath));

						return (
							<div key={index} className="flex items-center gap-2">
								<SchemaArrayItemEditor
									path={path}
									value={el.value}
									itemType={itemType}
									itemSchema={itemSchema}
									onChange={(v) => handleItemChange(index, v)}
									original={original}
									jsonPath={entryJsonPath}
									issues={entryIssues}
								/>
								<Button className="size-9" type="button" variant="outline" onClick={() => handleRemove(index)}>
									<X />
								</Button>
							</div>
						);
					})}
					<Button type="button" variant="outline" size="sm" onClick={handleAdd}>
						<Plus /> Add
					</Button>
				</div>
			</FormControl>
		</FormField>
	);
}

function ObjectField({ name: parentName, path, node, original, onPatch, entrySchema, jsonPath, issues }: Parameters<SchemaRenderer>[0]) {
	if (!node.isObject()) {
		return null;
	}

	const entries = getSchemaEntries(resolveSchema(entrySchema, node.valueOf()));

	return entries.map(([name, entrySchema]) => {
		const key = name;
		const type = detectSchemaType(entrySchema);
		const childNode = node.get(name);
		const metadata = getSchemaMetadata(entrySchema);
		const isNullable = hasNullishWrapper(entrySchema);
		const entryIssues = issues.filter((issue) => issue.field?.startsWith(`${parentName}.${name}`));

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

		if (metadata?.visibleWhen) {
			const refNode = node.get(metadata.visibleWhen.field);
			if (refNode.isMissing()) return null;
			if (refNode.isValue() && refNode.valueOf() !== metadata.visibleWhen.value) return null;
		}

		const Renderer = schemaRenderers[type];

		return (
			<ErrorBoundary key={key}>
				<Renderer
					path={path}
					name={name}
					node={childNode}
					original={original}
					onPatch={onPatch}
					patchValue={patchValue}
					entrySchema={entrySchema as AnySchema}
					jsonPath={jsonPath ? `${jsonPath}.${name}` : name}
					issues={entryIssues}
				/>
			</ErrorBoundary>
		);
	});
}

function ResearchField({ name, node, original, onPatch, patchValue, issues }: Parameters<SchemaRenderer>[0]) {
	const items = useItems({ project: true, base: true });
	const blocks = useBlocks();
	const units = useUnits();
	const liquids = useLiquids();
	const sectors = useSectors();

	const findContent = useCallback((name: string, entries: ContentEntry[][]) => {
		for (const entry of entries) {
			for (const item of entry) {
				if (item.name === name) {
					return item;
				}
			}
		}
		return null;
	}, []);

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

	const parentEntry = findContent(parent, [items, blocks, liquids, sectors, units]);

	return (
		<>
			<FormField>
				<FormLabel>{name}</FormLabel>
				<FormControl>
					<Dialog>
						<DialogTrigger asChild>
							{parentEntry ? (
								<Button variant="outline" size="icon">
									<ContentImage className="p-1" entry={parentEntry} />
								</Button>
							) : (
								<Button variant="outline">{parent || "Select"}</Button>
							)}
						</DialogTrigger>
						<DialogContent className="w-sm" showCloseButton={false}>
							<VisuallyHidden.Root>
								<DialogTitle />
								<DialogDescription />
							</VisuallyHidden.Root>
							<ToggleGroup
								className="w-full"
								type="single"
								value={parentEntry?.name}
								onValueChange={(v) => handleChange(v, requirements)}
							>
								<Tabs className="w-full">
									<TabsList>
										<TabsTrigger value="item">Item</TabsTrigger>
										<TabsTrigger value="block">Block</TabsTrigger>
										<TabsTrigger value="liquid">Liquid</TabsTrigger>
										<TabsTrigger value="sector">Sector</TabsTrigger>
										<TabsTrigger value="unit">Unit</TabsTrigger>
									</TabsList>
									<TabsContent asChild value="item">
										<ItemGrid>
											{items
												.filter((i) => i.name !== parentEntry?.name && !addedReq.includes(i.name))
												.map((item) => (
													<ToggleGroupItem key={item.name} value={item.name}>
														<ContentImage entry={item} />
													</ToggleGroupItem>
												))}
										</ItemGrid>
									</TabsContent>
									<TabsContent asChild value="block">
										<ItemGrid>
											{blocks
												.filter((i) => i.name !== parentEntry?.name && !addedReq.includes(i.name))
												.map((item) => (
													<ToggleGroupItem key={item.name} value={item.name}>
														<ContentImage entry={item} />
													</ToggleGroupItem>
												))}
										</ItemGrid>
									</TabsContent>
									<TabsContent asChild value="liquid">
										<ItemGrid>
											{liquids
												.filter((i) => i.name !== parentEntry?.name && !addedReq.includes(i.name))
												.map((item) => (
													<ToggleGroupItem key={item.name} value={item.name}>
														<ContentImage entry={item} />
													</ToggleGroupItem>
												))}
										</ItemGrid>
									</TabsContent>
									<TabsContent asChild value="sector">
										<ItemGrid>
											{sectors
												.filter((i) => i.name !== parentEntry?.name && !addedReq.includes(i.name))
												.map((item) => (
													<ToggleGroupItem key={item.name} value={item.name}>
														<ContentImage entry={item} />
													</ToggleGroupItem>
												))}
										</ItemGrid>
									</TabsContent>
									<TabsContent asChild value="unit">
										<ItemGrid>
											{units
												.filter((i) => i.name !== parentEntry?.name && !addedReq.includes(i.name))
												.map((item) => (
													<ToggleGroupItem key={item.name} value={item.name}>
														<ContentImage entry={item} />
													</ToggleGroupItem>
												))}
										</ItemGrid>
									</TabsContent>
								</Tabs>
							</ToggleGroup>
						</DialogContent>
					</Dialog>
				</FormControl>
				<FieldIssue issues={issues} />
				<FormControl className="grid gap-2">
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
												type="single"
												value={itemName}
												onValueChange={(v) => (v ? handleUpdateReq(index, v, reqNumber) : handleRemoveReq(index))}
												asChild
											>
												<ItemGrid>
													{items
														.filter((i) => i.name !== itemName && !addedReq.includes(i.name))
														.map((item) => (
															<ToggleGroupItem key={item.name} value={item.name}>
																<ContentImage entry={item} />
															</ToggleGroupItem>
														))}
												</ItemGrid>
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
				</FormControl>
			</FormField>
		</>
	);
}

function EffectField({ path, name, node, original, patchValue, entrySchema, onPatch, jsonPath, issues }: Parameters<SchemaRenderer>[0]) {
	const { data = [], isLoading, isError, error } = useEffects();
	const [filter, setFilter] = useState("");

	if (node.isObject()) {
		return (
			<div className="grid gap-2">
				<FormLabel>{name}</FormLabel>
				<div className="grid grid-cols-2 gap-2">
					<Button variant="outline" onClick={() => patchValue(data[0]?.name)}>
						Built-In
					</Button>
					<Button variant="outline" disabled>
						Custom
					</Button>
				</div>
				<Collapsible>
					<FormField>
						<CollapsibleTrigger asChild>
							<Button variant="outline" className="flex items-center justify-between w-full">
								<span>{node.get("type").asString()}</span>
								<ChevronsUpDown className="size-4" />
							</Button>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<FormControl>
								<div className="pl-4 border-l-2 border-border grid gap-6">
									<ObjectField
										path={path}
										name={name}
										node={node}
										patchValue={patchValue}
										entrySchema={entrySchema}
										original={original}
										onPatch={onPatch}
										jsonPath={jsonPath}
										issues={issues}
									/>
									<Separator />
								</div>
							</FormControl>
						</CollapsibleContent>
					</FormField>
					<FieldIssue issues={issues} />
				</Collapsible>
			</div>
		);
	}

	const value = node.isString() ? node.valueOf() : v.getDefault(entrySchema);

	return (
		<div className="grid gap-2">
			<FormLabel>{name}</FormLabel>
			<div className="grid grid-cols-2 gap-2">
				<Button variant="outline" disabled>
					Built-In
				</Button>
				<Button variant="outline" onClick={() => patchValue({ type: "ParticleEffect" })}>
					Custom
				</Button>
			</div>
			<FormField>
				<Dialog>
					<DialogTrigger asChild>
						<Button className="w-full justify-start" variant="outline">
							{value || "None"}
						</Button>
					</DialogTrigger>
					<DialogContent className="w-sm" showCloseButton={false}>
						<VisuallyHidden.Root>
							<DialogTitle />
							<DialogDescription />
						</VisuallyHidden.Root>
						<ToggleGroup type="single" value={value} onValueChange={(v) => patchValue(v)} asChild>
							<div className="grid gap-2">
								<InputGroup>
									<InputGroupAddon>
										<Search />
									</InputGroupAddon>
									<InputGroupInput value={filter} onChange={(event) => setFilter(event.currentTarget.value)} />
								</InputGroup>
								<div className="max-h-[80dvh] md:max-h-[50dvh] overflow-y-auto border p-2 rounded-md">
									{isLoading && <Spinner />}
									{isError && <ErrorDisplay message={error.message} />}
									{data
										.filter((i) => i.name !== value && i.name.includes(filter))
										.map((item) => (
											<ToggleGroupItem key={item.name} value={item.name}>
												{item.name}
											</ToggleGroupItem>
										))}
								</div>
							</div>
						</ToggleGroup>
					</DialogContent>
				</Dialog>
				<FieldIssue issues={issues} />
			</FormField>
		</div>
	);
}

function ItemGrid({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"grid w-full grid-cols-[repeat(auto-fill,minmax(32px,1fr))] gap-1 max-h-[90dhv] md:max-h-[50dvh] overflow-y-auto",
				className,
			)}
			{...props}
		/>
	);
}

function SchemaArrayItemEditor({
	path,
	value,
	itemType,
	itemSchema,
	onChange,
	original = "",
	jsonPath,
	issues,
}: {
	path: string;
	value: unknown;
	itemType: Type | null;
	itemSchema: AnySchema;
	onChange: (v: unknown) => void;
	original?: string;
	jsonPath?: string;
	issues: ValidationResult[];
}) {
	const type = detectSchemaType(itemSchema);

	const node = useMemo(
		() =>
			value instanceof HjsonNode
				? value
				: new HjsonValueNode<unknown>(value, { row: 0, col: 0, index: 0 }, { row: 0, col: 0, index: 0 }),
		[value],
	);

	const handleOnPatch = useCallback(
		(newContent: string) => {
			if (!jsonPath) {
				onChange(node.valueOf());
				return;
			}
			try {
				const root = HJSON.parseStructured(newContent);
				const elementInfo = root.path(jsonPath);
				if (elementInfo) {
					const elementValue = elementInfo.value instanceof HjsonNode ? elementInfo.value.valueOf() : elementInfo.value;
					onChange(elementValue);
					return;
				}
			} catch (error) {
				console.error("Error parsing JSON:", error);
			}
			onChange(node.valueOf());
		},
		[onChange, node, jsonPath],
	);

	if (type === "string") {
		const stringValue = node.isString() ? node.valueOf() : v.getDefault(itemSchema);
		return <Input value={stringValue} onChange={(e) => onChange(e.currentTarget.value)} placeholder="mod-name" className="flex-1" />;
	}

	const Renderer = schemaRenderers[type];
	const name = itemType || "string";

	return (
		<ErrorBoundary key={name}>
			<Renderer
				path={path}
				name={name}
				node={node}
				original={original}
				onPatch={handleOnPatch}
				patchValue={(v) => onChange(v)}
				entrySchema={itemSchema}
				jsonPath={jsonPath}
				issues={issues}
			/>
		</ErrorBoundary>
	);
}
