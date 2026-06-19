import { useEffect, useCallback, useMemo } from "react";
import { useFileStore, isDirty, isError, selectEntry, selectIsSaving, getEntry } from "../file/store";
import { useProjectSession } from "../project/session";
import { getWriteQueue } from "../write-queue";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { useUndoRedoStore } from "../file/undo-redo-store";

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
	write: (content: T | ((prev: T | null) => T)) => void;
}

export function useFile(path: string): UseFileResult<ArrayBuffer> {
	const projectId = useProjectSession((s) => s.projectContext?.project.id);
	const fs = useProjectSession((s) => s.projectContext?.fs);

	const entry = useStoreWithEqualityFn(useFileStore, projectId ? selectEntry(projectId, path) : () => undefined, shallow);
	const isSaving = useStoreWithEqualityFn(useFileStore, projectId ? selectIsSaving(projectId, path) : () => false, shallow);

	useEffect(() => {
		if (projectId && fs && path && entry === undefined) {
			useFileStore.getState().loadFile(projectId, path, fs);
		}
	}, [path, projectId, fs, entry]);

	const write = useCallback(
		(content: ArrayBuffer | string | ((prev: ArrayBuffer | null) => ArrayBuffer)) => {
			if (!projectId || !fs) return;

			const currentData = getEntry(projectId, path)?.data;
			if (currentData !== null && currentData !== undefined) {
				useUndoRedoStore.getState().pushSnapshot(projectId, path, currentData);
			}

			const resolved = typeof content === "function" ? content(getEntry(projectId, path)?.data ?? null) : content;
			const store = useFileStore.getState();
			store.writeBuffer(projectId, path, resolved);

			const currentEntry = getEntry(projectId, path);
			const version = currentEntry?.currentVersion ?? 0;

			store.markSaving(projectId, path);
			const queue = getWriteQueue(projectId, fs);

			queue.write(path, resolved).then(
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
		[path, projectId, fs],
	);

	const data = entry?.data ?? null;
	const currentVersion = entry?.currentVersion ?? 0;
	const savedVersion = entry?.savedVersion ?? 0;
	const savedAt = entry?.savedAt ?? null;
	const error = entry?.error ?? null;
	const _isDirty = isDirty(entry);
	const isLoading = entry?.loading ?? false;
	const _isError = isError(entry);

	return useMemo(
		() => ({
			data,
			currentVersion,
			savedVersion,
			savedAt,
			error,
			isDirty: _isDirty,
			isSaving,
			isLoading,
			isError: _isError,
			write,
		}),
		[_isDirty, _isError, currentVersion, data, error, isLoading, isSaving, savedAt, savedVersion, write],
	);
}
