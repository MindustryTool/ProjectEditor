import { useEffect, useRef, useCallback } from "react";
import {
	useFileStore,
	isDirty,
	isError,
	selectEntry,
	selectIsSaving,
	getEntry,
} from "../stores/file";
import { useProjectSession } from "../stores/session";
import { getWriteQueue, disposeWriteQueue } from "../services/write-queue";

export interface UseFileResult<T> {
	data: T | null;
	currentVersion: number;
	savedVersion: number;
	savedAt: number | null;
	error: string | null;
	isDirty: boolean;
	isSaving: boolean;
	isLoading: boolean;
	isError: boolean;
	write: (content: T) => void;
}

export function useFile(path: string): UseFileResult<ArrayBuffer> {
	const projectContext = useProjectSession((s) => s.projectContext);
	const projectId = projectContext?.project.id;
	const entry = useFileStore(projectId ? selectEntry(projectId, path) : () => undefined);
	const isSaving = useFileStore(projectId ? selectIsSaving(projectId, path) : () => false);

	useEffect(() => {
		if (!projectId || !path) return;
		if (entry !== undefined) return;

		useFileStore.getState().loadFile(projectId, path, projectContext!.fs);
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
		(content: ArrayBuffer | string) => {
			if (!projectId || !projectContext) return;

			const store = useFileStore.getState();
			store.writeBuffer(projectId, path, content);

			const currentEntry = getEntry(projectId, path);
			const version = currentEntry?.currentVersion ?? 0;

			store.markSaving(projectId, path);
			const queue = getWriteQueue(projectId, projectContext.fs);
			queue.enqueue(path, content, version).then(
				() => {
					const updatedEntry = getEntry(projectId, path);
					if (!updatedEntry || updatedEntry.currentVersion !== version) return;
					useFileStore.getState().markPersisted(projectId, path);
					useFileStore.getState().clearSaving(projectId, path);
				},
				(err: unknown) => {
					const updatedEntry = getEntry(projectId, path);
					if (!updatedEntry || updatedEntry.currentVersion !== version) return;
					useFileStore.getState().setBufferError(projectId, path, err instanceof Error ? err.message : String(err));
					useFileStore.getState().clearSaving(projectId, path);
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
