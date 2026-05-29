import { Panel } from "@/components/editor/Panel";
import { FieldsRenderer, type Field } from "#/components/editor/panel/FieldRenderer";
import { useFileContentString } from "@project/state";
import { SpritePicker } from "#/components/editor/panel/SpritePicker";
import { useFileName } from "#/hooks/use-path";
import { HJSON, HjsonObjectNode } from "@project/hjson";

interface ItemPanelProps {
	path: string;
}

const fields = [
	{
		name: "color",
		type: "HexColor",
	},
	{
		name: "hardness",
		type: "Int",
		nullable: true,
	},
	{
		name: "cost",
		type: "Float",
		nullable: true,
	},
	{
		name: "charge",
		type: "Float",
		nullable: true,
	},
	{
		name: "radioactivity",
		type: "Float",
		nullable: true,
	},
	{
		name: "flammability",
		type: "Float",
		nullable: true,
	},
	{
		name: "explosiveness",
		type: "Float",
		nullable: true,
	},
	{
		name: "research",
		type: "Research",
		nullable: true,
	},
	{
		name: "healthScaling",
		type: "Float",
		nullable: true,
		defaultValue: false,
	},
	{
		name: "buildable",
		type: "Boolean",
		nullable: true,
		defaultValue: false,
	},
	{
		name: "hidden",
		type: "Boolean",
		nullable: true,
		defaultValue: false,
	},
	{
		name: "lowPriority",
		type: "Boolean",
		nullable: true,
		defaultValue: false,
	},
] satisfies Field[];

export function ItemPanel({ path }: ItemPanelProps) {
	const { data, isLoading, write } = useFileContentString(path);
	const fileName = useFileName();

	if (data === null || isLoading) {
		return null;
	}

	let parsedNode = null;

	try {
		const result = HJSON.parseStructured(data);
		if (result instanceof HjsonObjectNode) {
			parsedNode = result;
		}
	} catch {}

	if (!parsedNode) {
		return null;
	}

	return (
		<Panel>
			<div className="space-y-4 h-full w-full">
				{fileName !== null && <div className="text-lg font-bold">{fileName}</div>}
				<SpritePicker path={path} />
				<FieldsRenderer path={path} fields={fields} node={parsedNode} original={data} onPatch={write} />
			</div>
		</Panel>
	);
}
