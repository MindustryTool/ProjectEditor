import { useTranslation } from "react-i18next";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { FormField, FormLabel, FormControl, FormDescription } from "~/components/ui/form";
import { Field, FieldContent, FieldLabel, FieldDescription } from "~/components/ui/field";
import { type ModHjsonData } from "@project/validation";
import { useState, useEffect, useRef } from "react";
import { useFileContentString } from "@project/state";
import { Panel } from "@/components/editor/Panel";
import { HJSON, type StructuredObject } from "@project/hjson";

function serializeValue(key: keyof ModHjsonData, value: unknown): string {
	if (key === "dependencies") {
		const deps = (value as string[])?.filter((d) => d.trim() !== "");
		return HJSON.stringify(deps);
	}
	return HJSON.stringify(value);
}

const TEXT_FIELDS: {
	name: keyof ModHjsonData;
	label:
		| "editor.modHjson.name"
		| "editor.modHjson.displayName"
		| "editor.modHjson.author"
		| "editor.modHjson.description"
		| "editor.modHjson.version"
		| "editor.modHjson.minGameVersion";
	description:
		| "editor.modHjson.nameDescription"
		| "editor.modHjson.displayNameDescription"
		| "editor.modHjson.authorDescription"
		| "editor.modHjson.descriptionDescription"
		| "editor.modHjson.versionDescription"
		| "editor.modHjson.minGameVersionDescription";
	placeholder?: string;
}[] = [
	{ name: "name", label: "editor.modHjson.name", description: "editor.modHjson.nameDescription", placeholder: "example-mod" },
	{
		name: "displayName",
		label: "editor.modHjson.displayName",
		description: "editor.modHjson.displayNameDescription",
		placeholder: "Example Mod",
	},
	{ name: "author", label: "editor.modHjson.author", description: "editor.modHjson.authorDescription", placeholder: "Author Name" },
	{
		name: "description",
		label: "editor.modHjson.description",
		description: "editor.modHjson.descriptionDescription",
		placeholder: "A brief description...",
	},
	{ name: "version", label: "editor.modHjson.version", description: "editor.modHjson.versionDescription", placeholder: "1.0.0" },
	{
		name: "minGameVersion",
		label: "editor.modHjson.minGameVersion",
		description: "editor.modHjson.minGameVersionDescription",
		placeholder: "158",
	},
];

export function ModHjsonPanel({ path }: { path: string }) {
	const { t } = useTranslation();
	const { data, write, isLoading } = useFileContentString(path);
	const [values, setValues] = useState<Partial<ModHjsonData>>({});
	const contentRef = useRef<string | null>(null);

	useEffect(() => {
		if (data === null || isLoading) return;
		contentRef.current = data;
		if (data === "") {
			setValues({});
			return;
		}
		try {
			const result = HJSON.parseStructured(data) as StructuredObject;
			setValues(result.valueOf() as ModHjsonData);
		} catch {
		}
	}, [data, isLoading]);

	function updateValue(key: keyof ModHjsonData, rawValue: unknown) {
		const value = key === "hidden" ? Boolean(rawValue) : rawValue;
		setValues((prev) => ({ ...prev, [key]: value }));

		const content = contentRef.current;
		if (content === null) {
			write(HJSON.stringify({ ...values, [key]: value }, null, 2));
			return;
		}

		try {
			const result = HJSON.parseStructured(content) as StructuredObject;
			const newValue = serializeValue(key, value);
			const newContent = result.patchField(content, key, newValue);
			contentRef.current = newContent;
			write(newContent);
		} catch (e) {
			console.error("Failed to patch HJSON:", e);
			// Fallback to full stringify if surgical update fails completely
			write(HJSON.stringify({ ...values, [key]: value }, null, 2));
		}
	}

	function handleDepChange(index: number, val: string) {
		const newDeps = [...(values.dependencies || [])];
		newDeps[index] = val;
		updateValue("dependencies", newDeps);
	}

	function handleDepAdd() {
		updateValue("dependencies", [...(values.dependencies || []), ""]);
	}

	function handleDepRemove(index: number) {
		const newDeps = values.dependencies?.filter((_, i) => i !== index);
		updateValue("dependencies", newDeps);
	}

	const depsDisplay = (values.dependencies?.length || 0) > 0 ? values.dependencies : [""];

	return (
		<Panel>
			<div className="flex flex-col gap-4">
				{TEXT_FIELDS.map((field) => {
					const value = values[field.name] ?? "";
					return (
						<FormField key={field.name}>
							<FormLabel>{t(field.label)}</FormLabel>
							<FormControl>
								{field.name === "description" ? (
									<Textarea
										value={value as string}
										onChange={(e) => updateValue(field.name, e.target.value)}
										placeholder={field.placeholder}
									/>
								) : (
									<Input
										value={value as string}
										onChange={(e) => updateValue(field.name, e.target.value)}
										placeholder={field.placeholder}
									/>
								)}
							</FormControl>
							<FormDescription>{t(field.description)}</FormDescription>
						</FormField>
					);
				})}

				<Field orientation="vertical">
					<FieldContent className="flex-row">
						<Checkbox checked={!!values.hidden} onCheckedChange={(checked) => updateValue("hidden", checked === true)} />
						<FieldLabel>{t("editor.modHjson.hidden")}</FieldLabel>
					</FieldContent>
					<FieldDescription>{t("editor.modHjson.hiddenDescription")}</FieldDescription>
				</Field>

				<FormField>
					<FormLabel>{t("editor.modHjson.dependencies")}</FormLabel>
					<FormDescription>{t("editor.modHjson.dependenciesDescription")}</FormDescription>
					<FormControl>
						<div className="flex flex-col gap-2">
							{depsDisplay?.map((dep, index) => (
								<div key={index} className="flex items-center gap-2">
									<Input
										value={dep}
										onChange={(e) => handleDepChange(index, e.target.value)}
										placeholder="mod-name"
										className="flex-1"
									/>
									<Button className="size-9" type="button" variant="outline" onClick={() => handleDepRemove(index)}>
										X
									</Button>
								</div>
							))}
							<Button type="button" variant="outline" size="sm" onClick={handleDepAdd}>
								Add
							</Button>
						</div>
					</FormControl>
				</FormField>
			</div>
		</Panel>
	);
}
