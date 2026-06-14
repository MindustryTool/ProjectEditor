import { FieldControl, Field } from "#/components/editor/right/field/Field";
import React from "react";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import * as v from "valibot";
import { detectSchemaType, getDefaults, getSchemaMetadata } from "@project/schema";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";

export const RecordField = React.memo(function RecordField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	path,
	metadata,
	getRenderer,
}: SchemaRendererProps) {
	const recordValue = typeof value === "object" ? (value ?? {}) : {};
	const entries = Object.entries(recordValue);

	if (!v.isOfType("record", entrySchema)) {
		throw new Error("RecordField: Record schema is not supported");
	}

	const { type: keyType } = detectSchemaType(entrySchema.key, "");

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<SchemaLabel name={name} metadata={metadata} />
			<FieldControl>
				{entries.map(([key, value]) => {
					const { type: valueType, schema: valueSchema } = detectSchemaType(entrySchema.value, value);
					const metadata = getSchemaMetadata(valueSchema);
					const defaultValue = getDefaults(valueSchema, value);

					const KeyRenderer = getRenderer(keyType);
					const ValueRenderer = getRenderer(valueType);

					if (!KeyRenderer) {
						return <span>No key renderer for type {keyType}</span>;
					}

					if (!ValueRenderer) {
						return <span>No value renderer for type {valueType}</span>;
					}

					return (
						<div key={key}>
							{key}:
							<ValueRenderer
								entrySchema={valueSchema}
								value={value}
								name={key}
								path={path}
								onChange={onChange}
								defaultValue={defaultValue}
								jsonPath={jsonPath ? `${jsonPath}.${key}` : key}
								metadata={metadata}
								getRenderer={getRenderer}
							/>
						</div>
					);
				})}
				<Dialog>
					<DialogTrigger asChild>
						<Button>Add</Button>
					</DialogTrigger>
					<DialogContent>
						<VisuallyHidden.Root>
							<DialogTitle />
							<DialogDescription />
						</VisuallyHidden.Root>
					</DialogContent>
				</Dialog>
			</FieldControl>
			<SchemaDescription metadata={metadata} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</Field>
	);
});
