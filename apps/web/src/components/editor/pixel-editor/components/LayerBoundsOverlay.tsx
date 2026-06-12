import { useEffect, useState } from "react";
import { Rect } from "react-konva";
import type { PixelCanvas } from "../utils/pixel-canvas";

interface LayerBoundsOverlayProps {
  canvas: PixelCanvas;
  width: number;
  height: number;
}

export function LayerBoundsOverlay({ canvas, width, height }: LayerBoundsOverlayProps) {
  const [bounds, setBounds] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const currentLayerId = canvas.currentLayerId;

  useEffect(() => {
    const layer = canvas.currentLayer;
    const pixels = layer.canvas.pixels;
    let minX = width, minY = height, maxX = 0, maxY = 0;
    let hasContent = false;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const p = pixels[y * width + x]!;
        if ((p >> 24) & 0xff) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
          hasContent = true;
        }
      }
    }
    if (hasContent) {
      setBounds({ x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 });
    } else {
      setBounds(null);
    }
  }, [canvas, width, height, currentLayerId]);

  if (!bounds) return null;
  return (
    <Rect
      x={bounds.x}
      y={bounds.y}
      width={bounds.w}
      height={bounds.h}
      stroke="#3b82f6"
      strokeWidth={1}
      dash={[4, 4]}
      listening={false}
      perfectDrawEnabled={false}
      strokeScaleEnabled={false}
    />
  );
}
