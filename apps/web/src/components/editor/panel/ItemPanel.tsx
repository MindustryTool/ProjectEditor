import { Panel } from "@/components/editor/Panel";
import { FieldRenderer, type Field } from "#/components/editor/panel/FieldRenderer";
import { useFileContent } from "@project/state";
import { useEffect, useState } from "react";

interface ItemPanelProps {
	path: string;
}

export function ItemPanel({ path }: ItemPanelProps) {
	const { data, isLoading, update } = useFileContent(path);
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
			setValues(JSON.parse(data));
		} catch (e) {
			console.error("Failed to parse item data", e);
		}
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
		},
		{
			name: "hidden",
			type: "Boolean",
		},
	] satisfies Field[];

	function handleUpdate(field: string, value: any | undefined) {
        const newValue = {...values};
		if (value === undefined || value === null) {
			delete newValue[field];
		} else {
			newValue[field] = value;
		}
		update(JSON.stringify(newValue, null, 4));
	}

	return (
		<Panel>
			<div className="space-y-4">
				<FieldRenderer fields={fields} values={values} updater={handleUpdate} />
			</div>
		</Panel>
	);
}
