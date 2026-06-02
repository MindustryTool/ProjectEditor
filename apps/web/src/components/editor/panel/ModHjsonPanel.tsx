import { useTranslation } from "react-i18next";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { FormField, FormLabel, FormControl, FormDescription, FormMessage } from "~/components/ui/form";
import { Field, FieldContent, FieldLabel, FieldDescription } from "~/components/ui/field";
import { type ModHjsonData } from "@project/schema";
import { useState, useEffect, useRef, useMemo } from "react";
import { useFileString, useValidationStore } from "@project/state";
import { Panel } from "@/components/editor/Panel";
import { HJSON, HjsonObjectNode } from "@project/hjson";
import { cn, EMPTY_ARRAY } from "#/lib/utils";

function serializeValue(key: keyof ModHjsonData, value: unknown): string {
	if (key === "dependencies") {
		const deps = (value as string[])?.filter((d) => d.trim() !== "");
		return HJSON.stringify(deps);
	}

	return HJSON.stringify(value);
}

type TextFieldRowProps = {
	label: string;
	description: string;
	placeholder?: string;
	value: string;
	issues: string[];
	onChange: (value: string) => void;
	multiline?: boolean;
};

function TextFieldRow({ label, description, placeholder, value, issues, onChange, multiline = false }: TextFieldRowProps) {
	const hasIssue = issues.length > 0;
	const className = cn({
		"border-destructive": hasIssue,
	});

	return (
		<FormField>
			<FormLabel>{label}</FormLabel>
			<FormControl>
				{multiline ? (
					<Textarea className={className} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
				) : (
					<Input className={className} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
				)}
			</FormControl>
			<FormDescription>{description}</FormDescription>
			<FormMessage>{issues.join(", ")}</FormMessage>
		</FormField>
	);
}

type HiddenFieldRowProps = {
	label: string;
	description: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
};

function HiddenFieldRow({ label, description, checked, onCheckedChange }: HiddenFieldRowProps) {
	return (
		<Field orientation="vertical">
			<FieldContent className="flex-row">
				<Checkbox checked={checked} onCheckedChange={(value) => onCheckedChange(value === true)} />
				<FieldLabel>{label}</FieldLabel>
			</FieldContent>
			<FieldDescription>{description}</FieldDescription>
		</Field>
	);
}

type DependenciesFieldRowProps = {
	label: string;
	description: string;
	dependencies: string[];
	onChange: (index: number, value: string) => void;
	onAdd: () => void;
	onRemove: (index: number) => void;
};

function DependenciesFieldRow({ label, description, dependencies, onChange, onAdd, onRemove }: DependenciesFieldRowProps) {
	return (
		<FormField>
			<FormLabel>{label}</FormLabel>
			<FormDescription>{description}</FormDescription>
			<FormControl>
				<div className="flex flex-col gap-2">
					{dependencies.map((dep, index) => (
						<div key={index} className="flex items-center gap-2">
							<Input value={dep} onChange={(e) => onChange(index, e.target.value)} placeholder="mod-name" className="flex-1" />
							<Button className="size-9" type="button" variant="outline" onClick={() => onRemove(index)}>
								X
							</Button>
						</div>
					))}
					<Button type="button" variant="outline" size="sm" onClick={onAdd}>
						Add
					</Button>
				</div>
			</FormControl>
		</FormField>
	);
}

export function ModHjsonPanel({ path }: { path: string }) {
	const { t } = useTranslation();
	const { data, write, isLoading } = useFileString(path);
	const [values, setValues] = useState<Partial<ModHjsonData>>({});
	const contentRef = useRef<string | null>(null);
	const issues = useValidationStore((s) => s.results.resultsByPath[path] ?? EMPTY_ARRAY);

	useEffect(() => {
		if (data === null || isLoading) return;
		contentRef.current = data;
		if (data === "") {
			setValues({});
			return;
		}
		try {
			const result = HJSON.parseStructured(data);
			setValues(result.valueOf() as ModHjsonData);
		} catch {}
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
			const result = HJSON.parseStructured(content);
			const newValue = serializeValue(key, value);
			if (result instanceof HjsonObjectNode) {
				const newContent = result.patchField(content, key, newValue);
				contentRef.current = newContent;
				write(newContent);
			} else {
				write(HJSON.stringify({ ...values, [key]: value }, null, 2));
			}
		} catch (e) {
			console.error("Failed to patch HJSON:", e);
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

	const depsDisplay = useMemo(() => ((values.dependencies?.length || 0) > 0 ? values.dependencies : []) || [], [values.dependencies]);

	return (
		<Panel>
			<div className="flex flex-col gap-4">
				<TextFieldRow
					label={t("editor.mod-hjson.name")}
					description={t("editor.mod-hjson.name-description")}
					placeholder="example-mod"
					value={String(values.name ?? "")}
					issues={issues.filter((issue) => issue.field === "name").map((issue) => issue.messageKey)}
					onChange={(value) => updateValue("name", value)}
				/>

				<TextFieldRow
					label={t("editor.mod-hjson.display-name")}
					description={t("editor.mod-hjson.display-name-description")}
					placeholder="Example Mod"
					value={String(values.displayName ?? "")}
					issues={issues.filter((issue) => issue.field === "displayName").map((issue) => issue.messageKey)}
					onChange={(value) => updateValue("displayName", value)}
				/>

				<TextFieldRow
					label={t("editor.mod-hjson.author")}
					description={t("editor.mod-hjson.author-description")}
					placeholder="Author Name"
					value={String(values.author ?? "")}
					issues={issues.filter((issue) => issue.field === "author").map((issue) => issue.messageKey)}
					onChange={(value) => updateValue("author", value)}
				/>

				<TextFieldRow
					label={t("editor.mod-hjson.description")}
					description={t("editor.mod-hjson.description-description")}
					placeholder="A brief description..."
					value={String(values.description ?? "")}
					issues={issues.filter((issue) => issue.field === "description").map((issue) => issue.messageKey)}
					onChange={(value) => updateValue("description", value)}
					multiline
				/>

				<TextFieldRow
					label={t("editor.mod-hjson.version")}
					description={t("editor.mod-hjson.version-description")}
					placeholder="1.0.0"
					value={String(values.version ?? "")}
					issues={issues.filter((issue) => issue.field === "version").map((issue) => issue.messageKey)}
					onChange={(value) => updateValue("version", value)}
				/>

				<TextFieldRow
					label={t("editor.mod-hjson.min-game-version")}
					description={t("editor.mod-hjson.min-game-version-description")}
					placeholder="158"
					value={String(values.minGameVersion ?? "")}
					issues={issues.filter((issue) => issue.field === "minGameVersion").map((issue) => issue.messageKey)}
					onChange={(value) => updateValue("minGameVersion", value)}
				/>

				<HiddenFieldRow
					label={t("editor.mod-hjson.hidden")}
					description={t("editor.mod-hjson.hidden-description")}
					checked={!!values.hidden}
					onCheckedChange={(checked) => updateValue("hidden", checked)}
				/>

				<DependenciesFieldRow
					label={t("editor.mod-hjson.dependencies")}
					description={t("editor.mod-hjson.dependencies-description")}
					dependencies={depsDisplay}
					onChange={handleDepChange}
					onAdd={handleDepAdd}
					onRemove={handleDepRemove}
				/>
			</div>
		</Panel>
	);
}
