import { ContentImage } from "#/components/editor/ContentImage";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { FieldControl, Field, FieldLabel } from "#/components/editor/right/field/Field";
import { Input } from "#/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { HJSON } from "@project/hjson";
import { ChevronDown, Plus, X } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import React, { useMemo } from "react";
import { ItemGrid } from "./ItemGrid";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import { removeByJsonPath } from "./util";
import type { SchemaRendererProps } from "#/components/editor/right/field/renderer";
import type { Research, SchemaMetadata } from "@project/schema";
import { getSchemaMetadata } from "@project/schema";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import { schemaRenderers } from "#/components/editor/right/field/renderer";

export const ResearchField = React.memo(function ResearchField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	path,
}: SchemaRendererProps) {
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

	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

	return (
		<>
			<Field jsonPath={jsonPath} metadata={metadata}>
				<FieldLabel>
					<SchemaLabel name={name} metadata={metadata} />
				</FieldLabel>
				<FieldControl>
					<Dialog>
						<ResearchParentTrigger parent={parent} />
						<DialogContent className="w-sm" showCloseButton={false}>
							<VisuallyHidden.Root>
								<DialogTitle />
								<DialogDescription />
							</VisuallyHidden.Root>
							<ResearchParentToggleGroup value={parent} onValueChange={(v) => handleChange(v, requirements)} />
						</DialogContent>
					</Dialog>
				</FieldControl>
				<SchemaDescription metadata={metadata} />
				<FieldIssue path={path} jsonPath={jsonPath} />
				<FieldControl className="grid gap-2">
					<ResearchRequirementList
						jsonPath={jsonPath}
						metadata={metadata}
						requirements={requirements}
						onChange={(newRequirements) => handleChange(parent, newRequirements)}
					/>
					<Button className="w-full" variant="outline" onClick={handleAddNewReq}>
						<Plus />
					</Button>
				</FieldControl>
			</Field>
		</>
	);
});

const ResearchRequirementList = React.memo(function ResearchRequirementList({
	requirements,
	onChange,
	jsonPath,
	metadata,
}: {
	requirements: string[];
	onChange: (requirements: string[]) => void;
	jsonPath: string;
	metadata: SchemaMetadata | null;
}) {
	const {
		findContent,
		contents: { items },
	} = useProjectContext();
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

		const selectedItem = findContent(itemName, [items]);

		return (
			<Field key={index} jsonPath={jsonPath + "." + index} metadata={metadata}>
				<FieldControl className="flex gap-1">
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline" className="py-1 px-2">
								{selectedItem ? (
									<span className="flex items-center gap-2">
										<ContentImage className="size-5" entry={selectedItem} />
										{itemName}
									</span>
								) : (
									itemName
								)}
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
				</FieldControl>
			</Field>
		);
	});
});

const ResearchParentTrigger = React.memo(function ResearchParentTrigger({ parent }: { parent: string }) {
	const { contents, findContent } = useProjectContext();
	const { items, blocks, liquids, sectors, units } = contents;

	const parentEntry = findContent(parent, [items, blocks, liquids, sectors, units]);

	return (
		<DialogTrigger asChild>
			{parentEntry ? (
				<Button className="w-full justify-start gap-2 px-2" variant="outline" size="icon">
					<ContentImage className="size-5" entry={parentEntry} />
					{parent}
					<ChevronDown className="ml-auto" />
				</Button>
			) : (
				<Button className="w-full justify-between px-2" variant="outline">
					<span>{parent || "Select"}</span>
					<ChevronDown />
				</Button>
			)}
		</DialogTrigger>
	);
});

const ResearchParentToggleGroup = React.memo(function ResearchParentToggleGroup({
	value,
	onValueChange,
}: {
	value: string | undefined;
	onValueChange: (v: string) => void;
}) {
	const { items, blocks, liquids, sectors, units } = useProjectContext().contents;

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

schemaRenderers.set("research", ResearchField);
