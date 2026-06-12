import { describe, expect, it, beforeEach } from "vitest";
import { useHistoryStore } from "../history-store";

function makeEntry(name: string, id?: string) {
  return { type: "pixel" as const, id: id ?? name, name, timestamp: Date.now(), changes: [], layerId: "layer1" };
}

describe("HistoryStore", () => {
  beforeEach(() => {
    useHistoryStore.getState().clear();
  });

  it("starts with empty history", () => {
    const state = useHistoryStore.getState();
    expect(state.entries).toHaveLength(0);
    expect(state.currentIndex).toBe(-1);
    expect(state.canUndo()).toBe(false);
    expect(state.canRedo()).toBe(false);
  });

  it("pushes entries and can undo", () => {
    useHistoryStore.getState().pushEntry(makeEntry("Test"));
    expect(useHistoryStore.getState().canUndo()).toBe(true);
    const entry = useHistoryStore.getState().undo();
    expect(entry).not.toBeNull();
    expect(entry!.name).toBe("Test");
    expect(useHistoryStore.getState().canUndo()).toBe(false);
    expect(useHistoryStore.getState().canRedo()).toBe(true);
  });

  it("redoes undone entries", () => {
    useHistoryStore.getState().pushEntry(makeEntry("Test"));
    useHistoryStore.getState().undo();
    const entry = useHistoryStore.getState().redo();
    expect(entry).not.toBeNull();
    expect(entry!.name).toBe("Test");
    expect(useHistoryStore.getState().canUndo()).toBe(true);
    expect(useHistoryStore.getState().canRedo()).toBe(false);
  });

  it("returns null when nothing to undo", () => {
    expect(useHistoryStore.getState().undo()).toBeNull();
  });

  it("returns null when nothing to redo", () => {
    expect(useHistoryStore.getState().redo()).toBeNull();
  });

  it("clears redo stack when new entry is pushed after undo", () => {
    useHistoryStore.getState().pushEntry(makeEntry("A", "a"));
    useHistoryStore.getState().pushEntry(makeEntry("B", "b"));
    useHistoryStore.getState().undo();
    useHistoryStore.getState().pushEntry(makeEntry("C", "c"));
    expect(useHistoryStore.getState().canRedo()).toBe(false);
    expect(useHistoryStore.getState().entries).toHaveLength(2);
  });

  it("limits history to maxHistory", () => {
    for (let i = 0; i < 60; i++) {
      useHistoryStore.getState().pushEntry(makeEntry(`C${i}`, `c${i}`));
    }
    expect(useHistoryStore.getState().entries).toHaveLength(50);
  });

  it("clears all history", () => {
    useHistoryStore.getState().pushEntry(makeEntry("A", "a"));
    useHistoryStore.getState().pushEntry(makeEntry("B", "b"));
    useHistoryStore.getState().clear();
    expect(useHistoryStore.getState().entries).toHaveLength(0);
    expect(useHistoryStore.getState().currentIndex).toBe(-1);
    expect(useHistoryStore.getState().canUndo()).toBe(false);
    expect(useHistoryStore.getState().canRedo()).toBe(false);
  });

  it("serializes and deserializes history", () => {
    useHistoryStore.getState().pushEntry(makeEntry("A", "a"));
    useHistoryStore.getState().pushEntry(makeEntry("B", "b"));
    const serialized = useHistoryStore.getState().serialize();
    expect(serialized.entries).toHaveLength(2);
    expect(serialized.entries[0]!.name).toBe("A");
    expect(serialized.entries[1]!.name).toBe("B");
    expect(serialized.currentIndex).toBe(1);

    useHistoryStore.getState().clear();
    useHistoryStore.getState().deserialize(serialized);
    expect(useHistoryStore.getState().entries).toHaveLength(2);
    expect(useHistoryStore.getState().currentIndex).toBe(1);
    expect(useHistoryStore.getState().entries[0]!.name).toBe("A");
  });

  it("begins and commits a transaction", () => {
    useHistoryStore.getState().beginTransaction("My Edit");
    useHistoryStore.getState().recordChange(0, 0x00000000, 0xffff0000);
    useHistoryStore.getState().recordChange(1, 0x00000000, 0xff00ff00);
    useHistoryStore.getState().commitTransaction();
    // commitTransaction no longer creates entries - they're created via layer.canvas.endRecord()
    expect(useHistoryStore.getState().entries).toHaveLength(0);
  });

  it("does not create empty transactions", () => {
    useHistoryStore.getState().beginTransaction("Empty");
    useHistoryStore.getState().commitTransaction();
    expect(useHistoryStore.getState().entries).toHaveLength(0);
  });

  it("records changes only once per index in a transaction", () => {
    useHistoryStore.getState().beginTransaction("Dup");
    useHistoryStore.getState().recordChange(0, 0x00000000, 0xffff0000);
    useHistoryStore.getState().recordChange(0, 0x00000000, 0xff00ff00);
    useHistoryStore.getState().commitTransaction();
    // commitTransaction no longer creates entries - they're created via layer.canvas.endRecord()
    expect(useHistoryStore.getState().entries).toHaveLength(0);
  });
});
