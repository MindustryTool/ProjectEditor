import { useCallback, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useAppStore } from "@project/state";
import type { ProjectRecord } from "@project/state";
import type { ProjectLanguage } from "@project/core";
import { FolderOpen } from "lucide-react";
import { Separator } from "#/components/ui/separator";
import { LANGUAGE_OPTIONS, LanguageBadge } from "./LanguageBadge";
import { cn } from "#/lib/utils";

interface ProjectPickerDialogProps {
	mode: "create" | "open" | "change";
	trigger: ReactNode;
	onSelectProject: (project: ProjectRecord) => Promise<void>;
	onCreateProject: (name: string, language?: ProjectLanguage) => Promise<void>;
}

export function ProjectPickerDialog({ mode, trigger, onSelectProject, onCreateProject }: ProjectPickerDialogProps) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const [projects, setProjects] = useState<ProjectRecord[]>([]);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [newName, setNewName] = useState("");
	const [newLanguage, setNewLanguage] = useState<ProjectLanguage>("json");
	const [nameError, setNameError] = useState("");

	const loadProjects = useCallback(async () => {
		const all = await useAppStore.getState().getAllProjects();
		setProjects(all);
	}, []);

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			setOpen(nextOpen);
			if (!nextOpen) return;
			void loadProjects();
			setSelectedId(null);
			setNewName("");
			setNewLanguage("json");
			setNameError("");
		},
		[loadProjects],
	);

	async function handleSelect() {
		const record = projects.find((p) => p.id === selectedId);
		if (!record) return;
		try {
			await onSelectProject(record);
			setOpen(false);
		} catch {}
	}

	const titleKey = mode === "create" ? "project-picker-dialog.create-title" : "project-picker-dialog.title";
	const showCreateForm = mode !== "change";

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{t(titleKey)}</DialogTitle>
					<DialogDescription>{t("project-picker-dialog.description")}</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					{showCreateForm && (
						<div className="gap-3 flex flex-col rounded-lg">
							<div className="flex gap-2 flex-col">
								<label className="text-xs font-medium text-muted-foreground">{t("project-picker-dialog.name-placeholder")}</label>
								<Input
									placeholder={t("project-picker-dialog.name-placeholder")}
									value={newName}
									onChange={(e) => {
										setNewName(e.target.value);
										setNameError("");
									}}
									onKeyDown={(e) => {
										if (e.key !== "Enter") return;
										const trimmed = newName.trim();
										if (!trimmed) {
											setNameError("Name is required");
											return;
										}
										void (async () => {
											try {
												await onCreateProject(trimmed, newLanguage);
												setOpen(false);
											} catch {}
										})();
									}}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<label className="text-xs font-medium text-muted-foreground">{t("project-picker-dialog.language")}</label>
								<Select value={newLanguage} onValueChange={(v: ProjectLanguage) => setNewLanguage(v)}>
									<SelectTrigger className="h-7 w-32 text-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{LANGUAGE_OPTIONS.map((opt) => (
											<SelectItem key={opt.value} value={opt.value} className="text-xs" disabled={opt.value !== "json"}>
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							{nameError && <p className="text-xs text-destructive">{nameError}</p>}
							<Button
								onClick={() => {
									const trimmed = newName.trim();
									if (!trimmed) {
										setNameError("Name is required");
										return;
									}
									void (async () => {
										try {
											await onCreateProject(trimmed, newLanguage);
											setOpen(false);
										} catch {}
									})();
								}}
							>
								{t("project-picker-dialog.create")}
							</Button>
						</div>
					)}

					{showCreateForm && mode !== "create" && <Separator />}

					{mode !== "create" && (
						<div className="space-y-2">
							<div className="flex items-center gap-1 text-sm font-medium text-foreground">
								<FolderOpen className="h-4 w-4" />
								{t("project-picker-dialog.recent-projects")}
							</div>
							<div className="max-h-60 space-y-1 overflow-y-auto">
								{projects.length === 0 && (
									<p className="py-4 text-center text-xs text-muted-foreground">{t("project-picker-dialog.no-projects")}</p>
								)}
								{projects.map((project) => (
									<button
										key={project.id}
										type="button"
										className={cn(
											`w-full rounded-md px-3 py-2 text-left text-xs transition-colors bg-accent border hover:bg-accent`,
											{ "bg-accent border-primary border-2": selectedId === project.id },
										)}
										onClick={() => setSelectedId(project.id)}
									>
										<div className="flex items-center gap-2 font-medium text-foreground">
											{project.name}
											<LanguageBadge language={project.language} />
										</div>
										<div className="text-muted-foreground">{new Date(project.updatedAt).toLocaleDateString()}</div>
									</button>
								))}
							</div>
						</div>
					)}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						{t("project-picker-dialog.cancel")}
					</Button>
					{mode !== "create" && (
						<Button onClick={() => void handleSelect()} disabled={!selectedId}>
							{t("project-picker-dialog.open")}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
