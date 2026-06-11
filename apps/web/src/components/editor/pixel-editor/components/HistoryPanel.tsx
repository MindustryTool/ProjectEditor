import { History, RotateCcw, Trash2 } from "lucide-react";
import { useHistoryStore } from "../store/history-store";
import { PixelCanvas, PixelDocument } from "../utils/pixel-canvas";
import { useLayerStore } from "../store/layer-store";

export function HistoryPanel() {
  const history = useHistoryStore((s) => s.history);
  const currentHistoryIndex = useHistoryStore((s) => s.currentHistoryIndex);
  const jumpTo = useHistoryStore((s) => s.jumpTo);
  const clear = useHistoryStore((s) => s.clear);
  const undoStack = useHistoryStore((s) => s.undoStack);
  const redoStack = useHistoryStore((s) => s.redoStack);

  const allEntries: { name: string; index: number; isCurrent: boolean; isFuture: boolean }[] = [];

  const pastCount = currentHistoryIndex + 1;
  for (let i = 0; i < history.length; i++) {
    allEntries.push({
      name: history[i]!.name,
      index: i,
      isCurrent: i === currentHistoryIndex,
      isFuture: i > currentHistoryIndex,
    });
  }

  const recentCommands = undoStack.map((cmd, i) => ({
    name: cmd.name,
    isUndo: true as const,
    order: undoStack.length - i,
  }));

  const redoCommands = [...redoStack].reverse().map((cmd, i) => ({
    name: cmd.name,
    isUndo: false as const,
    order: i + 1,
  }));

  return (
    <div className="w-48 border-l bg-card overflow-y-auto p-2 space-y-2 flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <History className="h-3 w-3" />
          History
        </span>
        <button
          className="rounded p-1 hover:bg-accent disabled:opacity-30"
          onClick={clear}
          disabled={history.length === 0 && undoStack.length === 0}
          title="Clear history"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      {allEntries.length === 0 && recentCommands.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">No history yet</p>
      )}

      {recentCommands.length > 0 && (
        <div className="space-y-0.5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Recent actions</span>
          {recentCommands.map((cmd) => (
            <div
              key={`undo-${cmd.order}`}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground"
            >
              <RotateCcw className="h-2.5 w-2.5 shrink-0" />
              <span className="truncate">{cmd.name}</span>
            </div>
          ))}
        </div>
      )}

      {allEntries.length > 0 && (
        <div className="space-y-0.5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Snapshots</span>
          {allEntries.map((entry) => (
            <button
              key={entry.index}
              className={`w-full text-left flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-accent ${
                entry.isCurrent
                  ? "bg-accent font-medium text-foreground"
                  : entry.isFuture
                    ? "text-muted-foreground/50"
                    : "text-muted-foreground"
              }`}
              onClick={() => {
                const snapshot = history[entry.index];
                if (snapshot) {
                  const serialized = JSON.parse(snapshot.canvasState);
                  const restored = PixelCanvas.deserialize(serialized);
                  useLayerStore.getState().setDocument(new PixelDocument(restored));
                }
                jumpTo(entry.index);
              }}
              title={`Jump to: ${entry.name}`}
            >
              <span className="w-4 text-[10px] text-muted-foreground shrink-0">{entry.index + 1}</span>
              <span className="truncate">{entry.name}</span>
              {entry.isCurrent && <span className="ml-auto text-[10px] text-primary">current</span>}
            </button>
          ))}
        </div>
      )}

      {redoCommands.length > 0 && (
        <div className="space-y-0.5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Redo</span>
          {redoCommands.map((cmd) => (
            <div
              key={`redo-${cmd.order}`}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground/50"
            >
              <RotateCcw className="h-2.5 w-2.5 shrink-0" />
              <span className="truncate">{cmd.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
