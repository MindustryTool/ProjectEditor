import { ContentImage } from "#/components/editor/ContentImage";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { FieldControl, Field, FieldLabel } from "#/components/editor/right/field/Field";
import { Input } from "#/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { Plus, X } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import React, { useMemo } from "react";
import { ItemGrid } from "./ItemGrid";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/FieldsRenderer";
import { getSchemaMetadata } from "@project/schema";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import { EMPTY_ARRAY } from "#/lib/utils";
import type { HjsonNode } from "@project/hjson";
import { schemaRenderers } from "#/components/editor/right/field/renderer";

export const ItemRequirementField = React.memo(function ItemRequirementField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
}: SchemaRendererProps) {
	const requirements = Array.isArray(value) ? (value as string[]) : EMPTY_ARRAY;

	function handleAddNewReq() {
		onChange(jsonPath, (parent, key, original) =>
			(parent.path(jsonPath)?.value as HjsonNode).arrayNode(key).insertElement(original, requirements.length, "copper/10"),
		);
	}

	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

	const {
		findContent,
		contents: { items },
	} = useProjectContext();
	const addedReq = requirements.map((requirement: string) => requirement.split("/")[0]!);

	function handleRemoveReq(index: number) {
		onChange(jsonPath, (parent, key, original) =>
			(parent.path(jsonPath)?.value as HjsonNode).arrayNode(key).removeElement(original, index),
		);
	}

	function handleUpdateReq(index: number, item: string, number: number) {
		onChange(jsonPath, (parent, key, original) =>
			(parent.path(jsonPath)?.value as HjsonNode).arrayNode(key).patchElement(original, index, item + "/" + number),
		);
	}

	return (
		<div className="space-y-2">
			<FieldLabel>
				<SchemaLabel name={name} metadata={metadata} />
			</FieldLabel>
			<SchemaDescription metadata={metadata} />
			{requirements.map((requirement: string, index: number) => {
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
			})}
			<Button className="w-full" onClick={handleAddNewReq} variant="outline">
				<Plus />
			</Button>
		</div>
	);
});


schemaRenderers.set("item-requirement", ItemRequirementField);
