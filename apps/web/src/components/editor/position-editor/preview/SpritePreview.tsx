import { ImageFilePreview } from "#/components/editor/ImageFilePreview";
import type { SpritePositionData } from "@project/schema";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import type { PositionEditHandler } from "./PositionPreview";

export function SpritePreview({
	sprite,
	onPositionChange,
	hidden,
	onToggleVisibility,
}: {
	sprite: SpritePositionData;
	onPositionChange?: PositionEditHandler;
	hidden?: boolean;
	onToggleVisibility?: () => void;
}) {
	const [size, setSize] = useState([0, 0]);
	const handleSize = useCallback((width: number, height: number) => setSize([width, height]), []);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	const scrollTo = (id: string) =>
		requestAnimationFrame(() => {
			let current = "";
			for (const segment of id.split(".")) {
				current += segment;
				const element = document.getElementById(current);
				if (element) {
					element.scrollIntoView({ behavior: "smooth" });
					element.focus();
				}
				current += ".";
			}
		});

	const [editX, setEditX] = useState(String(sprite.position.x.value));
	const [editY, setEditY] = useState(String(sprite.position.y.value));

	useEffect(() => {
		setEditX(String(sprite.position.x.value));
		setEditY(String(sprite.position.y.value));
	}, [sprite.position.x.value, sprite.position.y.value]);

	const debouncedCommit = useCallback(
		(xVal: number, yVal: number) => {
			clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => {
				onPositionChange?.(sprite.position.x.path, sprite.position.y.path, xVal, yVal);
			}, 200);
		},
		[onPositionChange, sprite.position.x.path, sprite.position.y.path],
	);

	const commitX = useCallback(() => {
		clearTimeout(debounceRef.current);
		const val = Number(editX);
		if (!isNaN(val)) {
			onPositionChange?.(sprite.position.x.path, sprite.position.y.path, val, sprite.position.y.value);
		}
	}, [editX, onPositionChange, sprite.position.x.path, sprite.position.y.path, sprite.position.y.value]);

	const commitY = useCallback(() => {
		clearTimeout(debounceRef.current);
		const val = Number(editY);
		if (!isNaN(val)) {
			onPositionChange?.(sprite.position.x.path, sprite.position.y.path, sprite.position.x.value, val);
		}
	}, [editY, onPositionChange, sprite.position.x.path, sprite.position.y.path, sprite.position.x.value]);

	const handleChangeX = useCallback(
		(value: string) => {
			setEditX(value);
			const val = Number(value);
			if (!isNaN(val)) {
				debouncedCommit(val, sprite.position.y.value);
			}
		},
		[debouncedCommit, sprite.position.y.value],
	);

	const handleChangeY = useCallback(
		(value: string) => {
			setEditY(value);
			const val = Number(value);
			if (!isNaN(val)) {
				debouncedCommit(sprite.position.x.value, val);
			}
		},
		[debouncedCommit, sprite.position.x.value],
	);

	return (
		<div
			className={`w-full border rounded bg-card ${hidden ? "opacity-40" : ""}`}
		>
			<div className="relative flex items-center justify-center p-8" onClick={() => scrollTo(sprite.position.x.path)}>
				<span className="absolute top-1 left-1 text-xs text-muted-foreground">
					[{sprite.type}] {sprite.name} ({size[0]}x{size[1]})
				</span>
				{sprite.mirror && (
					<span className="absolute top-1 right-8 text-xs text-muted-foreground">mirror</span>
				)}
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-0 right-0 h-6 w-6"
					onClick={(e) => { e.stopPropagation(); onToggleVisibility?.(); }}
				>
					{hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
				</Button>
				<ImageFilePreview className="object-contain" path={sprite.path} onSize={handleSize} />
			</div>
			<div className="border-t p-1.5 text-xs text-muted-foreground flex flex-col gap-1">
				<div className="flex items-center gap-1">
					<span className="shrink-0 w-3 text-right">x</span>
					<Input
						type="number"
						className="flex-1"
						value={editX}
						onChange={(e) => handleChangeX(e.target.value)}
						onBlur={commitX}
						onKeyDown={(e) => {
							if (e.key === "Enter") commitX();
							if (e.key === "Escape") setEditX(String(sprite.position.x.value));
						}}
						onClick={(e) => e.stopPropagation()}
					/>
				</div>
				<div className="flex items-center gap-1">
					<span className="shrink-0 w-3 text-right">y</span>
					<Input
						type="number"
						className="flex-1"
						value={editY}
						onChange={(e) => handleChangeY(e.target.value)}
						onBlur={commitY}
						onKeyDown={(e) => {
							if (e.key === "Enter") commitY();
							if (e.key === "Escape") setEditY(String(sprite.position.y.value));
						}}
						onClick={(e) => e.stopPropagation()}
					/>
				</div>
			</div>
		</div>
	);
}
