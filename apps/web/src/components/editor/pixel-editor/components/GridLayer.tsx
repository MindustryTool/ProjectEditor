import { Rect } from "react-konva";

interface GridLayerProps {
  width: number;
  height: number;
  scale: number;
}

export function GridLayer({ width, height, scale }: GridLayerProps) {
  const lines: React.ReactNode[] = [];
  const step = scale >= 8 ? 1 : Math.ceil(8 / scale);
  for (let x = 0; x <= width; x += step) {
    lines.push(
      <Rect
        key={`v${x}`}
        x={x}
        y={0}
        width={1 / scale}
        height={height}
        fill="rgba(0,0,0,0.15)"
        listening={false}
      />,
    );
  }
  for (let y = 0; y <= height; y += step) {
    lines.push(
      <Rect
        key={`h${y}`}
        x={0}
        y={y}
        width={width}
        height={1 / scale}
        fill="rgba(0,0,0,0.15)"
        listening={false}
      />,
    );
  }
  return <>{lines}</>;
}
