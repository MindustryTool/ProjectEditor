import { useCallback, useEffect } from "react";
import { useFile } from "@project/core";
import { useLayerStore } from "../store/layer-store";
import { usePixelEditorStore } from "../store/pixel-editor-store";
import { encodePixelDataToPng } from "../utils/png-codec";
import { serializeMeta, getMetaPath } from "../utils/pixel-meta";

function getCompositeUint32(c: { width: number; height: number; getCompositeData(): Uint8ClampedArray }): Uint32Array {
  const uint8 = c.getCompositeData();
  const uint32 = new Uint32Array(c.width * c.height);
  for (let i = 0; i < uint32.length; i++) {
    uint32[i] = (uint8[i * 4 + 3]! << 24) | (uint8[i * 4 + 2]! << 16) | (uint8[i * 4 + 1]! << 8) | uint8[i * 4]!;
  }
  return uint32;
}

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
     const metaJson = serializeMeta(
       canvas.serialize(),
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
       },
     );
     const encoder = new TextEncoder();
     writeMeta(encoder.encode(metaJson).buffer);
   }, [canvas, path, writeMeta]);

   const save = useCallback(async () => {
     if (!canvas || !path) return;
     const composite = getCompositeUint32(canvas);
     const buffer = await encodePixelDataToPng(composite, canvas.width, canvas.height);
     write(buffer);
     await saveMeta();
     document?.markClean();
     setDirty(false);
   }, [canvas, path, write, saveMeta, setDirty, document]);

  const exportPng = useCallback(async () => {
    if (!canvas) return;
    const composite = getCompositeUint32(canvas);
    const buffer = await encodePixelDataToPng(composite, canvas.width, canvas.height);
    const blob = new Blob([buffer], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    const a = globalThis.document.createElement("a");
    a.href = url;
    a.download = "pixel-art.png";
    a.click();
    URL.revokeObjectURL(url);
  }, [canvas]);

  const saveAs = useCallback(async () => {
    if (!canvas) return;
    const composite = getCompositeUint32(canvas);
    const buffer = await encodePixelDataToPng(composite, canvas.width, canvas.height);
    const blob = new Blob([buffer], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    const a = globalThis.document.createElement("a");
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
