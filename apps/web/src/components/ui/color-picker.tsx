"use client";

import Color from "color";
import { Slider } from "radix-ui";
import {
	type ComponentProps,
	createContext,
	type HTMLAttributes,
	memo,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { cn } from "~/lib/utils";

interface Ctx {
	hue: number;
	saturation: number;
	lightness: number;
	alpha: number;
	mode: string;
	setHue: (h: number) => void;
	setSaturation: (s: number) => void;
	setLightness: (l: number) => void;
	setAlpha: (a: number) => void;
	setMode: (m: string) => void;
}

const Ctx = createContext<Ctx | null>(null);
function useCtx() {
	const c = useContext(Ctx);
	if (!c) throw new Error("missing provider");
	return c;
}

export type ColorPickerProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
};

export const ColorPicker = ({ value, defaultValue = "#000000", onChange, className, ...props }: ColorPickerProps) => {
	const safe = useCallback((v?: string) => {
		try {
			v = v || "#ffffff";
			v = v.startsWith("#") ? v : "#" + v;
			return Color(v);
		} catch {
			return Color("#ffffff");
		}
	}, []);

	const [hue, setHueState] = useState(() => safe(value || defaultValue).hue() || 0);
	const [saturation, setSaturationState] = useState(() => safe(value || defaultValue).saturationl() || 100);
	const [lightness, setLightnessState] = useState(() => safe(value || defaultValue).lightness() || 50);
	const [alpha, setAlphaState] = useState(() => safe(value || defaultValue).alpha() * 100 || 100);
	const [mode, setMode] = useState("hex");

	const hueRef = useRef(hue);
	hueRef.current = hue;
	const saturationRef = useRef(saturation);
	saturationRef.current = saturation;
	const lightnessRef = useRef(lightness);
	lightnessRef.current = lightness;
	const alphaRef = useRef(alpha);
	alphaRef.current = alpha;
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;
	const isControlled = value !== undefined;

	useEffect(() => {
		if (value) {
			const c = safe(value);
			setHueState(c.hue() || 0);
			setSaturationState(c.saturationl() || 100);
			setLightnessState(c.lightness() || 50);
			setAlphaState(c.alpha() * 100 || 100);
		}
	}, [value, safe]);

	const sync = useCallback((h: number, s: number, l: number, a: number) => {
		const cb = onChangeRef.current;
		if (cb) {
			const c = Color.hsl(h, s, l).alpha(a / 100);
			cb(c.alpha() < 1 ? c.hexa() : c.hex());
		}
	}, []);

	const setHue = useCallback(
		(h: number) => {
			if (!isControlled) setHueState(h);
			sync(h, saturationRef.current, lightnessRef.current, alphaRef.current);
		},
		[isControlled, sync],
	);

	const setSaturation = useCallback(
		(s: number) => {
			if (!isControlled) setSaturationState(s);
			sync(hueRef.current, s, lightnessRef.current, alphaRef.current);
		},
		[isControlled, sync],
	);

	const setLightness = useCallback(
		(l: number) => {
			if (!isControlled) setLightnessState(l);
			sync(hueRef.current, saturationRef.current, l, alphaRef.current);
		},
		[isControlled, sync],
	);

	const setAlpha = useCallback(
		(a: number) => {
			if (!isControlled) setAlphaState(a);
			sync(hueRef.current, saturationRef.current, lightnessRef.current, a);
		},
		[isControlled, sync],
	);

	const ctx = useMemo(
		() => ({
			hue,
			saturation,
			lightness,
			alpha,
			mode,
			setHue,
			setSaturation,
			setLightness,
			setAlpha,
			setMode,
		}),
		[hue, saturation, lightness, alpha, mode, setHue, setSaturation, setLightness, setAlpha, setMode],
	);

	return (
		<Ctx.Provider value={ctx}>
			<div className={cn("flex size-full flex-col gap-4", className)} {...props} />
		</Ctx.Provider>
	);
};

export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerSelection = memo(({ className, ...props }: ColorPickerSelectionProps) => {
	const { hue, setSaturation, setLightness } = useCtx();
	const containerRef = useRef<HTMLDivElement>(null);
	const [dragging, setDragging] = useState(false);
	const [px, setPx] = useState(0);
	const [py, setPy] = useState(0);

	const bg = useMemo(() => `linear-gradient(0deg,#000,transparent),linear-gradient(90deg,#fff,transparent),hsl(${hue},100%,50%)`, [hue]);

	const onMove = useCallback(
		(e: PointerEvent) => {
			if (!containerRef.current) return;
			const r = containerRef.current.getBoundingClientRect();
			const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
			const y = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
			setPx(x);
			setPy(y);
			setSaturation(x * 100);
			const topL = x < 0.01 ? 100 : 50 + 50 * (1 - x);
			setLightness(topL * (1 - y));
		},
		[setSaturation, setLightness],
	);

	useEffect(() => {
		const up = () => setDragging(false);
		if (dragging) {
			window.addEventListener("pointermove", onMove);
			window.addEventListener("pointerup", up);
			window.addEventListener("pointercancel", up);
		}
		return () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", up);
			window.removeEventListener("pointercancel", up);
		};
	}, [dragging, onMove]);

	return (
		<div
			className={cn("relative size-full cursor-crosshair rounded", className)}
			ref={containerRef}
			style={{ background: bg }}
			onPointerDown={(e) => {
				e.preventDefault();
				setDragging(true);
				onMove(e.nativeEvent);
			}}
			{...props}
		>
			<div
				className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute h-4 w-4 rounded-full border-2 border-white"
				style={{ left: `${px * 100}%`, top: `${py * 100}%`, boxShadow: "0 0 0 1px rgba(0,0,0,0.5)" }}
			/>
		</div>
	);
});
ColorPickerSelection.displayName = "ColorPickerSelection";

