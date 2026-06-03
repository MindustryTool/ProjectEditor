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
import { useFileString, useValidationStore } from "@project/core";
import { unwrapSchema, type Research } from "@project/schema";
import { HJSON } from "@project/hjson";
import { HjsonNode } from "@project/hjson";
import { ChevronsUpDown, Plus, Search, X } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import React, { useCallback, useState } from "react";
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
import { useShallow } from "zustand/react/shallow";
import { hasNullableWrapper } from "@project/schema";

interface FieldsRendererProps {
	path: string;
	schema: AnySchema | SchemaFn;
}

export const FieldsRenderer = React.memo(function FieldsRenderer({ path, schema }: FieldsRendererProps) {
	const { data, isLoading, write } = useFileString(path);
	const { contents } = useProjectContext();

	const onChange = useCallback(
		(jsonPath: string, updater: (parent: HjsonNode, key: string, original: string, root: HjsonNode) => string) => {
			write((content: string | null) => {
				if (content === null) {
					throw new Error("Attempting to write into unloaded file");
				}

				const root = HJSON.parseWithCache(content);
				const splitAt = Math.max(jsonPath.lastIndexOf("."), jsonPath.lastIndexOf("["));
				if (splitAt === -1) {
					return updater(root, jsonPath, content, root);
				}

				const parentPath = jsonPath.slice(0, splitAt);
				const key = jsonPath.slice(splitAt + 1).replace(/]$/, "");
				const parentInfo = root.path(parentPath);

				if (!parentInfo) {
					throw new Error(`parent path not found: ${parentPath}`);
				}

				const parent = parentInfo.value;

				if (!(parent instanceof HjsonNode)) {
					throw new Error(`expected node at ${parentPath}`);
				}

				return updater(parent, key, content, root);
			});
		},
		[write],
	);

	if (isLoading || data === null) {
		return null;
	}

	let node = null;
	try {
		node = HJSON.parseWithCache(data);
	} catch (error) {
		console.error("Error parsing JSON:", error);
		return null;
	}

	if (!node.isObject()) {
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

		const childNode = node.get(name);
		const metadata = getSchemaMetadata(entrySchema);

		if (metadata?.visibleWhen) {
			const refNode = node.get(metadata.visibleWhen.field);
			if (refNode.isMissing()) return null;
			if (refNode.isValue() && refNode.valueOf() !== metadata.visibleWhen.value) return null;
		}

		const value = childNode.isMissing() ? v.getDefault(entrySchema) : childNode.valueOf();

		return (
			<ErrorBoundary key={key}>
				<Renderer path={path} name={name} value={value} onChange={onChange} entrySchema={entrySchema as AnySchema} jsonPath={name} />
			</ErrorBoundary>
		);
	});
});
type SchemaRendererProps = {
	name: string;
	path: string;
	value: unknown;
	entrySchema: AnySchema;
	jsonPath: string;
	onChange: (jsonPath: string, updater: (parent: HjsonNode, key: string, original: string, root: HjsonNode) => string) => void;
};
type SchemaRenderer = React.ComponentType<SchemaRendererProps>;

const SpriteField = React.memo(function SpriteField() {
	// TODO: impl
	return null;
});

function removeByJsonPath(parent: HjsonNode, key: string, original: string): string {
	if (parent.isObject()) return parent.removeField(original, key);
	if (parent.isArray()) return parent.removeElement(original, Number(key));
	throw new Error(`unexpected parent node type for removal`);
}

const FieldIssue = React.memo(function FieldIssue({ path, jsonPath }: { path: string; jsonPath: string }) {
	const { t } = useTranslation();
	const issues = useValidationStore(
		useShallow((state) => (state.results.resultsByPath[path] || EMPTY_ARRAY).filter((issue) => issue.field?.startsWith(jsonPath))),
	);

	if (issues.length === 0) return null;

	return (
		<FormMessage>
			{issues.map((issue, index) => (
				<span key={index + (issue.field || "")}>
					{(t as (key: string, params?: Record<string, unknown>) => string)(issue.messageKey, issue.messageParams)}
				</span>
			))}
		</FormMessage>
	);
});

const SchemaLabel = React.memo(function SchemaLabel({ name, entrySchema }: { name: string; entrySchema: AnySchema }) {
	const { t } = useTranslation();
	const _t = t as (key: string) => string;
	const metadata = getSchemaMetadata(entrySchema);

	return <>{metadata?.name ? _t(metadata.name) : name}</>;
});

