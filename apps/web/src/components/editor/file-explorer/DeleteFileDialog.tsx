import { useMemo } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { useCurrentProject } from "@project/core";

interface DeleteFileDialogProps {
	targetPath: string | null;
	onClose: () => void;
}

export function DeleteFileDialog({ targetPath, onClose }: DeleteFileDialogProps) {
	const context = useCurrentProject();

	const deleteTargetName = useMemo(() => {
		if (!targetPath) return "";
		const parts = targetPath.split("/");
		return parts[parts.length - 1] ?? "";
	}, [targetPath]);

	async function handleDeleteConfirm() {
		if (!targetPath) return;

		await context.fs.delete(targetPath).catch((err) => {
			toast.error(`Failed to delete: ${err instanceof Error ? err.message : "Unknown error"}`);
		});

		onClose();
	}

	return (
		<AlertDialog
			open={targetPath !== null}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete {deleteTargetName}?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone.
						{targetPath && targetPath.split("/").length > 1 ? " All contents will be deleted." : ""}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction variant="destructive" onClick={handleDeleteConfirm}>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
