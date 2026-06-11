import { useCallback, useEffect } from "react";
import { useFile } from "@project/core";
import { useLayerStore } from "../store/layer-store";
import { usePixelEditorStore } from "../store/pixel-editor-store";
import { useHistoryStore } from "../store/history-store";
import { encodePixelDataToPng } from "../utils/png-codec";
import { serializeMeta, getMetaPath } from "../utils/pixel-meta";

export function useSavePixel(path: string | null) {
  const { write } = useFile(path ?? "");
  const metaPath = path ? getMetaPath(path) : "";
  const { write: writeMeta } = useFile(metaPath);
  const canvas = useLayerStore((s) => s.canvas);
  const document = useLayerStore((s) => s.document);
  const setDirty = usePixelEditorStore((s) => s.setDirty);

  const saveMeta = useCallback(async () => {
    if (!canvas || !path) return;
    const editorState = usePixelEditorStore.getState();
    const historyState = useHistoryStore.getState();
    const metaJson = serializeMeta(
      canvas.serialize(),
      {
        undoStack: historyState.undoStack.map((cmd) => ({
          name: cmd.name,
          snapshot: canvas.serialize(),
        })),
        redoStack: historyState.redoStack.map((cmd) => ({
          name: cmd.name,
          snapshot: canvas.serialize(),
        })),
      },
      {
        foregroundColor: editorState.foregroundColor,
        backgroundColor: editorState.backgroundColor,
        tool: editorState.tool,
        brushSize: editorState.brushSize,
        brushOpacity: editorState.brushOpacity,
        tolerance: editorState.tolerance,
        sprayDensity: editorState.sprayDensity,
        sprayRadius: editorState.sprayRadius,
        pixelPerfect: editorState.pixelPerfect,
        symmetry: editorState.symmetry,
        symmetrySegments: editorState.symmetrySegments,
        gridVisible: editorState.gridVisible,
        pixelGridVisible: editorState.pixelGridVisible,
        rulersVisible: editorState.rulersVisible,
        guidesVisible: editorState.guidesVisible,
        layerBoundsVisible: editorState.layerBoundsVisible,
        onionSkinVisible: editorState.onionSkinVisible,
        checkerboardVisible: editorState.checkerboardVisible,
        currentLayerIndex: canvas.currentLayerIndex,
        currentLayerId: canvas.currentLayerId,
        palette: editorState.palette,
        lockedColors: editorState.lockedColors,
      },
    );
    const encoder = new TextEncoder();
    writeMeta(encoder.encode(metaJson));
  }, [canvas, path, writeMeta]);

  const save = useCallback(async () => {
    if (!canvas || !path) return;
    const composite = canvas.getCompositeData();
    const buffer = await encodePixelDataToPng(composite, canvas.width, canvas.height);
    write(buffer);
    await saveMeta();
    document?.markClean();
    setDirty(false);
    document?.createVersionSnapshot("Manual save");
  }, [canvas, path, write, saveMeta, setDirty, document]);

  const exportPng = useCallback(async () => {
    if (!canvas) return;
    const composite = canvas.getCompositeData();
    const buffer = await encodePixelDataToPng(composite, canvas.width, canvas.height);
    const blob = new Blob([buffer], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pixel-art.png";
    a.click();
    URL.revokeObjectURL(url);
  }, [canvas]);

  const saveAs = useCallback(async () => {
    if (!canvas) return;
    const composite = canvas.getCompositeData();
    const buffer = await encodePixelDataToPng(composite, canvas.width, canvas.height);
    const blob = new Blob([buffer], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pixel-art.png";
    a.click();
    URL.revokeObjectURL(url);
  }, [canvas]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [save]);

  return { save, saveAs, exportPng };
}
