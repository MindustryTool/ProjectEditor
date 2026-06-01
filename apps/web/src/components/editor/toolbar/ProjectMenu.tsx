import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { useProjectSession, useAppStore } from "@project/state";
import { toast } from "sonner";
import { ProjectPickerDialog } from "#/components/editor/ProjectPickerDialog";
import { ProjectSettingsDialog } from "./ProjectSettingsDialog";
import { useProjectActions } from "#/hooks/use-project-actions";
import type { ProjectRecord } from "@project/state";
import type { ProjectLanguage } from "@project/core";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "#/components/ui/dialog";

interface ProjectMenuProps {
	className?: string;
}

export function ProjectMenu({ className }: ProjectMenuProps) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const hasProject = useProjectSession((state) => state.projectContext !== null);
	const { closeProject, createProject, openProjectFromRecord } = useProjectActions();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [importing, setImporting] = useState(false);
	const [paths, setPaths] = useState<string[]>([]);
	const listRef = useRef<HTMLDivElement>(null);

	const navigateToProject = useCallback(
		(id: string) => {
			navigate({ to: `/en/projects/${id}`, replace: true });
		},
		[navigate],
	);

	const handleImportProject = useCallback(async () => {
		fileInputRef.current?.click();
	}, []);

	const handleFileSelected = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			setImporting(true);
			setPaths([]);

			try {
				const buffer = await file.arrayBuffer();
				const project = await useAppStore.getState().importProject(buffer, (path) => {
					setPaths((prev) => [...prev, path]);
				});

				navigateToProject(project.id);
				toast.success(`Project imported successfully`);
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Failed to import project");
			} finally {
				setImporting(false);
			}

			e.target.value = "";
		},
		[navigateToProject],
	);

	const handleCreateProject = useCallback(
		async (name: string, language?: ProjectLanguage) => {
			try {
				const id = await createProject(name, language);
				if (id) navigateToProject(id);
				toast.success("Project created successfully");
			} catch (e) {
				toast.error(`Failed to create project ${e}`);
			}
		},
		[createProject, navigateToProject],
	);

	const handleOpenProject = useCallback(
		async (record: ProjectRecord) => {
			await openProjectFromRecord(record);
			navigateToProject(record.id);
		},
		[openProjectFromRecord, navigateToProject],
	);

	const handleChangeProject = useCallback(
		async (record: ProjectRecord) => {
			closeProject();
			await openProjectFromRecord(record);
			navigateToProject(record.id);
		},
		[closeProject, openProjectFromRecord, navigateToProject],
	);

	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
		}
	}, [paths]);

	return (
		<>
			<input ref={fileInputRef} type="file" accept=".zip" className="hidden" onChange={handleFileSelected} />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						className={cn(
							"inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-foreground hover:bg-accent active:bg-accent",
							className,
						)}
					>
						{t("projectMenu.label")}
						<ChevronDown className="h-3 w-3 text-muted-foreground" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="w-44">
					<DropdownMenuItem onClick={handleImportProject}>{t("projectMenu.importProject")}</DropdownMenuItem>
					<ProjectPickerDialog
						mode="create"
						trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>{t("projectMenu.createProject")}</DropdownMenuItem>}
						onCreateProject={handleCreateProject}
						onSelectProject={handleOpenProject}
					/>
					<ProjectPickerDialog
						mode="open"
						trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>{t("projectMenu.openProject")}</DropdownMenuItem>}
						onCreateProject={handleCreateProject}
						onSelectProject={handleOpenProject}
					/>
					<ProjectPickerDialog
						mode="change"
						trigger={
							<DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={!hasProject}>
								{t("projectMenu.changeProject")}
							</DropdownMenuItem>
						}
						onCreateProject={handleCreateProject}
						onSelectProject={handleChangeProject}
					/>
					<ProjectSettingsDialog
						trigger={
							<DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={!hasProject}>
								{t("projectMenu.projectSettings")}
							</DropdownMenuItem>
						}
					/>
					<DropdownMenuItem onClick={closeProject} disabled={!hasProject}>
						{t("projectMenu.closeProject")}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<Dialog open={importing}>
				<DialogContent>
					<DialogTitle>{t("projectMenu.importProject")}</DialogTitle>
					<DialogDescription />
					<div className="grid gap-1 p-2 rounded-md border max-h-[200px] overflow-y-auto" ref={listRef}>
						{paths.length > 0 &&
							paths.map((path, index) => (
								<div key={path} className="text-xs text-muted-foreground">
									{`${index + 1}. ${path}`}
								</div>
							))}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
