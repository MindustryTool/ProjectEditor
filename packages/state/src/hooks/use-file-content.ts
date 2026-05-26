import { useEffect, useRef, useCallback } from "react";
import { useFileContentStore, isDirty, isError, selectEntry, selectIsSaving, getEntry } from "../stores/file-content";
import { useProjectSession } from "../stores/session";
import { getWriteQueue, disposeWriteQueue } from "../services/write-queue";

export interface UseFileContentResult {
	data: string | null;
	currentVersion: number;
	savedVersion: number;
	savedAt: number | null;
	error: string | null;
	isDirty: boolean;
	isSaving: boolean;
	isLoading: boolean;
	isError: boolean;
	write: (content: string) => void;
}

export function useFileContent(path: string): UseFileContentResult {
	const projectContext = useProjectSession((s) => s.projectContext);
	const projectId = projectContext?.project.id;
	const entry = useFileContentStore(projectId ? selectEntry(projectId, path) : () => undefined);
	const isSaving = useFileContentStore(projectId ? selectIsSaving(projectId, path) : () => false);

	useEffect(() => {
		if (!projectId || !path) return;
		if (entry !== undefined) return;

		useFileContentStore.getState().readFile(projectId, path, projectContext!.fs);
	}, [path, projectId, projectContext, entry]);

	const previousProjectId = useRef(projectId ?? null);

	useEffect(() => {
		if (projectId !== previousProjectId.current) {
			if (previousProjectId.current !== null) {
				disposeWriteQueue(previousProjectId.current);
			}
			previousProjectId.current = projectId ?? null;
		}
	}, [projectId]);

	const write = useCallback(
		(content: string) => {
			if (!projectId || !projectContext) return;

			const store = useFileContentStore.getState();
			store.writeBuffer(projectId, path, content);

			const currentEntry = getEntry(projectId, path);
			const version = currentEntry?.currentVersion ?? 0;

			store.markSaving(projectId, path);
			const queue = getWriteQueue(projectId, projectContext.fs);
			queue.enqueue(path, content, version).then(
				() => {
					const updatedEntry = getEntry(projectId, path);
					if (!updatedEntry || updatedEntry.currentVersion !== version) return;
					useFileContentStore.getState().markPersisted(projectId, path);
					useFileContentStore.getState().clearSaving(projectId, path);
				},
				(err: unknown) => {
					const updatedEntry = getEntry(projectId, path);
					if (!updatedEntry || updatedEntry.currentVersion !== version) return;
					console.error(`Failed to write ${path}:`, err);
					useFileContentStore.getState().setBufferError(projectId, path, err instanceof Error ? err.message : String(err));
					useFileContentStore.getState().clearSaving(projectId, path);
				},
			);
		},
		[path, projectId, projectContext],
	);

	return {
		data: entry?.data ?? null,
		currentVersion: entry?.currentVersion ?? 0,
		savedVersion: entry?.savedVersion ?? 0,
		savedAt: entry?.savedAt ?? null,
		error: entry?.error ?? null,
		isDirty: isDirty(entry),
		isSaving,
		isLoading: entry?.loading ?? false,
		isError: isError(entry),
		write,
	};
}
