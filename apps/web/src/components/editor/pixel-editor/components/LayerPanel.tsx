import { Plus, Minus, Copy, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, FolderOpen, Group } from "lucide-react";
import { useLayerStore } from "../store/layer-store";
import { usePixelEditorStore } from "../store/pixel-editor-store";
import { LayerItem } from "./LayerItem";
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

  if (!canvas) return null;

  const flat = canvas.flatList();
  const currentIdx = canvas.currentLayerIndex;
  const currentLayer = canvas.currentLayer;
  const layerCount = flat.length;

  const onRemove = () => {
    if (layerCount <= 1) return;
    removeLayer(currentIdx);
    setDirty(true);
  };

  const onDuplicate = () => {
    duplicateLayer(currentIdx);
    forceRender();
    setDirty(true);
  };

  const onAdd = () => {
    addLayer();
    forceRender();
    setDirty(true);
  };

  const onCreateGroup = () => {
    createGroup();
    forceRender();
    setDirty(true);
  };

  const onRemoveFromGroup = () => {
    removeLayerFromGroup(currentIdx);
    forceRender();
    setDirty(true);
  };

  const onMoveUp = () => {
    if (currentIdx >= layerCount - 1) return;
    moveLayer(currentIdx, currentIdx + 1);
    forceRender();
  };

  const onMoveDown = () => {
    if (currentIdx <= 0) return;
    moveLayer(currentIdx, currentIdx - 1);
    forceRender();
  };

  const onMoveTop = () => {
    if (currentIdx >= layerCount - 1) return;
    moveLayer(currentIdx, layerCount - 1);
    forceRender();
  };

  const onMoveBottom = () => {
    if (currentIdx <= 0) return;
    moveLayer(currentIdx, 0);
    forceRender();
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
          onToggleVisibility={() => { setLayerVisibility(flatIdx, !node.visible); forceRender(); }}
          onToggleLock={() => { setLayerLocked(flatIdx, !node.locked); }}
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
              onChange={(e) => { setLayerOpacity(currentIdx, Number(e.target.value) / 100); forceRender(); }}
              className="w-full h-3"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground block mb-0.5">Blend Mode</label>
            <select
              value={currentLayer.blendMode}
              onChange={(e) => { setLayerBlendMode(currentIdx, e.target.value as BlendMode); forceRender(); }}
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
