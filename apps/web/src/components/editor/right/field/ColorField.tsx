import { FormControl, FormField, FormLabel } from "#/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover";
import { ColorPicker, ColorPickerAlpha, ColorPickerFormat, ColorPickerHue, ColorPickerSelection } from "#/components/ui/color-picker";
import { HJSON } from "@project/hjson";
import React from "react";
import * as v from "valibot";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/FieldsRenderer";

export const ColorField = React.memo(function ColorField({ name, value, onChange, entrySchema, jsonPath, path }: SchemaRendererProps) {
	let hexValue = typeof value === "string" ? value : ((v.getDefault(entrySchema) ?? "333333") as string);

	hexValue = hexValue?.startsWith("#") ? hexValue : "#" + hexValue;

	return (
		<FormField>
			<FormLabel>
				<SchemaLabel name={name} entrySchema={entrySchema} />
			</FormLabel>
			<FormControl>
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
									onChange(jsonPath, (parent, key, original) =>
										parent.objectNode(key).patchField(original, key, HJSON.stringify(val)),
									)
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
			</FormControl>
			<SchemaDescription entrySchema={entrySchema} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</FormField>
	);
});
