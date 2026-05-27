import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { useProjectSession, useAppStore } from "@project/state";
import { importProject, createProjectInfo, createEventBus } from "@project/core";
import type { ProjectEventMap } from "@project/core";
import { createProjectFileSystem } from "@project/fs";
import { toast } from "sonner";
import { ProjectPickerDialog } from "../ProjectPickerDialog";
import { ProjectSettingsDialog } from "./ProjectSettingsDialog";
import { useProjectActions } from "../useProjectActions";
import type { ProjectRecord } from "@project/state";
import type { ProjectLanguage } from "@project/core";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "#/components/ui/dialog";

interface ProjectMenuProps {
	className?: string;
}

export function ProjectMenu({ className }: ProjectMenuProps) {
	const { t } = useTranslation();
	const hasProject = useProjectSession((state) => state.projectContext !== null);
	const { closeProject, createProject, openProjectFromRecord } = useProjectActions();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [importing, setImporting] = useState(false);
	const [paths, setPaths] = useState<string[]>([]);
	const listRef = useRef<HTMLDivElement>(null);

	const handleImportProject = useCallback(async () => {
		fileInputRef.current?.click();
	}, []);

	const handleFileSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setImporting(true);
		setPaths([]);

		try {
			const buffer = await file.arrayBuffer();
			const result = await importProject(new Uint8Array(buffer));

			const project = createProjectInfo(result.name, result.language);
			await useAppStore.getState().saveProject({
				id: project.id,
				name: project.name,
				language: project.language,
				createdAt: project.createdAt,
				updatedAt: project.updatedAt,
			});

			const events = createEventBus<ProjectEventMap>();
			const fs = await createProjectFileSystem(project, events, {
				onTreeSnapshotChange: (snapshot) => useProjectSession.setState({ treeSnapshot: snapshot }),
			});

			const unsubscribe = events.on("file:changed", (path) => {
				if (path.kind === "write") {
					setPaths((prev) => [...prev, path.path]);
				}
			});

			useAppStore.setState({ lastProjectId: project.id });
			useProjectSession.getState().setCurrentProject({ project, fs, events });

			await fs.writeFiles(result.entries);

			unsubscribe();

			toast.success(`Project imported successfully`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to import project");
		} finally {
			setImporting(false);
		}

		e.target.value = "";
	}, []);

	const handleCreateProject = useCallback(
		async (name: string, language?: ProjectLanguage) => {
			try {
				await createProject(name, language);
				toast.success("Project created successfully");
			} catch (e) {
				toast.error(`Failed to create project ${e}`);
			}
		},
		[createProject],
	);

	const handleOpenProject = useCallback(
		async (record: ProjectRecord) => {
			await openProjectFromRecord(record);
		},
		[openProjectFromRecord],
	);

	const handleChangeProject = useCallback(
		async (record: ProjectRecord) => {
			closeProject();
			await openProjectFromRecord(record);
		},
		[closeProject, openProjectFromRecord],
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
