import { useProjectContext } from "#/components/editor/ProjectProvider";

export function RootName() {
	const { metadata } = useProjectContext();

	return metadata.name.toUpperCase();
}
