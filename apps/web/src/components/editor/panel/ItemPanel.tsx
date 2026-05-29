import { Panel } from "@/components/editor/Panel";
import { FieldsRenderer, type Field } from "#/components/editor/panel/FieldRenderer";
import { useFileContentString } from "@project/state";
import { useEffect, useState, useRef } from "react";
import { SpritePicker } from "#/components/editor/panel/SpritePicker";
import { useFileName } from "#/hooks/use-path";
import { HJSON, HjsonObjectNode } from "@project/hjson";

interface ItemPanelProps {
	path: string;
}

export function ItemPanel({ path }: ItemPanelProps) {
	const { data, isLoading, write } = useFileContentString(path);
	const fileName = useFileName();
	const [values, setValues] = useState<Record<string, any>>({});
	const contentRef = useRef<string | null>(null);

	useEffect(() => {
		if (data === null || isLoading) return;
		contentRef.current = data;
		if (data === "") {
			setValues({});
			return;
		}
		try {
			const result = HJSON.parseStructured(data);
			setValues(result.valueOf());
		} catch {}
	}, [data, isLoading]);

	const fields = [
		{
			name: "color",
			type: "HexColor",
		},
		{
			name: "hardness",
			type: "Int",
		},
		{
			name: "cost",
			type: "Float",
		},
		{
			name: "charge",
			type: "Float",
		},
		{
			name: "radioactivity",
			type: "Float",
		},
		{
			name: "flammability",
			type: "Float",
		},
		{
			name: "explosiveness",
			type: "Float",
		},
		{
			name: "research",
			type: "Research",
		},
		{
			name: "healthScaling",
			type: "Float",
		},
		{
			name: "buildable",
			type: "Boolean",
			defaultValue: false,
			hiddenIfDefault: true,
		},
		{
			name: "hidden",
			type: "Boolean",
			defaultValue: false,
			hiddenIfDefault: true,
		},
	] satisfies Field[];

	function handleUpdate(field: string, value: any | undefined) {
		const newValues = { ...values };
		if (value === undefined || value === null || (typeof value === "number" && isNaN(value))) {
			delete newValues[field];
		} else {
			newValues[field] = value;
		}
		setValues(newValues);

		const content = contentRef.current;

		if (content === null) {
			write(HJSON.stringify(newValues, null, 4));
			return;
		}

		if (value === undefined || value === null || (typeof value === "number" && isNaN(value))) {
			write(HJSON.stringify(newValues, null, 4));
			return;
		}

		try {
			const result = HJSON.parseStructured(content);
			if (result instanceof HjsonObjectNode) {
				const newContent = result.patchField(content, field, HJSON.stringify(value));
				contentRef.current = newContent;
				write(newContent);
			} else {
                write(HJSON.stringify(newValues, null, 4));
            }
		} catch (e) {
			console.error("Failed to patch HJSON:", e);
			write(HJSON.stringify(newValues, null, 4));
		}
	}

	return (
		<Panel>
			<div className="space-y-4 h-full w-full">
				{fileName !== null && <div className="text-lg font-bold">{fileName}</div>}
				<SpritePicker path={path} />
				<FieldsRenderer path={path} fields={fields} values={values} updater={handleUpdate} />
			</div>
		</Panel>
	);
}
