import { useProjectContext } from "#/components/editor/ProjectContext";

export function RootName() {
	const { metadata } = useProjectContext();

	return metadata.name.toUpperCase();
}
