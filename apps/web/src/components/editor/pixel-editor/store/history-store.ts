import { create } from "zustand";

export interface HistoryCommand {
  name: string;
  do: () => void;
  undo: () => void;
}

export interface HistorySnapshot {
  name: string;
  canvasState: string;
}

export interface HistoryStore {
  undoStack: HistoryCommand[];
  redoStack: HistoryCommand[];
  history: HistorySnapshot[];
  currentHistoryIndex: number;
  maxHistory: number;
  pushCommand: (command: HistoryCommand) => void;
  pushSnapshot: (name: string, canvasState: string) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  jumpTo: (index: number) => void;
}

export const useHistoryStore = create<HistoryStore>()((set, get) => ({
  undoStack: [],
  redoStack: [],
  history: [],
  currentHistoryIndex: -1,
  maxHistory: 50,

  pushCommand: (command) => {
    set((state) => {
      const newStack = [...state.undoStack, command];
      if (newStack.length > state.maxHistory) {
        newStack.shift();
      }
      return { undoStack: newStack, redoStack: [] };
    });
  },

  pushSnapshot: (name, canvasState) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.currentHistoryIndex + 1);
      newHistory.push({ name, canvasState });
      if (newHistory.length > state.maxHistory) {
        newHistory.shift();
      }
      return {
        history: newHistory,
        currentHistoryIndex: newHistory.length - 1,
      };
    });
  },

  undo: () => {
    const { undoStack } = get();
    if (undoStack.length === 0) return;
    const command = undoStack[undoStack.length - 1]!;
    command.undo();
    set((state) => ({
      undoStack: state.undoStack.slice(0, -1),
      redoStack: [...state.redoStack, command],
    }));
  },

  redo: () => {
    const { redoStack } = get();
    if (redoStack.length === 0) return;
    const command = redoStack[redoStack.length - 1]!;
    command.do();
    set((state) => ({
      redoStack: state.redoStack.slice(0, -1),
      undoStack: [...state.undoStack, command],
    }));
  },

  clear: () => set({ undoStack: [], redoStack: [], history: [], currentHistoryIndex: -1 }),

  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,

  jumpTo: (index) => {
    const { history } = get();
    if (index < 0 || index >= history.length) return;
    set({ currentHistoryIndex: index, undoStack: [], redoStack: [] });
  },
}));
