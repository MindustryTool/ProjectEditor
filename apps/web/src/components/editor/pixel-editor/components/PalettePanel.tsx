import { useCallback, useRef, useState } from "react";
import { Lock, Unlock, Plus, Trash2, GripVertical, Upload, Download, ArrowUpDown } from "lucide-react";
import { usePixelEditorStore } from "../store/pixel-editor-store";
import { useLayerStore } from "../store/layer-store";
import { parseGpl, serializeGpl, parseHexList, serializeHexList, generatePaletteFromImage, sortByHue, sortBySaturation, sortByBrightness } from "../utils/palette-utils";

export function PalettePanel() {
  const palette = usePixelEditorStore((s) => s.palette);
  const lockedColors = usePixelEditorStore((s) => s.lockedColors);
  const foregroundColor = usePixelEditorStore((s) => s.foregroundColor);
  const setForegroundColor = usePixelEditorStore((s) => s.setForegroundColor);
  const setBackgroundColor = usePixelEditorStore((s) => s.setBackgroundColor);
  const addPaletteColor = usePixelEditorStore((s) => s.addPaletteColor);
  const removePaletteColor = usePixelEditorStore((s) => s.removePaletteColor);
  const reorderPalette = usePixelEditorStore((s) => s.reorderPalette);
  const toggleLockColor = usePixelEditorStore((s) => s.toggleLockColor);
  const setPalette = usePixelEditorStore((s) => s.setPalette);
  const canvas = useLayerStore((s) => s.canvas);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSwatchClick = (color: string, button: number) => {
    if (button === 2) {
      setBackgroundColor(color);
    } else {
      setForegroundColor(color);
    }
  };

  const addCurrentColor = () => {
    if (palette.includes(foregroundColor)) return;
    if (palette.length >= 64) return;
    addPaletteColor(foregroundColor);
  };

  const handleDragStart = (index: number) => {
    setDragIdx(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === index) return;
    reorderPalette(dragIdx, index);
    setDragIdx(index);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
  };

  const handleImportFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      let colors: string[];
      if (file.name.endsWith(".gpl") || text.startsWith("GIMP")) {
        colors = parseGpl(text);
      } else {
        colors = parseHexList(text);
      }
      if (colors.length > 0) {
        const merged = [...palette];
        for (const c of colors) {
          if (!merged.includes(c) && merged.length < 64) merged.push(c);
        }
        setPalette(merged);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }, [palette, setPalette]);

  const handleExportGpl = useCallback(() => {
    const text = serializeGpl(palette, "Pixel Editor Palette");
    downloadText(text, "palette.gpl", "application/x-gimp-palette");
  }, [palette]);

  const handleExportHex = useCallback(() => {
    const text = serializeHexList(palette);
    downloadText(text, "palette.txt", "text/plain");
  }, [palette]);

  const handleGenerateFromImage = useCallback(() => {
    if (!canvas) return;
    const data = canvas.getCompositeData();
    const colors = generatePaletteFromImage(data, 32);
    const merged = [...palette];
    for (const c of colors) {
      if (!merged.includes(c) && merged.length < 64) merged.push(c);
    }
    setPalette(merged);
  }, [canvas, palette, setPalette]);

  const handleSort = useCallback((method: "hue" | "saturation" | "brightness") => {
    let sorted: string[];
    switch (method) {
      case "hue": sorted = sortByHue(palette); break;
      case "saturation": sorted = sortBySaturation(palette); break;
      case "brightness": sorted = sortByBrightness(palette); break;
    }
    setPalette(sorted);
  }, [palette, setPalette]);

  return (
    <div className="w-48 border-r bg-card overflow-y-auto p-2 space-y-2 flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <span className="text-xs font-medium text-muted-foreground">Palette</span>
        <div className="flex items-center gap-0.5">
          <button className="rounded p-1 hover:bg-accent" onClick={addCurrentColor} title="Add current color">
            <Plus className="h-3 w-3" />
          </button>
          <div className="relative">
            <button className="rounded p-1 hover:bg-accent" onClick={() => fileInputRef.current?.click()} title="Import palette">
              <Upload className="h-3 w-3" />
            </button>
            <input ref={fileInputRef} type="file" accept=".gpl,.txt,.hex" className="hidden" onChange={handleImportFile} />
          </div>
          <div className="relative group">
            <button className="rounded p-1 hover:bg-accent" title="Export palette">
              <Download className="h-3 w-3" />
            </button>
            <div className="absolute right-0 top-full z-50 mt-1 hidden group-hover:block bg-popover border border-border rounded-md shadow-md min-w-[140px]">
              <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent" onClick={handleExportGpl}>Export GPL</button>
              <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent" onClick={handleExportHex}>Export Hex List</button>
            </div>
          </div>
          <div className="relative group">
            <button className="rounded p-1 hover:bg-accent" title="Sort palette">
              <ArrowUpDown className="h-3 w-3" />
            </button>
            <div className="absolute right-0 top-full z-50 mt-1 hidden group-hover:block bg-popover border border-border rounded-md shadow-md min-w-[140px]">
              <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent" onClick={() => handleSort("hue")}>Sort by Hue</button>
              <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent" onClick={() => handleSort("saturation")}>Sort by Saturation</button>
              <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent" onClick={() => handleSort("brightness")}>Sort by Brightness</button>
            </div>
          </div>
        </div>
      </div>
      <button className="w-full text-left px-2 py-1 text-xs text-muted-foreground hover:bg-accent rounded shrink-0" onClick={handleGenerateFromImage}>
        Generate from image
      </button>
      <div className="grid grid-cols-4 gap-1">
        {palette.map((color, i) => (
          <div
            key={`${color}-${i}`}
            className="relative group cursor-pointer rounded border border-border hover:ring-1 hover:ring-ring"
            style={{ width: "100%", aspectRatio: "1", backgroundColor: color }}
            onClick={(e) => handleSwatchClick(color, e.button)}
            onContextMenu={(e) => { e.preventDefault(); handleSwatchClick(color, 2); }}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            title={color}
          >
            <button
              className="absolute -top-1 -right-1 rounded-full bg-background border border-border p-0.5 opacity-0 group-hover:opacity-100 hover:bg-accent"
              onClick={(e) => { e.stopPropagation(); removePaletteColor(i); }}
              title="Remove color"
            >
              <Trash2 className="h-2 w-2" />
            </button>
            <button
              className="absolute -bottom-1 -right-1 rounded-full bg-background border border-border p-0.5 opacity-0 group-hover:opacity-100 hover:bg-accent"
              onClick={(e) => { e.stopPropagation(); toggleLockColor(i); }}
              title={lockedColors.includes(i) ? "Unlock" : "Lock"}
            >
              {lockedColors.includes(i) ? <Lock className="h-2 w-2" /> : <Unlock className="h-2 w-2" />}
            </button>
            <div className="absolute top-0 left-0 opacity-0 group-hover:opacity-100">
              <GripVertical className="h-2 w-2 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function downloadText(text: string, filename: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
