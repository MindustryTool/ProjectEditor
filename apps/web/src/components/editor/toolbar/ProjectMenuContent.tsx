import { useTranslation } from "react-i18next";
import { DropdownMenuContent, DropdownMenuItem } from "#/components/ui/dropdown-menu";
import { ProjectPickerDialog } from "#/components/editor/ProjectPickerDialog";
import { ProjectSettingsDialog } from "./ProjectSettingsDialog";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "#/components/ui/dialog";
import { useProjectMenu } from "./use-project-menu";

export function ProjectMenuContent() {
	const { t } = useTranslation();
	const {
		hasProject,
		close,
		fileInputRef,
		importing,
		paths,
		listRef,
		handleImportProject,
		handleFileSelected,
		handleCreateProject,
		handleOpenProject,
		handleChangeProject,
	} = useProjectMenu();

	return (
		<>
			<input ref={fileInputRef} type="file" accept=".zip" className="hidden" onChange={handleFileSelected} />
			<DropdownMenuContent align="start" className="w-44">
				<DropdownMenuItem onClick={handleImportProject}>{t("project-menu.import-project")}</DropdownMenuItem>
				<ProjectPickerDialog
					mode="create"
					trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>{t("project-menu.create-project")}</DropdownMenuItem>}
					onCreateProject={handleCreateProject}
					onSelectProject={handleOpenProject}
				/>
				<ProjectPickerDialog
					mode="open"
					trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>{t("project-menu.open-project")}</DropdownMenuItem>}
					onCreateProject={handleCreateProject}
					onSelectProject={handleOpenProject}
				/>
				<ProjectPickerDialog
					mode="change"
					trigger={
						<DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={!hasProject}>
							{t("project-menu.change-project")}
						</DropdownMenuItem>
					}
					onCreateProject={handleCreateProject}
					onSelectProject={handleChangeProject}
				/>
				<ProjectSettingsDialog
					trigger={
						<DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={!hasProject}>
							{t("project-menu.project-settings")}
						</DropdownMenuItem>
					}
				/>
				<DropdownMenuItem onClick={close} disabled={!hasProject}>
					{t("project-menu.close-project")}
				</DropdownMenuItem>
			</DropdownMenuContent>
			<Dialog open={importing}>
				<DialogContent>
					<DialogTitle>{t("project-menu.import-project")}</DialogTitle>
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
