import { Field } from "#/components/editor/right/field/Field";
import { SchemaDescription } from "#/components/editor/right/field/SchemaDescription";
import { SchemaLabel } from "#/components/editor/right/field/SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { EMPTY_ARRAY } from "#/lib/utils";
import { detectSchemaType, getDefaults, getSchemaMetadata } from "@project/schema";
import React, { useMemo, useRef } from "react";

export const OptionsField = React.memo(function OptionsField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	path,
	getRenderer,
	metadata: fieldMetadata,
}: SchemaRendererProps) {
	const lastRef = useRef<Record<string, unknown>>({});

	if (!fieldMetadata || fieldMetadata.type !== "options") {
		throw new Error("OptionsField only works with options schemas");
	}

    const fieldOptions = fieldMetadata.options || EMPTY_ARRAY;

	if (!fieldOptions || fieldOptions.length === 0) {
		throw new Error("OptionsField: options is required: " + JSON.stringify(entrySchema));
	}

	const options = useMemo(
		() =>
			fieldOptions
				.map((option) => ({ schema: option, metadata: getSchemaMetadata(option) }))
				.filter(({ metadata }) => metadata && metadata.option)
				.map(({ schema, metadata }) => {
					const { type, schema: typeSchema } = detectSchemaType(schema, value);
					const defaultValue = getDefaults(schema, value);

					const Renderer = getRenderer(type);

					return { schema, option: metadata!.option!, metadata: metadata!, type, defaultValue, typeSchema, Renderer };
				}),
		[fieldOptions, value, getRenderer],
	);

	let matched = undefined;

	for (const option of options) {
		if (
			(option.type === "array" && Array.isArray(value)) ||
			(option.type === "object" && typeof value === "object") ||
			option.type === typeof value
		) {
			matched = option.option;
			break;
		}
	}

	if (options.length === 0) {
		return (
			<Field jsonPath={jsonPath} metadata={fieldMetadata}>
				<SchemaLabel name={name} metadata={fieldMetadata} />
				<SchemaDescription metadata={fieldMetadata} />
				{name} has no options
			</Field>
		);
	}

	if (options.length === 1) {
		const { type, defaultValue, typeSchema, Renderer, metadata } = options[0]!;

		if (!Renderer) {
			return <div>Renderer not found for type {type}</div>;
		}

		return (
			<Field className="flex flex-col" jsonPath={jsonPath} metadata={fieldMetadata}>
				<SchemaLabel name={name} metadata={fieldMetadata} />
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
					metadata={metadata}
				/>
			</Field>
		);
	}

	if (options.length === 2) {
		const {
			option: option1,
			type: type1,
			defaultValue: defaultValue1,
			typeSchema: typeSchema1,
			Renderer: Renderer1,
			metadata: metadata1,
		} = options[0]!;

		const {
			option: option2,
			type: type2,
			defaultValue: defaultValue2,
			typeSchema: typeSchema2,
			Renderer: Renderer2,
			metadata: metadata2,
		} = options[1]!;

		const defaultTab = matched ?? option1;

		return (
			<Field jsonPath={jsonPath} metadata={fieldMetadata}>
				<Tabs
					className="w-full p-2 border rounded-md bg-muted"
					value={defaultTab}
					onValueChange={(tab) => {
						lastRef.current[defaultTab] = value || undefined;

						if (tab === option1) {
							onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, lastRef.current[tab] ?? defaultValue1));
						} else if (tab === option2) {
							onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, lastRef.current[tab] ?? defaultValue2));
						}
					}}
				>
					<SchemaLabel name={name} metadata={fieldMetadata} />
					<SchemaDescription metadata={fieldMetadata} />
					<TabsList className="w-full border p-0 overflow-hidden">
						<TabsTrigger className="border-none h-full rounded-none" value={option1}>
							{option1}
						</TabsTrigger>
						<TabsTrigger className="border-none h-full rounded-none" value={option2}>
							{option2}
						</TabsTrigger>
					</TabsList>
					<TabsContent className="flex flex-col" value={option1}>
						{Renderer1 ? (
							<Renderer1
								path={path}
								name={option1}
								value={value}
								onChange={onChange}
								entrySchema={typeSchema1}
								jsonPath={jsonPath}
								getRenderer={getRenderer}
								defaultValue={defaultValue1}
								metadata={metadata1}
								nested
							/>
						) : (
							<span>Renderer not found for type {type1}</span>
						)}
					</TabsContent>
					<TabsContent className="flex flex-col" value={option2}>
						{Renderer2 ? (
							<Renderer2
								path={path}
								name={option2}
								value={value}
								onChange={onChange}
								entrySchema={typeSchema2}
								jsonPath={jsonPath}
								getRenderer={getRenderer}
								defaultValue={defaultValue2}
								metadata={metadata2}
								nested
							/>
						) : (
							<span>Renderer not found for type {type2}</span>
						)}
					</TabsContent>
				</Tabs>
			</Field>
		);
	}

	const defaultTab = matched ?? options[0]!.option;
	const selecting = options.find((option) => option.option === defaultTab);

	if (!selecting) {
		throw new Error(`Unknown option ${defaultTab}, options: ${JSON.stringify(options.map((opt) => opt.option))}`);
	}

	const { Renderer, metadata } = selecting;

	if (Renderer === undefined) {
		return <div>Renderer not found for selected type {selecting.type}</div>;
	}

	return (
		<Field jsonPath={jsonPath} metadata={fieldMetadata} className="w-full flex flex-col p-2 border rounded-md bg-muted">
			<SchemaLabel name={name} metadata={fieldMetadata} />
			<SchemaDescription metadata={fieldMetadata} />
			<Select
				value={defaultTab}
				onValueChange={(tab) => {
					lastRef.current[defaultTab] = value || undefined;
					const option = options.find((option) => option.option === tab);

					if (option) {
						onChange(jsonPath, (parent, original, key) => {
							return parent.patchValue(original, key, lastRef.current[tab] ?? option.defaultValue);
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
						<SelectItem key={opt.option} value={opt.option} className="text-xs">
							{opt.option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Renderer
				path={path}
				name={selecting.option}
				value={value}
				onChange={onChange}
				entrySchema={selecting.typeSchema}
				jsonPath={jsonPath}
				getRenderer={getRenderer}
				defaultValue={selecting.defaultValue}
				metadata={metadata}
				nested
			/>
		</Field>
	);
});
