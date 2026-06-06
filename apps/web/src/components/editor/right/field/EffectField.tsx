import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { Field } from "#/components/editor/right/field";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "#/components/ui/collapsible";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group";
import { Separator } from "#/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { HJSON } from "@project/hjson";
import { VisuallyHidden } from "radix-ui";
import { ChevronDown, ChevronsUpDown, Search } from "lucide-react";
import React, { useState } from "react";
import * as v from "valibot";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import { ObjectField } from "./ObjectField";
import type { SchemaRendererProps } from "#/components/editor/right/FieldsRenderer";
import { FieldLabel } from "#/components/ui/field";
import { FieldControl } from "#/components/editor/right/field/Field";
import { getSchemaMetadata } from "@project/schema";
import { useProjectContext } from "#/components/editor/ProjectProvider";

export const EffectField = React.memo(function EffectField({ path, name, value, onChange, entrySchema, jsonPath }: SchemaRendererProps) {
	const effects = useProjectContext().contents.effects;
	const [filter, setFilter] = useState("");

	if (typeof value === "object" && value !== null) {
		const typeValue = (value as Record<string, unknown>)?.type ?? "";
		return (
			<div className="grid gap-2">
				<FieldLabel>
					<SchemaLabel name={name} entrySchema={getSchemaMetadata(entrySchema)} />
				</FieldLabel>
				<SchemaDescription entrySchema={getSchemaMetadata(entrySchema)} />
				<div className="grid grid-cols-2 gap-2">
					<Button
						variant="outline"
						onClick={() =>
							onChange(jsonPath, (parent, key, original) =>
								parent.objectNode(key).patchField(original, key, HJSON.stringify(effects[0]?.name)),
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
					<Field jsonPath={jsonPath}>
						<CollapsibleTrigger asChild>
							<Button variant="outline" className="flex items-center justify-between w-full">
								<span>{String(typeValue)}</span>
								<ChevronsUpDown className="size-4" />
							</Button>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<FieldControl>
								<ObjectField
									path={path}
									name={name}
									value={value}
									entrySchema={entrySchema}
									onChange={onChange}
									jsonPath={jsonPath}
								/>
								<Separator />
							</FieldControl>
						</CollapsibleContent>
					</Field>
					<FieldIssue path={path} jsonPath={jsonPath} />
				</Collapsible>
			</div>
		);
	}

	const stringValue = typeof value === "string" ? value : ((v.getDefault(entrySchema) ?? "") as string);

	return (
		<div className="grid gap-2">
			<FieldLabel>
				<SchemaLabel name={name} entrySchema={getSchemaMetadata(entrySchema)} />
			</FieldLabel>
			<SchemaDescription entrySchema={getSchemaMetadata(entrySchema)} />
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
			<Field jsonPath={jsonPath}>
				<Dialog>
					<DialogTrigger asChild>
						<Button className="w-full justify-between" variant="outline">
							{stringValue || "None"}
							<ChevronDown />
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
									{effects
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
			</Field>
		</div>
	);
});
