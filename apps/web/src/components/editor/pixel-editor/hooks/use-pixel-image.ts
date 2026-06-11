import { useCallback, useRef, useState } from "react";

export function usePixelImage(width: number, height: number) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const [version, setVersion] = useState(0);

  const getCanvas = useCallback(() => {
    if (!canvasRef.current || canvasRef.current.width !== width || canvasRef.current.height !== height) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.imageSmoothingEnabled = false;
      canvasRef.current = canvas;
      imageDataRef.current = ctx?.createImageData(width, height) ?? null;
    }
    return canvasRef.current!;
  }, [width, height]);

  const updatePixels = useCallback(
    (data: Uint8ClampedArray) => {
      const canvas = getCanvas();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      let imageData = imageDataRef.current;
      if (!imageData || imageData.width !== width || imageData.height !== height) {
        imageData = ctx.createImageData(width, height);
        imageDataRef.current = imageData;
      }
      imageData.data.set(data);
      ctx.putImageData(imageData, 0, 0);
      setVersion((v) => v + 1);
    },
    [getCanvas, width, height],
  );

  const updateRegion = useCallback(
    (data: Uint8ClampedArray, x: number, y: number, w: number, h: number) => {
      const canvas = getCanvas();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.putImageData(new ImageData(data as Uint8ClampedArray<ArrayBuffer>, w, h), x, y);
    },
    [getCanvas],
  );

  const dispose = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.width = 0;
      canvasRef.current.height = 0;
      canvasRef.current = null;
    }
    imageDataRef.current = null;
  }, []);

  return { getCanvas, updatePixels, updateRegion, version, dispose };
}
