import { Button } from "#/components/ui/button";
import { Checkbox } from "#/components/ui/checkbox";
import { ColorPicker, ColorPickerAlpha, ColorPickerFormat, ColorPickerHue, ColorPickerSelection } from "#/components/ui/color-picker";
import { FormControl, FormField, FormLabel } from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover";
import { useValidationStore } from "@project/state";
import { type Research } from "@project/validation";
import { Plus, X } from "lucide-react";
import { Fragment, type ReactNode } from "react";

export type FieldTypes = {
	String: string;
	Int: number;
	Float: number;
	Double: number;
	Boolean: boolean;
	HexColor: string;
	Research: Research;
};
export type FieldType = keyof FieldTypes;

export interface Field {
	name: string;
	type: FieldType;
	defaultValue?: any;
	hiddenIfDefault?: boolean;
}

interface FieldsRendererProps {
	path: string;
	fields: Field[];
	values: Record<string, string>;
	updater: (field: string, value: any | undefined) => void;
}

export function FieldsRenderer({ path, fields, values, updater }: FieldsRendererProps) {
	const issues = useValidationStore((state) => state.resultsByPath[path]);

	return fields.map((field) => {
		const { name, type, defaultValue, hiddenIfDefault } = field;
		const renderer = fieldRenderers[type] as FieldRenderer<any> | undefined;

		if (renderer === undefined) {
			return (
				<span key={name + type + path} className="text-yellow-400">
					Unknown field type {type}
				</span>
			);
		}

		const issue = issues?.filter((issue) => issue.field === name);

		return (
			<Fragment key={name + type + path}>
				{renderer({
					name,
					value: values[name] || defaultValue || "",
					onChange: (v) => {
						if (hiddenIfDefault === true && v === defaultValue) {
							updater(name, Number.NaN);
						} else {
							updater(name, v);
						}
					},
				})}
				{issue?.map((issue) => (
					<span key={issue.code} className="text-red-400">
						{issue.code}
					</span>
				)) || null}
			</Fragment>
		);
	});
}

type FieldRendererMap = {
	[K in keyof FieldTypes]: FieldRenderer<FieldTypes[K]>;
};

export type FieldRenderer<T> = (value: { name: string; value: T; onChange: (v: T) => void }) => ReactNode;

const fieldRenderers: FieldRendererMap = {
	String: ({ name, value, onChange }) => (
		<FormField>
			<FormLabel>{name}</FormLabel>
			<FormControl>
				<Input value={value} onChange={(v) => onChange(v.currentTarget.value)} />
			</FormControl>
		</FormField>
	),
	Int: ({ name, value, onChange }) => (
		<FormField>
			<FormLabel>{name}</FormLabel>
			<FormControl>
				<Input value={value} onChange={(v) => onChange(v.currentTarget.valueAsNumber)} type="number" />
			</FormControl>
		</FormField>
	),
	Float: ({ name, value, onChange }) => (
		<FormField>
			<FormLabel>{name}</FormLabel>
			<FormControl>
				<Input value={value} onChange={(v) => onChange(v.currentTarget.valueAsNumber)} type="number" />
			</FormControl>
		</FormField>
	),
	Double: ({ name, value, onChange }) => (
		<FormField>
			<FormLabel>{name}</FormLabel>
			<FormControl>
				<Input value={value} onChange={(v) => onChange(v.currentTarget.valueAsNumber)} type="number" />
			</FormControl>
		</FormField>
	),
	Boolean: ({ name, value, onChange }) => (
		<FormField>
			<FormControl className="flex-row flex gap-1">
				<Checkbox checked={value === true} onCheckedChange={(value) => onChange(!!value)} />
				<FormLabel>{name}</FormLabel>
			</FormControl>
		</FormField>
	),
	HexColor: ({ name, value, onChange }) => (
		<FormField>
			<FormLabel>{name}</FormLabel>
			<FormControl>
				<div className="flex items-center gap-2">
					<Popover>
						<PopoverTrigger className="flex gap-1 items-end">
							<div
								className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent p-0"
								style={{ backgroundColor: value || "#000000" }}
							/>
							<span className="text-sm">{value}</span>
						</PopoverTrigger>
						<PopoverContent className="w-64 p-3" side="bottom" align="start">
							<ColorPicker value={value || "#000000"} onChange={(val) => onChange(val)}>
								<ColorPickerSelection className="h-40 rounded-lg" />
								<ColorPickerHue />
								<ColorPickerAlpha />
								<ColorPickerFormat />
							</ColorPicker>
						</PopoverContent>
					</Popover>
				</div>
			</FormControl>
		</FormField>
	),
	Research: ({ name, value, onChange }) => {
		const parent = (!value ? "" : typeof value === "string" ? value : value.parent) || "";
		const requirements = (!value ? [] : typeof value === "string" ? [] : value.requirements) || [];

		function handleChange(parent: string, requirements: string[]) {
			if (!parent && requirements.length === 0) {
				onChange(undefined);
			} else if (requirements.length > 0) {
				onChange({ parent, requirements });
			} else {
				onChange(parent);
			}
		}

		return (
			<>
				<FormField>
					<FormLabel>{name}</FormLabel>
					<FormControl>
						<Input value={parent} onChange={(v) => handleChange(v.currentTarget.value, requirements)} />
					</FormControl>
				</FormField>
				{requirements.map((requirement, index) => (
					<FormField key={requirement}>
						<FormControl className="flex gap-1">
							<Input
								value={requirement}
								onChange={(v) =>
									handleChange(
										parent,
										requirements.map((r, i) => (i === index ? v.currentTarget.value : r)),
									)
								}
							/>
							<Button
								variant="outline"
								size="icon"
								onClick={() =>
									handleChange(
										parent,
										requirements.filter((_, i) => i !== index),
									)
								}
							>
								<X />
							</Button>
						</FormControl>
					</FormField>
				))}
				<Button className="w-full" variant="outline" onClick={() => handleChange(parent, [...requirements, ""])}>
					<Plus />
				</Button>
			</>
		);
	},
};
