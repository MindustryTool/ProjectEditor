import { create } from "zustand";
import { useFileStore } from "./store";

const MAX_HISTORY = 50;

export interface UndoRedoEntry {
	data: ArrayBuffer;
}

interface UndoRedoStore {
	history: Record<string, UndoRedoEntry[]>;
	currentIndex: Record<string, number>;
	pushSnapshot: (projectId: string, path: string, data: ArrayBuffer) => void;
	undo: (projectId: string, path: string) => void;
	redo: (projectId: string, path: string) => void;
	canUndo: (projectId: string, path: string) => boolean;
	canRedo: (projectId: string, path: string) => boolean;
}

function historyKey(projectId: string, path: string): string {
	return `${projectId}::${path}`;
}

export const useUndoRedoStore = create<UndoRedoStore>()((set, get) => ({
	history: {},
	currentIndex: {},

	pushSnapshot: (projectId, path, data) => {
		const key = historyKey(projectId, path);
		const { history, currentIndex } = get();
		const entries = history[key] ? [...history[key]] : [];
		const idx = currentIndex[key] ?? -1;

		// Clear redo stack if not at the latest entry
		const trimmed = entries.slice(0, idx + 1);
		trimmed.push({ data });

		// Enforce max 50 by dropping oldest
		if (trimmed.length > MAX_HISTORY) {
			trimmed.shift();
		}

		set({
			history: { ...history, [key]: trimmed },
			currentIndex: { ...currentIndex, [key]: trimmed.length - 1 },
		});
	},

	undo: (projectId, path) => {
		const key = historyKey(projectId, path);
		const { history, currentIndex } = get();
		const entries = history[key];
		const idx = currentIndex[key] ?? -1;

		if (!entries || idx <= 0) return;

		const newIdx = idx - 1;
		const snapshot = entries[newIdx];
		if (snapshot) {
			useFileStore.getState().writeBuffer(projectId, path, snapshot.data);
			set({ currentIndex: { ...currentIndex, [key]: newIdx } });
		}
	},

	redo: (projectId, path) => {
		const key = historyKey(projectId, path);
		const { history, currentIndex } = get();
		const entries = history[key];
		const idx = currentIndex[key] ?? -1;

		if (!entries) return;

		const newIdx = idx + 1;
		if (newIdx >= entries.length) return;

		const snapshot = entries[newIdx];
		if (snapshot) {
			useFileStore.getState().writeBuffer(projectId, path, snapshot.data);
			set({ currentIndex: { ...currentIndex, [key]: newIdx } });
		}
	},

	canUndo: (projectId, path) => {
		const key = historyKey(projectId, path);
		const idx = get().currentIndex[key] ?? -1;
		return idx > 0;
	},

	canRedo: (projectId, path) => {
		const key = historyKey(projectId, path);
		const { history, currentIndex } = get();
		const entries = history[key];
		const idx = currentIndex[key] ?? -1;
		return !!entries && idx < entries.length - 1;
	},
}));
