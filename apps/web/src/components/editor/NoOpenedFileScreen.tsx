import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useProjectSession } from "@project/core";
import { usePath } from "#/hooks/use-path";
import { Separator } from "#/components/ui/separator";
import { Button } from "#/components/ui/button";
import { CreateFileDialog } from "#/components/editor/file-explorer/CreateFileDialog";

export const NoOpenedFileScreen = memo(function NoOpenedFileScreen() {
	const { t } = useTranslation();
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const contentFiles = treeSnapshot
		.getEntries()
		.filter((entry) => entry.path.startsWith("content") && (entry.path.endsWith(".json") || entry.path.endsWith(".hjson")))
		.slice(0, 4)
		.map((file) => file.path);

	const [, setPath] = usePath();
	const [dialogTarget, setDialogTarget] = useState<string | null>(null);

	const files = ["mod.json", "mod.hjson", "README.md", "icon.png", ...contentFiles];

	return (
		<div className="flex flex-col gap-1 w-full h-full items-center justify-center">
			<div className="grid gap-2">
				<span className="font-semibold text-base">{t("editor.no-opened-file")}</span>
				<div className="grid justify-start">
					{files
						.filter((file) => treeSnapshot.contains(file))
						.map((file) => (
							<span key={file} className="text-sm text-muted-foreground underline cursor-pointer" onClick={() => setPath(file)}>
								{file}
							</span>
						))}
				</div>
				<Separator />
				<Button size="sm" onClick={() => setDialogTarget("/")}>
					{t("editor.create-new-file")}
				</Button>
			</div>
			<CreateFileDialog
				targetPath={dialogTarget}
				onClose={() => setDialogTarget(null)}
				onSuccess={(path) => {
					setDialogTarget(null);
					setPath(path);
				}}
			/>
		</div>
	);
});
