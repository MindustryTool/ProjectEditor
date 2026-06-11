import { describe, expect, it, beforeEach } from "vitest";
import { useHistoryStore } from "../history-store";

describe("HistoryStore", () => {
  beforeEach(() => {
    useHistoryStore.getState().clear();
  });

  it("starts with empty stacks", () => {
    const state = useHistoryStore.getState();
    expect(state.undoStack).toHaveLength(0);
    expect(state.redoStack).toHaveLength(0);
    expect(state.canUndo()).toBe(false);
    expect(state.canRedo()).toBe(false);
  });

  it("pushes commands and can undo", () => {
    let executed = false;
    useHistoryStore.getState().pushCommand({
      name: "Test",
      do: () => {},
      undo: () => { executed = true; },
    });
    expect(useHistoryStore.getState().canUndo()).toBe(true);
    useHistoryStore.getState().undo();
    expect(executed).toBe(true);
    expect(useHistoryStore.getState().canUndo()).toBe(false);
    expect(useHistoryStore.getState().canRedo()).toBe(true);
  });

  it("redoes undone commands", () => {
    let executed = false;
    useHistoryStore.getState().pushCommand({
      name: "Test",
      do: () => { executed = true; },
      undo: () => {},
    });
    useHistoryStore.getState().undo();
    executed = false;
    useHistoryStore.getState().redo();
    expect(executed).toBe(true);
  });

  it("clears redo stack when new command is pushed after undo", () => {
    useHistoryStore.getState().pushCommand({ name: "A", do: () => {}, undo: () => {} });
    useHistoryStore.getState().pushCommand({ name: "B", do: () => {}, undo: () => {} });
    useHistoryStore.getState().undo();
    useHistoryStore.getState().pushCommand({ name: "C", do: () => {}, undo: () => {} });
    expect(useHistoryStore.getState().canRedo()).toBe(false);
    expect(useHistoryStore.getState().undoStack).toHaveLength(2);
  });

  it("limits history to maxHistory", () => {
    for (let i = 0; i < 60; i++) {
      useHistoryStore.getState().pushCommand({ name: `C${i}`, do: () => {}, undo: () => {} });
    }
    expect(useHistoryStore.getState().undoStack).toHaveLength(50);
  });

  it("clears all history", () => {
    useHistoryStore.getState().pushCommand({ name: "A", do: () => {}, undo: () => {} });
    useHistoryStore.getState().pushCommand({ name: "B", do: () => {}, undo: () => {} });
    useHistoryStore.getState().clear();
    expect(useHistoryStore.getState().undoStack).toHaveLength(0);
    expect(useHistoryStore.getState().redoStack).toHaveLength(0);
  });
});
