import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { deleteProject, getProject, saveProject } from "@project/storage";
import { deleteProjectFiles } from "@project/fs";
import { useProjectStore } from "@project/state";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

type NameError = "empty" | "invalid" | null;

function validateName(name: string): NameError {
	if (!name) return "empty";
	if (name.length > 100) return "invalid";
	if (!/^[a-zA-Z0-9._-]+$/.test(name)) return "invalid";
	return null;
}

interface ProjectSettingsDialogProps {
	trigger: ReactNode;
}

export function ProjectSettingsDialog({ trigger }: ProjectSettingsDialogProps) {
	const { t } = useTranslation();
	const projectContext = useProjectStore((s) => s.projectContext);
	const updateCurrentProject = useProjectStore((s) => s.updateCurrentProject);
	const closeProject = useProjectStore((s) => s.closeProject);
	const [name, setName] = useState("");
	const [nameError, setNameError] = useState<NameError>(null);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (debounceRef.current !== null) {
				clearTimeout(debounceRef.current);
			}
		};
	}, []);

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (!nextOpen) return;
			setName(projectContext?.project.name ?? "");
			setNameError(null);
		},
		[projectContext?.project.name],
	);

	const persistName = useCallback(
		async (projectId: string, nextName: string) => {
			const ctx = useProjectStore.getState().projectContext;
			if (!ctx || ctx.project.id !== projectId) return;
			if (ctx.project.name === nextName) return;

			const now = new Date();
			const existing = await getProject(projectId);
			await saveProject({
				id: projectId,
				name: nextName,
				language: existing?.language ?? ctx.project.language,
				data: existing?.data ?? "",
				createdAt: existing?.createdAt ?? ctx.project.createdAt,
				updatedAt: now,
			});
			updateCurrentProject({ name: nextName, updatedAt: now });
		},
		[updateCurrentProject],
	);

	const handleNameChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const next = e.target.value;
			setName(next);
			const err = validateName(next);
			setNameError(err);
			if (err) return;
			if (!projectContext) return;

			if (debounceRef.current !== null) {
				clearTimeout(debounceRef.current);
			}
			const projectId = projectContext.project.id;
			debounceRef.current = setTimeout(() => {
				void persistName(projectId, next);
			}, 400);
		},
		[projectContext, persistName],
	);

	const handleDelete = useCallback(async () => {
		if (!projectContext) return;
		const projectId = projectContext.project.id;
		try {
			await deleteProject(projectId);
		} catch (err) {
			console.error("Failed to delete project:", err);
			setDeleteConfirmOpen(false);
			return;
		}
		try {
			await deleteProjectFiles(projectId);
		} catch (err) {
			console.error("Failed to delete project files:", err);
		}
		setDeleteConfirmOpen(false);
		closeProject();
	}, [projectContext, closeProject]);

	return (
		<Dialog onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("projectSettings.dialogTitle")}</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-2">
					<label className="text-xs font-medium text-muted-foreground">{t("projectSettings.nameLabel")}</label>
					<Input
						value={name}
						onChange={handleNameChange}
						placeholder={t("projectSettings.namePlaceholder")}
						aria-invalid={nameError !== null}
					/>
					{nameError === "invalid" && <p className="text-xs text-destructive">{t("projectSettings.nameInvalid")}</p>}
					{nameError === "empty" && <p className="text-xs text-destructive">{t("projectSettings.nameEmpty")}</p>}
				</div>
				<DialogFooter>
					<AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">{t("projectSettings.deleteProject")}</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>{t("projectSettings.deleteTitle")}</AlertDialogTitle>
								<AlertDialogDescription>{t("projectSettings.deleteDescription")}</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>{t("projectSettings.cancel")}</AlertDialogCancel>
								<AlertDialogAction variant="destructive" onClick={handleDelete}>
									{t("projectSettings.confirmDelete")}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
