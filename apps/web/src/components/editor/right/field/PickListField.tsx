import { FieldControl, Field, FieldLabel } from "#/components/editor/right/field/Field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { HJSON } from "@project/hjson";
import { getSchemaMetadata, unwrapSchema } from "@project/schema";
import React, { useState } from "react";
import * as v from "valibot";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/FieldsRenderer";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { Button } from "#/components/ui/button";
import { Check, ChevronDown, Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { VisuallyHidden } from "radix-ui";

export const PickListField = React.memo(function PickListField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	path,
}: SchemaRendererProps) {
	const stringValue = typeof value === "string" ? value : ((v.getDefault(entrySchema) ?? "") as string);
	const unwrappedSchema = unwrapSchema(entrySchema);
	const [filter, setFilter] = useState("");

	if ("options" in unwrappedSchema && Array.isArray(unwrappedSchema.options)) {
		const options = unwrappedSchema.options.map((v) => String(v)).sort();

		if (options.length > 10) {
			return (
				<Field jsonPath={jsonPath}>
					<FieldLabel>
						<SchemaLabel name={name} entrySchema={getSchemaMetadata(entrySchema)} />
					</FieldLabel>
					<Dialog>
						<DialogTrigger asChild>
							<Button className="w-full justify-between" variant="outline">
								<span>{stringValue}</span>
								<ChevronDown />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogTitle>
								<FieldLabel>
								<SchemaLabel name={name} entrySchema={getSchemaMetadata(entrySchema)} />
							</FieldLabel>
							</DialogTitle>
							<VisuallyHidden.Root>
								<DialogDescription />
							</VisuallyHidden.Root>
							<ToggleGroup
								type="single"
								value={stringValue}
								onValueChange={(v) => {
									if (v) {
										onChange(jsonPath, (parent, key, original) =>
											parent.objectNode(key).patchField(original, key, HJSON.stringify(v)),
										);
									}
								}}
								asChild
							>
								<div className="grid gap-2">
									<InputGroup>
										<InputGroupAddon>
											<Search />
										</InputGroupAddon>
										<InputGroupInput value={filter} onChange={(event) => setFilter(event.currentTarget.value)} />
									</InputGroup>
									<div className="max-h-[80dvh] flex flex-col md:max-h-[50dvh] overflow-y-auto border p-2 rounded-md">
										{options
											.filter((i) => i.toLowerCase().includes(filter.toLowerCase()))
											.map((item) => (
												<ToggleGroupItem className="justify-between" key={item} value={item}>
													<span>{item}</span>
													{stringValue === item && <Check />}
												</ToggleGroupItem>
											))}
									</div>
								</div>
							</ToggleGroup>
						</DialogContent>
					</Dialog>
					<SchemaDescription entrySchema={getSchemaMetadata(entrySchema)} />
					<FieldIssue path={path} jsonPath={jsonPath} />
				</Field>
			);
		}

		return (
			<Field jsonPath={jsonPath}>
				<FieldLabel>
					<SchemaLabel name={name} entrySchema={getSchemaMetadata(entrySchema)} />
				</FieldLabel>
				<FieldControl>
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
							<SelectValue placeholder="None" />
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
				</FieldControl>
				<SchemaDescription entrySchema={getSchemaMetadata(entrySchema)} />
				<FieldIssue path={path} jsonPath={jsonPath} />
			</Field>
		);
	}

	throw new Error(`Unknown option ${value}, this should not happen`);
});
