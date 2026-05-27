import { useTranslation } from "react-i18next";
import * as v from "valibot";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { FormField, FormLabel, FormControl, FormDescription, FormMessage } from "~/components/ui/form";
import { Field, FieldContent, FieldLabel, FieldDescription } from "~/components/ui/field";
import { ModHjsonSchema, ModNameSchema, defaultModHjson, type ModHjsonData } from "@project/validation";
import { useState, useEffect, useRef } from "react";
import { useFileContentString } from "@project/state";
import { Panel } from "@/components/editor/Panel";

function replaceLine(lines: string[], key: string, value: string): string[] {
	const prefix = `${key}:`;
	const index = lines.findIndex((line) => line.startsWith(prefix));
	const newLine = `${key}: ${value}`;
	if (index !== -1) {
		const result = [...lines];
		result[index] = newLine;
		return result;
	}

	if (lines.at(-1)?.trim() === "") {
		lines.pop();
	}

	return [...lines, newLine];
}

function parseModHjsonContent(content: string): { lines: string[]; values: ModHjsonData } {
	const lines = content.split("\n");
	const values = { ...defaultModHjson };
	for (const line of lines) {
		const match = line.match(/^(\w+):\s*(.*)$/);
		if (!match) continue;
		const key = match[1] as keyof ModHjsonData;
		const raw = match[2];
		if (raw === undefined) continue;
		if (key === "hidden") {
			values[key] = raw === "true";
		} else if (key === "dependencies") {
			const inner = raw.startsWith("[") && raw.endsWith("]") ? raw.slice(1, -1) : raw;
			values[key] = inner
				? inner
						.split(",")
						.map((s) => s.trim())
						.filter(Boolean)
				: [];
		} else {
			(values as Record<string, unknown>)[key] = raw;
		}
	}
	return { lines, values };
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
	const [values, setValues] = useState<ModHjsonData>(defaultModHjson);
	const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ModHjsonData, string>>>({});
	const linesRef = useRef<string[]>([]);

	if (isLoading) {
		throw new Promise((resolve) => setTimeout(resolve, 100));
	}

	useEffect(() => {
		if (data === null || isLoading) return;

		if (data === "") {
			linesRef.current = [];
			setValues(defaultModHjson);
			setFieldErrors({});
			return;
		}

		const { lines, values: parsed } = parseModHjsonContent(data);
		linesRef.current = lines;
		setValues(parsed);
		setFieldErrors({});
	}, [data, isLoading]);

	function validateField(key: keyof ModHjsonData, value: unknown): string | undefined {
		if (key === "dependencies") {
			const result = v.safeParse(v.array(ModNameSchema), value);
			if (!result.success) return result.issues[0]?.message ?? "Invalid";
			return undefined;
		}
		const result = v.safeParse(v.pick(ModHjsonSchema, [key]), { [key]: value } as ModHjsonData);
		if (!result.success) return result.issues[0]?.message ?? "Invalid";
		return undefined;
	}

	function updateValue(key: keyof ModHjsonData, rawValue: unknown) {
		const value = key === "hidden" ? Boolean(rawValue) : rawValue;

		const error = validateField(key, value);
		setFieldErrors((prev) => {
			if (error) return { ...prev, [key]: error };
			const next = { ...prev };
			delete next[key];
			return next;
		});

		setValues((prev) => ({ ...prev, [key]: value }));

		if (error) return;

		let lineValue: string;
		if (key === "dependencies") {
			const deps = (value as string[]).filter((d) => d.trim() !== "");
			lineValue = deps.length > 0 ? `[${deps.join(",")}]` : "[]";
		} else if (key === "hidden") {
			lineValue = String(value);
		} else {
			lineValue = String(value ?? "");
		}

		linesRef.current = replaceLine(linesRef.current, key, lineValue);
		write(linesRef.current.join("\n"));
	}

	function handleDepChange(index: number, val: string) {
		const newDeps = [...values.dependencies];
		newDeps[index] = val;
		updateValue("dependencies", newDeps);
	}

	function handleDepAdd() {
		updateValue("dependencies", [...values.dependencies, ""]);
	}

	function handleDepRemove(index: number) {
		const newDeps = values.dependencies.filter((_, i) => i !== index);
		updateValue("dependencies", newDeps);
	}

	const depsDisplay = values.dependencies.length > 0 ? values.dependencies : [""];
	const depError = fieldErrors.dependencies;

	return (
		<Panel>
			<div className="flex flex-col gap-4">
				{TEXT_FIELDS.map((field) => {
					const error = fieldErrors[field.name];
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
										aria-invalid={!!error}
									/>
								) : (
									<Input
										value={value as string}
										onChange={(e) => updateValue(field.name, e.target.value)}
										placeholder={field.placeholder}
										aria-invalid={!!error}
									/>
								)}
							</FormControl>
							<FormDescription>{t(field.description)}</FormDescription>
							{error && <FormMessage>{error}</FormMessage>}
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
							{depsDisplay.map((dep, index) => (
								<div key={index} className="flex items-center gap-2">
									<Input
										value={dep}
										onChange={(e) => handleDepChange(index, e.target.value)}
										placeholder="mod-name"
										aria-invalid={!!depError}
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
					{depError && <FormMessage>{depError}</FormMessage>}
				</FormField>
			</div>
		</Panel>
	);
}
