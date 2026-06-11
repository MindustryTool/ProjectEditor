import { FilePlus, Save, Undo, Redo, Pencil, Eraser, PaintBucket, Droplet, Minus, Square, Circle, Sparkles, Hand, ArrowUpDown, Grid3x3, TableProperties } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover";
import { ColorEditor } from "./ColorEditor";
import { usePixelEditorStore, type ToolType } from "../store/pixel-editor-store";
import { useHistoryStore } from "../store/history-store";

interface PixelToolbarProps {
  onSave: () => void;
}

const TOOLS: { id: ToolType; label: string; icon: React.ReactNode }[] = [
  { id: "pencil", label: "Pencil", icon: <Pencil className="h-3.5 w-3.5" /> },
  { id: "eraser", label: "Eraser", icon: <Eraser className="h-3.5 w-3.5" /> },
  { id: "fill-bucket", label: "Fill", icon: <PaintBucket className="h-3.5 w-3.5" /> },
  { id: "color-picker", label: "Picker", icon: <Droplet className="h-3.5 w-3.5" /> },
  { id: "line", label: "Line", icon: <Minus className="h-3.5 w-3.5" /> },
  { id: "rectangle", label: "Rect", icon: <Square className="h-3.5 w-3.5" /> },
  { id: "filled-rectangle", label: "Fill Rect", icon: <Square className="h-3.5 w-3.5 fill-current" /> },
  { id: "circle", label: "Circle", icon: <Circle className="h-3.5 w-3.5" /> },
  { id: "filled-circle", label: "Fill Circ", icon: <Circle className="h-3.5 w-3.5 fill-current" /> },
  { id: "ellipse", label: "Ellipse", icon: <Circle className="h-3.5 w-3.5 -scale-x-50" /> },
  { id: "filled-ellipse", label: "Fill Ellip", icon: <Circle className="h-3.5 w-3.5 -scale-x-50 fill-current" /> },
  { id: "spray", label: "Spray", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: "hand", label: "Hand", icon: <Hand className="h-3.5 w-3.5" /> },
];

function ColorSwatch({ color, onChange, label }: { color: string; onChange: (c: string) => void; label: string }) {
  return (
    <Popover>
      <PopoverTrigger className="rounded border border-border cursor-pointer overflow-hidden shrink-0 hover:ring-1 hover:ring-ring transition-shadow" style={{ width: 22, height: 22, backgroundColor: color }} title={label} />
      <PopoverContent className="w-72 p-3" side="bottom" align="start">
        <ColorEditor value={color} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
}

export function PixelToolbar({ onSave }: PixelToolbarProps) {
  const tool = usePixelEditorStore((s) => s.tool);
  const setTool = usePixelEditorStore((s) => s.setTool);
  const foregroundColor = usePixelEditorStore((s) => s.foregroundColor);
  const backgroundColor = usePixelEditorStore((s) => s.backgroundColor);
  const swapColors = usePixelEditorStore((s) => s.swapColors);
  const setForegroundColor = usePixelEditorStore((s) => s.setForegroundColor);
  const setBackgroundColor = usePixelEditorStore((s) => s.setBackgroundColor);
  const brushSize = usePixelEditorStore((s) => s.brushSize);
  const setBrushSize = usePixelEditorStore((s) => s.setBrushSize);
  const tolerance = usePixelEditorStore((s) => s.tolerance);
  const setTolerance = usePixelEditorStore((s) => s.setTolerance);
  const gridVisible = usePixelEditorStore((s) => s.gridVisible);
  const toggleGrid = usePixelEditorStore((s) => s.toggleGrid);
  const checkerboardVisible = usePixelEditorStore((s) => s.checkerboardVisible);
  const toggleCheckerboard = usePixelEditorStore((s) => s.toggleCheckerboard);
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);
  const canUndo = useHistoryStore((s) => s.undoStack.length > 0);
  const canRedo = useHistoryStore((s) => s.redoStack.length > 0);
  const setShowNewDialog = usePixelEditorStore((s) => s.setShowNewCanvasDialog);

  return (
    <div className="flex h-9 min-h-9 max-h-9 items-center gap-0.5 border-b bg-card px-1 overflow-x-auto">
      <div className="flex items-center gap-0.5 border-r pr-1 mr-1">
        <button className="rounded p-1 hover:bg-accent" onClick={() => setShowNewDialog(true)} title="New">
          <FilePlus className="h-3.5 w-3.5" />
        </button>
        <button className="rounded p-1 hover:bg-accent" onClick={onSave} title="Save (Ctrl+S)">
          <Save className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-0.5 border-r pr-1 mr-1">
        <button className="rounded p-1 hover:bg-accent disabled:opacity-30" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
          <Undo className="h-3.5 w-3.5" />
        </button>
        <button className="rounded p-1 hover:bg-accent disabled:opacity-30" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
          <Redo className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-0.5 border-r pr-1 mr-1">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            className={`rounded p-1 ${tool === t.id ? "bg-accent ring-1 ring-inset ring-border" : "hover:bg-accent"}`}
            onClick={() => setTool(t.id)}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 border-r pr-1 mr-1">
        <ColorSwatch color={foregroundColor} onChange={setForegroundColor} label="Foreground Color" />
        <button className="rounded p-1 hover:bg-accent" onClick={swapColors} title="Swap (X)">
          <ArrowUpDown className="h-3 w-3" />
        </button>
        <ColorSwatch color={backgroundColor} onChange={setBackgroundColor} label="Background Color" />
      </div>

      <div className="flex items-center gap-1 border-r pr-1 mr-1">
        <label className="text-xs text-muted-foreground shrink-0">Size:</label>
        <input
          type="range"
          min={1}
          max={50}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-12 h-4"
          title="Brush Size"
        />
        <span className="text-xs font-mono w-4">{brushSize}</span>
      </div>

      {tool === "fill-bucket" && (
        <div className="flex items-center gap-1 border-r pr-1 mr-1">
          <label className="text-xs text-muted-foreground shrink-0">Tol:</label>
          <input
            type="range"
            min={0}
            max={255}
            value={tolerance}
            onChange={(e) => setTolerance(Number(e.target.value))}
            className="w-12 h-4"
            title="Fill Tolerance"
          />
          <span className="text-xs font-mono w-6">{tolerance}</span>
        </div>
      )}

      <div className="flex items-center gap-0.5">
        <button
          className={`rounded p-1 ${gridVisible ? "bg-accent" : "hover:bg-accent"}`}
          onClick={toggleGrid}
          title="Toggle Grid"
        >
          <Grid3x3 className="h-3.5 w-3.5" />
        </button>
        <button
          className={`rounded p-1 ${checkerboardVisible ? "bg-accent" : "hover:bg-accent"}`}
          onClick={toggleCheckerboard}
          title="Toggle Transparency"
        >
          <TableProperties className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
