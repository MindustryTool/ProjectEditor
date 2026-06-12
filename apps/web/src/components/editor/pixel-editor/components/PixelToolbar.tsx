import { FilePlus, Save, Undo, Redo, Pencil, Eraser, PaintBucket, Droplet, Minus, Square, Circle, Sparkles, Hand, ArrowUpDown, Grid3x3, Grid2X2, Ruler, TableProperties, Crop, Orbit, Wand2, VenetianMask, MousePointer2, Copy, Scissors, Clipboard, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Maximize2 } from "lucide-react";
import { usePixelEditorStore, type ToolType, type BrushShape } from "../store/pixel-editor-store";
import { useLayerStore } from "../store/layer-store";
import { ColorSwatch } from "./ColorSwatch";
import { useHistoryStore } from "../store/history-store";

interface SelectionToolActions {
  deleteSelection: () => void;
  fillSelection: (color: string) => void;
  copySelection: () => void;
  cutSelection: () => void;
  pasteSelection: (inPlace?: boolean) => void;
  selectAll: () => void;
  deselect: () => void;
  applyRotate: (angle: number) => void;
  applyFlip: (direction: "horizontal" | "vertical") => void;
}

interface PixelToolbarProps {
  onSave: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  selectionTools: SelectionToolActions;
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
  { id: "curve", label: "Curve", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: "spray", label: "Spray", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: "hand", label: "Hand", icon: <Hand className="h-3.5 w-3.5" /> },
  { id: "move", label: "Move", icon: <MousePointer2 className="h-3.5 w-3.5" /> },
  { id: "select-rect", label: "Sel Rect", icon: <Crop className="h-3.5 w-3.5" /> },
  { id: "select-ellipse", label: "Sel Ellipse", icon: <Orbit className="h-3.5 w-3.5" /> },
  { id: "magic-wand", label: "Magic Wand", icon: <Wand2 className="h-3.5 w-3.5" /> },
  { id: "color-select", label: "Color Sel", icon: <VenetianMask className="h-3.5 w-3.5" /> },
  { id: "lasso", label: "Lasso", icon: <Scissors className="h-3.5 w-3.5" /> },
  { id: "polygon", label: "Polygon", icon: <Copy className="h-3.5 w-3.5" /> },
  { id: "brush", label: "Brush", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: "scale", label: "Scale", icon: <Maximize2 className="h-3.5 w-3.5" /> },
];

