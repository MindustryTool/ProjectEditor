import { useMemo } from "react";
import { Group, Rect } from "react-konva";
import { getTransformHandles } from "../utils/transform-tools";

interface TransformHandlesProps {
  bounds: { x: number; y: number; w: number; h: number };
}

export function TransformHandles({ bounds }: TransformHandlesProps) {
  const { corners, edges } = useMemo(() => getTransformHandles(bounds), [bounds]);
  const handleSize = 6;

  return (
    <Group listening={false}>
      {corners.map(([hx, hy], i) => (
        <Rect
          key={`corner-${i}`}
          x={hx - handleSize / 2}
          y={hy - handleSize / 2}
          width={handleSize}
          height={handleSize}
          fill="white"
          stroke="#3b82f6"
          strokeWidth={1.5}
          listening={false}
          perfectDrawEnabled={false}
          strokeScaleEnabled={false}
        />
      ))}
      {edges.map(([hx, hy], i) => (
        <Rect
          key={`edge-${i}`}
          x={hx - handleSize / 2}
          y={hy - handleSize / 2}
          width={handleSize}
          height={handleSize}
          fill="white"
          stroke="#3b82f6"
          strokeWidth={1}
          listening={false}
          perfectDrawEnabled={false}
          strokeScaleEnabled={false}
        />
      ))}
    </Group>
  );
}
