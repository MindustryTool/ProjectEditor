import { Panel } from "@/components/editor/Panel";
import { FieldRenderer, type Field } from "#/components/editor/panel/FieldRenderer";
import { useFileContentString } from "@project/state";
import { useEffect, useState } from "react";
import { SpritePicker } from "#/components/editor/panel/SpritePicker";
import { useFileName } from "#/hooks/use-path";
import { HJSON } from "@project/hjson";

interface ItemPanelProps {
	path: string;
}

export function ItemPanel({ path }: ItemPanelProps) {
	const { data, isLoading, write } = useFileContentString(path);
	const fileName = useFileName();
	const [values, setValues] = useState<Record<string, string>>({});

	useEffect(() => {
		if (data === null) {
			return;
		}

		if (isLoading) {
			return;
		}

		if (data === "") {
			setValues({});
			return;
		}

		try {
			setValues(HJSON.parse(data));
		} catch {}
	}, [data]);

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
		const newValue = { ...values };

		if (value === undefined || value === null || (typeof value === "number" && isNaN(value))) {
			delete newValue[field];
		} else {
			newValue[field] = value;
		}
		write(HJSON.stringify(newValue, null, 4));
	}

	return (
		<Panel>
			<div className="space-y-4">
				{fileName !== null && <div className="text-lg font-bold">{fileName}</div>}
				<SpritePicker path={path} />
				<FieldRenderer path={path} fields={fields} values={values} updater={handleUpdate} />
			</div>
		</Panel>
	);
}