export function PixelToolbar({ onSave, onUndo, onRedo, selectionTools: selTools }: PixelToolbarProps) {
  const tool = usePixelEditorStore((s) => s.tool);
  const setTool = usePixelEditorStore((s) => s.setTool);
  const foregroundColor = usePixelEditorStore((s) => s.foregroundColor);
  const backgroundColor = usePixelEditorStore((s) => s.backgroundColor);
  const swapColors = usePixelEditorStore((s) => s.swapColors);
  const setForegroundColor = usePixelEditorStore((s) => s.setForegroundColor);
  const setBackgroundColor = usePixelEditorStore((s) => s.setBackgroundColor);
  const brushSize = usePixelEditorStore((s) => s.brushSize);
  const setBrushSize = usePixelEditorStore((s) => s.setBrushSize);
  const brushOpacity = usePixelEditorStore((s) => s.brushOpacity);
  const setBrushOpacity = usePixelEditorStore((s) => s.setBrushOpacity);
  const brushFlow = usePixelEditorStore((s) => s.brushFlow);
  const setBrushFlow = usePixelEditorStore((s) => s.setBrushFlow);
  const brushShape = usePixelEditorStore((s) => s.brushShape);
  const setBrushShape = usePixelEditorStore((s) => s.setBrushShape);
  const tolerance = usePixelEditorStore((s) => s.tolerance);
  const setTolerance = usePixelEditorStore((s) => s.setTolerance);
  const gridVisible = usePixelEditorStore((s) => s.gridVisible);
  const toggleGrid = usePixelEditorStore((s) => s.toggleGrid);
  const checkerboardVisible = usePixelEditorStore((s) => s.checkerboardVisible);
  const toggleCheckerboard = usePixelEditorStore((s) => s.toggleCheckerboard);
  const canvas = useLayerStore((s) => s.canvas);
  const selectionMode = canvas?.selectionMode ?? "new";
  const selectionBounds = canvas?.selectionBounds ?? null;
  const sprayDensity = usePixelEditorStore((s) => s.sprayDensity);
  const setSprayDensity = usePixelEditorStore((s) => s.setSprayDensity);
  const sprayRadius = usePixelEditorStore((s) => s.sprayRadius);
  const setSprayRadius = usePixelEditorStore((s) => s.setSprayRadius);
  const pixelGridVisible = usePixelEditorStore((s) => s.pixelGridVisible);
  const togglePixelGrid = usePixelEditorStore((s) => s.togglePixelGrid);
  const rulersVisible = usePixelEditorStore((s) => s.rulersVisible);
  const toggleRulers = usePixelEditorStore((s) => s.toggleRulers);
  const pixelPerfect = usePixelEditorStore((s) => s.pixelPerfect);
  const setPixelPerfect = usePixelEditorStore((s) => s.setPixelPerfect);
  const symmetry = usePixelEditorStore((s) => s.symmetry);
  const setSymmetry = usePixelEditorStore((s) => s.setSymmetry);
  const symmetrySegments = usePixelEditorStore((s) => s.symmetrySegments);
  const setSymmetrySegments = usePixelEditorStore((s) => s.setSymmetrySegments);
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);
  const canUndo = useHistoryStore((s) => s.canUndo());
  const canRedo = useHistoryStore((s) => s.canRedo());
  const setShowNewDialog = usePixelEditorStore((s) => s.setShowNewCanvasDialog);
  const dirty = usePixelEditorStore((s) => s.dirty);

  const isSelectionTool = tool === "select-rect" || tool === "select-ellipse" || tool === "magic-wand" || tool === "color-select" || tool === "lasso" || tool === "polygon";
  const hasSelection = !!selectionBounds;

  return (
    <div className="flex h-9 min-h-9 max-h-9 items-center gap-0.5 border-b bg-card px-1 overflow-x-auto">
      <div className="flex items-center gap-0.5 border-r pr-1 mr-1">
        <button className="rounded p-1 hover:bg-accent" onClick={() => setShowNewDialog(true)} title="New">
          <FilePlus className="h-3.5 w-3.5" />
        </button>
        <button className="rounded p-1 hover:bg-accent" onClick={onSave} title="Save (Ctrl+S)">
          <Save className="h-3.5 w-3.5" />
        </button>
        <div className={`h-2 w-2 rounded-full ${dirty ? "bg-yellow-400" : "bg-green-500/30"}`} title={dirty ? "Unsaved changes" : "Saved"} />
      </div>

      <div className="flex items-center gap-0.5 border-r pr-1 mr-1">
        <button className="rounded p-1 hover:bg-accent disabled:opacity-30" onClick={onUndo ?? undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
          <Undo className="h-3.5 w-3.5" />
        </button>
        <button className="rounded p-1 hover:bg-accent disabled:opacity-30" onClick={onRedo ?? redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
          <Redo className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-0.5 border-r pr-1 mr-1">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            className={`min-w-[28px] min-h-[28px] md:min-w-0 md:min-h-0 rounded p-1 ${tool === t.id ? "bg-accent ring-1 ring-inset ring-border" : "hover:bg-accent"}`}
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

      {tool === "brush" && (
        <div className="flex items-center gap-1 border-r pr-1 mr-1">
          <label className="text-xs text-muted-foreground shrink-0">Op:</label>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(brushOpacity * 100)}
            onChange={(e) => setBrushOpacity(Number(e.target.value) / 100)}
            className="w-12 h-4"
            title="Brush Opacity"
          />
          <span className="text-xs font-mono w-5">{Math.round(brushOpacity * 100)}</span>
          <label className="text-xs text-muted-foreground shrink-0 ml-1">Flow:</label>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(brushFlow * 100)}
            onChange={(e) => setBrushFlow(Number(e.target.value) / 100)}
            className="w-12 h-4"
            title="Brush Flow"
          />
          <span className="text-xs font-mono w-5">{Math.round(brushFlow * 100)}</span>
          <label className="text-xs text-muted-foreground shrink-0 ml-1">Shape:</label>
          <select
            className="text-xs bg-transparent border border-border rounded px-1 py-0.5"
            value={brushShape}
            onChange={(e) => setBrushShape(e.target.value as BrushShape)}
            title="Brush Shape"
          >
            <option value="circle">Circle</option>
            <option value="square">Square</option>
            <option value="dither">Dither</option>
          </select>
        </div>
      )}

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

      {tool === "spray" && (
        <div className="flex items-center gap-1 border-r pr-1 mr-1">
          <label className="text-xs text-muted-foreground shrink-0">R:</label>
          <input
            type="range"
            min={1}
            max={50}
            value={sprayRadius}
            onChange={(e) => setSprayRadius(Number(e.target.value))}
            className="w-12 h-4"
            title="Spray Radius"
          />
          <span className="text-xs font-mono w-5">{sprayRadius}</span>
          <label className="text-xs text-muted-foreground shrink-0 ml-1">D:</label>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(sprayDensity * 100)}
            onChange={(e) => setSprayDensity(Number(e.target.value) / 100)}
            className="w-12 h-4"
            title="Spray Density"
          />
          <span className="text-xs font-mono w-5">{Math.round(sprayDensity * 100)}</span>
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
        <button
          className={`rounded p-1 ${pixelGridVisible ? "bg-accent" : "hover:bg-accent"}`}
          onClick={togglePixelGrid}
          title="Toggle Pixel Grid"
        >
          <Grid2X2 className="h-3.5 w-3.5" />
        </button>
        <button
          className={`rounded p-1 ${rulersVisible ? "bg-accent" : "hover:bg-accent"}`}
          onClick={toggleRulers}
          title="Toggle Rulers"
        >
          <Ruler className="h-3.5 w-3.5" />
        </button>
        <button
          className={`rounded p-1 ${pixelPerfect ? "bg-accent" : "hover:bg-accent"}`}
          onClick={() => setPixelPerfect(!pixelPerfect)}
          title="Toggle Pixel-Perfect"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-0.5 border-l pl-1 ml-1 text-xs">
        <span className="text-muted-foreground mr-0.5">Sym:</span>
        {(["none", "horizontal", "vertical", "radial"] as const).map((m) => (
          <button
            key={m}
            className={`rounded px-1.5 py-0.5 text-[10px] ${symmetry === m ? "bg-accent font-medium" : "hover:bg-accent"}`}
            onClick={() => setSymmetry(m)}
            title={`Symmetry: ${m}`}
          >
            {m === "none" ? "Off" : m === "horizontal" ? "H" : m === "vertical" ? "V" : "R"}
          </button>
        ))}
        {symmetry === "radial" && (
          <>
            <label className="text-xs text-muted-foreground ml-1">Seg:</label>
            <input
              type="range"
              min={2}
              max={32}
              value={symmetrySegments}
              onChange={(e) => setSymmetrySegments(Number(e.target.value))}
              className="w-12 h-4"
              title="Radial Segments"
            />
            <span className="text-xs font-mono w-5">{symmetrySegments}</span>
          </>
        )}
      </div>

       {isSelectionTool && (
         <div className="flex items-center gap-0.5 border-l pl-1 ml-1 text-xs">
           <span className="text-muted-foreground mr-0.5">Mode:</span>
           {(["new", "add", "subtract", "intersect"] as const).map((mode) => (
             <button
               key={mode}
               className={`rounded px-1.5 py-0.5 text-[10px] ${selectionMode === mode ? "bg-accent font-medium" : "hover:bg-accent"}`}
               onClick={() => {
                 if (canvas) {
                   canvas.selectionMode = mode;
                   useLayerStore.getState().forceRender();
                 }
               }}
               title={`Selection mode: ${mode}`}
             >
               {mode === "new" ? "New" : mode === "add" ? "+" : mode === "subtract" ? "-" : "∩"}
             </button>
           ))}
         </div>
       )}

      {hasSelection && (
        <div className="flex items-center gap-0.5 border-l pl-1 ml-1">
          <button className="rounded p-1 hover:bg-accent" onClick={() => selTools.cutSelection()} title="Cut">
            <Scissors className="h-3 w-3" />
          </button>
          <button className="rounded p-1 hover:bg-accent" onClick={() => selTools.copySelection()} title="Copy">
            <Copy className="h-3 w-3" />
          </button>
          <button className="rounded p-1 hover:bg-accent" onClick={() => selTools.pasteSelection()} title="Paste">
            <Clipboard className="h-3 w-3" />
          </button>
          <button className="rounded p-1 hover:bg-accent" onClick={() => selTools.deleteSelection()} title="Delete">
            <Minus className="h-3 w-3" />
          </button>
          <button className="rounded p-1 hover:bg-accent" onClick={() => selTools.selectAll()} title="Select All (Ctrl+A)">
            <Square className="h-3 w-3" />
          </button>
          <button className="rounded p-1 hover:bg-accent" onClick={() => selTools.deselect()} title="Deselect (Ctrl+D)">
            <Orbit className="h-3 w-3" />
          </button>
        </div>
      )}
      {hasSelection && (
        <div className="flex items-center gap-0.5 border-l pl-1 ml-1">
          <button className="rounded p-1 hover:bg-accent" onClick={() => selTools.applyRotate(-90)} title="Rotate 90° CCW (Ctrl+Shift+R)">
            <RotateCcw className="h-3 w-3" />
          </button>
          <button className="rounded p-1 hover:bg-accent" onClick={() => selTools.applyRotate(90)} title="Rotate 90° CW (Ctrl+R)">
            <RotateCw className="h-3 w-3" />
          </button>
          <button className="rounded p-1 hover:bg-accent" onClick={() => selTools.applyFlip("horizontal")} title="Flip Horizontal (Ctrl+H)">
            <FlipHorizontal className="h-3 w-3" />
          </button>
          <button className="rounded p-1 hover:bg-accent" onClick={() => selTools.applyFlip("vertical")} title="Flip Vertical (Ctrl+Shift+H)">
            <FlipVertical className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