const SchemaDescription = React.memo(function SchemaDescription({ entrySchema }: { entrySchema: AnySchema }) {
	const { t } = useTranslation();
	const _t = t as (key: string) => string;
	const metadata = getSchemaMetadata(entrySchema);

	if (!metadata?.description) return null;

	return <FormDescription>{_t(metadata.description)}</FormDescription>;
});

const StringField = React.memo(function StringField({ name, value, onChange, entrySchema, jsonPath, path }: SchemaRendererProps) {
	const stringValue = typeof value === "string" ? value : String(value);
	const metadata = getSchemaMetadata(entrySchema);

	function handleChange(newVal: string) {
		const isDefault = newVal === v.getDefault(entrySchema);
		const isNullable = hasNullableWrapper(entrySchema);

		if (newVal === "" || (isDefault && !isNullable)) {
			onChange(jsonPath, (parent, key, original) => removeByJsonPath(parent, key, original));
			return;
		}
		onChange(jsonPath, (parent, key, original) => parent.objectNode(key).patchField(original, key, HJSON.stringify(newVal)));
	}

	return (
		<FormField>
			<FormLabel>
				<SchemaLabel name={name} entrySchema={entrySchema} />
			</FormLabel>
			<FormControl>
				{metadata?.multiline ? (
					<Textarea key={name} value={stringValue} onChange={(v) => handleChange(v.currentTarget.value)} />
				) : (
					<Input key={name} value={stringValue} onChange={(v) => handleChange(v.currentTarget.value)} />
				)}
			</FormControl>
			<SchemaDescription entrySchema={entrySchema} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</FormField>
	);
});

const NumberField = React.memo(function NumberField({ name, value, onChange, entrySchema, jsonPath, path }: SchemaRendererProps) {
	const numValue = typeof value === "number" ? value : String(value);

	function handleChange(newVal: number) {
		const isDefault = newVal === v.getDefault(entrySchema);
		const isNullable = hasNullableWrapper(entrySchema);

		if (Number.isNaN(newVal) || (isDefault && !isNullable)) {
			onChange(jsonPath, (parent, key, original) => removeByJsonPath(parent, key, original));
			return;
		}

		onChange(jsonPath, (parent, key, original) => parent.objectNode(key).patchField(original, key, HJSON.stringify(newVal)));
	}

	return (
		<FormField>
			<FormLabel>
				<SchemaLabel name={name} entrySchema={entrySchema} />
			</FormLabel>
			<FormControl>
				<Input key={name} value={numValue} onChange={(v) => handleChange(v.currentTarget.valueAsNumber)} type="number" />
			</FormControl>
			<SchemaDescription entrySchema={entrySchema} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</FormField>
	);
});

const BooleanField = React.memo(function BooleanField({ name, value, onChange, entrySchema, jsonPath, path }: SchemaRendererProps) {
	const checked = typeof value === "boolean" ? value : v.getDefault(entrySchema);

	function handleChange(val: boolean) {
		if (val === v.getDefault(entrySchema) && !hasNullishWrapper(entrySchema)) {
			onChange(jsonPath, (parent, key, original) => removeByJsonPath(parent, key, original));
			return;
		}
		onChange(jsonPath, (parent, key, original) => parent.objectNode(key).patchField(original, key, HJSON.stringify(val)));
	}

	return (
		<FormField>
			<FormControl className="flex-row flex gap-1">
				<Checkbox key={name} checked={checked} onCheckedChange={(val) => handleChange(val === true)} />
				<FormLabel>
					<SchemaLabel name={name} entrySchema={entrySchema} />
				</FormLabel>
			</FormControl>
			<SchemaDescription entrySchema={entrySchema} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</FormField>
	);
});

const SelectField = React.memo(function SelectField(_props: SchemaRendererProps) {
	return null;
});

