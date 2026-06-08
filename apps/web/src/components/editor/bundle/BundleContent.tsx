import { lazy, memo, Suspense, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useProjectSession } from "@project/core";
import { TextEditor } from "#/components/editor/TextEditor";
import { useProjectContext } from "#/components/editor/ProjectProvider";

const BundleGrid = lazy(() => import("#/components/editor/bundle/BundleGrid").then((mod) => ({ default: mod.BundleGrid })));

type BundleView = "editor" | "grid";

const BundleViewToggle = memo(function BundleViewToggle({ view, onChange }: { view: BundleView; onChange: (v: BundleView) => void }) {
	const { t } = useTranslation();

	return (
		<div className="flex items-center gap-px bg-muted/60 p-0.5">
			<button
				type="button"
				onClick={() => onChange("editor")}
				className={`px-2.5 py-0.5 text-[11px] font-medium rounded-[3px] transition-all ${
					view === "editor" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground/50 hover:text-foreground"
				}`}
			>
				{t("bundle-editor.editor-tab")}
			</button>
			<button
				type="button"
				onClick={() => onChange("grid")}
				className={`px-2.5 py-0.5 text-[11px] font-medium rounded-[3px] transition-all ${
					view === "grid" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground/50 hover:text-foreground"
				}`}
			>
				{t("bundle-editor.grid-tab")}
			</button>
		</div>
	);
});

const contentMap: Record<string, string> = {
	blocks: "block",
	units: "unit",
	sectors: "sector",
	items: "item",
	liquids: "liquid",
	status: "status",
};

export const BundleContent = memo(function BundleContent({ path }: { path: string }) {
	const { t } = useTranslation();
	const [view, setView] = useState<BundleView>("grid");
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const modName = useProjectContext().metadata.name;

	const contentKeys = useMemo(() => {
		const allEntries = treeSnapshot.getEntries();
		return allEntries
			.filter((e) => e.kind === "file" && e.path.startsWith("content/") && (e.path.endsWith(".json") || e.path.endsWith(".hjson")))
			.flatMap((e) => {
				const parts = e.path.split("/");
				const name = (e.path.split("/").pop() ?? "").replace(/\.(json|hjson)$/, "");
				const type = contentMap[parts[1] || ""];

				if (!type || !name) {
					return [];
				}

				return [`${type}.${modName}-${name}.name`, `${type}.${modName}-${name}.description`];
			});
	}, [treeSnapshot, modName]);

	const handleViewChange = useCallback((v: BundleView) => setView(v), []);

	return (
		<div className="flex flex-col h-full w-full gap-1.5">
			{view === "editor" && (
				<div className="flex items-center justify-end shrink-0">
					<BundleViewToggle view={view} onChange={handleViewChange} />
				</div>
			)}
			<div className="flex-1 min-h-0">
				{view === "editor" ? (
					<TextEditor path={path} />
				) : (
					<Suspense
						fallback={
							<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
								{t("bundle-editor.loading")}
							</div>
						}
					>
						<BundleGrid path={path} contentKeys={contentKeys} toggle={<BundleViewToggle view={view} onChange={handleViewChange} />} />
					</Suspense>
				)}
			</div>
		</div>
	);
});
