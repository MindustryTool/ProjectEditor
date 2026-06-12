import { useState, useCallback, useRef, useEffect } from "react";
import { Eye, EyeOff, Lock, Unlock, Pencil, FolderOpen, FolderClosed } from "lucide-react";
import type { Layer } from "../utils/pixel-canvas";

interface LayerItemProps {
  layer: Layer;
  isActive: boolean;
  depth: number;
  isGroup: boolean;
  canvasWidth: number;
  canvasHeight: number;
  onClick: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onRename: (name: string) => void;
  onToggleExpand: () => void;
}

export function LayerItem({ layer, isActive, depth, isGroup, canvasWidth, canvasHeight, onClick, onToggleVisibility, onToggleLock, onRename, onToggleExpand }: LayerItemProps) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(layer.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const handleRename = useCallback(() => {
    if (editName.trim()) onRename(editName.trim());
    setEditing(false);
  }, [editName, onRename]);

  const thumbSize = Math.min(canvasWidth, 32);
  const srcWidth = Math.min(canvasWidth, 64);
  const thumbCanvas = document.createElement("canvas");
  thumbCanvas.width = thumbSize;
  thumbCanvas.height = thumbSize;
  const tCtx = thumbCanvas.getContext("2d");
  const hasCanvasData = layer.canvas.length > 0;
  if (tCtx && hasCanvasData && layer.visible) {
    const imageData = layer.canvas.toImageData();
    const clippedData = tCtx.createImageData(srcWidth, Math.min(canvasHeight, 64));
    for (let y = 0; y < Math.min(canvasHeight, 64); y++) {
      for (let x = 0; x < srcWidth; x++) {
        const srcIdx = (y * canvasWidth + x) * 4;
        const dstIdx = (y * srcWidth + x) * 4;
        clippedData.data[dstIdx] = imageData.data[srcIdx]!;
        clippedData.data[dstIdx + 1] = imageData.data[srcIdx + 1]!;
        clippedData.data[dstIdx + 2] = imageData.data[srcIdx + 2]!;
        clippedData.data[dstIdx + 3] = imageData.data[srcIdx + 3]!;
      }
    }
    tCtx.putImageData(clippedData, 0, 0);
  }

  return (
    <div
      className={`flex items-center gap-1 rounded px-1.5 py-1 text-xs cursor-pointer hover:bg-accent group ${isActive ? "bg-accent/80 font-medium ring-1 ring-inset ring-border" : ""}`}
      style={{ paddingLeft: `${8 + depth * 14}px` }}
      onClick={onClick}
    >
      {isGroup ? (
        <button
          className="shrink-0 text-muted-foreground hover:text-foreground"
          onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
          title={layer.expanded ? "Collapse Group" : "Expand Group"}
        >
          {layer.expanded ? <FolderOpen className="h-3.5 w-3.5" /> : <FolderClosed className="h-3.5 w-3.5" />}
        </button>
      ) : (
        <canvas
          width={thumbSize}
          height={thumbSize}
          className="shrink-0 rounded border"
          style={{ width: 18, height: 18, imageRendering: "pixelated" }}
          ref={(el) => {
            if (el && tCtx && hasCanvasData && layer.visible) {
              const ctx = el.getContext("2d");
              if (ctx) {
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(thumbCanvas, 0, 0, thumbSize, thumbSize, 0, 0, 18, 18);
              }
            }
          }}
        />
      )}
      <button
        className="shrink-0 text-muted-foreground hover:text-foreground"
        onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
        title={layer.visible ? "Hide Layer" : "Show Layer"}
      >
        {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3 text-muted-foreground/50" />}
      </button>
      <button
        className="shrink-0 text-muted-foreground hover:text-foreground"
        onClick={(e) => { e.stopPropagation(); onToggleLock(); }}
        title={layer.locked ? "Unlock Layer" : "Lock Layer"}
      >
        {layer.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3 text-muted-foreground/50" />}
      </button>
      {editing ? (
        <input
          ref={inputRef}
          className="flex-1 min-w-0 bg-transparent border-b border-foreground outline-none text-xs"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") setEditing(false); }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className="truncate flex-1"
          onDoubleClick={(e) => { e.stopPropagation(); setEditName(layer.name); setEditing(true); }}
        >
          {isGroup ? <span className="text-muted-foreground">[{layer.name}]</span> : layer.name}
        </span>
      )}
      <button
        className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
        onClick={(e) => { e.stopPropagation(); setEditName(layer.name); setEditing(true); }}
        title="Rename"
      >
        <Pencil className="h-3 w-3" />
      </button>
    </div>
  );
}
