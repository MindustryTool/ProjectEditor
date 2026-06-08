import { lazy, memo } from "react";
import { useProjectSession, isBundleFilename } from "@project/core";
import { RecentlyOpenedFilesBar } from "./recently-opened/RecentlyOpenedFilesBar";
import { usePath } from "#/hooks/use-path";
import { TextEditor } from "./TextEditor";
import { BundleContent } from "./bundle/BundleContent";
import { ImageWithSize } from "./ImageWithSize";
import { NoOpenedFileScreen } from "./NoOpenedFileScreen";

const UnitSpriteEditor = lazy(() => import("#/components/editor/sprite/UnitSpritEdior").then((mod) => ({ default: mod.UnitSpriteEditor })));

function EditorContent({ path }: { path: string }) {
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const striped = path.replace("sprite:", "");
	const entry = treeSnapshot.getEntry(striped);

	if (entry === undefined) return null;

	if (path.startsWith("bundles/") && isBundleFilename(path.split("/").pop() ?? "")) {
		return <BundleContent path={path} />;
	}

	if (path === "mod.hjson" || (path.startsWith("content") && path.endsWith(".json"))) {
		return <TextEditor path={path} />;
	}

	if (path.endsWith(".png")) {
		return <ImageWithSize path={path} />;
	}

	if (path.startsWith("sprite:")) {
		return <UnitSpriteEditor striped={striped} />;
	}

	if (entry.kind === "file") {
		return <TextEditor path={path} />;
	}

	return null;
}

export const EditorCenterPanel = memo(function EditorCenterPanel() {
	const [path] = usePath();

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden h-full w-full py-1">
			<RecentlyOpenedFilesBar />
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden">{path ? <EditorContent path={path} /> : <NoOpenedFileScreen />}</div>
		</div>
	);
});
