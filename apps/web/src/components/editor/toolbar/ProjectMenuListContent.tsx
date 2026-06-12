import { useTranslation } from "react-i18next";
import { Button } from "#/components/ui/button";
import { ProjectPickerDialog } from "#/components/editor/ProjectPickerDialog";
import { ProjectSettingsDialog } from "./ProjectSettingsDialog";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "#/components/ui/dialog";
import { useProjectMenu } from "./use-project-menu";

interface ProjectMenuListContentProps {
	onItemClick?: () => void;
}

export function ProjectMenuListContent({ onItemClick }: ProjectMenuListContentProps) {
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

	const wrapClick = (action: () => void) => {
		action();
		onItemClick?.();
	};

	return (
		<div className="flex flex-col gap-1 p-1 w-full">
			<input ref={fileInputRef} type="file" accept=".zip" className="hidden" onChange={handleFileSelected} />

			<Button
				variant="ghost"
				className="w-full justify-start text-xs h-9 px-3 font-normal"
				onClick={() => wrapClick(handleImportProject)}
			>
				{t("project-menu.import-project")}
			</Button>

			<ProjectPickerDialog
				mode="create"
				trigger={
					<Button variant="ghost" className="w-full justify-start text-xs h-9 px-3 font-normal" onClick={onItemClick}>
						{t("project-menu.create-project")}
					</Button>
				}
				onCreateProject={handleCreateProject}
				onSelectProject={handleOpenProject}
			/>

			<ProjectPickerDialog
				mode="open"
				trigger={
					<Button variant="ghost" className="w-full justify-start text-xs h-9 px-3 font-normal" onClick={onItemClick}>
						{t("project-menu.open-project")}
					</Button>
				}
				onCreateProject={handleCreateProject}
				onSelectProject={handleOpenProject}
			/>

			<ProjectPickerDialog
				mode="change"
				trigger={
					<Button
						variant="ghost"
						className="w-full justify-start text-xs h-9 px-3 font-normal"
						disabled={!hasProject}
						onClick={onItemClick}
					>
						{t("project-menu.change-project")}
					</Button>
				}
				onCreateProject={handleCreateProject}
				onSelectProject={handleChangeProject}
			/>

			<ProjectSettingsDialog
				trigger={
					<Button
						variant="ghost"
						className="w-full justify-start text-xs h-9 px-3 font-normal"
						disabled={!hasProject}
						onClick={onItemClick}
					>
						{t("project-menu.project-settings")}
					</Button>
				}
			/>

			<Button
				variant="ghost"
				className="w-full justify-start text-xs h-9 px-3 font-normal"
				onClick={() => wrapClick(close)}
				disabled={!hasProject}
			>
				{t("project-menu.close-project")}
			</Button>

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
		</div>
	);
}
