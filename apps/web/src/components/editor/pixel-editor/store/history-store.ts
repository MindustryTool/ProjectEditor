import { create } from "zustand";
import type { HistoryEntry, PendingTransaction, PixelHistoryEntry } from "../utils/canvas-state";

export interface HistoryStore {
	entries: HistoryEntry[];
	currentIndex: number;
	maxHistory: number;
	transaction: PendingTransaction | null;

	beginTransaction: (name: string) => void;
	recordChange: (index: number, before: number, after: number) => void;
	commitTransaction: () => void;
	rollbackTransaction: () => void;
	pushEntry: (entry: HistoryEntry) => void;
	undo: () => HistoryEntry | null;
	redo: () => HistoryEntry | null;
	clear: () => void;
	canUndo: () => boolean;
	canRedo: () => boolean;
	/** Serialize entries for persistence */
	serialize: () => SerializedHistoryStore;
	/** Restore entries from persistence */
	deserialize: (data: SerializedHistoryStore) => void;
}

export interface SerializedHistoryStore {
	entries: SerializedHistoryEntry[];
	currentIndex: number;
	maxHistory: number;
}

export interface SerializedHistoryEntry {
  id: string;
  name: string;
  timestamp: number;
  changes: { index: number; before: number; after: number }[];
  layerId?: string;
}

export const useHistoryStore = create<HistoryStore>()((set, get) => ({
	entries: [],
	currentIndex: -1,
	maxHistory: 50,
	transaction: null,

	beginTransaction: (name) => {
		set({ transaction: { name, changes: new Map() } });
	},

	recordChange: (index, before, after) => {
		const { transaction } = get();
		if (!transaction) return;
		if (transaction.changes.has(index)) return;
		transaction.changes.set(index, { index, before, after });
	},

	commitTransaction: () => {
		const { transaction } = get();
		if (!transaction) return;
		const changes = Array.from(transaction.changes.values());
		if (changes.length === 0) {
			set({ transaction: null });
			return;
		}
		// Note: commitTransaction requires a layerId. For now, we'll skip creating entries here.
		// In-place mutations use layer.canvas.endRecord() instead
		set({ transaction: null });
	},

	rollbackTransaction: () => {
		set({ transaction: null });
	},

	pushEntry: (entry) => {
		set((state) => {
			const newEntries = state.entries.slice(0, state.currentIndex + 1);
			newEntries.push(entry);
			if (newEntries.length > state.maxHistory) {
				newEntries.shift();
			}
			return { entries: newEntries, currentIndex: newEntries.length - 1 };
		});
	},

	undo: () => {
		const { entries, currentIndex } = get();
		if (currentIndex < 0 || currentIndex >= entries.length) return null;
		const entry = entries[currentIndex]!;
		set({ currentIndex: currentIndex - 1 });
		return entry;
	},

	redo: () => {
		const { entries, currentIndex } = get();
		if (currentIndex + 1 >= entries.length) return null;
		const entry = entries[currentIndex + 1]!;
		set({ currentIndex: currentIndex + 1 });
		return entry;
	},

	clear: () => set({ entries: [], currentIndex: -1, transaction: null }),

	canUndo: () => get().currentIndex >= 0,
	canRedo: () => get().currentIndex + 1 < get().entries.length,

	serialize: () => {
		const { entries, currentIndex, maxHistory } = get();
		return {
			entries: entries
				.filter((e): e is PixelHistoryEntry => e.type === "pixel")
				.map((e) => ({
					id: e.id,
					name: e.name,
					timestamp: e.timestamp,
					layerId: e.layerId,
					changes: e.changes.map((c) => ({ index: c.index, before: c.before, after: c.after })),
				})),
			currentIndex,
			maxHistory,
		};
	},

	deserialize: (data) => {
		set({
			entries: data.entries.map((e) => ({
				type: "pixel" as const,
				id: e.id,
				name: e.name,
				timestamp: e.timestamp,
				layerId: e.layerId ?? "",
				changes: e.changes.map((c) => ({ index: c.index, before: c.before, after: c.after })),
			})),
			currentIndex: data.currentIndex,
			maxHistory: data.maxHistory,
			transaction: null,
		});
	},
}));
