import { ZoomIn, ZoomOut } from "lucide-react";

interface ZoomControlsProps {
  scale: number;
  zoomIn: () => void;
  zoomOut: () => void;
}

export function ZoomControls({ scale, zoomIn, zoomOut }: ZoomControlsProps) {
  return (
    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-card/90 backdrop-blur-sm border p-1 text-xs">
      <button
        className="rounded p-1 hover:bg-accent"
        onClick={zoomIn}
        title="Zoom In"
      >
        <ZoomIn className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-12 text-center font-mono">
        {Math.round(scale * 100)}%
      </span>
      <button
        className="rounded p-1 hover:bg-accent"
        onClick={zoomOut}
        title="Zoom Out"
      >
        <ZoomOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
