import { Rect } from "react-konva";

interface PixelGridLayerProps {
  width: number;
  height: number;
  scale: number;
}

export function PixelGridLayer({ width, height, scale }: PixelGridLayerProps) {
  const lines: React.ReactNode[] = [];
  for (let x = 1; x < width; x++) {
    lines.push(
      <Rect
        key={`pgv${x}`}
        x={x}
        y={0}
        width={1 / scale}
        height={height}
        fill="rgba(0,0,0,0.08)"
        listening={false}
      />,
    );
  }
  for (let y = 1; y < height; y++) {
    lines.push(
      <Rect
        key={`pgh${y}`}
        x={0}
        y={y}
        width={width}
        height={1 / scale}
        fill="rgba(0,0,0,0.08)"
        listening={false}
      />,
    );
  }
  return <>{lines}</>;
}
