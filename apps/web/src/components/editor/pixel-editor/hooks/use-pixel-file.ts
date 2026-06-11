import { useCallback } from "react";
import { useFile } from "@project/core";
import { decodePngToPixelData, encodePixelDataToPng } from "../utils/png-codec";
import { useLayerStore } from "../store/layer-store";
import { PixelCanvas } from "../utils/pixel-canvas";

export function usePixelFile(path: string) {
  const { data, isLoading, write } = useFile(path);
  const setCanvas = useLayerStore((s) => s.setCanvas);

  const loadFromFile = useCallback(async () => {
    if (!data) return;
    try {
      const d = data!;
      const result = await decodePngToPixelData(d);
      const { width, height, data: pixelData } = result;
      const canvas = new PixelCanvas(width, height);
      canvas.layers[0]!.data = pixelData;
      setCanvas(canvas);
    } catch (e) {
      console.error("Failed to decode PNG:", e);
    }
  }, [data, setCanvas]);

  const saveToFile = useCallback(
    async (canvas: PixelCanvas) => {
      const composite = canvas.getCompositeData();
      const buffer = await encodePixelDataToPng(composite, canvas.width, canvas.height);
      write(buffer);
    },
    [write],
  );

  return { isLoading, loadFromFile, saveToFile };
}
