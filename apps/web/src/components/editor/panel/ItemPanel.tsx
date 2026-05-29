import { Panel } from "@/components/editor/Panel";
import { FieldsRenderer, type Field } from "#/components/editor/panel/FieldRenderer";
import { useFileContentString } from "@project/state";
import { useEffect, useRef } from "react";
import { SpritePicker } from "#/components/editor/panel/SpritePicker";
import { useFileName } from "#/hooks/use-path";
import { HJSON, HjsonObjectNode } from "@project/hjson";

interface ItemPanelProps {
	path: string;
}

export function ItemPanel({ path }: ItemPanelProps) {
	const { data, isLoading, write } = useFileContentString(path);
	const fileName = useFileName();
	const contentRef = useRef<string | null>(null);
	const nodeRef = useRef<HjsonObjectNode | null>(null);

	useEffect(() => {
		if (data === null || isLoading) return;
		contentRef.current = data;
		if (data === "") {
			nodeRef.current = null;
			return;
		}
		try {
			const result = HJSON.parseStructured(data);
			if (result instanceof HjsonObjectNode) {
				nodeRef.current = result;
			}
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
		{
			name: "lowPriority",
			type: "Boolean",
			defaultValue: false,
			hiddenIfDefault: true,
		},
	] satisfies Field[];

	const currentContent = contentRef.current;
	const parsedNode = nodeRef.current;

	if (!currentContent || !parsedNode) return null;

	return (
		<Panel>
			<div className="space-y-4 h-full w-full">
				{fileName !== null && <div className="text-lg font-bold">{fileName}</div>}
				<SpritePicker path={path} />
				<FieldsRenderer
					path={path}
					fields={fields}
					node={parsedNode}
					original={currentContent}
					onPatch={(newContent) => {
						contentRef.current = newContent;
						// Re-parse to keep node positions in sync for the next edit
						try {
							const result = HJSON.parseStructured(newContent);
							if (result instanceof HjsonObjectNode) {
								nodeRef.current = result;
							}
						} catch {}
						write(newContent);
					}}
				/>
			</div>
		</Panel>
	);
}
