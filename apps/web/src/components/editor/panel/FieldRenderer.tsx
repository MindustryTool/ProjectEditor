import { Checkbox } from "#/components/ui/checkbox";
import { FormControl, FormField, FormLabel } from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { Fragment, type ReactNode } from "react";

export const FieldTypes = ["String", "Int", "Float", "Double", "Boolean", "HexColor"] as const;
export type FieldType = (typeof FieldTypes)[number];

export interface Field {
	name: string;
	type: FieldType;
	defaultValue?: any;
	hiddenIfDefault?: boolean;
}

interface FieldRendererProps {
	fields: Field[];
	values: Record<string, string>;
	updater: (field: string, value: any | undefined) => void;
}

export function FieldRenderer({ fields, values, updater }: FieldRendererProps) {
	return fields.map((field) => {
		const { name, type, defaultValue, hiddenIfDefault } = field;
		const renderer = fieldRenderers[type];

		if (renderer === undefined) {
			return (
				<span key={name} className="text-yellow-400">
					Unknown field type {type}
				</span>
			);
		}

		return (
			<Fragment key={name}>
				{renderer({
					name,
					value: values[name] || defaultValue || "",
					onChange: (v) => {
						if (hiddenIfDefault && v === defaultValue) {
							updater(name, Number.NaN);
						} else {
							updater(name, v);
						}
					},
				})}
			</Fragment>
		);
	});
}

const fieldRenderers: Record<FieldType, (value: { name: string; value: any; onChange: (v: any) => void }) => ReactNode> = {
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
				<Checkbox checked={value === true} onCheckedChange={(value) => onChange(value)} />
				<FormLabel>{name}</FormLabel>
			</FormControl>
		</FormField>
	),
	HexColor: ({ name, value, onChange }) => (
		<FormField>
			<FormLabel>{name}</FormLabel>
			<FormControl>
				<Input value={value} onChange={(v) => onChange(v.currentTarget.value)} type="color" />
			</FormControl>
		</FormField>
	),
};
