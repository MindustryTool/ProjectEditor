import { useForm } from "@tanstack/react-form";
import * as v from "valibot";
import { useTranslation } from "react-i18next";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { FormField, FormLabel, FormControl, FormDescription, FormMessage } from "~/components/ui/form";
import { Field, FieldContent, FieldLabel, FieldDescription } from "~/components/ui/field";
import { ModHjsonSchema, ModNameSchema, defaultModHjson, type ModHjsonData } from "@project/validation";
import { useEffect } from "react";

interface ModHjsonEditorProps {
	value: string | null;
	onChange: (value: string) => void;
}

function parseModHjson(data: string): ModHjsonData {
	let name: string = "";
	let displayName: string = "";
	let author: string = "";
	let description: string = "";
	let version: string = "";
	let minGameVersion: string = "";
	let dependencies: string[] = [];
	let hidden: boolean = false;

	const lines = data.split("\n");
	for (const line of lines) {
		try {
			if (line.startsWith("name:")) {
				name = line.split(":")[1]!.trim();
			} else if (line.startsWith("displayName:")) {
				displayName = line.split(":")[1]!.trim();
			} else if (line.startsWith("author:")) {
				author = line.split(":")[1]!.trim();
			} else if (line.startsWith("description:")) {
				description = line.split(":")[1]!.trim();
			} else if (line.startsWith("version:")) {
				version = line.split(":")[1]!.trim();
			} else if (line.startsWith("minGameVersion:")) {
				minGameVersion = line.split(":")[1]!.trim();
			} else if (line.startsWith("dependencies:")) {
				dependencies = line.split(":")[1]!.trim().split(",");
			} else if (line.startsWith("hidden:")) {
				hidden = line.split(":")[1]!.trim() === "true";
			}
		} catch (e) {
			console.error(e);
		}
	}

	return {
		name,
		displayName,
		author,
		description,
		version,
		minGameVersion,
		dependencies,
		hidden,
	};
}

function toHjson(data: ModHjsonData): string {
	let result = "";
	result += `name: ${data.name}\n`;
	result += `displayName: ${data.displayName}\n`;
	result += `author: ${data.author}\n`;
	result += `description: ${data.description}\n`;
	result += `version: ${data.version}\n`;
	result += `minGameVersion: ${data.minGameVersion}\n`;
	if (data.dependencies.length > 0) {
		result += `dependencies: ${data.dependencies.join(",")}\n`;
	}
	result += `hidden: ${data.hidden}\n`;
	return result;
}

