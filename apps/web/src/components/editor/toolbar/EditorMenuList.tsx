import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useIsDesktop } from "#/hooks/use-is-desktop";
import { cn } from "#/lib/utils";
import { Button } from "#/components/ui/button";

import { ProjectMenu } from "./ProjectMenu";
import { EditMenu } from "./EditMenu";
import { ViewMenu } from "./ViewMenu";
import { ExportMenu } from "./ExportMenu";
import { LocalizationMenu } from "./LocalizationMenu";

import { ProjectMenuListContent } from "./ProjectMenuListContent";
import { EditMenuListContent } from "./EditMenuListContent";
import { ViewMenuListContent } from "./ViewMenuListContent";
import { LocalizationMenuListContent } from "./LocalizationMenuListContent";
import { ExportMenuContent } from "./ExportMenuContent";
import { useProjectSession } from "@project/core";

interface EditorMenuListProps {
	className?: string;
	onClose?: () => void;
}

type MenuTab = "project" | "edit" | "view" | "export" | "localization";

export function EditorMenuList({ className, onClose }: EditorMenuListProps) {
	const { t } = useTranslation();
	const [isDesktop] = useIsDesktop();
	const [activeTab, setActiveTab] = useState<MenuTab>("project");
	const [exportOpen, setExportOpen] = useState(false);
	const projectContext = useProjectSession((s) => s.projectContext);

	if (isDesktop) {
		return (
			<div className={cn("flex items-center gap-1", className)}>
				<ProjectMenu />
				<EditMenu />
				<ViewMenu />
				<ExportMenu />
				<LocalizationMenu />
			</div>
		);
	}

	const tabs: { id: MenuTab; label: string }[] = [
		{ id: "project", label: t("project-menu.label", "Project") },
		{ id: "edit", label: t("edit-menu.label", "Edit") },
		{ id: "view", label: t("view-menu.label", "View") },
		{ id: "export", label: t("export-menu.label", "Export") },
		{ id: "localization", label: t("localization-menu.label", "Localization") },
	];

	return (
		<div className={cn("flex h-[280px] w-full bg-background overflow-hidden text-sm border-t border-border", className)}>
			<div className="w-[130px] border-r border-border flex flex-col p-1.5 bg-muted/20 shrink-0 gap-0.5">
				{tabs.map((tab) => {
					const isActive = activeTab === tab.id;
					return (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								"w-full text-left text-xs h-9 px-2.5 rounded-sm transition-all flex items-center justify-between",
								isActive
									? "text-forground font-semibold bg-accent"
									: "text-muted-foreground font-normal hover:bg-accent/40",
							)}
						>
							{tab.label}
						</button>
					);
				})}
			</div>

			{/* Right Column: Tab Content */}
			<div className="flex-1 overflow-y-auto bg-background">
				{activeTab === "project" && <ProjectMenuListContent onItemClick={onClose} />}
				{activeTab === "edit" && <EditMenuListContent onItemClick={onClose} />}
				{activeTab === "view" && <ViewMenuListContent onItemClick={onClose} />}
				{activeTab === "export" && (
					<div className="flex flex-col gap-2 p-3 h-full justify-center items-center text-center">
						<p className="text-xs text-muted-foreground max-w-[200px]">
							{t("export-menu.mobile-description", "Validate project files and download the compiled zip package.")}
						</p>
						<Button
							size="sm"
							onClick={() => {
								if (!projectContext) return;
								setExportOpen(true);
							}}
							disabled={!projectContext}
							className="text-xs w-full mt-2"
						>
							{t("export-menu.label", "Export")}
						</Button>
					</div>
				)}
				{activeTab === "localization" && <LocalizationMenuListContent onItemClick={onClose} />}
			</div>
			<ExportMenuContent open={exportOpen} onOpenChange={setExportOpen} />
		</div>
	);
}
