import { Rect } from "react-konva";

interface SelectionOverlayProps {
  bounds: { x: number; y: number; w: number; h: number };
  width: number;
  height: number;
  dashOffset: number;
}

export function SelectionOverlay({ bounds, dashOffset }: SelectionOverlayProps) {
  return (
    <>
      <Rect
        x={bounds.x}
        y={bounds.y}
        width={bounds.w}
        height={bounds.h}
        stroke="#ffffff"
        strokeWidth={1}
        dash={[4, 4]}
        dashOffset={-dashOffset}
        listening={false}
        perfectDrawEnabled={false}
        strokeScaleEnabled={false}
      />
      <Rect
        x={bounds.x}
        y={bounds.y}
        width={bounds.w}
        height={bounds.h}
        stroke="#000000"
        strokeWidth={1}
        dash={[4, 4]}
        dashOffset={-dashOffset + 4}
        listening={false}
        perfectDrawEnabled={false}
        strokeScaleEnabled={false}
      />
    </>
  );
}