const LiquidsListField = React.memo(function LiquidsListField({ name, value, onChange, entrySchema, jsonPath, path }: SchemaRendererProps) {
	const stringValue = typeof value === "string" ? value : ((v.getDefault(entrySchema) ?? "") as string);
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
				<FormLabel>
					<SchemaLabel name={name} entrySchema={entrySchema} />
				</FormLabel>
				<FormControl>
					<Select
						key={name}
						value={stringValue}
						onValueChange={(nextValue) =>
							onChange(jsonPath, (parent, key, original) =>
								parent.objectNode(key).patchField(original, key, HJSON.stringify(nextValue)),
							)
						}
					>
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
				<SchemaDescription entrySchema={entrySchema} />
				<FieldIssue path={path} jsonPath={jsonPath} />
			</FormField>
		);
	}

	throw new Error(`Unknown option ${value}, this should not happen`);
});

const PickListField = React.memo(function PickListField({ name, value, onChange, entrySchema, jsonPath, path }: SchemaRendererProps) {
	const stringValue = typeof value === "string" ? value : ((v.getDefault(entrySchema) ?? "") as string);
	const unwrappedSchema = unwrapSchema(entrySchema);

	if ("options" in unwrappedSchema && Array.isArray(unwrappedSchema.options)) {
		const options = unwrappedSchema.options.map((v) => String(v));

		return (
			<FormField>
				<FormLabel>
					<SchemaLabel name={name} entrySchema={entrySchema} />
				</FormLabel>
				<FormControl>
					<Select
						key={name}
						value={stringValue}
						onValueChange={(nextValue) =>
							onChange(jsonPath, (parent, key, original) =>
								parent.objectNode(key).patchField(original, key, HJSON.stringify(nextValue)),
							)
						}
					>
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
				<SchemaDescription entrySchema={entrySchema} />
				<FieldIssue path={path} jsonPath={jsonPath} />
			</FormField>
		);
	}

	throw new Error(`Unknown option ${value}, this should not happen`);
});

const ColorField = React.memo(function ColorField({ name, value, onChange, entrySchema, jsonPath, path }: SchemaRendererProps) {
	let hexValue = typeof value === "string" ? value : ((v.getDefault(entrySchema) ?? "333333") as string);

	hexValue = hexValue?.startsWith("#") ? hexValue : "#" + hexValue;

	return (
		<FormField>
			<FormLabel>
				<SchemaLabel name={name} entrySchema={entrySchema} />
			</FormLabel>
			<FormControl>
				<div className="flex items-center gap-2">
					<Popover>
						<PopoverTrigger
							className="h-16 w-full relative cursor-pointer rounded border border-border bg-transparent p-0"
							style={{ backgroundColor: hexValue }}
						>
							<span className="text-sm absolute left-1.5 bottom-1.5">{hexValue}</span>
						</PopoverTrigger>
						<PopoverContent className="w-64 p-3" side="bottom" align="start">
							<ColorPicker
								value={hexValue}
								onChange={(val) =>
									onChange(jsonPath, (parent, key, original) =>
										parent.objectNode(key).patchField(original, key, HJSON.stringify(val)),
									)
								}
							>
								<ColorPickerSelection className="h-40 rounded-lg" />
								<ColorPickerHue />
								<ColorPickerAlpha />
								<ColorPickerFormat />
							</ColorPicker>
						</PopoverContent>
					</Popover>
				</div>
			</FormControl>
			<SchemaDescription entrySchema={entrySchema} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</FormField>
	);
});

