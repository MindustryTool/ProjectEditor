import { AssetImage } from "#/components/editor/AssetImage";
import { ImageFilePreview } from "#/components/editor/center/ImageFilePreview";
import { Button } from "#/components/ui/button";
import { Checkbox } from "#/components/ui/checkbox";
import { ColorPicker, ColorPickerAlpha, ColorPickerFormat, ColorPickerHue, ColorPickerSelection } from "#/components/ui/color-picker";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { ErrorBoundary } from "#/components/ui/error-boundary";
import { FormControl, FormField, FormLabel } from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { useItems } from "#/hooks/use-items";
import { useValidationStore } from "@project/state";
import { type Research } from "@project/validation";
import { Plus, X } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import { type ReactNode } from "react";

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
		const Renderer = fieldRenderers[type] as FieldRenderer<any> | undefined;

		if (Renderer === undefined) {
			return (
				<span key={name + type + path} className="text-yellow-400">
					Unknown field type {type}
				</span>
			);
		}

		const issue = issues?.filter((issue) => issue.field === name);

		return (
			<ErrorBoundary key={name + type + path}>
				<Renderer
					name={name}
					value={values[name] || defaultValue || ""}
					onChange={(v) => {
						if (hiddenIfDefault === true && v === defaultValue) {
							updater(name, Number.NaN);
						} else {
							updater(name, v);
						}
					}}
				/>
				{issue?.map((issue) => (
					<span key={issue.code} className="text-red-400">
						{issue.code}
					</span>
				)) || null}
			</ErrorBoundary>
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
						<PopoverTrigger
							className="h-16 w-full relative cursor-pointer rounded border border-border bg-transparent p-0"
							style={{ backgroundColor: value || "#000000" }}
						>
							<span className="text-sm absolute left-1 bottom-1">{value}</span>
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
		const items = useItems({ project: true, base: true });

		const parent = (!value ? "" : typeof value === "string" ? value : value.parent) || "";
		const requirements = (!value ? [] : typeof value === "string" ? [] : value.requirements) || [];

		const addedReq = requirements.map((requirement) => requirement.split("/")[0]!);

		function handleChange(parent: string, requirements: string[]) {
			if (!parent && requirements.length === 0) {
				onChange(undefined);
			} else if (requirements.length > 0) {
				onChange({ parent, requirements });
			} else {
				onChange(parent);
			}
		}

		function handleAddNewReq() {
			const notAdded = items.find((item) => {
				for (const requirement of requirements) {
					if (requirement.startsWith(item.name + "/")) {
						return false;
					}
				}
				return true;
			});

			handleChange(parent, [...requirements, notAdded?.name + "/" + 10]);
		}

		function handleRemoveReq(index: number) {
			handleChange(
				parent,
				requirements.filter((_, i) => i !== index),
			);
		}

		function handleUpdateReq(index: number, item: string, number: number) {
			handleChange(
				parent,
				requirements.map((r, i) => (i === index ? item + "/" + number : r)),
			);
		}

		return (
			<>
				<FormField>
					<FormLabel>{name}</FormLabel>
					<FormControl>
						<Input value={parent} onChange={(v) => handleChange(v.currentTarget.value, requirements)} />
					</FormControl>
				</FormField>
				{requirements.map((requirement, index) => {
					const parts = requirement.split("/");
					const item = parts[0]!;
					let number = Number(parts[1]);

					const selectedItem = items.find((i) => i.name === item);

					return (
						<FormField key={index}>
							<FormControl className="flex gap-1">
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="outline" size="icon">
											{selectedItem ? (
												selectedItem.type === "project" ? (
													<ImageFilePreview path={selectedItem.path} showSize={false} />
												) : (
													<AssetImage type="items" name={selectedItem.name} />
												)
											) : (
												item
											)}
										</Button>
									</DialogTrigger>
									<DialogContent className="w-sm" showCloseButton={false}>
										<VisuallyHidden.Root>
											<DialogTitle />
											<DialogDescription />
										</VisuallyHidden.Root>
										<ToggleGroup
											className="grid w-full grid-cols-[repeat(auto-fill,minmax(32px,1fr))] gap-1"
											type="single"
											value={item}
											onValueChange={(v) => (v ? handleUpdateReq(index, v, number) : handleRemoveReq(index))}
										>
											{items
												.filter((i) => !addedReq.includes(i.name))
												.map((item) => (
													<ToggleGroupItem key={item.name} value={item.name}>
														{item.type === "project" ? (
															<ImageFilePreview path={item.path} showSize={false} />
														) : (
															<AssetImage type="items" name={item.name} />
														)}
													</ToggleGroupItem>
												))}
										</ToggleGroup>
									</DialogContent>
								</Dialog>
								<Input
									type="number"
									value={number}
									onChange={(v) => handleUpdateReq(index, item, Number(v.currentTarget.valueAsNumber))}
								/>
								<Button className="text-destructive" variant="outline" size="icon" onClick={() => handleRemoveReq(index)}>
									<X />
								</Button>
							</FormControl>
						</FormField>
					);
				})}
				<Button className="w-full" variant="outline" onClick={handleAddNewReq}>
					<Plus />
				</Button>
			</>
		);
	},
};