export function ModHjsonPanel({ value, onChange }: ModHjsonEditorProps) {
	const { t } = useTranslation();

	const form = useForm({
		defaultValues: { ...defaultModHjson },
		onSubmit: async ({ value }) => {
			const result = v.safeParse(ModHjsonSchema, value);
			if (!result.success) {
				return;
			}
			onChange(toHjson(result.output));
		},
	});

	useEffect(() => {
		if (value === null) {
			return;
		}

		if (value === "") {
			form.reset(defaultModHjson);
			onChange(toHjson(defaultModHjson));
			return;
		}

		form.reset(parseModHjson(value));
	}, [value]);

	const fields: {
		name: keyof ModHjsonData;
		label: string;
		description: string;
		placeholder?: string;
	}[] = [
		{
			name: "name",
			label: t("editor.modHjson.name"),
			description: t("editor.modHjson.nameDescription"),
			placeholder: "example-mod",
		},
		{
			name: "displayName",
			label: t("editor.modHjson.displayName"),
			description: t("editor.modHjson.displayNameDescription"),
			placeholder: "Example Mod",
		},
		{
			name: "author",
			label: t("editor.modHjson.author"),
			description: t("editor.modHjson.authorDescription"),
			placeholder: "Author Name",
		},
		{
			name: "description",
			label: t("editor.modHjson.description"),
			description: t("editor.modHjson.descriptionDescription"),
			placeholder: "A brief description...",
		},
		{
			name: "version",
			label: t("editor.modHjson.version"),
			description: t("editor.modHjson.versionDescription"),
			placeholder: "1.0.0",
		},
		{
			name: "minGameVersion",
			label: t("editor.modHjson.minGameVersion"),
			description: t("editor.modHjson.minGameVersionDescription"),
			placeholder: "146",
		},
	];

	return (
		<div className="flex h-full flex-col overflow-auto px-4 py-4">
			<form
				className="flex flex-col gap-4"
				onChange={() => {
					onChange(toHjson(form.state.values));
				}}
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				{fields.map((field) => (
					<form.Field
						key={field.name}
						name={field.name}
						validators={{
							onChange: ({ value }) => {
								const result = v.safeParse(v.pick(ModHjsonSchema, [field.name]), { [field.name]: value } as ModHjsonData);
								if (!result.success) {
									const issue = result.issues[0];
									return issue ? issue.message : "Invalid";
								}
								return undefined;
							},
						}}
					>
						{(fieldApi) => (
							<FormField>
								<FormLabel>{field.label}</FormLabel>
								<FormControl>
									{field.name === "description" ? (
										<Textarea
											name={fieldApi.name}
											value={(fieldApi.state.value as string) ?? ""}
											onChange={(e) => fieldApi.handleChange(e.target.value as any)}
											onBlur={fieldApi.handleBlur}
											placeholder={field.placeholder}
											aria-invalid={fieldApi.state.meta.errors.length > 0}
										/>
									) : (
										<Input
											name={fieldApi.name}
											value={(fieldApi.state.value as string) ?? ""}
											onChange={(e) => fieldApi.handleChange(e.target.value as any)}
											onBlur={fieldApi.handleBlur}
											placeholder={field.placeholder}
											aria-invalid={fieldApi.state.meta.errors.length > 0}
										/>
									)}
								</FormControl>
								<FormDescription>{field.description}</FormDescription>
								{fieldApi.state.meta.errors.length > 0 && <FormMessage>{fieldApi.state.meta.errors.join(", ")}</FormMessage>}
							</FormField>
						)}
					</form.Field>
				))}

				<form.Field name="hidden">
					{(fieldApi) => (
						<Field orientation="vertical">
							<FieldContent className="flex-row">
								<Checkbox
									checked={fieldApi.state.value ?? false}
									onCheckedChange={(checked) => fieldApi.handleChange(checked === true)}
									onBlur={fieldApi.handleBlur}
								/>
								<FieldLabel>{t("editor.modHjson.hidden")}</FieldLabel>
							</FieldContent>
							<FieldDescription>{t("editor.modHjson.hiddenDescription")}</FieldDescription>
						</Field>
					)}
				</form.Field>

				<form.Field
					name="dependencies"
					validators={{
						onChange: ({ value }) => {
							const result = v.safeParse(v.array(ModNameSchema), value);
							if (!result.success) {
								return result.issues[0]?.message ?? "Invalid";
							}
							return undefined;
						},
					}}
				>
					{(fieldApi) => {
						const deps = (Array.isArray(fieldApi.state.value) ? fieldApi.state.value : [""]) as string[];

						const updateDep = (index: number, val: string) => {
							const newDeps = [...deps];
							newDeps[index] = val;
							fieldApi.handleChange(newDeps as any);
						};

						const addDep = () => {
							fieldApi.handleChange([...deps, ""] as any);
						};

						const removeDep = (index: number) => {
							fieldApi.handleChange(deps.filter((_, i) => i !== index) as any);
							onChange(toHjson(form.state.values));
						};

						return (
							<FormField>
								<FormLabel>{t("editor.modHjson.dependencies")}</FormLabel>
								<FormDescription>{t("editor.modHjson.dependenciesDescription")}</FormDescription>
								<FormControl>
									<div className="flex flex-col gap-2">
										{deps.map((dep, index) => (
											<div key={index} className="flex items-center gap-2">
												<Input
													value={dep}
													onChange={(e) => updateDep(index, e.target.value)}
													placeholder="mod-name"
													aria-invalid={index < (fieldApi.state.meta.errors.length ? (fieldApi.state.value?.length ?? 0) : 0)}
													className="flex-1"
												/>
												<Button className="size-9" type="button" variant="outline" onClick={() => removeDep(index)}>
													X
												</Button>
											</div>
										))}
										<Button type="button" variant="outline" size="sm" onClick={addDep}>
											Add
										</Button>
									</div>
								</FormControl>
								{fieldApi.state.meta.errors.length > 0 && <FormMessage>{fieldApi.state.meta.errors.join(", ")}</FormMessage>}
							</FormField>
						);
					}}
				</form.Field>
			</form>
		</div>
	);
}
