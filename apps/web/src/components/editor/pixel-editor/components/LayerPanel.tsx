import { useState, useCallback, useRef, useEffect } from "react";
import { Eye, EyeOff, Lock, Unlock, Plus, Minus, Copy, Pencil, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, FolderOpen, FolderClosed, Group } from "lucide-react";
import { useLayerStore } from "../store/layer-store";
import { usePixelEditorStore } from "../store/pixel-editor-store";
import { useHistoryStore } from "../store/history-store";
import type { BlendMode, Layer } from "../utils/pixel-canvas";

export function LayerPanel() {
  const canvas = useLayerStore((s) => s.canvas);
  const setCurrentLayerById = useLayerStore((s) => s.setCurrentLayerById);
  const setLayerVisibility = useLayerStore((s) => s.setLayerVisibility);
  const setLayerLocked = useLayerStore((s) => s.setLayerLocked);
  const setLayerOpacity = useLayerStore((s) => s.setLayerOpacity);
  const setLayerBlendMode = useLayerStore((s) => s.setLayerBlendMode);
  const addLayer = useLayerStore((s) => s.addLayer);
  const removeLayer = useLayerStore((s) => s.removeLayer);
  const duplicateLayer = useLayerStore((s) => s.duplicateLayer);
  const renameLayer = useLayerStore((s) => s.renameLayer);
  const moveLayer = useLayerStore((s) => s.moveLayer);
  const createGroup = useLayerStore((s) => s.createGroup);
  const removeLayerFromGroup = useLayerStore((s) => s.removeLayerFromGroup);
  const setLayerExpanded = useLayerStore((s) => s.setLayerExpanded);
  const forceRender = useLayerStore((s) => s.forceRender);
  const setDirty = usePixelEditorStore((s) => s.setDirty);
  const pushSnapshot = useHistoryStore((s) => s.pushSnapshot);

  if (!canvas) return null;

  const flat = canvas.flatList();
  const currentIdx = canvas.currentLayerIndex;
  const currentLayer = canvas.currentLayer;
  const layerCount = flat.length;

  const snap = () => {
    if (canvas) pushSnapshot("Layer", JSON.stringify(canvas.serialize()));
  };

  const onRemove = () => {
    if (layerCount <= 1) return;
    removeLayer(currentIdx);
    setDirty(true);
    snap();
  };

  const onDuplicate = () => {
    duplicateLayer(currentIdx);
    forceRender();
    setDirty(true);
    snap();
  };

  const onAdd = () => {
    addLayer();
    forceRender();
    setDirty(true);
    snap();
  };

  const onCreateGroup = () => {
    createGroup();
    forceRender();
    setDirty(true);
    snap();
  };

  const onRemoveFromGroup = () => {
    removeLayerFromGroup(currentIdx);
    forceRender();
    setDirty(true);
    snap();
  };

  const onMoveUp = () => {
    if (currentIdx >= layerCount - 1) return;
    moveLayer(currentIdx, currentIdx + 1);
    forceRender();
    snap();
  };

  const onMoveDown = () => {
    if (currentIdx <= 0) return;
    moveLayer(currentIdx, currentIdx - 1);
    forceRender();
    snap();
  };

  const onMoveTop = () => {
    if (currentIdx >= layerCount - 1) return;
    moveLayer(currentIdx, layerCount - 1);
    forceRender();
    snap();
  };

  const onMoveBottom = () => {
    if (currentIdx <= 0) return;
    moveLayer(currentIdx, 0);
    forceRender();
    snap();
  };

  const renderTree = (nodes: Layer[], depth: number = 0) => {
    const items: React.ReactNode[] = [];
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i]!;
      const flatIdx = canvas.flatIndexOf(node.id);
      const isActive = node.id === currentLayer.id;
      const isGroup = node.children.length > 0;
      items.push(
        <LayerItem
          key={node.id}
          layer={node}
          isActive={isActive}
          depth={depth}
          isGroup={isGroup}
          canvasWidth={canvas.width}
          canvasHeight={canvas.height}
          onClick={() => { setCurrentLayerById(node.id); }}
          onToggleVisibility={() => { setLayerVisibility(flatIdx, !node.visible); forceRender(); snap(); }}
          onToggleLock={() => { setLayerLocked(flatIdx, !node.locked); snap(); }}
          onRename={(name) => renameLayer(flatIdx, name)}
          onToggleExpand={() => { setLayerExpanded(node.id, !node.expanded); forceRender(); }}
        />,
      );
      if (isGroup && node.expanded && node.children.length > 0) {
        items.push(...renderTree(node.children, depth + 1));
      }
    }
    return items;
  };

  return (
    <div className="w-56 border-l bg-card overflow-y-auto p-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Layers</span>
        <div className="flex gap-0.5">
          <button className="rounded p-1 hover:bg-accent" onClick={onAdd} title="New Layer">
            <Plus className="h-3 w-3" />
          </button>
          <button className="rounded p-1 hover:bg-accent" onClick={onCreateGroup} title="New Group">
            <FolderOpen className="h-3 w-3" />
          </button>
          <button className="rounded p-1 hover:bg-accent disabled:opacity-30" onClick={onRemove} disabled={layerCount <= 1} title="Delete Layer">
            <Minus className="h-3 w-3" />
          </button>
          <button className="rounded p-1 hover:bg-accent disabled:opacity-30" onClick={onDuplicate} disabled={currentLayer.children !== undefined} title="Duplicate Layer">
            <Copy className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="flex gap-0.5 justify-center flex-wrap">
        <button className="rounded p-1 hover:bg-accent disabled:opacity-30" onClick={onMoveUp} disabled={currentIdx >= layerCount - 1} title="Move Up">
          <ChevronUp className="h-3 w-3" />
        </button>
        <button className="rounded p-1 hover:bg-accent disabled:opacity-30" onClick={onMoveDown} disabled={currentIdx <= 0} title="Move Down">
          <ChevronDown className="h-3 w-3" />
        </button>
        <button className="rounded p-1 hover:bg-accent disabled:opacity-30" onClick={onMoveTop} disabled={currentIdx >= layerCount - 1} title="Move to Top">
          <ChevronsUp className="h-3 w-3" />
        </button>
        <button className="rounded p-1 hover:bg-accent disabled:opacity-30" onClick={onMoveBottom} disabled={currentIdx <= 0} title="Move to Bottom">
          <ChevronsDown className="h-3 w-3" />
        </button>
        <button className="rounded p-1 hover:bg-accent text-muted-foreground" onClick={onRemoveFromGroup} title="Remove from Group">
          <Group className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-1 max-h-60 overflow-y-auto">
        {renderTree(canvas.layers)}
      </div>

      {currentIdx >= 0 && currentIdx < layerCount && (
        <div className="space-y-2 pt-2 border-t">
          <div>
            <label className="text-[10px] text-muted-foreground block mb-0.5">Opacity: {Math.round(currentLayer.opacity * 100)}%</label>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(currentLayer.opacity * 100)}
              onChange={(e) => { setLayerOpacity(currentIdx, Number(e.target.value) / 100); forceRender(); snap(); }}
              className="w-full h-3"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground block mb-0.5">Blend Mode</label>
            <select
              value={currentLayer.blendMode}
              onChange={(e) => { setLayerBlendMode(currentIdx, e.target.value as BlendMode); forceRender(); snap(); }}
              className="w-full text-xs rounded border bg-background px-1 py-0.5"
            >
              <option value="normal">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
              <option value="darken">Darken</option>
              <option value="lighten">Lighten</option>
              <option value="difference">Difference</option>
              <option value="additive">Additive</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

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

function LayerItem({ layer, isActive, depth, isGroup, canvasWidth, canvasHeight, onClick, onToggleVisibility, onToggleLock, onRename, onToggleExpand }: LayerItemProps) {
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

  const thumbnailData = layer.data.length > 0 ? layer.data.slice(0, Math.min(layer.data.length, 64 * 64 * 4)) : null;
  const thumbSize = Math.min(canvasWidth, 32);
  const srcWidth = Math.min(canvasWidth, 64);
  const thumbCanvas = document.createElement("canvas");
  thumbCanvas.width = thumbSize;
  thumbCanvas.height = thumbSize;
  const tCtx = thumbCanvas.getContext("2d");
  if (tCtx && thumbnailData && layer.visible) {
    const imageData = tCtx.createImageData(srcWidth, Math.min(canvasHeight, 64));
    imageData.data.set(thumbnailData);
    tCtx.putImageData(imageData, 0, 0);
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
            if (el && tCtx && thumbnailData && layer.visible) {
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
