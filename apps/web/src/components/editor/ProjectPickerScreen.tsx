import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { getAllProjects, type ProjectRecord } from "@project/storage";
import type { ProjectLanguage } from "@project/core";
import { FolderOpen, Plus } from "lucide-react";
import { toast } from "sonner";
import { useProjectActions } from "./useProjectActions";
import { Separator } from "#/components/ui/separator";
import { LANGUAGE_OPTIONS, LanguageBadge } from "./LanguageBadge";

export function ProjectPickerScreen() {
	const { t } = useTranslation();
	const { createProject, openProjectFromRecord } = useProjectActions();
	const [projects, setProjects] = useState<ProjectRecord[]>([]);
	const [newName, setNewName] = useState("");
	const [newLanguage, setNewLanguage] = useState<ProjectLanguage>("json");
	const [nameError, setNameError] = useState("");

	const loadProjects = useCallback(async () => {
		const all = await getAllProjects();
		setProjects(all);
	}, []);

	useEffect(() => {
		loadProjects();
	}, [loadProjects]);

	async function handleCreate() {
		const trimmed = newName.trim();
		if (!trimmed) {
			setNameError("Name is required");
			return;
		}
		try {
			await createProject(trimmed, newLanguage);
			toast.success("Project created successfully");
			setNewName("");
			setNewLanguage("json");
			setNameError("");
		} catch (e) {
			toast.error(`Failed to create project ${e}`);
		}
	}

	return (
		<div className="flex flex-1 items-center justify-center bg-background">
			<div className="w-full max-w-md space-y-4 px-4">
				<div className="space-y-2 text-center">
					<h1 className="text-xl font-medium text-foreground">{t("app.title")}</h1>
					<p className="text-xs text-muted-foreground">{t("projectPickerScreen.description")}</p>
				</div>

				<div className="gap-3 flex flex-col rounded-lg border bg-card p-4">
					<div className="flex items-center text-sm gap-2 font-medium text-foreground">
						<Plus className="size-5" />
						{t("projectPickerScreen.createNew")}
					</div>
					<div className="flex gap-2 flex-col">
						<label className="text-xs font-medium text-muted-foreground">{t("projectPickerScreen.name")}</label>
						<Input
							placeholder={t("projectPickerScreen.namePlaceholder")}
							value={newName}
							onChange={(e) => {
								setNewName(e.target.value);
								setNameError("");
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleCreate();
							}}
						/>
					</div>
					{nameError && <p className="text-xs text-destructive">{nameError}</p>}
					<div className="flex flex-col gap-2">
						<label className="text-xs font-medium text-muted-foreground">{t("projectPickerScreen.language")}</label>
						<Select value={newLanguage} onValueChange={(v: ProjectLanguage) => setNewLanguage(v)}>
							<SelectTrigger className="h-7 w-32 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{LANGUAGE_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value} className="text-xs">
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<Button onClick={handleCreate}>{t("projectPickerScreen.create")}</Button>
				</div>
				<Separator />
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-sm font-medium text-foreground">
						<FolderOpen className="h-4 w-4" />
						{t("projectPickerScreen.recentProjects")}
					</div>
					<div className="space-y-1">
						{projects.length === 0 && (
							<p className="py-8 text-center text-xs text-muted-foreground">{t("projectPickerScreen.noProjects")}</p>
						)}
						{projects.map((project) => (
							<button
								key={project.id}
								type="button"
								className="w-full rounded-md px-3 py-2 text-left text-xs transition-colors border bg-card hover:bg-accent"
								onClick={() => {
									try {
										openProjectFromRecord(project);
									} catch (e) {
										toast.error(`Failed to open project ${e}`);
									}
								}}
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
			</div>
		</div>
	);
}
