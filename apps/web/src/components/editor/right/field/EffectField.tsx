import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { Field } from "#/components/editor/right/field";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "#/components/ui/collapsible";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group";
import { Separator } from "#/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { VisuallyHidden } from "radix-ui";
import { ChevronDown, ChevronsUpDown, Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import { ObjectField } from "./ObjectField";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { FieldLabel } from "#/components/ui/field";
import { FieldControl } from "#/components/editor/right/field/Field";
import { getSchemaMetadata } from "@project/schema";
import { useProjectContext } from "#/components/editor/ProjectProvider";

export const EffectField = React.memo(function EffectField({
	path,
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	getRenderer,
	defaultValue,
}: SchemaRendererProps) {
	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);
	const effects = useProjectContext().contents.effects;

    if (metadata!.type !== "effect") {
        throw new Error(`EffectField must be used with effect schema, got ${JSON.stringify(entrySchema)}`);
    }

	if (typeof value === "object" && value !== null) {
		const typeValue = (value as Record<string, unknown>)?.type ?? "";

		return (
			<div className="grid gap-2">
				<FieldLabel>
					<SchemaLabel name={name} metadata={metadata} />
				</FieldLabel>
				<SchemaDescription metadata={metadata} />
				<div className="grid grid-cols-2 gap-2">
					<Button
						variant="outline"
						onClick={() =>
							onChange(jsonPath, (parent, original, key) =>
								parent.patchValue(original, key, effects[0]?.name ?? ""),
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
					<Field jsonPath={jsonPath} metadata={metadata}>
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
									getRenderer={getRenderer}
									defaultValue={defaultValue}
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

	const stringValue = typeof value === "string" ? value : ((defaultValue ?? "") as string);

	return (
		<div className="grid gap-2">
			<FieldLabel>
				<SchemaLabel name={name} metadata={metadata} />
			</FieldLabel>
			<SchemaDescription metadata={metadata} />
			<div className="grid grid-cols-2 gap-2">
				<Button variant="outline" disabled>
					Built-In
				</Button>
				<Button
					variant="outline"
					onClick={() =>
						onChange(jsonPath, (parent, original, key) =>
							parent.patchValue(original, key, { type: "ParticleEffect" }),
						)
					}
				>
					Custom
				</Button>
			</div>
			<Field jsonPath={jsonPath} metadata={metadata}>
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
						<EffectDialogContent value={stringValue} jsonPath={jsonPath} onChange={onChange} />
					</DialogContent>
				</Dialog>
				<FieldIssue path={path} jsonPath={jsonPath} />
			</Field>
		</div>
	);
});

function EffectDialogContent({
	value,
	onChange,
	jsonPath,
}: {
	value: string;
	jsonPath: string;
	onChange: Parameters<typeof EffectField>[0]["onChange"];
}) {
	const [filter, setFilter] = useState("");
	const effects = useProjectContext().contents.effects;

	return (
		<ToggleGroup
			type="single"
			value={value}
			onValueChange={(v) =>
				onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, v))
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
						.filter((i) => i.name !== value && i.name.includes(filter))
						.map((item) => (
							<ToggleGroupItem key={item.name} value={item.name}>
								{item.name}
							</ToggleGroupItem>
						))}
				</div>
			</div>
		</ToggleGroup>
	);
}
