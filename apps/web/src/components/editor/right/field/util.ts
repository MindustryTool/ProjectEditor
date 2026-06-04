import type { HjsonNode } from "@project/hjson";

export function removeByJsonPath(parent: HjsonNode, key: string, original: string): string {
	if (parent.isObject()) return parent.removeField(original, key);
	if (parent.isArray()) return parent.removeElement(original, Number(key));

	throw new Error(`unexpected parent node type for removal`);
}
