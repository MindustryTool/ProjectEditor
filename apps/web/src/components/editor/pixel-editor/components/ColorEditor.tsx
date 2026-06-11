import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ColorPicker, ColorPickerAlpha, ColorPickerFormat, ColorPickerHue, ColorPickerSelection } from "#/components/ui/color-picker";
import { Input } from "#/components/ui/input";
import { hexToRgb, rgbToHex, rgbToHsv, hsvToRgb, isValidHex } from "../utils/palette-utils";

interface ColorEditorProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorEditor({ value, onChange }: ColorEditorProps) {
  const [hexInput, setHexInput] = useState(value);
  const [r, setR] = useState(0);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);
  const [h, setH] = useState(0);
  const [s, setS] = useState(0);
  const [v, setV] = useState(0);
  const [hexError, setHexError] = useState(false);
  const [tab, setTab] = useState<"picker" | "sliders" | "wheel">("picker");

  useEffect(() => {
    setHexInput(value);
    const rgb = hexToRgb(value);
    setR(rgb.r);
    setG(rgb.g);
    setB(rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    setH(Math.round(hsv.h));
    setS(Math.round(hsv.s));
    setV(Math.round(hsv.v));
  }, [value]);

  const updateFromRgb = useCallback((rr: number, gg: number, bb: number) => {
    const cr = Math.max(0, Math.min(255, Math.round(rr)));
    const cg = Math.max(0, Math.min(255, Math.round(gg)));
    const cb = Math.max(0, Math.min(255, Math.round(bb)));
    setR(cr);
    setG(cg);
    setB(cb);
    const hex = rgbToHex(cr, cg, cb);
    setHexInput(hex);
    setHexError(false);
    onChange(hex);
    const hsv = rgbToHsv(cr, cg, cb);
    setH(Math.round(hsv.h));
    setS(Math.round(hsv.s));
    setV(Math.round(hsv.v));
  }, [onChange]);

  const updateFromHsv = useCallback((hh: number, ss: number, vv: number) => {
    const ch = ((hh % 360) + 360) % 360;
    const cs = Math.max(0, Math.min(100, ss));
    const cv = Math.max(0, Math.min(100, vv));
    setH(Math.round(ch));
    setS(Math.round(cs));
    setV(Math.round(cv));
    const rgb = hsvToRgb(ch, cs, cv);
    setR(rgb.r);
    setG(rgb.g);
    setB(rgb.b);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setHexInput(hex);
    setHexError(false);
    onChange(hex);
  }, [onChange]);

  const handleHexChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (isValidHex(val)) {
      setHexError(false);
      const rgb = hexToRgb(val);
      setR(rgb.r);
      setG(rgb.g);
      setB(rgb.b);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setH(Math.round(hsv.h));
      setS(Math.round(hsv.s));
      setV(Math.round(hsv.v));
      onChange(val.startsWith("#") ? val : "#" + val);
    } else {
      setHexError(true);
    }
  }, [onChange]);

  const handlePickerChange = useCallback((color: string) => {
    setHexInput(color);
    const rgb = hexToRgb(color);
    setR(rgb.r);
    setG(rgb.g);
    setB(rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    setH(Math.round(hsv.h));
    setS(Math.round(hsv.s));
    setV(Math.round(hsv.v));
    onChange(color);
  }, [onChange]);

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        <button className={`text-xs px-2 py-1 rounded ${tab === "picker" ? "bg-accent" : "hover:bg-accent"}`} onClick={() => setTab("picker")}>Picker</button>
        <button className={`text-xs px-2 py-1 rounded ${tab === "sliders" ? "bg-accent" : "hover:bg-accent"}`} onClick={() => setTab("sliders")}>Sliders</button>
        <button className={`text-xs px-2 py-1 rounded ${tab === "wheel" ? "bg-accent" : "hover:bg-accent"}`} onClick={() => setTab("wheel")}>Wheel</button>
      </div>

      {tab === "picker" && (
        <ColorPicker value={value} onChange={handlePickerChange}>
          <ColorPickerSelection className="h-40 rounded-lg" />
          <ColorPickerHue />
          <ColorPickerAlpha />
          <ColorPickerFormat />
        </ColorPicker>
      )}

      {tab === "wheel" && (
        <ColorWheelPicker value={value} onChange={handlePickerChange} />
      )}

      {tab === "sliders" && (
        <div className="space-y-2">
          <div className="space-y-1">
            <SliderRow label="R" value={r} min={0} max={255} onChange={(v) => updateFromRgb(v, g, b)} bg={`linear-gradient(90deg, #000, #f00)`} />
            <SliderRow label="G" value={g} min={0} max={255} onChange={(v) => updateFromRgb(r, v, b)} bg={`linear-gradient(90deg, #000, #0f0)`} />
            <SliderRow label="B" value={b} min={0} max={255} onChange={(v) => updateFromRgb(r, g, v)} bg={`linear-gradient(90deg, #000, #00f)`} />
          </div>
          <div className="border-t border-border pt-2 space-y-1">
            <SliderRow label="H" value={h} min={0} max={360} onChange={(v) => updateFromHsv(v, s, v)} bg={`linear-gradient(90deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)`} />
            <SliderRow label="S" value={s} min={0} max={100} onChange={(v) => updateFromHsv(h, v, v)} bg={`linear-gradient(90deg, #666, hsl(${h},100%,50%))`} />
            <SliderRow label="B" value={v} min={0} max={100} onChange={(v) => updateFromHsv(h, s, v)} bg={`linear-gradient(90deg, #000, hsl(${h},${s}%,50%))`} />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded border border-border shrink-0" style={{ backgroundColor: value }} />
        <Input
          className={`h-7 text-xs font-mono ${hexError ? "border-destructive" : ""}`}
          value={hexInput}
          onChange={handleHexChange}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

function SliderRow({ label, value, min, max, onChange, bg }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; bg: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono w-3 shrink-0 text-muted-foreground">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-3 rounded-full appearance-none cursor-pointer"
        style={{ background: bg }}
      />
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-12 h-6 text-xs text-right bg-secondary border border-border rounded px-1 font-mono"
      />
    </div>
  );
}

function ColorWheelPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState(false);
  const rgb = useMemo(() => hexToRgb(value), [value]);
  const hsv = useMemo(() => rgbToHsv(rgb.r, rgb.g, rgb.b), [rgb]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cx = 80, cy = 80, r = 75;
    ctx.clearRect(0, 0, 160, 160);
    for (let y = 0; y < 160; y++) {
      for (let x = 0; x < 160; x++) {
        const dx = x - cx, dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > r) continue;
        const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360 + 90) % 360;
        const sat = dist / r;
        const img = ctx.createImageData(1, 1);
        const rgb2 = hsvToRgb(angle, sat * 100, 100);
        img.data[0] = rgb2.r;
        img.data[1] = rgb2.g;
        img.data[2] = rgb2.b;
        img.data[3] = 255;
        ctx.putImageData(img, x, y);
      }
    }
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setDragging(true);
    handleWheelPick(e, canvasRef.current, onChange);
  }, [onChange]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    handleWheelPick(e, canvasRef.current, onChange);
  }, [dragging, onChange]);

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  const angle = hsv.h;
  const wheelR = 10;
  const wheelCx = 80 + Math.sin(angle * Math.PI / 180) * (hsv.s / 100) * 75;
  const wheelCy = 80 - Math.cos(angle * Math.PI / 180) * (hsv.s / 100) * 75;

  return (
    <div className="flex justify-center">
      <div className="relative" style={{ width: 160, height: 160 }}>
        <canvas
          ref={canvasRef}
          width={160}
          height={160}
          className="rounded-full cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        <div
          className="absolute pointer-events-none rounded-full border-2 border-white"
          style={{
            width: wheelR * 2,
            height: wheelR * 2,
            left: wheelCx - wheelR,
            top: wheelCy - wheelR,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.5)",
          }}
        />
      </div>
    </div>
  );
}

function handleWheelPick(e: React.PointerEvent, canvas: HTMLCanvasElement | null, onChange: (c: string) => void) {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const cx = 80, cy = 80;
  const dx = x - cx, dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > 75) return;
  const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360 + 90) % 360;
  const sat = Math.min(1, dist / 75);
  const getHsv = () => {
    const ctx2 = canvas.getContext("2d");
    if (ctx2) {
      const p = ctx2.getImageData(Math.round(x), Math.round(y), 1, 1).data;
      if (p[3] > 0) return rgbToHex(p[0]!, p[1]!, p[2]!);
    }
    return null;
  };
  const hex = getHsv();
  if (hex) onChange(hex);
}