const ArrayField = React.memo(function ArrayField({ path, name, value, onChange, entrySchema, jsonPath }: SchemaRendererProps) {
	const arrayValue = Array.isArray(value) ? value : undefined;

	if (!arrayValue) {
		onChange(jsonPath, () => HJSON.stringify(v.getDefault(entrySchema) ?? []));
		return null;
	}

	const itemSchema = getArrayItemSchema(entrySchema);

	if (!itemSchema) {
		throw new Error("Array schema must have item schema: " + entrySchema);
	}

	const handleRemove = (index: number) => {
		onChange(jsonPath, (parent, key, original) => {
			const arr = parent.get(key);
			if (!arr.isArray()) throw new Error(`expected array at ${jsonPath}`);
			return arr.removeElement(original, index);
		});
	};

	const handleAdd = () => {
		const nextItemSchema = getArrayItemSchema(entrySchema, arrayValue.length) ?? itemSchema;
		const serialized = nextItemSchema ? HJSON.stringify(v.getDefault(nextItemSchema)) : '""';
		onChange(jsonPath, (parent, key, original) => {
			const arr = parent.get(key);
			if (!arr.isArray()) throw new Error(`expected array at ${jsonPath}`);
			return arr.insertElement(original, arrayValue.length, serialized);
		});
	};

	return (
		<Collapsible>
			<FormField>
				<CollapsibleTrigger>
					<FormLabel>
						<SchemaLabel name={name} entrySchema={entrySchema} />
					</FormLabel>
				</CollapsibleTrigger>
				<SchemaDescription entrySchema={entrySchema} />
				<CollapsibleContent>
					<FormControl>
						<div className="flex flex-col gap-2">
							{arrayValue.map((el, index) => {
								const currentItemSchema = getArrayItemSchema(entrySchema, index) ?? itemSchema;
								const entryJsonPath = jsonPath ? `${jsonPath}[${index}]` : `[${index}]`;

								return (
									<div key={index} className="flex flex-col gap-2 relative border p-2 rounded-md">
										<p className="font-semibold">{index + 1}</p>
										<SchemaArrayItemEditor
											path={path}
											value={el}
											itemSchema={currentItemSchema}
											onChange={onChange}
											jsonPath={entryJsonPath}
										/>
										<Button
											size="sm"
											className="absolute top-1 right-1 text-destructive"
											variant="ghost"
											onClick={() => handleRemove(index)}
										>
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
				</CollapsibleContent>
			</FormField>
		</Collapsible>
	);
});

const ObjectField = React.memo(function ObjectField({ path, value, onChange, entrySchema, jsonPath }: SchemaRendererProps) {
	if (typeof value !== "object" || value === null) {
		return null;
	}

	const entries = getSchemaEntries(resolveSchema(entrySchema, value));

	const results = entries.map(([name, childSchema]) => {
		const key = name;
		const type = detectSchemaType(childSchema);
		const childValue = (value as Record<string, unknown>)?.[name];
		const metadata = getSchemaMetadata(childSchema);

		if (metadata?.visibleWhen && typeof value === "object" && value !== null) {
			const refValue = (value as Record<string, unknown>)[metadata.visibleWhen.field];
			if (refValue === undefined || refValue !== metadata.visibleWhen.value) return null;
		}

		const Renderer = schemaRenderers[type];

		if (Renderer === undefined) {
			return (
				<FormControl key={key}>
					<FormLabel>
						<SchemaLabel name={name} entrySchema={childSchema as AnySchema} />
					</FormLabel>
					<span className="text-yellow-400 text-sm">Unknown field type {type}</span>
				</FormControl>
			);
		}

		return (
			<ErrorBoundary key={key}>
				<Renderer
					path={path}
					name={name}
					value={childValue ?? v.getDefault(childSchema)}
					onChange={onChange}
					entrySchema={childSchema as AnySchema}
					jsonPath={jsonPath ? `${jsonPath}.${name}` : name}
				/>
			</ErrorBoundary>
		);
	});

	return <div className="pl-4 border-l-2 border-border grid gap-6">{results}</div>;
});

const ResearchField = React.memo(function ResearchField({ name, value, onChange, entrySchema, jsonPath, path }: SchemaRendererProps) {
	const currentValue = value as Research | string | null | undefined;

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

	function handleChange(newParent: string, newRequirements: string[]) {
		if (!newParent && newRequirements.length === 0) {
			onChange(jsonPath, (parent, key, original) => removeByJsonPath(parent, key, original));
		} else if (newRequirements.length > 0) {
			onChange(jsonPath, (parent, key, original) =>
				parent.objectNode(key).patchField(original, key, HJSON.stringify({ parent: newParent, requirements: newRequirements })),
			);
		} else {
			onChange(jsonPath, (parent, key, original) => parent.objectNode(key).patchField(original, key, HJSON.stringify(newParent)));
		}
	}

	function handleAddNewReq() {
		handleChange(parent, [...requirements, "copper" + "/" + 10]);
	}

	return (
		<>
			<FormField>
				<FormLabel>
					<SchemaLabel name={name} entrySchema={entrySchema} />
				</FormLabel>
				<FormControl>
					<Dialog>
						<DialogTrigger asChild>
							<ResearchParentTrigger parent={parent} />
						</DialogTrigger>
						<DialogContent className="w-sm" showCloseButton={false}>
							<VisuallyHidden.Root>
								<DialogTitle />
								<DialogDescription />
							</VisuallyHidden.Root>
							<ResearchParentToggleGroup value={parent} onValueChange={(v) => handleChange(v, requirements)} />
						</DialogContent>
					</Dialog>
				</FormControl>
				<SchemaDescription entrySchema={entrySchema} />
				<FieldIssue path={path} jsonPath={jsonPath} />
				<FormControl className="grid gap-2">
					<ResearchRequirementList requirements={requirements} onChange={(newRequirements) => handleChange(parent, newRequirements)} />
					<Button className="w-full" variant="outline" onClick={handleAddNewReq}>
						<Plus />
					</Button>
				</FormControl>
			</FormField>
		</>
	);
});

const ResearchRequirementList = React.memo(function ResearchRequirementList({
	requirements,
	onChange,
}: {
	requirements: string[];
	onChange: (requirements: string[]) => void;
}) {
	const items = useItems({ project: true, base: true });
	const addedReq = requirements.map((requirement: string) => requirement.split("/")[0]!);

	function handleRemoveReq(index: number) {
		onChange(requirements.filter((_: unknown, i: number) => i !== index));
	}

	function handleUpdateReq(index: number, item: string, number: number) {
		onChange(requirements.map((r: string, i: number) => (i === index ? item + "/" + number : r)));
	}

	return requirements.map((requirement: string, index: number) => {
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
	});
});

const ResearchParentTrigger = React.memo(function ResearchParentTrigger({ parent }: { parent: string }) {
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

	const parentEntry = findContent(parent, [items, blocks, liquids, sectors, units]);

	return parentEntry ? (
		<Button variant="outline" size="icon">
			<ContentImage className="p-1" entry={parentEntry} />
		</Button>
	) : (
		<Button variant="outline">{parent || "Select"}</Button>
	);
});

const ResearchParentToggleGroup = React.memo(function ResearchParentToggleGroup({
	value,
	onValueChange,
}: {
	value: string | undefined;
	onValueChange: (v: string) => void;
}) {
	const items = useItems({ project: true, base: true });
	const blocks = useBlocks();
	const units = useUnits();
	const liquids = useLiquids();
	const sectors = useSectors();

	return (
		<ToggleGroup className="w-full" type="single" value={value} onValueChange={onValueChange}>
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
						{items.map((item) => (
							<ToggleGroupItem key={item.name} value={item.name}>
								<ContentImage entry={item} />
							</ToggleGroupItem>
						))}
					</ItemGrid>
				</TabsContent>
				<TabsContent asChild value="block">
					<ItemGrid>
						{blocks.map((item) => (
							<ToggleGroupItem key={item.name} value={item.name}>
								<ContentImage entry={item} />
							</ToggleGroupItem>
						))}
					</ItemGrid>
				</TabsContent>
				<TabsContent asChild value="liquid">
					<ItemGrid>
						{liquids.map((item) => (
							<ToggleGroupItem key={item.name} value={item.name}>
								<ContentImage entry={item} />
							</ToggleGroupItem>
						))}
					</ItemGrid>
				</TabsContent>
				<TabsContent asChild value="sector">
					<ItemGrid>
						{sectors.map((item) => (
							<ToggleGroupItem key={item.name} value={item.name}>
								<ContentImage entry={item} />
							</ToggleGroupItem>
						))}
					</ItemGrid>
				</TabsContent>
				<TabsContent asChild value="unit">
					<ItemGrid>
						{units.map((item) => (
							<ToggleGroupItem key={item.name} value={item.name}>
								<ContentImage entry={item} />
							</ToggleGroupItem>
						))}
					</ItemGrid>
				</TabsContent>
			</Tabs>
		</ToggleGroup>
	);
});

const EffectField = React.memo(function EffectField({ path, name, value, onChange, entrySchema, jsonPath }: SchemaRendererProps) {
	const { data = [], isLoading, isError, error } = useEffects();
	const [filter, setFilter] = useState("");

	if (typeof value === "object" && value !== null) {
		const typeValue = (value as Record<string, unknown>)?.type ?? "";
		return (
			<div className="grid gap-2">
				<FormLabel>
					<SchemaLabel name={name} entrySchema={entrySchema} />
				</FormLabel>
				<SchemaDescription entrySchema={entrySchema} />
				<div className="grid grid-cols-2 gap-2">
					<Button
						variant="outline"
						onClick={() =>
							onChange(jsonPath, (parent, key, original) =>
								parent.objectNode(key).patchField(original, key, HJSON.stringify(data[0]?.name)),
							)
						}
					>
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
								<span>{String(typeValue)}</span>
								<ChevronsUpDown className="size-4" />
							</Button>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<FormControl>
								<ObjectField
									path={path}
									name={name}
									value={value}
									entrySchema={entrySchema}
									onChange={onChange}
									jsonPath={jsonPath}
								/>
								<Separator />
							</FormControl>
						</CollapsibleContent>
					</FormField>
					<FieldIssue path={path} jsonPath={jsonPath} />
				</Collapsible>
			</div>
		);
	}

	const stringValue = typeof value === "string" ? value : ((v.getDefault(entrySchema) ?? "") as string);

	return (
		<div className="grid gap-2">
			<FormLabel>
				<SchemaLabel name={name} entrySchema={entrySchema} />
			</FormLabel>
			<SchemaDescription entrySchema={entrySchema} />
			<div className="grid grid-cols-2 gap-2">
				<Button variant="outline" disabled>
					Built-In
				</Button>
				<Button
					variant="outline"
					onClick={() =>
						onChange(jsonPath, (parent, key, original) =>
							parent.objectNode(key).patchField(original, key, HJSON.stringify({ type: "ParticleEffect" })),
						)
					}
				>
					Custom
				</Button>
			</div>
			<FormField>
				<Dialog>
					<DialogTrigger asChild>
						<Button className="w-full justify-start" variant="outline">
							{stringValue || "None"}
						</Button>
					</DialogTrigger>
					<DialogContent className="w-sm" showCloseButton={false}>
						<VisuallyHidden.Root>
							<DialogTitle />
							<DialogDescription />
						</VisuallyHidden.Root>
						<ToggleGroup
							type="single"
							value={stringValue}
							onValueChange={(v) =>
								onChange(jsonPath, (parent, key, original) => parent.objectNode(key).patchField(original, key, HJSON.stringify(v)))
							}
							asChild
						>
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
										.filter((i) => i.name !== stringValue && i.name.includes(filter))
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
				<FieldIssue path={path} jsonPath={jsonPath} />
			</FormField>
		</div>
	);
});

const ItemGrid = React.memo(function ItemGrid({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"grid w-full grid-cols-[repeat(auto-fill,minmax(32px,1fr))] gap-1 max-h-[90dhv] md:max-h-[50dvh] overflow-y-auto",
				className,
			)}
			{...props}
		/>
	);
});

const SchemaArrayItemEditor = React.memo(function SchemaArrayItemEditor({
	path,
	value,
	itemSchema,
	onChange,
	jsonPath,
}: {
	path: string;
	value: unknown;
	itemSchema: AnySchema;
	onChange: (jsonPath: string, updater: (parent: HjsonNode, key: string, original: string, root: HjsonNode) => string) => void;
	jsonPath: string;
}) {
	const type = detectSchemaType(itemSchema);

	if (type === "string") {
		const stringValue = typeof value === "string" ? value : v.getDefault(itemSchema);
		return (
			<Input
				value={stringValue}
				onChange={(e) =>
					onChange(jsonPath, (parent, key, original) => {
						if (!parent.isArray()) throw new Error(`expected array at ${jsonPath}`);
						return parent.patchElement(original, Number(key), HJSON.stringify(e.currentTarget.value));
					})
				}
				placeholder="mod-name"
				className="flex-1"
			/>
		);
	}

	const Renderer = schemaRenderers[type];
	const name = String(type);

	if (Renderer === undefined) {
		return <span className="text-yellow-400 text-sm">Unknown field type {name}</span>;
	}

	return (
		<ErrorBoundary key={name}>
			<Renderer path={path} name={name} value={value} onChange={onChange} entrySchema={itemSchema} jsonPath={jsonPath} />
		</ErrorBoundary>
	);
});

const schemaRenderers: Partial<Record<Type, SchemaRenderer>> = {
	string: StringField,
	number: NumberField,
	boolean: BooleanField,
	object: ObjectField,
	array: ArrayField,
	color: ColorField,
	research: ResearchField,
	effect: EffectField,
	picklist: PickListField,
	liquids: LiquidsListField,
	select: SelectField,
	sprite: SpriteField,
};
