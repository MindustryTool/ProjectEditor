import { useCallback, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "#/components/ui/dialog";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { usePixelEditorStore } from "../store/pixel-editor-store";
import { useLayerStore } from "../store/layer-store";
import { CanvasState } from "../utils/canvas-state";
import { PixelCanvas } from "../utils/pixel-canvas";

const PRESETS = [
  { name: "16×16", w: 16, h: 16 },
  { name: "32×32", w: 32, h: 32 },
  { name: "64×64", w: 64, h: 64 },
  { name: "128×128", w: 128, h: 128 },
  { name: "256×256", w: 256, h: 256 },
  { name: "512×512", w: 512, h: 512 },
];

export function NewCanvasDialog() {
  const show = usePixelEditorStore((s) => s.showNewCanvasDialog);
  const setShow = usePixelEditorStore((s) => s.setShowNewCanvasDialog);
  const setCanvas = useLayerStore((s) => s.setCanvas);
  const [customW, setCustomW] = useState(64);
  const [customH, setCustomH] = useState(64);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createCanvas = useCallback(
    (w: number, h: number) => {
      const canvas = new PixelCanvas(w, h);
      setCanvas(canvas);
      setShow(false);
    },
    [setCanvas, setShow],
  );

  const handleFileImport = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const { decodePngToPixelData } = await import("../utils/png-codec");
      const buffer = await file.arrayBuffer();
      const result = await decodePngToPixelData(buffer);
      const { width, height, data } = result;
      const canvas = new PixelCanvas(width, height);
      canvas.layers[0]!.canvas = new CanvasState(width, height, data);
      setCanvas(canvas);
      setShow(false);
    },
    [setCanvas, setShow],
  );

  const handleClipboard = useCallback(async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((t) => t.startsWith("image/"));
        if (!imageType) continue;
        const blob = await item.getType(imageType);
        const buffer = await blob.arrayBuffer();
        const { decodePngToPixelData } = await import("../utils/png-codec");
        const result = await decodePngToPixelData(buffer);
        const { width, height, data } = result;
        const canvas = new PixelCanvas(width, height);
        canvas.layers[0]!.canvas = new CanvasState(width, height, data);
        setCanvas(canvas);
        setShow(false);
        return;
      }
    } catch {
      console.warn("Clipboard read failed or no image in clipboard");
    }
  }, [setCanvas, setShow]);

  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Canvas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Preset Sizes</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {PRESETS.map((p) => (
                <Button key={p.name} variant="outline" size="sm" onClick={() => createCanvas(p.w, p.h)}>
                  {p.name}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label>Custom Size</Label>
            <div className="flex gap-2 mt-1 items-center">
              <Input
                type="number"
                min={1}
                max={1024}
                value={customW}
                onChange={(e) => setCustomW(Number(e.target.value))}
                className="w-20"
              />
              <span>×</span>
              <Input
                type="number"
                min={1}
                max={1024}
                value={customH}
                onChange={(e) => setCustomH(Number(e.target.value))}
                className="w-20"
              />
              <Button size="sm" onClick={() => createCanvas(customW, customH)}>
                Create
              </Button>
            </div>
          </div>
          <div>
            <Label>From Image File</Label>
            <div className="mt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                className="hidden"
                onChange={handleFileImport}
              />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                Choose File
              </Button>
            </div>
          </div>
          <div>
            <Label>From Clipboard</Label>
            <div className="mt-1">
              <Button variant="outline" size="sm" onClick={handleClipboard}>
                Paste from Clipboard
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setShow(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
