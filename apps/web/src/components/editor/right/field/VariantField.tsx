import { Field, FieldLabel } from "#/components/editor/right/field/Field";
import { SchemaDescription } from "#/components/editor/right/field/SchemaDescription";
import { SchemaLabel } from "#/components/editor/right/field/SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { detectSchemaType, getDefaults, getSchemaMetadata } from "@project/schema";
import React from "react";
import { useMemo } from "react";

export const VariantField = React.memo(function VariantField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	path,
	getRenderer,
}: SchemaRendererProps) {
	const fieldMetadata = useMemo(() => getSchemaMetadata(entrySchema, false), [entrySchema]);

	if (fieldMetadata!.type !== "variant") {
		throw new Error("VariantField only works with variant schemas");
	}

	if (fieldMetadata?.options) {
		const options = fieldMetadata.options
			.map((option) => ({ schema: option, metadata: getSchemaMetadata(option) }))
			.filter(({ metadata }) => metadata && metadata.name)
			.map(({ schema, metadata }) => {
				const { type, schema: typeSchema } = detectSchemaType(schema, value);
				const defaultValue = getDefaults(schema, value);

				const Renderer = getRenderer(type);

				return { schema, name: metadata!.name!, metadata: metadata!, type, defaultValue, typeSchema, Renderer };
			});

		let matched = undefined;

		for (const option of options) {
			if (
				(option.type === "array" && Array.isArray(value)) ||
				(option.type === "object" && typeof value === "object") ||
				option.type === typeof value
			) {
				matched = option.name;
				break;
			}
		}

		if (options.length === 0) {
			return (
				<Field jsonPath={jsonPath} metadata={fieldMetadata}>
					<FieldLabel>
						<SchemaLabel name={name} metadata={fieldMetadata} />
					</FieldLabel>
					<SchemaDescription metadata={fieldMetadata} />
					{name} has no options
				</Field>
			);
		}

		if (options.length === 1) {
			const { type, defaultValue, typeSchema, Renderer } = options[0]!;

			if (!Renderer) {
				return <div>Renderer renderer not found for type {type}</div>;
			}

			return (
				<Field jsonPath={jsonPath} metadata={fieldMetadata}>
					<FieldLabel>
						<SchemaLabel name={name} metadata={fieldMetadata} />
					</FieldLabel>
					<SchemaDescription metadata={fieldMetadata} />
					<Renderer
						path={path}
						name={name}
						value={value}
						onChange={onChange}
						entrySchema={typeSchema}
						jsonPath={jsonPath}
						getRenderer={getRenderer}
						defaultValue={defaultValue}
					/>
				</Field>
			);
		}

		if (options.length === 2) {
			const option1 = options[0]!;
			const option2 = options[1]!;

			const { name: name1, type: type1, defaultValue: defaultValue1, typeSchema: typeSchema1, Renderer: Renderer1 } = option1;

			const { name: name2, type: type2, defaultValue: defaultValue2, typeSchema: typeSchema2, Renderer: Renderer2 } = option2;

			if (!Renderer1 || !Renderer2) {
				return (
					<div>
						Renderer renderer not found for type {type1} or {type2}
					</div>
				);
			}

			const defaultTab = matched ?? name1;

			return (
				<Field jsonPath={jsonPath} metadata={fieldMetadata}>
					<Tabs
						className="w-full p-2 border rounded-md bg-muted"
						defaultValue={defaultTab}
						onValueChange={(tab) => {
							if (tab === name1) {
								onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, defaultValue1));
							} else if (tab === name2) {
								onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, defaultValue2));
							}
						}}
					>
						<FieldLabel>
							<SchemaLabel name={name} metadata={fieldMetadata} />
						</FieldLabel>
						<SchemaDescription metadata={fieldMetadata} />
						<TabsList className="w-full border p-0 overflow-hidden" defaultValue={defaultTab}>
							<TabsTrigger className="border-none h-full rounded-none" value={name1}>
								{name1}
							</TabsTrigger>
							<TabsTrigger className="border-none h-full rounded-none" value={name2}>
								{name2}
							</TabsTrigger>
						</TabsList>
						<TabsContent value={name1}>
							<Renderer1
								path={path}
								name={name1}
								value={value}
								onChange={onChange}
								entrySchema={typeSchema1}
								jsonPath={jsonPath}
								getRenderer={getRenderer}
								defaultValue={defaultValue1}
								nested
							/>
						</TabsContent>
						<TabsContent value={name2}>
							<Renderer2
								path={path}
								name={name2}
								value={value}
								onChange={onChange}
								entrySchema={typeSchema2}
								jsonPath={jsonPath}
								getRenderer={getRenderer}
								defaultValue={defaultValue2}
								nested
							/>
						</TabsContent>
					</Tabs>
				</Field>
			);
		}

		const defaultTab = matched ?? options[0]!.name;
		const selecting = options.find((option) => option.name === defaultTab);

		if (!selecting) {
			throw new Error(`Unknown option ${defaultTab}, options: ${JSON.stringify(options.map((opt) => opt.name))}`);
		}

		const { Renderer } = selecting;

		if (Renderer === undefined) {
			return <div>Renderer renderer not found for type {selecting.type}</div>;
		}

		return (
			<Field jsonPath={jsonPath} metadata={fieldMetadata} className="w-full p-2 border rounded-md bg-muted">
				<FieldLabel>
					<SchemaLabel name={name} metadata={fieldMetadata} />
				</FieldLabel>
				<SchemaDescription metadata={fieldMetadata} />
				<Select
					defaultValue={defaultTab}
					onValueChange={(tab) => {
						const option = options.find((option) => option.name === tab);
						if (option) {
							onChange(jsonPath, (parent, original, key) => {
								return parent.patchValue(original, key, option.defaultValue);
							});
						} else {
							throw new Error(`Unknown option ${tab}`);
						}
					}}
				>
					<SelectTrigger className="h-7 w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{options.map((opt) => (
							<SelectItem key={opt.name} value={opt.name} className="text-xs">
								{opt.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Renderer
					path={path}
					name={selecting.name}
					value={value}
					onChange={onChange}
					entrySchema={selecting.typeSchema}
					jsonPath={jsonPath}
					getRenderer={getRenderer}
					defaultValue={selecting.defaultValue}
                    nested
				/>
			</Field>
		);
	}

	throw new Error("UnionField: options is required: " + JSON.stringify(entrySchema));
});
