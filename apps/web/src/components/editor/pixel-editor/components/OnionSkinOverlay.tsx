import { useEffect, useState } from "react";
import { Image as KonvaImage } from "react-konva";
import type { PixelCanvas } from "../utils/pixel-canvas";

interface OnionSkinOverlayProps {
  canvas: PixelCanvas;
  width: number;
  height: number;
}

export function OnionSkinOverlay({ canvas, width, height }: OnionSkinOverlayProps) {
  const [onionImage, setOnionImage] = useState<HTMLCanvasElement | null>(null);
  const currentLayerId = canvas.currentLayerId;

  useEffect(() => {
    const currentFlatIndex = canvas.flatIndexOf(currentLayerId);
    if (currentFlatIndex <= 0) {
      setOnionImage(null);
      return;
    }
    const cvs = document.createElement("canvas");
    cvs.width = width;
    cvs.height = height;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const composite = new Uint8ClampedArray(width * height * 4);
    const flatLayers = canvas.flatList();
    for (let i = 0; i < currentFlatIndex; i++) {
      const l = flatLayers[i]!;
      if (!l.visible) continue;
      const px = l.canvas.pixels;
      for (let j = 0; j < px.length; j++) {
        const p = px[j]!;
        const srcA = ((p >> 24) & 0xff) / 255 * 0.3;
        if (srcA === 0) continue;
        const di = j * 4;
        composite[di] = (p & 0xff) * srcA + composite[di]! * (1 - srcA);
        composite[di + 1] = ((p >> 8) & 0xff) * srcA + composite[di + 1]! * (1 - srcA);
        composite[di + 2] = ((p >> 16) & 0xff) * srcA + composite[di + 2]! * (1 - srcA);
        composite[di + 3] = Math.min(255, composite[di + 3]! + ((p >> 24) & 0xff) * 0.3);
      }
    }
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(composite);
    ctx.putImageData(imageData, 0, 0);
    setOnionImage(cvs);
  }, [canvas, width, height, currentLayerId]);

  if (!onionImage) return null;
  return <KonvaImage image={onionImage} x={0} y={0} listening={false} opacity={0.4} />;
}
