import { ContentImage } from "#/components/editor/ContentImage";
import { Button } from "#/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { FieldControl, Field } from "#/components/editor/right/field/Field";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { ChevronDown } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import React, { useMemo } from "react";
import { ItemGrid } from "./ItemGrid";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { getSchemaMetadata, hasNullableWrapper } from "@project/schema";
import { useProjectContext } from "#/components/editor/ProjectProvider";

export const ContentField = React.memo(function ContentField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	path,
	defaultValue,
}: SchemaRendererProps) {
	const parent = typeof value === "string" ? value : "";

	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

	return (
		<>
			<Field jsonPath={jsonPath} metadata={metadata}>
				<SchemaLabel name={name} metadata={metadata} />
				<FieldControl>
					<Dialog>
						<ResearchParentTrigger parent={parent} />
						<DialogContent className="w-sm" showCloseButton={false}>
							<VisuallyHidden.Root>
								<DialogTitle />
								<DialogDescription />
							</VisuallyHidden.Root>
							<ResearchParentToggleGroup
								value={parent}
								onValueChange={(v) =>
									onChange(jsonPath, (parent, original, key) => {
										const isDefault = v === String(defaultValue ?? "");
										const isNullable = hasNullableWrapper(entrySchema);

										if (v === undefined || v === "" || (isDefault && !isNullable)) {
											return parent.patchRemove(original, key);
										}

										return parent.patchValue(original, key, v);
									})
								}
							/>
						</DialogContent>
					</Dialog>
				</FieldControl>
				<SchemaDescription metadata={metadata} />
				<FieldIssue path={path} jsonPath={jsonPath} />
			</Field>
		</>
	);
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
							<DialogClose key={item.name} asChild>
								<ToggleGroupItem value={item.name}>
									<ContentImage entry={item} />
								</ToggleGroupItem>
							</DialogClose>
						))}
					</ItemGrid>
				</TabsContent>
				<TabsContent asChild value="block">
					<ItemGrid>
						{blocks.map((item) => (
							<DialogClose key={item.name} asChild>
								<ToggleGroupItem value={item.name}>
									<ContentImage entry={item} />
								</ToggleGroupItem>
							</DialogClose>
						))}
					</ItemGrid>
				</TabsContent>
				<TabsContent asChild value="liquid">
					<ItemGrid>
						{liquids.map((item) => (
							<DialogClose key={item.name} asChild>
								<ToggleGroupItem value={item.name}>
									<ContentImage entry={item} />
								</ToggleGroupItem>
							</DialogClose>
						))}
					</ItemGrid>
				</TabsContent>
				<TabsContent asChild value="sector">
					<ItemGrid>
						{sectors.map((item) => (
							<DialogClose key={item.name} asChild>
								<ToggleGroupItem value={item.name}>
									<ContentImage entry={item} />
								</ToggleGroupItem>
							</DialogClose>
						))}
					</ItemGrid>
				</TabsContent>
				<TabsContent asChild value="unit">
					<ItemGrid>
						{units.map((item) => (
							<DialogClose key={item.name} asChild>
								<ToggleGroupItem value={item.name}>
									<ContentImage entry={item} />
								</ToggleGroupItem>
							</DialogClose>
						))}
					</ItemGrid>
				</TabsContent>
			</Tabs>
		</ToggleGroup>
	);
});
