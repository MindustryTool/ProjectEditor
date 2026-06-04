import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { FormControl, FormField, FormLabel } from "#/components/ui/form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "#/components/ui/collapsible";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group";
import { Separator } from "#/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { useEffects } from "#/hooks/use-effects";
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

export const EffectField = React.memo(function EffectField({ path, name, value, onChange, entrySchema, jsonPath }: SchemaRendererProps) {
	const effects = useEffects();
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
			</FormField>
		</div>
	);
});
