import { FieldControl, Field, FieldLabel } from "#/components/editor/right/field/Field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { getSchemaMetadata, hasNullableWrapper, unwrapSchema } from "@project/schema";
import React, { useMemo, useState } from "react";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { Button } from "#/components/ui/button";
import { Check, ChevronDown, Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { VisuallyHidden } from "radix-ui";
import { levenshtein } from "#/lib/utils";

export const PickListField = React.memo(function PickListField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	path,
	defaultValue,
}: SchemaRendererProps) {
	const unwrappedSchema = unwrapSchema(entrySchema);
	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

	const [filter, setFilter] = useState("");

	if ("options" in unwrappedSchema && Array.isArray(unwrappedSchema.options)) {
		const options = useMemo(() => {
			const list = (unwrappedSchema.options as unknown[]).map((v) => String(v));
			return filter ? levenshtein(list, (i) => i, filter) : list.sort();
		}, [filter, unwrappedSchema.options]);

		const stringValue = useMemo(
			() => (typeof value === "string" ? value : value ? String(value) : String((defaultValue ?? options[0]) || "")),
			[value, defaultValue, options],
		);

		if (options.length > 10) {
			return (
				<Field jsonPath={jsonPath} metadata={metadata}>
					<FieldLabel>
						<SchemaLabel name={name} metadata={metadata} />
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
									<SchemaLabel name={name} metadata={metadata} />
								</FieldLabel>
							</DialogTitle>
							<VisuallyHidden.Root>
								<DialogDescription />
							</VisuallyHidden.Root>
							<ToggleGroup
								type="single"
								value={stringValue}
								onValueChange={(v) => {
									const isDefault = v === String(defaultValue ?? "");
									const isNullable = hasNullableWrapper(entrySchema);

									if (v === "" || (isDefault && !isNullable)) {
										return onChange(jsonPath, (parent, original, key) => parent.patchRemove(original, key));
									}

									onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, v));
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
										{options.map((item) => (
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
					<SchemaDescription metadata={metadata} />
					<FieldIssue path={path} jsonPath={jsonPath} />
				</Field>
			);
		}

		return (
			<Field jsonPath={jsonPath} metadata={metadata}>
				<FieldLabel>
					<SchemaLabel name={name} metadata={metadata} />
				</FieldLabel>
				<FieldControl>
					<Select
						key={name}
						value={stringValue}
						onValueChange={(nextValue) =>
							onChange(jsonPath, (parent, original, key) => {
								const isDefault = nextValue === String(defaultValue ?? "");
								const isNullable = hasNullableWrapper(entrySchema);

								if (nextValue === "" || (isDefault && !isNullable)) {
									return parent.patchRemove(original, key);
								}

								return parent.patchValue(original, key, nextValue);
							})
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
				<SchemaDescription metadata={metadata} />
				<FieldIssue path={path} jsonPath={jsonPath} />
			</Field>
		);
	}

	throw new Error(
		`Unknown schema for field ${jsonPath}, this should not happen, schema: ${JSON.stringify(unwrappedSchema, null, 2)}, value: ${JSON.stringify(value, null, 2)}`,
	);
});
