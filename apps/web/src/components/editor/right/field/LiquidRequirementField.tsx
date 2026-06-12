import { ContentImage } from "#/components/editor/ContentImage";
import { Button } from "#/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { FieldControl, Field } from "#/components/editor/right/field/Field";
import { Input } from "#/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { VisuallyHidden } from "radix-ui";
import React, { useMemo } from "react";
import { ItemGrid } from "./ItemGrid";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { getSchemaMetadata } from "@project/schema";
import { useProjectContext } from "#/components/editor/ProjectProvider";

export const LiquidRequirementField = React.memo(function LiquidRequirementField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
}: SchemaRendererProps) {
	const {
		findContent,
		contents: { liquids },
	} = useProjectContext();

	const requirement = typeof value === "string" ? value : "";
	const parts = requirement?.split("/") || [];
	const itemName = parts[0] || "";
	const reqNumber = Number(parts[1] ?? 0);
	const selectedItem = findContent(itemName, [liquids]);

	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

	const handleChange = (name: string, amount: number) => {
		onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, name + "/" + amount));
	};

	return (
		<Field key={itemName} jsonPath={jsonPath} metadata={metadata}>
			<SchemaLabel name={name} metadata={metadata} />
			<SchemaDescription metadata={metadata} />
			<FieldControl className="flex gap-1">
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline" className="py-1 px-2 flex-1 justify-start overflow-hidden">
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
							onValueChange={(v) => (v ? handleChange(v, reqNumber) : handleChange("", 0))}
							asChild
						>
							<ItemGrid>
								{liquids
									.filter((i) => i.name !== itemName)
									.map((item) => (
										<DialogClose key={item.name} asChild>
											<ToggleGroupItem value={item.name}>
												<ContentImage entry={item} />
											</ToggleGroupItem>
										</DialogClose>
									))}
							</ItemGrid>
						</ToggleGroup>
					</DialogContent>
				</Dialog>
				<Input
					className="flex-1"
					type="number"
					value={reqNumber}
					onChange={(v) => handleChange(itemName, Number(v.currentTarget.valueAsNumber))}
				/>
			</FieldControl>
		</Field>
	);
});
