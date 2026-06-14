import { Button } from "#/components/ui/button";
import { FieldControl, Field } from "#/components/editor/right/field/Field";
import { detectSchemaType, getArrayItemSchema, getDefaults, getSchemaMetadata, unwrapSchema, type AnySchema } from "@project/schema";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog";

import { Plus, Trash2 } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { EMPTY_ARRAY } from "#/lib/utils";
import { ErrorBoundary } from "#/components/ui/error-boundary";

export const ArrayField = React.memo(function ArrayField({
	path,
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	getRenderer,
	defaultValue,
	metadata,
}: SchemaRendererProps) {
	const arrayValue: unknown[] = Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : EMPTY_ARRAY;

	const handleAdd = useCallback(() => {
		const nextItemSchema = getArrayItemSchema(entrySchema, arrayValue.length);

		let defaultValue: unknown = getDefaults(nextItemSchema, arrayValue?.[arrayValue.length]);

		if (defaultValue === undefined) {
			const typeDefault = unwrapSchema(nextItemSchema);
			if (typeDefault.type === "object") {
				defaultValue = {};
			} else if (typeDefault.type === "array") {
				defaultValue = [];
			} else {
				defaultValue = typeDefault.type;
			}
		}

		onChange(jsonPath, (parent, original, key) => {
			if (parent.get(key).isMissing()) {
				return parent.patchValue(original, key, [defaultValue]);
			}

			return parent.get(key).arrayNode().insertElement(original, arrayValue.length, defaultValue);
		});
	}, [arrayValue, entrySchema, onChange, jsonPath]);

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<SchemaLabel name={name} metadata={metadata} />
			<SchemaDescription metadata={metadata} />
			<FieldControl>
				<div className="flex flex-col gap-2 border p-2 rounded-md border-dashed bg-muted/40">
					{arrayValue.map((el, index) => (
						<ArrayElement
							name={name}
							key={jsonPath + index}
							index={index}
							value={el}
							itemSchema={getArrayItemSchema(entrySchema, index)}
							onChange={onChange}
							jsonPath={jsonPath}
							path={path}
							getRenderer={getRenderer}
						/>
					))}
					<Button type="button" size="sm" onClick={handleAdd}>
						<Plus /> Add
					</Button>
				</div>
			</FieldControl>
		</Field>
	);
});

function ArrayElement({
	index,
	value,
	itemSchema,
	onChange,
	jsonPath,
	path,
	getRenderer,
}: {
	name: string;
	path: string;
	index: number;
	value: unknown;
	itemSchema: AnySchema;
	onChange: Parameters<typeof ArrayField>[0]["onChange"];
	jsonPath: string;
	getRenderer: Parameters<typeof ArrayField>[0]["getRenderer"];
}) {
	const { t } = useTranslation();
	const entryJsonPath = jsonPath ? `${jsonPath}[${index}]` : `[${index}]`;
	const [removeOpen, setRemoveOpen] = useState(false);

	const handleRemove = useCallback(
		() =>
			onChange(jsonPath, (parent, original, key) => {
				if (parent.get(key).arrayNode().elements().length <= 1) {
					return parent.patchRemove(original, key);
				}

                return parent.get(key).patchRemove(original, index);
			}),
		[onChange, jsonPath, index],
	);

	const metadata = useMemo(() => getSchemaMetadata(itemSchema), [itemSchema]);
	const { type, schema } = useMemo(() => detectSchemaType(itemSchema, value), [itemSchema, value]);
	const defaultValue = getDefaults(schema, value);

	const Renderer = getRenderer(type);

	return (
		<div className="flex flex-col gap-2 relative border p-2 rounded-md bg-muted">
			<ErrorBoundary>
				{Renderer ? (
					<Renderer
						name={`${index + 1}`}
						path={path}
						value={value}
						onChange={onChange}
						entrySchema={schema}
						jsonPath={entryJsonPath}
						getRenderer={getRenderer}
						defaultValue={defaultValue}
						metadata={metadata}
						nested
					/>
				) : (
					<span className="text-red-400 text-sm">Unknown field type '{type}'</span>
				)}
			</ErrorBoundary>
			<AlertDialog open={removeOpen} onOpenChange={setRemoveOpen}>
				<Button className="w-full" variant="destructive" onClick={() => setRemoveOpen(true)}>
					<Trash2 />
				</Button>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t("editor.array-field.remove-title", "Remove item?")}</AlertDialogTitle>
						<AlertDialogDescription>
							{t("editor.array-field.remove-description", "Are you sure you want to remove item #{{index}}?", { index: index + 1 })}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>{t("editor.array-field.remove-cancel", "Cancel")}</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={handleRemove}>
							{t("editor.array-field.remove-confirm", "Remove")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
