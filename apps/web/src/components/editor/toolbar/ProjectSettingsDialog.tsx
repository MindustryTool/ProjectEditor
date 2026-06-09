import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteProjectFiles } from "@project/core";
import { useAppStore, useProjectSession } from "@project/core";
import type { ProjectRecord } from "@project/schema";
import { Spinner } from "#/components/ui/spinner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
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
} from "#/components/ui/alert-dialog";
import { useProjectActions } from "#/hooks/use-project-actions";

type NameError = "empty" | "invalid" | null;

function validateName(name: string): NameError {
	if (!name) return "empty";
	if (name.length > 100) return "invalid";
	if (!/^[a-zA-Z0-9._-]+$/.test(name)) return "invalid";
	return null;
}

interface ProjectSettingsDialogProps {
	trigger: ReactNode;
	project?: ProjectRecord;
	onDeleted?: () => void;
}

function EditProjectName({ defaultProject }: { defaultProject?: ProjectRecord }) {
	const { t } = useTranslation();
	const projectContext = useProjectSession((s) => s.projectContext);
	const updateCurrentProject = useProjectSession((s) => s.updateCurrentProject);
	const [name, setName] = useState(defaultProject?.name ?? projectContext?.project.name ?? "");
	const [nameError, setNameError] = useState<NameError>(null);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (debounceRef.current !== null) {
				clearTimeout(debounceRef.current);
			}
		};
	}, []);

	const persistName = useCallback(
		async (projectId: string, nextName: string) => {
			if (defaultProject) {
				const now = new Date();
				const existing = useAppStore.getState().projects[projectId];
				await useAppStore.getState().saveProject({
					id: projectId,
					name: nextName,
					language: existing?.language ?? defaultProject.language,
					createdAt: existing?.createdAt ?? defaultProject.createdAt,
					updatedAt: now,
				});
				return;
			}
			const ctx = useProjectSession.getState().projectContext;
			if (!ctx || ctx.project.id !== projectId) return;
			if (ctx.project.name === nextName) return;

			const now = new Date();
			const existing = useAppStore.getState().projects[projectId];
			await useAppStore.getState().saveProject({
				id: projectId,
				name: nextName,
				language: existing?.language ?? ctx.project.language,
				createdAt: existing?.createdAt ?? ctx.project.createdAt,
				updatedAt: now,
			});
			updateCurrentProject({ name: nextName, updatedAt: now });
		},
		[defaultProject, updateCurrentProject],
	);

	const handleNameChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const next = e.target.value;
			setName(next);
			const err = validateName(next);
			setNameError(err);
			if (err) return;

			const projectId = defaultProject?.id ?? projectContext?.project.id;
			if (!projectId) return;

			if (debounceRef.current !== null) {
				clearTimeout(debounceRef.current);
			}
			debounceRef.current = setTimeout(() => {
				void persistName(projectId, next);
			}, 400);
		},
		[defaultProject?.id, projectContext?.project.id, persistName],
	);

	return (
		<div className="flex flex-col gap-2">
			<label className="text-xs font-medium text-muted-foreground">{t("project-settings.name-label")}</label>
			<Input
				value={name}
				onChange={handleNameChange}
				placeholder={t("project-settings.name-placeholder")}
				aria-invalid={nameError !== null}
			/>
			{nameError === "invalid" && <p className="text-xs text-destructive">{t("project-settings.name-invalid")}</p>}
			{nameError === "empty" && <p className="text-xs text-destructive">{t("project-settings.name-empty")}</p>}
		</div>
	);
}

function DeleteProject({ projectId: propId, onDeleted }: { projectId?: string; onDeleted?: () => void }) {
	const { t } = useTranslation();
	const projectContext = useProjectSession((s) => s.projectContext);
	const { close } = useProjectActions();
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const effectiveId = propId ?? projectContext?.project.id;

	const deleteMutation = useMutation({
		mutationFn: async (projectId: string) => {
			await useAppStore.getState().deleteProject(projectId);
			try {
				await deleteProjectFiles(projectId);
			} catch (err) {
				toast.error(`Failed to delete project files: ${err instanceof Error ? err.message : "Unknown error"}`);
			}
		},
		onSuccess: () => {
			setDeleteConfirmOpen(false);
			if (propId) {
				onDeleted?.();
			} else {
				close();
			}
		},
		onError: (err) => {
			toast.error(`Failed to delete project: ${err instanceof Error ? err.message : "Unknown error"}`);
			setDeleteConfirmOpen(false);
		},
	});

	return (
		<AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="destructive">{t("project-settings.delete-project")}</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t("project-settings.delete-title")}</AlertDialogTitle>
					<AlertDialogDescription>{t("project-settings.delete-description")}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t("project-settings.cancel")}</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={(event) => {
							event.stopPropagation();
							event.preventDefault();
							if (effectiveId) deleteMutation.mutate(effectiveId);
						}}
						disabled={deleteMutation.isPending}
					>
						{deleteMutation.isPending ? <Spinner /> : t("project-settings.confirm-delete")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function ProjectSettingsDialog({ trigger, project, onDeleted }: ProjectSettingsDialogProps) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const [resetKey, setResetKey] = useState(0);

	const handleOpenChange = useCallback((nextOpen: boolean) => {
		setOpen(nextOpen);
		if (nextOpen) {
			setResetKey((k) => k + 1);
		}
	}, []);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("project-settings.dialog-title")}</DialogTitle>
				</DialogHeader>
				<EditProjectName key={resetKey} defaultProject={project} />
				<DialogFooter>
					<DeleteProject projectId={project?.id} onDeleted={onDeleted} />
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
