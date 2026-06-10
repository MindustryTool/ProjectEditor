import { Field, FieldLabel } from "#/components/editor/right/field/Field";
import { SchemaDescription } from "#/components/editor/right/field/SchemaDescription";
import { SchemaLabel } from "#/components/editor/right/field/SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { detectSchemaType, getDefaults, getSchemaMetadata } from "@project/schema";
import React from "react";
import { useMemo } from "react";

export const UnionField = React.memo(function UnionField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	path,
	getRenderer,
}: SchemaRendererProps) {
	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

	if ("options" in entrySchema && Array.isArray(entrySchema.options)) {
		const options = entrySchema.options
			.map((option) => ({ schema: option, metadata: getSchemaMetadata(option) }))
			.filter(({ metadata }) => metadata && metadata.name)
			.map(({ schema, metadata }) => ({ schema, name: metadata!.name!, metadata: metadata! }));

		if (options.length === 0) {
			return (
				<Field jsonPath={jsonPath} metadata={metadata}>
					<FieldLabel>
						<SchemaLabel name={name} metadata={metadata} />
					</FieldLabel>
					<SchemaDescription metadata={metadata} />
					{name} has no options
				</Field>
			);
		}

		if (options.length === 1) {
			const { schema, metadata } = options[0]!;
			const { type, schema: typeSchema } = detectSchemaType(schema, value);
			const defaultValue = getDefaults(schema, value);

			const Renderer = getRenderer(type);

			if (!Renderer) {
				return <div>Renderer renderer not found for type {type}</div>;
			}

			return (
				<Field jsonPath={jsonPath} metadata={metadata}>
					<FieldLabel>
						<SchemaLabel name={name} metadata={metadata} />
					</FieldLabel>
					<SchemaDescription metadata={metadata} />
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

			const { schema: schema1, name: name1 } = option1;
			const { schema: schema2, name: name2 } = option2;

			const { type: type1, schema: typeSchema1 } = detectSchemaType(schema1, value);
			const { type: type2, schema: typeSchema2 } = detectSchemaType(schema2, value);

			const defaultValue1 = getDefaults(schema1, value);
			const defaultValue2 = getDefaults(schema2, value);

			const Renderer1 = getRenderer(type1);
			const Renderer2 = getRenderer(type2);

			if (!Renderer1 || !Renderer2) {
				return (
					<div>
						Renderer renderer not found for type {type1} or {type2}
					</div>
				);
			}

			return (
				<Field jsonPath={jsonPath} metadata={metadata}>
					<Tabs>
						<FieldLabel>
							<SchemaLabel name={name} metadata={metadata} />
						</FieldLabel>
						<SchemaDescription metadata={metadata} />
						<TabsList>
							<TabsTrigger value={name1}>{name1}</TabsTrigger>
							<TabsTrigger value={name2}>{name2}</TabsTrigger>
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
							/>
						</TabsContent>
					</Tabs>
				</Field>
			);
		}

		return null;
	}

	throw new Error("UnionField: options is required: " + JSON.stringify(entrySchema));
});
