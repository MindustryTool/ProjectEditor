import { FieldControl, Field, FieldLabel } from "#/components/editor/right/field/Field";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover";
import { ColorPicker, ColorPickerAlpha, ColorPickerFormat, ColorPickerHue, ColorPickerSelection } from "#/components/ui/color-picker";
import React, { useMemo } from "react";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { getSchemaMetadata } from "@project/schema";

export const ColorField = React.memo(function ColorField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	path,
	defaultValue,
}: SchemaRendererProps) {
	let hexValue = typeof value === "string" ? value : (String(defaultValue ?? "333333") as string);
	hexValue = useMemo(() => (hexValue?.startsWith("#") ? hexValue : "#" + hexValue), [hexValue]);

	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

	if (metadata!.type !== "color") {
		throw new Error("ColorField type must be color type: " + JSON.stringify(metadata) + " value: " + JSON.stringify(value));
	}

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<FieldLabel>
				<SchemaLabel name={name} metadata={metadata} />
			</FieldLabel>
			<FieldControl>
				<div className="flex items-center gap-2">
					<Popover>
						<PopoverTrigger
							className="h-16 w-full relative cursor-pointer rounded border border-border bg-transparent p-0"
							style={{ backgroundColor: hexValue }}
						>
							<span className="text-sm absolute left-1.5 bottom-1.5">{hexValue}</span>
						</PopoverTrigger>
						<PopoverContent className="w-64 p-3" side="bottom" align="start">
							<ColorPicker
								value={hexValue}
								onChange={(val) =>
									onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, val))
								}
							>
								<ColorPickerSelection className="h-40 rounded-lg" />
								<ColorPickerHue />
								<ColorPickerAlpha />
								<ColorPickerFormat />
							</ColorPicker>
						</PopoverContent>
					</Popover>
				</div>
			</FieldControl>
			<SchemaDescription metadata={metadata} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</Field>
	);
});