export type ColorPickerHueProps = ComponentProps<typeof Slider.Root>;

export const ColorPickerHue = ({ className, ...props }: ColorPickerHueProps) => {
	const { hue, setHue } = useCtx();
	const onValueChange = useCallback((vals: number[]) => setHue(vals[0] ?? 0), [setHue]);
	const val = useMemo(() => [hue], [hue]);

	return (
		<Slider.Root
			className={cn("relative flex h-4 w-full touch-none", className)}
			max={360}
			onValueChange={onValueChange}
			step={1}
			value={val}
			{...props}
		>
			<Slider.Track className="relative my-0.5 h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]">
				<Slider.Range className="absolute h-full" />
			</Slider.Track>
			<Slider.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
		</Slider.Root>
	);
};

export type ColorPickerAlphaProps = ComponentProps<typeof Slider.Root>;

export const ColorPickerAlpha = ({ className, ...props }: ColorPickerAlphaProps) => {
	const { hue, saturation, lightness, alpha, setAlpha } = useCtx();
	const onValueChange = useCallback((vals: number[]) => setAlpha(vals[0] ?? 100), [setAlpha]);
	const val = useMemo(() => [alpha], [alpha]);
	const alphaBg = useMemo(() => {
		return `linear-gradient(to right, transparent, hsl(${hue}, ${saturation}%, ${lightness}%))`;
	}, [hue, saturation, lightness]);

	return (
		<Slider.Root
			className={cn("relative flex h-4 w-full touch-none", className)}
			max={100}
			onValueChange={onValueChange}
			step={1}
			value={val}
			{...props}
		>
			<Slider.Track
				className="relative my-0.5 h-3 w-full grow rounded-full"
				style={{
					background: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center, ${alphaBg}`,
				}}
			>
				<Slider.Range className="absolute h-full rounded-full bg-transparent" />
			</Slider.Track>
			<Slider.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
		</Slider.Root>
	);
};

export type ColorPickerOutputProps = ComponentProps<typeof SelectTrigger>;

const formats = ["hex", "rgb", "css", "hsl"];

export const ColorPickerOutput = ({ className: _cn, ...props }: ColorPickerOutputProps) => {
	const { mode, setMode } = useCtx();
	return (
		<Select onValueChange={setMode} value={mode}>
			<SelectTrigger className="h-8 w-20 shrink-0 text-xs" {...props}>
				<SelectValue placeholder="Mode" />
			</SelectTrigger>
			<SelectContent>
				{formats.map((f) => (
					<SelectItem className="text-xs" key={f} value={f}>
						{f.toUpperCase()}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

const PercentInput = ({ className, ...props }: ComponentProps<typeof Input>) => (
	<div className="relative">
		<Input readOnly type="text" {...props} className={cn("h-8 w-13 rounded-l-none bg-secondary px-2 text-xs shadow-none", className)} />
		<span className="-translate-y-1/2 absolute top-1/2 right-2 text-muted-foreground text-xs">%</span>
	</div>
);

export type ColorPickerFormatProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerFormat = ({ className, ...props }: ColorPickerFormatProps) => {
	const { hue, saturation, lightness, alpha, mode } = useCtx();
	const c = Color.hsl(hue, saturation, lightness, alpha / 100);

	if (mode === "hex") {
		return (
			<div className={cn("-space-x-px relative flex w-full items-center rounded-md shadow-sm", className)} {...props}>
				<Input className="h-8 rounded-r-none bg-secondary px-2 text-xs shadow-none" readOnly type="text" value={c.hex()} />
				<PercentInput value={alpha} />
			</div>
		);
	}

	if (mode === "rgb") {
		const rgb = c.rgb().array().map(Math.round);
		return (
			<div className={cn("-space-x-px flex items-center rounded-md shadow-sm", className)} {...props}>
				{rgb.map((v, i) => (
					<Input
						className={cn("h-8 rounded-r-none bg-secondary px-2 text-xs shadow-none", i && "rounded-l-none")}
						key={i}
						readOnly
						type="text"
						value={v}
					/>
				))}
				<PercentInput value={alpha} />
			</div>
		);
	}

	if (mode === "css") {
		const rgb = c.rgb().array().map(Math.round);
		return (
			<div className={cn("w-full rounded-md shadow-sm", className)} {...props}>
				<Input
					className="h-8 w-full bg-secondary px-2 text-xs shadow-none"
					readOnly
					type="text"
					value={`rgba(${rgb.join(", ")}, ${alpha}%)`}
				/>
			</div>
		);
	}

	if (mode === "hsl") {
		const hsl = c.hsl().array().map(Math.round);
		return (
			<div className={cn("-space-x-px flex items-center rounded-md shadow-sm", className)} {...props}>
				{hsl.map((v, i) => (
					<Input
						className={cn("h-8 rounded-r-none bg-secondary px-2 text-xs shadow-none", i && "rounded-l-none")}
						key={i}
						readOnly
						type="text"
						value={v}
					/>
				))}
				<PercentInput value={alpha} />
			</div>
		);
	}

	return null;
};
